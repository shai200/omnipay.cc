'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import type { PublicProfile } from '@/lib/profile';
import { safeNextPath } from '@/lib/safe-redirect';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { PasswordField, TextField } from '../components/ui/Field';
import { IconArrowLeft, IconArrowRight, IconGoogle, IconInfo } from '../components/ui/icons';

type Mode = 'login' | 'signup';

const MIN_PASSWORD = 8;

const initialForm = {
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  dob_day: '',
  dob_month: '',
  dob_year: '',
  address_country: '',
  address_line1: '',
  address_line2: '',
  address_city: '',
  address_state: '',
  address_postal_code: '',
};

type FormState = typeof initialForm;

function profileFrom(form: FormState): PublicProfile {
  return {
    first_name: form.first_name.trim() || undefined,
    last_name: form.last_name.trim() || undefined,
    dob: {
      day: form.dob_day ? Number(form.dob_day) : undefined,
      month: form.dob_month ? Number(form.dob_month) : undefined,
      year: form.dob_year ? Number(form.dob_year) : undefined,
    },
    address: {
      country: form.address_country.trim() || undefined,
      line1: form.address_line1.trim() || undefined,
      line2: form.address_line2.trim() || undefined,
      city: form.address_city.trim() || undefined,
      state: form.address_state.trim() || undefined,
      postal_code: form.address_postal_code.trim() || undefined,
    },
  };
}

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback;
}

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNextPath(params.get('next'));
  const { user, signIn, signUp, signInWithGoogle, loading } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const isSignup = mode === 'signup';

  // Already signed in (or a Google round-trip finished): go where they were headed.
  useEffect(() => {
    if (!loading && user && !submitting) router.replace(next);
  }, [loading, user, submitting, router, next]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (profile: PublicProfile) => {
    setError('');
    setSubmitting(true);
    try {
      if (isSignup) {
        await signUp(form.email.trim(), form.password, profile);
      } else {
        await signIn(form.email.trim(), form.password);
      }
      router.push(next);
    } catch (err: unknown) {
      setError(errorMessage(err, 'Something went wrong'));
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignup && step === 1) {
      if (!form.email || !form.password) {
        setError('Email and password are required');
        return;
      }
      if (form.password.length < MIN_PASSWORD) {
        setError(`Use at least ${MIN_PASSWORD} characters for your password.`);
        return;
      }
      setStep(2);
      return;
    }

    await submit(isSignup ? profileFrom(form) : {});
  };

  // "Skip for now" really skips: none of the partly filled details are sent.
  const handleSkip = () => submit({});

  const handleGoogleSignIn = async () => {
    setError('');
    setSubmitting(true);
    try {
      // The auth client redirects the browser to Google.
      await signInWithGoogle(next);
    } catch (err: unknown) {
      setError(errorMessage(err, 'Google sign-in failed'));
      setSubmitting(false);
    }
  };

  const title = isSignup ? (step === 1 ? 'Create your account' : 'Complete your profile') : 'Welcome back';
  const subtitle = isSignup
    ? step === 1
      ? 'Buy Bitcoin with your card and receive it in your own wallet.'
      : 'Save these once and checkout will prefill them every time.'
    : 'Sign in to buy Bitcoin and manage your alerts.';
  const switchHref = (path: string) => (next === '/' ? path : `${path}?next=${encodeURIComponent(next)}`);

  return (
    <div>
      {isSignup && (
        <div className="mb-8">
          <p className="text-sm font-medium text-fg-muted" aria-live="polite">
            Step {step} of 2
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2" aria-hidden>
            <span className="h-1.5 rounded-full bg-brand" />
            <span className={`h-1.5 rounded-full transition-colors duration-300 ${step === 2 ? 'bg-brand' : 'bg-border'}`} />
          </div>
        </div>
      )}

      <h1 className="text-[1.75rem] font-semibold tracking-[-0.025em] text-fg">{title}</h1>
      <p className="mt-2 text-fg-muted">{subtitle}</p>

      {step === 1 && (
        <>
          <Button
            variant="outline"
            size="lg"
            block
            className="mt-8"
            onClick={handleGoogleSignIn}
            disabled={submitting || loading}
            leadingIcon={<IconGoogle />}
          >
            Continue with Google
          </Button>
          <div className="my-6 flex items-center gap-3 text-sm text-fg-subtle">
            <span className="h-px flex-1 bg-border" />
            or continue with email
            <span className="h-px flex-1 bg-border" />
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} noValidate={false} className={step === 2 ? 'mt-8 space-y-5' : 'space-y-5'}>
        {(!isSignup || step === 1) && (
          <>
            <TextField
              label="Email"
              name="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              value={form.email}
              onChange={onChange}
            />
            <div>
              <PasswordField
                label="Password"
                name="password"
                required
                minLength={isSignup ? MIN_PASSWORD : undefined}
                maxLength={128}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                hint={isSignup ? `At least ${MIN_PASSWORD} characters.` : undefined}
                value={form.password}
                onChange={onChange}
              />
              {!isSignup && (
                <div className="mt-2 text-right">
                  <Link href="/auth/forgot" className="text-sm font-medium text-brand underline-offset-4 hover:underline">
                    Forgot password?
                  </Link>
                </div>
              )}
            </div>
          </>
        )}

        {isSignup && step === 2 && (
          <>
            <div className="flex gap-3 rounded-lg border border-border bg-surface-2 p-4 text-sm text-fg-muted">
              <IconInfo size={18} className="mt-0.5 shrink-0 text-brand" />
              <p>
                These fields are <strong className="font-medium text-fg">recommended but optional</strong> — you can skip
                them and fill them out later. Your date of birth is required before your first purchase (18+).
              </p>
            </div>

            <fieldset className="space-y-4">
              <legend className="mb-3 text-sm font-semibold text-fg">Your name</legend>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField label="First name" name="first_name" autoComplete="given-name" value={form.first_name} onChange={onChange} />
                <TextField label="Last name" name="last_name" autoComplete="family-name" value={form.last_name} onChange={onChange} />
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-fg">Date of birth</legend>
              <div className="grid grid-cols-[1fr_1fr_1.4fr] gap-3">
                <TextField label="Day" name="dob_day" inputMode="numeric" pattern="[0-9]*" maxLength={2} placeholder="DD" autoComplete="bday-day" value={form.dob_day} onChange={onChange} />
                <TextField label="Month" name="dob_month" inputMode="numeric" pattern="[0-9]*" maxLength={2} placeholder="MM" autoComplete="bday-month" value={form.dob_month} onChange={onChange} />
                <TextField label="Year" name="dob_year" inputMode="numeric" pattern="[0-9]*" maxLength={4} placeholder="YYYY" autoComplete="bday-year" value={form.dob_year} onChange={onChange} />
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="mb-3 text-sm font-semibold text-fg">Address</legend>
              <TextField
                label="Country"
                hint="2-letter code, e.g. US, GB, DE"
                name="address_country"
                autoComplete="country"
                maxLength={2}
                placeholder="US"
                inputClassName="uppercase"
                value={form.address_country}
                onChange={onChange}
              />
              <TextField label="Address line 1" name="address_line1" autoComplete="address-line1" value={form.address_line1} onChange={onChange} />
              <TextField label="Address line 2" optional name="address_line2" autoComplete="address-line2" value={form.address_line2} onChange={onChange} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <TextField label="City" name="address_city" autoComplete="address-level2" value={form.address_city} onChange={onChange} />
                <TextField label="State / region" name="address_state" autoComplete="address-level1" value={form.address_state} onChange={onChange} />
                <TextField label="Postal code" name="address_postal_code" autoComplete="postal-code" value={form.address_postal_code} onChange={onChange} />
              </div>
            </fieldset>
          </>
        )}

        {error && <Alert tone="danger">{error}</Alert>}

        <Button
          type="submit"
          size="lg"
          block
          loading={submitting}
          disabled={loading}
          trailingIcon={isSignup && step === 1 ? <IconArrowRight size={18} /> : undefined}
        >
          {submitting ? 'Please wait…' : isSignup ? (step === 1 ? 'Continue' : 'Create account') : 'Sign in'}
        </Button>

        {isSignup && step === 2 && (
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <Button variant="ghost" block onClick={() => setStep(1)} disabled={submitting} leadingIcon={<IconArrowLeft size={16} />}>
              Back
            </Button>
            <Button variant="outline" block onClick={handleSkip} disabled={submitting || loading}>
              Skip for now
            </Button>
          </div>
        )}
      </form>

      {step === 1 && (
        <p className="mt-8 text-center text-sm text-fg-muted">
          {isSignup ? 'Already have an account? ' : 'New to OmniPurchase? '}
          <Link
            href={switchHref(isSignup ? '/auth/login' : '/auth/register')}
            className="font-medium text-brand underline-offset-4 hover:underline"
          >
            {isSignup ? 'Sign in' : 'Create an account'}
          </Link>
        </p>
      )}
    </div>
  );
}
