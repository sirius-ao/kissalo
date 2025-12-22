import CacheService from '@infra/cache/cahe.service';
import PrismaService from '@infra/database/prisma.service';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { ProfissionalNotFoundExecption } from '@core/http/erros/profissional.error';
import { ConflictException } from '@nestjs/common';
import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';
import { AdminNotFoundExistExecption } from '@core/http/erros/user.error';
import { NotificationType } from '@prisma/client';

export class CreateWalletsFacede {
  constructor(
    private readonly database: PrismaService,
    private readonly cache: CacheService,
    private readonly notifier: NotificationFactory,
  ) {}

  public async create(data: CreateWalletDto, userId: number) {
    const [profissional, admin] = await Promise.all([
      this.database.professional.findUnique({
        where: { userId },
        include: {
          user: {
            omit: {
              password: true,
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
    if (!profissional) {
      throw new ProfissionalNotFoundExecption(``);
    }
    if (!admin) {
      throw new AdminNotFoundExistExecption();
    }
    try {
      const wallet = await this.database.wallet.create({
        data: {
          ...data,
          professionalId: profissional.id,
        },
      });

      const PushNotifier = this.notifier.send('PUSH');
      const EmailNotifier = this.notifier.send('EMAIL');
      const adminNotification = {
        title: 'Nova carteira',
        message: `Uma nova carteira foi registrada pelo prestador ${profissional.user.firstName + ' ' + profissional.user.lastName} e precisa de ser verificada`,
        type: NotificationType.SYSTEM,
        isRead: false,
        userId: admin.id,
        createdAt: new Date(),
        deepLink: `/wallets/${wallet.id}`,
      };
      await Promise.all([
        PushNotifier.send(adminNotification, admin),
        EmailNotifier.send(adminNotification, admin),
        await this.cache.delete(`wallets-${profissional.userId}`),
      ]);
      return {
        sucess: true,
      };
    } catch (error) {
      throw new ConflictException('Carteira já registrada');
    }
  }
}
