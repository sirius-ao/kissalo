import { Global, Module } from '@nestjs/common';
import { EmailService } from './services/EmailService/Email.service';
import { BcryptService } from './services/CryptoService/crypto.service';
import { KissaloLogger } from './services/Logger/logger.service';
import { NotificationFactory } from './services/Notification/notification.factory';
import { SlugService } from './services/Slug/slug.service';

@Module({
  exports: [
    EmailService,
    BcryptService,
    KissaloLogger,
    NotificationFactory,
    SlugService,
  ],
  providers: [
    EmailService,
    BcryptService,
    KissaloLogger,
    NotificationFactory,
    SlugService,
  ],
})
@Global()
export class UtilModule {}
