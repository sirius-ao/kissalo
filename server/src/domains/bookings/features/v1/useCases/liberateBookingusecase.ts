import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';
import PrismaService from '@infra/database/prisma.service';
import {
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { NotificationType } from '@prisma/client';

export class LiberateBookingUseCase {
  constructor(
    private readonly database: PrismaService,
    private readonly notifier: NotificationFactory,
  ) {}

  public async liberate(userId: number, bookingId: number) {
    const booking = await this.database.booking.findFirst({
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
    if (booking.clientId !== userId) {
      throw new ForbiddenException('Apenas o cliente pode executar esta acção');
    }
    if (booking?.payment?.status !== 'PAID') {
      throw new BadRequestException(
        'Aguarde o pagamento para poder permitir o término o serviço',
      );
    }
    await this.database.booking.update({
      where: { id: bookingId },
      data: {
        canEnd: true,
      },
    });
    const PushNotifier = this.notifier.send('PUSH');
    const EmailNotifier = this.notifier.send('EMAIL');
    const clientName = booking.client.firstName + ' ' + booking.client.lastName;
    const clientNotification = {
      title: 'Permisão de finalização',
      message: `O serviço "${booking.service.title}" foi liberado o acesso de finalização pelo cliente ${clientName}.`,
      type: 'BOOKING' as NotificationType,
      isRead: false,
      userId: booking.clientId,
      createdAt: new Date(),
      deepLink: `/bookings/${booking.id}`,
    };
    await Promise.all([
      PushNotifier.send(clientNotification, booking.client),
      EmailNotifier.send(clientNotification, booking.client),
    ]);

    return {
      updated: true,
    };
  }
}
