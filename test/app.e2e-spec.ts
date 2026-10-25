/**
 * Smoke test: the app boots with every module wired and the database is reachable.
 * Each module owner adds their own test/<module>.e2e-spec.ts next to this one.
 *
 *   PowerShell:  $env:DB_NAME="blog_app_test"; npm run test:e2e
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
    if (!(process.env.DB_NAME ?? '').toLowerCase().includes('test')) {
      throw new Error('Set DB_NAME to a database whose name contains "test", e.g. blog_app_test');
    }
    process.env.DB_SYNC = 'true';
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
