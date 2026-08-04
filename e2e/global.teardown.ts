import { execSync } from 'node:child_process';
import { test as teardown } from '@playwright/test';

teardown('tear down test database container', async () => {
  console.log('stopping test database container...');
  execSync('docker compose -f docker-compose.test.yml down -v', {
    stdio: 'inherit',
  });
});
