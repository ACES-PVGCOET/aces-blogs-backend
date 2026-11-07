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
import { type AuthenticatedUser, CurrentUser, JwtAuthGuard, Roles, RolesGuard, UserRole } from '../../common';
import { AdminBlogsService } from '../internal/admin-blogs.service';
import { CreateAdminBlogDto } from './dto/create-admin-blog.dto';
import { ListAdminBlogsQueryDto } from './dto/list-admin-blogs-query.dto';
import { UpdateAdminBlogContentDto } from './dto/update-admin-blog-content.dto';
import { UpdateAdminBlogMetaDto } from './dto/update-admin-blog-meta.dto';

/** Admin-only blog management: sees every status, edits without review. */
@Controller('admin/blogs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminBlogsController {
  constructor(private readonly blogs: AdminBlogsService) {}

  @Get()
  list(@Query() q: ListAdminBlogsQueryDto) {
    return this.blogs.list(q);
  }

  @Post()
  create(@CurrentUser() admin: AuthenticatedUser, @Body() dto: CreateAdminBlogDto) {
    return this.blogs.create(admin.id, dto);
  }

  @Get(':id')
  getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.blogs.getOne(id);
  }

  @Patch(':id')
  updateMeta(
    @CurrentUser() admin: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAdminBlogMetaDto,
  ) {
    return this.blogs.updateMeta(admin.id, id, dto);
  }

  @Put(':id/content')
  updateContent(
    @CurrentUser() admin: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAdminBlogContentDto,
  ) {
    return this.blogs.updateContent(admin.id, id, dto);
  }

  @Post(':id/publish')
  publish(@CurrentUser() admin: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.blogs.publish(admin.id, id);
  }

  @Post(':id/restore')
  restore(@CurrentUser() admin: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.blogs.restore(admin.id, id);
  }

  @Delete(':id')
  remove(@CurrentUser() admin: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.blogs.softDelete(admin.id, id);
  }
}
