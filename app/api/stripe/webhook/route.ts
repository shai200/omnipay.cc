import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getDb } from '@/lib/db/client';
import { applyVerifiedOnrampUpdate } from '@/lib/db/onramp-store';
import { parseOnrampWebhookEvent } from '@/lib/onramp-webhook';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function webhookSecret(): string | null {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (typeof secret !== 'string' || secret.trim().length === 0) return null;
  return secret;
}

export async function POST(request: NextRequest) {
  const secret = webhookSecret();
  if (!secret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json({ error: 'Webhook is not configured.' }, { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  const payload = await request.text();
  let event: unknown;
  try {
    event = Stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    if (error instanceof Stripe.errors.StripeSignatureVerificationError || error instanceof SyntaxError) {
      console.error('Stripe webhook signature verification failed');
      return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
    }
    console.error('Stripe webhook verification could not run');
    return NextResponse.json({ error: 'Webhook verification failed.' }, { status: 500 });
  }

  const parsed = parseOnrampWebhookEvent(event);
  if (!parsed.ok) {
    if (parsed.reason !== 'ignored_type') {
      console.error('Onramp webhook ignored', { reason: parsed.reason });
    }
    return NextResponse.json({ received: true });
  }

  const update = parsed.update;
  let outcome: { duplicate: boolean; applied: boolean };
  try {
    outcome = await applyVerifiedOnrampUpdate(getDb(), update);
  } catch {
    console.error('Failed to record onramp webhook', { eventId: update.eventId });
    return NextResponse.json({ error: 'Failed to record onramp status.' }, { status: 500 });
  }

  console.log('Onramp webhook processed', {
    eventId: update.eventId,
    sessionId: update.sessionId,
    status: update.status,
    duplicate: outcome.duplicate,
    applied: outcome.applied,
  });

  return NextResponse.json({ received: true });
}
