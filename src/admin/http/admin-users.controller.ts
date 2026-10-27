import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { type AuthenticatedUser, CurrentUser, JwtAuthGuard, Roles, RolesGuard, UserRole } from '../../common';
import { AdminUsersService } from '../internal/admin-users.service';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

/** Admin-only user management. */
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminUsersController {
  constructor(private readonly users: AdminUsersService) {}

  @Get('users')
  list(@Query() q: ListUsersQueryDto) {
    return this.users.list(q);
  }

  // static route before ':id' routes
  @Get('reviewers')
  listReviewers() {
    return this.users.listReviewers();
  }

  @Get('users/:id')
  getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.users.getOne(id);
  }

  @Get('users/:id/blogs')
  blogsOf(@Param('id', ParseUUIDPipe) id: string) {
    return this.users.blogsOf(id);
  }

  @Patch('users/:id/role')
  updateRole(
    @CurrentUser() admin: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.users.updateRole(admin.id, id, dto.role);
  }

  @Patch('users/:id/status')
  updateStatus(
    @CurrentUser() admin: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.users.updateStatus(admin.id, id, dto.status);
  }
}
