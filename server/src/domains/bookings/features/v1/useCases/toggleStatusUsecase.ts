import {
  ForbiddenException,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import PrismaService from '@infra/database/prisma.service';
import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';
import { UserNotFoundExecption } from '@core/http/erros/user.error';
import {
  Booking,
  BookingStatus,
  NotificationType,
  Professional,
  User,
} from '@prisma/client';
import {
  UpdateBookinSatatusProfisionalEnum,
  UpdateBookinStatus,
} from '../dto/update-booking.dto';

export class ToogleBookingUseCase {
  constructor(
    private readonly database: PrismaService,
    private readonly notification: NotificationFactory,
  ) {}
  private readonly logger = new Logger();

  public async toogle(
    data: UpdateBookinStatus,
    userId: number,
    bookingId: number,
  ) {
    const [booking, user] = await Promise.all([
      this.database.booking.findFirst({
        where: { id: bookingId },
        include: {
          professional: {
            include: {
              user: true,
            },
          },
          client: true,
          service: true,
        },
      }),
      this.database.user.findFirst({
        where: { id: userId },
        include: {
          professional: true,
        },
      }),
    ]);

    if (!booking) {
      throw new NotFoundException('Agendamento não encontrado');
    }
    if (!user) {
      throw new UserNotFoundExecption();
    }
    if (!booking.service) {
      throw new NotFoundException('Serviço associado não encontrado');
    }

    await this.validatePermission(user, booking, data.status);
    this.validateStatusTransition(booking.status, data.status);

    if (
      data.status == 'COMPLETED' &&
      !booking.canEnd &&
      user.role == 'PROFESSIONAL'
    ) {
      throw new BadRequestException(
        'O cliente precisa liberar acesso para cocluires',
      );
    }
    await this.database.$transaction(async (prisma) => {
      const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: data.status,
          canceledAt: data.status === 'CANCELED' ? new Date() : undefined,
          cancelReason: data.status === 'CANCELED' ? data.notes : '',
          startedAt: data.status === 'STARTED' ? new Date() : undefined,
          completedAt: data.status === 'COMPLETED' ? new Date() : undefined,
          updatedAt: new Date(),
        },
      });
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' },
      });

      await this.sendNotifications(updatedBooking, booking, user, admins, data);

      this.logger.log(
        `Status do booking ${bookingId} alterado para ${data.status}`,
      );

      return {
        message: this.getSuccessMessage(data.status),
        id: updatedBooking.id,
        status: updatedBooking.status,
      };
    });
    return {
      message: 'Agendamento alterado',
    };
  }

  private async validatePermission(
    user: User,
    booking: Booking & { professional: Professional },
    newStatus: string,
  ) {
    const userRole = user.role;
    const isProfessional = userRole === 'PROFESSIONAL';
    const isClient = booking.clientId === user.id;
    const isAdmin = userRole === 'ADMIN';

    const permissions: Record<string, string[]> = {
      ACCEPTED: ['PROFESSIONAL'],
      REJECTED: ['PROFESSIONAL'],
      STARTED: ['PROFESSIONAL'],
      COMPLETED: ['PROFESSIONAL'],
      CANCELED: ['CUSTOMER', 'PROFESSIONAL', 'ADMIN'],
    };

    if (!permissions[newStatus]) {
      throw new ForbiddenException(
        `Transição para status ${newStatus} não é permitida`,
      );
    }

    const allowedRoles = permissions[newStatus];
    let hasPermission = false;

    if (allowedRoles.includes('PROFESSIONAL') && isProfessional) {
      if (!booking.professionalId || booking.professional.userId !== user.id) {
        throw new ForbiddenException(
          'Apenas o profissional atribuído pode realizar esta ação',
        );
      }
      hasPermission = true;
    }

    if (allowedRoles.includes('CUSTOMER') && isClient) {
      hasPermission = true;
    }

    if (allowedRoles.includes('ADMIN') && isAdmin) {
      hasPermission = true;
    }

    if (!hasPermission) {
      throw new ForbiddenException(
        `Você não tem permissão para alterar o status para ${newStatus}`,
      );
    }
  }
  private validateStatusTransition(
    currentStatus: BookingStatus,
    newStatus: UpdateBookinSatatusProfisionalEnum,
  ) {
    const validTransitions: Record<string, string[]> = {
      PENDING: ['ACCEPTED', 'REJECTED', 'CANCELED'],
      CONFIRMED: ['ACCEPTED', 'REJECTED', 'CANCELED'],
      ACCEPTED: ['STARTED', 'CANCELED'],
      STARTED: ['COMPLETED', 'CANCELED'],
      REJECTED: [],
      COMPLETED: [],
      CANCELED: [],
    };

    const allowedTransitions = validTransitions[currentStatus] || [];
    if (!allowedTransitions.includes(newStatus)) {
      throw new BadRequestException(
        `Não é possível alterar de ${currentStatus} para ${newStatus}. ` +
          `Transições permitidas: ${allowedTransitions.join(', ') || 'nenhuma'}`,
      );
    }
    if (newStatus === 'COMPLETED' && currentStatus !== 'STARTED') {
      throw new BadRequestException(
        'Apenas serviços iniciados podem ser marcados como completos',
      );
    }

    if (newStatus === 'STARTED' && currentStatus !== 'ACCEPTED') {
      throw new BadRequestException(
        'Apenas serviços aceitos podem ser iniciados',
      );
    }
  }

  private getSuccessMessage(status: string): string {
    const messages: Record<string, string> = {
      ACCEPTED: 'Serviço aceito com sucesso',
      REJECTED: 'Serviço rejeitado com sucesso',
      STARTED: 'Serviço iniciado com sucesso',
      COMPLETED: 'Serviço completado com sucesso',
      CANCELED: 'Serviço cancelado com sucesso',
    };

    return messages[status] || 'Status atualizado com sucesso';
  }
  private async sendNotifications(
    updatedBooking: any,
    originalBooking: any,
    user: any,
    admins: any[],
    data: UpdateBookinStatus,
  ) {
    const pushNotifier = this.notification.send('PUSH');
    const emailNotifier = this.notification.send('EMAIL');

    const serviceTitle = originalBooking.service.title;
    const servicePrice = originalBooking.service.price.toFixed(2);
    const userName = `${user.firstName} ${user.lastName}`;

    const notifications = this.generateNotifications(
      data.status,
      updatedBooking,
      originalBooking,
      user,
      serviceTitle,
      servicePrice,
      userName,
    );

    const promises: Promise<any>[] = [];

    if (notifications.client && originalBooking.client) {
      promises.push(
        pushNotifier.send(notifications.client, originalBooking.client),
        emailNotifier.send(notifications.client, originalBooking.client),
      );
    }

    if (
      notifications.professional &&
      originalBooking.professional &&
      originalBooking.professional.userId !== user.id
    ) {
      promises.push(
        pushNotifier.send(
          notifications.professional,
          originalBooking.professional.user,
        ),
        emailNotifier.send(
          notifications.professional,
          originalBooking.professional.user,
        ),
      );
    }

    admins.forEach((admin) => {
      if (notifications.admin) {
        const adminNotification = {
          ...notifications.admin,
          userId: admin.id,
        };
        promises.push(
          pushNotifier.send(adminNotification, admin),
          emailNotifier.send(adminNotification, admin),
        );
      }
    });

    try {
      await Promise.allSettled(promises);
    } catch (error) {
      this.logger.error(
        `Erro ao enviar notificações: ${error.message}`,
        error.stack,
      );
    }
  }
  private generateNotifications(
    status: string,
    updatedBooking: any,
    originalBooking: any,
    user: any,
    serviceTitle: string,
    servicePrice: string,
    userName: string,
  ) {
    const baseDeepLink = `/bookings/${updatedBooking.id}`;
    const adminDeepLink = `/admin/bookings/${updatedBooking.id}`;
    const clientName = `${originalBooking.client?.firstName} ${originalBooking.client?.lastName}`;
    const professionalName = `${originalBooking.professional?.user?.firstName} ${originalBooking.professional?.user?.lastName}`;

    const notifications: any = {};

    switch (status) {
      case 'ACCEPTED':
        notifications.client = {
          title: 'Serviço aceito!',
          message:
            `O profissional ${userName} aceitou seu serviço "${serviceTitle}". ` +
            `Valor: ${servicePrice} AOA. Você pode agora efetuar o pagamento.`,
          type: 'BOOKING' as NotificationType,
          isRead: false,
          userId: originalBooking.clientId,
          createdAt: new Date(),
          deepLink: `${baseDeepLink}/pay`,
          channel: 'PUSH',
        };
        notifications.admin = {
          title: 'Serviço aceito',
          message:
            `Profissional ${userName} aceitou o serviço "${serviceTitle}" ` +
            `para o cliente ${clientName}. Valor: ${servicePrice} AOA.`,
          type: 'SYSTEM' as NotificationType,
          isRead: false,
          createdAt: new Date(),
          deepLink: adminDeepLink,
          channel: 'PUSH',
        };
        break;

      case 'REJECTED':
        notifications.client = {
          title: 'Serviço rejeitado',
          message:
            `O profissional ${userName} rejeitou seu serviço "${serviceTitle}". ` +
            `Iremos buscar outro profissional para você.`,
          type: 'ALERT' as NotificationType,
          isRead: false,
          userId: originalBooking.clientId,
          createdAt: new Date(),
          deepLink: baseDeepLink,
          channel: 'PUSH',
        };
        notifications.admin = {
          title: 'Serviço rejeitado',
          message:
            `Profissional ${userName} rejeitou o serviço "${serviceTitle}" ` +
            `do cliente ${clientName}. Buscar novo profissional.`,
          type: 'SYSTEM' as NotificationType,
          isRead: false,
          createdAt: new Date(),
          deepLink: adminDeepLink,
          channel: 'PUSH',
        };
        break;

      case 'STARTED':
        notifications.client = {
          title: 'Serviço iniciado!',
          message: `O profissional ${userName} iniciou o serviço "${serviceTitle}".`,
          type: 'BOOKING' as NotificationType,
          isRead: false,
          userId: originalBooking.clientId,
          createdAt: new Date(),
          deepLink: baseDeepLink,
          channel: 'PUSH',
        };
        notifications.admin = {
          title: 'Serviço iniciado',
          message:
            `Profissional ${userName} iniciou o serviço "${serviceTitle}" ` +
            `para o cliente ${clientName}.`,
          type: 'SYSTEM' as NotificationType,
          isRead: false,
          createdAt: new Date(),
          deepLink: adminDeepLink,
          channel: 'PUSH',
        };
        break;

      case 'COMPLETED':
        notifications.client = {
          title: 'Serviço completado!',
          message:
            `O profissional ${userName} completou o serviço "${serviceTitle}". ` +
            `Por favor, avalie o serviço prestado.`,
          type: 'BOOKING' as NotificationType,
          isRead: false,
          userId: originalBooking.clientId,
          createdAt: new Date(),
          deepLink: `${baseDeepLink}/review`,
          channel: 'PUSH',
        };
        notifications.admin = {
          title: 'Serviço completado',
          message:
            `Profissional ${userName} completou o serviço "${serviceTitle}" ` +
            `para o cliente ${clientName}.`,
          type: 'SYSTEM' as NotificationType,
          isRead: false,
          createdAt: new Date(),
          deepLink: adminDeepLink,
          channel: 'PUSH',
        };
        break;

      case 'CANCELED':
        const canceledBy =
          user.role === 'CLIENT'
            ? 'cliente'
            : user.role === 'PROFESSIONAL'
              ? 'profissional'
              : 'administrador';

        notifications.client =
          user.role !== 'CLIENT'
            ? {
                title: 'Serviço cancelado',
                message: `Seu serviço "${serviceTitle}" foi cancelado pelo ${canceledBy}.`,
                type: 'ALERT' as NotificationType,
                isRead: false,
                userId: originalBooking.clientId,
                createdAt: new Date(),
                deepLink: baseDeepLink,
                channel: 'PUSH',
              }
            : null;

        if (
          originalBooking.professionalId &&
          user.id !== originalBooking.professional.userId
        ) {
          notifications.professional = {
            title: 'Serviço cancelado',
            message: `O serviço "${serviceTitle}" para o cliente ${clientName} foi cancelado pelo ${canceledBy}.`,
            type: 'ALERT' as NotificationType,
            isRead: false,
            userId: originalBooking.professional.userId,
            createdAt: new Date(),
            deepLink: baseDeepLink,
            channel: 'PUSH',
          };
        }

        notifications.admin = {
          title: 'Serviço cancelado',
          message:
            `Serviço "${serviceTitle}" (${updatedBooking.id}) cancelado por ${userName} (${canceledBy}). ` +
            `Cliente: ${clientName}`,
          type: 'SYSTEM' as NotificationType,
          isRead: false,
          createdAt: new Date(),
          deepLink: adminDeepLink,
          channel: 'PUSH',
        };
        break;
    }

    return notifications;
  }
}
