import PrismaService from '@infra/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  constructor(private readonly database: PrismaService) {}

  public async findAll(userId: number, page: number, limit: number) {
    page = isNaN(page) || page == 0 ? 1 : page;
    limit = isNaN(limit) || limit == 0 ? 10 : limit;
    const skip = (page - 1) * limit;
    const [notiications, total, notReaded] = await Promise.all([
      this.database.notification.findMany({
        where: {
          userId,
        },
        take: limit,
        skip,
      }),
      this.database.notification.count({
        where: {
          userId,
        },
      }),
      this.database.notification.count({
        where: {
          userId,
          isRead: false,
        },
      }),
    ]);
    const totalPages = Math.ceil(total / limit);
    return {
      data: notiications,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        lastPage: totalPages,
      },
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
      },
      data: {
        isRead: true,
      },
    });
  }
}
