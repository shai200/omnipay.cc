import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Purchase status is stored only from a signature-verified Stripe webhook.
// This route used to let a signed-in client write onramp_sessions.status,
// including fulfillment_complete, which triggered the first-purchase email.
// The body is ignored. Nothing here is persisted.
export async function POST(request: NextRequest) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed.' }, { status: 405 });
  }
  return NextResponse.json(
    { error: 'Purchase status cannot be set from the client.' },
    { status: 403 },
  );
}
