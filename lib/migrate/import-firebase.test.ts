import { beforeEach, describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { account, onrampSessions, profiles, user, webhookEvents } from '@/lib/db/schema';
import { hashPassword, isBcryptHash } from '@/lib/auth/password';
import { openTestDatabase, resetTestData } from '../../test/db';
import { importFirebaseSnapshot } from './import-firebase';
import { assertImportAllowed, assertMigrationFilePath, databaseHost } from './safety';
import type { FirebaseSnapshot } from './types';

const snapshot = (): FirebaseSnapshot => ({
  exportedAt: '2026-01-01T00:00:00.000Z',
  authUsers: [
    {
      uid: 'firebase-user',
      email: 'Person@Example.com',
      emailVerified: true,
      displayName: 'Pat Example',
      disabled: false,
      passwordHash: 'abc',
      passwordSalt: 'salt',
      providerData: [
        { providerId: 'password', uid: 'firebase-user' },
        { providerId: 'google.com', uid: 'google-subject' },
      ],
      createdAt: '2024-01-01T00:00:00.000Z',
    },
  ],
  users: [
    {
      id: 'firebase-user',
      data: {
        first_name: 'Pat',
        last_name: 'Example',
        dob: { year: 1991, month: 5, day: 2 },
        address: { line1: '1 Secret Road', country: 'us' },
        wallet_addresses: { bitcoin: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4', ethereum: 'not-valid' },
        reminderFrequency: 'weekly',
        reminder_price_drop: false,
      },
    },
  ],
  onrampSessions: [
    {
      id: 'cos_old',
      data: {
        userId: 'firebase-user',
        status: 'fulfillment_complete',
        verifiedCompletionEventId: 'evt_old',
        transactionDetails: { source_amount: '10.00', wallet_address: 'bc1qshouldnotstay' },
        statusHistory: [{ status: 'fulfillment_complete', eventId: 'evt_old', timestamp: '2024-02-01T00:00:00.000Z' }],
        abandonmentEmailCount: 2,
      },
    },
  ],
  webhookEvents: [
    {
      id: 'evt_old',
      data: {
        type: 'crypto.onramp_session.updated',
        sessionId: 'cos_old',
        status: 'fulfillment_complete',
        eventCreated: 10,
        signatureVerified: true,
        applied: true,
      },
    },
  ],
  onrampEvents: [{ id: 'legacy-1', data: { userId: 'firebase-user', note: 'old' } }],
});

describe('firebase import', () => {
  beforeEach(async () => {
    await resetTestData();
  });

  it('imports once, again without duplicating, and keeps an upgraded password', async () => {
    const db = await openTestDatabase();
    const first = await importFirebaseSnapshot(db, snapshot());
    const second = await importFirebaseSnapshot(db, snapshot());
    expect(first.users).toBe(1);
    expect(second.users).toBe(1);
    expect(await db.select().from(user)).toHaveLength(1);
    expect(await db.select().from(onrampSessions)).toHaveLength(1);
    expect(await db.select().from(webhookEvents)).toHaveLength(1);

    const [person] = await db.select().from(user).where(eq(user.id, 'firebase-user'));
    expect(person?.email).toBe('person@example.com');
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, 'firebase-user'));
    expect(profile?.welcomeEmailSentAt).not.toBeNull();
    expect(profile?.firstPurchaseEmailSentAt).not.toBeNull();
    expect(profile?.reminderWeekly).toBe(true);
    expect(profile?.walletBitcoin).toBe('bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4');
    expect(profile?.walletEthereum).toBeNull();
    expect(profile?.addressCountry).toBe('US');

    const [session] = await db.select().from(onrampSessions).where(eq(onrampSessions.id, 'cos_old'));
    expect(JSON.stringify(session?.transactionDetails)).not.toContain('bc1qshouldnotstay');
    expect(session?.status).toBe('fulfillment_complete');

    const credential = (await db.select().from(account)).find((row) => row.providerId === 'credential');
    expect(credential?.password).toBe('firebase-scrypt$abc$salt');
    const upgraded = await hashPassword('new-password');
    await db.update(account).set({ password: upgraded }).where(eq(account.id, credential?.id ?? ''));
    await importFirebaseSnapshot(db, snapshot());
    const [after] = await db.select().from(account).where(eq(account.providerId, 'credential'));
    expect(after?.password && isBcryptHash(after.password)).toBe(true);

    await db.update(onrampSessions).set({ status: 'fulfillment_complete', verifiedCompletionEventId: 'evt_live' }).where(eq(onrampSessions.id, 'cos_old'));
    const replay = snapshot();
    replay.onrampSessions[0]!.data.status = 'requires_payment';
    replay.onrampSessions[0]!.data.verifiedCompletionEventId = null;
    await importFirebaseSnapshot(db, replay);
    const [kept] = await db.select().from(onrampSessions).where(eq(onrampSessions.id, 'cos_old'));
    expect(kept?.status).toBe('fulfillment_complete');
    expect(kept?.verifiedCompletionEventId).toBe('evt_live');
  });
});

describe('migration safety checks', () => {
  it('refuses to run or to write inside the repository', () => {
    expect(() => assertImportAllowed({ allowFlag: undefined, databaseUrl: 'postgres://u:secret@db.internal:5432/app', confirmHost: 'db.internal:5432' })).toThrow(/ALLOW_DATA_MIGRATION/);
    expect(databaseHost('postgres://u:secret@db.internal:5432/app')).toBe('db.internal:5432');
    expect(databaseHost('postgres://u:secret@db.internal:5432/app')).not.toContain('secret');
    expect(() => assertImportAllowed({
      allowFlag: 'yes',
      databaseUrl: 'postgres://u:secret@db.internal:5432/app',
      confirmHost: 'other.internal',
    })).toThrow(/confirm-host/);
    expect(() => assertMigrationFilePath('app/page.tsx', process.cwd())).toThrow(/migration-data/);
    expect(assertMigrationFilePath('migration-data/export.json', process.cwd())).toContain('migration-data');
  });
});
