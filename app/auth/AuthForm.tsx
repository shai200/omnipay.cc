'use client';

import Link from 'next/link';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ProfileSaveError, useAuth } from '../contexts/AuthContext';
import { ProfileFields } from '../components/ProfileFields';
import { Alert } from '../components/ui/Alert';
import { TextField } from '../components/ui/Field';
import { ArrowLeftIcon, ArrowRightIcon, GoogleIcon } from '../components/ui/icons';
import {
  buildProfilePayload,
  countryFieldError,
  profileFormIsEmpty,
  readDobFields,
  type ProfileFormValues,
} from '@/lib/profile-form';
import { loginHref, registerHref, type NextPath } from '@/lib/next-path';
import { AuthShell } from './AuthShell';

type Mode = 'login' | 'signup';

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

const initialProfile: ProfileFormValues = {
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

function messageOf(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

export default function AuthForm({
  mode,
  googleEnabled = false,
  next = '/',
}: {
  mode: Mode;
  googleEnabled?: boolean;
  next?: NextPath;
}) {
  const router = useRouter();
  const { user, signIn, signUp, signInWithGoogle, updateProfile, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState(initialProfile);
  const [error, setError] = useState('');
  const [dobError, setDobError] = useState('');
  const [countryError, setCountryError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  // Set once the account exists. From then on only the profile is retried.
  const [accountCreated, setAccountCreated] = useState(false);

  const isSignup = mode === 'signup';
  const busy = submitting || loading;

  // Someone already signed in has nothing to do here.
  useEffect(() => {
    if (!loading && user && !submitting && !accountCreated) {
      router.replace(next);
    }
  }, [loading, user, submitting, accountCreated, router, next]);

  const onProfileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfile((previous) => ({ ...previous, [name]: value }));
    if (name.startsWith('dob_')) setDobError('');
    if (name === 'address_country') setCountryError('');
  };

  const finish = () => {
    router.push(next);
  };

  // `withProfile` is false for "Skip for now": the account is created and
  // nothing typed into the optional step is sent.
  const submitSignup = async (withProfile: boolean) => {
    setError('');
    setDobError('');
    setCountryError('');

    let payload: ReturnType<typeof buildProfilePayload> | null = null;
    if (withProfile && !profileFormIsEmpty(profile)) {
      // Check before the account is created, so a typo or an under-18 date
      // cannot leave a half-registered account behind.
      const dob = readDobFields(profile);
      const country = countryFieldError(profile.address_country);
      if (!dob.ok) setDobError(dob.error);
      if (country) setCountryError(country);
      if (!dob.ok || country) return;
      payload = buildProfilePayload(profile, dob.dob);
    }

    setSubmitting(true);
    try {
      if (accountCreated) {
        if (payload) await updateProfile(payload);
      } else {
        await signUp(email, password, payload);
      }
      finish();
    } catch (err: unknown) {
      if (err instanceof ProfileSaveError) {
        setAccountCreated(true);
        setError(`Your account was created, but your details were not saved: ${err.message} You can fix them and try again, or skip for now.`);
      } else {
        setError(messageOf(err, 'Something went wrong'));
        if (!accountCreated) setStep(1);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (isSignup && step === 1) {
      if (!email || !password) {
        setError('Email and password are required');
        return;
      }
      setStep(2);
      return;
    }

    if (isSignup) {
      await submitSignup(true);
      return;
    }

    setSubmitting(true);
    try {
      await signIn(email, password);
      finish();
    } catch (err: unknown) {
      setError(messageOf(err, 'Something went wrong'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSubmitting(true);
    try {
      // On success the browser leaves for Google, then returns to `next`.
      await signInWithGoogle(next);
    } catch (err: unknown) {
      setError(messageOf(err, 'Google sign-in failed'));
      setSubmitting(false);
    }
  };

  const title = isSignup ? (step === 1 ? 'Create your account' : 'Complete your profile') : 'Sign in';
  const description = isSignup
    ? step === 1
      ? 'Buy crypto with your card, sent to your own wallet.'
      : 'Optional now, and you can change it later in Checkout Settings.'
    : 'Welcome back to OmniPurchase.';

  return (
    <AuthShell title={title} description={description} wide={isSignup && step === 2}>
      {isSignup ? (
        <ol className="mb-7 flex items-center gap-2" aria-label="Sign-up progress">
          {[1, 2].map((index) => (
            <li
              key={index}
              aria-current={step === index ? 'step' : undefined}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step >= index ? 'bg-primary' : 'bg-line'}`}
            >
              <span className="sr-only">
                Step {index} of 2: {index === 1 ? 'Account' : 'Profile'}
                {step > index ? ' (completed)' : ''}
              </span>
            </li>
          ))}
        </ol>
      ) : null}

      {step === 1 && googleEnabled ? (
        <>
          <button type="button" onClick={handleGoogleSignIn} disabled={busy} className="btn btn-secondary btn-lg btn-block">
            <GoogleIcon />
            Continue with Google
          </button>
          <div className="my-6 flex items-center gap-3 text-sm text-muted" role="separator">
            <span className="h-px flex-1 bg-line" />
            or continue with email
            <span className="h-px flex-1 bg-line" />
          </div>
        </>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate={false}>
        {!isSignup || step === 1 ? (
          <>
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
            <div>
              <TextField
                label="Password"
                name="password"
                type="password"
                required
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                minLength={isSignup ? MIN_PASSWORD_LENGTH : undefined}
                maxLength={MAX_PASSWORD_LENGTH}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                hint={isSignup ? `At least ${MIN_PASSWORD_LENGTH} characters.` : undefined}
              />
              {!isSignup ? (
                <p className="mt-2 text-right text-sm">
                  <Link href="/auth/forgot" className="link">Forgot password?</Link>
                </p>
              ) : null}
            </div>
          </>
        ) : null}

        {isSignup && step === 2 ? (
          <>
            <Alert tone="info" live={false}>
              <p className="font-semibold">Speed up your crypto purchases</p>
              <p className="mt-1 text-muted">
                Fill these in once and they are pre-filled at checkout. Every field is optional here, but you
                will need a date of birth before your first purchase.
              </p>
            </Alert>
            <ProfileFields
              values={profile}
              onChange={onProfileChange}
              disabled={submitting}
              dobError={dobError}
              countryError={countryError}
            />
          </>
        ) : null}

        {error ? <Alert tone="danger">{error}</Alert> : null}

        <div className="space-y-3 pt-1">
          <button type="submit" disabled={busy} className="btn btn-primary btn-lg btn-block">
            {submitting ? (
              <>
                <span className="spinner" aria-hidden="true" /> Please wait...
              </>
            ) : isSignup ? (
              step === 1 ? (
                <>Continue <ArrowRightIcon size={18} /></>
              ) : accountCreated ? (
                'Save details'
              ) : (
                'Create account'
              )
            ) : (
              'Sign in'
            )}
          </button>

          {isSignup && step === 2 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {accountCreated ? null : (
                <button type="button" onClick={() => setStep(1)} disabled={submitting} className="btn btn-ghost">
                  <ArrowLeftIcon size={18} /> Back
                </button>
              )}
              <button
                type="button"
                onClick={() => (accountCreated ? finish() : void submitSignup(false))}
                disabled={busy}
                className={`btn btn-secondary ${accountCreated ? 'sm:col-span-2' : ''}`}
              >
                Skip for now
              </button>
            </div>
          ) : null}
        </div>
      </form>

      {step === 1 ? (
        <p className="mt-7 text-center text-sm text-muted">
          {isSignup ? (
            <>Already have an account? <Link href={loginHref(next)} className="link">Sign in</Link></>
          ) : (
            <>New to OmniPurchase? <Link href={registerHref(next)} className="link">Register</Link></>
          )}
        </p>
      ) : null}

      {isSignup && step === 1 ? (
        <p className="mt-4 text-center text-xs text-muted">
          By creating an account you agree to the{' '}
          <Link href="/TermsOfService" className="link">Terms of Service</Link> and{' '}
          <Link href="/PrivacyPolicy" className="link">Privacy Policy</Link>.
        </p>
      ) : null}
    </AuthShell>
  );
}
