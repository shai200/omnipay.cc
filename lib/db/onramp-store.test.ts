import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { onrampSessions, user } from '@/lib/db/schema';
import { ONRAMP_SESSION_UPDATED, type ParsedOnrampUpdate } from '@/lib/onramp-webhook';
import { interleaveBeforeQuery, openTestDatabase, resetTestData } from '../../test/db';
import { applyVerifiedOnrampUpdate, recordSessionOwner } from './onramp-store';

const SESSION_ID = 'cos_race';
const INSERT_SESSION = /^insert into "onramp_sessions"/i;

function update(overrides: Partial<ParsedOnrampUpdate> = {}): ParsedOnrampUpdate {
  return {
    eventId: 'evt_1',
    eventType: ONRAMP_SESSION_UPDATED,
    eventCreated: 100,
    sessionId: SESSION_ID,
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

async function sessionRows() {
  const db = await openTestDatabase();
  return db.select().from(onrampSessions).where(eq(onrampSessions.id, SESSION_ID));
}

describe('onramp session store', () => {
  let removeHook: (() => void) | undefined;

  beforeEach(async () => {
    await resetTestData();
  });

  afterEach(() => {
    removeHook?.();
    removeHook = undefined;
  });

  it('attaches the owner when the webhook created the row first', async () => {
    const db = await seedUsers();
    expect(await applyVerifiedOnrampUpdate(db, update())).toEqual({ duplicate: false, applied: true });
    expect(await recordSessionOwner(db, 'owner', SESSION_ID)).toBe('ok');

    const [row] = await sessionRows();
    expect(row?.userId).toBe('owner');
    expect(row?.status).toBe('requires_payment');
    expect(row?.statusHistory).toHaveLength(1);
  });

  it('applies the webhook status when checkout recorded the owner first', async () => {
    const db = await seedUsers();
    expect(await recordSessionOwner(db, 'owner', SESSION_ID)).toBe('ok');
    expect(await applyVerifiedOnrampUpdate(db, update())).toEqual({ duplicate: false, applied: true });

    const [row] = await sessionRows();
    expect(row?.userId).toBe('owner');
    expect(row?.status).toBe('requires_payment');
  });

  it('does not fail when the webhook inserts the row while checkout is recording the owner', async () => {
    const db = await seedUsers();
    // The webhook's row lands after checkout looked for the session and
    // before checkout inserts it. This used to fail on the primary key.
    removeHook = interleaveBeforeQuery(INSERT_SESSION, async (query) => {
      await query(
        `insert into "onramp_sessions" ("id", "status", "transaction_details", "status_history") values ($1, 'requires_payment', '{}', '[]')`,
        [SESSION_ID],
      );
    });

    expect(await recordSessionOwner(db, 'owner', SESSION_ID)).toBe('ok');

    const rows = await sessionRows();
    expect(rows).toHaveLength(1);
    expect(rows[0]?.userId).toBe('owner');
    expect(rows[0]?.status).toBe('requires_payment');
  });

  it('does not fail when checkout inserts the row while the webhook is applying a status', async () => {
    const db = await seedUsers();
    removeHook = interleaveBeforeQuery(INSERT_SESSION, async (query) => {
      await query(
        `insert into "onramp_sessions" ("id", "user_id", "transaction_details", "status_history") values ($1, 'owner', '{}', '[]')`,
        [SESSION_ID],
      );
    });

    expect(await applyVerifiedOnrampUpdate(db, update())).toEqual({ duplicate: false, applied: true });

    const rows = await sessionRows();
    expect(rows).toHaveLength(1);
    expect(rows[0]?.userId).toBe('owner');
    expect(rows[0]?.status).toBe('requires_payment');
    expect(rows[0]?.statusHistory).toHaveLength(1);
  });

  it('refuses a session that another user claimed in the same window', async () => {
    const db = await seedUsers();
    removeHook = interleaveBeforeQuery(INSERT_SESSION, async (query) => {
      await query(
        `insert into "onramp_sessions" ("id", "user_id", "transaction_details", "status_history") values ($1, 'other', '{}', '[]')`,
        [SESSION_ID],
      );
    });

    expect(await recordSessionOwner(db, 'owner', SESSION_ID)).toBe('conflict');
    const [row] = await sessionRows();
    expect(row?.userId).toBe('other');
  });

  it('is idempotent for the same owner and refuses a different one', async () => {
    const db = await seedUsers();
    expect(await recordSessionOwner(db, 'owner', SESSION_ID)).toBe('ok');
    expect(await recordSessionOwner(db, 'owner', SESSION_ID)).toBe('ok');
    expect(await recordSessionOwner(db, 'other', SESSION_ID)).toBe('conflict');
    const [row] = await sessionRows();
    expect(row?.userId).toBe('owner');
  });

  it('reports a replayed event as a duplicate without a second history entry', async () => {
    const db = await seedUsers();
    await applyVerifiedOnrampUpdate(db, update());
    expect(await applyVerifiedOnrampUpdate(db, update())).toEqual({ duplicate: true, applied: false });
    const [row] = await sessionRows();
    expect(row?.statusHistory).toHaveLength(1);
  });
});
