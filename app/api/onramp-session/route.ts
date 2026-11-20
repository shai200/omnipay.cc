import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { dobEligibility } from '@/lib/age';
import { appendCustomerInformation } from '@/lib/customer-prefill';
import { adminDb } from '@/lib/firebase-admin';
import { isSafeSessionId, resolveOnrampRequest } from '@/lib/onramp-request';
import { verifyBearerUid } from '@/lib/verify-bearer-uid';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STRIPE_ONRAMP_URL = 'https://api.stripe.com/v1/crypto/onramp_sessions';

type SessionWrite = 'ok' | 'conflict';

async function recordSessionOwner(
  uid: string,
  sessionId: string,
  status: string,
): Promise<SessionWrite> {
  const ref = adminDb.collection('onramp_sessions').doc(sessionId);
  return adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (snap.exists) {
      const owner = snap.data()?.userId;
      if (typeof owner === 'string' && owner !== uid) {
        return 'conflict';
      }
      if (typeof owner !== 'string') {
        tx.update(ref, {
          userId: uid,
          lastUpdated: FieldValue.serverTimestamp(),
        });
      }
      return 'ok';
    }

    tx.set(ref, {
      sessionId,
      userId: uid,
      status,
      lastStatus: status,
      createdAt: FieldValue.serverTimestamp(),
      lastUpdated: FieldValue.serverTimestamp(),
      transactionDetails: {},
      statusHistory: [],
    });
    return 'ok';
  });
}

function checkoutError(status: number) {
  return NextResponse.json({ error: 'Unable to start checkout. Please try again.' }, { status });
}

function stripeOnrampUnavailable(errorData: unknown): boolean {
  if (!errorData || typeof errorData !== 'object') return false;
  const message = (errorData as { error?: { message?: unknown } }).error?.message;
  return typeof message === 'string' && /crypto onramp is not enabled/i.test(message);
}

export async function POST(request: NextRequest) {
  const uid = await verifyBearerUid(request);
  if (!uid) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const resolved = resolveOnrampRequest(body);
  if (!resolved.ok) {
    return NextResponse.json({ error: resolved.error }, { status: 400 });
  }

  let profile: Record<string, unknown> | undefined;
  try {
    const userDoc = await adminDb.collection('users').doc(uid).get();
    profile = userDoc.exists ? (userDoc.data() as Record<string, unknown>) : undefined;
  } catch {
    console.error('Failed to load user profile for onramp session');
    return checkoutError(500);
  }

  const eligibility = dobEligibility(profile?.dob);
  if (!eligibility.ok) {
    return NextResponse.json(
      { error: eligibility.error },
      { status: eligibility.reason === 'underage' ? 403 : 400 },
    );
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    console.error('STRIPE_SECRET_KEY is not configured');
    return checkoutError(500);
  }

  const formData = new URLSearchParams();
  if (resolved.walletAddress && resolved.destinationNetwork) {
    formData.append(`wallet_addresses[${resolved.destinationNetwork}]`, resolved.walletAddress);
  }
  if (resolved.sourceAmount) formData.append('source_amount', resolved.sourceAmount);
  if (resolved.sourceCurrency) formData.append('source_currency', resolved.sourceCurrency);
  if (resolved.destinationCurrency) formData.append('destination_currency', resolved.destinationCurrency);
  if (resolved.destinationNetwork) formData.append('destination_network', resolved.destinationNetwork);
  appendCustomerInformation(formData, profile, eligibility.dob);

  let response: Response;
  try {
    response = await fetch(STRIPE_ONRAMP_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Stripe-Version': '2024-11-20.acacia',
      },
      body: formData.toString(),
    });
  } catch {
    console.error('Stripe onramp session request could not be sent');
    return checkoutError(502);
  }

  if (!response.ok) {
    let errorData: unknown = null;
    try {
      errorData = await response.json();
    } catch {
      errorData = null;
    }
    const stripeError =
      errorData && typeof errorData === 'object'
        ? (errorData as { error?: { type?: unknown; code?: unknown } }).error
        : undefined;
    console.error('Stripe onramp session request failed', {
      status: response.status,
      type: typeof stripeError?.type === 'string' ? stripeError.type : undefined,
      code: typeof stripeError?.code === 'string' ? stripeError.code : undefined,
    });
    if (stripeOnrampUnavailable(errorData)) {
      return NextResponse.json(
        { error: 'Crypto purchases are currently unavailable. Please try again later.' },
        { status: 502 },
      );
    }
    return checkoutError(502);
  }

  let session: { id?: unknown; client_secret?: unknown; status?: unknown };
  try {
    session = await response.json();
  } catch {
    console.error('Stripe onramp session response was not valid JSON');
    return checkoutError(502);
  }

  if (typeof session.client_secret !== 'string' || !isSafeSessionId(session.id)) {
    console.error('Stripe onramp session response was missing expected fields');
    return checkoutError(502);
  }

  const status = typeof session.status === 'string' && session.status.length <= 64
    ? session.status
    : 'initialized';

  try {
    const write = await recordSessionOwner(uid, session.id, status);
    if (write === 'conflict') {
      console.error('Onramp session id is already owned by another user');
      return NextResponse.json({ error: 'Unable to start checkout. Please try again.' }, { status: 403 });
    }
  } catch {
    console.error('Failed to record onramp session owner');
    return checkoutError(500);
  }

  console.log('Onramp session created', {
    sessionId: session.id,
    uid,
    network: resolved.destinationNetwork,
    walletAttached: Boolean(resolved.walletAddress),
  });

  return NextResponse.json({
    clientSecret: session.client_secret,
    sessionId: session.id,
  });
}
