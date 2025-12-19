import { EmailServiceInterface } from '@core/shared/utils/services/EmailService/emailService.interface';
import PrismaService from '@infra/database/prisma.service';
import { CreateProfissionalDocumentsDto } from '../dto/create-profissional.dto';
import { UserNotFoundExecption } from '@core/http/erros/user.error';
import { ForbiddenException } from '@nestjs/common';

export class CreateProfissionalVerificationUsecase {
  constructor(
    private readonly database: PrismaService,
    private readonly emailservice: EmailServiceInterface,
  ) {}

  public async create(userId: number, data: CreateProfissionalDocumentsDto) {
    const user = await this.database.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        professional: {
          include: {
            docs: true,
          },
        },
      },
    });
    if (!user) {
      throw new UserNotFoundExecption();
    }
    if (user.professional.docs.length >= 1) {
      throw new ForbiddenException('Você já enviou um pedido de verificação');
    }
    return await Promise.all([
      this.database.professionalDocument.create({
        data: {
          ...data,
          professionalId: user.professional.id,
        },
      }),
      this.emailservice.send({
        subject: 'Verificação de perfil de prestador de serviço',
        to: user.email,
        html: `
         <!DOCTYPE html>
  <html lang="pt">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Verificação de perfil de prestador de serviço</title>
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
                    Verificação de perfil de prestador de serviço
                  </h1>

                  <p style="color:#555;font-size:15px;line-height:1.6;">
                    Olá <strong>${user.firstName + ' ' + user.lastName}</strong>,<br/><br/>
                     👋<br/>
                   O seu perfil de prestador de serviço esta ser analizado
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
  </html>
        `,
        text: 'Verificação de perfil de prestador de serviço',
      }),
    ]);
  }
}
