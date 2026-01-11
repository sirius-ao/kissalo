import { Notification } from '@prisma/client';
import { INotificationFactory } from '../notifcation.interface';
import PrismaService from '@infra/database/prisma.service';

export class PushNotificationFactory implements INotificationFactory {
  constructor(private readonly database: PrismaService) {}

  public async send(data: Omit<Notification, 'id'>): Promise<Notification> {
    const notification = await this.database.notification.create({
      data: {
        ...data,
        channel: 'PUSH',
      },
    });
    return notification;
  }
}
