import { Controller, Get, Param } from '@nestjs/common';
import { BlogsService } from './blogs.service.js';

@Controller('blogs')
export class PublicBlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get('slug/:slug/published')
  getPublished(@Param('slug') slug: string) {
    return this.blogsService.getPublishedBySlug(slug);
  }
}