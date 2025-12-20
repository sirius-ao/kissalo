import { Module } from '@nestjs/common';
import { BookingsService } from './features/v1/bookings.service';
import { BookingsController } from './features/v1/bookings.controller';

@Module({
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
