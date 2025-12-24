import CacheService from '@infra/cache/cahe.service';
import PrismaService from '@infra/database/prisma.service';

export class MeUseCase {
  constructor(
    private readonly database: PrismaService,
    private readonly cache: CacheService,
  ) {}
  public async getMe(userId: number) {
    const cahcedMe = await this.cache.get(`me-${userId}`);

    if (!cahcedMe) {
      const me = await this.database.user.findFirst({
        where: {
          id: userId,
        },
        omit: {
          password: true,
        },
        include: {
          professional: true,
          _count: true,
        },
      });
    }
    return cahcedMe;
  }
}
