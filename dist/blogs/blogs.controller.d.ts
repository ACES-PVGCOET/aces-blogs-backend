import { Request } from 'express';
import { UserRole } from '../generated/prisma/client.js';
import { BlogsService } from './blogs.service.js';
import { CreateBlogDto } from './dto/create-blog.dto.js';
import { SaveBlogContentDto } from './dto/save-blog-draft.dto.js';
interface AuthRequest extends Request {
    user?: {
        id?: string;
        sub?: string;
    };
}
export declare class BlogsController {
    private readonly blogsService;
    constructor(blogsService: BlogsService);
    private userId;
    create(req: AuthRequest, dto: CreateBlogDto): Promise<{
        latestContent: Record<string, unknown>;
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
    getEditable(req: AuthRequest, id: string): Promise<{
        latestContent: import("@prisma/client/runtime/client").JsonValue;
        latestRevisionVersion: number;
        author: {
            id: string;
            name: string;
            email: string;
            passwordHash: string;
            profileImg: string | null;
            linkedIn: string | null;
            bio: string | null;
            role: UserRole;
            status: import("../generated/prisma/enums.js").UserStatus;
            sessionVersion: number;
            createdAt: Date;
            updatedAt: Date;
        };
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
        latestPublishedVersion: number | null;
        submittedAt: Date | null;
        publishedAt: Date | null;
        deletedAt: Date | null;
        modifiedAt: Date;
    }>;
    saveContent(req: AuthRequest, id: string, dto: SaveBlogContentDto): Promise<{
        latestContent: Record<string, unknown>;
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
    archive(req: AuthRequest, id: string): Promise<{
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
    delete(req: AuthRequest, id: string): Promise<{
        id: string;
        status: "DELETED";
    }>;
}
export {};
