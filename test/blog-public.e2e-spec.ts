import { BlogStatus } from '../src/generated/prisma/client.js';
import { createTestContext, doc, type TestContext, type TestUser } from './support/test-app.js';
import { TEST_DATABASE_URL } from './support/database.js';

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
      await seed('draft', BlogStatus.DRAFT, { publishedVersion: null, publishedAt: null });
      await seed('rejected', BlogStatus.REJECT, { publishedVersion: null, publishedAt: null });
      await seed('archived', BlogStatus.ARCHIVED);
      await seed('deleted', BlogStatus.DELETED, { deletedAt: day(11) });

      const list = await t.http().get(base).expect(200);
      expect(list.body.items.map((b: { slug: string }) => b.slug).sort()).toEqual(['published', 'reviewing', 'revising']);

      for (const slug of ['published', 'reviewing', 'revising']) {
        const detail = await t.http().get(`${base}/${slug}`).expect(200);
        expect(detail.body.content).toEqual(doc(`live ${slug}`));
        expect(detail.body.version).toBe(1);
      }
    });

    it('returns 404 for drafts, rejected, archived, deleted blogs', async () => {
      await seed('draft', BlogStatus.DRAFT, { publishedVersion: null, publishedAt: null });
      await seed('rejected', BlogStatus.REJECT, { publishedVersion: null, publishedAt: null });
      await seed('archived', BlogStatus.ARCHIVED);
      await seed('deleted', BlogStatus.DELETED, { deletedAt: day(11) });

      for (const slug of ['draft', 'rejected', 'archived', 'deleted', 'never-existed']) {
        await t.http().get(`${base}/${slug}`).expect(404);
      }
    });
  });

  describe('filtering and sorting', () => {
    beforeEach(async () => {
      await seed('ai-news', BlogStatus.PUBLISHED, { category: 'AI', tags: ['ml', 'trending'], publishedAt: day(10) });
      await seed('ai-ethics', BlogStatus.PUBLISHED, { category: 'AI', tags: ['ethics', 'policy'], publishedAt: day(12) });
      await seed('web-fast', BlogStatus.PUBLISHED, { category: 'Web', tags: ['perf', 'trending'], publishedAt: day(15) });
    });

    it('filters by category (case-insensitive)', async () => {
      const res = await t.http().get(`${base}?category=ai`).expect(200);
      expect(res.body.items.map((b: { slug: string }) => b.slug)).toEqual(['ai-ethics', 'ai-news']);
    });

    it('filters by tag', async () => {
      const res = await t.http().get(`${base}?tag=trending`).expect(200);
      expect(res.body.items.map((b: { slug: string }) => b.slug)).toEqual(['web-fast', 'ai-news']);
    });

    it('sorts by publishedAt asc/desc (default desc)', async () => {
      const desc = await t.http().get(base).expect(200);
      expect(desc.body.items.map((b: { slug: string }) => b.slug)).toEqual(['web-fast', 'ai-ethics', 'ai-news']);

      const asc = await t.http().get(`${base}?sortOrder=asc`).expect(200);
      expect(asc.body.items.map((b: { slug: string }) => b.slug)).toEqual(['ai-news', 'ai-ethics', 'web-fast']);
    });

    it('paginates', async () => {
      const page1 = await t.http().get(`${base}?page=1&limit=2`).expect(200);
      expect(page1.body.items.map((b: { slug: string }) => b.slug)).toEqual(['web-fast', 'ai-ethics']);
      expect(page1.body.pagination).toMatchObject({ page: 1, limit: 2, total: 3, totalPages: 2 });

      const page2 = await t.http().get(`${base}?page=2&limit=2`).expect(200);
      expect(page2.body.items.map((b: { slug: string }) => b.slug)).toEqual(['ai-news']);
    });
  });

  describe('card shape vs detail shape', () => {
    it('list items do not carry content; detail items do, with author profile', async () => {
      await seed('shaping', BlogStatus.PUBLISHED, { excerpt: 'short teaser', tags: ['a', 'b'] });

      const list = await t.http().get(base).expect(200);
      const card = list.body.items[0];
      expect(card).not.toHaveProperty('content');
      expect(card).toMatchObject({
        slug: 'shaping',
        excerpt: 'short teaser',
        category: 'Security',
        tags: ['a', 'b'],
        author: { id: author.id, name: 'Asha', profileImg: 'https://example.com/asha.png' },
      });

      const detail = await t.http().get(`${base}/shaping`).expect(200);
      expect(detail.body).toMatchObject({
        slug: 'shaping',
        content: doc('live shaping'),
        version: 1,
        author: { id: author.id, name: 'Asha', profileImg: 'https://example.com/asha.png' },
      });
    });
  });
});
