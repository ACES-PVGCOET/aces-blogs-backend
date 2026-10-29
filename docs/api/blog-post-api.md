# blog-post-api

Branch: `feat/blog-post-api`  ·  Owner: blog-post-team  ·  Status: completed

## Tasks
- [x] create blog: new blog with required details, starts as a draft
- [x] update blog content: save new content (TipTap JSON), update `modified_at`, bump the revision version
- [x] publish blog: after review passes, set the published version and the reviewer
- [x] delete blog
- [x] archive blog
- [x] fetch blogs (by title, filters, or ALL)
- [x] get content: by blog id + `latest_published_version`
- [x] get blogs to review
- [x] comparison: changes between `latest_published_version` and `latest_revision_version`
- [x] start review
- [x] reject revision

Blog fields: `id`, `slug`, `title`, `thumbnail`, `author`, `reviewer`, `status`, `category`, `tags`, `latestRevisionVersion`, `latestPublishedVersion`, `createdAt`, `modifiedAt`.
Storage: metadata and content are separate tables (`blogs` and `blog_contents`); content is TipTap JSON in a JSONB column, found by blog id + version.

## Endpoints

| Method | Path | Access | Notes |
|---|---|---|---|
| POST | `/api/blogs` | WRITER, ADMIN | Creates a blog with status `DRAFT` and `author = current user`. If content is provided, creates version 1 in a transaction and sets `latestRevisionVersion = 1`. Returns 201. Duplicate slug returns 409. |
| GET | `/api/blogs` | READER, WRITER, REVIEWER, ADMIN | Lists blogs ordered by `createdAt` DESC with optional filters (`title`, `category`, `status`). For `READER`, forced to `status = PUBLISHED` and ignores any status filter. |
| GET | `/api/blogs/review/queue` | REVIEWER | Lists blogs with status `DRAFT` or `REVISION_DRAFT`, ordered by `modifiedAt` ASC. |
| GET | `/api/blogs/:id/review/comparison` | REVIEWER | Returns `{ published, revision }` content rows (`published` is null if `latestPublishedVersion` is 0). |
| PATCH | `/api/blogs/:id/review/start` | REVIEWER | Requires status `DRAFT` or `REVISION_DRAFT` (else 400). Sets status `UNDER_REVIEW` and assigns `reviewer`. |
| PATCH | `/api/blogs/:id/review/reject` | REVIEWER | Requires status `UNDER_REVIEW` (else 400). Sets status `REJECT`. |
| PUT | `/api/blogs/:id/content` | WRITER, ADMIN | Pessimistic locking in transaction. Adds new `BlogContent` row with `nextVersion = latestRevisionVersion + 1`. WRITER sets status `REVISION_DRAFT` and bumps `latestRevisionVersion`. ADMIN sets status `PUBLISHED` and bumps both `latestRevisionVersion` and `latestPublishedVersion`. Returns `{ blog, contentVersion }`. |
| PATCH | `/api/blogs/:id/content` | WRITER, ADMIN | Same behavior as PUT. |
| PATCH | `/api/blogs/:id/publish` | WRITER, ADMIN | Owner or ADMIN only. Requires `latestRevisionVersion > 0` and non-empty `reviewer` (else 400). Sets status `PUBLISHED` and `latestPublishedVersion = latestRevisionVersion`. |
| PATCH | `/api/blogs/:id/archive` | WRITER, ADMIN | Owner or ADMIN only. Sets status `ARCHIVED`. |
| DELETE | `/api/blogs/:id` | WRITER, ADMIN | Owner or ADMIN only. Soft delete: sets status `DELETED`, row is retained. Returns `{ success: true, message: "Blog deleted" }`. |
| GET | `/api/blogs/:id/content` | READER, WRITER, REVIEWER, ADMIN | Resolves version: `?version` query if given, else `latestPublishedVersion` if > 0, else `latestRevisionVersion`. 404 if target is 0. For READER, returns 404 for unreleased blogs or if requested `version > latestPublishedVersion`. |
| GET | `/api/blogs/:id` | READER, WRITER, REVIEWER, ADMIN | Fetches blog metadata by ID. For READER, returns 404 if the blog is not published. |

## Decisions and notes
- **Append-only content versioning rule**: Blog contents are strictly immutable and append-only. Every edit transaction locks the blog row (`SELECT ... FOR UPDATE`), computes `nextVersion = latestRevisionVersion + 1`, and inserts a new row in `blog_contents`. Previous versions are never modified or deleted.
- **Reader isolation rules**: Readers are restricted to published content only. `GET /api/blogs` always forces `status = PUBLISHED` for readers, ignoring any requested status query parameter. `GET /api/blogs/:id` returns 404 if the blog is not published. `GET /api/blogs/:id/content` returns 404 for non-published blogs, defaults to `latestPublishedVersion`, and rejects any request where `version > latestPublishedVersion` with 404.
- **Ownership rule**: A centralized `assertCanManage(blog, user)` check ensures that blog mutation operations (content updates, publishing, archiving, and deletion) can only be executed by the original author (`blog.author === user.id`) or any user with role `ADMIN`. Unauthorized callers receive a 403 Forbidden response.
- **Reviewer requirement for publishing**: In order to publish a blog via `PATCH /api/blogs/:id/publish`, the blog must have existing content (`latestRevisionVersion > 0`) and must have an assigned reviewer (`reviewer` field not null or blank). If either condition is not met, a 400 Bad Request error is returned.
