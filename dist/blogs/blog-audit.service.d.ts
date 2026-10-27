import { Prisma } from '../generated/prisma/client.js';
export interface BlogAuditInput {
    blogId: string;
    action: string;
    performedBy: string;
}
export declare class BlogAuditService {
    log(tx: Prisma.TransactionClient, input: BlogAuditInput): Promise<void>;
}
