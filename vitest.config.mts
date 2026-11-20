import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    fileParallelism: false,
    testTimeout: 30000,
    hookTimeout: 30000,
    include: ['**/*.test.ts'],
    exclude: ['node_modules', '.next', 'dist'],
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, '.'),
    },
  },
});
