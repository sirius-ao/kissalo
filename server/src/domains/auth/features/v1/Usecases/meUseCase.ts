import { UserNotFoundExecption } from '@core/http/erros/user.error';
import CacheService from '@infra/cache/cahe.service';
import PrismaService from '@infra/database/prisma.service';

export class MeUseCase {
  constructor(
    private readonly database: PrismaService,
    private readonly cache: CacheService,
  ) {}
  public async getMe(userId: number) {
    const cahcedMe = await this.cache.get(`userProfile-${userId}`);

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
      if (!me) {
        throw new UserNotFoundExecption();
      }
      await this.cache.set(`userProfile-${me.id}`, me, 60 * 60);
      return me;
    }
    return cahcedMe;
  }
}
