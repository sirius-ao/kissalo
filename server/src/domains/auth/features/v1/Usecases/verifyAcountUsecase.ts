import { EmailServiceInterface } from '@core/shared/utils/services/EmailService/emailService.interface';
import PrismaService from '@infra/database/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export class VerifyAcountUseCase {
  constructor(
    private readonly database: PrismaService,
    private readonly emailService: EmailServiceInterface,
    private readonly jwt: JwtService,
  ) {}

  public async verify(token: string) {
    const dashBoardURl = 'http://localhost:3000/dash';
    try {
      this.jwt.verify(token);
    } catch (error) {
      throw new BadRequestException('Token expiprado solicite um novo');
    }
    const request = await this.database.verification.findFirst({
      where: {
        token,
      },
    });

    if (!request) {
      throw new BadRequestException('Pedido de verificação não encontrado');
    }

    if (request.isUsed) {
      throw new BadRequestException('Pedido ja usado');
    }
    const decodeToken = this.jwt.decode(token) as { sub: number };
    const userId = decodeToken.sub;
    try {
      const [user, _] = await this.database.$transaction([
        this.database.user.update({
          data: {
            isEmailVerified: true,
            status: 'ACTIVE',
          },
          where: {
            id: userId,
          },
        }),
        this.database.verification.update({
          data: {
            isUsed: true,
          },
          where: {
            token,
          },
        }),
      ]);
      await this.emailService.send({
        subject: 'Verificação de conta',
        to: user.email,
        html: ` <!DOCTYPE html>
  <html lang="pt">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Verificação de Conta</title>
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
                    Verificação de Conta
                  </h1>

                  <p style="color:#555;font-size:15px;line-height:1.6;">
                    Olá <strong>${user.firstName + ' ' + user.lastName}</strong>,<br/><br/>
                  A sua conta foi verificada
                  </p>
                  <p style="color:#555;font-size:15px;line-height:1.6;">
                   Clique no botão abixo pra acessar o seu painel
                  </p>
                      <div style="margin:30px 0;">
                    <a href="${dashBoardURl}"
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
                      Acessar Conta
                    </a>
                  </div>
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
        text: 'Verificação da sua conta kissalo',
      });

      return {
        sucess: true,
      };
    } catch (error) {
      throw new BadRequestException({
        message: 'Erro ao executar a açcão',
        cause: [
          'Usuário não existente',
          'Pedido de Verificação não encontrado',
        ],
      });
    }
  }
}
