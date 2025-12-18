import { Injectable } from '@nestjs/common';
import { CreateProfessionalDto } from './dto/create-profissional.dto';
import { CreateProfissionalUseCase } from './useCase/createProfisionalUsecase';
import PrismaService from '@infra/database/prisma.service';
import { EmailService } from '@core/shared/utils/services/EmailService/Email.service';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from '@core/shared/utils/services/CryptoService/crypto.service';
import CacheService from '@infra/cache/cahe.service';

@Injectable()
export class ProfissionalsService {
  constructor(
    private readonly database: PrismaService,
    private readonly emailService: EmailService,
    private readonly jwt: JwtService,
    private readonly cache: CacheService,
    private readonly encript: BcryptService,
  ) {}

  public async create(data: CreateProfessionalDto) {
    const createUserFacede = new CreateProfissionalUseCase(
      this.database,
      this.emailService,
      this.encript,
      this.jwt,
    );
    return await createUserFacede.create(data);
  }

  findAll() {
    return `This action returns all profissionals`;
  }

  public async findOne(id: number) {
    const cachedUser = await this.cache.get(`Profissional-${id}`);
    if (cachedUser) {
      return {
        data: cachedUser,
      };
    }
    const profissional = await this.database.professional.findFirst({
      where: {
        id,
      },
      include: {
        user: {
          omit: {
            password: true,
          },
        },
        _count: {
          select: {
            bookings: true,
            docs: true,
            payments: true,
            reviews: true,
            serviceRequests: true,
            wallets: true,
          },
        },
      },
    });
    this.cache
      .set(`Profissional-${id}`, profissional, 60 * 10)
      .then()
      .catch();

    return profissional;
  }

  public async tooleStatus(id: number) {
    const profissional = await this.database.user.findFirst({
      where: {
        id,
      },
    });
    if (profissional) {
      const newCurrentStatus =
        profissional.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

      await this.database.user.update({
        data: {
          status: newCurrentStatus,
        },
        where: {
          id,
        },
      });
      return {
        messsage: `Profissional actualizado para ${newCurrentStatus == 'ACTIVE' ? 'Activo' : 'Inactivo'}`,
      };
    }
  }
}
