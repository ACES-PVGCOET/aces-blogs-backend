import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { type AuthenticatedUser, CurrentUser, JwtAuthGuard, Roles, RolesGuard, UserRole } from '../../common';
import { AuthorBlogsService } from '../internal/author-blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { ListMyBlogsQueryDto } from './dto/list-my-blogs-query.dto';
import { SaveBlogContentDto } from './dto/save-blog-draft.dto';
import { UpdateBlogMetaDto } from './dto/update-blog-meta.dto';

/** Author-side blog API: logged in AND role WRITER. Reviewer and admin endpoints live elsewhere. */
@Controller('blogs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.WRITER)
export class BlogsController {
  constructor(private readonly authorBlogs: AuthorBlogsService) {}

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateBlogDto) {
    return this.authorBlogs.create(user.id, dto);
  }

  // static route before ':id' routes, so 'mine' is never parsed as an id
  @Get('mine')
  listMine(@CurrentUser() user: AuthenticatedUser, @Query() q: ListMyBlogsQueryDto) {
    return this.authorBlogs.listMine(user.id, q);
  }

  @Get(':id/draft')
  getDraft(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.authorBlogs.getDraft(user.id, id);
  }

  @Put(':id/content')
  saveContent(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string, @Body() dto: SaveBlogContentDto) {
    return this.authorBlogs.saveContent(user.id, id, dto);
  }

  @Patch(':id')
  updateMeta(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateBlogMetaDto) {
    return this.authorBlogs.updateMeta(user.id, id, dto);
  }

  @Post(':id/submit')
  @HttpCode(HttpStatus.OK)
  submit(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.authorBlogs.submit(user.id, id);
  }

  @Post(':id/archive')
  @HttpCode(HttpStatus.OK)
  archive(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.authorBlogs.archive(user.id, id);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.authorBlogs.remove(user.id, id);
  }
}
