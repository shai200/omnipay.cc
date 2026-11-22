import { betterAuth, getCurrentAdapter } from 'better-auth';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { nextCookies } from 'better-auth/next-js';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyStoredPassword } from '@/lib/auth/password';
import { getDb } from '@/lib/db/client';
import { account, authSession, user, verification } from '@/lib/db/schema';
import { ensureProfile } from '@/lib/db/profile-store';
import { sendPasswordResetEmail } from '@/lib/email/send';

const BUILD_PLACEHOLDER_SECRET = 'build-only-placeholder-secret-not-for-sessions';

function authSecret(): string {
  const secret = process.env.BETTER_AUTH_SECRET?.trim() || process.env.AUTH_SECRET?.trim() || '';
  if (secret.length >= 32) return secret;
  if (process.env.NEXT_PHASE === 'phase-production-build') return BUILD_PLACEHOLDER_SECRET;
  throw new Error('BETTER_AUTH_SECRET is not configured');
}

function appOrigin(): string {
  return process.env.BETTER_AUTH_URL?.trim() || process.env.APP_ORIGIN?.trim() || 'http://localhost:3000';
}

function googleProvider(): { clientId: string; clientSecret: string } | undefined {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim() ?? '';
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim() ?? '';
  if (!clientId || !clientSecret) return undefined;
  return { clientId, clientSecret };
}

let authInstance: ReturnType<typeof buildAuth> | undefined;

export function resetAuthForTests(): void {
  authInstance = undefined;
}

function buildAuth() {
  const origin = appOrigin();
  const google = googleProvider();
  const db = getDb();

  return betterAuth({
    appName: 'Omnipay.cc',
    baseURL: origin,
    secret: authSecret(),
    trustedOrigins: [origin],
    database: drizzleAdapter(db, {
      provider: 'pg',
      transaction: true,
      schema: {
        user,
        session: authSession,
        account,
        verification,
      },
    }),
    user: {
      additionalFields: {
        disabled: {
          type: 'boolean',
          required: true,
          defaultValue: false,
          input: false,
          returned: false,
        },
      },
    },
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      revokeSessionsOnPasswordReset: true,
      password: {
        hash: hashPassword,
        verify: async ({ hash, password }) => verifyStoredPassword(hash, password, async (nextHash) => {
          await db
            .update(account)
            .set({ password: nextHash, updatedAt: new Date() })
            .where(eq(account.password, hash));
        }),
      },
      sendResetPassword: async ({ user: accountUser, url }) => {
        await sendPasswordResetEmail(accountUser.email, url);
      },
    },
    socialProviders: google ? { google } : undefined,
    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: ['google'],
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: { enabled: false },
    },
    advanced: {
      useSecureCookies: process.env.NODE_ENV === 'production',
      defaultCookieAttributes: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    rateLimit: {
      enabled: process.env.VITEST !== 'true',
      window: 60,
      max: 30,
      customRules: {
        '/sign-in/email': { window: 60, max: 5 },
        '/sign-up/email': { window: 60, max: 5 },
        '/request-password-reset': { window: 60, max: 3 },
      },
    },
    databaseHooks: {
      user: {
        create: {
          after: async (created) => {
            await ensureProfile(db, { id: created.id, name: created.name });
          },
        },
      },
      session: {
        create: {
          before: async (session, ctx) => {
            // Sign-up creates the user and its first session in one
            // transaction. A query on the shared pool cannot see that
            // uncommitted user, so every email sign-up was rejected
            // (FAILED_TO_CREATE_SESSION) and rolled back. Read through the
            // adapter bound to the current transaction instead.
            const fallback = ctx?.context?.adapter;
            if (fallback) {
              const adapter = await getCurrentAdapter(fallback);
              const row = await adapter.findOne<{ disabled?: boolean | null }>({
                model: 'user',
                where: [{ field: 'id', value: session.userId }],
              });
              if (!row || row.disabled) return false;
              return;
            }
            const [row] = await db
              .select({ disabled: user.disabled })
              .from(user)
              .where(eq(user.id, session.userId))
              .limit(1);
            if (!row || row.disabled) return false;
          },
        },
      },
    },
    plugins: [nextCookies()],
  });
}

export function getAuth() {
  if (!authInstance) authInstance = buildAuth();
  return authInstance;
}
