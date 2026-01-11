import PrismaService from '@infra/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  constructor(private readonly database: PrismaService) {}

  public async findAll(userId: number) {
    const [notiications, total, notReaded] = await Promise.all([
      this.database.notification.findMany({
        where: {
          userId,
          channel: 'PUSH',
        },
      }),
      this.database.notification.count({
        where: {
          userId,
          channel: 'PUSH',
        },
      }),
      this.database.notification.count({
        where: {
          userId,
          isRead: false,
          channel: 'PUSH',
        },
      }),
    ]);
    return {
      data: notiications,
      notReaded,
    };
  }

  public async read(userId: number, to: number) {
    return await this.database.notification.updateMany({
      where: {
        userId,
        id: {
          lte: to,
        },
        channel: 'PUSH',
      },
      data: {
        isRead: true,
      },
    });
  }
}
