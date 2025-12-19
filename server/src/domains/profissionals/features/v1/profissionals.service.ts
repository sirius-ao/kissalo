import { Injectable } from '@nestjs/common';
import { CreateProfessionalDto } from './dto/create-profissional.dto';
import { CreateProfissionalUseCase } from './useCase/createProfisionalUsecase';
import PrismaService from '@infra/database/prisma.service';
import { EmailService } from '@core/shared/utils/services/EmailService/Email.service';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from '@core/shared/utils/services/CryptoService/crypto.service';
import CacheService from '@infra/cache/cahe.service';
import { UserNotFoundExecption } from '@core/http/erros/user.error';
import { UpdateProfissionalUseCase } from './useCase/updateProfissionalUsecase';

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
  public async update(data: CreateProfessionalDto, userId: number) {
    const createUserFacede = new UpdateProfissionalUseCase(this.database);
    return await createUserFacede.update(data, userId);
  }

  public async findAll(
    page: number,
    limit: number,
    isVerified: boolean | undefined,
  ) {
    page = isNaN(page) || page == 0 ? 1 : page;
    limit = isNaN(limit) || limit == 0 ? 10 : limit;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (isVerified !== undefined) {
      where.isVerified = isVerified;
    }
    const [items, total] = await Promise.all([
      this.database.professional.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        where,
      }),
      this.database.professional.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);
    return {
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        lasPage: totalPages,
      },
    };
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

    if (!profissional) {
      throw new UserNotFoundExecption();
    }
    return profissional;
  }
  public async tooleStatus(id: number) {
    const profissional = await this.database.user.findFirst({
      where: {
        id,
        role: 'PROFESSIONAL',
      },
    });
    if (profissional) {
      const newCurrentStatus =
        profissional.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

      await this.database.user.update({
        data: {
          status: newCurrentStatus,
          professional: {
            update: {
              isVerified: newCurrentStatus === 'ACTIVE',
            },
          },
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
