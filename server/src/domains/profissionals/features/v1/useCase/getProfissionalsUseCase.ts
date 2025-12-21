import { ProfissionalNotFoundExecption } from '@core/http/erros/profissional.error';
import { UserNotFoundExecption } from '@core/http/erros/user.error';
import CacheService from '@infra/cache/cahe.service';
import PrismaService from '@infra/database/prisma.service';

export class ProfissionalGetUseCase {
  constructor(
    private readonly database: PrismaService,
    private readonly cache: CacheService,
  ) {}

  public async getAlls(
    page: number,
    limit: number,
    isVerified: boolean | undefined,
  ) {
    page = isNaN(page) || page == 0 ? 1 : page;
    limit = isNaN(limit) || limit == 0 ? 10 : limit;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (isVerified !== undefined) {
      where.isVerified = isVerified;
    }
    const [items, total] = await Promise.all([
      this.database.professional.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        where,
      }),
      this.database.professional.count({
        where,
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
  public async getOne(id: number) {
    const cachedUser = await this.cache.get(`Profissional-${id}`);
    if (cachedUser) {
      return {
        data: cachedUser,
      };
    }
    const profissional = await this.database.professional.findFirst({
      where: {
        id,
      },
      include: {
        user: {
          omit: {
            password: true,
          },
        },
        _count: {
          select: {
            bookings: true,
            docs: true,
            payments: true,
            reviews: true,
            serviceRequests: true,
            wallets: true,
          },
        },
        serviceRequests: {
          where: {
            status: 'APPROVED',
          },
        },
        wallets: true,
        reviews: {
          take: 5,
        },
      },
    });
    this.cache
      .set(`Profissional-${id}`, profissional, 60 * 10)
      .then()
      .catch();
    if (!profissional) {
      throw new ProfissionalNotFoundExecption(``);
    }
    return profissional;
  }
}
