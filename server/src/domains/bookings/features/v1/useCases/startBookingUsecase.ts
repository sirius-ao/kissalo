import PrismaService from '@infra/database/prisma.service';
import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { NotificationType } from '@prisma/client';

export class StartBookingUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifier: NotificationFactory,
  ) {}

  async execute(bookingId: number, userId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        client: true,
        professional: {
          include: {
            user: true,
          },
        },
        service: true,
        payment: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    if (booking.status !== 'CONFIRMED') {
      throw new BadRequestException(
        'O serviço só pode ser iniciado após aceitação',
      );
    }

    if (!booking.professional) {
      throw new BadRequestException(
        'Agendamento não possui profissional associado',
      );
    }

    if (booking.professional.userId !== userId) {
      throw new ForbiddenException(
        'Apenas o profissional pode iniciar o serviço',
      );
    }

    if (booking?.payment?.status !== 'PAID') {
      throw new BadRequestException(
        'Aguarde o pagamento para poder começar o serviço',
      );
    }
    const now = new Date();
    if (now < booking.startTime) {
      throw new BadRequestException(
        'O serviço só pode ser iniciado no horário agendado',
      );
    }

    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'STARTED',
      },
    });

    const PushNotifier = this.notifier.send('PUSH');
    const EmailNotifier = this.notifier.send('EMAIL');

    const professionalName =
      booking.professional?.user.firstName +
      ' ' +
      booking.professional?.user.lastName;

    const clientNotification = {
      title: 'Serviço iniciado',
      message: `O serviço "${booking.service.title}" foi iniciado pelo profissional ${professionalName}.`,
      type: 'BOOKING' as NotificationType,
      isRead: false,
      userId: booking.clientId,
      createdAt: new Date(),
      deepLink: `/bookings/${booking.id}`,
    };

    const adminNotification = {
      title: 'Serviço iniciado',
      message: `O serviço "${booking.service.title}" (Agendamento #${booking.id}) foi iniciado pelo profissional ${professionalName}.`,
      type: 'SYSTEM' as NotificationType,
      isRead: false,
      createdAt: new Date(),
      deepLink: `/admin/bookings/${booking.id}`,
    };

    const admins = await this.prisma.user.findMany({
      where: { role: 'ADMIN' },
    });

    await Promise.all([
      PushNotifier.send(clientNotification, booking.client),
      EmailNotifier.send(clientNotification, booking.client),

      ...admins.map((admin) =>
        Promise.all([
          PushNotifier.send({ ...adminNotification, userId: admin.id }, admin),
          EmailNotifier.send({ ...adminNotification, userId: admin.id }, admin),
        ]),
      ),
    ]);
    return {
      updated: true,
    };
  }
}
