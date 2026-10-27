import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { BlogStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma';
import { BlogAuditService } from './blog-audit.service';
import {
  assertCanMoveTo,
  assertEditable,
  assertSubmittable,
  IN_PLACE_STATUSES,
} from './blog-status';
import { PAGE_SIZE_DEFAULT } from './blog.constants';
import { toBlogMeta, toView } from './blog.mapper';
import { CreateBlogDto } from '../http/dto/create-blog.dto';
import { ListMyBlogsQueryDto } from '../http/dto/list-my-blogs-query.dto';
import { SaveBlogContentDto } from '../http/dto/save-blog-draft.dto';
import { UpdateBlogMetaDto } from '../http/dto/update-blog-meta.dto';
import { cleanLabel, escapeLike, normalizeTags, slugCandidate } from './slug.util';
import { EMPTY_DOC, hasContent, parseTiptapContent, TipTapDoc } from './validation/tiptap-content';

const SLUG_ATTEMPTS = 5;

export function isUniqueViolation(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

/**
 * Author-side operations. Every method only touches blogs owned by the calling user.
 *
 * Concurrency: no row locks. Every write is an `updateMany` whose WHERE repeats what we read
 * (author, status, expected latestRevisionVersion); `count !== 1` means somebody changed the blog
 * in between and the caller gets 409. A duplicate (blogId, version) is a P2002 and also becomes 409.
 */
@Injectable()
export class AuthorBlogsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: BlogAuditService,
  ) {}

  /** Create a DRAFT blog with content v1. */
  async create(userId: string, dto: CreateBlogDto) {
    const content = parseTiptapContent(dto.content ?? EMPTY_DOC);
    await this.assertCategoryAllowed(dto.category);

    for (let attempt = 0; attempt < SLUG_ATTEMPTS; attempt++) {
      const slug = slugCandidate(dto.title, attempt);
      // Cheap look first so the normal "slug taken" case does not abort a transaction;
      // the P2002 catch below only has to cover two creates racing for the same slug.
      if (await this.prisma.blog.findUnique({ where: { slug }, select: { id: true } })) continue;
      try {
        return await this.prisma.$transaction(async (tx) => {
          const blog = await tx.blog.create({
            data: {
              slug,
              title: dto.title.trim(),
              excerpt: dto.excerpt ?? null,
              thumbnailUrl: dto.thumbnailUrl ?? null,
              category: cleanLabel(dto.category),
              tags: normalizeTags(dto.tags),
              authorId: userId,
              status: BlogStatus.DRAFT,
              latestRevisionVersion: 1,
            },
          });
          await tx.blogContent.create({
            data: { blogId: blog.id, version: 1, content: content as unknown as Prisma.InputJsonValue, createdById: userId },
          });
          await this.audit.log(tx, { blogId: blog.id, action: 'BLOG_CREATED', performedBy: userId });
          return toView(blog, { version: 1, content });
        });
      } catch (error) {
        // The only unique constraint a brand-new row can hit is the slug: try the next candidate.
        if (!isUniqueViolation(error)) throw error;
      }
    }
    throw new ConflictException('Could not generate a unique slug, try a different title');
  }

  /**
   * Save editor content.
   *  - DRAFT / REVISION_DRAFT: overwrite the current version in place (autosave-safe, no version spam)
   *  - PUBLISHED: new version (+1), status becomes REVISION_DRAFT, the live version stays live
   *  - UNDER_REVIEW / ARCHIVED / DELETED: 409
   */
  async saveContent(userId: string, id: string, dto: SaveBlogContentDto) {
    const content = parseTiptapContent(dto.content);
    const blog = await this.findOwned(id, userId);
    assertEditable(blog.status);

    const expected = blog.latestRevisionVersion;
    if (dto.expectedVersion !== expected) {
      throw new ConflictException('The blog has a newer revision. Reload before saving');
    }

    // A version the public can see is never overwritten, whatever the status says.
    const overwrite =
      IN_PLACE_STATUSES.includes(blog.status) &&
      !(blog.latestPublishedVersion !== null && blog.latestPublishedVersion >= expected);
    const title = dto.title?.trim();

    return this.guarded(async () =>
      this.prisma.$transaction(async (tx) => {
        const where = { id, authorId: userId, status: blog.status, latestRevisionVersion: expected, deletedAt: null };

        if (overwrite) {
          this.expectOne(await tx.blog.updateMany({ where, data: { ...(title && { title }), modifiedAt: new Date() } }));
          this.expectOne(
            await tx.blogContent.updateMany({
              where: { blogId: id, version: expected },
              data: { content: content as unknown as Prisma.InputJsonValue },
            }),
          );
          const saved = await tx.blog.findUniqueOrThrow({ where: { id } });
          return toView(saved, { version: expected });
        }

        const next = expected + 1;
        this.expectOne(
          await tx.blog.updateMany({
            where,
            data: { latestRevisionVersion: next, status: BlogStatus.REVISION_DRAFT, ...(title && { title }), modifiedAt: new Date() },
          }),
        );
        await tx.blogContent.create({
          data: { blogId: id, version: next, content: content as unknown as Prisma.InputJsonValue, createdById: userId },
        });
        await this.audit.log(tx, { blogId: id, action: `CONTENT_SAVED_V${next}`, performedBy: userId });
        const saved = await tx.blog.findUniqueOrThrow({ where: { id } });
        return toView(saved, { version: next });
      }),
    );
  }

  /** Page-2 fields: title, excerpt, thumbnail, category, tags. Not versioned, so they change a live page at once. */
  async updateMeta(userId: string, id: string, dto: UpdateBlogMetaDto) {
    const blog = await this.findOwned(id, userId);
    assertEditable(blog.status);

    const data: Prisma.BlogUpdateManyMutationInput = {};
    if (dto.title !== undefined) data.title = dto.title.trim();
    if (dto.excerpt !== undefined) data.excerpt = dto.excerpt;
    if (dto.thumbnailUrl !== undefined) data.thumbnailUrl = dto.thumbnailUrl;
    if (dto.category !== undefined) {
      await this.assertCategoryAllowed(dto.category);
      data.category = cleanLabel(dto.category);
    }
    if (dto.tags !== undefined) data.tags = normalizeTags(dto.tags);
    if (Object.keys(data).length === 0) throw new BadRequestException('Nothing to update');

    return this.prisma.$transaction(async (tx) => {
      this.expectOne(
        await tx.blog.updateMany({
          where: {
            id,
            authorId: userId,
            status: blog.status,
            latestRevisionVersion: blog.latestRevisionVersion,
            deletedAt: null,
          },
          data: { ...data, modifiedAt: new Date() },
        }),
      );
      await this.audit.log(tx, { blogId: id, action: 'META_UPDATED', performedBy: userId });
      const saved = await tx.blog.findUniqueOrThrow({ where: { id } });
      return toView(saved, { version: saved.latestRevisionVersion });
    });
  }

  /**
   * "Proceed": send the latest draft to the reviewers. UNDER_REVIEW with no reviewer yet; a reviewer
   * picks it up. The status flip comes first so the row is locked while we check the content: a save
   * racing this call either lands before (and is what we check) or gets a 409.
   */
  async submit(userId: string, id: string) {
    const blog = await this.findOwned(id, userId);
    assertSubmittable(blog.status);
    if (!blog.category.trim()) throw new BadRequestException('Pick a category before submitting');

    const version = blog.latestRevisionVersion;
    return this.prisma.$transaction(async (tx) => {
      this.expectOne(
        await tx.blog.updateMany({
          where: { id, authorId: userId, status: blog.status, latestRevisionVersion: version, deletedAt: null },
          data: {
            status: BlogStatus.UNDER_REVIEW,
            reviewerId: null,
            reviewNote: null,
            submittedAt: new Date(),
            modifiedAt: new Date(),
          },
        }),
      );

      const row = await tx.blogContent.findUnique({ where: { blogId_version: { blogId: id, version } } });
      if (!row) throw new NotFoundException('Content not found');
      if (!hasContent(row.content as unknown as TipTapDoc)) {
        throw new BadRequestException('The blog is empty'); // rolls the status change back
      }

      await this.audit.log(tx, { blogId: id, action: `SUBMITTED_V${version}`, performedBy: userId });
      const saved = await tx.blog.findUniqueOrThrow({ where: { id } });
      return toView(saved, { version });
    });
  }

  /** Editor page loader: blog meta + latest version with content (and the reviewer's note, if rejected). */
  async getDraft(userId: string, id: string) {
    const blog = await this.findOwned(id, userId);
    const row = await this.prisma.blogContent.findUnique({
      where: { blogId_version: { blogId: id, version: blog.latestRevisionVersion } },
    });
    if (!row) throw new NotFoundException('Content not found');
    return toView(blog, { version: row.version, content: row.content as unknown as TipTapDoc });
  }

  /** Profile page list: my blogs. No content. DELETED ones are hidden unless status=DELETED is asked for. */
  async listMine(userId: string, q: ListMyBlogsQueryDto) {
    const page = q.page ?? 1;
    const limit = q.limit ?? PAGE_SIZE_DEFAULT;

    const where: Prisma.BlogWhereInput = {
      authorId: userId,
      status: q.status ?? { not: BlogStatus.DELETED },
      ...(q.q && { title: { contains: escapeLike(q.q), mode: 'insensitive' } }),
    };

    const [rows, total] = await Promise.all([
      this.prisma.blog.findMany({
        where,
        orderBy: [{ modifiedAt: 'desc' }, { id: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.blog.count({ where }),
    ]);
    return { items: rows.map(toBlogMeta), total, page, limit };
  }

  archive(userId: string, id: string) {
    return this.moveBlog(userId, id, BlogStatus.ARCHIVED);
  }

  /** Soft delete: the row stays, status = DELETED and deletedAt is set. */
  remove(userId: string, id: string) {
    return this.moveBlog(userId, id, BlogStatus.DELETED);
  }

  // ───────────────────────── helpers ─────────────────────────

  private async moveBlog(userId: string, id: string, to: 'ARCHIVED' | 'DELETED') {
    const blog = await this.findOwned(id, userId);
    assertCanMoveTo(blog.status, to);

    return this.prisma.$transaction(async (tx) => {
      this.expectOne(
        await tx.blog.updateMany({
          where: { id, authorId: userId, status: blog.status, deletedAt: null },
          data: {
            status: to,
            modifiedAt: new Date(),
            ...(to === BlogStatus.DELETED && { deletedAt: new Date() }),
          },
        }),
      );
      await this.audit.log(tx, {
        blogId: id,
        action: to === BlogStatus.DELETED ? 'BLOG_DELETED' : 'BLOG_ARCHIVED',
        performedBy: userId,
      });
      return { blog: toBlogMeta(await tx.blog.findUniqueOrThrow({ where: { id } })) };
    });
  }

  /** Missing, deleted and somebody else's blogs all look the same: 404 (no ID probing). */
  private async findOwned(id: string, userId: string) {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog || blog.deletedAt || blog.status === BlogStatus.DELETED || blog.authorId !== userId) {
      throw new NotFoundException('Blog not found');
    }
    return blog;
  }

  private expectOne(result: { count: number }): void {
    if (result.count !== 1) throw new ConflictException('The blog changed while saving. Reload and try again');
  }

  /** A duplicate (blogId, version) means another save claimed the version first. */
  private async guarded<T>(work: () => Promise<T>): Promise<T> {
    try {
      return await work();
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException('Another save created this version first. Reload and try again');
      }
      throw error;
    }
  }

  /**
   * Hook for the categories table. x's schema has none yet, so a category is plain text. Once the
   * model exists, look the (cleaned) name up here and throw BadRequestException when it is unknown.
   */
  private async assertCategoryAllowed(_category: string): Promise<void> {}
}
