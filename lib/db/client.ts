import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { schema } from '@/lib/db/schema';

// The embedded test database implements the same query API. Tests cast it to this type.
export type AppDatabase = PostgresJsDatabase<typeof schema>;

type SqlClient = ReturnType<typeof postgres>;

let database: AppDatabase | undefined;
let sqlClient: SqlClient | undefined;

export function getDb(): AppDatabase {
  if (database) return database;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not configured');
  }
  sqlClient = postgres(url, { max: 10, idle_timeout: 20, connect_timeout: 10 });
  database = drizzle(sqlClient, { schema });
  return database;
}

export function setDbForTests(next: AppDatabase | undefined): void {
  database = next;
  sqlClient = undefined;
}

export async function closeDb(): Promise<void> {
  if (sqlClient) {
    await sqlClient.end({ timeout: 5 });
  }
  sqlClient = undefined;
  database = undefined;
}

export function createMigratorDb(url: string): { db: PostgresJsDatabase; close: () => Promise<void> } {
  const sql = postgres(url, { max: 1 });
  return {
    db: drizzle(sql),
    close: () => sql.end({ timeout: 5 }),
  };
}
