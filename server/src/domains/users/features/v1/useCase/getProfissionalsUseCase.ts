import { ProfissionalNotFoundExecption } from '@core/http/erros/profissional.error';
import CacheService from '@infra/cache/cahe.service';
import PrismaService from '@infra/database/prisma.service';

export class ProfissionalGetUseCase {
  constructor(
    private readonly database: PrismaService,
    private readonly cache: CacheService,
  ) {}

  public async getAlls() {
    const [items] = await Promise.all([
      this.database.user.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          professional: true,
        },
        omit: {
          password: true,
        },
        where: {
          role: {
            not: 'ADMIN',
          },
        },
      }),
    ]);

    return {
      data: items,
    };
  }

  public async getOne(id: number) {
    const cachedUser = await this.cache.get(`user-${id}`);
    if (cachedUser) {
      return {
        data: cachedUser,
      };
    }

    const user = await this.database.user.findFirst({
      where: {
        id,
      },
      omit: {
        password: true,
      },
      include: {
        professional: true,
        bookings: {
          include: {
            service: true,
          },
        },
        payments: true,
        reviews: {
          include: {
            booking: {
              include: {
                service: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (user.role == 'PROFESSIONAL') {
      const reviews = await this.database.review.findMany({
        where: {
          booking: {
            professional: {
              userId: user.id,
            },
          },
        },
        include: {
          booking: {
            include: {
              service: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });
      user.reviews = reviews as any;
    }
    await this.cache.set(`user-${id}`, user, 60 * 10);
    if (!user) {
      throw new ProfissionalNotFoundExecption(``);
    }
    return user;
  }
}
