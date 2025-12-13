import { Module } from '@nestjs/common';
import { ProfissionalsService } from './profissionals.service';
import { ProfissionalsController } from './profissionals.controller';

@Module({
  controllers: [ProfissionalsController],
  providers: [ProfissionalsService],
})
export class ProfissionalsModule {}
