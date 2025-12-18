import { UserNotFoundExecption } from '@core/http/erros/user.error';
import { ILoginUseCase, ILoginUseCaseReturnType } from '@core/shared/types';
import { RequestActivation } from '@core/shared/utils/services/ActivationService/activation.service';
import { ICryptoInterface } from '@core/shared/utils/services/CryptoService/crypto.interface';
import { EmailServiceInterface } from '@core/shared/utils/services/EmailService/emailService.interface';
import CacheService from '@infra/cache/cahe.service';
import PrismaService from '@infra/database/prisma.service';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export class LoginUseCase {
  private readonly logger = new Logger(LoginUseCase.name);
  constructor(
    private readonly database: PrismaService,
    private readonly encript: ICryptoInterface,
    private readonly emailService: EmailServiceInterface,
    private readonly cache: CacheService,
    private readonly jwt: JwtService,
  ) {}

  public async handle(
    userData: ILoginUseCase,
  ): Promise<ILoginUseCaseReturnType> {
    const user = await this.database.user.findFirst({
      where: {
        OR: [
          {
            email: userData.unique,
          },
          {
            phone: userData.unique,
          },
        ],
      },
      include: {
        professional: true,
      },
    });
    if (!user) {
      throw new UserNotFoundExecption();
    }
    if (!user.isEmailVerified) {
      const requestActivation = new RequestActivation(
        this.database,
        this.emailService,
        this.jwt,
      );
      await requestActivation.request(user);
    }
    if (!this.isPassMatch(user.password, userData.password)) {
      this.logger.error(
        `Wrong Password from ${userData.unique} to ${user.email}`,
      );
      throw new UnauthorizedException({
        message: 'Senha incorrecta, tente novamente',
      });
    }

    const ONE_WEEK = 60 * 60 * 24 * 7;
    const [acessToken, refreshToken] = [
      this.jwt.sign(
        {
          sub: user.id,
        },
        {
          expiresIn: '1h',
        },
      ),
      this.jwt.sign(
        {
          sub: user.id,
          role: user.role,
        },
        {
          expiresIn: '1m',
        },
      ),
    ];
    await Promise.all([
      this.cache.set(`userProfile-${user.id}`, user, 60 * 60 * 1),
      this.cache.set(`userRefreshToken-${user.id}`, refreshToken, ONE_WEEK),
    ]);

    return {
      user,
      acessToken,
    };
  }

  private isPassMatch(hash: string, plainText: string): boolean {
    return this.encript.verify(hash, plainText);
  }
}
