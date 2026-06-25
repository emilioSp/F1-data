import { spawnSync } from 'node:child_process';
import { AVAILABLE_YEARS } from '../years.ts';

for (const year of AVAILABLE_YEARS) {
  const result = spawnSync(
    process.execPath,
    ['lib/crawler/index.ts', String(year)],
    { stdio: 'inherit' },
  );
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}