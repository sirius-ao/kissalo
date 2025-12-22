import CacheService from '@infra/cache/cahe.service';
import PrismaService from '@infra/database/prisma.service';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ProfissionalNotFoundExecption } from '@core/http/erros/profissional.error';
import { UserNotFoundExecption } from '@core/http/erros/user.error';
import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';
import { NotificationType, User } from '@prisma/client';

export class UpdateWalletFacede {
  constructor(
    private readonly database: PrismaService,
    private readonly cache: CacheService,
    private readonly notifier: NotificationFactory,
  ) {}

  public async update(data: CreateWalletDto, walletId: number, userId: number) {
    const wallet = await this.database.wallet.findUnique({
      where: {
        id: walletId,
      },
      include: {
        professional: {
          include: {
            user: {
              omit: {
                password: true,
              },
            },
          },
        },
      },
    });

    if (!wallet) {
      throw new NotFoundException('Cartira não encontrada');
    }
    if (!wallet.professional) {
      throw new ProfissionalNotFoundExecption('');
    }
    if (!wallet.professional.user) {
      throw new UserNotFoundExecption();
    }

    if (wallet.professional.userId !== userId) {
      throw new ForbiddenException(
        'Precisas ter permisão para executar esta ação',
      );
    }
    await Promise.all([
      this.cache.delete(`wallets-${wallet.professional.userId}`),
      this.database.wallet.update({
        where: {
          id: wallet.id,
        },
        data,
      }),
    ]);
    return {
      sucess: true,
    };
  }

  public async toogleStatus(walletId: number) {
    const wallet = await this.database.wallet.findUnique({
      where: {
        id: walletId,
      },
      include: {
        professional: {
          include: {
            user: {
              omit: {
                password: true,
              },
            },
          },
        },
      },
    });
    if (!wallet) {
      throw new NotFoundException('Cartira não encontrada');
    }
    if (!wallet.professional) {
      throw new ProfissionalNotFoundExecption('');
    }
    if (!wallet.professional.user) {
      throw new UserNotFoundExecption();
    }

    const PushNotifier = this.notifier.send('PUSH');
    const EmailNotifier = this.notifier.send('EMAIL');
    const profissionalNotification = {
      title: `Carteira ${wallet.isActive ? 'aprovada' : 'reprovada'}`,
      message: `Sua carteira do banco ${wallet.bankName} foi  ${wallet.isActive ? 'aprovada' : 'reprovada'} pela equipa do kissalo`,
      type: NotificationType.SYSTEM,
      isRead: false,
      userId: wallet.professional.userId,
      createdAt: new Date(),
      deepLink: `/wallets/${wallet.id}`,
    };
    await Promise.all([
      PushNotifier.send(
        profissionalNotification,
        wallet.professional.user as User,
      ),
      EmailNotifier.send(
        profissionalNotification,
        wallet.professional.user as User,
      ),
      this.database.wallet.update({
        where: {
          id: wallet.id,
        },
        data: {
          isVerified: !wallet.isActive,
        },
      }),
      this.cache.delete(`wallets-${wallet.professional.userId}`),
    ]);
    return {
      sucess: true,
    };
  }
}
