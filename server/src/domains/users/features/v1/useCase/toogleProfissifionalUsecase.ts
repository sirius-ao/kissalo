import { UserNotFoundExecption } from '@core/http/erros/user.error';
import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';
import PrismaService from '@infra/database/prisma.service';
import { ForbiddenException } from '@nestjs/common';

export class ToogleProfissionalUseCase {
  constructor(
    private readonly database: PrismaService,
    private readonly notification: NotificationFactory,
  ) {}

  public async toogle(userId: number, notes: string | undefined) {
    const user = await this.database.user.findFirst({
      where: {
        role: 'PROFESSIONAL',
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
    if (user || user?.professional) {
      const newCurrentStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      if (newCurrentStatus === 'ACTIVE') {
        const hasPendingdocs =
          await this.database.professionalDocument.findFirst({
            where: {
              professionalId: user.professional.id,
              status: 'PENDING',
            },
          });
        if (!hasPendingdocs) {
          throw new ForbiddenException('Documentos pendentes não encontrados');
        }
      }
      const Pushnotifier = this.notification.send('PUSH');
      const Emailnotifier = this.notification.send('EMAIL');
      const message = `Olá ${user.firstName + ' ' + user.lastName} , o seu pedido de verificação de perfil de prestador de serviço foi ${newCurrentStatus == 'ACTIVE' ? 'consedido com sucesso' : 'recusado'} ${newCurrentStatus == 'INACTIVE' && `**** OBS : ${notes} ****`} `;
      const title = 'Verificação de documentos';
      await Promise.all([
        Emailnotifier.send(
          {
            message,
            title,
            type: 'ALERT',
            isRead: false,
            userId: userId,
            createdAt: new Date(),
            deepLink: '',
          },
          user,
        ),
        Pushnotifier.send(
          {
            message,
            title,
            type: 'ALERT',
            isRead: false,
            userId: userId,
            createdAt: new Date(),
            deepLink: '',
          },
          user,
        ),
        this.database.user.update({
          data: {
            status: newCurrentStatus,
            professional: {
              update: {
                isVerified: newCurrentStatus === 'ACTIVE',
                docs: {
                  updateMany: {
                    data: {
                      status:
                        newCurrentStatus === 'ACTIVE' ? 'APPROVED' : 'REJECTED',
                      notes,
                    },
                    where: {
                      professionalId: user.professional.id,
                    },
                  },
                },
              },
            },
          },
          where: {
            id: userId,
          },
        }),
      ]);
      return {
        messsage: `Profissional actualizado para ${newCurrentStatus == 'ACTIVE' ? 'Activo' : 'Inactivo'}`,
      };
    }
    throw new UserNotFoundExecption();
  }
}
