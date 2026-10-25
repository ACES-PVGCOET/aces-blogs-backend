# Blog backend

Backend for the blog platform. **Stack:** NestJS (TypeScript) + PostgreSQL + Prisma. Frontend (separate repo): Next.js, Tailwind CSS, TipTap.

Readers read, **writers** (authors) write, **reviewers** approve every blog before it is published, **admins** manage everything.

## Who builds what
Each module is one folder and one branch. Work only inside your own folder.

| Module (API) | Folder | Branch | Owner |
|---|---|---|---|
| user-mgmt-api | `src/users`, `src/auth` | `feat/user-mgmt-api` | _fill in_ |
| blog-post-api | `src/blog` | `feat/blog-post-api` | _fill in_ |
| blog-cat-api | `src/categories` | `feat/blog-cat-api` | _fill in_ |
| blog-uploads-api | `src/uploads` | `feat/blog-uploads-api` | _fill in_ |

Read [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) before your first commit and [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the rules modules share. Your task list is in `docs/api/<your-module>.md`.

## Run it locally
Needs Node 20+ and PostgreSQL.
```powershell
npm install
copy .env.example .env      # then set DATABASE_URL (your DB password) and JWT_SECRET
# create an empty database called blog_app in PostgreSQL, then:
npx prisma generate
npm run start:dev
```
- API: http://localhost:4000/api (try `/api/health`)
- Swagger docs: http://localhost:4000/docs

## Tests
Use a separate database (name must contain `test`):
```powershell
$env:DATABASE_URL="postgresql://postgres:<password>@localhost:5432/blog_app_test?schema=public"; npx prisma db push; npm run test:e2e
```

## Status
- [ ] user-mgmt-api
- [ ] blog-post-api
- [ ] blog-cat-api
- [ ] blog-uploads-api
