import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../../dto/create-category.dto';
import { UpdateCategoryDto } from '../../dto/update-category.dto';
import PrismaService from '@infra/database/prisma.service';
import { SlugService } from '@core/shared/utils/services/Slug/slug.service';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly database: PrismaService,
    private readonly slugService: SlugService,
  ) {}

  async create(dto: CreateCategoryDto) {
    const slug = await this.slugService.gen(dto.title, 'category');
    const categories = await this.database.category.create({
      data: {
        title: dto.title,
        slug: slug,
        description: dto.description,
        color: dto.color,
        order: dto.order,
        isActive: true,
      },
    });
    return categories;
  }

  findAll() {
    return this.database.category.findMany({
      where: {
        isActive: true,
      },
    });
  }

  async findOne(id: number) {
    const category = await this.database.category.findUnique({
      where: {
        id: id,
        isActive: true,
      },
    });
    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.database.category.findUnique({
      where: {
        slug: slug,
        isActive: true,
      },
    });
    return category;
  }
  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.database.category.findFirst({
      where: { id },
    });

    if (!category) {
      throw new BadRequestException('Categoria não enontrada');
    }
    const updated = await this.database.category.update({
      where: {
        id: id,
      },
      data: {
        ...updateCategoryDto,
      },
    });
    return updated;
  }

  async remove(id: number) {
    const category = await this.database.category.findFirst({
      where: { id },
    });

    if (!category) {
      throw new BadRequestException('Categoria não enontrada');
    }
    await this.database.category.delete({
      where: {
        id: id,
      },
    });
    return category;
  }

  async changeState(id: number) {
    const category = await this.database.category.findFirst({
      where: { id },
    });

    if (!category) {
      throw new BadRequestException('Categoria não enontrada');
    }
    const updatedCategory = await this.database.category.update({
      where: { id },
      data: { isActive: !category.isActive },
    });
    return updatedCategory;
  }
}
