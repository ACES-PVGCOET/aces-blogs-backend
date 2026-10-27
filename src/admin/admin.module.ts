import { Module } from '@nestjs/common';
import { AdminBlogsController } from './http/admin-blogs.controller';
import { AdminUsersController } from './http/admin-users.controller';
import { AdminBlogsService } from './internal/admin-blogs.service';
import { AdminUsersService } from './internal/admin-users.service';

/**
 * admin-api (branch: feat/admin-module)
 * /admin/users, /admin/reviewers and /admin/blogs/*, ADMIN only.
 * PrismaModule is global, so PrismaService is injected without importing it here.
 */
@Module({
  controllers: [AdminUsersController, AdminBlogsController],
  providers: [AdminUsersService, AdminBlogsService],
})
export class AdminModule {}
