import { Request } from 'express';
import { BlogsService } from '../blogs/blogs.service.js';
import { ReviewActionDto } from '../blogs/dto/review-decision.dto.js';
interface AuthRequest extends Request {
    user?: {
        id?: string;
        sub?: string;
    };
}
export declare class ReviewerController {
    private readonly blogsService;
    constructor(blogsService: BlogsService);
    private userId;
    getBlogsToReview(req: AuthRequest): Promise<{
        id: string;
        status: import("../generated/prisma/enums.js").BlogStatus;
        title: string;
        slug: string;
        excerpt: string | null;
        category: string;
        authorId: string;
        latestRevisionVersion: number;
        latestPublishedVersion: number | null;
        modifiedAt: Date;
        author: {
            id: string;
            name: string;
            profileImg: string | null;
        };
    }[]>;
    startReview(req: AuthRequest, id: string, dto: ReviewActionDto): Promise<{
        id: string;
        status: import("../generated/prisma/enums.js").BlogStatus;
        createdAt: Date;
        title: string;
        slug: string;
        excerpt: string | null;
        thumbnailUrl: string | null;
        category: string;
        tags: string[];
        authorId: string;
        reviewerId: string | null;
        latestRevisionVersion: number;
        latestPublishedVersion: number | null;
        submittedAt: Date | null;
        publishedAt: Date | null;
        deletedAt: Date | null;
        modifiedAt: Date;
    }>;
    comparison(req: AuthRequest, id: string): Promise<{
        blogId: string;
        publishedVersion: null;
        draftVersion: number;
        publishedContent: null;
        draftContent: import("@prisma/client/runtime/client").JsonValue;
        hasChanges: boolean;
    } | {
        blogId: string;
        publishedVersion: number;
        draftVersion: number;
        publishedContent: import("@prisma/client/runtime/client").JsonValue;
        draftContent: import("@prisma/client/runtime/client").JsonValue;
        hasChanges: boolean;
    }>;
    publish(req: AuthRequest, id: string, dto: ReviewActionDto): Promise<{
        id: string;
        status: import("../generated/prisma/enums.js").BlogStatus;
        createdAt: Date;
        title: string;
        slug: string;
        excerpt: string | null;
        thumbnailUrl: string | null;
        category: string;
        tags: string[];
        authorId: string;
        reviewerId: string | null;
        latestRevisionVersion: number;
        latestPublishedVersion: number | null;
        submittedAt: Date | null;
        publishedAt: Date | null;
        deletedAt: Date | null;
        modifiedAt: Date;
    }>;
    rejectRevision(req: AuthRequest, id: string, dto: ReviewActionDto): Promise<{
        id: string;
        status: "REVISION_DRAFT";
        feedback: string | null;
    }>;
}
export {};
