import { ConflictException } from '@nestjs/common';
import { BlogStatus } from '@prisma/client';

/** DRAFT / REVISION_DRAFT: the author is still writing. Saves overwrite the current version in place. */
export const IN_PLACE_STATUSES: readonly BlogStatus[] = [
  BlogStatus.DRAFT,
  BlogStatus.REVISION_DRAFT,
];

/** Statuses where the author may change content or metadata. PUBLISHED edits start a new version. */
export const EDITABLE_STATUSES: readonly BlogStatus[] = [
  ...IN_PLACE_STATUSES,
  BlogStatus.PUBLISHED,
];

/** Statuses the author may submit for review. */
export const SUBMITTABLE_STATUSES: readonly BlogStatus[] = IN_PLACE_STATUSES;

const BLOCKED_REASON: Partial<Record<BlogStatus, string>> = {
  [BlogStatus.UNDER_REVIEW]: 'This blog is under review and cannot be edited right now',
  [BlogStatus.ARCHIVED]: 'An archived blog cannot be edited',
  [BlogStatus.DELETED]: 'A deleted blog cannot be edited',
  [BlogStatus.REJECT]: 'This blog cannot be edited in its current status',
};

export function assertEditable(status: BlogStatus): void {
  if (!EDITABLE_STATUSES.includes(status)) {
    throw new ConflictException(BLOCKED_REASON[status] ?? 'This blog cannot be edited in its current status');
  }
}

export function assertSubmittable(status: BlogStatus): void {
  if (!SUBMITTABLE_STATUSES.includes(status)) {
    throw new ConflictException(
      status === BlogStatus.UNDER_REVIEW
        ? 'This blog is already under review'
        : status === BlogStatus.PUBLISHED
          ? 'Edit the published blog first, then submit the new version'
          : 'This blog cannot be submitted in its current status',
    );
  }
}

/**
 * Lifecycle rules (unchanged): anything live can be archived, anything not deleted can be deleted.
 * There is no un-archive and no un-delete.
 */
export function assertCanMoveTo(from: BlogStatus, to: 'ARCHIVED' | 'DELETED'): void {
  const allowed = to === 'ARCHIVED' ? from !== BlogStatus.ARCHIVED && from !== BlogStatus.DELETED : from !== BlogStatus.DELETED;
  if (!allowed) throw new ConflictException(`Cannot move a blog from ${from} to ${to}`);
}
