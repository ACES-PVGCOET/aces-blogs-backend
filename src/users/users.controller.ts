import { Body, Controller, Get, Patch, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import { Roles } from '../auth/decorators/roles.decorators.js';
import { UserRole } from '../generated/prisma/client.js';
import { ListUsersQueryDto } from './dto/list-users-query.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

interface AuthRequest extends Request { user: { id: string } }
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}
  @Get('me') me(@Req() req: AuthRequest) { return this.users.findById(req.user.id); }
  @Patch('me') updateMe(@Req() req: AuthRequest, @Body() dto: UpdateProfileDto) { return this.users.updateProfile(req.user.id, dto); }
  @Get() @Roles(UserRole.ADMIN) list(@Req() req: AuthRequest, @Query() q: ListUsersQueryDto) {
    return this.users.getAllUsers(req.user.id, q.page, q.limit, { role: q.role, status: q.status, search: q.search });
  }
}
