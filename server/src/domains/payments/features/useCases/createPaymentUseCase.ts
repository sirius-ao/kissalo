import PrismaService from '@infra/database/prisma.service';
import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PaymentStatus, UserRole } from '@prisma/client';
import { BookingsService } from '@domains/bookings/features/v1/bookings.service';

export class CreatePaymentUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifier: NotificationFactory,
    private readonly bookservice: BookingsService,
  ) {}

  
  async execute(dto: CreatePaymentDto, userId: number) {
    const booking = await this.bookservice.findOne(dto.bookingId);
    if (!booking) {
      throw new NotFoundException('Agendamento não encontrado');
    }
    if (booking.payment) {
      throw new BadRequestException(
        'Este agendamento já possui um pagamento registrado',
      );
    }
    if (booking.clientId !== userId) {
      throw new BadRequestException(
        'Apenas o cliente do agendamento pode registrar o pagamento',
      );
    }
    if (dto.professionalId) {
      const professional = await this.prisma.professional.findUnique({
        where: { id: dto.professionalId },
        include: {
          user: true,
        },
      });

      if (!professional) {
        throw new NotFoundException('Profissional informado não encontrado');
      }

      if (!professional.isVerified) {
        throw new BadRequestException(
          'O profissional informado não está verificado',
        );
      }
    }

    const payment = await this.prisma.payment.create({
      data: {
        bookingId: booking.id,
        clientId: booking.clientId,
        professionalId: booking.professionalId ?? dto.professionalId ?? null,
        fileUrl: dto.fileUrl,
        amount: booking.service.price,
        currency: booking.service.currency,
        method: dto.method,
        status: PaymentStatus.PENDING,
      },
    });

    const admins = await this.prisma.user.findMany({
      where: { role: UserRole.ADMIN },
    });
    const PushNotifier = this.notifier.send('PUSH');
    const EmailNotifier = this.notifier.send('EMAIL');

    const notificationPayload = {
      title: 'Novo pagamento registrado',
      message: `Um novo pagamento foi registrado para o agendamento "${booking.service.title}" (Agendamento #${booking.id}). Precisa ser aprovado.`,
      type: 'PAYMENT' as const,
      isRead: false,
      createdAt: new Date(),
      deepLink: `/admin/payments/${payment.id}`,
    };
    await Promise.all(
      admins.map((admin) =>
        Promise.all([
          PushNotifier.send(
            { ...notificationPayload, userId: admin.id },
            admin,
          ),
          EmailNotifier.send(
            { ...notificationPayload, userId: admin.id },
            admin,
          ),
        ]),
      ),
    );
    return payment;
  }
}
