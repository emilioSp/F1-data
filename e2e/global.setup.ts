import { execSync } from 'node:child_process';
import { test as setup } from '@playwright/test';

const waitForPostgres = async (timeoutMs = 30_000, intervalMs = 500) => {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      execSync(
        'docker compose -f docker-compose.test.yml exec -T postgres-test pg_isready',
        { stdio: 'ignore' },
      );
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }

  throw new Error('Postgres did not become ready in time');
};

setup('create new database', async () => {
  console.log('starting test database container...');
  // Dedicated container + volume (docker-compose.test.yml), separate from the
  // dev postgres container — Postgres's own bootstrap creates POSTGRES_DB
  // (f1-test, per .env.test) on first start, no manual CREATE DATABASE needed.
  execSync('docker compose -f docker-compose.test.yml up -d postgres-test', {
    stdio: 'inherit',
  });
  await waitForPostgres();
  process.loadEnvFile('.env.test'); // load test environment
  execSync('npm run migrate', { stdio: 'inherit' });
  execSync('node e2e/fixtures/seed.ts', {
    stdio: 'inherit',
  });
});
