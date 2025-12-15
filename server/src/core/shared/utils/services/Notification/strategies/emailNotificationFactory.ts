import { Notification, User } from '@prisma/client';
import { INotificationFactory } from '../notifcation.interface';
import { EmailService } from '../../EmailService/Email.service';
import PrismaService from '@infra/database/prisma.service';

export class EmailNotificationFactory implements INotificationFactory {
  constructor(
    private readonly emailService: EmailService,
    private readonly database: PrismaService,
  ) {}

  public async send(
    data: Omit<Notification, 'id'>,
    user: User,
  ): Promise<Notification> {
    const [notification, _] = await Promise.all([
      this.database.notification.create({
        data: {
          ...data,
          channel: 'EMAIl',
        },
      }),
      this.emailService.send({
        subject: data.title,
        to: user.email,
        html: data.message,
        text: data.title,
      }),
    ]);
    return notification;
  }
}
