# System Architecture & Technical Specifications

This document defines the structural architecture, layer boundaries, and design decisions governing the `aces-blogs-backend` system.

---

## 1. Module Topography

The system is decomposed into cohesive domain modules mounted under `AppModule`:

```
src/
├── admin/          # Admin user & blog operations, role auditing
├── auth/           # Authentication, credentials validation, session issuance
├── blogs/          # Author and public blog management, content storage
├── categories/     # Category catalog management and relation integrity
├── common/         # Cross-cutting guards, decorators, types, and filters
├── prisma/         # Global PrismaService instance and database adapter
├── reviewer/       # Review queue, diff comparison, and approval workflow
├── uploads/        # Cloudinary multipart file integration
└── users/          # User identities, profile management, and session invalidation
```

### Module Boundary Rules
1. **Public Contracts Only**: External modules must only import from a module's root `index.ts`. Never deep-import into another module's internal directories.
2. **Global Prisma Module**: `PrismaService` is injected globally across modules to handle relational persistence and connection pooling.
3. **Explicit ESM Extensions**: All relative imports must retain explicit `.js` extensions (`import ... from './file.js'`) in accordance with NodeNext ECMAScript module resolution.

---

## 2. Authentication & Session Lifecycles

### Token & Cookie Architecture
- **Password Security**: Passwords are saved hashed via `argon2`.
- **Session Issuance**: `AuthService.login()` issues a signed JWT containing `{ sub: user.id, sv: user.sessionVersion }`.
- **Extraction Strategy**: `JwtStrategy` inspects the HttpOnly cookie `aces_session` as well as the standard `Authorization: Bearer <token>` header.
- **Immediate Invalidation**: The JWT strategy validates `user.sessionVersion === payload.sv` and `user.status === 'ACTIVE'` on every authenticated request. Calling `POST /api/v1/auth/logout-all` increments `sessionVersion` in the database, instantly invalidating active sessions across all devices.

---

## 3. Blog Storage & Versioning Architecture

Blog data is partitioned into two distinct database entities to guarantee performance and optimistic concurrency:

### 1. `Blog` (Metadata Entity)
- Primary Key: `id UUID`
- Tracks title, unique URL `slug`, `excerpt`, `thumbnailUrl`, `category`, `tags`, and foreign relations (`authorId`, `reviewerId`).
- Lifecycle status:
  - `DRAFT`: Author working draft.
  - `UNDER_REVIEW`: Submitted to reviewer queue.
  - `REVISION_DRAFT`: Post-rejection revision or revision of an already published blog.
  - `PUBLISHED`: Approved and publicly visible.
  - `ARCHIVED`: Taken down but preserved.
  - `DELETED`: Soft-deleted (hidden from standard queries).
- Tracks `latestRevisionVersion: Int` and `latestPublishedVersion: Int?`.

### 2. `BlogContent` (Versioned Content Warehouse)
- Primary Key: `id UUID`, Unique: `[blogId, version]`
- Stored as native PostgreSQL `JsonB` containing a TipTap document structure:
  ```json
  {
    "type": "doc",
    "content": [
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Article content..." }]
      }
    ]
  }
  ```
- Maintains full historical revisions without overwriting published content.

### Optimistic Concurrency Control
Whenever an author or admin updates blog content:
1. The request payload must supply `expectedVersion`.
2. The transaction checks that `blog.latestRevisionVersion === expectedVersion`.
3. If versions mismatch, the request is refused with `409 Conflict`.
4. If versions match, the revision is incremented in place or stored as a new version.

---

## 4. Role-Based Access Control (RBAC)

Every guarded endpoint applies `@UseGuards(JwtAuthGuard, RolesGuard)` and declares acceptable roles via `@Roles(...)`:

| Role | Permissions |
| :--- | :--- |
| **`READER`** | Read public published blogs (`GET /blogs/public`, `GET /blogs/public/:slug`), manage personal profile (`GET /users/me`, `PATCH /users/me`). |
| **`WRITER`** | Create blog drafts (`POST /blogs`), save content (`PATCH /blogs/:id/content`), list authored blogs (`GET /blogs/mine`), archive/delete own drafts, upload images. |
| **`REVIEWER`** | Access review queue (`GET /reviewer/blogs-to-review`), compare draft diffs against live published versions (`GET /reviewer/blogs/:id/comparison`), approve and publish (`POST /reviewer/blogs/:id/publish`), reject revisions with notes (`POST /reviewer/blogs/:id/reject-revision`). |
| **`ADMIN`** | Complete access: mutate user roles & statuses, list all blogs across every status, publish directly without review, soft-delete & restore, manage categories. |

---

## 5. Global Exception Handling

Database errors are intercepted globally by `PrismaExceptionFilter` in `src/common/prisma-exception.filter.ts`:
- **`P2002` (Unique Constraint Violation)** ➔ `409 Conflict` (specifying violated fields, e.g. duplicate slug or email).
- **`P2025` (Record Not Found)** ➔ `404 Not Found`.
- **`P2003` (Foreign Key Constraint Failed)** ➔ `400 Bad Request`.
- **`P2014` (Relation Constraint Failed)** ➔ `400 Bad Request`.
