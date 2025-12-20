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
import { ClientsService } from '@domains/clients/clients.service';
import { ServicesService } from '@domains/services/features/v1/services.service';
import { User } from '@prisma/client';
import { UpdateBookinSatatusProfisional } from '../dto/update-booking.dto';

export class ProfissionalToogleBookingStatus {
  constructor(
    private readonly database: PrismaService,
    private readonly notification: NotificationFactory,
    private readonly bookingService: BookingsService,
    private readonly profissionalService: ProfissionalsService,
    private readonly clientService: ClientsService,
    private readonly services: ServicesService,
  ) {}

  public async toogle(data: UpdateBookinSatatusProfisional) {
    const [profissional, booking] = await Promise.all([
      this.profissionalService.findOne(data.userId) as any as User,
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
    const [admin, service, client] = await Promise.all([
      this.database.user.findFirst({
        where: {
          role: 'ADMIN',
        },
      }),
      this.services.findOne(booking.serviceId),
      this.clientService.findOne(booking.clientId) as any as User,
    ]);

    if (!client) {
      throw new UserNotFoundExecption();
    }
    if (!service) {
      throw new NotFoundException('Serviço não encontrado');
    }

    if (!admin) {
      throw new AdminNotFoundExistExecption();
    }
    if (booking.status != 'PENDING') {
      throw new ForbiddenException({
        message: 'Pedido de serviço ja foi modificado',
        status: booking.status,
      });
    }

    const Pushnotifier = this.notification.send('PUSH');
    const Emailnotifier = this.notification.send('EMAIL');
    await Promise.all([
      Pushnotifier.send(
        {
          message: `O pedido de serviço " ${service.title} no valor de ${service.basePrice.toFixed(2)} " foi ${data.status == 'ACEPTED' ? 'aceite' : 'rejeitadi'} pelo prestador de serviço ${profissional.firstName + ' ' + profissional.lastName}`,
          title: 'Pedido de serviço ',
          type: 'ALERT',
          isRead: false,
          userId: client.id,
          createdAt: new Date(),
          deepLink: '',
        },
        client,
      ),
      Emailnotifier.send(
        {
          message: `O pedido de serviço " ${service.title} no valor de ${service.basePrice.toFixed(2)} " foi ${data.status == 'ACEPTED' ? 'aceite' : 'rejeitadi'} pelo prestador de serviço ${profissional.firstName + ' ' + profissional.lastName}`,
          title: 'Pedido de serviço ',
          type: 'ALERT',
          isRead: false,
          userId: client.id,
          createdAt: new Date(),
          deepLink: '',
        },
        client,
      ),
      Pushnotifier.send(
        {
          message: `O pedido de serviço " ${service.title} no valor de ${service.basePrice.toFixed(2)} " foi ${data.status == 'ACEPTED' ? 'aceite' : 'rejeitado'} pelo prestador de serviço ${profissional.firstName + ' ' + profissional.lastName}`,
          title: 'Pedido de serviço ',
          type: 'ALERT',
          isRead: false,
          userId: client.id,
          createdAt: new Date(),
          deepLink: '',
        },
        admin,
      ),
      Emailnotifier.send(
        {
          message: `O pedido de serviço " ${service.title} no valor de ${service.basePrice.toFixed(2)} " foi ${data.status == 'ACEPTED' ? 'aceite' : 'rejeitado'} pelo prestador de serviço ${profissional.firstName + ' ' + profissional.lastName}`,
          title: 'Pedido de serviço ',
          type: 'ALERT',
          isRead: false,
          userId: admin.id,
          createdAt: new Date(),
          deepLink: '',
        },
        admin,
      ),
      this.database.bookingSteps.create({
        data: {
          notes: data.notes,
          bookingId: booking.id,
          senderId: data.userId,
          files: data.files,
        },
      }),
    ]);
    return {
      message: 'Pedido de serviço actualizado com sucesso ',
      id: booking.id,
    };
  }
}
