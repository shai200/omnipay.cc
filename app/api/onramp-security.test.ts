import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import { onrampSessions, profiles, user, webhookEvents } from '@/lib/db/schema';
import { createCredentialUser, openTestDatabase, resetTestData, signInCookie } from '../../test/db';

import { POST as createSession } from './onramp-session/route';
import { POST as trackEvent } from './track-onramp-event/route';
import { PUT as updateProfile } from './profile/route';

const BTC = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4';
const ETH = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
const EMAIL = 'pii-check@example.com';
const WALLET = BTC;
const CLIENT_SECRET = 'cs_test_secret_value';
const STRIPE_KEY = 'sk_test_example';
const PASSWORD = 'correct-horse-battery';

function postJson(path: string, body: unknown, cookie?: string) {
  const headers = new Headers({ 'content-type': 'application/json' });
  if (cookie) headers.set('cookie', cookie);
  return new NextRequest(new URL(path, 'http://localhost'), {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}

describe('onramp auth, age gate, and wallet routing', () => {
  const fetchMock = vi.fn();
  let logSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;
  let cookie = '';

  beforeEach(async () => {
    await resetTestData();
    process.env.STRIPE_SECRET_KEY = STRIPE_KEY;
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 'cos_test_123', client_secret: CLIENT_SECRET, status: 'initialized' }),
    });
    await createCredentialUser({
      id: 'user-1',
      email: EMAIL,
      password: PASSWORD,
      firstName: 'Firstnamezz',
      lastName: 'Lastnamezz',
      dob: { year: 1990, month: 1, day: 15 },
    });
    const db = await openTestDatabase();
    await db.update(profiles).set({
      addressLine1: 'Secretstreet 42',
      addressCity: 'London',
      addressCountry: 'GB',
    }).where(eq(profiles.userId, 'user-1'));
    cookie = await signInCookie(EMAIL, PASSWORD);
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

  it('rejects a missing or invalid session', async () => {
    const missing = await createSession(postJson('/api/onramp-session', { userId: 'user-1' }));
    expect(missing.status).toBe(401);

    const invalid = await createSession(postJson('/api/onramp-session', {}, 'better-auth.session_token=stolen'));
    expect(invalid.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('uses the session user, blocks underage and missing DOB, and does not call Stripe', async () => {
    const db = await openTestDatabase();
    await db.update(profiles).set({ dobYear: 2015, dobMonth: 6, dobDay: 1 }).where(eq(profiles.userId, 'user-1'));
    const underage = await createSession(postJson('/api/onramp-session', {
      userId: 'someone-else',
      walletAddress: BTC,
      destinationCurrency: 'btc',
      destinationNetwork: 'bitcoin',
    }, cookie));
    expect(underage.status).toBe(403);
    expect(await underage.json()).toEqual({
      error: 'You must be at least 18 years old to use this service.',
    });

    await db.update(profiles).set({ dobYear: null, dobMonth: null, dobDay: null }).where(eq(profiles.userId, 'user-1'));
    const missingDob = await createSession(postJson('/api/onramp-session', {}, cookie));
    expect(missingDob.status).toBe(400);
    expect(await missingDob.json()).toEqual({ error: 'A valid date of birth is required.' });

    await db.update(profiles).set({ dobYear: 1990, dobMonth: 2, dobDay: 31 }).where(eq(profiles.userId, 'user-1'));
    const invalidDob = await createSession(postJson('/api/onramp-session', {}, cookie));
    expect(invalidDob.status).toBe(400);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(await db.select().from(onrampSessions)).toHaveLength(0);
  });

  it('creates a session for an adult and sends a BTC address as bitcoin, without logging PII', async () => {
    await createCredentialUser({
      id: 'someone-else',
      email: 'other@example.com',
      password: PASSWORD,
      dob: { year: 2010, month: 1, day: 1 },
    });

    const response = await createSession(postJson('/api/onramp-session', {
      userId: 'someone-else',
      walletAddress: WALLET,
      sourceAmount: 100,
      sourceCurrency: 'usd',
      destinationCurrency: 'btc',
      destinationNetwork: 'bitcoin',
    }, cookie));

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

    const db = await openTestDatabase();
    const [created] = await db.select().from(onrampSessions).where(eq(onrampSessions.id, 'cos_test_123'));
    expect(created?.userId).toBe('user-1');
    expect(created?.status).toBeNull();
    expect(created?.verifiedCompletionEventId).toBeNull();

    const logs = loggedText();
    for (const secret of [EMAIL, 'Firstnamezz', 'Lastnamezz', 'Secretstreet 42', WALLET, STRIPE_KEY, CLIENT_SECRET]) {
      expect(logs).not.toContain(secret);
    }
  });

  it('does not store fulfillment_complete from the Stripe create response', async () => {
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
    }, cookie));

    expect(response.status).toBe(200);
    const db = await openTestDatabase();
    const [session] = await db.select().from(onrampSessions).where(eq(onrampSessions.id, 'cos_test_123'));
    expect(session?.userId).toBe('user-1');
    expect(session?.status).toBeNull();
    expect(session?.lastStatus).toBeNull();
    expect(session?.verifiedCompletionEventId).toBeNull();
    expect(await db.select().from(webhookEvents)).toHaveLength(0);
  });

  it('attaches the owner without overwriting a webhook status', async () => {
    const db = await openTestDatabase();
    await db.insert(onrampSessions).values({
      id: 'cos_test_123',
      status: 'fulfillment_complete',
      verifiedCompletionEventId: 'evt_real',
      statusHistory: [{ status: 'fulfillment_complete', eventId: 'evt_real', timestamp: '2020-01-01T00:00:00.000Z' }],
    });

    const response = await createSession(postJson('/api/onramp-session', {}, cookie));
    expect(response.status).toBe(200);

    const [session] = await db.select().from(onrampSessions).where(eq(onrampSessions.id, 'cos_test_123'));
    expect(session?.userId).toBe('user-1');
    expect(session?.status).toBe('fulfillment_complete');
    expect(session?.verifiedCompletionEventId).toBe('evt_real');
    expect(session?.statusHistory).toEqual([{ status: 'fulfillment_complete', eventId: 'evt_real', timestamp: '2020-01-01T00:00:00.000Z' }]);
  });

  it('does not take over a session owned by someone else', async () => {
    const db = await openTestDatabase();
    await db.insert(user).values({
      id: 'other-owner',
      email: 'other-owner@example.com',
      name: 'Other',
      emailVerified: true,
    });
    await db.insert(onrampSessions).values({
      id: 'cos_test_123',
      userId: 'other-owner',
      status: 'requires_payment',
    });

    const response = await createSession(postJson('/api/onramp-session', { userId: 'other-owner' }, cookie));
    expect(response.status).toBe(403);
    const [session] = await db.select().from(onrampSessions).where(eq(onrampSessions.id, 'cos_test_123'));
    expect(session?.userId).toBe('other-owner');
    expect(session?.status).toBe('requires_payment');
  });

  it('rejects an ethereum address when the purchase network is bitcoin', async () => {
    const response = await createSession(postJson('/api/onramp-session', {
      walletAddress: ETH,
      destinationCurrency: 'btc',
      destinationNetwork: 'bitcoin',
    }, cookie));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: 'Wallet address does not match the destination network.',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects a disabled account even when an older session cookie is presented', async () => {
    const db = await openTestDatabase();
    await db.update(user).set({ disabled: true }).where(eq(user.id, 'user-1'));
    const response = await createSession(postJson('/api/onramp-session', {}, cookie));
    expect(response.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('profile updates stay on the signed-in user', () => {
  beforeEach(async () => {
    await resetTestData();
  });

  it('ignores a caller-supplied user id', async () => {
    await createCredentialUser({
      id: 'user-a',
      email: 'a@example.com',
      password: PASSWORD,
      firstName: 'Ada',
    });
    await createCredentialUser({
      id: 'user-b',
      email: 'b@example.com',
      password: PASSWORD,
      firstName: 'Bea',
    });
    const cookie = await signInCookie('a@example.com', PASSWORD);
    const request = new NextRequest(new URL('/api/profile?userId=user-b', 'http://localhost'), {
      method: 'PUT',
      headers: { 'content-type': 'application/json', cookie },
      body: JSON.stringify({ userId: 'user-b', first_name: 'Hacked', wallet_addresses: { bitcoin: 'not-a-wallet' } }),
    });
    const response = await updateProfile(request);
    expect(response.status).toBe(400);

    const db = await openTestDatabase();
    const [owner] = await db.select().from(profiles).where(eq(profiles.userId, 'user-a'));
    const [other] = await db.select().from(profiles).where(eq(profiles.userId, 'user-b'));
    expect(owner?.firstName).toBe('Ada');
    expect(other?.firstName).toBe('Bea');

    const saved = await updateProfile(new NextRequest(new URL('/api/profile', 'http://localhost'), {
      method: 'PUT',
      headers: { 'content-type': 'application/json', cookie },
      body: JSON.stringify({ userId: 'user-b', first_name: 'Ada Updated' }),
    }));
    expect(saved.status).toBe(200);
    const body = await saved.json() as { profile: { first_name?: string; email?: string } };
    expect(body.profile.first_name).toBe('Ada Updated');
    expect(body.profile.email).toBe('a@example.com');
    const [afterOwner] = await db.select().from(profiles).where(eq(profiles.userId, 'user-a'));
    const [afterOther] = await db.select().from(profiles).where(eq(profiles.userId, 'user-b'));
    expect(afterOwner?.firstName).toBe('Ada Updated');
    expect(afterOther?.firstName).toBe('Bea');
  });
});

describe('track-onramp-event cannot write purchase status', () => {
  beforeEach(async () => {
    await resetTestData();
  });

  it('rejects client status posts and does not create or update a session', async () => {
    const db = await openTestDatabase();
    await db.insert(onrampSessions).values({
      id: 'cos_victim',
      userId: null,
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
    }, 'better-auth.session_token=owner'));
    expect(owner.status).toBe(403);

    const [session] = await db.select().from(onrampSessions).where(eq(onrampSessions.id, 'cos_victim'));
    expect(session?.status).toBe('requires_payment');
    expect(session?.verifiedCompletionEventId).toBeNull();
    expect(await db.select().from(onrampSessions)).toHaveLength(1);
    expect(await db.select().from(webhookEvents)).toHaveLength(0);
  });
});
