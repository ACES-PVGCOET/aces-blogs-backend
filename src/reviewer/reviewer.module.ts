import { Module } from '@nestjs/common';

import { BlogsModule } from '../blogs/blogs.module.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import { ReviewerController } from './reviewer.controller.js';

@Module({
  imports: [BlogsModule],
  controllers: [ReviewerController],
  providers: [RolesGuard],
})
export class ReviewerModule {}