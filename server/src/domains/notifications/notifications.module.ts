import { Module } from '@nestjs/common';
import { NotificationsService } from './features/v1/notifications.service';
import { NotificationsController } from './features/v1/notifications.controller';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
