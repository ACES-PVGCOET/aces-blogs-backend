import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export interface BlogAuditInput {
  blogId: string;
  action: string;
  performedBy: string;
}

@Injectable()
export class BlogAuditService {
  async log(
    tx: Prisma.TransactionClient,
    input: BlogAuditInput,
  ): Promise<void> {
    await tx.blogAuditLog.create({
      data: {
        blogId: input.blogId,
        action: input.action,
        performedBy: input.performedBy,
      },
    });
  }
}