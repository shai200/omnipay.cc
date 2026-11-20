import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { getOwnedProfile, updateOwnedProfile } from '@/lib/db/profile-store';
import { parseProfilePatch } from '@/lib/profile';
import { getRequestUserId } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const userId = await getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  try {
    const profile = await getOwnedProfile(getDb(), userId);
    return NextResponse.json({ profile });
  } catch {
    console.error('Failed to load profile');
    return NextResponse.json({ error: 'Unable to load profile.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const userId = await getRequestUserId(request);
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid profile.' }, { status: 400 });
  }

  const parsed = parseProfilePatch(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }

  try {
    const profile = await updateOwnedProfile(getDb(), userId, parsed.patch);
    if (!profile) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }
    return NextResponse.json({ profile });
  } catch {
    console.error('Failed to update profile');
    return NextResponse.json({ error: 'Unable to save profile.' }, { status: 500 });
  }
}
