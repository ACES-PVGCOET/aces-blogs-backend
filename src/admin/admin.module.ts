import { Module } from '@nestjs/common';
import { AdminBlogsController } from './http/admin-blogs.controller.js';
import { AdminUsersController } from './http/admin-users.controller.js';
import { AdminBlogsService } from './internal/admin-blogs.service.js';
import { AdminUsersService } from './internal/admin-users.service.js';
import { AdminSeedService } from './internal/admin-seed.service.js';

/**
 * admin-api (branch: feat/admin-module)
 * /admin/users, /admin/reviewers and /admin/blogs/*, ADMIN only.
 * PrismaModule is global, so PrismaService is injected without importing it here.
 */
@Module({
  controllers: [AdminUsersController, AdminBlogsController],
  providers: [AdminUsersService, AdminBlogsService, AdminSeedService],
  exports: [AdminUsersService, AdminBlogsService, AdminSeedService],
})
export class AdminModule {}
