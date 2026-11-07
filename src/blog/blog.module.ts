import { Module } from '@nestjs/common';
import { BlogsController } from './http/blogs.controller';
import { PublicBlogsController } from './http/public-blogs.controller';
import { AuthorBlogsService } from './internal/author-blogs.service';
import { BlogAuditService } from './internal/blog-audit.service';
import { BlogsService } from './internal/blogs.service';
import { PublicBlogsService } from './internal/public-blogs.service';

/**
 * blog-post-api (branch: feat/blog-module)
 * Author side (/blogs/*, WRITER only) and public reads (/public/blogs/*).
 * PrismaModule is global, so PrismaService is injected without importing it here.
 */
@Module({
  controllers: [BlogsController, PublicBlogsController],
  providers: [BlogsService, AuthorBlogsService, PublicBlogsService, BlogAuditService],
  exports: [BlogsService],
})
export class BlogModule {}
