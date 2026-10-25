import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';

/**
 * blog-cat-api  (branch: feat/blog-cat-api)
 * Add controllers and PrismaService (global); add the Category model to prisma/schema.prisma here.
 * Don't edit app.module.ts: it already imports this module.
 */
@Module({
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
