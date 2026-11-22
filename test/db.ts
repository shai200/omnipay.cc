import path from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import { migrate } from 'drizzle-orm/pglite/migrator';
import { resetAuthForTests } from '@/lib/auth';
import { setDbForTests, type AppDatabase } from '@/lib/db/client';
import { schema } from '@/lib/db/schema';
import { hashPassword } from '@/lib/auth/password';
import { account, profiles, user } from '@/lib/db/schema';

let client: PGlite | undefined;
let database: AppDatabase | undefined;

export async function openTestDatabase(): Promise<AppDatabase> {
  if (!database) {
    client = new PGlite();
    const db = drizzle(client, { schema });
    await migrate(db, { migrationsFolder: path.join(process.cwd(), 'drizzle') });
    database = db as unknown as AppDatabase;
  }
  setDbForTests(database);
  resetAuthForTests();
  process.env.BETTER_AUTH_SECRET = 'test-only-better-auth-secret-32chars-minimum';
  process.env.BETTER_AUTH_URL = 'http://localhost:3000';
  process.env.VITEST = 'true';
  return database;
}

export async function resetTestData(): Promise<AppDatabase> {
  const db = await openTestDatabase();
  await client?.exec(`
    TRUNCATE TABLE
      "session",
      "account",
      "verification",
      "profiles",
      "onramp_sessions",
      "stripe_webhook_events",
      "legacy_onramp_events",
      "user"
    RESTART IDENTITY CASCADE
  `);
  resetAuthForTests();
  return db;
}

export async function createCredentialUser(input: {
  id: string;
  email: string;
  password: string;
  disabled?: boolean;
  dob?: { year: number; month: number; day: number } | null;
  firstName?: string;
  lastName?: string;
}): Promise<void> {
  const db = await openTestDatabase();
  const now = new Date();
  await db.insert(user).values({
    id: input.id,
    email: input.email,
    name: [input.firstName, input.lastName].filter(Boolean).join(' ') || 'Account',
    emailVerified: true,
    disabled: input.disabled ?? false,
    createdAt: now,
    updatedAt: now,
  });
  await db.insert(account).values({
    id: `${input.id}-credential`,
    accountId: input.id,
    providerId: 'credential',
    userId: input.id,
    password: await hashPassword(input.password),
    createdAt: now,
    updatedAt: now,
  });
  await db.insert(profiles).values({
    userId: input.id,
    firstName: input.firstName ?? null,
    lastName: input.lastName ?? null,
    dobYear: input.dob?.year ?? null,
    dobMonth: input.dob?.month ?? null,
    dobDay: input.dob?.day ?? null,
  });
}

export async function signInCookie(email: string, password: string): Promise<string> {
  const { getAuth } = await import('@/lib/auth');
  const response = await getAuth().api.signInEmail({
    body: { email, password },
    asResponse: true,
  });
  const pairs = typeof response.headers.getSetCookie === 'function'
    ? response.headers.getSetCookie().map((value) => value.split(';')[0]).filter(Boolean)
    : [];
  if (!response.ok || pairs.length === 0) {
    throw new Error(`sign-in failed (${response.status})`);
  }
  return pairs.join('; ');
}

type QueryFn = (sql: string, params?: unknown[]) => Promise<unknown>;

/**
 * Runs `competitor` inside the next transaction, immediately before the first
 * statement whose SQL matches `pattern`. PGlite has a single connection and
 * runs transactions one after another, so this is how a test reproduces
 * another writer committing between two statements of a transaction (for
 * example, a Stripe webhook inserting a row after a SELECT found none).
 * Returns a function that removes the hook.
 */
export function interleaveBeforeQuery(pattern: RegExp, competitor: (query: QueryFn) => Promise<void>): () => void {
  if (!client) throw new Error('Open the test database first.');
  const pg = client;
  const original = pg.transaction;
  let fired = false;

  pg.transaction = (async (callback: (tx: unknown) => Promise<unknown>) =>
    original.call(pg, async (tx) => {
      const query: QueryFn = (sql, params) => tx.query(sql, params);
      const wrapped = new Proxy(tx, {
        get(target, prop) {
          if (prop === 'query') {
            return async (sql: string, params?: unknown[], options?: Parameters<typeof tx.query>[2]) => {
              if (!fired && pattern.test(sql)) {
                fired = true;
                await competitor(query);
              }
              return target.query(sql, params, options);
            };
          }
          const value = Reflect.get(target, prop);
          return typeof value === 'function' ? value.bind(target) : value;
        },
      });
      return callback(wrapped);
    })) as typeof pg.transaction;

  return () => {
    pg.transaction = original;
  };
}
