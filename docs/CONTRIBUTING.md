# Contributing Guidelines

This guide covers engineering standards, git conventions, and verification steps for contributing to `aces-blogs-backend`.

---

## 1. Development Workflow

1. **Clone and Install**:
   ```bash
   git clone https://github.com/<org>/aces-blogs-backend.git
   cd aces-blogs-backend
   npm install
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Populate DATABASE_URL, JWT_SECRET, and Cloudinary keys
   ```

3. **Database Initialization**:
   ```bash
   npx prisma validate
   npx prisma generate
   npx prisma migrate deploy
   npm run seed
   ```

4. **Branch Naming**:
   - `feat/<feature-name>`: New functionality
   - `fix/<bug-name>`: Bug fixes
   - `docs/<doc-name>`: Documentation updates
   - `chore/<task>`: Dependency or build updates

---

## 2. Coding Standards

- **NodeNext ESM Rules**: Always include explicit `.js` extensions on relative imports:
  ```ts
  // Correct
  import { BlogsService } from './blogs.service.js';
  import { JwtAuthGuard } from '../common/index.js';

  // Incorrect
  import { BlogsService } from './blogs.service';
  ```
- **Module Encapsulation**: Only import from the public contract `src/<module>/index.ts`. Never deep-import into another module's `internal/` or `http/` directories.
- **DTO Validation**: Every incoming request payload must be strictly typed and validated using `class-validator` and `class-transformer` decorators.
- **Swagger Documentation**: Annotate all new controllers and endpoints with `@ApiTags()`, `@ApiOperation()`, and `@ApiResponse()`.

---

## 3. Verification Checklist

Before submitting a Pull Request, all automated quality gates must pass:

```bash
# 1. Prisma schema check
npx prisma validate

# 2. Code linting (zero warnings / errors)
npm run lint

# 3. TypeScript compilation check
npx tsc --noEmit

# 4. Production build
npm run build

# 5. Unit test suite
npm run test

# 6. E2E test suite (requires test database)
npm run test:e2e
```

---

## 4. Pull Request Requirements

- Describe the problem solved and reference related issues.
- Confirm all tests pass.
- Do not commit `.env`, `node_modules/`, `dist/`, or temporary files.
