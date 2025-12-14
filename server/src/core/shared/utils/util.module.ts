import { Global, Module } from '@nestjs/common';
import { EmailService } from './services/EmailService/Email.service';
import { BcryptService } from './services/CryptoService/crypto.service';
import { KissaloLogger } from './services/Logger/logger.service';
import { VerificationService } from './services/VerificationService/verification.service';

@Module({
  exports: [EmailService, BcryptService, KissaloLogger, VerificationService],
  providers: [EmailService, BcryptService, KissaloLogger, VerificationService],
})
@Global()
export class UtilModule {}
