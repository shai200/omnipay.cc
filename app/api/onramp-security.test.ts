import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
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

import { POST as createSession } from './onramp-session/route';
import { POST as trackEvent } from './track-onramp-event/route';

const BTC = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4';
const ETH = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
const EMAIL = 'pii-check@example.com';
const WALLET = BTC;
const CLIENT_SECRET = 'cs_test_secret_value';
const STRIPE_KEY = 'sk_test_example';

function postJson(path: string, body: unknown, token?: string) {
  const headers = new Headers({ 'content-type': 'application/json' });
  if (token) headers.set('authorization', token);
  return new NextRequest(new URL(path, 'http://localhost'), {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}

function adultProfile() {
  return {
    email: EMAIL,
    first_name: 'Firstnamezz',
    last_name: 'Lastnamezz',
    dob: { year: 1990, month: 1, day: 15 },
    address: { line1: 'Secretstreet 42', city: 'London', country: 'GB' },
  };
}

describe('onramp auth, age gate, and wallet routing', () => {
  const fetchMock = vi.fn();
  let logSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    getMemoryDb().reset();
    process.env.STRIPE_SECRET_KEY = STRIPE_KEY;
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 'cos_test_123', client_secret: CLIENT_SECRET, status: 'initialized' }),
    });
    getMemoryDb().auth.verifyIdToken.mockImplementation(async (token: string) => {
      if (token !== 'valid-token') throw new Error('invalid');
      return { uid: 'user-1' };
    });
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
    vi.unstubAllGlobals();
  });

  function loggedText() {
    return [...logSpy.mock.calls, ...errorSpy.mock.calls]
      .flat()
      .map((part) => (typeof part === 'string' ? part : JSON.stringify(part)))
      .join('\n');
  }

  it('rejects a missing or invalid Firebase ID token', async () => {
    const missing = await createSession(postJson('/api/onramp-session', { userId: 'user-1' }));
    expect(missing.status).toBe(401);

    const basic = await createSession(postJson('/api/onramp-session', {}, 'Basic abc'));
    expect(basic.status).toBe(401);

    const invalid = await createSession(postJson('/api/onramp-session', {}, 'Bearer stolen-token'));
    expect(invalid.status).toBe(401);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(getMemoryDb().reads).toHaveLength(0);
  });

  it('uses the token uid, blocks underage and missing DOB, and does not call Stripe', async () => {
    getMemoryDb().users.set('user-1', { dob: { year: 2015, month: 6, day: 1 }, email: EMAIL });
    const underage = await createSession(postJson('/api/onramp-session', {
      userId: 'someone-else',
      walletAddress: BTC,
      destinationCurrency: 'btc',
      destinationNetwork: 'bitcoin',
    }, 'Bearer valid-token'));
    expect(underage.status).toBe(403);
    expect(await underage.json()).toEqual({
      error: 'You must be at least 18 years old to use this service.',
    });

    getMemoryDb().users.set('user-1', { email: EMAIL });
    const missingDob = await createSession(postJson('/api/onramp-session', {}, 'Bearer valid-token'));
    expect(missingDob.status).toBe(400);
    expect(await missingDob.json()).toEqual({ error: 'A valid date of birth is required.' });

    getMemoryDb().users.set('user-1', { dob: { year: 1990, month: 2, day: 31 } });
    const invalidDob = await createSession(postJson('/api/onramp-session', {}, 'Bearer valid-token'));
    expect(invalidDob.status).toBe(400);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(getMemoryDb().sessions.size).toBe(0);
    expect(getMemoryDb().reads.every((read) => read === 'users/user-1')).toBe(true);
  });

  it('creates a session for an adult and sends a BTC address as bitcoin, without logging PII', async () => {
    getMemoryDb().users.set('user-1', adultProfile());
    getMemoryDb().users.set('someone-else', { dob: { year: 2010, month: 1, day: 1 } });

    const response = await createSession(postJson('/api/onramp-session', {
      userId: 'someone-else',
      walletAddress: WALLET,
      sourceAmount: 100,
      sourceCurrency: 'usd',
      destinationCurrency: 'btc',
      destinationNetwork: 'bitcoin',
    }, 'Bearer valid-token'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      clientSecret: CLIENT_SECRET,
      sessionId: 'cos_test_123',
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.stripe.com/v1/crypto/onramp_sessions');
    expect(init.headers).toMatchObject({ Authorization: `Bearer ${STRIPE_KEY}` });
    const params = new URLSearchParams(String(init.body));
    expect(params.get('wallet_addresses[bitcoin]')).toBe(WALLET);
    expect(params.get('wallet_addresses[ethereum]')).toBeNull();
    expect(params.get('destination_network')).toBe('bitcoin');
    expect(params.get('customer_information[email]')).toBe(EMAIL);
    expect(params.get('customer_information[first_name]')).toBe('Firstnamezz');
    expect(params.get('customer_information[address][line1]')).toBe('Secretstreet 42');
    expect(params.get('customer_information[dob][year]')).toBe('1990');

    const created = getMemoryDb().sessions.get('cos_test_123');
    expect(created?.userId).toBe('user-1');
    expect(created?.status).toBeUndefined();
    expect(created?.verifiedCompletionEventId).toBeUndefined();
    expect(getMemoryDb().reads).not.toContain('users/someone-else');

    const logs = loggedText();
    for (const secret of [EMAIL, 'Firstnamezz', 'Lastnamezz', 'Secretstreet 42', WALLET, STRIPE_KEY, CLIENT_SECRET]) {
      expect(logs).not.toContain(secret);
    }
  });

  it('does not store fulfillment_complete from the Stripe create response', async () => {
    getMemoryDb().users.set('user-1', adultProfile());
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        id: 'cos_test_123',
        client_secret: CLIENT_SECRET,
        status: 'fulfillment_complete',
      }),
    });

    const response = await createSession(postJson('/api/onramp-session', {
      walletAddress: WALLET,
      destinationCurrency: 'btc',
      destinationNetwork: 'bitcoin',
    }, 'Bearer valid-token'));

    expect(response.status).toBe(200);
    const session = getMemoryDb().sessions.get('cos_test_123');
    expect(session?.userId).toBe('user-1');
    expect(session?.status).toBeUndefined();
    expect(session?.lastStatus).toBeUndefined();
    expect(session?.verifiedCompletionEventId).toBeUndefined();
    expect(getMemoryDb().webhookEvents.size).toBe(0);
  });

  it('attaches the owner without overwriting a webhook status', async () => {
    getMemoryDb().users.set('user-1', adultProfile());
    getMemoryDb().sessions.set('cos_test_123', {
      sessionId: 'cos_test_123',
      status: 'fulfillment_complete',
      verifiedCompletionEventId: 'evt_real',
      statusHistory: [{ status: 'fulfillment_complete', eventId: 'evt_real' }],
    });

    const response = await createSession(postJson('/api/onramp-session', {}, 'Bearer valid-token'));
    expect(response.status).toBe(200);

    const session = getMemoryDb().sessions.get('cos_test_123');
    expect(session?.userId).toBe('user-1');
    expect(session?.status).toBe('fulfillment_complete');
    expect(session?.verifiedCompletionEventId).toBe('evt_real');
    expect(session?.statusHistory).toEqual([{ status: 'fulfillment_complete', eventId: 'evt_real' }]);
  });

  it('rejects an ethereum address when the purchase network is bitcoin', async () => {
    getMemoryDb().users.set('user-1', adultProfile());
    const response = await createSession(postJson('/api/onramp-session', {
      walletAddress: ETH,
      destinationCurrency: 'btc',
      destinationNetwork: 'bitcoin',
    }, 'Bearer valid-token'));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: 'Wallet address does not match the destination network.',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('track-onramp-event cannot write purchase status', () => {
  beforeEach(() => {
    getMemoryDb().reset();
    getMemoryDb().auth.verifyIdToken.mockImplementation(async (token: string) => {
      if (token === 'owner-token') return { uid: 'owner' };
      throw new Error('invalid');
    });
  });

  it('rejects client status posts and does not create or update a session', async () => {
    getMemoryDb().sessions.set('cos_victim', {
      sessionId: 'cos_victim',
      userId: 'owner',
      status: 'requires_payment',
      statusHistory: [],
    });

    const anonymous = await trackEvent(postJson('/api/track-onramp-event', {
      sessionId: 'cos_victim',
      status: 'fulfillment_complete',
    }));
    expect(anonymous.status).toBe(403);
    expect(await anonymous.json()).toEqual({
      error: 'Purchase status cannot be set from the client.',
    });

    const owner = await trackEvent(postJson('/api/track-onramp-event', {
      sessionId: 'cos_victim',
      status: 'fulfillment_complete',
      userId: 'owner',
      transactionDetails: { source_amount: '100.00' },
    }, 'Bearer owner-token'));
    expect(owner.status).toBe(403);

    const createAttempt = await trackEvent(postJson('/api/track-onramp-event', {
      sessionId: 'cos_new',
      status: 'fulfillment_complete',
      userId: 'victim',
    }, 'Bearer owner-token'));
    expect(createAttempt.status).toBe(403);

    expect(getMemoryDb().sessions.get('cos_victim')).toMatchObject({
      userId: 'owner',
      status: 'requires_payment',
    });
    expect(getMemoryDb().sessions.get('cos_victim')?.verifiedCompletionEventId).toBeUndefined();
    expect(getMemoryDb().sessions.has('cos_new')).toBe(false);
    expect(getMemoryDb().events.size).toBe(0);
    expect(getMemoryDb().webhookEvents.size).toBe(0);
  });
});
