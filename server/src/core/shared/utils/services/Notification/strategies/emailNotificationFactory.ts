import { Notification, User } from '@prisma/client';
import { INotificationFactory } from '../notifcation.interface';
import { EmailService } from '../../EmailService/Email.service';

export class EmailNotificationFactory implements INotificationFactory {
  constructor(private readonly emailService: EmailService) {}

  public async send(
    data: Omit<Notification, 'id'>,
    user: User,
  ): Promise<Notification> {
    const [notification] = await Promise.all([
      this.emailService.send({
        subject: data.title,
        to: user.email,
        html: data.message,
        text: data.title,
        
      }),
    ]);
    return {
      ...data,
      id: 0,
    };
  }
}
