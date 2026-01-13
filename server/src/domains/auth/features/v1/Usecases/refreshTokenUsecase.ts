import { UserNotFoundExecption } from '@core/http/erros/user.error';
import { IAcessToken } from '@core/shared/types';
import CacheService from '@infra/cache/cahe.service';
import PrismaService from '@infra/database/prisma.service';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export class RefreshTokenUseCase {
  constructor(
    private readonly database: PrismaService,
    private readonly jwt: JwtService,
    private readonly cache: CacheService,
  ) {}

  public async process(token: string): Promise<{ newAcessToken: string }> {
    const userId = this.jwt.decode(token) as IAcessToken;
    if (!userId?.sub) {
      throw new ForbiddenException('Token inválido para refresh');
    }
    const [user, userRefreshToken] = await Promise.all([
      this.database.user.findFirst({
        where: {
          id: userId.sub,
        },
      }),
      this.cache.get(`userRefreshToken-${userId}`),
    ]);
    if (!user) {
      throw new UserNotFoundExecption();
    }
    if (!userRefreshToken) {
      throw new BadRequestException('Sessão expirada , precisa fazer login');
    }
    try {
      this.jwt.verify(userRefreshToken);
    } catch (error) {
      throw new BadRequestException('Sessão expirada , precisa fazer login');
    }
    const newAcessToken = this.jwt.sign(
      {
        sub: user.id,
      },
      {
        expiresIn: '7d',
      },
    );
    return {
      newAcessToken,
    };
  }
}
