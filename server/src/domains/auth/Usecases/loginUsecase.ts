import {
  UserNotFoundExecption,
  UserNotVerifiedExecption,
} from '@core/http/erros/user.error';
import { ILoginUseCase, ILoginUseCaseReturnType } from '@core/shared/types';
import { ICryptoInterface } from '@core/shared/utils/services/CryptoService/crypto.interface';
import { EmailServiceInterface } from '@core/shared/utils/services/EmailService/emailService.interface';
import PrismaService from '@infra/database/prisma.service';
import { Logger, UnauthorizedException } from '@nestjs/common';

export class LoginUseCase {
  constructor(
    private readonly database: PrismaService,
    private readonly encript: ICryptoInterface,
    private readonly emailService: EmailServiceInterface,
    private readonly logger: Logger,
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
    });
    if (!user) {
      throw new UserNotFoundExecption();
    }
    if (!user.isEmailVerified) {
      await this.emailService.send({
        subject: 'Activação de conta',
        to: user.email,
        html: ``,
        text: 'Novo link de activação da sua conta kissalo',
      });
      throw new UserNotVerifiedExecption();
    }
    if (!this.isPassMatch(user.password, userData.password)) {
      this.logger.error(
        `Wrong Password from ${userData.unique} to ${user.email}`,
      );
      throw new UnauthorizedException({
        message: 'Senha incorrecta, tente novamente',
      });
    }
    return {
      user,
    };
  }

  private isPassMatch(hash: string, plainText: string): boolean {
    return this.encript.verify(hash, plainText);
  }

  
}
