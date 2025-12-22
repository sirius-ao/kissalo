import { IRefreshToken } from './../../shared/types/index.d';
import CacheService from '@infra/cache/cahe.service';
import {
  CanActivate,
  Injectable,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { UserNotFoundExecption } from '../erros/user.error';
import PrismaService from '@infra/database/prisma.service';
import { RequestActivation } from '@core/shared/utils/services/ActivationService/activation.service';
import { EmailService } from '@core/shared/utils/services/EmailService/Email.service';

@Injectable()
export class IsEmailVerifiedGuard implements CanActivate {
  private readonly jwt: JwtService = new JwtService({
    secret: process.env.JWT_SECRET,
  });
  constructor(
    private readonly cache: CacheService,
    private readonly database: PrismaService,
    private readonly emailService: EmailService,
  ) {}
  public async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request: Request = ctx.switchToHttp().getRequest();
    const userId = request.headers['intern-user'];
    if (!userId) {
      throw new UserNotFoundExecption();
    }
    const userRefreshToken = await this.cache.get(`userRefreshToken-${userId}`);

    let tokenData: IRefreshToken;
    try {
      tokenData = this.jwt.verify(userRefreshToken) as IRefreshToken;
    } catch (error) {
      throw new ForbiddenException(
        'Refresh Token expirado precisa se autenticar',
      );
    }
    const user = await this.database.user.findFirst({
      where: {
        id: Number(tokenData?.sub),
      },
    });

    if (!user) {
      throw new UserNotFoundExecption();
    }
    if (user.isEmailVerified) {
      return true;
    }

    const requestActivation = new RequestActivation(
      this.database,
      this.emailService,
      this.jwt,
    );
    await requestActivation.request(user);
  }
}
