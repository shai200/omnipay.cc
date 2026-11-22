'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth/client';
import { AuthLayout } from '../AuthLayout';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { TextField } from '../../components/ui/Field';
import { IconArrowLeft } from '../../components/ui/icons';

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
        email: email.trim(),
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
    <AuthLayout>
      <h1 className="text-[1.75rem] font-semibold tracking-[-0.025em] text-fg">Reset your password</h1>
      <p className="mt-2 text-fg-muted">We will email a link if an account exists. The link expires in one hour.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-5">
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
        {message && <Alert tone="success">{message}</Alert>}
        {error && <Alert tone="danger">{error}</Alert>}
        <Button type="submit" size="lg" block loading={submitting}>
          {submitting ? 'Please wait…' : 'Send reset link'}
        </Button>
      </form>
      <Link
        href="/auth/login"
        className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-brand underline-offset-4 hover:underline"
      >
        <IconArrowLeft size={16} /> Back to sign in
      </Link>
    </AuthLayout>
  );
}
