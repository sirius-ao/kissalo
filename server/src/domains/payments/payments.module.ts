import { Module } from '@nestjs/common';
import { PaymentsService } from './features/payments.service';
import { PaymentsController } from './features/payments.controller';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
