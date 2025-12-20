import { Module } from '@nestjs/common';
import { ServicesService } from './features/v1/services.service';
import { ServicesController } from './features/v1/services.controller';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
