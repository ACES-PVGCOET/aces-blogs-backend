import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { BlogStatus, Prisma, UserRole, UserStatus } from '@prisma/client';
import { PrismaService } from '../../prisma';
import { ListUsersQueryDto } from '../http/dto/list-users-query.dto';
import { PAGE_SIZE_DEFAULT } from './admin.constants';
import { escapeLike } from './slug.util';

/** Never return passwordHash or sessionVersion. */
const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  profileImg: true,
  linkedIn: true,
  bio: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

const BLOG_CARD_SELECT = {
  id: true,
  slug: true,
  title: true,
  category: true,
  status: true,
  authorId: true,
  reviewerId: true,
  latestRevisionVersion: true,
  latestPublishedVersion: true,
  publishedAt: true,
  createdAt: true,
  modifiedAt: true,
} satisfies Prisma.BlogSelect;

const BLOGS_PER_LIST = 20;

@Injectable()
export class AdminUsersService {
  constructor(private readonly prisma: PrismaService) {}

  async list(q: ListUsersQueryDto) {
    const page = q.page ?? 1;
    const limit = q.limit ?? PAGE_SIZE_DEFAULT;
    const search = q.search ? escapeLike(q.search) : undefined;
    const where: Prisma.UserWhereInput = {
      ...(q.role && { role: q.role }),
      ...(q.status && { status: q.status }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        select: USER_SELECT,
        orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);
    return { items, total, page, limit };
  }

  async getOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: USER_SELECT });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /** The 20 newest blogs the user wrote and the 20 newest they reviewed. Every status, no content. */
  async blogsOf(id: string) {
    await this.getOne(id);
    const [authored, reviewed] = await this.prisma.$transaction([
      this.prisma.blog.findMany({
        where: { authorId: id },
        select: BLOG_CARD_SELECT,
        orderBy: { modifiedAt: 'desc' },
        take: BLOGS_PER_LIST,
      }),
      this.prisma.blog.findMany({
        where: { reviewerId: id },
        select: BLOG_CARD_SELECT,
        orderBy: { modifiedAt: 'desc' },
        take: BLOGS_PER_LIST,
      }),
    ]);
    return { authored, reviewed };
  }

  async updateRole(adminId: string, targetId: string, role: UserRole) {
    if (adminId === targetId) throw new ForbiddenException('You cannot change your own role.');
    const target = await this.getOne(targetId);
    if (target.role === role) return target;

    await this.prisma.$transaction(async (tx) => {
      // Repeats the role we read, so two admins changing the same user cannot both succeed.
      const { count } = await tx.user.updateMany({ where: { id: targetId, role: target.role }, data: { role } });
      if (count !== 1) throw new ConflictException('The user was changed by someone else. Reload and try again.');
      await tx.roleChangeLog.create({
        data: { targetUserId: targetId, changedBy: adminId, oldRole: target.role, newRole: role },
      });
    });
    return this.getOne(targetId);
  }

  async updateStatus(adminId: string, targetId: string, status: UserStatus) {
    if (adminId === targetId) throw new ForbiddenException('You cannot change your own status.');
    const target = await this.getOne(targetId);
    if (target.status === status) return target;

    const { count } = await this.prisma.user.updateMany({
      where: { id: targetId, status: target.status },
      data: { status },
    });
    if (count !== 1) throw new ConflictException('The user was changed by someone else. Reload and try again.');
    return this.getOne(targetId);
  }

  /** Reviewers with how many blogs each one has under review and has published. */
  async listReviewers() {
    const reviewers = await this.prisma.user.findMany({
      where: { role: UserRole.REVIEWER },
      select: USER_SELECT,
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
    });
    const counts = await this.prisma.blog.groupBy({
      by: ['reviewerId', 'status'],
      where: {
        reviewerId: { in: reviewers.map((r) => r.id) },
        status: { in: [BlogStatus.UNDER_REVIEW, BlogStatus.PUBLISHED] },
      },
      _count: { _all: true },
    });
    return reviewers.map((reviewer) => {
      const countOf = (status: BlogStatus) =>
        counts.find((c) => c.reviewerId === reviewer.id && c.status === status)?._count._all ?? 0;
      return {
        ...reviewer,
        workload: { underReview: countOf(BlogStatus.UNDER_REVIEW), published: countOf(BlogStatus.PUBLISHED) },
      };
    });
  }
}
