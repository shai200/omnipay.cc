'use client';

import Link from 'next/link';
import { useState } from 'react';
import { authClient } from '@/lib/auth/client';
import { Alert } from '../../components/ui/Alert';
import { TextField } from '../../components/ui/Field';
import { AuthShell } from '../AuthShell';

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
    <AuthShell
      title="Reset your password"
      description="We will email a link if an account exists. The link expires in one hour."
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <TextField
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        {message ? <Alert tone="success">{message}</Alert> : null}
        {error ? <Alert tone="danger">{error}</Alert> : null}
        <button type="submit" disabled={submitting} className="btn btn-primary btn-lg btn-block">
          {submitting ? (
            <>
              <span className="spinner" aria-hidden="true" /> Please wait...
            </>
          ) : (
            'Send reset link'
          )}
        </button>
        <p className="text-center text-sm">
          <Link href="/auth/login" className="link">Back to sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}
