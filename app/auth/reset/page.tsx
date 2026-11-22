'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import { AuthLayout } from '../AuthLayout';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { PasswordField } from '../../components/ui/Field';
import { IconArrowLeft } from '../../components/ui/icons';

const INVALID_LINK = 'This reset link is invalid or expired.';

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token') ?? '';
  const linkError = params.get('error');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(linkError || !token ? INVALID_LINK : '');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!token) {
      setError(INVALID_LINK);
      return;
    }
    setSubmitting(true);
    try {
      const result = await authClient.resetPassword({ newPassword: password, token });
      if (result.error) {
        setError(INVALID_LINK);
        setSubmitting(false);
        return;
      }
      router.push('/auth/login');
    } catch {
      setError(INVALID_LINK);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5">
      <PasswordField
        label="New password"
        name="password"
        required
        minLength={8}
        maxLength={128}
        autoComplete="new-password"
        hint="At least 8 characters."
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      {error && (
        <Alert tone="danger">
          {error}{' '}
          {!token && (
            <Link href="/auth/forgot" className="font-medium text-fg underline underline-offset-2">
              Request a new link
            </Link>
          )}
        </Alert>
      )}
      <Button type="submit" size="lg" block loading={submitting} disabled={!token}>
        {submitting ? 'Please wait…' : 'Save password'}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <h1 className="text-[1.75rem] font-semibold tracking-[-0.025em] text-fg">Choose a new password</h1>
      <p className="mt-2 text-fg-muted">You will be signed out on other devices after saving.</p>
      <Suspense fallback={<p className="mt-8 text-fg-muted">Loading…</p>}>
        <ResetForm />
      </Suspense>
      <Link
        href="/auth/login"
        className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-brand underline-offset-4 hover:underline"
      >
        <IconArrowLeft size={16} /> Back to sign in
      </Link>
    </AuthLayout>
  );
}
