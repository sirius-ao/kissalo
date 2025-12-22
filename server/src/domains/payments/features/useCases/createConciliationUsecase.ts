import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';
import PrismaService from '@infra/database/prisma.service';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { NotificationType } from '@prisma/client';

export class CreateConciliationUsecase {
  constructor(
    private readonly database: PrismaService,
    private readonly notifier: NotificationFactory,
  ) {}

  public async create(paymentId: number, waaletId: number, fileUrl: string) {
    const payment = await this.database.payment.findUnique({
      where: {
        id: paymentId,
      },
      include: {
        professional: {
          include: {
            user: true,
            wallets: {
              where: {
                id: waaletId,
                isActive: true,
                isVerified: true,
              },
            },
          },
        },
        booking: {
          include: {
            service: true,
          },
        },
        conclidation: true,
      },
    });
    if (!payment) {
      throw new NotFoundException('Pagamento não encotrado');
    }
    if (payment?.professional?.wallets.length == 0) {
      throw new BadRequestException(
        'Profissional sem carteiras verificadas ou activas',
      );
    }
    if (payment.conclidation) {
      throw new ConflictException('Consolidação existente');
    }
    if (!payment.professionalId || !payment.professional) {
      throw new BadRequestException('Profissional não encontrado');
    }
    const amount = this.getPercentage(payment.amount);
    const PushNotifier = this.notifier.send('PUSH');
    const EmailNotifier = this.notifier.send('EMAIL');

    const professionalNotification = {
      title: 'Pagamento confirmado',
      message: `O pagamento do serviço "${payment.booking.service.title}" foi confirmado. Você já pode sacar o seu valor pelo o serviço `,
      type: NotificationType.PAYMENT,
      isRead: false,
      userId: payment.professional?.userId,
      createdAt: new Date(),
      deepLink: `/payment/${payment.bookingId}`,
    };
    await Promise.all([
      this.database.user.update({
        where: {
          id: payment.professional.userId,
        },
        data: {
          amountAvaliable: {
            increment: amount,
          },
        },
      }),
      this.database.concliationPayment.create({
        data: {
          paymentId: payment.id,
          userId: payment.professional.userId,
          waaletId,
          fileUrl,
        },
      }),
      PushNotifier.send(professionalNotification, payment.professional?.user),
      EmailNotifier.send(professionalNotification, payment.professional?.user),
    ]);

    return {
      sucess: true,
    };
  }

  public getPercentage(amount: number): number {
    return amount;
  }
}
