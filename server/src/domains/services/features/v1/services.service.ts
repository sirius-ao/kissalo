import { CreateServiceTemplateDto } from './../../dto/create-service.dto';
import { SlugService } from '@core/shared/utils/services/Slug/slug.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import PrismaService from '@infra/database/prisma.service';
import { UpdateServiceTemplateDto } from '@domains/services/dto/update-service.dto';
import { ProfessionalServiceRequestDto } from '@domains/services/dto/professional-service-request.dto';
import { ca } from 'zod/v4/locales';

@Injectable()
export class ServicesService {
  constructor(
    private readonly database: PrismaService,
    private readonly SlugService: SlugService,
  ) {}

  async create(data: CreateServiceTemplateDto) {
    const category = await this.database.category.findFirst({
      where: {
        id: data.categoryId,
      },
    });

    if (!category) {
      throw new BadRequestException('Category not found');
    }
    const service = await this.database.serviceTemplate.create({
      data: {
        ...data,
        isFeatured: true,
      },
    });
    return service;
  }

  async findAll() {
    return await this.database.serviceTemplate.findMany({
      where: {
        isActive: true,
      },
    });
  }

  async findOne(id: number) {
    try {
      const serviceTemplate = await this.database.serviceTemplate.findFirst({
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
          },
        });

      if (!serviceTemplate) {
        throw new NotFoundException("Servico nao encontrado.")
      }

      return serviceTemplate;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException("Erro ao buscar servico.")
    }
  
  }

  async update(id: number, data: UpdateServiceTemplateDto) {
    return await this.database.serviceTemplate.update({
      where: {
        id: id,
      },
      data: {
        ...data,
      },
    });
  }

  async remove(id: number) {
    return await this.database.serviceTemplate.delete({
      where: {
        id: id,
      },
    });
  }

  async findByCategory(categoryId: number) {
    return await this.database.serviceTemplate.findMany({
      where: {
        categoryId: categoryId,
        isActive: true,
      },
    });
  }

  async professionalServicesRequest(serviceId: number, userId: number, dto: ProfessionalServiceRequestDto) {
    
    const isProfessional = await this.database.professional.findFirst({
      where: {
        userId: userId
      },
      include: {
        user: true
      }
    }  
    )

    if (!isProfessional) {
      throw new NotFoundException("Usuario profissional nao encontrado.")
    }

    if (isProfessional.user.role !== 'PROFESSIONAL') {
      throw new BadRequestException("Usuario nao e um profissional.")
    }


    try {
      const isprofessionalServiceRequestExists = await this.database.professionalServiceRequest.findFirst({
        where: {
          professionalId: isProfessional.id,
          serviceId: serviceId,
        }
      }) 
      if (isprofessionalServiceRequestExists){
        throw new BadRequestException("Ja existe uma requisicao pendente para este servico.")
      }

      const psr = await this.database.professionalServiceRequest.create({
        data: {
          ...dto,
          serviceId: serviceId,
          professionalId: isProfessional.id
        }
      })
      return psr;

    } catch(error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException("Erro ao criar requisicao de servico para profissional.")
    }
  }
}
