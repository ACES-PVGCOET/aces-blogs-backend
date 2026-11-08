import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service.js';
import {
  type AuthenticatedUser,
  CurrentUser,
  JwtAuthGuard,
  Roles,
  RolesGuard,
  UserRole,
} from '../common/index.js';
import { ListUsersQueryDto } from './dto/list-users-query.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@ApiTags('Users')
@ApiBearerAuth()
@ApiCookieAuth('aces_session')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Retrieves public profile details for the authenticated user.',
  })
  @ApiResponse({ status: 200, description: 'Profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.users.findById(user.id);
  }

  @Patch('me')
  @ApiOperation({
    summary: 'Update current user profile',
    description: 'Updates bio, LinkedIn URL, or profile image.',
  })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateMe(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.users.updateProfile(user.id, dto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'List users (Admin only)',
    description: 'Paginated user listing with filtering by role, status, and search query.',
  })
  @ApiResponse({ status: 200, description: 'Users list retrieved' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires ADMIN role' })
  list(
    @CurrentUser() admin: AuthenticatedUser,
    @Query() q: ListUsersQueryDto,
  ) {
    return this.users.getAllUsers(admin.id, q.page, q.limit, {
      role: q.role,
      status: q.status,
      search: q.search,
    });
  }
}
