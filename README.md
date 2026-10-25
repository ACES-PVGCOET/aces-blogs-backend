# Blog backend

Backend for the blog platform. **Stack:** NestJS (TypeScript) + PostgreSQL + TypeORM. Frontend (separate repo): Next.js, Tailwind CSS, TipTap.

Readers read, **writers** (authors) write, **reviewers** approve every blog before it is published, **admins** manage everything.


Read [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) before your first commit and [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the rules modules share. Your task list is in `docs/api/<your-module>.md`.

## Run it locally
Needs Node 20+ and PostgreSQL.
```powershell
npm install
copy .env.example .env      # then set DB_PASSWORD and JWT_SECRET
# create an empty database called blog_app in PostgreSQL, then:
npm run start:dev
```
- API: http://localhost:4000/api (try `/api/health`)
- Swagger docs: http://localhost:4000/docs

## Tests
Use a separate database (name must contain `test`):
```powershell
$env:DB_NAME="blog_app_test"; npm run test:e2e
```

## Status
- [ ] user-mgmt-api
- [ ] blog-post-api
- [ ] blog-cat-api
- [ ] blog-uploads-api
