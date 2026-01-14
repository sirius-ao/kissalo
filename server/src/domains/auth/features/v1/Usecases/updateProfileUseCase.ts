import { ICryptoInterface } from '@core/shared/utils/services/CryptoService/crypto.interface';
import PrismaService from '@infra/database/prisma.service';
import { UpateCredentials, UpdateProfileDto } from '../dto/create-auth.dto';
import {
  UserAlreadyExistExecption,
  UserNotFoundExecption,
} from '@core/http/erros/user.error';
import { ForbiddenException } from '@nestjs/common';
import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';
import { NotificationType } from '@prisma/client';
import CacheService from '@infra/cache/cahe.service';

export class UpdateProfileUseCase {
  constructor(
    private readonly database: PrismaService,
    private readonly encript: ICryptoInterface,
    private readonly notifier: NotificationFactory,
    private readonly cache: CacheService,
  ) {}

  public async updateCredentials(userid: number, data: UpateCredentials) {
    const user = await this.database.user.findFirst({
      where: {
        id: userid,
      },
    });

    if (!user) {
      throw new UserNotFoundExecption();
    }
    const isPasswordMatch = this.encript.verify(
      user.password,
      data.oldPassword,
    );

    const PushNotifier = this.notifier.send('PUSH');
    const EmailNotifier = this.notifier.send('EMAIL');
    const newPassword = this.encript.encript(data.password);
    if (isPasswordMatch) {
      const profissionalNotification = {
        title: `Senha alterada`,
        message: 'Sua senha foi modificada com sucesso',
        type: NotificationType.AUTH,
        isRead: false,
        userId: user.id,
        createdAt: new Date(),
        deepLink: '',
      };

      await Promise.all([
        this.database.user.update({
          where: {
            id: userid,
          },
          data: {
            password: newPassword,
          },
        }),
        PushNotifier.send(profissionalNotification, user),
        EmailNotifier.send(profissionalNotification, user),
        this.cache.delete(`userProfile-${user.id}`),
        this.cache.delete(`userR
      PushNotifier.send(profissionalNotification, user),
      EmailNotifier.send(profissionalNotification, user),efreshToken-${user.id}`),
      ]);
      return {
        sucess: true,
      };
    }
    const profissionalNotification = {
      title: `Tentativa de redefinição de senha`,
      message: 'Alguém entou redefinif a sua senha',
      type: NotificationType.AUTH,
      isRead: false,
      userId: user.id,
      createdAt: new Date(),
      deepLink: '',
    };

    await Promise.all([
      PushNotifier.send(profissionalNotification, user),
      EmailNotifier.send(profissionalNotification, user),
    ]);
    throw new ForbiddenException('Senhas não combinam');
  }

  public async updateProfile(userId: number, data: UpdateProfileDto) {
    const [user, alreadyExist] = await Promise.all([
      this.database.user.findFirst({
        where: {
          id: userId,
        },
      }),
      this.database.user.findFirst({
        where: {
          OR: [
            {
              email: data.email,
            },
            {
              phone: data.phone,
            },
          ],
        },
      }),
    ]);
    if (!user) {
      throw new UserNotFoundExecption();
    }

    if (alreadyExist && alreadyExist.id != userId) {
      throw new UserAlreadyExistExecption();
    }
    await Promise.all([
      this.database.user.update({
        where: {
          id: user.id,
        },
        data,
      }),
      this.cache.delete(`userProfile-${user.id}`),
    ]);
    return {
      sucess: true,
    };
  }
}
