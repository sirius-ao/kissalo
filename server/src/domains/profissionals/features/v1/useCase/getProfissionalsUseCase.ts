import { ProfissionalNotFoundExecption } from '@core/http/erros/profissional.error';
import CacheService from '@infra/cache/cahe.service';
import PrismaService from '@infra/database/prisma.service';

export class ProfissionalGetUseCase {
  constructor(
    private readonly database: PrismaService,
    private readonly cache: CacheService,
  ) {}

  public async getAlls() {
    const [items, total] = await Promise.all([
      this.database.professional.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            omit: {
              password: true,
            },
          },
        },
      }),
      this.database.professional.count({}),
    ]);

    return {
      data: items,
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
            professionalId: id,
          },
        },
        wallets: true,
        reviews: {
          take: 5,
        },
      },
    });
    await this.cache.set(`Profissional-${id}`, profissional, 60 * 10);
    if (!profissional) {
      throw new ProfissionalNotFoundExecption(``);
    }
    return profissional;
  }
}
