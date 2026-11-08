import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { type AuthenticatedUser, CurrentUser, JwtAuthGuard, Roles, RolesGuard, UserRole } from '../../common/index.js';
import { AdminUsersService } from '../internal/admin-users.service.js';
import { ListUsersQueryDto } from './dto/list-users-query.dto.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';

/** Admin-only user management. */
@ApiTags('Admin Users')
@ApiBearerAuth()
@ApiCookieAuth('aces_session')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminUsersController {
  constructor(private readonly users: AdminUsersService) {}

  @Get('users')
  @ApiOperation({
    summary: 'List users with admin filters',
    description: 'Paginated user list with role, status, and search filters.',
  })
  @ApiResponse({ status: 200, description: 'User list retrieved' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires ADMIN' })
  list(@Query() q: ListUsersQueryDto) {
    return this.users.list(q);
  }

  // static route before ':id' routes
  @Get('reviewers')
  @ApiOperation({
    summary: 'List reviewer workload metrics',
    description: 'Returns active reviewers with counts of blogs under review and published.',
  })
  @ApiResponse({ status: 200, description: 'Reviewers list retrieved' })
  listReviewers() {
    return this.users.listReviewers();
  }

  @Get('users/:id')
  @ApiOperation({
    summary: 'Get single user by ID',
    description: 'Retrieves full details for a single user.',
  })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User details retrieved' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.users.getOne(id);
  }

  @Get('users/:id/blogs')
  @ApiOperation({
    summary: 'Get authored and reviewed blogs for a user',
    description: 'Returns lists of blogs authored and reviewed by the specified user.',
  })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User blogs retrieved' })
  blogsOf(@Param('id', ParseUUIDPipe) id: string) {
    return this.users.blogsOf(id);
  }

  @Patch('users/:id/role')
  @ApiOperation({
    summary: 'Mutate user role',
    description: 'Updates a user role and writes an immutable audit record to role_change_log.',
  })
  @ApiParam({ name: 'id', description: 'Target user UUID' })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({ status: 403, description: 'Cannot change own admin role' })
  @ApiResponse({ status: 409, description: 'Conflict on concurrent modification' })
  updateRole(
    @CurrentUser() admin: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.users.updateRole(admin.id, id, dto.role);
  }

  @Patch('users/:id/status')
  @ApiOperation({
    summary: 'Mutate user status',
    description: 'Updates user status (ACTIVE, BLOCKED, DELETED). Blocking invalidates active sessions.',
  })
  @ApiParam({ name: 'id', description: 'Target user UUID' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 403, description: 'Cannot block own admin account' })
  updateStatus(
    @CurrentUser() admin: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.users.updateStatus(admin.id, id, dto.status);
  }
}
