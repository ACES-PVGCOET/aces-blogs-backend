import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublicListQueryDto } from './dto/public-blogs-query.dto';
import { PublicBlogsService } from '../internal/public-blogs.service';

/** Reader-side blog API. No login: anyone can read published blogs. */
@Controller('public/blogs')
export class PublicBlogsController {
  constructor(private readonly publicBlogs: PublicBlogsService) {}

  @Get()
  list(@Query() q: PublicListQueryDto) {
    return this.publicBlogs.list(q);
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.publicBlogs.getBySlug(slug);
  }
}
