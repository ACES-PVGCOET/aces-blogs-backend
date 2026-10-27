import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma';
import { PAGE_SIZE_DEFAULT } from './blog.constants';
import { toPublicCard } from './blog.mapper';
import { escapeLike } from './slug.util';
import { PublicListQueryDto } from '../http/dto/public-blogs-query.dto';
import type { TipTapDoc } from './validation/tiptap-content';

/**
 * A blog is live when it has a published version and is not archived or deleted. A published blog
 * that is being revised (REVISION_DRAFT / UNDER_REVIEW) stays live and keeps showing its published version.
 */
const LIVE: Prisma.BlogWhereInput = {
  latestPublishedVersion: { not: null },
  status: { notIn: [BlogStatus.ARCHIVED, BlogStatus.DELETED] },
  deletedAt: null,
};

const AUTHOR = { select: { name: true, profileImg: true } } as const;

/** Reader-side reads. No login. */
@Injectable()
export class PublicBlogsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(q: PublicListQueryDto) {
    const page = q.page ?? 1;
    const limit = q.limit ?? PAGE_SIZE_DEFAULT;

    const where: Prisma.BlogWhereInput = {
      ...LIVE,
      ...(q.category && { category: { equals: escapeLike(q.category), mode: 'insensitive' } }),
      ...(q.tag && { tags: { has: q.tag.toLowerCase() } }),
      ...(q.q && { title: { contains: escapeLike(q.q), mode: 'insensitive' } }),
    };

    const [rows, total] = await Promise.all([
      this.prisma.blog.findMany({
        where,
        include: { author: AUTHOR },
        orderBy: [{ publishedAt: 'desc' }, { id: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.blog.count({ where }),
    ]);

    return { items: rows.map((b) => toPublicCard(b, b.author)), total, page, limit };
  }

  async getBySlug(slug: string) {
    const blog = await this.prisma.blog.findFirst({ where: { ...LIVE, slug }, include: { author: AUTHOR } });
    if (!blog || blog.latestPublishedVersion === null) throw new NotFoundException('Blog not found');

    const row = await this.prisma.blogContent.findUnique({
      where: { blogId_version: { blogId: blog.id, version: blog.latestPublishedVersion } },
    });
    if (!row) throw new NotFoundException('Blog not found');

    return { ...toPublicCard(blog, blog.author), content: row.content as unknown as TipTapDoc };
  }
}
