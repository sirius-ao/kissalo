import { Module } from '@nestjs/common';
import { WalletsService } from './features/v1/wallets.service';
import { WalletsController } from './features/v1/wallets.controller';

@Module({
  controllers: [WalletsController],
  providers: [WalletsService],
})
export class WalletsModule {}
