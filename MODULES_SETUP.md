# User, category and upload module additions

These changes are based on the existing Prisma project and retain its ESM imports, PrismaService, generated Prisma client conventions, JWT cookie strategy, and `/api/v1` prefix.

## Before running
1. Copy your existing `.env` into this project; never commit it.
2. Install the new dependencies: `npm install` (adds `cloudinary` and `multer`).
3. Regenerate Prisma client: `npx prisma generate`.
4. Review the category migration, then apply it using the team's normal migration process (`npx prisma migrate deploy` in an environment where DATABASE_URL points to the intended database).
5. Configure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` to test uploads.
6. Run `npm run build` and `npm test`.

## Endpoints added
- `GET /api/v1/users/me` (authenticated)
- `PATCH /api/v1/users/me` (authenticated)
- `GET /api/v1/users?page=1&limit=10&role=READER&status=ACTIVE&search=word` (ADMIN)
- `GET /api/v1/categories` (public)
- `POST /api/v1/categories` (ADMIN, JSON `{ "name": "Technology" }`)
- `DELETE /api/v1/categories/:id` (ADMIN)
- `POST /api/v1/uploads/image` (ADMIN; multipart form field `file`)

The existing service methods `findById`, role/status changes, self-lockout protection, session-version invalidation and JWT active-status check are preserved. `createUser` is an admin-only service operation; no public signup endpoint has been added because the teammate's existing auth design did not define one. Category records are separate from the blog's existing string category field; connecting category IDs to blogs requires a coordinated schema/API change and is intentionally not silently imposed here.
