import { beforeEach, describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { profiles, user } from '@/lib/db/schema';
import { createCredentialUser, resetTestData } from '../../test/db';

describe('email sign-up', () => {
  beforeEach(async () => {
    await resetTestData();
  });

  it('creates the user, a session and a profile', async () => {
    const db = await resetTestData();
    const { getAuth } = await import('@/lib/auth');
    const response = await getAuth().api.signUpEmail({
      body: { email: 'new-person@example.com', password: 'a-long-password', name: 'New Person' },
      asResponse: true,
    });
    expect(response.status).toBe(200);
    expect(response.headers.getSetCookie().some((cookie) => cookie.includes('session_token'))).toBe(true);

    const [created] = await db.select().from(user).where(eq(user.email, 'new-person@example.com'));
    expect(created).toBeDefined();
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, created!.id));
    expect(profile?.firstName).toBe('New');
  }, 15000);

  it('still refuses a session for a disabled user', async () => {
    await createCredentialUser({ id: 'disabled-1', email: 'off@example.com', password: 'a-long-password', disabled: true });
    const { getAuth } = await import('@/lib/auth');
    const response = await getAuth().api.signInEmail({
      body: { email: 'off@example.com', password: 'a-long-password' },
      asResponse: true,
    });
    expect(response.ok).toBe(false);
  });
});
