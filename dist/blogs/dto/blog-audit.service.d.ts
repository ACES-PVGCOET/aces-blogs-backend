import { PrismaService } from '../../prisma/prisma.service.js';
export interface CreateBlogAuditInput {
    blogId: string;
    action: string;
    performedBy: string;
}
export declare class BlogAuditService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    record(input: CreateBlogAuditInput, transactionClient?: any): Promise<any>;
    getForBlog(blogId: string): Promise<{
        id: string;
        createdAt: Date;
        blogId: string;
        action: string;
        performedBy: string;
    }[]>;
}
