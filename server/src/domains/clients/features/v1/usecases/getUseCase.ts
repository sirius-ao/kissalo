import { UserNotFoundExecption } from '@core/http/erros/user.error';
import PrismaService from '@infra/database/prisma.service';
import { ForbiddenException } from '@nestjs/common';

export class GetclientUseCase {
  constructor(private readonly database: PrismaService) {}

  private async getAllClients() {
    const [total, items] = await Promise.all([
      this.database.user.count({
        where: {
          role: 'PROFESSIONAL',
        },
      }),
      this.database.user.findMany({
        where: {
          role: 'PROFESSIONAL',
        },
      }),
    ]);

    return {
      data: items,
    };
  }

  public async get(userId: number) {
    const user = await this.database.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        _count: true,
      },
      omit: {
        password: true,
      },
    });
    if (!user) {
      throw new UserNotFoundExecption();
    }
    if (user.role == 'CUSTOMER') {
      return {
        data: user,
      };
    } else if (user.role == 'ADMIN') {
      return await this.getAllClients();
    }
    throw new ForbiddenException(
      'Não possuis permissão para executar esta ação',
    );
  }
}
