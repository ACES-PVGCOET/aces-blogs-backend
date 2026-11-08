# Module Configuration & Setup

This document outlines the setup details for all domain modules in the unified `aces-blogs-backend`.

---

## 1. Domain Modules Summary

| Module | Route Prefix | Primary Responsibilities |
| :--- | :--- | :--- |
| **`AuthModule`** | `/api/v1/auth` | Credentials validation, argon2 hashing, JWT signing, `aces_session` cookie management, and multi-device session revocation. |
| **`UsersModule`** | `/api/v1/users` | User profile retrieval, profile updates, and admin user listing. |
| **`BlogsModule`** | `/api/v1/blogs` | Authoring drafts, revision saves with optimistic concurrency, public blog search, and reader views. |
| **`ReviewerModule`** | `/api/v1/reviewer` | Review queue inspection, side-by-side diff comparison, approval publishing, and revision rejection with reviewer notes. |
| **`AdminModule`** | `/api/v1/admin` | User role mutations with audit logging, reviewer workload tracking, direct blog publishing, and soft-delete/restore operations. |
| **`CategoriesModule`** | `/api/v1/categories` | Blog category catalog management with referential protection against deleting categories in active use. |
| **`UploadsModule`** | `/api/v1/uploads` | Multer-backed multipart image upload handling with Cloudinary storage. |
| **`PrismaModule`** | Global | Global database connection pooling via `@prisma/adapter-pg`. |

---

## 2. Environment Dependencies

Ensure the following variables are defined in `.env`:
- `DATABASE_URL`: PostgreSQL connection URL
- `JWT_SECRET`: Signing secret for authentication tokens
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Required for image uploads
- `FRONTEND_ORIGIN`: Allowed origins for CORS credentials

---

## 3. Automated Seeding

Run the database seeder to initialize default categories (`Technology`, `Design`, `Events`, `Announcements`, `Tutorials`) and super admin credentials:
```bash
npm run seed
```
