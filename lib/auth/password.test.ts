import { beforeEach, describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { account, profiles, user } from '@/lib/db/schema';
import { openTestDatabase, resetTestData } from '../../test/db';
import {
  encodeFirebaseScryptHash,
  hashPassword,
  isBcryptHash,
  verifyStoredPassword,
} from './password';

// Published sample from https://github.com/firebase/scrypt. Not a project secret.
const SAMPLE = {
  signerKey: 'jxspr8Ki0RYycVU8zykbdLGjFQ3McFUH0uiiTvC8pVMXAn210wjLNmdZJzxUECKbm0QsEmYUSDzZvpjeJ9WmXA==',
  saltSeparator: 'Bw==',
  rounds: '8',
  memCost: '14',
  salt: '42xEC+ixf3L2lw==',
  hash: 'lSrfV15cpx95/sZS2W9c9Kp6i/LVgQNDNC/qzrCnh1SAyZvqmZqAjTdn3aoItz+VHjoZilo78198JAdRuid5lQ==',
  password: 'user1password',
};

describe('password hashing', () => {
  beforeEach(() => {
    process.env.FIREBASE_SCRYPT_SIGNER_KEY = SAMPLE.signerKey;
    process.env.FIREBASE_SCRYPT_SALT_SEPARATOR = SAMPLE.saltSeparator;
    process.env.FIREBASE_SCRYPT_ROUNDS = SAMPLE.rounds;
    process.env.FIREBASE_SCRYPT_MEM_COST = SAMPLE.memCost;
  });

  it('verifies the published Firebase scrypt vector and rejects a wrong password', async () => {
    const stored = encodeFirebaseScryptHash(SAMPLE.hash, SAMPLE.salt);
    expect(await verifyStoredPassword(stored, SAMPLE.password)).toBe(true);
    expect(await verifyStoredPassword(stored, 'wrong-password')).toBe(false);
  });

  it('fails closed when the Firebase parameters are missing', async () => {
    delete process.env.FIREBASE_SCRYPT_SIGNER_KEY;
    const stored = encodeFirebaseScryptHash(SAMPLE.hash, SAMPLE.salt);
    expect(await verifyStoredPassword(stored, SAMPLE.password)).toBe(false);
  });

  it('upgrades a Firebase hash to bcrypt after a successful check', async () => {
    await resetTestData();
    const db = await openTestDatabase();
    const stored = encodeFirebaseScryptHash(SAMPLE.hash, SAMPLE.salt);
    await db.insert(user).values({
      id: 'legacy-user',
      email: 'legacy@example.com',
      name: 'Legacy',
      emailVerified: true,
    });
    await db.insert(account).values({
      id: 'legacy-account',
      accountId: 'legacy-user',
      providerId: 'credential',
      userId: 'legacy-user',
      password: stored,
    });

    const ok = await verifyStoredPassword(stored, SAMPLE.password, async (nextHash) => {
      await db.update(account).set({ password: nextHash }).where(eq(account.password, stored));
    });
    expect(ok).toBe(true);
    const [row] = await db.select().from(account).where(eq(account.id, 'legacy-account'));
    expect(row?.password && isBcryptHash(row.password)).toBe(true);
    expect(await verifyStoredPassword(row?.password ?? '', SAMPLE.password)).toBe(true);
    expect(await verifyStoredPassword(row?.password ?? '', 'wrong-password')).toBe(false);
    expect(await hashPassword('another-password')).toMatch(/^\$2[aby]\$/);
  });

  it('signs in with a Firebase scrypt hash and replaces it with bcrypt', async () => {
    await resetTestData();
    const db = await openTestDatabase();
    const stored = encodeFirebaseScryptHash(SAMPLE.hash, SAMPLE.salt);
    await db.insert(user).values({
      id: 'legacy-user',
      email: 'legacy@example.com',
      name: 'Legacy',
      emailVerified: true,
    });
    await db.insert(account).values({
      id: 'legacy-account',
      accountId: 'legacy-user',
      providerId: 'credential',
      userId: 'legacy-user',
      password: stored,
    });
    await db.insert(profiles).values({ userId: 'legacy-user' });

    const { getAuth } = await import('@/lib/auth');
    const response = await getAuth().api.signInEmail({
      body: { email: 'legacy@example.com', password: SAMPLE.password },
      asResponse: true,
    });
    expect(response.status).toBe(200);

    const [row] = await db.select().from(account).where(eq(account.id, 'legacy-account'));
    expect(row?.password && isBcryptHash(row.password)).toBe(true);
    expect(row?.password).not.toBe(stored);

    const wrong = await getAuth().api.signInEmail({
      body: { email: 'legacy@example.com', password: 'wrong-password' },
      asResponse: true,
    });
    expect(wrong.ok).toBe(false);
  });
});
