import PrismaService from '@infra/database/prisma.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { User } from '@prisma/client';
import {
  AdminNotFoundExistExecption,
  UserNotFoundExecption,
} from '@core/http/erros/user.error';
import {
  ProfissionalNotFoundExecption,
  ProfissionalNotVerifiedExecption,
} from '@core/http/erros/profissional.error';
import { ServicesService } from '@domains/services/features/v1/services.service';
import { NotFoundException } from '@nestjs/common';
import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';
import { NotifyBookingObservers } from '../booking.observers';
import { ClientsService } from '@domains/clients/features/v1/clients.service';

export class CreateBookingUseFacade {
  protected notiefer: NotifyBookingObservers;
  constructor(
    private readonly database: PrismaService,
    private readonly notification: NotificationFactory,
    private readonly services: ServicesService,
  ) {
    this.notiefer = new NotifyBookingObservers(this.notification);
  }

  public async create(data: CreateBookingDto, userId: number) {
    let user:  any = undefined;
    const [admin, service, client] = await Promise.all([
      this.database.user.findFirst({
        where: {
          role: 'ADMIN',
        },
      }),
      this.services.findOne(data.serviceId),
      this.database.user.findFirst({
        where: {
          id: userId,
        },
      }),
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
    const serviceAssociatedUsers: User[] = service.requests.map((item) => {
      return {
        ...item?.professional?.user,
      };
    });

    if (data.professionalId) {
      const isAnUser = await this.database.professional.findFirst({
        where: {
          userId: data.professionalId,
        },
        include: {
          user: true,
        },
      });
      if (!isAnUser) {
        throw new ProfissionalNotFoundExecption(
          `${user.firstName + ' ' + user.lastName}`,
        );
      }
      if (isAnUser.user.status == 'INACTIVE') {
        throw new ProfissionalNotVerifiedExecption(
          `${user.firstName + ' ' + user.lastName}`,
        );
      }
      user = isAnUser;
    }
    if (user) {
      const booking = await this.database.booking.create({
        data: {
          address: JSON.stringify(data.address),
          endTime: data.endTime,
          scheduleDate: data.scheduleDate,
          location: data.location,
          startTime: data.startTime,
          priority: data.priority,
          professionalId: user.id,
          totalAmount: service.basePrice,
          serviceId: data.serviceId,
          status: 'PENDING',
          clientId: userId,
        },
      });
      await this.notiefer.notify(
        [user],
        admin,
        booking,
        'Novo pedido de serviço para si',
        'Novo pedido de serviço',
        'Foste escolhido para este serviço , clique em ver detalhes',
      );
      return {
        message: 'Pedido de serviço criado com sucesso ',
        id: booking.id,
      };
    } else {
      const booking = await this.database.booking.create({
        data: {
          address: JSON.stringify(data.address),
          endTime: data.endTime,
          scheduleDate: data.scheduleDate,
          location: data.location,
          startTime: data.startTime,
          priority: data.priority,
          totalAmount: service.basePrice,
          serviceId: data.serviceId,
          status: 'PENDING',
          clientId: userId,
        },
      });
      await this.notiefer.notify(
        serviceAssociatedUsers,
        admin,
        booking,
        'Novo pedido de serviço',
        'Novo pedido de serviço',
        'Aproveite a oportunidade e seje o primeiro a garantir esta oportunidade',
      );
      return {
        message: 'Pedido de serviço criado com sucesso ',
        id: booking.id,
      };
    }
  }
}
