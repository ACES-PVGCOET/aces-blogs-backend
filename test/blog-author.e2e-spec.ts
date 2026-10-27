/**
 * Author-side blog API: JwtAuthGuard replaced by a test guard (user-mgmt not merged yet), real Prisma, real Postgres.
 *
 *   TEST_DATABASE_URL=postgresql://user:pass@localhost:5432/aces_blog_test npm run test:e2e
 *
 * The database name must contain "test": its schema is DROPPED and re-migrated before the run.
 */
import { UserRole, UserStatus, BlogStatus } from '@prisma/client';
import { hasContent } from '../src/blog/internal/validation/tiptap-content';
import { CLOUD_NAME, createTestContext, doc, EMPTY, img, type TestContext, type TestUser } from './support/test-app';
import { TEST_DATABASE_URL } from './support/database';

(TEST_DATABASE_URL ? describe : describe.skip)('author blog API', () => {
  let t: TestContext;
  let asha: TestUser;
  let rohan: TestUser;

  const base = '/api/blogs';
  const create = (u: TestUser, body: Record<string, unknown> = {}) =>
    t.http().post(base).set(t.as(u)).send({ title: 'Hello world', category: 'Backend', content: doc('first'), ...body });
  const idOf = (res: { body: { blog: { id: string } } }) => res.body.blog.id;
  const versions = (blogId: string) =>
    t.prisma.blogContent.findMany({ where: { blogId }, orderBy: { version: 'asc' } });

  beforeAll(async () => {
    t = await createTestContext();
  });
  afterAll(async () => {
    await t.close();
  });
  beforeEach(async () => {
    await t.clean();
    asha = await t.makeUser('asha');
    rohan = await t.makeUser('rohan');
  });

  describe('access', () => {
    it('rejects anonymous users and bad cookies (401)', async () => {
      await t.http().get(`${base}/mine`).expect(401);
      await t.http().get(`${base}/mine`).set({ Cookie: 'aces_session=not-a-token' }).expect(401);
    });

    it('is WRITER only (readers, reviewers and admins get 403)', async () => {
      for (const role of [UserRole.READER, UserRole.REVIEWER, UserRole.ADMIN]) {
        const u = await t.makeUser(`user-${role.toLowerCase()}`, role);
        await t.http().get(`${base}/mine`).set(t.as(u)).expect(403);
        await create(u).expect(403);
      }
    });

    it('a BLOCKED writer loses access immediately, even with a valid token', async () => {
      await t.http().get(`${base}/mine`).set(t.as(asha)).expect(200);
      await t.prisma.user.update({ where: { id: asha.id }, data: { status: UserStatus.BLOCKED } });
      await t.http().get(`${base}/mine`).set(t.as(asha)).expect(401);
    });

    it('a writer demoted to READER loses author access immediately (role comes from the DB, not the token)', async () => {
      await t.prisma.user.update({ where: { id: asha.id }, data: { role: UserRole.READER } });
      await t.http().get(`${base}/mine`).set(t.as(asha)).expect(403);
    });

    it('rejects a non-uuid id with 400', async () => {
      await t.http().get(`${base}/nope/draft`).set(t.as(asha)).expect(400);
      await t.http().delete(`${base}/nope`).set(t.as(asha)).expect(400);
    });
  });

  describe('create', () => {
    it('creates a DRAFT blog with content v1 and an audit entry', async () => {
      const res = await create(asha, { title: '  My First Post  ', tags: ['Node JS', 'nest'], excerpt: 'short' }).expect(201);
      expect(res.body.blog).toMatchObject({
        slug: 'my-first-post',
        title: 'My First Post',
        status: BlogStatus.DRAFT,
        category: 'Backend',
        tags: ['node-js', 'nest'],
        excerpt: 'short',
        latestRevisionVersion: 1,
        latestPublishedVersion: null,
        reviewNote: null,
      });
      const rows = await versions(idOf(res));
      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({ version: 1, createdById: asha.id });
      expect(await t.prisma.blogAuditLog.count({ where: { blogId: idOf(res), action: 'BLOG_CREATED' } })).toBe(1);
    });

    it('generates the slug from the title and does not accept one', async () => {
      await create(asha, { slug: 'my-own-slug' }).expect(400);
    });

    it('gives duplicate titles different slugs (a taken slug is retried with a suffix)', async () => {
      const slugs: string[] = [];
      for (let i = 0; i < 3; i++) slugs.push((await create(asha, { title: 'Same title' }).expect(201)).body.blog.slug);
      expect(slugs[0]).toBe('same-title');
      expect(new Set(slugs).size).toBe(3);
      expect(slugs.every((s) => s.startsWith('same-title'))).toBe(true);
    });

    // Needs a database that serves several connections at once (a real Postgres).
    (process.env.TEST_DB_POOL_MAX ? it.skip : it)('gives duplicate titles different slugs when created at the same time', async () => {
      const results = await Promise.all([1, 2, 3, 4].map(() => create(asha, { title: 'Parallel title' })));
      expect(results.map((r) => r.status)).toEqual([201, 201, 201, 201]);
      expect(new Set(results.map((r) => r.body.blog.slug as string)).size).toBe(4);
    });

    it('starts with an empty document when no content is sent', async () => {
      const res = await t.http().post(base).set(t.as(asha)).send({ title: 'No content', category: 'Backend' }).expect(201);
      const draft = await t.http().get(`${base}/${idOf(res)}/draft`).set(t.as(asha)).expect(200);
      expect(draft.body.revision.content).toEqual(EMPTY);
    });

    it('requires a category (blogs.category is NOT NULL)', async () => {
      await t.http().post(base).set(t.as(asha)).send({ title: 'No category' }).expect(400);
    });

    it('rejects fields the author must not set', async () => {
      await create(asha, { status: 'PUBLISHED' }).expect(400);
      await create(asha, { authorId: rohan.id }).expect(400);
      await create(asha, { latestPublishedVersion: 5 }).expect(400);
    });

    it('enforces the length limits (excerpt 500, category 80)', async () => {
      await create(asha, { excerpt: 'x'.repeat(501) }).expect(400);
      await create(asha, { excerpt: 'x'.repeat(500) }).expect(201);
      await create(asha, { category: 'c'.repeat(81) }).expect(400);
      await create(asha, { category: 'c'.repeat(80) }).expect(201);
    });

    it('accepts only https thumbnails from our Cloudinary account', async () => {
      await create(asha, { thumbnailUrl: img('t.png') }).expect(201);
      for (const bad of [
        'http://res.cloudinary.com/test-cloud/image/upload/t.png',
        `https://res.cloudinary.com/other-cloud/image/upload/t.png`,
        'https://evil.example.com/t.png',
        `https://res.cloudinary.com.evil.example.com/${CLOUD_NAME}/t.png`,
        `https://user:pw@res.cloudinary.com/${CLOUD_NAME}/t.png`,
        'javascript:alert(1)',
      ]) {
        await create(asha, { thumbnailUrl: bad }).expect(400);
      }
    });

    it('rejects unsafe or malformed TipTap content', async () => {
      const bad: unknown[] = [
        { type: 'paragraph' },
        { type: 'doc', content: [{ type: 'script' }] },
        { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'x', marks: [{ type: 'link', attrs: { href: 'javascript:alert(1)' } }] }] }] },
        { type: 'doc', content: [{ type: 'image', attrs: { src: 'data:image/png;base64,AAAA' } }] },
        { type: 'doc', content: [{ type: 'image', attrs: { src: 'https://evil.example.com/a.png' } }] },
        { type: 'doc', content: [{ type: 'image', attrs: { src: `http://res.cloudinary.com/${CLOUD_NAME}/a.png` } }] },
      ];
      for (const content of bad) await create(asha, { content }).expect(400);
      await create(asha, { content: { type: 'doc', content: [{ type: 'image', attrs: { src: img() } }] } }).expect(201);
    });
  });

  describe('save content', () => {
    it('overwrites a DRAFT in place (no version spam)', async () => {
      const id = idOf(await create(asha).expect(201));
      for (const text of ['one', 'two', 'three']) {
        const res = await t.http().put(`${base}/${id}/content`).set(t.as(asha)).send({ content: doc(text), expectedVersion: 1 }).expect(200);
        expect(res.body.blog.latestRevisionVersion).toBe(1);
        expect(res.body.blog.status).toBe(BlogStatus.DRAFT);
      }
      const rows = await versions(id);
      expect(rows).toHaveLength(1);
      expect(rows[0].content).toEqual(doc('three'));
      // overwrites do not spam the audit log either
      expect(await t.prisma.blogAuditLog.count({ where: { blogId: id, action: { startsWith: 'CONTENT_SAVED' } } })).toBe(0);
    });

    it('can change the title while saving, but the slug stays put', async () => {
      const created = await create(asha, { title: 'Original title' }).expect(201);
      const res = await t.http().put(`${base}/${idOf(created)}/content`).set(t.as(asha)).send({ content: doc('x'), title: 'Brand new title', expectedVersion: 1 }).expect(200);
      expect(res.body.blog).toMatchObject({ title: 'Brand new title', slug: 'original-title' });
    });

    it('bumps modifiedAt on every save', async () => {
      const id = idOf(await create(asha).expect(201));
      const before = new Date((await t.http().get(`${base}/${id}/draft`).set(t.as(asha))).body.blog.modifiedAt);
      await new Promise((r) => setTimeout(r, 15));
      const res = await t.http().put(`${base}/${id}/content`).set(t.as(asha)).send({ content: doc('later'), expectedVersion: 1 }).expect(200);
      expect(new Date(res.body.blog.modifiedAt).getTime()).toBeGreaterThan(before.getTime());
    });

    it('requires expectedVersion', async () => {
      const id = idOf(await create(asha).expect(201));
      await t.http().put(`${base}/${id}/content`).set(t.as(asha)).send({ content: doc('missing version') }).expect(400);
    });

    it('refuses a stale expectedVersion with 409', async () => {
      const id = idOf(await create(asha).expect(201));
      await t.http().put(`${base}/${id}/content`).set(t.as(asha)).send({ content: doc('x'), expectedVersion: 7 }).expect(409);
      await t.http().put(`${base}/${id}/content`).set(t.as(asha)).send({ content: doc('x'), expectedVersion: 1 }).expect(200);
    });

    it('editing a PUBLISHED blog starts a new version as REVISION_DRAFT and keeps the live version', async () => {
      const seeded = await t.seedBlog({
        authorId: asha.id, slug: 'live', status: BlogStatus.PUBLISHED, publishedVersion: 1,
        publishedAt: new Date(), versions: { 1: 'live v1' },
      });

      const first = await t.http().put(`${base}/${seeded.id}/content`).set(t.as(asha)).send({ content: doc('draft v2'), expectedVersion: 1 }).expect(200);
      expect(first.body.blog).toMatchObject({ status: BlogStatus.REVISION_DRAFT, latestRevisionVersion: 2, latestPublishedVersion: 1 });

      // further saves overwrite v2 in place
      const second = await t.http().put(`${base}/${seeded.id}/content`).set(t.as(asha)).send({ content: doc('draft v2 again'), expectedVersion: 2 }).expect(200);
      expect(second.body.blog.latestRevisionVersion).toBe(2);

      const rows = await versions(seeded.id);
      expect(rows.map((r) => r.version)).toEqual([1, 2]);
      expect(rows[0].content).toEqual(doc('live v1')); // the live version is untouched
      expect(rows[1].content).toEqual(doc('draft v2 again'));
      await t.http().get(`/api/public/blogs/live`).expect(200).expect((r) => expect(r.body.content).toEqual(doc('live v1')));
    });

    it('never overwrites a version the public can see, even if the status says DRAFT', async () => {
      const seeded = await t.seedBlog({
        authorId: asha.id, slug: 'odd', status: BlogStatus.REVISION_DRAFT, publishedVersion: 1,
        publishedAt: new Date(), versions: { 1: 'live v1' },
      });
      const res = await t.http().put(`${base}/${seeded.id}/content`).set(t.as(asha)).send({ content: doc('new'), expectedVersion: 1 }).expect(200);
      expect(res.body.blog.latestRevisionVersion).toBe(2);
      expect((await versions(seeded.id))[0].content).toEqual(doc('live v1'));
    });

    it.each([BlogStatus.UNDER_REVIEW, BlogStatus.ARCHIVED, BlogStatus.REJECT])('refuses saves while %s (409)', async (status) => {
      const seeded = await t.seedBlog({ authorId: asha.id, slug: `s-${status.toLowerCase()}`, status, versions: { 1: 'x' } });
      await t.http().put(`${base}/${seeded.id}/content`).set(t.as(asha)).send({ content: doc('y'), expectedVersion: 1 }).expect(409);
      expect((await versions(seeded.id))[0].content).toEqual(doc('x'));
    });
  });

  describe('update meta', () => {
    it('changes title, excerpt, thumbnail, category and tags, and can clear thumbnail and excerpt', async () => {
      const id = idOf(await create(asha, { thumbnailUrl: img('a.png'), excerpt: 'old' }).expect(201));
      const res = await t.http().patch(`${base}/${id}`).set(t.as(asha))
        .send({ title: 'Renamed', category: 'DevOps', tags: ['One', 'Two'], thumbnailUrl: null, excerpt: null }).expect(200);
      expect(res.body.blog).toMatchObject({
        title: 'Renamed', category: 'DevOps', tags: ['one', 'two'], thumbnailUrl: null, excerpt: null, slug: 'hello-world',
      });
    });

    it('rejects empty bodies, null title/category and non-Cloudinary thumbnails', async () => {
      const id = idOf(await create(asha).expect(201));
      await t.http().patch(`${base}/${id}`).set(t.as(asha)).send({}).expect(400);
      await t.http().patch(`${base}/${id}`).set(t.as(asha)).send({ title: null }).expect(400);
      await t.http().patch(`${base}/${id}`).set(t.as(asha)).send({ category: null }).expect(400);
      await t.http().patch(`${base}/${id}`).set(t.as(asha)).send({ thumbnailUrl: 'https://evil.example.com/a.png' }).expect(400);
      await t.http().patch(`${base}/${id}`).set(t.as(asha)).send({ status: 'PUBLISHED' }).expect(400);
    });

    it('is blocked while the blog is under review', async () => {
      const seeded = await t.seedBlog({ authorId: asha.id, slug: 'rev', status: BlogStatus.UNDER_REVIEW, versions: { 1: 'x' } });
      await t.http().patch(`${base}/${seeded.id}`).set(t.as(asha)).send({ title: 'Nope nope' }).expect(409);
    });
  });

  describe('submit', () => {
    it('moves a DRAFT to UNDER_REVIEW with no reviewer and a submittedAt', async () => {
      const id = idOf(await create(asha).expect(201));
      const res = await t.http().post(`${base}/${id}/submit`).set(t.as(asha)).expect(200);
      expect(res.body.blog.status).toBe(BlogStatus.UNDER_REVIEW);
      expect(res.body.blog.submittedAt).toBeTruthy();
      const row = await t.prisma.blog.findUniqueOrThrow({ where: { id } });
      expect(row.reviewerId).toBeNull();
      expect(await t.prisma.blogAuditLog.count({ where: { blogId: id, action: 'SUBMITTED_V1' } })).toBe(1);
    });

    it('needs real content: an empty blog is refused and stays a DRAFT', async () => {
      const id = idOf(await create(asha, { content: EMPTY }).expect(201));
      await t.http().post(`${base}/${id}/submit`).set(t.as(asha)).expect(400);
      const row = await t.prisma.blog.findUniqueOrThrow({ where: { id } });
      expect(row.status).toBe(BlogStatus.DRAFT);
      expect(row.submittedAt).toBeNull();
    });

    it('locks editing while under review and cannot be submitted twice', async () => {
      const id = idOf(await create(asha).expect(201));
      await t.http().post(`${base}/${id}/submit`).set(t.as(asha)).expect(200);
      await t.http().put(`${base}/${id}/content`).set(t.as(asha)).send({ content: doc('late edit'), expectedVersion: 1 }).expect(409);
      await t.http().patch(`${base}/${id}`).set(t.as(asha)).send({ title: 'Late rename' }).expect(409);
      await t.http().post(`${base}/${id}/submit`).set(t.as(asha)).expect(409);
    });

    it('after a rejection the author sees the note, edits in place, and a new submit clears it', async () => {
      const seeded = await t.seedBlog({
        authorId: asha.id, slug: 'rejected', status: BlogStatus.REVISION_DRAFT, reviewNote: 'Please add sources',
        versions: { 1: 'needs work' },
      });
      const draft = await t.http().get(`${base}/${seeded.id}/draft`).set(t.as(asha)).expect(200);
      expect(draft.body.blog.reviewNote).toBe('Please add sources');

      const saved = await t.http().put(`${base}/${seeded.id}/content`).set(t.as(asha)).send({ content: doc('fixed'), expectedVersion: 1 }).expect(200);
      expect(saved.body.blog.latestRevisionVersion).toBe(1);

      const submitted = await t.http().post(`${base}/${seeded.id}/submit`).set(t.as(asha)).expect(200);
      expect(submitted.body.blog).toMatchObject({ status: BlogStatus.UNDER_REVIEW, reviewNote: null });
    });
  });

  describe('archive and delete', () => {
    it('archives, refuses edits, and cannot archive twice', async () => {
      const id = idOf(await create(asha).expect(201));
      const res = await t.http().post(`${base}/${id}/archive`).set(t.as(asha)).expect(200);
      expect(res.body.blog.status).toBe(BlogStatus.ARCHIVED);
      await t.http().post(`${base}/${id}/archive`).set(t.as(asha)).expect(409);
      await t.http().put(`${base}/${id}/content`).set(t.as(asha)).send({ content: doc('x'), expectedVersion: 1 }).expect(409);
      await t.http().post(`${base}/${id}/submit`).set(t.as(asha)).expect(409);
    });

    it('soft-deletes (row stays, status DELETED, deletedAt set); no un-delete, no un-archive', async () => {
      const id = idOf(await create(asha).expect(201));
      await t.http().post(`${base}/${id}/archive`).set(t.as(asha)).expect(200);
      await t.http().delete(`${base}/${id}`).set(t.as(asha)).expect(200);
      const row = await t.prisma.blog.findUniqueOrThrow({ where: { id } });
      expect(row).toMatchObject({ status: BlogStatus.DELETED });
      expect(row.deletedAt).toBeInstanceOf(Date);
      await t.http().delete(`${base}/${id}`).set(t.as(asha)).expect(404);
      await t.http().post(`${base}/${id}/archive`).set(t.as(asha)).expect(404);
      await t.http().get(`${base}/${id}/draft`).set(t.as(asha)).expect(404);
    });

    it('can delete a blog that is under review', async () => {
      const seeded = await t.seedBlog({ authorId: asha.id, slug: 'rev', status: BlogStatus.UNDER_REVIEW, versions: { 1: 'x' } });
      await t.http().delete(`${base}/${seeded.id}`).set(t.as(asha)).expect(200);
    });
  });

  describe('ownership', () => {
    it("hides other authors' blogs completely (404, not 403)", async () => {
      const id = idOf(await create(asha).expect(201));
      await t.http().get(`${base}/${id}/draft`).set(t.as(rohan)).expect(404);
      await t.http().put(`${base}/${id}/content`).set(t.as(rohan)).send({ content: doc('x'), expectedVersion: 1 }).expect(404);
      await t.http().patch(`${base}/${id}`).set(t.as(rohan)).send({ title: 'Hijacked' }).expect(404);
      await t.http().post(`${base}/${id}/submit`).set(t.as(rohan)).expect(404);
      await t.http().post(`${base}/${id}/archive`).set(t.as(rohan)).expect(404);
      await t.http().delete(`${base}/${id}`).set(t.as(rohan)).expect(404);
    });
  });

  describe('list mine', () => {
    it('lists only my blogs, with reviewNote and modifiedAt, and no content', async () => {
      await create(asha, { title: 'Alpha post' }).expect(201);
      await create(rohan, { title: 'Rohan post' }).expect(201);
      await t.seedBlog({ authorId: asha.id, slug: 'rej', title: 'Rejected post', status: BlogStatus.REVISION_DRAFT, reviewNote: 'fix it', versions: { 1: 'x' } });

      const res = await t.http().get(`${base}/mine`).set(t.as(asha)).expect(200);
      expect(res.body.total).toBe(2);
      for (const item of res.body.items) {
        expect(item).toHaveProperty('reviewNote');
        expect(item).toHaveProperty('modifiedAt');
        expect(item).not.toHaveProperty('content');
        expect(item).not.toHaveProperty('revision');
      }
      expect(res.body.items.find((i: { slug: string }) => i.slug === 'rej').reviewNote).toBe('fix it');
    });

    it('filters by status and title, pages, and hides DELETED unless asked', async () => {
      for (const title of ['Alpha one', 'Alpha two', 'Beta three']) await create(asha, { title }).expect(201);
      const gone = idOf(await create(asha, { title: 'Alpha gone' }).expect(201));
      await t.http().delete(`${base}/${gone}`).set(t.as(asha)).expect(200);
      const archived = idOf(await create(asha, { title: 'Alpha archived' }).expect(201));
      await t.http().post(`${base}/${archived}/archive`).set(t.as(asha)).expect(200);

      const all = await t.http().get(`${base}/mine`).set(t.as(asha)).expect(200);
      expect(all.body.total).toBe(4);

      const search = await t.http().get(`${base}/mine?q=ALPHA`).set(t.as(asha)).expect(200);
      expect(search.body.items.map((i: { title: string }) => i.title).sort()).toEqual(['Alpha archived', 'Alpha one', 'Alpha two']);

      const onlyArchived = await t.http().get(`${base}/mine?status=ARCHIVED`).set(t.as(asha)).expect(200);
      expect(onlyArchived.body.items.map((i: { id: string }) => i.id)).toEqual([archived]);

      const deleted = await t.http().get(`${base}/mine?status=DELETED`).set(t.as(asha)).expect(200);
      expect(deleted.body.items.map((i: { id: string }) => i.id)).toEqual([gone]);

      const page = await t.http().get(`${base}/mine?limit=2&page=2`).set(t.as(asha)).expect(200);
      expect(page.body).toMatchObject({ total: 4, page: 2, limit: 2 });
      expect(page.body.items).toHaveLength(2);

      await t.http().get(`${base}/mine?limit=51`).set(t.as(asha)).expect(400);
      await t.http().get(`${base}/mine?status=NOPE`).set(t.as(asha)).expect(400);
    });

    it('treats % and _ in the search as plain characters', async () => {
      await create(asha, { title: 'Plain title' }).expect(201);
      await create(asha, { title: '100% organic' }).expect(201);
      const res = await t.http().get(`${base}/mine`).query({ q: '%' }).set(t.as(asha)).expect(200);
      expect(res.body.items.map((i: { title: string }) => i.title)).toEqual(['100% organic']);
    });
  });

  describe('concurrency (version guard, no row locks)', () => {
    it('parallel saves on a PUBLISHED blog create exactly one new version and never a 5xx', async () => {
      const seeded = await t.seedBlog({
        authorId: asha.id, slug: 'race', status: BlogStatus.PUBLISHED, publishedVersion: 1,
        publishedAt: new Date(), versions: { 1: 'live v1' },
      });

      const texts = ['a', 'b', 'c', 'd', 'e', 'f'];
      const results = await Promise.all(
        texts.map((text) => t.http().put(`${base}/${seeded.id}/content`).set(t.as(asha)).send({ content: doc(text), expectedVersion: 1 })),
      );

      const statuses = results.map((r) => r.status);
      expect(statuses.every((s) => s === 200 || s === 409)).toBe(true); // 409 = lost the race
      expect(statuses).toContain(200);

      const rows = await versions(seeded.id);
      expect(rows.map((r) => r.version)).toEqual([1, 2]); // one new version, no gaps, no duplicates
      expect(rows[0].content).toEqual(doc('live v1'));
      expect(texts.map((x) => doc(x))).toContainEqual(rows[1].content);

      const blog = await t.prisma.blog.findUniqueOrThrow({ where: { id: seeded.id } });
      expect(blog).toMatchObject({ status: BlogStatus.REVISION_DRAFT, latestRevisionVersion: 2, latestPublishedVersion: 1 });
    });

    it('a save that races a submit cannot slip content into the submitted version', async () => {
      for (let round = 0; round < 6; round++) {
        const id = idOf(await create(asha, { title: `Race ${round}`, content: doc('original') }).expect(201));
        // half the rounds the racing save blanks the document: it must never end up inside a submitted blog
        const racing = round % 2 === 0 ? doc('replacement') : EMPTY;

        const [submit, save] = await Promise.all([
          t.http().post(`${base}/${id}/submit`).set(t.as(asha)),
          t.http().put(`${base}/${id}/content`).set(t.as(asha)).send({ content: racing, expectedVersion: 1 }),
        ]);
        expect([200, 400, 409]).toContain(submit.status);
        expect([200, 409]).toContain(save.status);

        const blog = await t.prisma.blog.findUniqueOrThrow({ where: { id } });
        const stored = (await versions(id)).find((r) => r.version === blog.latestRevisionVersion)!;

        if (blog.status === BlogStatus.UNDER_REVIEW) {
          expect(submit.status).toBe(200);
          expect(hasContent(stored.content as never)).toBe(true); // never submitted empty
          // what is stored is exactly what the save call reported: it either landed before the submit or was refused
          expect(stored.content).toEqual(save.status === 200 ? racing : doc('original'));
        } else {
          // the submit lost or was refused as empty: nothing was submitted
          expect(blog.status).toBe(BlogStatus.DRAFT);
          expect(blog.submittedAt).toBeNull();
          expect(submit.status).toBe(400);
          expect(save.status).toBe(200);
          expect(stored.content).toEqual(EMPTY);
        }
      }
    });
  });
});
