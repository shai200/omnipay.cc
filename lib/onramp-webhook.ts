export const ONRAMP_SESSION_UPDATED = 'crypto.onramp_session.updated';
export const FULFILLMENT_COMPLETE = 'fulfillment_complete';
export const WEBHOOK_EVENTS_COLLECTION = 'stripe_webhook_events';

const ID_PATTERN = /^[A-Za-z0-9_]{1,128}$/;
const STATUS_PATTERN = /^[a-z0-9_]{1,64}$/;
const DETAIL_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,31}$/;
const MAX_EVENT_CREATED = 4_000_000_000;

const DETAIL_KEYS = [
  'source_amount',
  'source_currency',
  'destination_amount',
  'destination_currency',
  'destination_network',
] as const;

export type TransactionDetails = Partial<Record<(typeof DETAIL_KEYS)[number], string>>;

export type ParsedOnrampUpdate = {
  eventId: string;
  eventType: typeof ONRAMP_SESSION_UPDATED;
  eventCreated: number;
  sessionId: string;
  status: string;
  transactionDetails: TransactionDetails;
};

export type WebhookParseResult =
  | { ok: true; update: ParsedOnrampUpdate }
  | { ok: false; reason: 'ignored_type' | 'invalid_event' | 'invalid_session' | 'invalid_status' };

export type StoredSession = {
  status?: unknown;
  statusEventCreated?: unknown;
  verifiedCompletionEventId?: unknown;
  transactionDetails?: unknown;
};

export type SessionWriteDecision =
  | { action: 'skip' }
  | {
      action: 'apply';
      status: string;
      statusEventCreated: number;
      statusEventId: string;
      transactionDetails: TransactionDetails;
      historyEntry: { status: string; eventId: string; timestamp: string };
      completionEventId?: string;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

export function sanitizeTransactionDetails(value: unknown): TransactionDetails {
  if (!isRecord(value)) return {};
  const details: TransactionDetails = {};
  for (const key of DETAIL_KEYS) {
    const raw = value[key];
    const text = typeof raw === 'number' && Number.isFinite(raw) ? String(raw) : raw;
    if (typeof text === 'string' && DETAIL_PATTERN.test(text)) {
      details[key] = text;
    }
  }
  return details;
}

export function parseOnrampWebhookEvent(event: unknown): WebhookParseResult {
  if (!isRecord(event)) return { ok: false, reason: 'invalid_event' };
  if (event.type !== ONRAMP_SESSION_UPDATED) return { ok: false, reason: 'ignored_type' };

  const eventId = event.id;
  const created = event.created;
  if (typeof eventId !== 'string' || !ID_PATTERN.test(eventId)) {
    return { ok: false, reason: 'invalid_event' };
  }
  if (
    typeof created !== 'number' ||
    !Number.isInteger(created) ||
    created < 0 ||
    created > MAX_EVENT_CREATED
  ) {
    return { ok: false, reason: 'invalid_event' };
  }

  const data = isRecord(event.data) ? event.data : undefined;
  const session = data && isRecord(data.object) ? data.object : undefined;
  if (!session || session.object !== 'crypto.onramp_session') {
    return { ok: false, reason: 'invalid_session' };
  }

  const sessionId = session.id;
  if (typeof sessionId !== 'string' || !ID_PATTERN.test(sessionId)) {
    return { ok: false, reason: 'invalid_session' };
  }

  const status = session.status;
  if (typeof status !== 'string' || !STATUS_PATTERN.test(status)) {
    return { ok: false, reason: 'invalid_status' };
  }

  return {
    ok: true,
    update: {
      eventId,
      eventType: ONRAMP_SESSION_UPDATED,
      eventCreated: created,
      sessionId,
      status,
      transactionDetails: sanitizeTransactionDetails(session.transaction_details),
    },
  };
}

function eventTimestamp(created: number): string {
  return new Date(created * 1000).toISOString();
}

function existingMarker(existing: StoredSession | undefined): string | undefined {
  const marker = existing?.verifiedCompletionEventId;
  return typeof marker === 'string' && marker.length > 0 ? marker : undefined;
}

// fulfillment_complete sticks. A signed completion is applied even when its
// event timestamp is older than a non-terminal update that arrived first.
// Other statuses never move backwards in event time and never clear completion.
export function decideSessionWrite(
  existing: StoredSession | undefined,
  update: ParsedOnrampUpdate,
): SessionWriteDecision {
  const currentStatus = typeof existing?.status === 'string' ? existing.status : undefined;
  const currentCreated =
    typeof existing?.statusEventCreated === 'number' && Number.isFinite(existing.statusEventCreated)
      ? existing.statusEventCreated
      : undefined;

  const alreadyComplete = currentStatus === FULFILLMENT_COMPLETE;
  const stale =
    update.status !== FULFILLMENT_COMPLETE &&
    currentCreated !== undefined &&
    update.eventCreated < currentCreated;

  if (alreadyComplete || stale) {
    return { action: 'skip' };
  }

  const marker = existingMarker(existing);
  const completionEventId =
    update.status === FULFILLMENT_COMPLETE && !marker ? update.eventId : undefined;

  return {
    action: 'apply',
    status: update.status,
    statusEventCreated: update.eventCreated,
    statusEventId: update.eventId,
    transactionDetails: {
      ...sanitizeTransactionDetails(existing?.transactionDetails),
      ...update.transactionDetails,
    },
    historyEntry: {
      status: update.status,
      eventId: update.eventId,
      timestamp: eventTimestamp(update.eventCreated),
    },
    ...(completionEventId ? { completionEventId } : {}),
  };
}
