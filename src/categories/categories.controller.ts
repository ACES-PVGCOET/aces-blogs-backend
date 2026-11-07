import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { JwtAuthGuard, Roles, RolesGuard, UserRole } from '../common/index.js';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'List categories',
    description: 'Retrieves all available blog categories in alphabetical order.',
  })
  @ApiResponse({ status: 200, description: 'Categories list retrieved' })
  list() {
    return this.categories.list();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiCookieAuth('aces_session')
  @ApiOperation({
    summary: 'Create category (Admin only)',
    description: 'Creates a new unique blog category.',
  })
  @ApiResponse({ status: 201, description: 'Category created' })
  @ApiResponse({ status: 409, description: 'Category already exists' })
  create(@Body() dto: CreateCategoryDto) {
    return this.categories.create(dto.name);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiCookieAuth('aces_session')
  @ApiOperation({
    summary: 'Delete category (Admin only)',
    description: 'Deletes category by ID. Blocked if active blogs currently reference the category.',
  })
  @ApiParam({ name: 'id', description: 'Category UUID' })
  @ApiResponse({ status: 200, description: 'Category deleted' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 409, description: 'Cannot delete category in use by active blogs' })
  remove(@Param('id') id: string) {
    return this.categories.remove(id);
  }
}
