import { Module } from '@nestjs/common';
import { AuthService } from './features/v1/auth.service';
import { AuthController } from './features/v1/auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
