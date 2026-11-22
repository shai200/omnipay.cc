import { eq } from 'drizzle-orm';
import type { AppDatabase } from '@/lib/db/client';
import { onrampSessions, webhookEvents, type StatusHistoryEntry } from '@/lib/db/schema';
import {
  decideSessionWrite,
  type ParsedOnrampUpdate,
  type StoredSession,
} from '@/lib/onramp-webhook';

export type SessionWrite = 'ok' | 'conflict';

type SessionRow = typeof onrampSessions.$inferSelect;

function asHistory(value: unknown): StatusHistoryEntry[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is StatusHistoryEntry => {
    if (!entry || typeof entry !== 'object') return false;
    const record = entry as Record<string, unknown>;
    return typeof record.status === 'string' && typeof record.eventId === 'string' && typeof record.timestamp === 'string';
  });
}

function asDetails(value: unknown): StoredSession['transactionDetails'] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return value as StoredSession['transactionDetails'];
}

function toStoredSession(row: SessionRow | undefined): StoredSession | undefined {
  if (!row) return undefined;
  return {
    status: row.status,
    statusEventCreated: row.statusEventCreated,
    verifiedCompletionEventId: row.verifiedCompletionEventId,
    transactionDetails: asDetails(row.transactionDetails),
  };
}

// Ownership only. Status is written by the verified Stripe webhook.
export async function recordSessionOwner(
  db: AppDatabase,
  userId: string,
  sessionId: string,
): Promise<SessionWrite> {
  return db.transaction(async (tx) => {
    // Insert first and let the primary key arbitrate. SELECT ... FOR UPDATE on
    // a row that does not exist yet locks nothing, so a Stripe webhook for the
    // same new session could insert it at the same moment and one of the two
    // inserts failed on the primary key (a 500 from checkout or the webhook).
    const inserted = await tx
      .insert(onrampSessions)
      .values({
        id: sessionId,
        userId,
        transactionDetails: {},
        statusHistory: [],
      })
      .onConflictDoNothing()
      .returning({ id: onrampSessions.id });
    if (inserted.length > 0) return 'ok';

    const [existing] = await tx
      .select()
      .from(onrampSessions)
      .where(eq(onrampSessions.id, sessionId))
      .limit(1)
      .for('update');

    if (!existing) return 'conflict';
    if (existing.userId && existing.userId !== userId) return 'conflict';
    if (!existing.userId) {
      await tx
        .update(onrampSessions)
        .set({ userId, updatedAt: new Date() })
        .where(eq(onrampSessions.id, sessionId));
    }
    return 'ok';
  });
}

export type WebhookWrite = { duplicate: boolean; applied: boolean };

export async function applyVerifiedOnrampUpdate(
  db: AppDatabase,
  update: ParsedOnrampUpdate,
): Promise<WebhookWrite> {
  return db.transaction(async (tx) => {
    const inserted = await tx
      .insert(webhookEvents)
      .values({
        id: update.eventId,
        type: update.eventType,
        sessionId: update.sessionId,
        status: update.status,
        eventCreated: update.eventCreated,
        signatureVerified: true,
        applied: false,
      })
      .onConflictDoNothing()
      .returning({ id: webhookEvents.id });

    if (inserted.length === 0) {
      return { duplicate: true, applied: false };
    }

    // Make sure the row exists before locking it, so a concurrent
    // recordSessionOwner (or a second event for a brand-new session) waits on
    // the row lock instead of racing this transaction to the insert. A row
    // created here has no status yet, so decideSessionWrite treats it as new.
    await tx
      .insert(onrampSessions)
      .values({ id: update.sessionId, transactionDetails: {}, statusHistory: [] })
      .onConflictDoNothing();

    const [existing] = await tx
      .select()
      .from(onrampSessions)
      .where(eq(onrampSessions.id, update.sessionId))
      .limit(1)
      .for('update');

    const decision = decideSessionWrite(toStoredSession(existing), update);
    const applied = decision.action === 'apply';

    await tx
      .update(webhookEvents)
      .set({ applied })
      .where(eq(webhookEvents.id, update.eventId));

    if (!applied) {
      return { duplicate: false, applied: false };
    }

    const history = asHistory(existing?.statusHistory);
    const nextHistory = [...history, decision.historyEntry];
    const fields = {
      status: decision.status,
      lastStatus: decision.status,
      updatedAt: new Date(),
      statusEventCreated: decision.statusEventCreated,
      statusEventId: decision.statusEventId,
      transactionDetails: decision.transactionDetails,
      statusHistory: nextHistory,
      ...(decision.completionEventId ? { verifiedCompletionEventId: decision.completionEventId } : {}),
    };

    await tx.update(onrampSessions).set(fields).where(eq(onrampSessions.id, update.sessionId));

    return { duplicate: false, applied: true };
  });
}
