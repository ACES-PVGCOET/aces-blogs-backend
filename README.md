# ACES Blog Backend API

Production-ready backend API service for the **ACES Blog Platform**, engineered with **NestJS 12**, **Prisma ORM 7**, **PostgreSQL**, and **NodeNext ESM**. Features granular Role-Based Access Control (RBAC), multi-versioned publication workflows with TipTap JSON storage, optimistic concurrency locking, Cloudinary asset integration, and comprehensive OpenAPI documentation.

---

## 1. System Architecture

```mermaid
flowchart TD
    Client["Client / Frontend (Next.js)"] -->|"HTTPS / Cookie: aces_session"| Ingress["Ingress / Reverse Proxy (Nginx / ALB)"]
    Ingress --> Main["main.ts (CORS, CookieParser, ValidationPipe, PrismaExceptionFilter)"]
    
    subgraph AppModule ["AppModule (/api/v1)"]
        AuthModule["AuthModule (/auth)"]
        UsersModule["UsersModule (/users)"]
        BlogsModule["BlogsModule (/blogs)"]
        ReviewerModule["ReviewerModule (/reviewer)"]
        AdminModule["AdminModule (/admin)"]
        CategoriesModule["CategoriesModule (/categories)"]
        UploadsModule["UploadsModule (/uploads)"]
        HealthModule["HealthModule (/health)"]
    end

    Main --> AppModule
    AppModule --> PrismaModule["PrismaModule (Global PrismaService)"]
    PrismaModule --> DB[("PostgreSQL Database")]
    UploadsModule --> Cloudinary[("Cloudinary Asset Store")]
```

---

## 2. Core Features

- **Authentication & Session Lifecycle**:
  - Argon2 password hashing.
  - Dual token support: HttpOnly `aces_session` cookie and `Authorization: Bearer <token>` header.
  - Immediate revocation across all devices (`sessionVersion` tracking in database).
- **Role-Based Access Control (RBAC)**:
  - `READER`: Browse published blogs.
  - `WRITER`: Create, edit drafts, submit to review queue, view authored blogs.
  - `REVIEWER`: Inspect review queue, compare diffs, approve & publish, or reject revisions with feedback.
  - `ADMIN`: Global user management, role mutation audit logs, direct publish, soft-delete & restore.
- **Content Versioning & Optimistic Locking**:
  - Metadata (`blogs`) and TipTap JSON content (`blog_content`) are stored separately.
  - Every content modification requires `expectedVersion` to prevent lost updates during concurrent edits.
- **Enterprise Hardening**:
  - Native NodeNext ECMAScript module resolution.
  - Global `PrismaExceptionFilter` mapping database constraint errors to standard HTTP status codes (409 Conflict, 404 Not Found, 400 Bad Request).
  - Multi-stage Docker container with unprivileged `node` runtime user.
  - Automated CI/CD pipeline running schema validation, type check (`tsc`), Oxlint, and Vitest test suites.

---

## 3. Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Runtime & Language** | Node.js 22+, TypeScript 6, NodeNext ESM |
| **Framework** | NestJS 12 (`@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`) |
| **Database & ORM** | PostgreSQL 16+, Prisma ORM 7 (`@prisma/client`, `@prisma/adapter-pg`) |
| **Security & Auth** | Passport, Passport-JWT, Argon2, Cookie-Parser |
| **Validation** | Class-Validator, Class-Transformer |
| **Asset Storage** | Cloudinary, Multer |
| **API Documentation** | Swagger / OpenAPI (`@nestjs/swagger`) |
| **Testing & Quality** | Vitest, Supertest, Oxlint |
| **Containerization** | Docker (Alpine multi-stage), Docker Compose |

---

## 4. API Endpoints Overview

All business routes are prefixed with `/api/v1` (except `/health`). Interactive OpenAPI UI is available at `/api/docs`.

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Public | Authenticates credentials and sets `aces_session` cookie. |
| `POST` | `/auth/logout` | Public | Clears session cookie. |
| `POST` | `/auth/logout-all` | Authenticated | Revokes all active user sessions across all devices. |
| `GET` | `/auth/me` | Authenticated | Returns authenticated user profile and roles. |

### Users (`/api/v1/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/users/me` | Authenticated | Retrieves current user profile. |
| `PATCH` | `/users/me` | Authenticated | Updates bio, profile image, or LinkedIn link. |
| `GET` | `/users` | `ADMIN` | Lists users with role, status, and search filters. |

### Blogs - Author (`/api/v1/blogs`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/blogs` | `WRITER`, `ADMIN` | Creates new blog draft with initial version 1 content. |
| `GET` | `/blogs/mine` | `WRITER`, `ADMIN` | Lists authored blogs with status and reviewer notes. |
| `GET` | `/blogs/:id/editable` | `WRITER`, `ADMIN` | Retrieves latest draft content for editing. |
| `PATCH` | `/blogs/:id/content` | `WRITER`, `ADMIN` | Saves draft revision with optimistic locking check. |
| `POST` | `/blogs/:id/archive` | `WRITER`, `ADMIN` | Transitions blog to ARCHIVED. |
| `DELETE` | `/blogs/:id` | `WRITER`, `ADMIN` | Soft-deletes authored blog. |

### Blogs - Public (`/api/v1/blogs`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/blogs/public` | Public | Paginated published blogs (category, tag, sort filters). |
| `GET` | `/blogs/public/:slug` | Public | Full published blog content and author profile by slug. |

### Reviewer Workflow (`/api/v1/reviewer`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/reviewer/blogs-to-review` | `REVIEWER`, `ADMIN` | Fetches queue of blogs in `UNDER_REVIEW`. |
| `POST` | `/reviewer/blogs/:id/start-review` | `REVIEWER`, `ADMIN` | Claims blog for review. |
| `GET` | `/reviewer/blogs/:id/comparison` | `REVIEWER`, `ADMIN` | Side-by-side diff of published content vs submitted revision. |
| `POST` | `/reviewer/blogs/:id/publish` | `REVIEWER`, `ADMIN` | Approves and publishes latest revision live. |
| `POST` | `/reviewer/blogs/:id/reject-revision` | `REVIEWER`, `ADMIN` | Rejects revision with mandatory reviewer note. |

### Admin Operations (`/api/v1/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/users` | `ADMIN` | User management with pagination and search. |
| `GET` | `/admin/reviewers` | `ADMIN` | Workload analytics for all reviewers. |
| `PATCH` | `/admin/users/:id/role` | `ADMIN` | Changes user role and writes immutable audit row. |
| `PATCH` | `/admin/users/:id/status` | `ADMIN` | Changes user status (`ACTIVE`, `BLOCKED`, `DELETED`). |
| `GET` | `/admin/blogs` | `ADMIN` | Lists all blogs across every lifecycle status. |
| `POST` | `/admin/blogs` | `ADMIN` | Direct blog creation with custom slug. |
| `POST` | `/admin/blogs/:id/publish` | `ADMIN` | Directly publishes blog bypassing review queue. |
| `POST` | `/admin/blogs/:id/restore` | `ADMIN` | Restores soft-deleted or archived blogs. |

### Categories & Uploads
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/categories` | Public | Lists all categories in alphabetical order. |
| `POST` | `/api/v1/categories` | `ADMIN` | Creates new category. |
| `DELETE` | `/api/v1/categories/:id` | `ADMIN` | Deletes unused category (protected against active references). |
| `POST` | `/api/v1/uploads/image` | `WRITER`, `ADMIN` | Uploads image to Cloudinary (multipart/form-data, max 5MB). |
| `GET` | `/health` | Public | Health probe with database ping (`SELECT 1`). |

---

## 5. Environment Variables

Create `.env` based on `.env.example`:

```bash
cp .env.example .env
```

| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/aces_blog?schema=public` |
| `JWT_SECRET` | Yes | Secret key for signing session tokens | Random 64-character string |
| `PORT` | No | Application port (default: 4000) | `4000` |
| `FRONTEND_ORIGIN` | No | CORS allowed origins (comma-separated) | `http://localhost:3000,https://aces.org` |
| `CLOUDINARY_CLOUD_NAME` | No | Cloudinary cloud identifier | `aces-cloud` |
| `CLOUDINARY_API_KEY` | No | Cloudinary API access key | `1234567890` |
| `CLOUDINARY_API_SECRET` | No | Cloudinary API secret | `secret_token` |
| `SEED_ADMIN_EMAIL` | No | Default admin email for seeder | `admin@aces.org` |
| `SEED_ADMIN_PASSWORD` | No | Default admin password for seeder | `Admin@123456!` |

---

## 6. Getting Started

### Prerequisites
- Node.js 22+
- PostgreSQL 16+ or Docker

### Installation & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Validate & generate Prisma client**:
   ```bash
   npx prisma validate
   npx prisma generate
   ```

3. **Run database migrations**:
   ```bash
   npx prisma migrate deploy
   ```

4. **Seed database (Admin & Categories)**:
   ```bash
   npm run seed
   ```

5. **Start development server**:
   ```bash
   npm run start:dev
   ```

6. Open Swagger API documentation:
   ```
   http://localhost:4000/api/docs
   ```

---

## 7. Testing & Quality Checks

```bash
# Type check
npx tsc --noEmit

# Code linting
npm run lint

# Unit tests
npm run test

# End-to-end tests (requires PostgreSQL test database)
npm run test:e2e

# Production build
npm run build
```

---

## 8. Docker Deployment

### Run Complete Stack with Docker Compose
```bash
docker compose up --build
```
This starts PostgreSQL 16 on port `5432` and the API service on port `4000`.

### Standalone Docker Build
```bash
docker build -t aces-blog-backend:latest .
docker run -p 4000:4000 --env-file .env aces-blog-backend:latest
```
