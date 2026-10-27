# admin-api (`src/admin`)

Admin-only user and blog management. Every route needs a logged-in **ADMIN** (`JwtAuthGuard` + `RolesGuard`, both from
`src/common`). 401 = not logged in or blocked, 403 = not an admin. All paths are under the global prefix `/api`.

Layout: `src/admin/index.ts` (public contract) · `internal/` (services, validation) · `http/` (controllers, `dto/`).
Uses `PrismaService` directly (Prisma is global); it does not import any other module.

## Users

| Method | Path | What |
|---|---|---|
| GET | `/admin/users?role&status&search&page&limit` | Page of users (limit max 50, default 20). `search` matches name or email, case-insensitive. |
| GET | `/admin/users/:id` | One user. Never returns `passwordHash` or `sessionVersion`. |
| GET | `/admin/users/:id/blogs` | `{ authored, reviewed }`: the 20 newest of each, every status, no content. |
| PATCH | `/admin/users/:id/role` `{ role }` | Change role. Writes a `role_change_log` row. |
| PATCH | `/admin/users/:id/status` `{ status }` | `ACTIVE` / `BLOCKED` / ... A blocked user is rejected on their next request. |
| GET | `/admin/reviewers` | Reviewers with `workload: { underReview, published }`. |

Rules: an admin cannot change their own role or status (403). Setting the value a user already has is a no-op (200).
Two admins changing the same user at once: the second gets 409 (the write repeats the role/status that was read).

## Blogs

| Method | Path | What |
|---|---|---|
| GET | `/admin/blogs?status&category&authorId&reviewerId&q&page&limit` | Every status, `DELETED` included. |
| POST | `/admin/blogs` | Create a DRAFT. The admin is the author. `slug` optional (generated from the title). `content` required. |
| GET | `/admin/blogs/:id` | Blog plus the content of `latestRevisionVersion`. |
| PATCH | `/admin/blogs/:id` | Metadata: `title, slug, excerpt, thumbnailUrl, category, tags`. `excerpt` / `thumbnailUrl` accept `null`. Not versioned, so a live blog changes at once. |
| PUT | `/admin/blogs/:id/content` `{ content, expectedVersion }` | Edit content (rules below). |
| POST | `/admin/blogs/:id/publish` | Publish the latest revision. |
| DELETE | `/admin/blogs/:id` | Soft delete: `status = DELETED`, `deletedAt = now`. |
| POST | `/admin/blogs/:id/restore` | Undo a delete. |

### Content edit rules (admin edits skip review)

| Status before | Result |
|---|---|
| `DRAFT` | Current version overwritten in place (never public, so no new version). |
| `PUBLISHED`, `REVISION_DRAFT` | New version, **live at once**; `reviewerId = admin`; a pending author revision is replaced. |
| `REJECT` | New version, back to `DRAFT` (or `REVISION_DRAFT` if it was published before). Not live. |
| `ARCHIVED` | New version, stays `ARCHIVED`. |
| `UNDER_REVIEW` | 409 (the reviewer decides first). |
| `DELETED` / unknown | 404. |

A published version is never overwritten. `expectedVersion` must equal the blog's `latestRevisionVersion`, otherwise 409;
when several saves race, exactly one wins. Content goes through the same TipTap validation as the author API (node and
mark allow-lists, size and depth limits, images only from our Cloudinary account).

### Publish / delete / restore

- Publish works from `DRAFT`, `REVISION_DRAFT`, `REJECT`, `ARCHIVED`. `PUBLISHED` and `UNDER_REVIEW` give 409, `DELETED` 404, an empty document 400.
  It sets the live version to the latest revision, `reviewerId = admin`, keeps the first `publishedAt`, and clears `reviewNote`.
- Restore never makes a blog live by itself: `DRAFT` if it was never published, otherwise `ARCHIVED` (publish it again if wanted).
  A blog that is not deleted gives 409.
- Every blog write adds a `blog_audit_log` row: `ADMIN_CREATE`, `ADMIN_EDIT_META`, `ADMIN_EDIT_CONTENT`, `ADMIN_PUBLISH`, `ADMIN_DELETE`, `ADMIN_RESTORE`.

## Not done yet

- `AdminModule` is not registered in `app.module.ts` (separate `chore:` PR to `main`, see CONTRIBUTING).
- Publish should call `CategoriesService.findOrCreate(category)` once `feat/blog-cat-api` is merged.
- The TipTap/Cloudinary validators in `internal/validation/` are copies of the blog module's. Move them to `src/common` in a `chore:` PR.

## Tests

`test/admin.e2e-spec.ts` (Jest, real Postgres, same setup as the blog specs; `npm run test:e2e`). `JwtAuthGuard` is replaced in
`test/support/admin-test-app.ts` by a guard that reads the cookie `aces_session=<userId>` until user-mgmt is merged.
