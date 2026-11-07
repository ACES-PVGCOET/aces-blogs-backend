import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Client } from 'pg';

export const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL;

/** The test database is wiped on every run, so its name has to say "test". */
export function assertSafeTestDatabase(url: string): void {
  const name = decodeURIComponent(new URL(url).pathname.replace(/^\//, ''));
  if (!/test/i.test(name)) {
    throw new Error(`Refusing to reset database "${name}": its name must contain "test" (the schema is dropped).`);
  }
}

/** Drops the public schema and re-applies prisma/migrations/*, exactly like `prisma migrate deploy`. */
export async function resetDatabase(url: string): Promise<void> {
  assertSafeTestDatabase(url);
  const client = new Client({ connectionString: url });
  await client.connect();
  try {
    await client.query('DROP SCHEMA IF EXISTS public CASCADE');
    await client.query('CREATE SCHEMA public');

    const root = join(process.cwd(), 'prisma', 'migrations');
    const folders = readdirSync(root, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort();
    for (const folder of folders) {
      await client.query(readFileSync(join(root, folder, 'migration.sql'), 'utf8'));
    }
  } finally {
    await client.end();
  }
}
