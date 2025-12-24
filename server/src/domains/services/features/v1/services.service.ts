import { CreateServiceTemplateDto } from './../../dto/create-service.dto';
import { SlugService } from '@core/shared/utils/services/Slug/slug.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import PrismaService from '@infra/database/prisma.service';
import { UpdateServiceTemplateDto } from '@domains/services/dto/update-service.dto';
import { ProfessionalServiceRequestDto } from '@domains/services/dto/professional-service-request.dto';
import { ca } from 'zod/v4/locales';
import { ApprovalStatus } from '@prisma/client';

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
    try {
      const serviceTemplate = await this.database.serviceTemplate.update({
        where: {
          id: id,
        },
        data: {
          ...data,
        },
      });

      return serviceTemplate;
    } catch (error) {
      if (error.code == "P2025") {
        throw new NotFoundException("Servico nao encontrado.")
      }
      throw new BadRequestException("Erro ao buscar o servico")
    }
  }

  async remove(id: number) {
    try {
      const serviceTemplate = await this.database.serviceTemplate.delete({
        where: {
          id: id,
        },
      });

      return serviceTemplate; 
    } catch (error) {
      if (error.code == "P2025") {
        throw new NotFoundException("Servico nao encotrado.")
      }

      throw new BadRequestException("Erro ao processar o servico.")
    }
  }

  async findByCategory(categoryId: number) {
    try {
      const serviceTemplate = await this.database.serviceTemplate.findMany({
        where: {
          categoryId: categoryId,
          isActive: true,
        },
      });

      if (serviceTemplate.length <= 0) {
        throw new NotFoundException("Servicos nao encontrados.")
      }

      return serviceTemplate;
    } catch (error) {

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException("Erro ao processar os servicos")
    }
    
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

  async findProfessionalServiceRequest(userId: number ) {
    try{
      const psr = await this.database.professionalServiceRequest.findMany()

      if (psr.length <= 0) {
        throw new NotFoundException("Nenhuma requisicao de servico encontrada para profissionais.")
      }

      return psr;

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException("Erro ao buscar requisicoes de servico para profissionais.")
    }
  }

  async deleteProfessionalServiceRequest(userId: number, requestId: number) {
    try {

      const firstPsr = await this.database.professionalServiceRequest.findFirst({  
        where: {
          id: requestId
        }
      })

      if (!firstPsr) {
        throw new NotFoundException("Requisicao de servico profissional nao encontrada.")
      }
      const psr = await this.database.professionalServiceRequest.delete({
        where: {
          id: requestId
        }
      })  

      return psr;

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException("Erro ao deletar a requisicao de servico profissional.")
    }
  }

  async updateProfessionalServiceRequestStatus(userId: number, requestId: number, dto: ProfessionalServiceRequestDto) {
    const psr = await this.database.professionalServiceRequest.findFirst({
      where: {
        id: requestId
      }
    })

    if (!psr) {
      throw new NotFoundException("Requisicao de servico profissional nao encontrada.")
    }
    
    try {
      const psr = await this.database.professionalServiceRequest.update({
        where: {
          id: requestId
        },
        data: {
          status: dto.status,
          adminNotes: dto.adminNotes
        }
      })

      return psr;

    } catch (error) { 
      throw new BadRequestException("Erro ao atualizar o status da requisicao de servico profissional.")  
    }
  }
}
