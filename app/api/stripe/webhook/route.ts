import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase-admin';
import {
  WEBHOOK_EVENTS_COLLECTION,
  decideSessionWrite,
  parseOnrampWebhookEvent,
} from '@/lib/onramp-webhook';

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

  // Signature verification needs the exact bytes Stripe signed.
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
  const eventRef = adminDb.collection(WEBHOOK_EVENTS_COLLECTION).doc(update.eventId);
  const sessionRef = adminDb.collection('onramp_sessions').doc(update.sessionId);

  let outcome: { duplicate: boolean; applied: boolean };
  try {
    outcome = await adminDb.runTransaction(async (tx) => {
      const eventSnap = await tx.get(eventRef);
      const sessionSnap = await tx.get(sessionRef);
      if (eventSnap.exists) {
        return { duplicate: true, applied: false };
      }

      const data = sessionSnap.exists ? sessionSnap.data() : undefined;
      const decision = decideSessionWrite(
        data
          ? {
              status: data.status,
              statusEventCreated: data.statusEventCreated,
              verifiedCompletionEventId: data.verifiedCompletionEventId,
              transactionDetails: data.transactionDetails,
            }
          : undefined,
        update,
      );

      tx.set(eventRef, {
        eventId: update.eventId,
        type: update.eventType,
        sessionId: update.sessionId,
        status: update.status,
        eventCreated: update.eventCreated,
        signatureVerified: true,
        applied: decision.action === 'apply',
        processedAt: FieldValue.serverTimestamp(),
      });

      if (decision.action === 'skip') {
        return { duplicate: false, applied: false };
      }

      const fields = {
        status: decision.status,
        lastStatus: decision.status,
        lastUpdated: FieldValue.serverTimestamp(),
        statusEventCreated: decision.statusEventCreated,
        statusEventId: decision.statusEventId,
        transactionDetails: decision.transactionDetails,
        statusHistory: FieldValue.arrayUnion(decision.historyEntry),
        ...(decision.completionEventId
          ? { verifiedCompletionEventId: decision.completionEventId }
          : {}),
      };

      if (sessionSnap.exists) {
        tx.update(sessionRef, fields);
      } else {
        tx.set(sessionRef, {
          sessionId: update.sessionId,
          createdAt: FieldValue.serverTimestamp(),
          ...fields,
        });
      }

      return { duplicate: false, applied: true };
    });
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
