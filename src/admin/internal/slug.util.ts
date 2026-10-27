import { randomBytes } from 'node:crypto';
import { MAX_TAGS, TAG_MAX_LENGTH } from './admin.constants';

export function slugify(input: string, max = 80): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, max)
    .replace(/-+$/g, '');
}

export function cleanLabel(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

/** Tags are stored as lowercase slugs, de-duplicated. */
export function normalizeTags(tags?: string[]): string[] {
  if (!tags) return [];
  return [...new Set(tags.map((t) => slugify(t, TAG_MAX_LENGTH)).filter(Boolean))].slice(0, MAX_TAGS);
}

/** First attempt is the plain slug; later attempts add a random suffix (blogs.slug is VARCHAR(220)). */
export function slugCandidate(title: string, attempt: number): string {
  const base = slugify(title) || 'post';
  return attempt === 0 ? base : `${base.slice(0, 70)}-${randomBytes(3).toString('hex')}`;
}

/**
 * Prisma's `contains` / insensitive `equals` hand the value to LIKE / ILIKE as is, so a search for
 * "100%" or "_" would act as a wildcard. Escape them so user input is matched literally.
 */
export function escapeLike(input: string): string {
  return input.replace(/[\\%_]/g, '\\$&');
}
