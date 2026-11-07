import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { UserRole } from '../generated/prisma/client.js';
import { Roles } from '../auth/decorators/roles.decorators.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';

import { BlogsService } from './blogs.service.js';
import { CreateBlogDto } from './dto/create-blog.dto.js';
import { SaveBlogContentDto } from './dto/save-blog-draft.dto.js';

interface AuthRequest extends Request {
  user?: {
    id?: string;
    sub?: string;
  };
}

@Controller('blogs')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.WRITER, UserRole.ADMIN)
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  private userId(req: AuthRequest): string {
    const id = req.user?.id ?? req.user?.sub;

    if (!id) {
      throw new UnauthorizedException('User ID missing from JWT');
    }

    return id;
  }

  @Post()
  create(
    @Req() req: AuthRequest,
    @Body() dto: CreateBlogDto,
  ) {
    return this.blogsService.createBlog(this.userId(req), dto);
  }

  @Get(':id/editable')
  getEditable(
    @Req() req: AuthRequest,
    @Param('id') id: string,
  ) {
    return this.blogsService.getEditableBlog(this.userId(req), id);
  }

  @Patch(':id/content')
  saveContent(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: SaveBlogContentDto,
  ) {
    return this.blogsService.saveContent(this.userId(req), id, dto);
  }

  @Post(':id/archive')
  archive(
    @Req() req: AuthRequest,
    @Param('id') id: string,
  ) {
    return this.blogsService.archiveBlog(this.userId(req), id);
  }

  @Delete(':id')
  delete(
    @Req() req: AuthRequest,
    @Param('id') id: string,
  ) {
    return this.blogsService.deleteBlog(this.userId(req), id);
  }
}