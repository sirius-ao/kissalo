import { Injectable, NotFoundException } from '@nestjs/common';
import PrismaService from '@infra/database/prisma.service';
import { BookingStatus, NotificationType } from '@prisma/client';
import { UpdatePaymentDto } from '../dto/update-payment.dto';

@Injectable()
export class UpdatePaymentUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    paymentId: number,
    updateData: UpdatePaymentDto,
    adminUserId: number,
  ) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          include: {
            service: true,
          },
        },
        client: true,
        professional: {
          include: { user: true },
        },
      },
    });
    if (!payment) throw new NotFoundException('Pagamento não encontrado');

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
      const notifications = [{}, payment?.professional?.user?.id && {}];

      await this.prisma.notification.create({
        data: {
          userId: payment.clientId,
          channel: 'PUSH',
          title: 'Pagamento cancelado',
          message,
          type: 'PAYMENT',
        },
      });
      if (payment?.professional) {
        await this.prisma.notification.create({
          data: {
            userId: payment.professional?.userId,
            channel: 'PUSH',
            title: 'Pagamento cancelado',
            message,
            type: 'PAYMENT',
          },
        });
      }
    } else {
      const clientNotification = {
        title: 'Pagamento confirmado',
        message: `O pagamento do serviço "${payment.booking.service.title}" foi confirmado. Você já pode aguardar o início do serviço.`,
        type: NotificationType.PAYMENT,
        isRead: false,
        userId: payment.clientId,
        createdAt: new Date(),
        deepLink: `/bookings/${payment.bookingId}`,
      };
      const professionalNotification = {
        title: 'Pagamento confirmado',
        message: `O pagamento do serviço "${payment.booking.service.title}" foi confirmado. Você já pode iniciar o serviço para o cliente ${payment.client.firstName} ${payment.client.lastName}.`,
        type: NotificationType.PAYMENT,
        isRead: false,
        userId: payment.professional?.userId,
        createdAt: new Date(),
        deepLink: `/bookings/${payment.bookingId}`,
      };
      await this.prisma.notification.create({
        data: {
          userId: payment.clientId,
          ...clientNotification,
          channel: 'PUSH',
        },
      });
      if (payment?.professional) {
        await this.prisma.notification.create({
          data: {
            userId: payment.professional?.userId,
            ...professionalNotification,
            channel: 'PUSH',
          },
        });
      }
      await this.prisma.user.update({
        where: {
          id: payment.clientId,
        },
        data: {
          amountAvaliable: {
            increment: payment.amount,
          },
        },
      });
    }
    const updatedPayment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: updateData.status == 'PAID' ? 'PAID' : 'REFUNDED',
        refundedAt: updateData.status == 'PAID' ? null : new Date(),
        paidAt: updateData.status == 'REFUNDED' ? null : new Date(),
      },
    });
    return updatedPayment;
  }
}
