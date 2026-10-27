import { BlogStatus } from '@prisma/client';
import { createTestContext, doc, type TestContext, type TestUser } from './support/test-app';
import { TEST_DATABASE_URL } from './support/database';

(TEST_DATABASE_URL ? describe : describe.skip)('public blog API', () => {
  let t: TestContext;
  let author: TestUser;
  const base = '/api/public/blogs';
  const day = (n: number) => new Date(Date.UTC(2026, 0, n));

  beforeAll(async () => {
    t = await createTestContext();
  });
  afterAll(async () => {
    await t.close();
  });
  beforeEach(async () => {
    await t.clean();
    author = await t.makeUser('asha');
    await t.prisma.user.update({ where: { id: author.id }, data: { name: 'Asha', profileImg: 'https://example.com/asha.png' } });
  });

  const seed = (slug: string, status: BlogStatus, extra: Partial<Parameters<TestContext['seedBlog']>[0]> = {}) =>
    t.seedBlog({ authorId: author.id, slug, status, versions: { 1: `live ${slug}` }, publishedVersion: 1, publishedAt: day(10), ...extra });

  describe('live rule', () => {
    it('shows published blogs, including ones being revised or re-reviewed, with the PUBLISHED content', async () => {
      await seed('published', BlogStatus.PUBLISHED);
      await seed('revising', BlogStatus.REVISION_DRAFT, { versions: { 1: 'live revising', 2: 'SECRET draft v2' } });
      await seed('reviewing', BlogStatus.UNDER_REVIEW, { versions: { 1: 'live reviewing', 2: 'SECRET draft v2' } });

      const list = await t.http().get(base).expect(200);
      expect(list.body.items.map((i: { slug: string }) => i.slug).sort()).toEqual(['published', 'reviewing', 'revising']);

      const revising = await t.http().get(`${base}/revising`).expect(200);
      expect(revising.body.content).toEqual(doc('live revising'));
      expect(JSON.stringify(revising.body)).not.toContain('SECRET');
    });

    it('hides never-published, archived, deleted and soft-deleted blogs (list and by slug)', async () => {
      await seed('never-published', BlogStatus.DRAFT, { publishedVersion: null, publishedAt: null });
      await seed('under-review-first-time', BlogStatus.UNDER_REVIEW, { publishedVersion: null, publishedAt: null });
      await seed('archived', BlogStatus.ARCHIVED);
      await seed('deleted', BlogStatus.DELETED, { deletedAt: day(11) });
      await seed('soft-deleted', BlogStatus.PUBLISHED, { deletedAt: day(11) });
      await seed('visible', BlogStatus.PUBLISHED);

      const list = await t.http().get(base).expect(200);
      expect(list.body.items.map((i: { slug: string }) => i.slug)).toEqual(['visible']);
      expect(list.body.total).toBe(1);
      for (const slug of ['never-published', 'under-review-first-time', 'archived', 'deleted', 'soft-deleted', 'missing']) {
        await t.http().get(`${base}/${slug}`).expect(404);
      }
    });
  });

  describe('response shape', () => {
    it('has no id, version numbers, status, reviewer or review note', async () => {
      await seed('shape', BlogStatus.PUBLISHED, { excerpt: 'An excerpt', tags: ['xss'], reviewNote: 'SECRET note' });
      const expected = ['author', 'category', 'excerpt', 'publishedAt', 'slug', 'tags', 'thumbnailUrl', 'title'];

      const list = await t.http().get(base).expect(200);
      expect(Object.keys(list.body.items[0]).sort()).toEqual(expected);
      expect(list.body.items[0].author).toEqual({ name: 'Asha', profileImg: 'https://example.com/asha.png' });

      const one = await t.http().get(`${base}/shape`).expect(200);
      expect(Object.keys(one.body).sort()).toEqual([...expected, 'content'].sort());
      expect(JSON.stringify(one.body)).not.toContain('SECRET');
    });

    it('needs no login', async () => {
      await seed('open', BlogStatus.PUBLISHED);
      await t.http().get(base).expect(200);
      await t.http().get(`${base}/open`).expect(200);
    });
  });

  describe('list', () => {
    beforeEach(async () => {
      await seed('oldest', BlogStatus.PUBLISHED, { title: 'Oldest XSS guide', category: 'Security', tags: ['xss', 'web'], publishedAt: day(1) });
      await seed('middle', BlogStatus.PUBLISHED, { title: 'Docker basics', category: 'DevOps', tags: ['docker'], publishedAt: day(5) });
      await seed('newest', BlogStatus.PUBLISHED, { title: '100% Nest tips', category: 'security', tags: ['nest', 'web'], publishedAt: day(9) });
    });

    it('sorts by publishedAt, newest first', async () => {
      const res = await t.http().get(base).expect(200);
      expect(res.body.items.map((i: { slug: string }) => i.slug)).toEqual(['newest', 'middle', 'oldest']);
    });

    it('filters by category (case-insensitive), tag and title (case-insensitive, contains)', async () => {
      const slugs = async (qs: string) =>
        (await t.http().get(`${base}?${qs}`).expect(200)).body.items.map((i: { slug: string }) => i.slug);

      expect(await slugs('category=SECURITY')).toEqual(['newest', 'oldest']);
      expect(await slugs('tag=web')).toEqual(['newest', 'oldest']);
      expect(await slugs('tag=WEB')).toEqual(['newest', 'oldest']);
      expect(await slugs('q=docker')).toEqual(['middle']);
      expect(await slugs('q=GUIDE&category=security')).toEqual(['oldest']);
      expect(await slugs('category=nope')).toEqual([]);
    });

    it('treats % and _ in the title search as plain characters', async () => {
      const res = await t.http().get(`${base}`).query({ q: '%' }).expect(200);
      expect(res.body.items.map((i: { slug: string }) => i.slug)).toEqual(['newest']);
      const underscore = await t.http().get(`${base}`).query({ q: '_' }).expect(200);
      expect(underscore.body.items).toEqual([]);
      const category = await t.http().get(`${base}`).query({ category: 'Sec%' }).expect(200);
      expect(category.body.items).toEqual([]);
      // a category that really contains an underscore still matches itself, in any case
      await seed('csharp', BlogStatus.PUBLISHED, { category: 'C_Sharp', publishedAt: day(2) });
      const exact = await t.http().get(`${base}`).query({ category: 'c_sharp' }).expect(200);
      expect(exact.body.items.map((i: { slug: string }) => i.slug)).toEqual(['csharp']);
    });

    it('pages, and caps limit at 50', async () => {
      const page = await t.http().get(`${base}?limit=2&page=2`).expect(200);
      expect(page.body).toMatchObject({ total: 3, page: 2, limit: 2 });
      expect(page.body.items.map((i: { slug: string }) => i.slug)).toEqual(['oldest']);
      await t.http().get(`${base}?limit=50`).expect(200);
      await t.http().get(`${base}?limit=51`).expect(400);
      await t.http().get(`${base}?page=0`).expect(400);
    });
  });
});
