import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { UserRole } from '../generated/prisma/client.js';
import { Roles } from '../auth/decorators/roles.decorators.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import { BlogsService } from '../blogs/blogs.service.js';
import { ReviewActionDto } from '../blogs/dto/review-decision.dto.js';

interface AuthRequest extends Request {
  user?: {
    id?: string;
    sub?: string;
  };
}

@Controller('reviewer')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.REVIEWER, UserRole.ADMIN)
export class ReviewerController {
  constructor(private readonly blogsService: BlogsService) {}

  private userId(req: AuthRequest): string {
    const id = req.user?.id ?? req.user?.sub;

    if (!id) {
      throw new UnauthorizedException('User ID missing from JWT');
    }

    return id;
  }

  @Get('blogs-to-review')
  getBlogsToReview(@Req() req: AuthRequest) {
    return this.blogsService.getBlogsToReview(this.userId(req));
  }

  @Post('blogs/:id/start-review')
  startReview(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: ReviewActionDto,
  ) {
    return this.blogsService.startReview(this.userId(req), id, dto);
  }

  @Get('blogs/:id/comparison')
  comparison(
    @Req() req: AuthRequest,
    @Param('id') id: string,
  ) {
    return this.blogsService.getComparison(this.userId(req), id);
  }

  @Post('blogs/:id/publish')
  publish(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: ReviewActionDto,
  ) {
    return this.blogsService.approveAndPublish(this.userId(req), id, dto);
  }

  @Post('blogs/:id/reject-revision')
  rejectRevision(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() dto: ReviewActionDto,
  ) {
    return this.blogsService.rejectRevision(this.userId(req), id, dto);
  }
}