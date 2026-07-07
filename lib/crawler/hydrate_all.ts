import { spawnSync } from 'node:child_process';
import { AVAILABLE_SEASONS } from '../years.ts';

for (const year of AVAILABLE_SEASONS) {
  const result = spawnSync(
    process.execPath,
    ['lib/crawler/index.ts', String(year)],
    { stdio: 'inherit' },
  );
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
