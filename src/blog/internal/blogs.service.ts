import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  BlogStatus,
  UserRole,
  UserStatus,
} from '@prisma/client';

import { PrismaService } from '../../prisma';
import { BlogAuditService } from './blog-audit.service';
import { ReviewActionDto } from '../http/dto/review-decision.dto';

const REVIEW_QUEUE_STATUSES: BlogStatus[] = [BlogStatus.UNDER_REVIEW];

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  if (value !== null && typeof value === 'object') {
    const object = value as Record<string, unknown>;
    const keys = Object.keys(object).sort();

    return `{${keys
      .map((key) => `${JSON.stringify(key)}:${stableStringify(object[key])}`)
      .join(',')}}`;
  }

  return JSON.stringify(value);
}

@Injectable()
export class BlogsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: BlogAuditService,
  ) {}

  private async requireUser(
    userId: string,
    allowedRoles?: UserRole[],
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException('An active account is required');
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return user;
  }

  private async findBlog(blogId: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
      include: { author: true },
    });

    if (!blog || blog.deletedAt || blog.status === BlogStatus.DELETED) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  private async requireReviewerAccess(
    blogId: string,
    userId: string,
  ) {
    const user = await this.requireUser(userId, [
      UserRole.REVIEWER,
      UserRole.ADMIN,
    ]);

    const blog = await this.findBlog(blogId);

    if (blog.authorId === userId) {
      throw new ForbiddenException('You cannot review your own blog');
    }

    if (blog.author.role === UserRole.ADMIN) {
      throw new ForbiddenException('Admin-authored blogs are not reviewable');
    }

    if (
      user.role !== UserRole.ADMIN &&
      blog.reviewerId !== userId
    ) {
      throw new ForbiddenException('This review is not assigned to you');
    }

    return { user, blog };
  }

  private async getContent(blogId: string, version: number) {
    const content = await this.prisma.blogContent.findUnique({
      where: {
        blogId_version: { blogId, version },
      },
    });

    if (!content) {
      throw new NotFoundException(
        `Content version ${version} was not found`,
      );
    }

    return content;
  }

  async getBlogsToReview(userId: string) {
    await this.requireUser(userId, [UserRole.REVIEWER, UserRole.ADMIN]);

    return this.prisma.blog.findMany({
      where: {
        status: BlogStatus.UNDER_REVIEW,
        reviewerId: null,
        deletedAt: null,
        authorId: { not: userId },
        author: {
          is: {
            role: { not: UserRole.ADMIN },
          },
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        authorId: true,
        status: true,
        latestRevisionVersion: true,
        latestPublishedVersion: true,
        modifiedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            profileImg: true,
          },
        },
      },
      orderBy: { modifiedAt: 'asc' },
    });
  }

  async startReview(
    userId: string,
    blogId: string,
    dto: ReviewActionDto,
  ) {
    await this.requireUser(userId, [UserRole.REVIEWER, UserRole.ADMIN]);

    const blog = await this.findBlog(blogId);

    if (blog.authorId === userId) {
      throw new ForbiddenException('You cannot review your own blog');
    }

    if (blog.author.role === UserRole.ADMIN) {
      throw new ForbiddenException('Admin-authored blogs cannot enter review');
    }

    if (blog.status !== BlogStatus.UNDER_REVIEW || blog.reviewerId !== null) {
      throw new ConflictException('Blog is not available for review');
    }

    if (blog.latestRevisionVersion !== dto.expectedVersion) {
      throw new ConflictException('The revision has changed. Reload first');
    }

    return this.prisma.$transaction(async (tx) => {
      const result = await tx.blog.updateMany({
        where: {
          id: blogId,
          status: BlogStatus.UNDER_REVIEW,
          reviewerId: null,
          latestRevisionVersion: dto.expectedVersion,
          deletedAt: null,
        },
        data: {
          reviewerId: userId,
        },
      });

      if (result.count !== 1) {
        throw new ConflictException(
          'Another reviewer or writer changed this blog',
        );
      }

      await this.audit.log(tx, {
        blogId,
        action: 'REVIEW_STARTED',
        performedBy: userId,
      });

      return tx.blog.findUniqueOrThrow({ where: { id: blogId } });
    });
  }

  async getComparison(userId: string, blogId: string) {
    const { blog } = await this.requireReviewerAccess(blogId, userId);

    if (blog.status !== BlogStatus.UNDER_REVIEW) {
      throw new ConflictException('Blog is not currently under review');
    }

    const draft = await this.getContent(
      blogId,
      blog.latestRevisionVersion,
    );

    if (blog.latestPublishedVersion === null) {
      return {
        blogId,
        publishedVersion: null,
        draftVersion: draft.version,
        publishedContent: null,
        draftContent: draft.content,
        hasChanges: true,
      };
    }

    // Same version means there is no comparison difference.
    if (blog.latestPublishedVersion === blog.latestRevisionVersion) {
      return {
        blogId,
        publishedVersion: blog.latestPublishedVersion,
        draftVersion: draft.version,
        publishedContent: draft.content,
        draftContent: draft.content,
        hasChanges: false,
      };
    }

    const published = await this.getContent(
      blogId,
      blog.latestPublishedVersion,
    );

    return {
      blogId,
      publishedVersion: published.version,
      draftVersion: draft.version,
      publishedContent: published.content,
      draftContent: draft.content,
      hasChanges:
        stableStringify(published.content) !== stableStringify(draft.content),
    };
  }

  async approveAndPublish(
    userId: string,
    blogId: string,
    dto: ReviewActionDto,
  ) {
    const { blog } = await this.requireReviewerAccess(blogId, userId);

    if (blog.status !== BlogStatus.UNDER_REVIEW) {
      throw new ConflictException('Blog is not currently under review');
    }

    if (blog.latestRevisionVersion !== dto.expectedVersion) {
      throw new ConflictException('Revision changed. Reload before publishing');
    }

    await this.getContent(blogId, dto.expectedVersion);

    return this.prisma.$transaction(async (tx) => {
      const result = await tx.blog.updateMany({
        where: {
          id: blogId,
          status: BlogStatus.UNDER_REVIEW,
          latestRevisionVersion: dto.expectedVersion,
          reviewerId: blog.reviewerId,
          deletedAt: null,
        },
        data: {
          status: BlogStatus.PUBLISHED,
          latestPublishedVersion: dto.expectedVersion,
          publishedAt: new Date(),
        },
      });

      if (result.count !== 1) {
        throw new ConflictException(
          'Blog changed during review. Reload and try again',
        );
      }

      await this.audit.log(tx, {
        blogId,
        action: `PUBLISHED_V${dto.expectedVersion}`,
        performedBy: userId,
      });

      return tx.blog.findUniqueOrThrow({ where: { id: blogId } });
    });
  }

  async rejectRevision(
    userId: string,
    blogId: string,
    dto: ReviewActionDto,
  ) {
    const { blog } = await this.requireReviewerAccess(blogId, userId);

    if (blog.status !== BlogStatus.UNDER_REVIEW) {
      throw new ConflictException('Blog is not currently under review');
    }

    if (blog.latestRevisionVersion !== dto.expectedVersion) {
      throw new ConflictException('Revision changed. Reload before rejecting');
    }

    return this.prisma.$transaction(async (tx) => {
      const result = await tx.blog.updateMany({
        where: {
          id: blogId,
          status: BlogStatus.UNDER_REVIEW,
          latestRevisionVersion: dto.expectedVersion,
          reviewerId: blog.reviewerId,
          deletedAt: null,
        },
        data: {
          status: BlogStatus.REVISION_DRAFT,
          reviewerId: null,
        },
      });

      if (result.count !== 1) {
        throw new ConflictException(
          'Blog changed during review. Reload and try again',
        );
      }

      await this.audit.log(tx, {
        blogId,
        action: `REVISION_REJECTED_V${dto.expectedVersion}`,
        performedBy: userId,
      });

      return {
        id: blogId,
        status: BlogStatus.REVISION_DRAFT,
        feedback: dto.feedback ?? null,
      };
    });
  }
}