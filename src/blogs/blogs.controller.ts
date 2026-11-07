import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  type AuthenticatedUser,
  CurrentUser,
  JwtAuthGuard,
  Roles,
  RolesGuard,
  UserRole,
} from '../common/index.js';

import { BlogsService } from './blogs.service.js';
import { CreateBlogDto } from './dto/create-blog.dto.js';
import { SaveBlogContentDto } from './dto/save-blog-draft.dto.js';
import { BlogQueryDto } from './dto/list-my-blogs-query.dto.js';

@ApiTags('Blogs (Author)')
@ApiBearerAuth()
@ApiCookieAuth('aces_session')
@Controller('blogs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.WRITER, UserRole.ADMIN)
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a blog draft',
    description: 'Initializes a new blog draft with version 1 content.',
  })
  @ApiResponse({ status: 201, description: 'Blog draft created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires WRITER or ADMIN' })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateBlogDto,
  ) {
    return this.blogsService.createBlog(user.id, dto);
  }

  // Placed before :id to prevent 'mine' matching as an ID parameter
  @Get('mine')
  @ApiOperation({
    summary: 'List my authored blogs',
    description: 'Returns paginated list of blogs authored by the current user.',
  })
  @ApiResponse({ status: 200, description: 'Author blog list retrieved' })
  listMine(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: BlogQueryDto,
  ) {
    return this.blogsService.listMyBlogs(user.id, query);
  }

  @Get(':id/editable')
  @ApiOperation({
    summary: 'Fetch editable draft with content',
    description: 'Returns the current working revision of the blog for editing.',
  })
  @ApiParam({ name: 'id', description: 'Blog UUID' })
  @ApiResponse({ status: 200, description: 'Editable blog revision retrieved' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  getEditable(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.blogsService.getEditableBlog(user.id, id);
  }

  @Patch(':id/content')
  @ApiOperation({
    summary: 'Save draft revision content',
    description: 'Saves blog content with optimistic locking (expectedVersion check).',
  })
  @ApiParam({ name: 'id', description: 'Blog UUID' })
  @ApiResponse({ status: 200, description: 'Draft revision saved' })
  @ApiResponse({ status: 409, description: 'Conflict - stale expectedVersion' })
  saveContent(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: SaveBlogContentDto,
  ) {
    return this.blogsService.saveContent(user.id, id, dto);
  }

  @Post(':id/archive')
  @ApiOperation({
    summary: 'Archive a blog',
    description: 'Marks an active blog as ARCHIVED.',
  })
  @ApiParam({ name: 'id', description: 'Blog UUID' })
  @ApiResponse({ status: 200, description: 'Blog archived' })
  @ApiResponse({ status: 409, description: 'Conflict - already archived or under review' })
  archive(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.blogsService.archiveBlog(user.id, id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Soft-delete a blog',
    description: 'Marks a blog as DELETED and hides it from lists.',
  })
  @ApiParam({ name: 'id', description: 'Blog UUID' })
  @ApiResponse({ status: 200, description: 'Blog deleted' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  delete(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.blogsService.deleteBlog(user.id, id);
  }
}
