import { UserNotFoundExecption } from '@core/http/erros/user.error';
import { ILoginUseCase, ILoginUseCaseReturnType } from '@core/shared/types';
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
    if (!this.isPassMatch(user.password, userData.password)) {
      this.logger.error(
        `Wrong Password from ${userData.unique} to ${user.email}`,
      );
      throw new UnauthorizedException({
        message: 'Senha incorrecta, tente novamente',
      });
    }
    const ONE_HOUR = 1000 * 60 * 60;
    const TWO_WEEKS = 1000 * 60 * 60 * 24 * 14;

    const [acessToken, refreshToken] = [
      this.jwt.sign(
        {
          sub: user.id,
        },
        {
          expiresIn: '7d',
        },
      ),

      this.jwt.sign(
        {
          sub: user.id,
          role: user.role,
        },
        {
          expiresIn: '14d',
        },
      ),
    ];

    const { password, ...userPublicData } = user;
    await Promise.all([
      this.cache.set(`userProfile-${user.id}`, userPublicData, ONE_HOUR),
      this.cache.set(`userRefreshToken-${user.id}`, refreshToken, TWO_WEEKS),
    ]);
    return {
      user: userPublicData,
      acessToken,
    };
  }

  private isPassMatch(hash: string, plainText: string): boolean {
    return this.encript.verify(hash, plainText);
  }
}
