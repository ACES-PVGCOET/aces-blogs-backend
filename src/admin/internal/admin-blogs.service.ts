import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Blog, BlogStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma';
import { CreateAdminBlogDto } from '../http/dto/create-admin-blog.dto';
import { ListAdminBlogsQueryDto } from '../http/dto/list-admin-blogs-query.dto';
import { UpdateAdminBlogContentDto } from '../http/dto/update-admin-blog-content.dto';
import { UpdateAdminBlogMetaDto } from '../http/dto/update-admin-blog-meta.dto';
import { PAGE_SIZE_DEFAULT } from './admin.constants';
import { cleanLabel, escapeLike, normalizeTags, slugCandidate } from './slug.util';
import { hasContent, parseTiptapContent } from './validation/tiptap-content';

type Tx = Prisma.TransactionClient;

const SLUG_ATTEMPTS = 5;

/** Statuses an admin may publish from. PUBLISHED (already live), UNDER_REVIEW (reviewer's turn) and DELETED are not. */
const PUBLISHABLE: readonly BlogStatus[] = [
  BlogStatus.DRAFT,
  BlogStatus.REVISION_DRAFT,
  BlogStatus.REJECT,
  BlogStatus.ARCHIVED,
];

function isUniqueViolation(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

/**
 * Admin blog API. Decisions: admin edits skip review, and the admin is the author of blogs they create.
 * Every write is a guarded updateMany (it repeats the status and version that were read): count !== 1 means
 * someone else got there first and the caller gets 409. A published version is never overwritten.
 */
@Injectable()
export class AdminBlogsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(q: ListAdminBlogsQueryDto) {
    const page = q.page ?? 1;
    const limit = q.limit ?? PAGE_SIZE_DEFAULT;
    const where: Prisma.BlogWhereInput = {
      ...(q.status && { status: q.status }),
      ...(q.category && { category: { equals: escapeLike(q.category), mode: 'insensitive' } }),
      ...(q.authorId && { authorId: q.authorId }),
      ...(q.reviewerId && { reviewerId: q.reviewerId }),
      ...(q.q && { title: { contains: escapeLike(q.q), mode: 'insensitive' } }),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.blog.findMany({
        where,
        orderBy: [{ modifiedAt: 'desc' }, { id: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.blog.count({ where }),
    ]);
    return { items, total, page, limit };
  }

  /** Blog plus its latest revision content, for the edit screen. */
  async getOne(id: string) {
    const blog = await this.findOrFail(this.prisma, id);
    const row = await this.prisma.blogContent.findFirst({
      where: { blogId: id, version: blog.latestRevisionVersion },
    });
    return { ...blog, content: row?.content ?? null };
  }

  async create(adminId: string, dto: CreateAdminBlogDto) {
    const content = parseTiptapContent(dto.content);
    const attempts = dto.slug ? 1 : SLUG_ATTEMPTS;

    for (let attempt = 0; attempt < attempts; attempt++) {
      const slug = dto.slug ?? slugCandidate(dto.title, attempt);
      try {
        return await this.prisma.$transaction(async (tx) => {
          const blog = await tx.blog.create({
            data: {
              slug,
              title: cleanLabel(dto.title),
              excerpt: dto.excerpt || null,
              thumbnailUrl: dto.thumbnailUrl ?? null,
              category: cleanLabel(dto.category),
              tags: normalizeTags(dto.tags),
              authorId: adminId,
              status: BlogStatus.DRAFT,
              latestRevisionVersion: 1,
              latestPublishedVersion: null,
            },
          });
          await tx.blogContent.create({
            data: { blogId: blog.id, version: 1, content: content as unknown as Prisma.InputJsonValue, createdById: adminId },
          });
          await this.audit(tx, blog.id, 'ADMIN_CREATE', adminId);
          return blog;
        });
      } catch (error) {
        if (!isUniqueViolation(error)) throw error;
        if (dto.slug) throw new ConflictException('Slug is already in use.');
      }
    }
    throw new ConflictException('Could not generate a free slug. Try again.');
  }

  async updateMeta(adminId: string, id: string, dto: UpdateAdminBlogMetaDto) {
    const data: Prisma.BlogUncheckedUpdateManyInput = {
      ...(dto.title !== undefined && { title: cleanLabel(dto.title) }),
      ...(dto.slug !== undefined && { slug: dto.slug }),
      ...(dto.excerpt !== undefined && { excerpt: dto.excerpt || null }),
      ...(dto.thumbnailUrl !== undefined && { thumbnailUrl: dto.thumbnailUrl }),
      ...(dto.category !== undefined && { category: cleanLabel(dto.category) }),
      ...(dto.tags !== undefined && { tags: normalizeTags(dto.tags) }),
    };
    if (Object.keys(data).length === 0) throw new BadRequestException('Nothing to update.');

    try {
      await this.prisma.$transaction(async (tx) => {
        const { count } = await tx.blog.updateMany({
          where: { id, deletedAt: null, status: { not: BlogStatus.DELETED } },
          data: { ...data, modifiedAt: new Date() },
        });
        if (count !== 1) throw new NotFoundException('Blog not found');
        await this.audit(tx, id, 'ADMIN_EDIT_META', adminId);
      });
    } catch (error) {
      if (isUniqueViolation(error)) throw new ConflictException('Slug is already in use.');
      throw error;
    }
    return this.findOrFail(this.prisma, id);
  }

  /**
   * DRAFT: overwrite the current version in place (it was never public, so no version spam).
   * PUBLISHED / REVISION_DRAFT: new version that goes live at once (no review).
   * REJECT: new version, back to DRAFT (or REVISION_DRAFT if the blog was published before), not live.
   * ARCHIVED: new version, stays archived.
   * UNDER_REVIEW: 409 (the reviewer decides first). DELETED: 404.
   */
  async updateContent(adminId: string, id: string, dto: UpdateAdminBlogContentDto) {
    const content = parseTiptapContent(dto.content) as unknown as Prisma.InputJsonValue;

    return this.prisma.$transaction(async (tx) => {
      const blog = await this.findOrFail(tx, id);
      if (blog.status === BlogStatus.UNDER_REVIEW) {
        throw new ConflictException('Blog is under review. The reviewer has to decide first.');
      }
      if (dto.expectedVersion !== blog.latestRevisionVersion) {
        throw new ConflictException(`Blog is at version ${blog.latestRevisionVersion}. Reload and try again.`);
      }

      const guard = { id, status: blog.status, latestRevisionVersion: blog.latestRevisionVersion };
      const now = new Date();

      if (blog.status === BlogStatus.DRAFT) {
        const touched = await tx.blog.updateMany({ where: guard, data: { modifiedAt: now } });
        const written = await tx.blogContent.updateMany({
          where: { blogId: id, version: blog.latestRevisionVersion },
          data: { content, createdById: adminId },
        });
        if (touched.count !== 1 || written.count !== 1) throw new ConflictException('Blog was changed. Reload and try again.');
      } else {
        const next = blog.latestRevisionVersion + 1;
        const hadPublished = blog.latestPublishedVersion !== null;
        const data: Prisma.BlogUncheckedUpdateManyInput = {
          latestRevisionVersion: next,
          modifiedAt: now,
        };

        if (blog.status === BlogStatus.PUBLISHED || blog.status === BlogStatus.REVISION_DRAFT) {
          data.status = BlogStatus.PUBLISHED;
          data.latestPublishedVersion = next;
          data.reviewerId = adminId;
          data.publishedAt = blog.publishedAt ?? now;
          data.reviewNote = null;
        } else if (blog.status === BlogStatus.REJECT) {
          data.status = hadPublished ? BlogStatus.REVISION_DRAFT : BlogStatus.DRAFT;
        } else if (blog.status === BlogStatus.ARCHIVED && hadPublished) {
          data.latestPublishedVersion = next;
        }

        const { count } = await tx.blog.updateMany({ where: guard, data });
        if (count !== 1) throw new ConflictException('Blog was changed. Reload and try again.');
        try {
          await tx.blogContent.create({ data: { blogId: id, version: next, content, createdById: adminId } });
        } catch (error) {
          if (isUniqueViolation(error)) throw new ConflictException('Blog was changed. Reload and try again.');
          throw error;
        }
      }

      await this.audit(tx, id, 'ADMIN_EDIT_CONTENT', adminId);
      return this.findOrFail(tx, id);
    });
  }

  /** Publishes the latest revision. TODO: call CategoriesService.findOrCreate(category) once blog-cat-api is merged. */
  async publish(adminId: string, id: string) {
    return this.prisma.$transaction(async (tx) => {
      const blog = await this.findOrFail(tx, id);
      if (blog.status === BlogStatus.PUBLISHED) throw new ConflictException('Blog is already published.');
      if (blog.status === BlogStatus.UNDER_REVIEW) throw new ConflictException('Blog is under review.');
      if (!PUBLISHABLE.includes(blog.status)) throw new ConflictException(`A ${blog.status} blog cannot be published.`);

      const row = await tx.blogContent.findFirst({ where: { blogId: id, version: blog.latestRevisionVersion } });
      if (!row || !hasContent(row.content as never)) throw new BadRequestException('Blog has no content to publish.');

      const { count } = await tx.blog.updateMany({
        where: { id, status: blog.status, latestRevisionVersion: blog.latestRevisionVersion },
        data: {
          status: BlogStatus.PUBLISHED,
          latestPublishedVersion: blog.latestRevisionVersion,
          reviewerId: adminId,
          publishedAt: blog.publishedAt ?? new Date(),
          reviewNote: null,
          modifiedAt: new Date(),
        },
      });
      if (count !== 1) throw new ConflictException('Blog was changed. Reload and try again.');
      await this.audit(tx, id, 'ADMIN_PUBLISH', adminId);
      return this.findOrFail(tx, id);
    });
  }

  async softDelete(adminId: string, id: string) {
    await this.prisma.$transaction(async (tx) => {
      const { count } = await tx.blog.updateMany({
        where: { id, deletedAt: null, status: { not: BlogStatus.DELETED } },
        data: { status: BlogStatus.DELETED, deletedAt: new Date(), modifiedAt: new Date() },
      });
      if (count !== 1) throw new NotFoundException('Blog not found');
      await this.audit(tx, id, 'ADMIN_DELETE', adminId);
    });
    return { id, deleted: true };
  }

  /** A restored blog is never live by itself: DRAFT if it was never published, otherwise ARCHIVED (publish it again if wanted). */
  async restore(adminId: string, id: string) {
    return this.prisma.$transaction(async (tx) => {
      const blog = await tx.blog.findUnique({ where: { id } });
      if (!blog) throw new NotFoundException('Blog not found');
      if (blog.status !== BlogStatus.DELETED) throw new ConflictException('Blog is not deleted.');

      const { count } = await tx.blog.updateMany({
        where: { id, status: BlogStatus.DELETED },
        data: {
          status: blog.latestPublishedVersion === null ? BlogStatus.DRAFT : BlogStatus.ARCHIVED,
          deletedAt: null,
          modifiedAt: new Date(),
        },
      });
      if (count !== 1) throw new ConflictException('Blog was changed. Reload and try again.');
      await this.audit(tx, id, 'ADMIN_RESTORE', adminId);
      return this.findOrFail(tx, id);
    });
  }

  /** Not found, or soft deleted: both answer 404. */
  private async findOrFail(db: Tx, id: string): Promise<Blog> {
    const blog = await db.blog.findUnique({ where: { id } });
    if (!blog || blog.deletedAt || blog.status === BlogStatus.DELETED) throw new NotFoundException('Blog not found');
    return blog;
  }

  private audit(tx: Tx, blogId: string, action: string, performedBy: string) {
    return tx.blogAuditLog.create({ data: { blogId, action, performedBy } });
  }
}
