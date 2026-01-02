import PrismaService from '@infra/database/prisma.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { NotificationType, User } from '@prisma/client';
import {
  AdminNotFoundExistExecption,
  UserNotFoundExecption,
} from '@core/http/erros/user.error';
import { ProfissionalNotFoundExecption } from '@core/http/erros/profissional.error';
import { ServicesService } from '@domains/services/features/v1/services.service';
import {
  ConflictException,
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';

@Injectable()
export class CreateBookingUseFacade {
  constructor(
    private readonly database: PrismaService,
    private readonly notifier: NotificationFactory,
    private readonly services: ServicesService,
  ) {}

  public async create(data: CreateBookingDto, userId: number) {
    const [admin, service, client] = await Promise.all([
      this.database.user.findFirst({
        where: { role: 'ADMIN' },
      }),
      this.services.findOne(data.serviceId),
      this.database.user.findFirst({
        where: { id: userId },
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

    await this.validateTimeConflict(userId, data);

    const booking = await this.database.$transaction(async (prisma) => {
      const booking = await prisma.booking.create({
        data: {
          address: JSON.stringify(data.address),
          endTime: data.endTime,
          scheduleDate: data.scheduleDate,
          location: data.location,
          startTime: data.startTime,
          priority: data.priority,
          totalAmount: service.price,
          serviceId: data.serviceId,
          status: 'PENDING',
          clientId: userId,
        },
      });

      await this.createBookingNotifications(
        prisma,
        booking,
        client,
        admin,
        service,
      );

      return booking;
    });

    await this.sendBookingNotifications(booking, client, null, admin, service);

    return {
      message: 'Pedido de serviço criado com sucesso',
      id: booking.id,
    };
  }

  public async anexProfessional(bookingId: number, professionalUserId: number) {
    if (!bookingId || !professionalUserId) {
      throw new BadRequestException('Parâmetros inválidos');
    }

    return await this.database.$transaction(async (prisma) => {
      const booking = await prisma.booking.findFirst({
        where: { id: bookingId },
      });

      if (!booking) {
        throw new NotFoundException('Agendamento não encontrado');
      }

      const professionalUser = await prisma.user.findFirst({
        where: {
          id: professionalUserId,
          role: 'PROFESSIONAL',
        },
        include: {
          professional: {
            include: {
              serviceRequests: {
                where: {
                  serviceId: booking.serviceId,
                  status: 'APPROVED',
                },
              },
            },
          },
        },
      });

      if (!professionalUser || !professionalUser.professional) {
        throw new ProfissionalNotFoundExecption('');
      }

      const canBeAdded =
        professionalUser.professional.serviceRequests.length > 0;

      if (!canBeAdded) {
        throw new BadRequestException(
          'O profissional não pode ser anexado, pois não está aprovado para este serviço',
        );
      }

      if (booking.professionalId) {
        throw new ConflictException(
          'Já existe um profissional atribuído a este agendamento',
        );
      }

      if (booking.status !== 'PENDING') {
        throw new BadRequestException(
          `Não é possível anexar profissional ao agendamento com status "${booking.status}"`,
        );
      }

      await this.validateProfessionalTimeConflict(
        professionalUser.professional.id,
        booking,
      );

      const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          professionalId: professionalUser.professional.id,
          status: 'CONFIRMED',
        },
      });

      const [service, client] = await Promise.all([
        this.services.findOne(booking.serviceId),
        prisma.user.findFirst({
          where: { id: booking.clientId },
        }),
      ]);

      if (!client) {
        throw new UserNotFoundExecption();
      }

      if (!service) {
        throw new NotFoundException('Serviço não encontrado');
      }

      await this.createProfessionalAssignmentNotifications(
        prisma,
        updatedBooking,
        client,
        professionalUser,
        service,
      );

      await this.sendProfessionalAssignmentNotifications(
        updatedBooking,
        client,
        professionalUser,
        service,
      );

      return {
        message: 'Profissional anexado com sucesso',
        id: updatedBooking.id,
      };
    });
  }

  private async validateTimeConflict(clientId: number, data: CreateBookingDto) {
    const conflictingBooking = await this.database.booking.findFirst({
      where: {
        clientId,
        scheduleDate: data.scheduleDate,
        status: { notIn: ['CANCELED', 'REJECTED', 'COMPLETED'] },
        OR: [
          {
            startTime: { lte: data.startTime },
            endTime: { gt: data.startTime },
          },
          {
            startTime: { lt: data.endTime },
            endTime: { gte: data.endTime },
          },
          {
            startTime: { gte: data.startTime },
            endTime: { lte: data.endTime },
          },
        ],
      },
    });

    if (conflictingBooking) {
      throw new ConflictException('Você já tem um agendamento neste horário');
    }
  }

  private async validateProfessionalTimeConflict(
    professionalId: number,
    booking: any,
  ) {
    const conflictingBooking = await this.database.booking.findFirst({
      where: {
        professionalId,
        scheduleDate: booking.scheduleDate,
        status: { notIn: ['CANCELED', 'REJECTED', 'COMPLETED'] },
        OR: [
          {
            startTime: { lte: booking.startTime },
            endTime: { gt: booking.startTime },
          },
          {
            startTime: { lt: booking.endTime },
            endTime: { gte: booking.endTime },
          },
        ],
      },
    });

    if (conflictingBooking) {
      throw new ConflictException(
        'O profissional já tem um agendamento neste horário',
      );
    }
  }

  private async createBookingNotifications(
    prisma: any,
    booking: any,
    client: User,
    admin: User,
    service: any,
  ) {
    const notifications = [
      {
        title: 'Novo agendamento',
        message: `O agendamento do serviço "${service.title}", no valor de ${service.price.toFixed(2)} Kz, foi criado com sucesso.`,
        type: 'BOOKING' as NotificationType,
        isRead: false,
        userId: client.id,
        createdAt: new Date(),
        deepLink: `/bookings/${booking.id}`,
      },
      {
        title: 'Novo agendamento',
        message: `Um novo agendamento para o serviço "${service.title}" foi criado pelo cliente ${client.firstName} ${client.lastName}.`,
        type: 'SYSTEM' as NotificationType,
        isRead: false,
        userId: admin.id,
        createdAt: new Date(),
        deepLink: `/admin/bookings/${booking.id}`,
      },
    ];

    await prisma.notification.createMany({
      data: notifications,
    });
  }

  private async sendBookingNotifications(
    booking: any,
    client: User,
    professional: User | null,
    admin: User,
    service: any,
  ) {
    const pushNotifier = this.notifier.send('PUSH');
    const emailNotifier = this.notifier.send('EMAIL');

    const clientNotification = {
      title: 'Novo agendamento',
      message: `O agendamento do serviço "${service.title}", no valor de ${service.price.toFixed(2)} Kz, foi criado com sucesso.`,
      type: 'BOOKING' as NotificationType,
      isRead: false,
      userId: client.id,
      createdAt: new Date(),
      deepLink: `/bookings/${booking.id}`,
    };

    const adminNotification = {
      title: 'Novo agendamento',
      message: `Um novo agendamento para o serviço "${service.title}" foi criado pelo cliente ${client.firstName} ${client.lastName}.`,
      type: 'SYSTEM' as NotificationType,
      isRead: false,
      userId: admin.id,
      createdAt: new Date(),
      deepLink: `/admin/bookings/${booking.id}`,
    };

    await Promise.all([
      pushNotifier.send(clientNotification, client),
      emailNotifier.send(clientNotification, client),
      pushNotifier.send(adminNotification, admin),
      emailNotifier.send(adminNotification, admin),
    ]);
  }

  private async createProfessionalAssignmentNotifications(
    prisma: any,
    booking: any,
    client: User,
    professional: User,
    service: any,
  ) {
    const notifications = [
      {
        title: 'Prestador atribuído',
        message: `O agendamento do serviço "${service.title}" foi atribuído ao prestador ${professional.firstName} ${professional.lastName}.`,
        type: 'BOOKING' as NotificationType,
        isRead: false,
        userId: client.id,
        createdAt: new Date(),
        deepLink: `/bookings/${booking.id}`,
      },
      {
        title: 'Novo agendamento atribuído',
        message: `Você foi atribuído ao agendamento do serviço "${service.title}".`,
        type: 'BOOKING' as NotificationType,
        isRead: false,
        userId: professional.id,
        createdAt: new Date(),
        deepLink: `/bookings/${booking.id}`,
      },
    ];

    await prisma.notification.createMany({
      data: notifications,
    });
  }

  private async sendProfessionalAssignmentNotifications(
    booking: any,
    client: User,
    professional: User,
    service: any,
  ) {
    const pushNotifier = this.notifier.send('PUSH');
    const emailNotifier = this.notifier.send('EMAIL');

    const clientNotification = {
      title: 'Prestador atribuído',
      message: `O agendamento do serviço "${service.title}" foi atribuído ao prestador ${professional.firstName} ${professional.lastName}.`,
      type: 'BOOKING' as NotificationType,
      isRead: false,
      userId: client.id,
      createdAt: new Date(),
      deepLink: `/bookings/${booking.id}`,
    };

    const professionalNotification = {
      title: 'Novo agendamento atribuído',
      message: `Você foi atribuído ao agendamento do serviço "${service.title}".`,
      type: 'BOOKING' as NotificationType,
      isRead: false,
      userId: professional.id,
      createdAt: new Date(),
      deepLink: `/bookings/${booking.id}`,
    };

    await Promise.all([
      pushNotifier.send(clientNotification, client),
      emailNotifier.send(clientNotification, client),
      pushNotifier.send(professionalNotification, professional),
      emailNotifier.send(professionalNotification, professional),
    ]);
  }
}
