import { Global, Module } from '@nestjs/common';
import { EmailService } from './services/EmailService/Email.service';
import { BcryptService } from './services/CryptoService/crypto.service';
import { KissaloLogger } from './services/Logger/logger.service';
import { NotificationFactory } from './services/Notification/notification.factory';
import { SlugService } from './services/Slug/slug.service';
import { IAFactory } from './services/AI/ia.factory';
import { PixeBayService } from './services/AI/pixebay.service';

@Module({
  exports: [
    EmailService,
    BcryptService,
    KissaloLogger,
    NotificationFactory,
    SlugService,
    IAFactory,
    PixeBayService,
  ],
  providers: [
    EmailService,
    BcryptService,
    KissaloLogger,
    NotificationFactory,
    SlugService,
    IAFactory,
    PixeBayService,
  ],
})
@Global()
export class UtilModule {}
