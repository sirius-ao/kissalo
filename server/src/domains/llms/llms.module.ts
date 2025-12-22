import { Module } from '@nestjs/common';
import { LlmsService } from './features/v1/llms.service';
import { LlmsController } from './features/v1/llms.controller';

@Module({
  controllers: [LlmsController],
  providers: [LlmsService],
})
export class LlmsModule {}
