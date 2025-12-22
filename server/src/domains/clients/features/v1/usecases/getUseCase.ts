import { UserNotFoundExecption } from '@core/http/erros/user.error';
import PrismaService from '@infra/database/prisma.service';
import { ForbiddenException } from '@nestjs/common';

export class GetclientUseCase {
  constructor(private readonly database: PrismaService) {}

  private async getAllClients(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [total, items] = await Promise.all([
      this.database.user.count({
        where: {
          role: 'PROFESSIONAL',
        },
      }),
      this.database.user.findMany({
        where: {
          role: 'PROFESSIONAL',
        },
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        lasPage: totalPages,
      },
    };
  }

  public async get(page: number, limit: number, userId: number) {
    page = isNaN(page) || page == 0 ? 1 : page;
    limit = isNaN(limit) || limit == 0 ? 10 : limit;
    const user = await this.database.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        _count: true,
      },
      omit: {
        password: true,
      },
    });
    if (!user) {
      throw new UserNotFoundExecption();
    }
    if (user.role == 'CUSTOMER') {
      return {
        data: user,
      };
    } else if (user.role == 'ADMIN') {
      return await this.getAllClients(page, limit);
    }
    throw new ForbiddenException(
      'Não possuis permissão para executar esta ação',
    );
  }
}
