'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);
    try {
      const result = await authClient.requestPasswordReset({
        email,
        redirectTo: '/auth/reset',
      });
      if (result.error) {
        setError('Password reset could not be started. Try again later.');
        return;
      }
      setMessage('If an account exists for that email, a reset link is on its way.');
    } catch {
      setError('Password reset could not be started. Try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="container mx-auto px-4 py-12">
        <div
          className="max-w-2xl mx-auto rounded-2xl border p-8"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
        >
          <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
            Reset your password
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            We will email a link if an account exists. The link expires in one hour.
          </p>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border px-3 py-2"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--card-border)' }}
              />
            </div>
            {message && (
              <p className="text-sm" style={{ color: 'var(--foreground)' }}>{message}</p>
            )}
            {error && (
              <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg px-4 py-2 text-white font-semibold disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {submitting ? 'Please wait...' : 'Send reset link'}
            </button>
            <a href="/auth/login" className="block text-sm text-center" style={{ color: 'var(--accent)' }}>
              Back to sign in
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}
