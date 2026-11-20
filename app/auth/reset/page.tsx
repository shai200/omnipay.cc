'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { authClient } from '@/lib/auth/client';

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token') ?? '';
  const linkError = params.get('error');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(linkError ? 'This reset link is invalid or expired.' : '');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!token) {
      setError('This reset link is invalid or expired.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await authClient.resetPassword({ newPassword: password, token });
      if (result.error) {
        setError('This reset link is invalid or expired.');
        return;
      }
      router.push('/auth/login');
    } catch {
      setError('This reset link is invalid or expired.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }} htmlFor="password">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          maxLength={128}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg border px-3 py-2"
          style={{ backgroundColor: 'var(--background)', borderColor: 'var(--card-border)' }}
        />
      </div>
      {error && <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>}
      <button
        type="submit"
        disabled={submitting || !token}
        className="w-full rounded-lg px-4 py-2 text-white font-semibold disabled:opacity-50"
        style={{ backgroundColor: 'var(--accent)' }}
      >
        {submitting ? 'Please wait...' : 'Save password'}
      </button>
      <a href="/auth/login" className="block text-sm text-center" style={{ color: 'var(--accent)' }}>
        Back to sign in
      </a>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="container mx-auto px-4 py-12">
        <div
          className="max-w-2xl mx-auto rounded-2xl border p-8"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
        >
          <h1 className="text-2xl font-semibold mb-6" style={{ color: 'var(--foreground)' }}>
            Choose a new password
          </h1>
          <Suspense fallback={<p style={{ color: 'var(--text-secondary)' }}>Loading...</p>}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
