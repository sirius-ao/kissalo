import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateServiceDto } from '../../dto/update-service.dto';
import PrismaService from '@infra/database/prisma.service';


@Injectable()
export class ServicesService {

  constructor(private readonly database: PrismaService) {}

  async create(dto: UpdateServiceDto) {
    const category = await this.database.category.findUnique({
      where: {
        id: dto.categoryId
      }
    });

    if (!category) {
      throw new BadRequestException('Category not found');
    }
    const service = await this.database.serviceTemplate.create({
      data: {
        title: dto.title,
        description: dto.description,
        tags: dto.tags,
        isActive: dto.isActive ?? true,
        basePrice: dto.basePrice,
        duration: dto.duration,
        categoryId: category.id,
        priceType: dto.priceType

      }
    });
    return service;
  }

  async findAll() {
    return await this.database.serviceTemplate.findMany({
      where: {
        isActive: true,
      }
    });
  }

  async findOne(id: number) {
    return await this.database.serviceTemplate.findUnique({
      where: {
        id: id,
        isActive: true,
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
