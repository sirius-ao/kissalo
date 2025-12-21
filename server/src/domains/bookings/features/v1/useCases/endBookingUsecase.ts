import PrismaService from '@infra/database/prisma.service';
import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { NotificationType } from '@prisma/client';

export class EndBookingUseCase {
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

    if (booking.status !== 'STARTED') {
      throw new BadRequestException(
        'O serviço só pode ser finalizado após a execução',
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
    if (now < booking.endTime) {
      throw new BadRequestException(
        'O serviço só pode ser finalizado no horário agendado',
      );
    }
    if (!booking.canEnd) {
      throw new ForbiddenException({
        message: 'O cliente precisa liberar o acesso  para terminares',
      });
    }

    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'COMPLETED',
      },
    });

    const PushNotifier = this.notifier.send('PUSH');
    const EmailNotifier = this.notifier.send('EMAIL');

    const professionalName =
      booking.professional?.user.firstName +
      ' ' +
      booking.professional?.user.lastName;

    const clientNotification = {
      title: 'Serviço finalizado',
      message: `O serviço "${booking.service.title}" foi finalizado pelo profissional ${professionalName}.`,
      type: 'BOOKING' as NotificationType,
      isRead: false,
      userId: booking.clientId,
      createdAt: new Date(),
      deepLink: `/bookings/${booking.id}`,
    };
    const adminNotification = {
      title: 'Serviço finalizado',
      message: `O serviço "${booking.service.title}" (Agendamento #${booking.id}) foi finalizado pelo profissional ${professionalName}.`,
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
      this.prisma.user.update({
        where: {
          id: booking.clientId,
        },
        data: {
          amountAvaliable: {
            decrement: booking.payment.amount,
          },
        },
      }),
    ]);
    return {
      updated: true,
    };
  }
}
