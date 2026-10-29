import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BlogStatus } from '@prisma/client';
import { AuthenticatedUser, CurrentUser, JwtAuthGuard, Roles, RolesGuard, UserRole } from '../common';
import { BlogService } from './blog.service';
import { CreateBlogDto, StartReviewDto, UpdateBlogContentDto } from './dto';

@ApiTags('blogs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @Roles(UserRole.WRITER, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new blog' })
  @ApiResponse({ status: 201, description: 'Blog created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Slug conflict' })
  async create(
    @Body() dto: CreateBlogDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.blogService.create(dto, user);
  }

  @Get()
  @Roles(UserRole.READER, UserRole.WRITER, UserRole.REVIEWER, UserRole.ADMIN)
  @ApiOperation({ summary: 'List blogs with optional filters' })
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'status', enum: BlogStatus, required: false })
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('title') title?: string,
    @Query('category') category?: string,
    @Query('status', new ParseEnumPipe(BlogStatus, { optional: true })) status?: BlogStatus,
  ) {
    return await this.blogService.findAll({ title, category, status }, user);
  }

  @Get('review/queue')
  @Roles(UserRole.REVIEWER)
  @ApiOperation({ summary: 'Get blogs in the review queue' })
  async getReviewQueue() {
    return await this.blogService.getReviewQueue();
  }

  @Get(':id/review/comparison')
  @Roles(UserRole.REVIEWER)
  @ApiOperation({ summary: 'Compare published and latest revision versions' })
  async getReviewComparison(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.blogService.getReviewComparison(id);
  }

  @Patch(':id/review/start')
  @Roles(UserRole.REVIEWER)
  @ApiOperation({ summary: 'Start review for a blog' })
  async startReview(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: StartReviewDto,
  ) {
    return await this.blogService.startReview(id, dto);
  }

  @Patch(':id/review/reject')
  @Roles(UserRole.REVIEWER)
  @ApiOperation({ summary: 'Reject a blog in review' })
  async rejectReview(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.blogService.rejectReview(id);
  }

  @Put(':id/content')
  @Roles(UserRole.WRITER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update blog content (PUT)' })
  async updateContentPut(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateBlogContentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.blogService.updateContent(id, dto, user);
  }

  @Patch(':id/content')
  @Roles(UserRole.WRITER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update blog content (PATCH)' })
  async updateContentPatch(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateBlogContentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.blogService.updateContent(id, dto, user);
  }

  @Patch(':id/publish')
  @Roles(UserRole.WRITER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Publish blog' })
  async publish(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.blogService.publish(id, user);
  }

  @Patch(':id/archive')
  @Roles(UserRole.WRITER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Archive blog' })
  async archive(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.blogService.archive(id, user);
  }

  @Delete(':id')
  @Roles(UserRole.WRITER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Soft delete blog' })
  async delete(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.blogService.delete(id, user);
  }

  @Get(':id/content')
  @Roles(UserRole.READER, UserRole.WRITER, UserRole.REVIEWER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get blog content by version' })
  @ApiQuery({ name: 'version', required: false, type: Number })
  async getContent(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Query('version', new ParseIntPipe({ optional: true })) version?: any,
  ) {
    return await this.blogService.getContent(id, version, user);
  }

  @Get(':id')
  @Roles(UserRole.READER, UserRole.WRITER, UserRole.REVIEWER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get blog details by ID' })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.blogService.findOne(id, user);
  }
}
