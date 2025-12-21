import { Global, Module } from '@nestjs/common';
import { ServicesService } from './features/v1/services.service';
import { ServicesController } from './features/v1/services.controller';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
@Global()
export class ServicesModule {}
