import { ExecutionContext, INestApplication, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { type BlogStatus, UserRole, UserStatus } from '@prisma/client';
import * as request from 'supertest';
import { AdminModule } from '../../src/admin';
import { JwtAuthGuard } from '../../src/common';
import { PrismaModule, PrismaService } from '../../src/prisma';
import { assertSafeTestDatabase, TEST_DATABASE_URL } from './database';

export const CLOUD_NAME = 'test-cloud';
export const img = (name = 'a.png') => `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v1/${name}`;
export const doc = (text: string) => ({
  type: 'doc',
  content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
});
export const EMPTY = { type: 'doc', content: [{ type: 'paragraph' }] };

export interface TestUser {
  id: string;
  cookie: string;
}

export interface TestContext {
  app: INestApplication;
  prisma: PrismaService;
  http: () => ReturnType<typeof request>;
  as: (u: TestUser) => { Cookie: string };
  makeUser: (label: string, role?: UserRole, status?: UserStatus) => Promise<TestUser>;
  sign: (userId: string) => Promise<string>;
  /** Empties every table between tests. */
  clean: () => Promise<void>;
  /** Puts a blog straight into a state only the reviewer side can create. */
  seedBlog: (opts: SeedBlog) => Promise<{ id: string; slug: string }>;
  close: () => Promise<void>;
}

export interface SeedBlog {
  authorId: string;
  slug: string;
  title?: string;
  status: BlogStatus;
  category?: string;
  tags?: string[];
  excerpt?: string | null;
  publishedVersion?: number | null;
  publishedAt?: Date | null;
  deletedAt?: Date | null;
  reviewNote?: string | null;
  /** version -> text. The highest one becomes latestRevisionVersion. */
  versions: Record<number, string>;
}

export async function createTestContext(): Promise<TestContext> {
  if (!TEST_DATABASE_URL) throw new Error('TEST_DATABASE_URL is not set');
  assertSafeTestDatabase(TEST_DATABASE_URL);

  process.env.DATABASE_URL = TEST_DATABASE_URL;
  process.env.CLOUDINARY_CLOUD_NAME = CLOUD_NAME;

  let prismaRef: PrismaService | undefined;
  // Stands in for the user-mgmt JwtStrategy: cookie `aces_session=<userId>`, user must exist and be ACTIVE.
  const testGuard = {
    canActivate: async (ctx: ExecutionContext) => {
      const req = ctx.switchToHttp().getRequest<{ headers: { cookie?: string }; user?: unknown }>();
      const match = /(?:^|;\s*)aces_session=([^;]+)/.exec(req.headers.cookie ?? '');
      const id = match ? decodeURIComponent(match[1]) : '';
      if (!/^[0-9a-f-]{36}$/i.test(id)) throw new UnauthorizedException();
      const user = await prismaRef!.user.findUnique({ where: { id } });
      if (!user || user.status !== UserStatus.ACTIVE) throw new UnauthorizedException();
      req.user = { id: user.id, role: user.role };
      return true;
    },
  };

  const moduleRef = await Test.createTestingModule({
    imports: [ConfigModule.forRoot({ isGlobal: true, ignoreEnvFile: true }), PrismaModule, AdminModule],
  })
    .overrideGuard(JwtAuthGuard)
    .useValue(testGuard)
    .compile();

  const app = moduleRef.createNestApplication();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  await app.init();

  const prisma = app.get(PrismaService);
  prismaRef = prisma;
  const server = app.getHttpServer();

  const sign = async (userId: string) => userId;

  return {
    app,
    prisma,
    http: () => request(server),
    as: (u) => ({ Cookie: u.cookie }),
    sign,
    makeUser: async (label, role = UserRole.WRITER, status = UserStatus.ACTIVE) => {
      const user = await prisma.user.create({
        data: { name: label, email: `${label}@test.local`, passwordHash: 'not-a-real-hash', role, status },
      });
      return { id: user.id, cookie: `aces_session=${await sign(user.id)}` };
    },
    clean: async () => {
      await prisma.$executeRawUnsafe(
        'TRUNCATE TABLE blog_audit_log, blog_content, role_change_log, blogs, "User" RESTART IDENTITY CASCADE',
      );
    },
    seedBlog: async (o) => {
      const latest = Math.max(...Object.keys(o.versions).map(Number));
      const blog = await prisma.blog.create({
        data: {
          slug: o.slug,
          title: o.title ?? o.slug,
          excerpt: o.excerpt ?? null,
          category: o.category ?? 'Security',
          tags: o.tags ?? [],
          authorId: o.authorId,
          status: o.status,
          reviewNote: o.reviewNote ?? null,
          latestRevisionVersion: latest,
          latestPublishedVersion: o.publishedVersion ?? null,
          publishedAt: o.publishedAt ?? null,
          deletedAt: o.deletedAt ?? null,
        },
      });
      for (const [version, text] of Object.entries(o.versions)) {
        await prisma.blogContent.create({
          data: { blogId: blog.id, version: Number(version), content: doc(text), createdById: o.authorId },
        });
      }
      return { id: blog.id, slug: blog.slug };
    },
    close: async () => {
      await app.close();
    },
  };
}
