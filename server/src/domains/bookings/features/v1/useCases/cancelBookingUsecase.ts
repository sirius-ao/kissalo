import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';
import PrismaService from '@infra/database/prisma.service';
import { BookingsService } from '../bookings.service';
import { AdminNotFoundExistExecption } from '@core/http/erros/user.error';
import { UpdateBookinSatatusProfisional } from '../dto/update-booking.dto';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { NotificationType, User } from '@prisma/client';

export class CancelBookingUseCase {
  constructor(
    private readonly database: PrismaService,
    private readonly notifier: NotificationFactory,
    private readonly bookinservice: BookingsService,
  ) {}

  public async cancel(data: UpdateBookinSatatusProfisional): Promise<void> {
    const [admin, booking] = await Promise.all([
      this.database.user.findFirst({ where: { role: 'ADMIN' } }),
      this.bookinservice.findOne(data.bookingId),
    ]);
    const Pushnotifier = this.notifier.send('PUSH');
    const Emailnotifier = this.notifier.send('EMAIL');
    if (!admin) {
      throw new AdminNotFoundExistExecption();
    }
    if (booking.status != 'PENDING' && booking.status != 'STARTED') {
      throw new BadRequestException('Agendamento não pode ser cancelado');
    }
    if (
      booking.clientId != data.userId &&
      booking.professionalId != data.userId &&
      admin.id != data.userId
    ) {
      throw new ForbiddenException(
        'Precisa ser o prestador , cliente ou administrador do sistema para execurtar essa ação ',
      );
    }
    const { service, client, professional } = booking;

    const clientMessage = {
      title: 'Agendamento cancelado',
      message: `O agendamento do serviço "${service.title}", no valor de ${service.basePrice.toFixed(
        2,
      )} Kz, foi cancelado por ${
        data.userId === professional.id ? 'o prestador de serviço' : 'você'
      }.`,
      type: 'ALERT' as NotificationType,
      isRead: false,
      userId: client.id,
      createdAt: new Date(),
      deepLink: `/bookings/${booking.id}`,
    };
    const professionalMessage = {
      title: 'Agendamento cancelado',
      message: `O agendamento do serviço "${service.title}", no valor de ${service.basePrice.toFixed(
        2,
      )} Kz, foi cancelado com sucesso.`,
      type: 'ALERT' as NotificationType,
      isRead: false,
      userId: professional.id,
      createdAt: new Date(),
      deepLink: `/bookings/${booking.id}`,
    };
    const adminMessage = {
      title: 'Cancelamento de agendamento',
      message: `O agendamento do serviço "${service.title}" (valor: ${service.basePrice.toFixed(
        2,
      )} Kz) foi cancelado por ${
        data.userId === client.id
          ? 'o cliente'
          : data.userId === professional.id
            ? 'o prestador'
            : 'o administrador'
      }.`,
      type: 'SYSTEM' as NotificationType,
      isRead: false,
      userId: admin.id,
      createdAt: new Date(),
      deepLink: `/admin/bookings/${booking.id}`,
    };

    await Promise.all([
      this.database.bookingSteps.create({
        data: {
          senderId: data.userId,
          notes: data.notes,
          bookingId: booking.id,
          files: data.files,
        },
      }),

      this.database.booking.update({
        data: { status: 'CANCELED' },
        where: { id: booking.id },
      }),

      Pushnotifier.send(clientMessage, client),
      Emailnotifier.send(clientMessage, client),

      Pushnotifier.send(professionalMessage, professional.user as User),
      Emailnotifier.send(professionalMessage, professional.user as User),
      Pushnotifier.send(adminMessage, admin),
      Emailnotifier.send(adminMessage, admin),
    ]);
  }
}
