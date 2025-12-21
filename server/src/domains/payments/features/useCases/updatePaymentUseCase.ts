import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import PrismaService from '@infra/database/prisma.service';
import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';
import { BookingStatus, NotificationType } from '@prisma/client';
import { UpdatePaymentDto } from '../dto/update-payment.dto';

@Injectable()
export class UpdatePaymentUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifier: NotificationFactory,
  ) {}

  async execute(
    paymentId: number,
    updateData: UpdatePaymentDto,
    adminUserId: number,
  ) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: true,
        client: true,
        professional: {
          include: { user: true },
        },
      },
    });
    if (!payment) throw new NotFoundException('Pagamento não encontrado');

    const admin = await this.prisma.user.findUnique({
      where: { id: adminUserId },
    });
    if (!admin || admin.role !== 'ADMIN')
      throw new ForbiddenException(
        'Apenas administradores podem atualizar pagamentos',
      );

    const PushNotifier = this.notifier.send('PUSH');
    const EmailNotifier = this.notifier.send('EMAIL');

    if (updateData.status === 'REFUNDED') {
      await this.prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: BookingStatus.CANCELED },
      });

      await this.prisma.bookingSteps.create({
        data: {
          bookingId: payment.bookingId,
          senderId: adminUserId,
          notes: updateData.notes || 'Pagamento cancelado pelo admin',
          files: [],
        },
      });

      const message = `O pagamento do serviço "${payment.booking.serviceId}" foi cancelado pelo admin.`;
      const notifications = [
        { user: payment.client, title: 'Pagamento cancelado', message },
        {
          user: payment.professional?.user,
          title: 'Pagamento cancelado',
          message,
        },
        { user: admin, title: 'Pagamento cancelado', message },
      ];

      await Promise.all(
        notifications.map(({ user, title, message }) =>
          Promise.all([
            PushNotifier.send(
              {
                title,
                message,
                type: 'PAYMENT',
                isRead: false,
                userId: user.id,
                createdAt: new Date(),
                deepLink: `/bookings/${payment.bookingId}`,
              },
              user,
            ),
            EmailNotifier.send(
              {
                title,
                message,
                type: 'PAYMENT',
                isRead: false,
                userId: user.id,
                createdAt: new Date(),
                deepLink: `/bookings/${payment.bookingId}`,
              },
              user,
            ),
          ]),
        ),
      );
    } else {
      const clientNotification = {
        title: 'Pagamento confirmado',
        message: `O pagamento do serviço "${payment.booking.serviceId}" foi confirmado. Você já pode aguardar o início do serviço.`,
        type: NotificationType.PAYMENT,
        isRead: false,
        userId: payment.clientId,
        createdAt: new Date(),
        deepLink: `/bookings/${payment.bookingId}`,
      };
      const professionalNotification = {
        title: 'Pagamento confirmado',
        message: `O pagamento do serviço "${payment.booking.serviceId}" foi confirmado. Você já pode iniciar o serviço para o cliente ${payment.client.firstName} ${payment.client.lastName}.`,
        type: NotificationType.PAYMENT,
        isRead: false,
        userId: payment.professional?.userId,
        createdAt: new Date(),
        deepLink: `/bookings/${payment.bookingId}`,
      };
      await Promise.all([
        PushNotifier.send(clientNotification, payment.client),
        EmailNotifier.send(clientNotification, payment.client),
        PushNotifier.send(professionalNotification, payment.professional?.user),
        EmailNotifier.send(
          professionalNotification,
          payment.professional?.user,
        ),
      ]);
    }
    const updatedPayment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        ...updateData,
        status: updateData.status == 'PAID' ? 'PAID' : 'REFUNDED',
      },
    });
    return updatedPayment;
  }
}
