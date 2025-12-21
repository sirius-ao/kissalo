import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import PrismaService from '@infra/database/prisma.service';
import { BookingsService } from '@domains/bookings/features/v1/bookings.service';
import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';
import { CreateReviwUseCase } from './usecase/createReviewUsecase';
import { CreateReviwReplayUseCase } from './usecase/replayToReviewUsecase';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly database: PrismaService,
    private readonly booking: BookingsService,
    private readonly notifier: NotificationFactory,
  ) {}
  public async create(data: CreateReviewDto, userId: number) {
    const createReviewFacede = new CreateReviwUseCase(
      this.database,
      this.notifier,
      this.booking,
    );
    return await createReviewFacede.create(userId, data);
  }
  public async replay(userId: number, data: UpdateReviewDto) {
    const replayReviewFacede = new CreateReviwReplayUseCase(
      this.database,
      this.notifier,
      this.booking,
    );
    return await replayReviewFacede.create(userId, data);
  }
}
