import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getAuth } from '@/lib/auth';
import { createCredentialUser, resetTestData } from '../../test/db';

const EMAIL = 'reset-me@example.com';

async function requestReset(email: string): Promise<number> {
  const response = await getAuth().api.requestPasswordReset({
    body: { email, redirectTo: '/auth/reset' },
    asResponse: true,
  });
  return response.status;
}

describe('password reset request', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;
  const savedKey = process.env.SENDGRID_API_KEY;

  beforeEach(async () => {
    await resetTestData();
    delete process.env.SENDGRID_API_KEY;
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await createCredentialUser({ id: 'reset-user', email: EMAIL, password: 'correct-horse-battery' });
  });

  afterEach(() => {
    errorSpy.mockRestore();
    if (savedKey === undefined) delete process.env.SENDGRID_API_KEY;
    else process.env.SENDGRID_API_KEY = savedKey;
  });

  it('answers the same for a known and an unknown address when mail cannot be sent', async () => {
    const known = await requestReset(EMAIL);
    const unknown = await requestReset('nobody@example.com');
    expect(known).toBe(200);
    expect(unknown).toBe(200);
  });
});
