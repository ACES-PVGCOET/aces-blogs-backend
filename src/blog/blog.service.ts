import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Blog, BlogContent, BlogStatus, Prisma } from '@prisma/client';
import { AuthenticatedUser, UserRole } from '../common';
import { PrismaService } from '../prisma';
import { CreateBlogDto, StartReviewDto, UpdateBlogContentDto } from './dto';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  private assertCanManage(blog: Blog, user: AuthenticatedUser): void {
    if (user.role === UserRole.ADMIN || blog.author === user.id) {
      return;
    }
    throw new ForbiddenException('You do not have permission to manage this blog');
  }

  async create(dto: CreateBlogDto, user: AuthenticatedUser): Promise<Blog> {
    try {
      if (dto.content) {
        return await this.prisma.$transaction(async (tx) => {
          const blog = await tx.blog.create({
            data: {
              title: dto.title,
              slug: dto.slug,
              thumbnail: dto.thumbnail,
              category: dto.category,
              tags: dto.tags ?? [],
              author: user.id,
              status: BlogStatus.DRAFT,
              latestRevisionVersion: 1,
              latestPublishedVersion: 0,
            },
          });

          await tx.blogContent.create({
            data: {
              blogId: blog.id,
              version: 1,
              content: dto.content as Prisma.InputJsonValue,
            },
          });

          return blog;
        });
      }

      return await this.prisma.blog.create({
        data: {
          title: dto.title,
          slug: dto.slug,
          thumbnail: dto.thumbnail,
          category: dto.category,
          tags: dto.tags ?? [],
          author: user.id,
          status: BlogStatus.DRAFT,
          latestRevisionVersion: 0,
          latestPublishedVersion: 0,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('A blog with this slug already exists');
      }
      throw error;
    }
  }

  async updateContent(
    id: string,
    dto: UpdateBlogContentDto,
    user: AuthenticatedUser,
  ): Promise<{ blog: Blog; contentVersion: number }> {
    return await this.prisma.$transaction(async (tx) => {
      const locked = await tx.$queryRaw<Array<{ id: string }>>`
        SELECT id FROM blogs WHERE id = ${id}::uuid FOR UPDATE
      `;
      if (!locked || locked.length === 0) {
        throw new NotFoundException(`Blog with id ${id} not found`);
      }

      const blog = await tx.blog.findUnique({ where: { id } });
      if (!blog) {
        throw new NotFoundException(`Blog with id ${id} not found`);
      }

      this.assertCanManage(blog, user);

      const nextVersion = blog.latestRevisionVersion + 1;

      await tx.blogContent.create({
        data: {
          blogId: blog.id,
          version: nextVersion,
          content: dto.content as Prisma.InputJsonValue,
        },
      });

      const isWriter = user.role === UserRole.WRITER;
      const updatedBlog = await tx.blog.update({
        where: { id: blog.id },
        data: isWriter
          ? {
              status: BlogStatus.REVISION_DRAFT,
              latestRevisionVersion: nextVersion,
            }
          : {
              status: BlogStatus.PUBLISHED,
              latestRevisionVersion: nextVersion,
              latestPublishedVersion: nextVersion,
            },
      });

      return { blog: updatedBlog, contentVersion: nextVersion };
    });
  }

  async publish(id: string, user: AuthenticatedUser): Promise<Blog> {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }

    this.assertCanManage(blog, user);

    if (blog.latestRevisionVersion === 0) {
      throw new BadRequestException('Cannot publish a blog without content');
    }

    if (!blog.reviewer || blog.reviewer.trim() === '') {
      throw new BadRequestException('Cannot publish a blog without an assigned reviewer');
    }

    return await this.prisma.blog.update({
      where: { id },
      data: {
        status: BlogStatus.PUBLISHED,
        latestPublishedVersion: blog.latestRevisionVersion,
      },
    });
  }

  async archive(id: string, user: AuthenticatedUser): Promise<Blog> {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }

    this.assertCanManage(blog, user);

    return await this.prisma.blog.update({
      where: { id },
      data: {
        status: BlogStatus.ARCHIVED,
      },
    });
  }

  async delete(id: string, user: AuthenticatedUser): Promise<{ success: boolean; message: string }> {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }

    this.assertCanManage(blog, user);

    await this.prisma.blog.update({
      where: { id },
      data: {
        status: BlogStatus.DELETED,
      },
    });

    return { success: true, message: 'Blog deleted' };
  }

  async getReviewQueue(): Promise<Blog[]> {
    return await this.prisma.blog.findMany({
      where: {
        status: {
          in: [BlogStatus.DRAFT, BlogStatus.REVISION_DRAFT],
        },
      },
      orderBy: {
        modifiedAt: 'asc',
      },
    });
  }

  async getReviewComparison(
    id: string,
  ): Promise<{ published: BlogContent | null; revision: BlogContent | null }> {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }

    let revision: BlogContent | null = null;
    if (blog.latestRevisionVersion > 0) {
      revision = await this.prisma.blogContent.findUnique({
        where: {
          blogId_version: {
            blogId: id,
            version: blog.latestRevisionVersion,
          },
        },
      });
    }

    let published: BlogContent | null = null;
    if (blog.latestPublishedVersion > 0) {
      published = await this.prisma.blogContent.findUnique({
        where: {
          blogId_version: {
            blogId: id,
            version: blog.latestPublishedVersion,
          },
        },
      });
    }

    return { published, revision };
  }

  async startReview(id: string, dto: StartReviewDto): Promise<Blog> {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }

    if (blog.status !== BlogStatus.DRAFT && blog.status !== BlogStatus.REVISION_DRAFT) {
      throw new BadRequestException(`Cannot start review for blog with status ${blog.status}`);
    }

    return await this.prisma.blog.update({
      where: { id },
      data: {
        status: BlogStatus.UNDER_REVIEW,
        reviewer: dto.reviewer,
      },
    });
  }

  async rejectReview(id: string): Promise<Blog> {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }

    if (blog.status !== BlogStatus.UNDER_REVIEW) {
      throw new BadRequestException(`Cannot reject blog with status ${blog.status}`);
    }

    return await this.prisma.blog.update({
      where: { id },
      data: {
        status: BlogStatus.REJECT,
      },
    });
  }

  async findAll(
    filters: { title?: string; category?: string; status?: BlogStatus },
    user: AuthenticatedUser,
  ): Promise<Blog[]> {
    const where: Prisma.BlogWhereInput = {};

    if (user.role === UserRole.READER) {
      where.status = BlogStatus.PUBLISHED;
    } else if (filters.status) {
      where.status = filters.status;
    }

    if (filters.title) {
      where.title = { contains: filters.title, mode: 'insensitive' };
    }

    if (filters.category) {
      where.category = { contains: filters.category, mode: 'insensitive' };
    }

    return await this.prisma.blog.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, user: AuthenticatedUser): Promise<Blog> {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }

    if (user.role === UserRole.READER) {
      const isPublished =
        blog.status === BlogStatus.PUBLISHED ||
        (blog.status === BlogStatus.REVISION_DRAFT && blog.latestPublishedVersion > 0);
      if (!isPublished) {
        throw new NotFoundException(`Blog with id ${id} not found`);
      }
    }

    return blog;
  }

  async getContent(
    id: string,
    version: number | undefined,
    user: AuthenticatedUser,
  ): Promise<BlogContent> {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }

    if (user.role === UserRole.READER) {
      const isPublished =
        blog.latestPublishedVersion > 0 &&
        blog.status !== BlogStatus.DELETED &&
        blog.status !== BlogStatus.ARCHIVED &&
        blog.status !== BlogStatus.DRAFT;
      if (!isPublished) {
        throw new NotFoundException(`Blog with id ${id} not found`);
      }
    }

    let targetVersion: number;
    if (version !== undefined && version !== null) {
      targetVersion = version;
    } else if (blog.latestPublishedVersion > 0) {
      targetVersion = blog.latestPublishedVersion;
    } else {
      targetVersion = blog.latestRevisionVersion;
    }

    if (targetVersion === 0) {
      throw new NotFoundException(`No content found for blog ${id}`);
    }

    if (user.role === UserRole.READER && targetVersion > blog.latestPublishedVersion) {
      throw new NotFoundException(`Content version ${targetVersion} not found`);
    }

    const content = await this.prisma.blogContent.findUnique({
      where: {
        blogId_version: {
          blogId: id,
          version: targetVersion,
        },
      },
    });

    if (!content) {
      throw new NotFoundException(`Content version ${targetVersion} not found for blog ${id}`);
    }

    return content;
  }
}
