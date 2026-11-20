import { build } from 'esbuild';
import path from 'node:path';

await build({
  entryPoints: {
    worker: 'worker/email-jobs.ts',
    migrate: 'scripts/db-migrate.ts',
  },
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
  outdir: 'dist',
  alias: {
    '@': path.resolve('.'),
  },
  external: ['firebase-admin'],
});
