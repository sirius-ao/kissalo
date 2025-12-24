import { CreateServiceTemplateDto } from './../../dto/create-service.dto';
import { SlugService } from '@core/shared/utils/services/Slug/slug.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import PrismaService from '@infra/database/prisma.service';
import { UpdateServiceTemplateDto } from '@domains/services/dto/update-service.dto';
import { ProfessionalServiceRequestDto } from '@domains/services/dto/professional-service-request.dto';
import { ProfissionalNotFoundExecption } from '@core/http/erros/profissional.error';

@Injectable()
export class ServicesService {
  constructor(
    private readonly database: PrismaService,
    private readonly SlugService: SlugService,
  ) {}

  async create(data: CreateServiceTemplateDto) {
    const [category, slug] = await Promise.all([
      this.database.category.findFirst({
        where: {
          id: data.categoryId,
        },
      }),
      this.SlugService.gen(data.title, 'service'),
    ]);

    if (!category) {
      throw new BadRequestException('Category not found');
    }
    const service = await this.database.serviceTemplate.create({
      data: {
        ...data,
        isFeatured: true,
        slug,
      },
    });
    return service;
  }

  async findAll() {
    return await this.database.serviceTemplate.findMany({
      where: {
        isActive: true,
      },
      include: {
        category: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.database.serviceTemplate.findFirst({
      where: {
        id: id,
        isActive: true,
      },
      include: {
        requests: {
          where: {
            status: 'APPROVED',
          },
          include: {
            professional: {
              include: {
                user: true,
              },
            },
          },
        },
        category: true,
      },
    });
  }

  async update(id: number, data: UpdateServiceTemplateDto) {
    const [category, slug] = await Promise.all([
      this.database.category.findFirst({
        where: {
          id: data.categoryId,
        },
      }),
      this.SlugService.gen(data.title, 'service'),
    ]);

    if (!category) {
      throw new BadRequestException('Category not found');
    }
    try {
      return await this.database.serviceTemplate.update({
        where: {
          id: id,
        },
        data: {
          ...data,
          slug,
        },
      });
    } catch (error) {
      throw new NotFoundException('Serviço não encontrado');
    }
  }

  async remove(id: number) {
    try {
      return await this.database.serviceTemplate.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new NotFoundException('Serviço não encontrado');
    }
  }

  async findByCategory(categoryId: number) {
    return await this.database.serviceTemplate.findMany({
      where: {
        categoryId: categoryId,
        isActive: true,
      },
    });
  }

  async professionalServicesRequest(serviceId: number, userId: number) {
    const isProfessional = await this.database.professional.findFirst({
      where: {
        userId: userId,
      },
      include: {
        user: true,
      },
    });

    if (!isProfessional) {
      throw new ProfissionalNotFoundExecption('');
    }
    const isprofessionalServiceRequestExists =
      await this.database.professionalServiceRequest.findFirst({
        where: {
          professionalId: isProfessional.id,
          serviceId: serviceId,
        },
      });
    if (isprofessionalServiceRequestExists) {
      throw new BadRequestException(
        'Ja existe uma requisicao pendente para este servico.',
      );
    }

    return await this.database.professionalServiceRequest.create({
      data: {
        serviceId: serviceId,
        professionalId: isProfessional.id,
        status: 'PENDING',
        adminNotes: 'Revisar o perfil do profissional',
      },
    });
  }
}
