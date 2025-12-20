import { Module } from '@nestjs/common';
import { BoostratService } from './boostrap.service';

@Module({
  providers: [BoostratService],
})
export class BoostrapModule {}
