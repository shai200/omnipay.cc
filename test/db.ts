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
