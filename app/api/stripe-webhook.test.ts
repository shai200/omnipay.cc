import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { isWebhookEventId, verifiedCompletionAllowsEmail } from '../../functions/src/verified-completion';
import { getMemoryDb } from '../../test/memory-firestore';

vi.mock('@/lib/firebase-admin', async () => {
  const { getMemoryDb: getDb } = await import('../../test/memory-firestore');
  const memory = getDb();
  return {
    adminApp: { name: 'test' },
    adminAuth: memory.auth,
    adminDb: memory.db,
  };
});

vi.mock('firebase-admin/firestore', () => ({
  FieldValue: {
    serverTimestamp: () => ({ __op: 'serverTimestamp' }),
    arrayUnion: (value: unknown) => ({ __op: 'arrayUnion', value }),
  },
}));

import { POST as receiveWebhook } from './stripe/webhook/route';

const WEBHOOK_SECRET = 'whsec_test_omnipay_webhook';
const WALLET = 'bc1qshouldnotstore';
const CLIENT_SECRET = 'cos_test_secret_do_not_store';

function payload(options?: {
  id?: string;
  created?: number;
  type?: string;
  sessionId?: string;
  status?: string;
  transactionDetails?: Record<string, unknown> | null;
  metadataUserId?: string;
}) {
  const session: Record<string, unknown> = {
    id: options?.sessionId ?? 'cos_test_123',
    object: 'crypto.onramp_session',
    status: options?.status ?? 'requires_payment',
    client_secret: CLIENT_SECRET,
    metadata: { userId: options?.metadataUserId ?? 'attacker' },
  };
  if (options?.transactionDetails !== null) {
    session.transaction_details = options?.transactionDetails ?? {
      source_amount: '100.00',
      source_currency: 'usd',
      destination_amount: '0.002',
      destination_currency: 'btc',
      destination_network: 'bitcoin',
      wallet_address: WALLET,
      wallet_addresses: { bitcoin: WALLET },
    };
  }
  return JSON.stringify({
    id: options?.id ?? 'evt_test_1',
    object: 'event',
    api_version: '2024-11-20.acacia',
    created: options?.created ?? 1_700_000_100,
    livemode: false,
    type: options?.type ?? 'crypto.onramp_session.updated',
    data: { object: session },
  });
}

function signedRequest(body: string, header?: string) {
  return new NextRequest(new URL('/api/stripe/webhook', 'http://localhost'), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(header ? { 'stripe-signature': header } : {}),
    },
    body,
  });
}

function sign(body: string, secret = WEBHOOK_SECRET, timestamp?: number) {
  return Stripe.webhooks.generateTestHeaderString({ payload: body, secret, timestamp });
}

describe('stripe onramp webhook', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;
  const fetchMock = vi.fn();

  beforeEach(() => {
    getMemoryDb().reset();
    process.env.STRIPE_WEBHOOK_SECRET = WEBHOOK_SECRET;
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
    delete process.env.STRIPE_WEBHOOK_SECRET;
    vi.unstubAllGlobals();
  });

  function loggedText() {
    return [...logSpy.mock.calls, ...errorSpy.mock.calls]
      .flat()
      .map((part) => (typeof part === 'string' ? part : JSON.stringify(part)))
      .join('\n');
  }

  it('rejects a missing secret, a missing signature, a bad signature, a tampered body, and an expired signature', async () => {
    const body = payload();
    delete process.env.STRIPE_WEBHOOK_SECRET;

    const unconfigured = await receiveWebhook(signedRequest(body, sign(body)));
    expect(unconfigured.status).toBe(500);
    expect(getMemoryDb().sessions.size).toBe(0);
    expect(getMemoryDb().webhookEvents.size).toBe(0);

    process.env.STRIPE_WEBHOOK_SECRET = WEBHOOK_SECRET;

    const missing = await receiveWebhook(signedRequest(body));
    expect(missing.status).toBe(400);

    const wrongSecret = await receiveWebhook(signedRequest(body, sign(body, 'whsec_other_secret')));
    expect(wrongSecret.status).toBe(400);

    const tampered = await receiveWebhook(signedRequest(`${body} `, sign(body)));
    expect(tampered.status).toBe(400);

    const expired = await receiveWebhook(signedRequest(
      body,
      sign(body, WEBHOOK_SECRET, Math.floor(Date.now() / 1000) - 600),
    ));
    expect(expired.status).toBe(400);

    expect(getMemoryDb().sessions.size).toBe(0);
    expect(getMemoryDb().webhookEvents.size).toBe(0);
    expect(getMemoryDb().counters.writes).toBe(0);
    expect(fetchMock).not.toHaveBeenCalled();
    const logs = loggedText();
    for (const secret of [WEBHOOK_SECRET, 'whsec_other_secret', CLIENT_SECRET, WALLET]) {
      expect(logs).not.toContain(secret);
    }
  });

  it('stores status from a verified event and ignores a second delivery', async () => {
    getMemoryDb().sessions.set('cos_test_123', {
      sessionId: 'cos_test_123',
      userId: 'user-1',
      status: 'initialized',
      statusEventCreated: 1_700_000_000,
      transactionDetails: { wallet_address: WALLET, source_currency: 'usd' },
      statusHistory: [],
    });

    const body = payload({ status: 'requires_payment', created: 1_700_000_200 });
    const first = await receiveWebhook(signedRequest(body, sign(body)));
    expect(first.status).toBe(200);
    expect(await first.json()).toEqual({ received: true });

    const session = getMemoryDb().sessions.get('cos_test_123');
    expect(session).toMatchObject({
      userId: 'user-1',
      status: 'requires_payment',
      lastStatus: 'requires_payment',
      statusEventCreated: 1_700_000_200,
      statusEventId: 'evt_test_1',
      transactionDetails: {
        source_amount: '100.00',
        source_currency: 'usd',
        destination_amount: '0.002',
        destination_currency: 'btc',
        destination_network: 'bitcoin',
      },
    });
    expect(session?.verifiedCompletionEventId).toBeUndefined();
    expect(JSON.stringify(session)).not.toContain(WALLET);
    expect(JSON.stringify(session)).not.toContain(CLIENT_SECRET);
    expect(JSON.stringify(session)).not.toContain('attacker');
    expect(session?.statusHistory).toEqual([
      {
        status: 'requires_payment',
        eventId: 'evt_test_1',
        timestamp: new Date(1_700_000_200 * 1000).toISOString(),
      },
    ]);

    const recorded = getMemoryDb().webhookEvents.get('evt_test_1');
    expect(recorded).toMatchObject({
      eventId: 'evt_test_1',
      type: 'crypto.onramp_session.updated',
      sessionId: 'cos_test_123',
      status: 'requires_payment',
      eventCreated: 1_700_000_200,
      signatureVerified: true,
      applied: true,
    });
    expect(Object.keys(recorded ?? {}).sort()).toEqual([
      'applied',
      'eventCreated',
      'eventId',
      'processedAt',
      'sessionId',
      'signatureVerified',
      'status',
      'type',
    ]);

    const writesAfterFirst = getMemoryDb().counters.writes;
    const duplicate = await receiveWebhook(signedRequest(body, sign(body)));
    expect(duplicate.status).toBe(200);
    expect(getMemoryDb().counters.writes).toBe(writesAfterFirst);
    expect(getMemoryDb().webhookEvents.size).toBe(1);
    expect(getMemoryDb().sessions.get('cos_test_123')?.statusHistory).toHaveLength(1);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(loggedText()).not.toContain(WEBHOOK_SECRET);
    expect(loggedText()).not.toContain(CLIENT_SECRET);
    expect(loggedText()).not.toContain(WALLET);
  });

  it('sets the completion marker once, keeps it sticky, and will not apply an older non-terminal status', async () => {
    const processing = payload({
      id: 'evt_processing',
      created: 1_700_000_300,
      status: 'fulfillment_processing',
    });
    expect((await receiveWebhook(signedRequest(processing, sign(processing)))).status).toBe(200);

    const olderPayment = payload({
      id: 'evt_old_payment',
      created: 1_700_000_100,
      status: 'requires_payment',
    });
    expect((await receiveWebhook(signedRequest(olderPayment, sign(olderPayment)))).status).toBe(200);
    expect(getMemoryDb().sessions.get('cos_test_123')?.status).toBe('fulfillment_processing');
    expect(getMemoryDb().webhookEvents.get('evt_old_payment')).toMatchObject({ applied: false, signatureVerified: true });

    const complete = payload({
      id: 'evt_complete',
      created: 1_700_000_050,
      status: 'fulfillment_complete',
    });
    expect((await receiveWebhook(signedRequest(complete, sign(complete)))).status).toBe(200);

    const session = getMemoryDb().sessions.get('cos_test_123');
    expect(session?.status).toBe('fulfillment_complete');
    expect(session?.verifiedCompletionEventId).toBe('evt_complete');
    expect(isWebhookEventId(session?.verifiedCompletionEventId)).toBe(true);
    expect(session?.userId).toBeUndefined();

    const laterPayment = payload({
      id: 'evt_late_payment',
      created: 1_700_000_900,
      status: 'requires_payment',
    });
    expect((await receiveWebhook(signedRequest(laterPayment, sign(laterPayment)))).status).toBe(200);

    const secondComplete = payload({
      id: 'evt_complete_again',
      created: 1_700_000_950,
      status: 'fulfillment_complete',
    });
    expect((await receiveWebhook(signedRequest(secondComplete, sign(secondComplete)))).status).toBe(200);

    const finalSession = getMemoryDb().sessions.get('cos_test_123');
    expect(finalSession?.status).toBe('fulfillment_complete');
    expect(finalSession?.verifiedCompletionEventId).toBe('evt_complete');
    expect(finalSession?.statusHistory).toEqual([
      expect.objectContaining({ eventId: 'evt_processing', status: 'fulfillment_processing' }),
      expect.objectContaining({ eventId: 'evt_complete', status: 'fulfillment_complete' }),
    ]);
    expect(getMemoryDb().webhookEvents.get('evt_complete')).toMatchObject({
      applied: true,
      signatureVerified: true,
      status: 'fulfillment_complete',
      sessionId: 'cos_test_123',
    });
    expect(getMemoryDb().webhookEvents.get('evt_complete_again')).toMatchObject({ applied: false });
    expect(getMemoryDb().webhookEvents.get('evt_late_payment')).toMatchObject({ applied: false });
  });

  it('does not change session status for another event type or an unsafe status', async () => {
    getMemoryDb().sessions.set('cos_test_123', {
      sessionId: 'cos_test_123',
      userId: 'user-1',
      status: 'requires_payment',
    });

    const other = payload({ id: 'evt_other', type: 'payment_intent.succeeded', status: 'fulfillment_complete' });
    const otherResponse = await receiveWebhook(signedRequest(other, sign(other)));
    expect(otherResponse.status).toBe(200);
    expect(getMemoryDb().webhookEvents.size).toBe(0);
    expect(getMemoryDb().sessions.get('cos_test_123')?.status).toBe('requires_payment');

    const badStatus = payload({ id: 'evt_bad', status: 'fulfillment_complete/../x' });
    const badResponse = await receiveWebhook(signedRequest(badStatus, sign(badStatus)));
    expect(badResponse.status).toBe(200);
    expect(getMemoryDb().sessions.get('cos_test_123')?.status).toBe('requires_payment');
    expect(getMemoryDb().sessions.get('cos_test_123')?.verifiedCompletionEventId).toBeUndefined();
    expect(getMemoryDb().webhookEvents.size).toBe(0);
  });
});

describe('first-purchase email gate', () => {
  const verifiedEvent = {
    signatureVerified: true,
    applied: true,
    type: 'crypto.onramp_session.updated',
    status: 'fulfillment_complete',
    sessionId: 'cos_test_123',
  };

  it('allows email only for a new verified completion on that session', () => {
    expect(verifiedCompletionAllowsEmail({
      sessionId: 'cos_test_123',
      beforeMarker: undefined,
      afterMarker: 'evt_complete',
      afterStatus: 'fulfillment_complete',
      event: verifiedEvent,
    })).toBe(true);

    expect(verifiedCompletionAllowsEmail({
      sessionId: 'cos_test_123',
      beforeMarker: 'evt_complete',
      afterMarker: 'evt_complete',
      afterStatus: 'fulfillment_complete',
      event: verifiedEvent,
    })).toBe(false);

    expect(verifiedCompletionAllowsEmail({
      sessionId: 'cos_test_123',
      beforeMarker: undefined,
      afterMarker: 'evt_complete',
      afterStatus: 'requires_payment',
      event: verifiedEvent,
    })).toBe(false);

    expect(verifiedCompletionAllowsEmail({
      sessionId: 'cos_test_123',
      beforeMarker: undefined,
      afterMarker: 'evt_complete',
      afterStatus: 'fulfillment_complete',
      event: { ...verifiedEvent, signatureVerified: false },
    })).toBe(false);

    expect(verifiedCompletionAllowsEmail({
      sessionId: 'cos_test_123',
      beforeMarker: undefined,
      afterMarker: 'evt_complete',
      afterStatus: 'fulfillment_complete',
      event: { ...verifiedEvent, applied: false },
    })).toBe(false);

    expect(verifiedCompletionAllowsEmail({
      sessionId: 'cos_other',
      beforeMarker: undefined,
      afterMarker: 'evt_complete',
      afterStatus: 'fulfillment_complete',
      event: verifiedEvent,
    })).toBe(false);

    expect(verifiedCompletionAllowsEmail({
      sessionId: 'cos_test_123',
      beforeMarker: undefined,
      afterMarker: 'evt/complete',
      afterStatus: 'fulfillment_complete',
      event: verifiedEvent,
    })).toBe(false);

    expect(verifiedCompletionAllowsEmail({
      sessionId: 'cos_test_123',
      beforeMarker: undefined,
      afterMarker: 'evt_complete',
      afterStatus: 'fulfillment_complete',
      event: undefined,
    })).toBe(false);
  });
});
