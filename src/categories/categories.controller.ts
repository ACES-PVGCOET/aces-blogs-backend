import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import { Roles } from '../auth/decorators/roles.decorators.js';
import { UserRole } from '../generated/prisma/client.js';
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}
  @Get() list() { return this.categories.list(); }
  @Post() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateCategoryDto) { return this.categories.create(dto.name); }
  @Delete(':id') @UseGuards(JwtAuthGuard, RolesGuard) @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) { return this.categories.remove(id); }
}
