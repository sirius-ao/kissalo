import PrismaService from '@infra/database/prisma.service';
import { CreateProfissionalDocumentsDto } from '../dto/create-profissional.dto';
import {
  AdminNotFoundExistExecption,
  UserNotFoundExecption,
} from '@core/http/erros/user.error';
import { ConflictException } from '@nestjs/common';
import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';

export class CreateProfissionalDocumentUseCase {
  constructor(
    private readonly database: PrismaService,
    private readonly notification: NotificationFactory,
  ) {}

  public async create(userId: number, data: CreateProfissionalDocumentsDto) {
    const [user, admin] = await Promise.all([
      this.database.user.findFirst({
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
      }),
      this.database.user.findFirst({
        where: {
          role: 'ADMIN',
        },
      }),
    ]);

    if (!admin) {
      throw new AdminNotFoundExistExecption();
    }
    if (!user || !user?.professional) {
      throw new UserNotFoundExecption();
    }

    if (user.status == 'ACTIVE') {
      throw new ConflictException('Seu perfil ja foi verificado');
    }
    const { docs, ...profissional } = user.professional;
    if (!docs || docs.length > 1) {
      await this.database.professionalDocument.upsert({
        create: {
          files: data.files,
          professionalId: profissional.id,
          status: 'PENDING',
        },
        update: {
          files: data.files,
          professionalId: profissional.id,
          status: 'PENDING',
        },
        where: {
          professionalId: profissional.id,
        },
      });
    } else {
      await this.database.professionalDocument.create({
        data: {
          files: data.files,
          professionalId: profissional.id,
          status: 'PENDING',
        },
      });
    }
    const Pushnotifier = this.notification.send('PUSH');
    const Emailnotifier = this.notification.send('EMAIL');
    await Promise.all([
      Emailnotifier.send(
        {
          message: `Pedido de verificação de perfil de prestador enviado, aguarde a aprovação do administrador do Kissalo`,
          title: 'Pedido de verificação ',
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
          message: `Pedido de verificação de perfil de prestador enviado, aguarde a aprovação do administrador do Kissalo`,
          title: 'Pedido de verificação ',
          type: 'ALERT',
          isRead: false,
          userId: userId,
          createdAt: new Date(),
          deepLink: '',
        },
        user,
      ),
      Emailnotifier.send(
        {
          message: `Pedido de verificação de perfil de prestador recebido, o prestador de serviços ${user.firstName + ' ' + user.lastName} esta aguardando pela verificação`,
          title: 'Pedido de verificação ',
          type: 'ALERT',
          isRead: false,
          userId: admin.id,
          createdAt: new Date(),
          deepLink: '',
        },
        admin,
      ),
      Pushnotifier.send(
        {
          message: `Pedido de verificação de perfil de prestador recebido, o prestador de serviços ${user.firstName + ' ' + user.lastName} esta aguardando pela verificação`,
          title: 'Pedido de verificação ',
          type: 'ALERT',
          isRead: false,
          userId: admin.id,
          createdAt: new Date(),
          deepLink: '',
        },
        admin,
      ),
    ]);
    return {
      message:
        'Seu pedido de verificão foi enviado ,aguarde pela verificação do administrador',
    };
  }
}
