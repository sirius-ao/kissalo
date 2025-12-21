import { BookingsService } from '@domains/bookings/features/v1/bookings.service';
import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';
import PrismaService from '@infra/database/prisma.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { NotificationType, Review, User } from '@prisma/client';
import { AdminNotFoundExistExecption } from '@core/http/erros/user.error';

export class CreateReviwUseCase {
  constructor(
    private readonly database: PrismaService,
    private readonly notifier: NotificationFactory,
    private readonly bookingsService: BookingsService,
  ) {}

  public async create(userId: number, data: CreateReviewDto) {
    const [booking, admin] = await Promise.all([
      this.bookingsService.findOne(data.bookingId),
      this.database.user.findFirst({
        where: {
          role: 'ADMIN',
        },
      }),
    ]);
    if (!admin) {
      throw new AdminNotFoundExistExecption();
    }
    if (booking.clientId == userId) {
      if (booking.status != 'COMPLETED') {
        throw new BadRequestException(
          'O serviço precisa ser terminado para receber avaliação',
        );
      }
      if (booking.review) {
        throw new ConflictException('Review existente');
      }
      let review: Review;
      try {
        review = await this.database.review.create({
          data: {
            ...data,
            clientId: userId,
            professionalId: booking.professionalId,
          },
        });
      } catch (error) {
        throw new BadRequestException({
          message: 'Erro ao criar a review',
          error,
        });
      }
      const clientName = `${booking.client.firstName} ${booking.client.lastName}`;
      const serviceTitle = booking.service.title;
      const profissionalMessage = {
        title: 'Avaliação',
        message: `O serviço "${serviceTitle}" foi avaliado pelo cliente ${clientName}. E você recebeu ${data.rating} estrelas`,
        type: 'BOOKING' as NotificationType,
        isRead: false,
        userId: booking.professional.userId,
        createdAt: new Date(),
        deepLink: `/bookings/${booking.id}`,
      };
      const adminNotification = {
        title: 'Avaliação',
        message: `O serviço "${serviceTitle}" foi avaliado pelo cliente ${clientName}. E o prestador de serviço ${booking.professional.user.firstName + ' ' + booking.professional.user.lastName} recebeu ${data.rating} estrelas`,
        type: 'BOOKING' as NotificationType,
        isRead: false,
        userId: admin.id,
        createdAt: new Date(),
        deepLink: `/admin/bookings/${booking.id}`,
      };
      const PushNotifier = this.notifier.send('PUSH');
      const EmailNotifier = this.notifier.send('EMAIL');
      await Promise.all([
        PushNotifier.send(
          profissionalMessage,
          booking.professional.user as User,
        ),
        EmailNotifier.send(
          profissionalMessage,
          booking.professional.user as User,
        ),
        PushNotifier.send(adminNotification, admin),
        EmailNotifier.send(adminNotification, admin),
      ]);
      return {
        sucess: true,
        data: review,
      };
    }
    throw new ForbiddenException(
      'Precisas ser proprietário do agendamento para poder criar review',
    );
  }
}
