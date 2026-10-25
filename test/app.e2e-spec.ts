/**
 * Smoke test: the app boots with every module wired and the database is reachable.
 * Each module owner adds their own test/<module>.e2e-spec.ts next to this one.
 *
 *   PowerShell:  $env:DATABASE_URL="postgresql://postgres:replace_me@localhost:5432/blog_app_test?schema=public"; npm run test:e2e
 *
 * Use a SEPARATE database whose name contains "test": tests may drop or alter its tables.
 */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('App', () => {
  let app: INestApplication;

  beforeAll(async () => {
    if (!(process.env.DATABASE_URL ?? '').toLowerCase().includes('test')) {
      throw new Error('Set DATABASE_URL to a database whose name contains "test", e.g. .../blog_app_test');
    }
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('GET /api/health -> 200 ok (all modules wired, database reachable)', async () => {
    const res = await request(app.getHttpServer()).get('/api/health').expect(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
