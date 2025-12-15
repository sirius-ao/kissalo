import { Injectable, UnsupportedMediaTypeException } from '@nestjs/common';
import { EmailService } from '../EmailService/Email.service';
import PrismaService from '@infra/database/prisma.service';
import { INotificationFactory } from './notifcation.interface';
import { NotificationChanel } from '@prisma/client';
import { EmailNotificationFactory } from './strategies/emailNotificationFactory';
import { PushNotificationFactory } from './strategies/pushNotificationFactory';

@Injectable()
export class NotificationFactory {
  constructor(
    private readonly emailService: EmailService,
    private readonly database: PrismaService,
    private readonly notificationChanel: NotificationChanel,
  ) {}

  public send(): INotificationFactory {
    switch (this.notificationChanel) {
      case 'EMAIl':
        return new EmailNotificationFactory(this.emailService, this.database);
        break;
      case 'PUSH':
        return new PushNotificationFactory(this.database);
        break;

      default:
        throw new UnsupportedMediaTypeException(
          'Tipo de notificação não suportada',
        );
        break;
    }
  }
}
