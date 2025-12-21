import { CreateServiceTemplateDto } from './../../dto/create-service.dto';
import { SlugService } from '@core/shared/utils/services/Slug/slug.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import PrismaService from '@infra/database/prisma.service';
import { UpdateServiceTemplateDto } from '@domains/services/dto/update-service.dto';

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
<<<<<<< HEAD
        ...data,
        isFeatured: true,
=======
        title: dto.title,
        description: dto.description,
        keywords: dto.keywords,
        isActive: dto.isActive ?? true,
        basePrice: dto.basePrice,
        duration: dto.duration,
        categoryId: category.id,
        priceType: dto.priceType,
        isFeatured: true,
        
>>>>>>> 8969769 (feat : Slug Service)
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
      },
    });
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
}
