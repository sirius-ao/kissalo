import { Global, Module } from '@nestjs/common';
import { CategoriesService } from './features/v1/categories.service';
import { CategoriesController } from './features/v1/categories.controller';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
@Global()
export class CategoriesModule {}
