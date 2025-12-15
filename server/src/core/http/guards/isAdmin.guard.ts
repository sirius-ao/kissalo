import CacheService from '@infra/cache/cahe.service';
import PrismaService from '@infra/database/prisma.service';
import {
  CanActivate,
  Injectable,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import type { Request } from 'express';
import { UserNotFoundExecption } from '../erros/user.error';

@Injectable()
export class IsAdminGuard implements CanActivate {
  private readonly jwt: JwtService = new JwtService({
    secret: process.env.JWT_SECRET,
  });
  constructor(
    private readonly cache: CacheService,
    private readonly database: PrismaService,
  ) {}
  public async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request: Request = ctx.switchToHttp().getRequest();
    const admin = await this.database.user.findFirst({
      where: {
        role: 'ADMIN',
      },
    });
    const userId = request.headers['intern-user'];
    if (!userId) {
      throw new UserNotFoundExecption();
    }
    const userRefreshToken = await this.cache.get(`userRefreshToken-${userId}`);
    try {
      const tokenData = this.jwt.verify(userRefreshToken) as {
        sub: number;
        role: UserRole;
      };
      if (tokenData?.role == 'ADMIN' && admin?.id == tokenData?.sub) {
        return true;
      }
      throw new UnauthorizedException(
        'Precisar ser admin para executar esta acção',
      );
    } catch (error) {
      throw new ForbiddenException(
        'Refresh Token expirado precisa se autenticar',
      );
    }
  }
}
