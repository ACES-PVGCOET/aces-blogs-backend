import type { Blog } from '@prisma/client';
import type { TipTapDoc } from './validation/tiptap-content';

/** Author-side shape. Never contains content. */
export function toBlogMeta(b: Blog) {
  return {
    id: b.id,
    slug: b.slug,
    title: b.title,
    excerpt: b.excerpt,
    thumbnailUrl: b.thumbnailUrl,
    status: b.status,
    category: b.category,
    tags: b.tags,
    reviewNote: b.reviewNote,
    latestRevisionVersion: b.latestRevisionVersion,
    latestPublishedVersion: b.latestPublishedVersion,
    submittedAt: b.submittedAt,
    publishedAt: b.publishedAt,
    createdAt: b.createdAt,
    modifiedAt: b.modifiedAt,
  };
}

export interface RevisionView {
  version: number;
  content?: TipTapDoc;
}

export function toView(blog: Blog, revision: RevisionView) {
  return { blog: toBlogMeta(blog), revision };
}

type PublicAuthor = { name: string; profileImg: string | null };

/** Public shape: no ids, no workflow status, no version numbers, no review notes. */
export function toPublicCard(
  b: Pick<Blog, 'slug' | 'title' | 'excerpt' | 'thumbnailUrl' | 'category' | 'tags' | 'publishedAt'>,
  author?: PublicAuthor | null,
) {
  return {
    slug: b.slug,
    title: b.title,
    excerpt: b.excerpt,
    thumbnailUrl: b.thumbnailUrl,
    category: b.category,
    tags: b.tags,
    publishedAt: b.publishedAt,
    author: author ? { name: author.name, profileImg: author.profileImg } : null,
  };
}
