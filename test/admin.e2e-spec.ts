/**
 * Admin API: JwtAuthGuard replaced by a test guard (user-mgmt not merged yet), real Prisma, real Postgres.
 *
 *   TEST_DATABASE_URL=postgresql://user:pass@localhost:5432/blog_app_test npm run test:e2e
 *
 * The database name must contain "test": its schema is DROPPED and re-migrated before the run.
 */
import { BlogStatus, UserRole, UserStatus } from '@prisma/client';
import { createTestContext, doc, EMPTY, img, type TestContext, type TestUser } from './support/admin-test-app';
import { TEST_DATABASE_URL } from './support/database';

(TEST_DATABASE_URL ? describe : describe.skip)('admin API', () => {
  let t: TestContext;
  let admin: TestUser;
  let writer: TestUser;
  let reviewer: TestUser;

  const users = '/api/admin/users';
  const blogs = '/api/admin/blogs';
  const versions = (blogId: string) =>
    t.prisma.blogContent.findMany({ where: { blogId }, orderBy: { version: 'asc' } });
  const fresh = (id: string) => t.prisma.blog.findUniqueOrThrow({ where: { id } });

  beforeAll(async () => {
    t = await createTestContext();
  });
  afterAll(async () => {
    await t.close();
  });
  beforeEach(async () => {
    await t.clean();
    admin = await t.makeUser('admin', UserRole.ADMIN);
    writer = await t.makeUser('writer', UserRole.WRITER);
    reviewer = await t.makeUser('reviewer', UserRole.REVIEWER);
  });

  describe('access', () => {
    it('401 without a session, 403 for every non-admin role', async () => {
      await t.http().get(users).expect(401);
      await t.http().get(blogs).expect(401);
      for (const u of [writer, reviewer, await t.makeUser('reader', UserRole.READER)]) {
        await t.http().get(users).set(t.as(u)).expect(403);
        await t.http().get(blogs).set(t.as(u)).expect(403);
        await t.http().post(blogs).set(t.as(u)).send({}).expect(403);
      }
    });

    it('rejects a blocked admin (401)', async () => {
      const blocked = await t.makeUser('blocked', UserRole.ADMIN, UserStatus.BLOCKED);
      await t.http().get(users).set(t.as(blocked)).expect(401);
    });
  });

  describe('users', () => {
    it('lists users without password data, filters and paginates', async () => {
      const res = await t.http().get(users).query({ role: 'WRITER' }).set(t.as(admin)).expect(200);
      expect(res.body.total).toBe(1);
      expect(res.body.items[0]).toMatchObject({ id: writer.id, role: 'WRITER' });
      expect(res.body.items[0]).not.toHaveProperty('passwordHash');
      expect(res.body.items[0]).not.toHaveProperty('sessionVersion');

      const page = await t.http().get(users).query({ limit: 2, page: 2 }).set(t.as(admin)).expect(200);
      expect(page.body).toMatchObject({ total: 3, page: 2, limit: 2 });
      expect(page.body.items).toHaveLength(1);
    });

    it('searches name and email, and treats % as a literal', async () => {
      const hit = await t.http().get(users).query({ search: 'WRIT' }).set(t.as(admin)).expect(200);
      expect(hit.body.items.map((u: { id: string }) => u.id)).toEqual([writer.id]);
      const wild = await t.http().get(users).query({ search: '%' }).set(t.as(admin)).expect(200);
      expect(wild.body.total).toBe(0);
    });

    it('400 on bad query values, 404 on unknown user, 400 on a non-uuid id', async () => {
      await t.http().get(users).query({ role: 'KING' }).set(t.as(admin)).expect(400);
      await t.http().get(users).query({ limit: 500 }).set(t.as(admin)).expect(400);
      await t.http().get(`${users}/00000000-0000-4000-8000-000000000000`).set(t.as(admin)).expect(404);
      await t.http().get(`${users}/nope`).set(t.as(admin)).expect(400);
    });

    it('changes a role and writes the role log; same role is a no-op', async () => {
      const res = await t.http().patch(`${users}/${writer.id}/role`).set(t.as(admin)).send({ role: 'REVIEWER' }).expect(200);
      expect(res.body.role).toBe('REVIEWER');
      const logs = await t.prisma.roleChangeLog.findMany();
      expect(logs).toHaveLength(1);
      expect(logs[0]).toMatchObject({ targetUserId: writer.id, changedBy: admin.id, oldRole: 'WRITER', newRole: 'REVIEWER' });

      await t.http().patch(`${users}/${writer.id}/role`).set(t.as(admin)).send({ role: 'REVIEWER' }).expect(200);
      expect(await t.prisma.roleChangeLog.count()).toBe(1);
    });

    it('does not let an admin change their own role or status', async () => {
      await t.http().patch(`${users}/${admin.id}/role`).set(t.as(admin)).send({ role: 'READER' }).expect(403);
      await t.http().patch(`${users}/${admin.id}/status`).set(t.as(admin)).send({ status: 'BLOCKED' }).expect(403);
    });

    it('400 on an unknown role, extra fields or status', async () => {
      await t.http().patch(`${users}/${writer.id}/role`).set(t.as(admin)).send({ role: 'KING' }).expect(400);
      await t.http().patch(`${users}/${writer.id}/role`).set(t.as(admin)).send({ role: 'READER', x: 1 }).expect(400);
      await t.http().patch(`${users}/${writer.id}/status`).set(t.as(admin)).send({ status: 'GONE' }).expect(400);
    });

    it('blocking a user stops their session at once', async () => {
      await t.http().patch(`${users}/${writer.id}/status`).set(t.as(admin)).send({ status: 'BLOCKED' }).expect(200);
      await t.http().get(blogs).set(t.as(writer)).expect(401);
    });

    it('two admins changing one role at the same time: never a lost update', async () => {
      const other = await t.makeUser('admin2', UserRole.ADMIN);
      const results = await Promise.all([
        t.http().patch(`${users}/${writer.id}/role`).set(t.as(admin)).send({ role: 'REVIEWER' }),
        t.http().patch(`${users}/${writer.id}/role`).set(t.as(other)).send({ role: 'READER' }),
      ]);
      const statuses = results.map((r) => r.status);
      expect(statuses.every((s) => s === 200 || s === 409)).toBe(true);
      expect(statuses).toContain(200);

      // every 200 left exactly one log row, and the stored role is the newest log's role
      const logs = await t.prisma.roleChangeLog.findMany({ where: { targetUserId: writer.id }, orderBy: { createdAt: 'asc' } });
      expect(logs).toHaveLength(statuses.filter((s) => s === 200).length);
      const user = await t.prisma.user.findUniqueOrThrow({ where: { id: writer.id } });
      expect(user.role).toBe(logs[logs.length - 1].newRole);
    });

    it('lists reviewers with their workload', async () => {
      const w = await t.makeUser('w2');
      await t.seedBlog({ authorId: w.id, slug: 'a', status: BlogStatus.PUBLISHED, publishedVersion: 1, versions: { 1: 'x' } });
      await t.seedBlog({ authorId: w.id, slug: 'b', status: BlogStatus.UNDER_REVIEW, versions: { 1: 'y' } });
      await t.prisma.blog.updateMany({ data: { reviewerId: reviewer.id } });

      const res = await t.http().get('/api/admin/reviewers').set(t.as(admin)).expect(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0]).toMatchObject({ id: reviewer.id, workload: { underReview: 1, published: 1 } });
    });

    it("lists a user's authored and reviewed blogs", async () => {
      await t.seedBlog({ authorId: writer.id, slug: 'mine', status: BlogStatus.DRAFT, versions: { 1: 'x' } });
      const res = await t.http().get(`${users}/${writer.id}/blogs`).set(t.as(admin)).expect(200);
      expect(res.body.authored).toHaveLength(1);
      expect(res.body.reviewed).toHaveLength(0);
    });
  });

  describe('blogs: create and read', () => {
    const create = (body: Record<string, unknown> = {}) =>
      t.http().post(blogs).set(t.as(admin)).send({ title: 'Admin post', category: 'Security', content: doc('hello'), ...body });

    it('creates a DRAFT owned by the admin with version 1 and an audit row', async () => {
      const res = await create({ tags: ['Web Sec', 'web-sec', 'XSS'] }).expect(201);
      expect(res.body).toMatchObject({
        slug: 'admin-post',
        status: 'DRAFT',
        authorId: admin.id,
        latestRevisionVersion: 1,
        latestPublishedVersion: null,
        tags: ['web-sec', 'xss'],
      });
      expect(await versions(res.body.id)).toHaveLength(1);
      expect((await t.prisma.blogAuditLog.findMany({ where: { blogId: res.body.id } })).map((a) => a.action)).toEqual(['ADMIN_CREATE']);
    });

    it('uses a given slug, 409 when it is taken, random suffix when generated slugs collide', async () => {
      await create({ slug: 'custom-slug' }).expect(201);
      await create({ slug: 'custom-slug' }).expect(409);
      const a = await create().expect(201);
      const b = await create().expect(201);
      expect(a.body.slug).toBe('admin-post');
      expect(b.body.slug).toMatch(/^admin-post-[0-9a-f]{6}$/);
    });

    it('400 on bad input: slug format, missing content, bad TipTap, non-Cloudinary thumbnail or image', async () => {
      await create({ slug: 'Bad Slug' }).expect(400);
      await create({ content: undefined }).expect(400);
      await create({ title: 'ab' }).expect(400);
      await create({ content: { type: 'doc', content: [{ type: 'script' }] } }).expect(400);
      await create({ thumbnailUrl: 'https://evil.example/a.png' }).expect(400);
      await create({ content: { type: 'doc', content: [{ type: 'image', attrs: { src: 'https://evil.example/a.png' } }] } }).expect(400);
      await create({ content: { type: 'doc', content: [{ type: 'image', attrs: { src: img() } }] } }).expect(201);
      expect(await t.prisma.blog.count()).toBe(1);
    });

    it('lists every status including DELETED, filters and searches', async () => {
      await t.seedBlog({ authorId: writer.id, slug: 'one', title: 'Alpha 100%', status: BlogStatus.PUBLISHED, publishedVersion: 1, versions: { 1: 'x' } });
      await t.seedBlog({ authorId: writer.id, slug: 'two', title: 'Beta', status: BlogStatus.DELETED, deletedAt: new Date(), versions: { 1: 'x' } });
      const all = await t.http().get(blogs).set(t.as(admin)).expect(200);
      expect(all.body.total).toBe(2);
      const deleted = await t.http().get(blogs).query({ status: 'DELETED' }).set(t.as(admin)).expect(200);
      expect(deleted.body.items.map((b: { slug: string }) => b.slug)).toEqual(['two']);
      const q = await t.http().get(blogs).query({ q: '100%' }).set(t.as(admin)).expect(200);
      expect(q.body.items.map((b: { slug: string }) => b.slug)).toEqual(['one']);
      await t.http().get(blogs).query({ authorId: 'nope' }).set(t.as(admin)).expect(400);
    });

    it('returns a blog with its latest content; 404 for a deleted or unknown blog', async () => {
      const { id } = await t.seedBlog({ authorId: writer.id, slug: 'x', status: BlogStatus.DRAFT, versions: { 1: 'one', 2: 'two' } });
      const res = await t.http().get(`${blogs}/${id}`).set(t.as(admin)).expect(200);
      expect(res.body.content).toEqual(doc('two'));
      const gone = await t.seedBlog({ authorId: writer.id, slug: 'g', status: BlogStatus.DELETED, deletedAt: new Date(), versions: { 1: 'x' } });
      await t.http().get(`${blogs}/${gone.id}`).set(t.as(admin)).expect(404);
      await t.http().get(`${blogs}/00000000-0000-4000-8000-000000000000`).set(t.as(admin)).expect(404);
    });
  });

  describe('blogs: edit metadata', () => {
    it('changes only the fields sent, normalises tags, clears with null', async () => {
      const { id } = await t.seedBlog({ authorId: writer.id, slug: 'meta', status: BlogStatus.PUBLISHED, publishedVersion: 1, excerpt: 'old', versions: { 1: 'x' } });
      const res = await t.http().patch(`${blogs}/${id}`).set(t.as(admin)).send({ title: 'New title', tags: ['A B', 'a-b'], excerpt: null }).expect(200);
      expect(res.body).toMatchObject({ title: 'New title', slug: 'meta', tags: ['a-b'], excerpt: null, status: 'PUBLISHED' });
    });

    it('400 for an empty body, 409 for a taken slug, 404 for a deleted blog', async () => {
      const a = await t.seedBlog({ authorId: writer.id, slug: 'a', status: BlogStatus.DRAFT, versions: { 1: 'x' } });
      await t.seedBlog({ authorId: writer.id, slug: 'b', status: BlogStatus.DRAFT, versions: { 1: 'x' } });
      await t.http().patch(`${blogs}/${a.id}`).set(t.as(admin)).send({}).expect(400);
      await t.http().patch(`${blogs}/${a.id}`).set(t.as(admin)).send({ slug: 'b' }).expect(409);
      const gone = await t.seedBlog({ authorId: writer.id, slug: 'g', status: BlogStatus.DELETED, deletedAt: new Date(), versions: { 1: 'x' } });
      await t.http().patch(`${blogs}/${gone.id}`).set(t.as(admin)).send({ title: 'nope nope' }).expect(404);
    });
  });

  describe('blogs: edit content', () => {
    const put = (id: string, body: Record<string, unknown>) => t.http().put(`${blogs}/${id}/content`).set(t.as(admin)).send(body);

    it('DRAFT: overwrites the current version in place', async () => {
      const { id } = await t.seedBlog({ authorId: writer.id, slug: 'd', status: BlogStatus.DRAFT, versions: { 1: 'v1' } });
      await put(id, { content: doc('edited'), expectedVersion: 1 }).expect(200);
      const rows = await versions(id);
      expect(rows).toHaveLength(1);
      expect(rows[0].content).toEqual(doc('edited'));
      expect(rows[0].createdById).toBe(admin.id);
    });

    it('PUBLISHED: adds a version that goes live at once and never touches the old one', async () => {
      const { id } = await t.seedBlog({ authorId: writer.id, slug: 'p', status: BlogStatus.PUBLISHED, publishedVersion: 1, publishedAt: new Date('2026-01-01'), versions: { 1: 'v1' } });
      const res = await put(id, { content: doc('v2'), expectedVersion: 1 }).expect(200);
      expect(res.body).toMatchObject({ status: 'PUBLISHED', latestRevisionVersion: 2, latestPublishedVersion: 2, reviewerId: admin.id });
      expect(new Date(res.body.publishedAt).toISOString()).toBe('2026-01-01T00:00:00.000Z');
      const rows = await versions(id);
      expect(rows.map((r) => r.content)).toEqual([doc('v1'), doc('v2')]);
    });

    it('REVISION_DRAFT: the new version goes live and replaces the pending revision', async () => {
      const { id } = await t.seedBlog({ authorId: writer.id, slug: 'r', status: BlogStatus.REVISION_DRAFT, publishedVersion: 1, versions: { 1: 'live', 2: 'pending' } });
      const res = await put(id, { content: doc('admin'), expectedVersion: 2 }).expect(200);
      expect(res.body).toMatchObject({ status: 'PUBLISHED', latestRevisionVersion: 3, latestPublishedVersion: 3 });
    });

    it('REJECT: new version, goes back to a draft, is not live', async () => {
      const never = await t.seedBlog({ authorId: writer.id, slug: 'rj1', status: BlogStatus.REJECT, reviewNote: 'no', versions: { 1: 'x' } });
      const a = await put(never.id, { content: doc('fixed'), expectedVersion: 1 }).expect(200);
      expect(a.body).toMatchObject({ status: 'DRAFT', latestRevisionVersion: 2, latestPublishedVersion: null });

      const had = await t.seedBlog({ authorId: writer.id, slug: 'rj2', status: BlogStatus.REJECT, publishedVersion: 1, versions: { 1: 'live', 2: 'bad' } });
      const b = await put(had.id, { content: doc('fixed'), expectedVersion: 2 }).expect(200);
      expect(b.body).toMatchObject({ status: 'REVISION_DRAFT', latestRevisionVersion: 3, latestPublishedVersion: 1 });
    });

    it('ARCHIVED stays archived', async () => {
      const { id } = await t.seedBlog({ authorId: writer.id, slug: 'ar', status: BlogStatus.ARCHIVED, publishedVersion: 1, versions: { 1: 'x' } });
      const res = await put(id, { content: doc('y'), expectedVersion: 1 }).expect(200);
      expect(res.body).toMatchObject({ status: 'ARCHIVED', latestRevisionVersion: 2, latestPublishedVersion: 2 });
    });

    it('409 when under review, 404 when deleted, 409 on a stale expectedVersion', async () => {
      const ur = await t.seedBlog({ authorId: writer.id, slug: 'ur', status: BlogStatus.UNDER_REVIEW, versions: { 1: 'x' } });
      await put(ur.id, { content: doc('y'), expectedVersion: 1 }).expect(409);
      const del = await t.seedBlog({ authorId: writer.id, slug: 'dl', status: BlogStatus.DELETED, deletedAt: new Date(), versions: { 1: 'x' } });
      await put(del.id, { content: doc('y'), expectedVersion: 1 }).expect(404);
      const p = await t.seedBlog({ authorId: writer.id, slug: 'st', status: BlogStatus.PUBLISHED, publishedVersion: 2, versions: { 1: 'a', 2: 'b' } });
      await put(p.id, { content: doc('y'), expectedVersion: 1 }).expect(409);
      expect(await versions(p.id)).toHaveLength(2);
    });

    it('400 for bad TipTap, a missing expectedVersion, or extra fields', async () => {
      const { id } = await t.seedBlog({ authorId: writer.id, slug: 'bad', status: BlogStatus.DRAFT, versions: { 1: 'x' } });
      await put(id, { content: { type: 'doc', content: [{ type: 'script' }] }, expectedVersion: 1 }).expect(400);
      await put(id, { content: doc('y') }).expect(400);
      await put(id, { content: doc('y'), expectedVersion: 1, status: 'PUBLISHED' }).expect(400);
    });

    it('two saves with the same expectedVersion: exactly one wins', async () => {
      const { id } = await t.seedBlog({ authorId: writer.id, slug: 'race', status: BlogStatus.PUBLISHED, publishedVersion: 1, versions: { 1: 'x' } });
      const results = await Promise.all([1, 2, 3].map((n) => put(id, { content: doc(`edit ${n}`), expectedVersion: 1 })));
      expect(results.filter((r) => r.status === 200)).toHaveLength(1);
      expect(results.filter((r) => r.status === 409)).toHaveLength(2);
      expect(await versions(id)).toHaveLength(2);
      expect((await fresh(id)).latestRevisionVersion).toBe(2);
    });
  });

  describe('blogs: publish, delete, restore', () => {
    const post = (id: string, action: string) => t.http().post(`${blogs}/${id}/${action}`).set(t.as(admin));

    it('publishes a draft: live version, reviewer, publishedAt, note cleared, audit row', async () => {
      const { id } = await t.seedBlog({ authorId: writer.id, slug: 'pub', status: BlogStatus.REJECT, reviewNote: 'nope', versions: { 1: 'x' } });
      const res = await post(id, 'publish').expect(201);
      expect(res.body).toMatchObject({ status: 'PUBLISHED', latestPublishedVersion: 1, reviewerId: admin.id, reviewNote: null });
      expect(res.body.publishedAt).toBeTruthy();
      expect((await t.prisma.blogAuditLog.findMany({ where: { blogId: id } })).map((a) => a.action)).toContain('ADMIN_PUBLISH');
    });

    it('409 when already published or under review, 404 when deleted, 400 for an empty document', async () => {
      const p = await t.seedBlog({ authorId: writer.id, slug: 'a', status: BlogStatus.PUBLISHED, publishedVersion: 1, versions: { 1: 'x' } });
      await post(p.id, 'publish').expect(409);
      const ur = await t.seedBlog({ authorId: writer.id, slug: 'b', status: BlogStatus.UNDER_REVIEW, versions: { 1: 'x' } });
      await post(ur.id, 'publish').expect(409);
      const del = await t.seedBlog({ authorId: writer.id, slug: 'c', status: BlogStatus.DELETED, deletedAt: new Date(), versions: { 1: 'x' } });
      await post(del.id, 'publish').expect(404);
      const empty = await t.seedBlog({ authorId: writer.id, slug: 'd', status: BlogStatus.DRAFT, versions: { 1: 'x' } });
      await t.prisma.blogContent.updateMany({ where: { blogId: empty.id }, data: { content: EMPTY } });
      await post(empty.id, 'publish').expect(400);
    });

    it('soft delete sets status and deletedAt, hides the blog, and a second delete is 404', async () => {
      const { id } = await t.seedBlog({ authorId: writer.id, slug: 'del', status: BlogStatus.PUBLISHED, publishedVersion: 1, versions: { 1: 'x' } });
      await t.http().delete(`${blogs}/${id}`).set(t.as(admin)).expect(200);
      const row = await fresh(id);
      expect(row.status).toBe('DELETED');
      expect(row.deletedAt).not.toBeNull();
      await t.http().get(`${blogs}/${id}`).set(t.as(admin)).expect(404);
      await t.http().delete(`${blogs}/${id}`).set(t.as(admin)).expect(404);
    });

    it('restore: DRAFT when never published, ARCHIVED (not live) when it was; 409 when not deleted', async () => {
      const a = await t.seedBlog({ authorId: writer.id, slug: 'ra', status: BlogStatus.DELETED, deletedAt: new Date(), versions: { 1: 'x' } });
      const resA = await post(a.id, 'restore').expect(201);
      expect(resA.body).toMatchObject({ status: 'DRAFT', deletedAt: null });

      const b = await t.seedBlog({ authorId: writer.id, slug: 'rb', status: BlogStatus.DELETED, deletedAt: new Date(), publishedVersion: 1, versions: { 1: 'x' } });
      const resB = await post(b.id, 'restore').expect(201);
      expect(resB.body).toMatchObject({ status: 'ARCHIVED', deletedAt: null });

      await post(resB.body.id, 'restore').expect(409);
      await post('00000000-0000-4000-8000-000000000000', 'restore').expect(404);
    });
  });
});
