import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import PrismaService from '@infra/database/prisma.service';

import slugify from 'slugify';

@Injectable()
export class CategoriesService {

  constructor(private readonly database: PrismaService){}

  async create(dto: CreateCategoryDto) {

    const slug = slugify(dto.title, {
      lower: true,
      strict: true,
    });

    const existingCategory = await this.database.category.findUnique({
      where: {
        slug: slug,
      },
    });

    if (existingCategory) {
      throw new BadRequestException('Category with this slug already exists');
    }

    const categories = await this.database.category.create({
          data: {
            title: dto.title,
            slug: slug,
            description: dto.description,
            tags: dto.tags ?? [],
            color: dto.color,
            order: dto.order,
            featured: dto.featured ?? true,
            coverUrl: dto.coverUrl,
            isActive: dto.isActive ?? true,
            stats: dto.stats ?? {},
          },
        });

    return  categories;
  }

  findAll() {
    return this.database.category.findMany({
      where: {
        isActive: true,
      }
    });
  }

  async findOne(id: number) {
    const category =  await this.database.category.findUnique({
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
    return category
  }
  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = this.database.category.update({
      where: {
        id: id,
      },
      data: {
        ...updateCategoryDto,
      },
    });
    return category;
  }

  async remove(id: number) {
    const category = await this.database.category.delete({
      where: {
        id: id,
      },
    });
    return category;
  }

  async changeState(id: number) {
    const category = await this.database.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    const updatedCategory = await this.database.category.update({
      where: { id },
      data: { isActive: !category.isActive },
    });

    return updatedCategory;
  }

}
