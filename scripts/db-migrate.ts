import path from 'node:path';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { createMigratorDb } from '@/lib/db/client';

async function main(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL is not configured');
    process.exit(1);
  }

  const { db, close } = createMigratorDb(url);
  try {
    await migrate(db, { migrationsFolder: path.join(process.cwd(), 'drizzle') });
    console.log('Database migrations applied');
  } finally {
    await close();
  }
}

main().catch(() => {
  console.error('Database migration failed');
  process.exit(1);
});
