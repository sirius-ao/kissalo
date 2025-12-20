import { SlugAlreadyExistExecption } from '@core/http/erros/index.error';
import PrismaService from '@infra/database/prisma.service';
import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { ISlug } from './slug.interface';

@Injectable()
export class SlugService implements ISlug {
  constructor(private readonly database: PrismaService) {}

  public async gen(
    title: string,
    entity: 'category' | 'service',
  ): Promise<string> {
    let has: boolean = false;

    const slug = slugify(title, {
      lower: true,
      strict: true,
    });

    let item: { id: number };
    if (entity === 'category') {
      item = await this.database.category.findFirst({
        where: {
          slug,
        },
      });
    } else {
      item = await this.database.serviceTemplate.findFirst({
        where: {
          slug,
        },
      });
    }
    has = item?.id ? true : false;
    if (has) {
      throw new SlugAlreadyExistExecption(title, entity);
    }
    return slug;
  }
}
