import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlogsService } from './blogs.service.js';
import { BlogQueryDto } from './dto/list-my-blogs-query.dto.js';

@ApiTags('Blogs (Public)')
@Controller('blogs')
export class PublicBlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get('public')
  @ApiOperation({
    summary: 'List published blogs',
    description: 'Returns paginated list of public published blogs with author card details.',
  })
  @ApiResponse({ status: 200, description: 'Published blogs list retrieved' })
  listPublic(@Query() query: BlogQueryDto) {
    return this.blogsService.listPublishedBlogs(query);
  }

  @Get('public/:slug')
  @ApiOperation({
    summary: 'Get published blog by slug',
    description: 'Retrieves published blog content and metadata by URL slug.',
  })
  @ApiParam({ name: 'slug', description: 'Blog unique URL slug' })
  @ApiResponse({ status: 200, description: 'Published blog retrieved' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  getPublicBySlug(@Param('slug') slug: string) {
    return this.blogsService.getPublishedBySlug(slug);
  }

  @Get('slug/:slug/published')
  @ApiOperation({
    summary: 'Get published blog by slug (alias)',
    description: 'Alias route for retrieving published blog content.',
  })
  @ApiParam({ name: 'slug', description: 'Blog unique URL slug' })
  @ApiResponse({ status: 200, description: 'Published blog retrieved' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  getPublished(@Param('slug') slug: string) {
    return this.blogsService.getPublishedBySlug(slug);
  }
}
