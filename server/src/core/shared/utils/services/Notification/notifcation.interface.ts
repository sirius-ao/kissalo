import { Notification, User } from '@prisma/client';

export interface INotificationFactory {
  send(
    data: Omit<Notification, 'id' | 'channel'>,
    user: User,
  ): Promise<Notification>;
}
