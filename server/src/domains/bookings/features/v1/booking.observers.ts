import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';
import { Booking, User } from '@prisma/client';

export class NotifyBookingObservers {
  constructor(private readonly notification: NotificationFactory) {}
  public async notify(
    users: User[],
    admin: User,
    booking: Booking,
    title: string,
    adminMessage: string,
    usermessage: string,
  ): Promise<void> {
    const Pushnotifier = this.notification.send('PUSH');
    const Emailnotifier = this.notification.send('EMAIL');
    await Promise.all([
      Pushnotifier.send(
        {
          message: title,
          title: adminMessage,
          type: 'BOOKING',
          isRead: false,
          userId: admin.id,
          createdAt: new Date(),
          deepLink: `https://kissalo/admin/booking/${booking.id}`,
        },
        admin,
      ),
      Emailnotifier.send(
        {
          message: title,
          title: adminMessage,
          type: 'BOOKING',
          isRead: false,
          userId: admin.id,
          createdAt: new Date(),
          deepLink: `https://kissalo/admin/booking/${booking.id}`,
        },
        admin,
      ),
    ]);
    users.map(async (item) => {
      await Promise.all([
        Pushnotifier.send(
          {
            message: title,
            title: usermessage,
            type: 'BOOKING',
            isRead: false,
            userId: item.id,
            createdAt: new Date(),
            deepLink: `https://kissalo/profissional/booking/${booking.id}`,
          },
          item,
        ),
        Emailnotifier.send(
          {
            message: title,
            title: usermessage,
            type: 'BOOKING',
            isRead: false,
            userId: item.id,
            createdAt: new Date(),
            deepLink: `https://kissalo/profissional/booking/${booking.id}`,
          },
          item,
        ),
      ]);
    });
  }
}
