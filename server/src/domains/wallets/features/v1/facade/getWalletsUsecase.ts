import { ProfissionalNotFoundExecption } from '@core/http/erros/profissional.error';
import { UserNotFoundExecption } from '@core/http/erros/user.error';
import CacheService from '@infra/cache/cahe.service';
import PrismaService from '@infra/database/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Professional, User, Wallet } from '@prisma/client';

export class GetWalletFacade {
  constructor(
    private readonly database: PrismaService,
    private readonly cache: CacheService,
  ) {}

  public async get(userId: number, page: number, limit: number) {
    const user = await this.database.user.findUnique({
      where: {
        id: userId,
      },
      omit: {
        password: true,
      },
      include: {
        professional: true,
      },
    });

    if (!user) {
      throw new UserNotFoundExecption();
    }
    const userRole = user.role;
    switch (userRole) {
      case 'ADMIN':
        return await this.getAll(page, limit);
        break;
      case 'PROFESSIONAL':
        if (!user.professional) {
          throw new ProfissionalNotFoundExecption('');
        }
        return await this.getByUserId(user);
        break;
      default:
        throw new ForbiddenException(
          'Não possuís permissão para listar as carteiras',
        );
        break;
    }
  }

  private async getByUserId(
    user: Omit<User, 'password'> & { professional: Professional },
  ) {
    const userId = user.id;
    let wallets: Wallet[] = await this.cache.get<Wallet[]>(`wallets-${userId}`);

    if (wallets) {
      return {
        data: wallets,
        total: wallets.length,
      };
    }
    wallets = await this.database.wallet.findMany({
      where: {
        professionalId: user.professional.id,
      },
      include: {
        _count: true,
      },
    });
    await this.cache.set(`wallets-${userId}`, wallets, 60 * 30);
    return {
      data: wallets,
      total: wallets.length,
    };
  }

  private async getAll(page: number, limit: number) {
    page = isNaN(page) || page == 0 ? 1 : page;
    limit = isNaN(limit) || limit == 0 ? 10 : limit;
    const skip = (page - 1) * limit;
    const [waalets, totalWallets] = await Promise.all([
      this.database.wallet.findMany({
        skip,
        take: limit,
        include: {
          _count: true,
        },
      }),
      this.database.wallet.count({}),
    ]);

    const totalPages = Math.ceil(totalWallets / limit);
    return {
      data: waalets,
      pagination: {
        page,
        limit,
        total: totalWallets,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  public async getDetails(walletId: number, userId: number) {
    const [user, wallet] = await Promise.all([
      this.database.user.findUnique({
        where: {
          id: userId,
        },
        omit: {
          password: true,
        },
        include: {
          professional: true,
        },
      }),
      this.database.wallet.findUnique({
        where: {
          id: walletId,
        },
        include: {
          conclidation: {
            include: {
              payment: {
                include: {
                  client: {
                    omit: {
                      password: true,
                    },
                  },

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
          },
          professional: true,
          _count: true,
        },
      }),
    ]);

    if (!user) {
      throw new UserNotFoundExecption();
    }
    if (!wallet) {
      throw new NotFoundException('Carteira não encontrada');
    }
    if (user.role == 'ADMIN') {
      return {
        data: wallet,
      };
    } else if (
      user.role == 'PROFESSIONAL' &&
      wallet.professional &&
      user.id == wallet.professional.userId
    ) {
      return {
        data: wallet,
      };
    }
    throw new ForbiddenException(
      'Não tens a permisão pra ver detalhes desta carteira',
    );
  }
}
