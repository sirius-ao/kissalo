import { UserNotFoundExecption } from '@core/http/erros/user.error';
import { EmailServiceInterface } from '@core/shared/utils/services/EmailService/emailService.interface';
import PrismaService from '@infra/database/prisma.service';
import { JwtService } from '@nestjs/jwt';

export class RequestRecoveryUsecase {
  constructor(
    private readonly database: PrismaService,
    private readonly emailService: EmailServiceInterface,
    private readonly jwt: JwtService,
  ) {}

  public async request(unique: string) {
    const user = await this.database.user.findFirst({
      where: {
        OR: [
          {
            email: unique,
          },
          {
            phone: unique,
          },
        ],
      },
    });
    if (!user) {
      throw new UserNotFoundExecption();
    }
    const token = this.jwt.sign(
      { sub: user.id },
      {
        expiresIn: '5m',
      },
    );
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    const activationUrl = `https://kissalo.com/reset?token=${token}`;
    await Promise.all([
      this.database.verifications.upsert({
        create: {
          token,
          type: 'RESET_PASSWORD_REQUEST',
          expiresAt: now,
          isUsed: false,
          userId: user.id,
        },
        update: {
          token,
          type: 'RESET_PASSWORD_REQUEST',
          expiresAt: now,
          isUsed: false,
          userId: user.id,
        },
        where: {
          userId: user.id,
          type: 'RESET_PASSWORD_REQUEST',
        },
      }),
      this.emailService.send({
        subject: 'Recuperação de conta',
        to: user.email,
        html: ` <!DOCTYPE html>
  <html lang="pt">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Recuperação de Conta</title>
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
                    Recuperação de Conta
                  </h1>

                  <p style="color:#555;font-size:15px;line-height:1.6;">
                    Olá <strong>${user.firstName + ' ' + user.lastName}</strong>,<br/><br/>
                    Para recuperar a sua conta, clique no botão abaixo.
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
                      Recuperar Conta
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
        text: 'Novo link de recuperação da sua conta kissalo',
      }),
    ]);

    return {
      message:
        'Enviamos um link temporário para seu email, consulte para poder redefinir a sua senha',
    };
  }
}
