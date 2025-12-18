import { Global, Module } from '@nestjs/common';
import { EmailService } from './services/EmailService/Email.service';
import { BcryptService } from './services/CryptoService/crypto.service';
import { KissaloLogger } from './services/Logger/logger.service';
import { NotificationFactory } from './services/Notification/notification.factory';

@Module({
  exports: [
    EmailService,
    BcryptService,
    KissaloLogger,
    NotificationFactory,
  ],
  providers: [
    EmailService,
    BcryptService,
    KissaloLogger,
    NotificationFactory,
  ],
})
@Global()
export class UtilModule {}
