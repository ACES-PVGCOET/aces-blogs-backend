import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';

import { BlogsController } from './blogs.controller.js';
import { PublicBlogsController } from './public-blogs.controller.js';
import { BlogsService } from './blogs.service.js';
import { BlogAuditService } from './blog-audit.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [
    BlogsController,
    PublicBlogsController,
  ],
  providers: [
    BlogsService,
    BlogAuditService,
    RolesGuard,
  ],
  exports: [
    BlogsService,
  ],
})
export class BlogsModule {}