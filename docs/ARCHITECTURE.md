# Architecture

## Layers
`src/<module>/` follows the same shape everywhere:
```
index.ts      public contract: the ONLY file other modules may import from
internal/     private logic: entities, services, rules
http/         controllers and DTOs
```
Never import from another module's `internal/` or `http/` folders.

## Shared code (`src/common/`)
`UserRole`, `UserStatus`, `@Roles(...)`, `RolesGuard`, `JwtAuthGuard`, `@CurrentUser()`, `AuthenticatedUser`. Everyone uses these; changes need a separate PR.

Protect a route:
```ts
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.WRITER)
```
`@Roles` matches exact roles (an ADMIN is not automatically allowed where only WRITER is listed).

## Contracts between modules
| Topic | Rule |
|---|---|
| IDs | uuid everywhere |
| Logged-in user | After `JwtAuthGuard`, `request.user` has `id` (uuid) and `role`. Read it with `@CurrentUser()` |
| Roles | `READER`, `WRITER` (the author role), `REVIEWER`, `ADMIN` |
| JWT strategy | Implemented by user-mgmt (`src/auth`). It must re-check the user in the database on every request, so a BLOCKED or DELETED account loses access immediately |
| Categories | blog-post calls `CategoriesService.findOrCreate(name)` when a blog is published. Categories are created only that way. Signature is in `src/categories/categories.service.ts` |
| Blog author id | blog-post stores the user's `id` (uuid) as plain column, no foreign key into users, so modules stay independent |
| Uploads | blog-uploads returns the final https URL of the stored asset; blog-post stores that URL |

## Decision log
| Decision | Choice | Notes |
|---|---|---|
| Author role name | `WRITER` | Matches the spec |
| Blog status model | Split: `blog.status` = lifecycle (ACTIVE / ARCHIVED / DELETED), `revision.status` = workflow (DRAFT / UNDER_REVIEW / PUBLISHED / REJECT) | Owner: blog-post |
| Database schema | `DB_SYNC=true` locally only; production uses migrations | |

Add a row here when the team agrees something new.

## Testing before user-mgmt is merged
Routes protected by `JwtAuthGuard` can't log anyone in until the user-mgmt branch is merged. In your tests, replace the guard:
```ts
Test.createTestingModule({ imports: [...] })
  .overrideGuard(JwtAuthGuard)
  .useValue({ canActivate: (ctx) => { ctx.switchToHttp().getRequest().user = { id: '...uuid...', role: 'WRITER' }; return true; } })
```

## Suggested merge order
1. This base skeleton (`main`)
2. user-mgmt-api (others can then test with real logins)
3. blog-cat-api and blog-uploads-api
4. blog-post-api (it needs `CategoriesService` and the uploads URL format)
