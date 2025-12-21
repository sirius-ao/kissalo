import { BookingsService } from '@domains/bookings/features/v1/bookings.service';
import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';
import PrismaService from '@infra/database/prisma.service';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { NotificationType, Review } from '@prisma/client';
import { AdminNotFoundExistExecption } from '@core/http/erros/user.error';
import { UpdateReviewDto } from '../dto/update-review.dto';

export class CreateReviwReplayUseCase {
  constructor(
    private readonly database: PrismaService,
    private readonly notifier: NotificationFactory,
    private readonly bookingsService: BookingsService,
  ) {}

  public async create(userId: number, data: UpdateReviewDto) {
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
    if (booking.professional.userId == userId) {
      if (booking.status != 'COMPLETED') {
        throw new BadRequestException(
          'O serviço precisa ser terminado para receber respostas',
        );
      }
      if (!booking.review) {
        throw new ConflictException('Review  não existe');
      }
      let review: Review;
      try {
        review = await this.database.review.update({
          data: {
            repliedAt: new Date(),
            professionalReply: data.replay,
          },
          where: {
            bookingId: data.bookingId,
          },
        });
      } catch (error) {
        throw new BadRequestException({
          message: 'Erro ao criar a review',
          error,
        });
      }
      const profissionalName = `${booking.professional.user.firstName} ${booking.professional.user.lastName}`;
      const serviceTitle = booking.service.title;
      const clientMessage = {
        title: 'Resposta de Avaliação',
        message: `O prestador de serviço ${profissionalName}  respondeu ao seu comentário , no serviço ${serviceTitle}`,
        type: 'BOOKING' as NotificationType,
        isRead: false,
        userId: booking.professional.userId,
        createdAt: new Date(),
        deepLink: `/bookings/${booking.id}`,
      };
      const adminNotification = {
        title: 'Resposta de Avaliação',
        message: `O prestador de serviço ${profissionalName}  respondeu feito no serviço ${serviceTitle}`,
        type: 'BOOKING' as NotificationType,
        isRead: false,
        userId: admin.id,
        createdAt: new Date(),
        deepLink: `/admin/bookings/${booking.id}`,
      };
      const PushNotifier = this.notifier.send('PUSH');
      const EmailNotifier = this.notifier.send('EMAIL');
      await Promise.all([
        PushNotifier.send(clientMessage, booking.client),
        EmailNotifier.send(clientMessage, booking.client),
        PushNotifier.send(adminNotification, admin),
        EmailNotifier.send(adminNotification, admin),
      ]);
      return {
        sucess: true,
        data: review,
      };
    }
    throw new ForbiddenException(
      'Precisas ser proprietário do agendamento para poder criar review reponse',
    );
  }
}
