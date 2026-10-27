import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  BlogStatus,
  Prisma,
  UserRole,
  UserStatus,
} from '../generated/prisma/client.js';

import { PrismaService } from '../prisma/prisma.service.js';
import { BlogAuditService } from './blog-audit.service.js';
import { CreateBlogDto } from './dto/create-blog.dto.js';
import { SaveBlogContentDto } from './dto/save-blog-draft.dto.js';
import { ReviewActionDto } from './dto/review-decision.dto.js';
import { validateTiptapDocument } from './validation/tiptap-document.js';

const REVIEW_QUEUE_STATUSES: BlogStatus[] = [
  BlogStatus.DRAFT,
  BlogStatus.REVISION_DRAFT,
];

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

  private async requireAuthor(blogId: string, userId: string) {
    const blog = await this.findBlog(blogId);

    if (blog.authorId !== userId) {
      throw new ForbiddenException('Only the blog author can perform this action');
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

  async createBlog(userId: string, dto: CreateBlogDto) {
    await this.requireUser(userId, [UserRole.WRITER, UserRole.ADMIN]);

    let content: Record<string, unknown>;

    try {
      content = validateTiptapDocument(dto.content);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Invalid Tiptap content',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const blog = await tx.blog.create({
        data: {
          title: dto.title,
          slug: dto.slug,
          excerpt: dto.excerpt,
          thumbnailUrl: dto.thumbnailUrl,
          category: dto.category,
          tags: dto.tags,
          authorId: userId,
          status: BlogStatus.DRAFT,
          latestRevisionVersion: 1,
        },
      });

      await tx.blogContent.create({
        data: {
          blogId: blog.id,
          version: 1,
          content: content as Prisma.InputJsonValue,
          createdById: userId,
        },
      });

      await this.audit.log(tx, {
        blogId: blog.id,
        action: 'BLOG_CREATED',
        performedBy: userId,
      });

      return {
        ...blog,
        latestContent: content,
      };
    });
  }

  async getEditableBlog(userId: string, blogId: string) {
    await this.requireUser(userId, [UserRole.WRITER, UserRole.ADMIN]);

    const blog = await this.requireAuthor(blogId, userId);
    const content = await this.getContent(
      blogId,
      blog.latestRevisionVersion,
    );

    return {
      ...blog,
      latestContent: content.content,
      latestRevisionVersion: content.version,
    };
  }

  async saveContent(
    userId: string,
    blogId: string,
    dto: SaveBlogContentDto,
  ) {
    await this.requireUser(userId, [UserRole.WRITER, UserRole.ADMIN]);

    const blog = await this.requireAuthor(blogId, userId);

    if (
      !(
        [
          BlogStatus.DRAFT,
          BlogStatus.REVISION_DRAFT,
          BlogStatus.PUBLISHED,
        ] as BlogStatus[]
      ).includes(blog.status)
    ) {
      throw new ConflictException(
        'This blog cannot be edited in its current status',
      );
    }

    if (blog.latestRevisionVersion !== dto.expectedVersion) {
      throw new ConflictException(
        'The blog has a newer revision. Reload before saving',
      );
    }

    let content: Record<string, unknown>;

    try {
      content = validateTiptapDocument(dto.content);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Invalid Tiptap content',
      );
    }

    const nextVersion = dto.expectedVersion + 1;
    const nextStatus =
      blog.status === BlogStatus.PUBLISHED
        ? BlogStatus.REVISION_DRAFT
        : blog.status;

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.blog.updateMany({
        where: {
          id: blogId,
          authorId: userId,
          latestRevisionVersion: dto.expectedVersion,
          status: {
            in: [
              BlogStatus.DRAFT,
              BlogStatus.REVISION_DRAFT,
              BlogStatus.PUBLISHED,
            ],
          },
          deletedAt: null,
        },
        data: {
          latestRevisionVersion: nextVersion,
          status: nextStatus,
        },
      });

      if (updated.count !== 1) {
        throw new ConflictException(
          'The blog changed during saving. Reload and try again',
        );
      }

      await tx.blogContent.create({
        data: {
          blogId,
          version: nextVersion,
          content: content as Prisma.InputJsonValue,
          createdById: userId,
        },
      });

      await this.audit.log(tx, {
        blogId,
        action: `CONTENT_SAVED_V${nextVersion}`,
        performedBy: userId,
      });

      const savedBlog = await tx.blog.findUniqueOrThrow({
        where: { id: blogId },
      });

      return {
        ...savedBlog,
        latestContent: content,
      };
    });
  }

  async archiveBlog(userId: string, blogId: string) {
    await this.requireUser(userId, [UserRole.WRITER, UserRole.ADMIN]);

    const blog = await this.requireAuthor(blogId, userId);

    if (
      blog.status === BlogStatus.ARCHIVED ||
      blog.status === BlogStatus.DELETED
    ) {
      throw new ConflictException('Blog is already archived or deleted');
    }

    return this.prisma.$transaction(async (tx) => {
      const result = await tx.blog.updateMany({
        where: {
          id: blogId,
          authorId: userId,
          status: blog.status,
          deletedAt: null,
        },
        data: { status: BlogStatus.ARCHIVED },
      });

      if (result.count !== 1) {
        throw new ConflictException('Blog changed. Reload and try again');
      }

      await this.audit.log(tx, {
        blogId,
        action: 'BLOG_ARCHIVED',
        performedBy: userId,
      });

      return tx.blog.findUniqueOrThrow({ where: { id: blogId } });
    });
  }

  async deleteBlog(userId: string, blogId: string) {
    await this.requireUser(userId, [UserRole.WRITER, UserRole.ADMIN]);

    const blog = await this.requireAuthor(blogId, userId);

    return this.prisma.$transaction(async (tx) => {
      const result = await tx.blog.updateMany({
        where: {
          id: blogId,
          authorId: userId,
          status: blog.status,
          deletedAt: null,
        },
        data: {
          status: BlogStatus.DELETED,
          deletedAt: new Date(),
        },
      });

      if (result.count !== 1) {
        throw new ConflictException('Blog changed. Reload and try again');
      }

      await this.audit.log(tx, {
        blogId,
        action: 'BLOG_DELETED',
        performedBy: userId,
      });

      return { id: blogId, status: BlogStatus.DELETED };
    });
  }

  async getPublishedBySlug(slug: string) {
    const blog = await this.prisma.blog.findFirst({
      where: {
        slug,
        deletedAt: null,
        status: {
          notIn: [BlogStatus.ARCHIVED, BlogStatus.DELETED],
        },
        latestPublishedVersion: { not: null },
      },
    });

    if (!blog || blog.latestPublishedVersion === null) {
      throw new NotFoundException('Published blog not found');
    }

    const [content, author] = await Promise.all([
      this.getContent(blog.id, blog.latestPublishedVersion),
      this.prisma.user.findUnique({
        where: { id: blog.authorId },
        select: {
          id: true,
          name: true,
          profileImg: true,
          bio: true,
        },
      }),
    ]);

    return {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      thumbnailUrl: blog.thumbnailUrl,
      category: blog.category,
      tags: blog.tags,
      publishedAt: blog.publishedAt,
      revisionVersion: content.version,
      content: content.content,
      author,
    };
  }

  async getBlogsToReview(userId: string) {
    await this.requireUser(userId, [UserRole.REVIEWER, UserRole.ADMIN]);

    return this.prisma.blog.findMany({
      where: {
        status: { in: REVIEW_QUEUE_STATUSES },
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

    if (!REVIEW_QUEUE_STATUSES.includes(blog.status)) {
      throw new ConflictException('Blog is not available for review');
    }

    if (blog.latestRevisionVersion !== dto.expectedVersion) {
      throw new ConflictException('The revision has changed. Reload first');
    }

    return this.prisma.$transaction(async (tx) => {
      const result = await tx.blog.updateMany({
        where: {
          id: blogId,
          status: { in: REVIEW_QUEUE_STATUSES },
          latestRevisionVersion: dto.expectedVersion,
          deletedAt: null,
        },
        data: {
          status: BlogStatus.UNDER_REVIEW,
          reviewerId: userId,
          submittedAt: new Date(),
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