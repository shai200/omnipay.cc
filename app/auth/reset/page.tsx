'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import { Alert } from '../../components/ui/Alert';
import { TextField } from '../../components/ui/Field';
import { AuthShell } from '../AuthShell';

const INVALID_LINK = 'This reset link is invalid or expired.';

function ResetForm() {
  const params = useSearchParams();
  const token = params.get('token') ?? '';
  const linkError = params.get('error');
  const [password, setPassword] = useState('');
  // A link without a token can never work, so say so up front instead of
  // showing a disabled button with no explanation.
  const [error, setError] = useState(linkError || !token ? INVALID_LINK : '');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

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
        return;
      }
      setDone(true);
    } catch {
      setError(INVALID_LINK);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="space-y-5">
        <Alert tone="success">Your password has been changed. You can now sign in with the new password.</Alert>
        <Link href="/auth/login" className="btn btn-primary btn-lg btn-block">Sign in</Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <TextField
        label="New password"
        name="password"
        type="password"
        required
        minLength={8}
        maxLength={128}
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        hint="At least 8 characters."
        disabled={!token}
      />
      {error ? (
        <Alert tone="danger">
          {error}{' '}
          <Link href="/auth/forgot" className="link">Request a new link</Link>
        </Alert>
      ) : null}
      <button type="submit" disabled={submitting || !token} className="btn btn-primary btn-lg btn-block">
        {submitting ? (
          <>
            <span className="spinner" aria-hidden="true" /> Please wait...
          </>
        ) : (
          'Save password'
        )}
      </button>
      <p className="text-center text-sm">
        <Link href="/auth/login" className="link">Back to sign in</Link>
      </p>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Choose a new password">
      <Suspense fallback={<p className="text-muted" role="status">Loading...</p>}>
        <ResetForm />
      </Suspense>
    </AuthShell>
  );
}
