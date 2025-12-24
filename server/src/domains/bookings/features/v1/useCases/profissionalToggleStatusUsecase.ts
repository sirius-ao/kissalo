import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';
import PrismaService from '@infra/database/prisma.service';
import { BookingsService } from '../bookings.service';
import { ProfissionalsService } from '@domains/profissionals/features/v1/profissionals.service';
import { ProfissionalNotFoundExecption } from '@core/http/erros/profissional.error';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import {
  AdminNotFoundExistExecption,
  UserNotFoundExecption,
} from '@core/http/erros/user.error';
import { ClientsService } from '@domains/clients/features/v1/clients.service';
import { ServicesService } from '@domains/services/features/v1/services.service';
import { NotificationType, User } from '@prisma/client';
import { UpdateBookinSatatusProfisional } from '../dto/update-booking.dto';

export class ProfissionalToogleBookingStatus {
  constructor(
    private readonly database: PrismaService,
    private readonly notification: NotificationFactory,
    private readonly bookingService: BookingsService,
    private readonly profissionalService: ProfissionalsService,
    private readonly services: ServicesService,
  ) {}

  public async toogle(data: UpdateBookinSatatusProfisional) {
    const [profissional, booking] = await Promise.all([
      this.database.user.findFirst({where:{ id : data.userId}}),
      this.bookingService.findOne(data.bookingId),
    ]);
    if (!profissional) {
      throw new ProfissionalNotFoundExecption(``);
    }
    if (!booking) {
      throw new NotFoundException({
        message: 'Pedido de serviço não encontrado',
      });
    }
    const [admins, service, client] = await Promise.all([
      this.database.user.findMany({
        where: {
          role: 'ADMIN',
        },
      }),
      this.services.findOne(booking.serviceId),
      this.database.user.findFirst({
        where: {
          id: booking.clientId,
        },
      }),
    ]);

    if (!client) {
      throw new UserNotFoundExecption();
    }
    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    if (admins.length == 0) {
      throw new AdminNotFoundExistExecption();
    }
    if (booking.status != 'PENDING') {
      throw new ForbiddenException({
        message: 'Pedido de serviço ja foi modificado',
        status: booking.status,
      });
    }
    if (booking?.professional?.userId !== data.userId) {
      throw new ForbiddenException(
        'Apenas o profissional designado pode atualizar este agendamento',
      );
    }

    const professionalName = `${profissional.firstName} ${profissional.lastName}`;
    const serviceTitle = service.title;
    const servicePrice = service.basePrice.toFixed(2);
    const clientNotification = {
      title: 'Serviço aceito',
      message: `O serviço "${serviceTitle}" foi aceito pelo prestador ${professionalName}. Agora você pode efetuar o pagamento de ${servicePrice} AOA para confirmar o agendamento.`,
      type: 'ALERT' as NotificationType,
      isRead: false,
      userId: client.id,
      createdAt: new Date(),
      deepLink: `/bookings/${booking.id}/pay`,
    };

    const adminNotification = {
      title: 'Serviço aceito',
      message: `O serviço "${serviceTitle}" (Agendamento #${booking.id}) foi aceito pelo prestador ${professionalName}. Cliente: ${client.firstName} ${client.lastName}, Valor: ${servicePrice} AOA.`,
      type: 'SYSTEM' as NotificationType,
      isRead: false,
      userId: admins[0].id,
      createdAt: new Date(),
      deepLink: `/admin/bookings/${booking.id}`,
    };

    const PushNotifier = this.notification.send('PUSH');
    const EmailNotifier = this.notification.send('EMAIL');

    await Promise.all([
      PushNotifier.send(clientNotification, client),
      EmailNotifier.send(clientNotification, client),
      ...admins.map((admin) =>
        Promise.all([
          PushNotifier.send({ ...adminNotification, userId: admin.id }, admin),
          EmailNotifier.send({ ...adminNotification, userId: admin.id }, admin),
        ]),
      ),
      this.database.bookingSteps.create({
        data: {
          notes:
            data.notes ||
            `Serviço ${data.status === 'ACEPTED' ? 'aceito' : 'rejeitado'} pelo prestador`,
          bookingId: booking.id,
          senderId: data.userId,
          files: data.files || [],
        },
      }),
      this.database.booking.update({
        where: { id: booking.id },
        data: {
          status: data.status === 'ACEPTED' ? 'CONFIRMED' : 'CANCELED',
        },
      }),
    ]);
    return {
      message: 'Pedido de serviço actualizado com sucesso ',
      id: booking.id,
    };
  }
}
