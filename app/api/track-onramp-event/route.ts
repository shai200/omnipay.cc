import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase-admin';
import { isSafeSessionId } from '@/lib/onramp-request';
import { verifyBearerUid } from '@/lib/verify-bearer-uid';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const STATUS_PATTERN = /^[a-z0-9_]{1,64}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function eventTimestamp(value: unknown): string {
  if (typeof value === 'string' && value.length > 0 && value.length <= 40 && !/[\u0000-\u001f\u007f]/.test(value)) {
    return value;
  }
  return new Date().toISOString();
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

  const record = isRecord(body) ? body : {};
  const sessionId = record.sessionId;
  const status = record.status;
  if (!isSafeSessionId(sessionId) || typeof status !== 'string' || !STATUS_PATTERN.test(status)) {
    return NextResponse.json({ error: 'sessionId and status are required' }, { status: 400 });
  }

  const transactionDetails = isRecord(record.transactionDetails) ? record.transactionDetails : {};
  const timestamp = eventTimestamp(record.timestamp);
  const sessionRef = adminDb.collection('onramp_sessions').doc(sessionId);

  let outcome: 'ok' | 'forbidden';
  try {
    outcome = await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(sessionRef);
      if (snap.exists && snap.data()?.userId !== uid) {
        return 'forbidden';
      }

      if (snap.exists) {
        tx.update(sessionRef, {
          status,
          lastStatus: status,
          lastUpdated: FieldValue.serverTimestamp(),
          transactionDetails,
          statusHistory: FieldValue.arrayUnion({ status, timestamp }),
        });
      } else {
        tx.set(sessionRef, {
          sessionId,
          userId: uid,
          status,
          lastStatus: status,
          createdAt: FieldValue.serverTimestamp(),
          lastUpdated: FieldValue.serverTimestamp(),
          transactionDetails,
          statusHistory: [{ status, timestamp }],
        });
      }

      tx.set(adminDb.collection('onramp_events').doc(), {
        sessionId,
        status,
        userId: uid,
        transactionDetails,
        timestamp,
        createdAt: FieldValue.serverTimestamp(),
      });
      return 'ok';
    });
  } catch {
    console.error('Failed to record onramp status');
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }

  if (outcome === 'forbidden') {
    return NextResponse.json({ error: 'You do not have access to this session.' }, { status: 403 });
  }

  return NextResponse.json({ success: true, sessionId, status });
}
