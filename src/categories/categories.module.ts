import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';

/**
 * blog-cat-api  (branch: feat/blog-cat-api)
 * Add controllers and TypeOrmModule.forFeature([Category]) here.
 * Don't edit app.module.ts: it already imports this module.
 */
@Module({
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
