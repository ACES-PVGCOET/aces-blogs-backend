import { BlogsService } from './blogs.service.js';
export declare class PublicBlogsController {
    private readonly blogsService;
    constructor(blogsService: BlogsService);
    getPublished(slug: string): Promise<{
        id: string;
        title: string;
        slug: string;
        excerpt: string | null;
        thumbnailUrl: string | null;
        category: string;
        tags: string[];
        publishedAt: Date | null;
        revisionVersion: number;
        content: import("@prisma/client/runtime/client").JsonValue;
        author: {
            id: string;
            name: string;
            profileImg: string | null;
            bio: string | null;
        } | null;
    }>;
}
