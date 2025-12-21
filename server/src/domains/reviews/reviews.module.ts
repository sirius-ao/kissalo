import { Module } from '@nestjs/common';
import { ReviewsService } from './features/v1/reviews.service';
import { ReviewsController } from './features/v1/reviews.controller';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
