import CacheService from '@infra/cache/cahe.service';
import {
  CanActivate,
  Injectable,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { UserNotFoundExecption } from '../erros/user.error';
import { IRefreshToken } from '@core/shared/types';

@Injectable()
export class IsProfissionalGuard implements CanActivate {
  private readonly jwt: JwtService = new JwtService({
    secret: process.env.JWT_SECRET,
  });
  constructor(private readonly cache: CacheService) {}
  public async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request: Request = ctx.switchToHttp().getRequest();
    const userId = request.headers['intern-user'];
    if (!userId) {
      throw new UserNotFoundExecption();
    }
    const userRefreshToken = await this.cache.get(`userRefreshToken-${userId}`);
    try {
      const tokenData = this.jwt.verify(userRefreshToken) as IRefreshToken
      if (tokenData?.role != 'PROFESSIONAL') {
        return true;
      }
      throw new UnauthorizedException(
        'Precisar ser profissional para executar esta acção',
      );
    } catch (error) {
      throw new ForbiddenException(
        'Refresh Token expirado precisa se autenticar',
      );
    }
  }
}
