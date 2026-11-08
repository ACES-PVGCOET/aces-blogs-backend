import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async create(name: string) {
    const trimmed = name.trim();
    try {
      return await this.prisma.category.create({
        data: { name: trimmed },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException('Category already exists');
      }
      throw e;
    }
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const referencedBlogCount = await this.prisma.blog.count({
      where: {
        category: category.name,
        status: { not: 'DELETED' },
      },
    });

    if (referencedBlogCount > 0) {
      throw new ConflictException(
        `Cannot delete category "${category.name}" because it is currently used by ${referencedBlogCount} active blog(s)`,
      );
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
