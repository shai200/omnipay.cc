import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, status, transactionDetails, timestamp } = body;

    if (!sessionId || !status) {
      return NextResponse.json(
        { error: 'sessionId and status are required' },
        { status: 400 }
      );
    }

    // Get user ID from auth token if available
    const authHeader = request.headers.get('authorization');
    let userId = null;
    
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const { default: admin } = await import('firebase-admin');
        const decodedToken = await admin.auth().verifyIdToken(token);
        userId = decodedToken.uid;
      } catch (error) {
        console.log('No valid auth token, tracking as anonymous');
      }
    }

    // Create event record
    const eventData = {
      sessionId,
      status,
      userId,
      transactionDetails: transactionDetails || {},
      timestamp: timestamp || new Date().toISOString(),
      createdAt: FieldValue.serverTimestamp(),
    };

    // Store in onramp_events collection
    await adminDb.collection('onramp_events').add(eventData);

    // Also update/create session document for easier querying
    const sessionRef = adminDb.collection('onramp_sessions').doc(sessionId);
    const sessionDoc = await sessionRef.get();

    if (sessionDoc.exists) {
      // Update existing session
      await sessionRef.update({
        status,
        lastStatus: status,
        lastUpdated: FieldValue.serverTimestamp(),
        transactionDetails: transactionDetails || {},
        statusHistory: FieldValue.arrayUnion({
          status,
          timestamp: timestamp || new Date().toISOString(),
        }),
      });
    } else {
      // Create new session record
      await sessionRef.set({
        sessionId,
        userId,
        status,
        lastStatus: status,
        createdAt: FieldValue.serverTimestamp(),
        lastUpdated: FieldValue.serverTimestamp(),
        transactionDetails: transactionDetails || {},
        statusHistory: [{
          status,
          timestamp: timestamp || new Date().toISOString(),
        }],
      });
    }

    console.log(`Tracked onramp event: ${sessionId} -> ${status}`);

    return NextResponse.json({ 
      success: true,
      sessionId,
      status,
    });
  } catch (error: any) {
    console.error('Error tracking onramp event:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to track event' },
      { status: 500 }
    );
  }
}
