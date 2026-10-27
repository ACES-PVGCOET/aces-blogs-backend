
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

export interface CreateBlogAuditInput {
  blogId: string;
  action: string;
  performedBy: string;
}

@Injectable()
export class BlogAuditService {
  constructor(private readonly prisma: PrismaService) {}

  async record(
    input: CreateBlogAuditInput,
    transactionClient: any = this.prisma,
  ) {
    return transactionClient.blogAuditLog.create({
      data: {
        blogId: input.blogId,
        action: input.action,
        performedBy: input.performedBy,
      },
    });
  }

  async getForBlog(blogId: string) {
    return this.prisma.blogAuditLog.findMany({
      where: { blogId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
