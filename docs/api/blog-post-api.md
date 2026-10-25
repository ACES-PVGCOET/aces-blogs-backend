# blog-post-api

Branch: `feat/blog-post-api`  ·  Owner: _fill in_  ·  Status: not started

## Tasks
- [ ] create blog: new blog with required details, starts as a draft
- [ ] update blog content: save new content (TipTap JSON), update `modified_at`, bump the revision version
- [ ] publish blog: after review passes, set the published version and the reviewer
- [ ] delete blog
- [ ] archive blog
- [ ] fetch blogs (by title, filters, or ALL)
- [ ] get content: by blog id + `latest_published_version`
- [ ] get blogs to review
- [ ] comparison: changes between `latest_published_version` and `latest_revision_version`
- [ ] start review
- [ ] reject revision

Blog fields: `id`, `slug`, `title`, `thumbnail`, `author`, `reviewer`, `status`, `category`, `tags`, `latest_revision_version`, `latest_published_version`, `created_at`, `modified_at`.
Storage: metadata and content are separate tables; content is TipTap JSON in a JSONB column, found by blog id + version.

## Endpoints
_Fill in as you build: method, path, who can call it, what it returns._

| Method | Path | Access | Notes |
|---|---|---|---|

## Decisions and notes
_Anything teammates need to know: formats, edge cases, things you changed._
