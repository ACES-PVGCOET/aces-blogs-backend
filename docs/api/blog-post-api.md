# blog-post-api (`src/blog`)

Author side and public reads of the blog API. The reviewer side (`BlogsService`) shares the same
`blogs` / `blog_content` tables. All paths below sit under the global prefix `/api`.

## Who can call what
| Routes | Auth | Role |
|---|---|---|
| `/blogs/*` | session cookie (`aces_session`) | **WRITER** only |
| `/public/blogs/*` | none | anyone |

Auth comes from `src/common`: `JwtAuthGuard` + `RolesGuard` + `@CurrentUser()` (`req.user` is `{ id, role }`). The user-mgmt `JwtStrategy` must reload the
user on every request, so blocking or demoting a writer takes effect immediately. Other people's blogs, deleted blogs
and unknown ids all answer **404** (no id probing).

## Tables and status
`blogs` holds metadata and one status; `blog_content` holds one row per saved version (TipTap JSON as JSONB), unique on `(blogId, version)`.

| Field | Meaning |
|---|---|
| `status` | `DRAFT`, `UNDER_REVIEW`, `REVISION_DRAFT`, `PUBLISHED`, `REJECT`, `ARCHIVED`, `DELETED` |
| `latestRevisionVersion` | newest row in `blog_content` |
| `latestPublishedVersion` | version the public sees. **`null` = never published** (not 0) |
| `reviewNote` | reviewer feedback after a rejection; cleared on submit |

## Author routes
| Route | What it does |
|---|---|
| `POST /blogs` | Create a `DRAFT` with content v1. The slug is generated from the title (unique, random suffix when taken). `category` is required. |
| `GET /blogs/mine` | My blogs, no content. Filters: `status`, `q` (title), `page`, `limit` (max 50). `DELETED` is hidden unless `status=DELETED`. Items include `reviewNote` and `modifiedAt`. |
| `GET /blogs/:id/draft` | Editor loader: blog meta (with `reviewNote`) + latest version with content. |
| `PUT /blogs/:id/content` | Save content (body: `content`, required `expectedVersion`, optional `title`). See the table below. |
| `PATCH /blogs/:id` | Title, excerpt, thumbnailUrl, category, tags. Allowed in DRAFT / REVISION_DRAFT / PUBLISHED. Not versioned, so on a live blog it changes the live page at once. |
| `POST /blogs/:id/submit` | Needs a category and non-empty content. DRAFT or REVISION_DRAFT → `UNDER_REVIEW`, `reviewerId = null`, `submittedAt` set, `reviewNote` cleared. |
| `POST /blogs/:id/archive` | Anything not already ARCHIVED / DELETED → ARCHIVED. |
| `DELETE /blogs/:id` | Soft delete: `status = DELETED`, `deletedAt` set. |

No un-archive, no un-delete.

### Save rules (`PUT /blogs/:id/content`)
| Status | Result |
|---|---|
| `DRAFT`, `REVISION_DRAFT` | overwrite the current version in place (autosave-safe, no version spam) |
| `PUBLISHED` | new version (+1), status becomes `REVISION_DRAFT`; the live version stays live |
| `UNDER_REVIEW`, `ARCHIVED`, `DELETED` (and `REJECT`) | 409 |

A version the public can see is never overwritten: if `latestPublishedVersion >= latestRevisionVersion` the save starts a new version.
`expectedVersion` is required. If it differs from the latest revision, the save is refused with 409.

## Public routes
`GET /public/blogs` and `GET /public/blogs/:slug`.

**Live rule:** `latestPublishedVersion` is not null, status is not `ARCHIVED` / `DELETED`, and `deletedAt` is null.
A published blog that is being revised or re-reviewed stays live and keeps showing its published version.

List: sorted by `publishedAt` descending; filters `category` (case-insensitive), `tag`, `q` (title, case-insensitive,
contains); `limit` max 50. Response has no `id`, no version numbers, no status and no review note:
`slug, title, excerpt, thumbnailUrl, category, tags, publishedAt, author { name, profileImg }` (+ `content` on `:slug`).

## Concurrency
No row locks. Every write is an `updateMany` whose `WHERE` repeats what was read (author, status, expected
`latestRevisionVersion`); `count !== 1` → 409. A duplicate `(blogId, version)` (`P2002`) → 409. Submit flips the
status first and checks the content inside the same transaction, so a racing save either lands before it or gets a 409.

## Safety built in
- TipTap content goes through `validateTiptapDocument` (node/mark allow-lists, size, depth, link protocols). On top of that, **image `src` must be https from our Cloudinary host** (`res.cloudinary.com`, and `/<CLOUDINARY_CLOUD_NAME>/` when that variable is set).
- `thumbnailUrl` has the same rule.
- One category limit everywhere: 2–80 characters (`blog.constants.ts`). Titles 3–200, excerpt max 500, up to 10 tags of 2–30 characters.
- Search text is escaped (`%`, `_`) so it matches literally.
- Unknown body fields are rejected (global `ValidationPipe`, `forbidNonWhitelisted`).

## What the reviewer side must change (not part of this module)
1. **Queue**: `getBlogsToReview` lists submitted blogs with `status = UNDER_REVIEW` and `reviewerId = null`. `startReview` claims one by setting `reviewerId` (guarded `updateMany` on `status = UNDER_REVIEW AND reviewerId IS NULL`).
2. **Reject**: store `dto.feedback` in `blogs.reviewNote` (the column is added by `prisma/migrations/20261026000000_add_blog_review_note`). Today the feedback is only returned in the response.

## Layout
`src/blog/index.ts` (public contract) · `internal/` (services, mapper, validation) · `http/` (controllers, `dto/`).

## Tests
`npm run test:e2e` (Jest). Needs a Postgres whose name contains `test`; its schema is dropped and re-migrated first
(`TEST_DATABASE_URL`, or `DATABASE_URL` as the smoke test uses):

    TEST_DATABASE_URL=postgresql://user:pass@localhost:5432/blog_app_test npm run test:e2e

Until user-mgmt is merged, `JwtAuthGuard` is replaced in `test/support/test-app.ts` by a guard that reads the cookie
`aces_session=<userId>` and requires an ACTIVE user. Specs: `test/blog-author.e2e-spec.ts` (including the concurrency
tests) and `test/blog-public.e2e-spec.ts`.
