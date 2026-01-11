import { IRefreshToken } from './../../shared/types/index.d';
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

@Injectable()
export class IsAdminGuard implements CanActivate {
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
    if (!userRefreshToken) {
      throw new ForbiddenException('Sessão expirada');
    }
    let tokenData: IRefreshToken;
    try {
      tokenData = this.jwt.verify(userRefreshToken) as IRefreshToken;
    } catch (error) {
      throw new ForbiddenException(
        'Refresh Token expirado precisa se autenticar',
      );
    }
    if (tokenData?.role === 'ADMIN') {
      return true;
    }
    throw new UnauthorizedException('Precisa ser admin para exuctar esta ação');
  }
}
