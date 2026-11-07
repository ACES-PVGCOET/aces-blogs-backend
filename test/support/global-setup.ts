import { resetDatabase, TEST_DATABASE_URL } from './database';

/** Runs once before the e2e suites. The blog suites skip themselves when no test database URL is set. */
export default async function setup() {
  if (!TEST_DATABASE_URL) {
    console.warn('TEST_DATABASE_URL / DATABASE_URL is not set: database e2e suites will be skipped.');
    return;
  }
  await resetDatabase(TEST_DATABASE_URL);
}
