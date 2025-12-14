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
      include: {
        profisionalData: true,
      },
    });
    if (!user) {
      throw new UserNotFoundExecption();
    }

    if (!user.isEmailVerified) {
      const activationUrl = `https://kissalo.com/activate?token=${user.tokenToActivate}`;
      await this.emailService.send({
        subject: 'Activação de conta',
        to: user.email,
        html: ` <!DOCTYPE html>
  <html lang="pt">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Activação de Conta</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:40px 10px;">
            <table width="100%" max-width="600" cellpadding="0" cellspacing="0"
              style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
              
              <tr>
                <td style="padding:30px;text-align:center;">
                  <h1 style="color:#111;font-size:24px;margin-bottom:10px;">
                    Activação de Conta
                  </h1>

                  <p style="color:#555;font-size:15px;line-height:1.6;">
                    Olá <strong>${user.firstName + ' ' + user.lastName}</strong>,<br/><br/>
                    Seja bem-vindo à <strong>Kissalo</strong> 👋<br/>
                    Para activar a sua conta, clique no botão abaixo.
                  </p>

                  <div style="margin:30px 0;">
                    <a href="${activationUrl}"
                      style="
                        background:#111;
                        color:#ffffff;
                        padding:14px 32px;
                        text-decoration:none;
                        border-radius:6px;
                        font-size:16px;
                        font-weight:bold;
                        display:inline-block;
                      ">
                      Activar Conta
                    </a>
                  </div>

                  <p style="color:#777;font-size:13px;">
                    Se você não criou esta conta, ignore este email.
                  </p>

                  <p style="color:#aaa;font-size:12px;margin-top:30px;">
                    © ${new Date().getFullYear()} Kissalo. Todos os direitos reservados.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`,
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
