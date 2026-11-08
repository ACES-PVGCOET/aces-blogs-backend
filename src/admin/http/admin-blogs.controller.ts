import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
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
import { type AuthenticatedUser, CurrentUser, JwtAuthGuard, Roles, RolesGuard, UserRole } from '../../common/index.js';
import { AdminBlogsService } from '../internal/admin-blogs.service.js';
import { CreateAdminBlogDto } from './dto/create-admin-blog.dto.js';
import { ListAdminBlogsQueryDto } from './dto/list-admin-blogs-query.dto.js';
import { UpdateAdminBlogContentDto } from './dto/update-admin-blog-content.dto.js';
import { UpdateAdminBlogMetaDto } from './dto/update-admin-blog-meta.dto.js';

/** Admin-only blog management: sees every status, edits without review. */
@ApiTags('Admin Blogs')
@ApiBearerAuth()
@ApiCookieAuth('aces_session')
@Controller('admin/blogs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminBlogsController {
  constructor(private readonly blogs: AdminBlogsService) {}

  @Get()
  @ApiOperation({
    summary: 'List all blogs across any status',
    description: 'Comprehensive blog listing for admins including DRAFT, UNDER_REVIEW, PUBLISHED, ARCHIVED, DELETED.',
  })
  @ApiResponse({ status: 200, description: 'Admin blogs retrieved' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires ADMIN' })
  list(@Query() q: ListAdminBlogsQueryDto) {
    return this.blogs.list(q);
  }

  @Post()
  @ApiOperation({
    summary: 'Admin create blog',
    description: 'Creates a blog directly with optional custom slug, tags, and initial content.',
  })
  @ApiResponse({ status: 201, description: 'Blog created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Conflict on slug' })
  create(@CurrentUser() admin: AuthenticatedUser, @Body() dto: CreateAdminBlogDto) {
    return this.blogs.create(admin.id, dto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single blog by ID (Admin)',
    description: 'Returns full blog metadata and latest content.',
  })
  @ApiParam({ name: 'id', description: 'Blog UUID' })
  @ApiResponse({ status: 200, description: 'Blog details retrieved' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.blogs.getOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Admin update blog metadata',
    description: 'Directly updates blog title, slug, excerpt, thumbnail, or tags.',
  })
  @ApiParam({ name: 'id', description: 'Blog UUID' })
  @ApiResponse({ status: 200, description: 'Blog metadata updated' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  updateMeta(
    @CurrentUser() admin: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAdminBlogMetaDto,
  ) {
    return this.blogs.updateMeta(admin.id, id, dto);
  }

  @Put(':id/content')
  @ApiOperation({
    summary: 'Admin update blog content',
    description: 'Saves or publishes blog content with version management.',
  })
  @ApiParam({ name: 'id', description: 'Blog UUID' })
  @ApiResponse({ status: 200, description: 'Content updated' })
  @ApiResponse({ status: 409, description: 'Conflict on stale expectedVersion' })
  updateContent(
    @CurrentUser() admin: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAdminBlogContentDto,
  ) {
    return this.blogs.updateContent(admin.id, id, dto);
  }

  @Post(':id/publish')
  @ApiOperation({
    summary: 'Admin publish blog',
    description: 'Directly publishes blog without entering review queue.',
  })
  @ApiParam({ name: 'id', description: 'Blog UUID' })
  @ApiResponse({ status: 201, description: 'Blog published' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  publish(@CurrentUser() admin: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.blogs.publish(admin.id, id);
  }

  @Post(':id/restore')
  @ApiOperation({
    summary: 'Restore deleted or archived blog',
    description: 'Restores a DELETED blog back to DRAFT or ARCHIVED.',
  })
  @ApiParam({ name: 'id', description: 'Blog UUID' })
  @ApiResponse({ status: 201, description: 'Blog restored' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  restore(@CurrentUser() admin: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.blogs.restore(admin.id, id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Admin soft-delete blog',
    description: 'Marks blog as DELETED and sets deletedAt timestamp.',
  })
  @ApiParam({ name: 'id', description: 'Blog UUID' })
  @ApiResponse({ status: 200, description: 'Blog deleted' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  remove(@CurrentUser() admin: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.blogs.softDelete(admin.id, id);
  }
}
