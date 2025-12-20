import { Global, Module } from '@nestjs/common';
import { ProfissionalsService } from './features/v1/profissionals.service';
import { ProfissionalsController } from './features/v1/profissionals.controller';

@Module({
  controllers: [ProfissionalsController],
  providers: [ProfissionalsService],
})
@Global()
export class ProfissionalsModule {}
