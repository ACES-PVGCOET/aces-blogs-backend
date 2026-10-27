export declare class CreateBlogDto {
    title: string;
    slug: string;
    excerpt?: string;
    thumbnailUrl?: string;
    category: string;
    tags: string[];
    content: Record<string, unknown>;
}
