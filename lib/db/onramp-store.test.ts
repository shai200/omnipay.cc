import { beforeEach, describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { onrampSessions, user } from '@/lib/db/schema';
import { ONRAMP_SESSION_UPDATED, type ParsedOnrampUpdate } from '@/lib/onramp-webhook';
import { openTestDatabase, resetTestData } from '../../test/db';
import { applyVerifiedOnrampUpdate, recordSessionOwner } from './onramp-store';

function update(overrides: Partial<ParsedOnrampUpdate> = {}): ParsedOnrampUpdate {
  return {
    eventId: 'evt_1',
    eventType: ONRAMP_SESSION_UPDATED,
    eventCreated: 100,
    sessionId: 'cos_race',
    status: 'requires_payment',
    transactionDetails: { source_amount: '25.00' },
    ...overrides,
  };
}

async function seedUsers() {
  const db = await openTestDatabase();
  await db.insert(user).values([
    { id: 'owner', email: 'owner@example.com', name: 'Owner' },
    { id: 'other', email: 'other@example.com', name: 'Other' },
  ]);
  return db;
}

describe('onramp session store', () => {
  beforeEach(async () => {
    await resetTestData();
  });

  it('attaches the owner when the webhook created the row first', async () => {
    const db = await seedUsers();
    expect(await applyVerifiedOnrampUpdate(db, update())).toEqual({ duplicate: false, applied: true });
    expect(await recordSessionOwner(db, 'owner', 'cos_race')).toBe('ok');

    const [row] = await db.select().from(onrampSessions).where(eq(onrampSessions.id, 'cos_race'));
    expect(row?.userId).toBe('owner');
    expect(row?.status).toBe('requires_payment');
    expect(row?.statusHistory).toHaveLength(1);
  });

  it('keeps the owner and status when both writers run at the same time', async () => {
    const db = await seedUsers();
    const [owner, webhook] = await Promise.all([
      recordSessionOwner(db, 'owner', 'cos_race'),
      applyVerifiedOnrampUpdate(db, update()),
    ]);
    expect(owner).toBe('ok');
    expect(webhook).toEqual({ duplicate: false, applied: true });

    const rows = await db.select().from(onrampSessions).where(eq(onrampSessions.id, 'cos_race'));
    expect(rows).toHaveLength(1);
    expect(rows[0]?.userId).toBe('owner');
    expect(rows[0]?.status).toBe('requires_payment');
  });

  it('is idempotent for the same owner and refuses a different one', async () => {
    const db = await seedUsers();
    expect(await recordSessionOwner(db, 'owner', 'cos_race')).toBe('ok');
    expect(await recordSessionOwner(db, 'owner', 'cos_race')).toBe('ok');
    expect(await recordSessionOwner(db, 'other', 'cos_race')).toBe('conflict');
    const [row] = await db.select().from(onrampSessions).where(eq(onrampSessions.id, 'cos_race'));
    expect(row?.userId).toBe('owner');
  });

  it('reports a replayed event as a duplicate without a second history entry', async () => {
    const db = await seedUsers();
    await applyVerifiedOnrampUpdate(db, update());
    expect(await applyVerifiedOnrampUpdate(db, update())).toEqual({ duplicate: true, applied: false });
    const [row] = await db.select().from(onrampSessions).where(eq(onrampSessions.id, 'cos_race'));
    expect(row?.statusHistory).toHaveLength(1);
  });
});
