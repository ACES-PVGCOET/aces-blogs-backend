import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthenticatedUser, JwtAuthGuard, UserRole } from '../src/common';
import { PrismaService } from '../src/prisma';
import { createTestToken, mockJwtAuthGuard } from './auth-test-helper';

describe('BlogModule (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const writer1: AuthenticatedUser = {
    id: 'a0000000-0000-0000-0000-000000000001',
    role: UserRole.WRITER,
  };
  const writer2: AuthenticatedUser = {
    id: 'a0000000-0000-0000-0000-000000000002',
    role: UserRole.WRITER,
  };
  const admin: AuthenticatedUser = {
    id: 'b0000000-0000-0000-0000-000000000001',
    role: UserRole.ADMIN,
  };
  const reviewer: AuthenticatedUser = {
    id: 'c0000000-0000-0000-0000-000000000001',
    role: UserRole.REVIEWER,
  };
  const reader: AuthenticatedUser = {
    id: 'd0000000-0000-0000-0000-000000000001',
    role: UserRole.READER,
  };

  const writer1Token = createTestToken(writer1);
  const writer2Token = createTestToken(writer2);
  const adminToken = createTestToken(admin);
  const reviewerToken = createTestToken(reviewer);
  const readerToken = createTestToken(reader);

  beforeAll(async () => {
    if (!(process.env.DATABASE_URL ?? '').toLowerCase().includes('test')) {
      throw new Error('Set DATABASE_URL to a database whose name contains "test", e.g. .../blog_app_test');
    }

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();

    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app?.close();
  });

  beforeEach(async () => {
    await prisma.blogContent.deleteMany();
    await prisma.blog.deleteMany();
  });

  describe('1. WRITER updates own blog', () => {
    it('status becomes REVISION_DRAFT and latestRevisionVersion increments', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/api/blogs')
        .set('Authorization', `Bearer ${writer1Token}`)
        .send({
          title: 'Writer Own Blog',
          slug: 'writer-own-blog',
          content: { type: 'doc', content: [{ type: 'paragraph', text: 'v1' }] },
        })
        .expect(201);

      const blogId = createRes.body.id;
      expect(createRes.body.status).toBe('DRAFT');
      expect(createRes.body.latestRevisionVersion).toBe(1);
      expect(createRes.body.latestPublishedVersion).toBe(0);

      const updateRes = await request(app.getHttpServer())
        .put(`/api/blogs/${blogId}/content`)
        .set('Authorization', `Bearer ${writer1Token}`)
        .send({
          content: { type: 'doc', content: [{ type: 'paragraph', text: 'v2' }] },
        })
        .expect(200);

      expect(updateRes.body.contentVersion).toBe(2);
      expect(updateRes.body.blog.status).toBe('REVISION_DRAFT');
      expect(updateRes.body.blog.latestRevisionVersion).toBe(2);
      expect(updateRes.body.blog.latestPublishedVersion).toBe(0);
    });
  });

  describe('2. WRITER cannot update another writer\'s blog (403)', () => {
    it('fails with 403 Forbidden', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/api/blogs')
        .set('Authorization', `Bearer ${writer1Token}`)
        .send({
          title: 'Writer 1 Blog',
          slug: 'writer-1-blog',
        })
        .expect(201);

      const blogId = createRes.body.id;

      await request(app.getHttpServer())
        .put(`/api/blogs/${blogId}/content`)
        .set('Authorization', `Bearer ${writer2Token}`)
        .send({
          content: { type: 'doc', content: [{ type: 'paragraph', text: 'unauthorized edit' }] },
        })
        .expect(403);
    });
  });

  describe('3. ADMIN updates any blog', () => {
    it('status becomes PUBLISHED and both version fields match', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/api/blogs')
        .set('Authorization', `Bearer ${writer1Token}`)
        .send({
          title: 'Writer Blog for Admin Update',
          slug: 'writer-blog-for-admin-update',
        })
        .expect(201);

      const blogId = createRes.body.id;

      const adminUpdateRes = await request(app.getHttpServer())
        .put(`/api/blogs/${blogId}/content`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          content: { type: 'doc', content: [{ type: 'paragraph', text: 'admin edit' }] },
        })
        .expect(200);

      expect(adminUpdateRes.body.contentVersion).toBe(1);
      expect(adminUpdateRes.body.blog.status).toBe('PUBLISHED');
      expect(adminUpdateRes.body.blog.latestRevisionVersion).toBe(1);
      expect(adminUpdateRes.body.blog.latestPublishedVersion).toBe(1);
    });
  });

  describe('4. Writer edit after admin publish', () => {
    it('creates latest + 1 and does not overwrite', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/api/blogs')
        .set('Authorization', `Bearer ${writer1Token}`)
        .send({
          title: 'Blog for Edit After Publish',
          slug: 'blog-edit-after-publish',
        })
        .expect(201);

      const blogId = createRes.body.id;

      // Admin publishes version 1
      await request(app.getHttpServer())
        .put(`/api/blogs/${blogId}/content`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          content: { type: 'doc', text: 'version-1-content' },
        })
        .expect(200);

      // Writer creates revision (version 2)
      const writerUpdateRes = await request(app.getHttpServer())
        .patch(`/api/blogs/${blogId}/content`)
        .set('Authorization', `Bearer ${writer1Token}`)
        .send({
          content: { type: 'doc', text: 'version-2-content' },
        })
        .expect(200);

      expect(writerUpdateRes.body.contentVersion).toBe(2);
      expect(writerUpdateRes.body.blog.status).toBe('REVISION_DRAFT');
      expect(writerUpdateRes.body.blog.latestRevisionVersion).toBe(2);
      expect(writerUpdateRes.body.blog.latestPublishedVersion).toBe(1);

      // Verify version 1 row is intact and not overwritten
      const v1Res = await request(app.getHttpServer())
        .get(`/api/blogs/${blogId}/content?version=1`)
        .set('Authorization', `Bearer ${writer1Token}`)
        .expect(200);
      expect(v1Res.body.version).toBe(1);
      expect(v1Res.body.content).toEqual({ type: 'doc', text: 'version-1-content' });

      // Verify version 2 row exists separately
      const v2Res = await request(app.getHttpServer())
        .get(`/api/blogs/${blogId}/content?version=2`)
        .set('Authorization', `Bearer ${writer1Token}`)
        .expect(200);
      expect(v2Res.body.version).toBe(2);
      expect(v2Res.body.content).toEqual({ type: 'doc', text: 'version-2-content' });
    });
  });

  describe('5. Publish fails with 400 when reviewer is empty', () => {
    it('fails when reviewer is null or empty', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/api/blogs')
        .set('Authorization', `Bearer ${writer1Token}`)
        .send({
          title: 'No Reviewer Blog',
          slug: 'no-reviewer-blog',
          content: { type: 'doc', text: 'ready to publish' },
        })
        .expect(201);

      const blogId = createRes.body.id;

      await request(app.getHttpServer())
        .patch(`/api/blogs/${blogId}/publish`)
        .set('Authorization', `Bearer ${writer1Token}`)
        .expect(400);
    });

    it('fails when latestRevisionVersion is 0', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/api/blogs')
        .set('Authorization', `Bearer ${writer1Token}`)
        .send({
          title: 'Empty Content Blog',
          slug: 'empty-content-blog',
        })
        .expect(201);

      const blogId = createRes.body.id;

      // Assign reviewer directly to isolate the content check
      await prisma.blog.update({
        where: { id: blogId },
        data: { reviewer: reviewer.id },
      });

      await request(app.getHttpServer())
        .patch(`/api/blogs/${blogId}/publish`)
        .set('Authorization', `Bearer ${writer1Token}`)
        .expect(400);
    });
  });

  describe('6. Publish fails for non-owner WRITER and succeeds for owner and ADMIN', () => {
    it('handles publish permissions correctly', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/api/blogs')
        .set('Authorization', `Bearer ${writer1Token}`)
        .send({
          title: 'Publish Permission Blog',
          slug: 'publish-permission-blog',
          content: { type: 'doc', text: 'test content' },
        })
        .expect(201);

      const blogId = createRes.body.id;

      // Reviewer sets reviewer
      await request(app.getHttpServer())
        .patch(`/api/blogs/${blogId}/review/start`)
        .set('Authorization', `Bearer ${reviewerToken}`)
        .send({ reviewer: reviewer.id })
        .expect(200);

      // Non-owner writer fails (403)
      await request(app.getHttpServer())
        .patch(`/api/blogs/${blogId}/publish`)
        .set('Authorization', `Bearer ${writer2Token}`)
        .expect(403);

      // Owner writer succeeds (200)
      const publishRes = await request(app.getHttpServer())
        .patch(`/api/blogs/${blogId}/publish`)
        .set('Authorization', `Bearer ${writer1Token}`)
        .expect(200);
      expect(publishRes.body.status).toBe('PUBLISHED');
      expect(publishRes.body.latestPublishedVersion).toBe(1);

      // Create a second blog for ADMIN publish
      const createRes2 = await request(app.getHttpServer())
        .post('/api/blogs')
        .set('Authorization', `Bearer ${writer1Token}`)
        .send({
          title: 'Admin Publish Blog',
          slug: 'admin-publish-blog',
          content: { type: 'doc', text: 'test content' },
        })
        .expect(201);

      const blogId2 = createRes2.body.id;
      await prisma.blog.update({
        where: { id: blogId2 },
        data: { reviewer: reviewer.id },
      });

      // Admin succeeds (200)
      const adminPublishRes = await request(app.getHttpServer())
        .patch(`/api/blogs/${blogId2}/publish`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      expect(adminPublishRes.body.status).toBe('PUBLISHED');
    });
  });

  describe('7. Archive and delete fail for non-owners and succeed for owners and ADMIN', () => {
    it('handles archive permissions', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/api/blogs')
        .set('Authorization', `Bearer ${writer1Token}`)
        .send({ title: 'Archive Test', slug: 'archive-test' })
        .expect(201);
      const blogId = createRes.body.id;

      // Non-owner fails
      await request(app.getHttpServer())
        .patch(`/api/blogs/${blogId}/archive`)
        .set('Authorization', `Bearer ${writer2Token}`)
        .expect(403);

      // Owner succeeds
      const archiveRes = await request(app.getHttpServer())
        .patch(`/api/blogs/${blogId}/archive`)
        .set('Authorization', `Bearer ${writer1Token}`)
        .expect(200);
      expect(archiveRes.body.status).toBe('ARCHIVED');

      // Admin archives another blog
      const createRes2 = await request(app.getHttpServer())
        .post('/api/blogs')
        .set('Authorization', `Bearer ${writer1Token}`)
        .send({ title: 'Admin Archive Test', slug: 'admin-archive-test' })
        .expect(201);
      const blogId2 = createRes2.body.id;

      const adminArchiveRes = await request(app.getHttpServer())
        .patch(`/api/blogs/${blogId2}/archive`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      expect(adminArchiveRes.body.status).toBe('ARCHIVED');
    });

    it('handles soft delete permissions and behavior', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/api/blogs')
        .set('Authorization', `Bearer ${writer1Token}`)
        .send({ title: 'Delete Test', slug: 'delete-test' })
        .expect(201);
      const blogId = createRes.body.id;

      // Non-owner delete fails
      await request(app.getHttpServer())
        .delete(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${writer2Token}`)
        .expect(403);

      // Owner delete succeeds
      const delRes = await request(app.getHttpServer())
        .delete(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${writer1Token}`)
        .expect(200);
      expect(delRes.body).toEqual({ success: true, message: 'Blog deleted' });

      // Verify row is kept with status DELETED
      const row = await prisma.blog.findUnique({ where: { id: blogId } });
      expect(row).not.toBeNull();
      expect(row?.status).toBe('DELETED');

      // Admin delete succeeds
      const createRes2 = await request(app.getHttpServer())
        .post('/api/blogs')
        .set('Authorization', `Bearer ${writer1Token}`)
        .send({ title: 'Admin Delete Test', slug: 'admin-delete-test' })
        .expect(201);
      const blogId2 = createRes2.body.id;

      const adminDelRes = await request(app.getHttpServer())
        .delete(`/api/blogs/${blogId2}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      expect(adminDelRes.body).toEqual({ success: true, message: 'Blog deleted' });

      const row2 = await prisma.blog.findUnique({ where: { id: blogId2 } });
      expect(row2?.status).toBe('DELETED');
    });
  });

  describe('8. READER list returns only PUBLISHED, even when status=DRAFT is passed', () => {
    it('filters for reader caller strictly to PUBLISHED', async () => {
      // Create a DRAFT blog
      await request(app.getHttpServer())
        .post('/api/blogs')
        .set('Authorization', `Bearer ${writer1Token}`)
        .send({ title: 'Draft Post', slug: 'draft-post' })
        .expect(201);

      // Create and publish a blog
      const pubRes = await request(app.getHttpServer())
        .post('/api/blogs')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Published Post',
          slug: 'published-post',
          content: { type: 'doc', text: 'live' },
        })
        .expect(201);
      await prisma.blog.update({
        where: { id: pubRes.body.id },
        data: { status: 'PUBLISHED', latestPublishedVersion: 1 },
      });

      // READER calls without filters
      const listRes1 = await request(app.getHttpServer())
        .get('/api/blogs')
        .set('Authorization', `Bearer ${readerToken}`)
        .expect(200);
      expect(listRes1.body).toHaveLength(1);
      expect(listRes1.body[0].slug).toBe('published-post');

      // READER calls with status=DRAFT -> ignored, still returns only PUBLISHED
      const listRes2 = await request(app.getHttpServer())
        .get('/api/blogs?status=DRAFT')
        .set('Authorization', `Bearer ${readerToken}`)
        .expect(200);
      expect(listRes2.body).toHaveLength(1);
      expect(listRes2.body[0].slug).toBe('published-post');

      // WRITER can see DRAFT
      const listResWriter = await request(app.getHttpServer())
        .get('/api/blogs?status=DRAFT')
        .set('Authorization', `Bearer ${writer1Token}`)
        .expect(200);
      expect(listResWriter.body).toHaveLength(1);
      expect(listResWriter.body[0].slug).toBe('draft-post');
    });
  });

  describe('9. READER GET of a DRAFT blog returns 404', () => {
    it('returns 404 for reader and 200 for writer', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/api/blogs')
        .set('Authorization', `Bearer ${writer1Token}`)
        .send({ title: 'Hidden Draft', slug: 'hidden-draft' })
        .expect(201);
      const blogId = createRes.body.id;

      // READER cannot view draft (404)
      await request(app.getHttpServer())
        .get(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${readerToken}`)
        .expect(404);

      // WRITER can view draft (200)
      const writerRes = await request(app.getHttpServer())
        .get(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${writer1Token}`)
        .expect(200);
      expect(writerRes.body.id).toBe(blogId);
    });
  });

  describe('10. READER content request with version > latestPublishedVersion returns 404', () => {
    it('blocks reader from accessing unreleased content versions', async () => {
      // Create blog with version 1
      const createRes = await request(app.getHttpServer())
        .post('/api/blogs')
        .set('Authorization', `Bearer ${writer1Token}`)
        .send({
          title: 'Versioned Post',
          slug: 'versioned-post',
          content: { type: 'doc', text: 'v1 published' },
        })
        .expect(201);
      const blogId = createRes.body.id;

      // Publish version 1
      await prisma.blog.update({
        where: { id: blogId },
        data: { status: 'PUBLISHED', latestPublishedVersion: 1, reviewer: reviewer.id },
      });

      // Writer creates revision version 2
      await request(app.getHttpServer())
        .put(`/api/blogs/${blogId}/content`)
        .set('Authorization', `Bearer ${writer1Token}`)
        .send({ content: { type: 'doc', text: 'v2 draft revision' } })
        .expect(200);

      // Reader accessing version 1 succeeds
      const r1 = await request(app.getHttpServer())
        .get(`/api/blogs/${blogId}/content?version=1`)
        .set('Authorization', `Bearer ${readerToken}`)
        .expect(200);
      expect(r1.body.version).toBe(1);

      // Reader accessing without version query defaults to latestPublishedVersion (1)
      const rDefault = await request(app.getHttpServer())
        .get(`/api/blogs/${blogId}/content`)
        .set('Authorization', `Bearer ${readerToken}`)
        .expect(200);
      expect(rDefault.body.version).toBe(1);

      // Reader accessing version 2 (draft revision > latestPublishedVersion) returns 404
      await request(app.getHttpServer())
        .get(`/api/blogs/${blogId}/content?version=2`)
        .set('Authorization', `Bearer ${readerToken}`)
        .expect(404);

      // Writer accessing version 2 succeeds
      const w2 = await request(app.getHttpServer())
        .get(`/api/blogs/${blogId}/content?version=2`)
        .set('Authorization', `Bearer ${writer1Token}`)
        .expect(200);
      expect(w2.body.version).toBe(2);
    });
  });

  describe('11. Start review fails from PUBLISHED and succeeds from DRAFT, setting reviewer', () => {
    it('validates status when starting review', async () => {
      // Blog in PUBLISHED status
      const pubBlog = await prisma.blog.create({
        data: {
          title: 'Already Published',
          slug: 'already-published',
          author: writer1.id,
          status: 'PUBLISHED',
          latestRevisionVersion: 1,
          latestPublishedVersion: 1,
        },
      });

      // Start review on PUBLISHED fails with 400
      await request(app.getHttpServer())
        .patch(`/api/blogs/${pubBlog.id}/review/start`)
        .set('Authorization', `Bearer ${reviewerToken}`)
        .send({ reviewer: 'rev-user-id' })
        .expect(400);

      // Blog in DRAFT status
      const draftBlog = await prisma.blog.create({
        data: {
          title: 'Draft For Review',
          slug: 'draft-for-review',
          author: writer1.id,
          status: 'DRAFT',
          latestRevisionVersion: 1,
        },
      });

      // Start review on DRAFT succeeds with 200 and sets reviewer
      const startRes = await request(app.getHttpServer())
        .patch(`/api/blogs/${draftBlog.id}/review/start`)
        .set('Authorization', `Bearer ${reviewerToken}`)
        .send({ reviewer: 'rev-user-id' })
        .expect(200);
      expect(startRes.body.status).toBe('UNDER_REVIEW');
      expect(startRes.body.reviewer).toBe('rev-user-id');
    });
  });

  describe('12. Reject fails unless status is UNDER_REVIEW', () => {
    it('fails when status is DRAFT and succeeds when status is UNDER_REVIEW', async () => {
      const draftBlog = await prisma.blog.create({
        data: {
          title: 'Draft Reject Test',
          slug: 'draft-reject-test',
          author: writer1.id,
          status: 'DRAFT',
        },
      });

      // Reject on DRAFT fails with 400
      await request(app.getHttpServer())
        .patch(`/api/blogs/${draftBlog.id}/review/reject`)
        .set('Authorization', `Bearer ${reviewerToken}`)
        .expect(400);

      // Move to UNDER_REVIEW
      await prisma.blog.update({
        where: { id: draftBlog.id },
        data: { status: 'UNDER_REVIEW' },
      });

      // Reject on UNDER_REVIEW succeeds with 200
      const rejectRes = await request(app.getHttpServer())
        .patch(`/api/blogs/${draftBlog.id}/review/reject`)
        .set('Authorization', `Bearer ${reviewerToken}`)
        .expect(200);
      expect(rejectRes.body.status).toBe('REJECT');
    });
  });

  describe('Review queue & comparison', () => {
    it('review queue returns DRAFT and REVISION_DRAFT ordered by modifiedAt ASC', async () => {
      const b1 = await prisma.blog.create({
        data: {
          title: 'Older Draft',
          slug: 'older-draft',
          author: writer1.id,
          status: 'DRAFT',
        },
      });

      const b2 = await prisma.blog.create({
        data: {
          title: 'Newer Revision',
          slug: 'newer-revision',
          author: writer1.id,
          status: 'REVISION_DRAFT',
        },
      });

      await prisma.blog.create({
        data: {
          title: 'Published Blog',
          slug: 'published-queue-test',
          author: writer1.id,
          status: 'PUBLISHED',
        },
      });

      const res = await request(app.getHttpServer())
        .get('/api/blogs/review/queue')
        .set('Authorization', `Bearer ${reviewerToken}`)
        .expect(200);

      expect(res.body).toHaveLength(2);
      expect(res.body[0].id).toBe(b1.id);
      expect(res.body[1].id).toBe(b2.id);
    });

    it('comparison returns published and revision content', async () => {
      const blog = await prisma.blog.create({
        data: {
          title: 'Comparison Blog',
          slug: 'comparison-blog',
          author: writer1.id,
          status: 'UNDER_REVIEW',
          latestPublishedVersion: 1,
          latestRevisionVersion: 2,
        },
      });

      await prisma.blogContent.create({
        data: {
          blogId: blog.id,
          version: 1,
          content: { type: 'doc', text: 'published v1' },
        },
      });

      await prisma.blogContent.create({
        data: {
          blogId: blog.id,
          version: 2,
          content: { type: 'doc', text: 'revision v2' },
        },
      });

      const res = await request(app.getHttpServer())
        .get(`/api/blogs/${blog.id}/review/comparison`)
        .set('Authorization', `Bearer ${reviewerToken}`)
        .expect(200);

      expect(res.body.published.version).toBe(1);
      expect(res.body.published.content).toEqual({ type: 'doc', text: 'published v1' });
      expect(res.body.revision.version).toBe(2);
      expect(res.body.revision.content).toEqual({ type: 'doc', text: 'revision v2' });
    });
  });

  describe('Validation & Conflict checks', () => {
    it('returns 409 when creating duplicate slug', async () => {
      await request(app.getHttpServer())
        .post('/api/blogs')
        .set('Authorization', `Bearer ${writer1Token}`)
        .send({ title: 'Unique', slug: 'duplicate-slug' })
        .expect(201);

      await request(app.getHttpServer())
        .post('/api/blogs')
        .set('Authorization', `Bearer ${writer1Token}`)
        .send({ title: 'Duplicate', slug: 'duplicate-slug' })
        .expect(409);
    });

    it('returns 400 when slug format is invalid', async () => {
      await request(app.getHttpServer())
        .post('/api/blogs')
        .set('Authorization', `Bearer ${writer1Token}`)
        .send({ title: 'Bad Slug', slug: 'INVALID SLUG!' })
        .expect(400);
    });
  });
});
