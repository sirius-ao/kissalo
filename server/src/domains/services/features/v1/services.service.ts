import { SlugService } from '@core/shared/utils/services/Slug/slug.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateServiceDto } from '../../dto/update-service.dto';
import PrismaService from '@infra/database/prisma.service';

@Injectable()
export class ServicesService {
  constructor(
    private readonly database: PrismaService,
    private readonly SlugService: SlugService,
  ) {}

  async create(dto: UpdateServiceDto) {
    const category = await this.database.category.findFirst({
      where: {
        id: dto.categoryId,
      },
    });

    if (!category) {
      throw new BadRequestException('Category not found');
    }
    const service = await this.database.serviceTemplate.create({
      data: {
        title: dto.title,
        description: dto.description,
        keywords: dto.keywords,
        isActive: dto.isActive ?? true,
        basePrice: dto.basePrice,
        duration: dto.duration,
        categoryId: category.id,
        priceType: dto.priceType,
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

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    return await this.database.serviceTemplate.update({
      where: {
        id: id,
      },
      data: {
        ...updateServiceDto,
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
