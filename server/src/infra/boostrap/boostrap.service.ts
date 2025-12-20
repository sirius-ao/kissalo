import { BcryptService } from '@core/shared/utils/services/CryptoService/crypto.service';
import PrismaService from '@infra/database/prisma.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class BoostratService implements OnModuleInit {
  private readonly ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  private readonly ADMIN_PASS = process.env.ADMIN_PASS;
  private logger = new Logger('Admin');
  constructor(
    private readonly database: PrismaService,
    private readonly bcript: BcryptService,
  ) {}

  async onModuleInit() {
    const hasAdmin = await this.database.user.findFirst({
      where: {
        role: 'ADMIN',
      },
    });

    if (hasAdmin) {
      this.logger.debug('Admin encotrado');
      return;
    }
    

    this.logger.verbose('Criando admin');
    const password = await this.bcript.encript(this.ADMIN_PASS);

    await this.database.user.create({
      data: {
        firstName: 'Kissalo',
        email: this.ADMIN_EMAIL,
        password,
        lastName: 'Admin',
        phone: '93555993',
        isEmailVerified: true,
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    });

    this.logger.verbose('Admin criado com sucesso');
  }
}
