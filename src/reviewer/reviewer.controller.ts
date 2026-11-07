import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  type AuthenticatedUser,
  CurrentUser,
  JwtAuthGuard,
  Roles,
  RolesGuard,
  UserRole,
} from '../common/index.js';

import { BlogsService } from '../blogs/blogs.service.js';
import { ReviewActionDto } from '../blogs/dto/review-decision.dto.js';

@ApiTags('Reviewer')
@ApiBearerAuth()
@ApiCookieAuth('aces_session')
@Controller('reviewer')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.REVIEWER, UserRole.ADMIN)
export class ReviewerController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get('blogs-to-review')
  @ApiOperation({
    summary: 'Get review queue',
    description: 'Lists all blogs waiting in UNDER_REVIEW status.',
  })
  @ApiResponse({ status: 200, description: 'Review queue retrieved' })
  @ApiResponse({ status: 403, description: 'Forbidden - requires REVIEWER or ADMIN' })
  getBlogsToReview(@CurrentUser() user: AuthenticatedUser) {
    return this.blogsService.getBlogsToReview(user.id);
  }

  @Post('blogs/:id/start-review')
  @ApiOperation({
    summary: 'Claim a blog for review',
    description: 'Assigns current reviewer to the blog.',
  })
  @ApiParam({ name: 'id', description: 'Blog UUID' })
  @ApiResponse({ status: 200, description: 'Review started' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  startReview(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: ReviewActionDto,
  ) {
    return this.blogsService.startReview(user.id, id, dto);
  }

  @Get('blogs/:id/comparison')
  @ApiOperation({
    summary: 'Compare draft revision against live published version',
    description: 'Returns both latest published content and draft revision for side-by-side diffing.',
  })
  @ApiParam({ name: 'id', description: 'Blog UUID' })
  @ApiResponse({ status: 200, description: 'Comparison payload retrieved' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  comparison(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.blogsService.getComparison(user.id, id);
  }

  @Post('blogs/:id/publish')
  @ApiOperation({
    summary: 'Approve and publish blog',
    description: 'Promotes latest revision to published version and transitions status to PUBLISHED.',
  })
  @ApiParam({ name: 'id', description: 'Blog UUID' })
  @ApiResponse({ status: 200, description: 'Blog published successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  publish(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: ReviewActionDto,
  ) {
    return this.blogsService.approveAndPublish(user.id, id, dto);
  }

  @Post('blogs/:id/reject-revision')
  @ApiOperation({
    summary: 'Reject revision with feedback note',
    description: 'Transitions status to REJECT or REVISION_DRAFT and attaches reviewer feedback note.',
  })
  @ApiParam({ name: 'id', description: 'Blog UUID' })
  @ApiResponse({ status: 200, description: 'Revision rejected with note' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  rejectRevision(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: ReviewActionDto,
  ) {
    return this.blogsService.rejectRevision(user.id, id, dto);
  }
}
