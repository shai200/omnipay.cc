'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

type Mode = 'login' | 'signup';

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

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle, loading } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1); // Step 1: credentials, Step 2: profile info

  const isSignup = mode === 'signup';

  const profilePayload = useMemo(() => {
    return {
      email: form.email || undefined,
      first_name: form.first_name || undefined,
      last_name: form.last_name || undefined,
      dob: {
        day: form.dob_day ? Number(form.dob_day) : undefined,
        month: form.dob_month ? Number(form.dob_month) : undefined,
        year: form.dob_year ? Number(form.dob_year) : undefined,
      },
      address: {
        country: form.address_country || undefined,
        line1: form.address_line1 || undefined,
        line2: form.address_line2 || undefined,
        city: form.address_city || undefined,
        state: form.address_state || undefined,
        postal_code: form.address_postal_code || undefined,
      },
    };
  }, [form]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Step 1: Just validate email/password and move to step 2 for signup
    if (isSignup && step === 1) {
      if (!form.email || !form.password) {
        setError('Email and password are required');
        return;
      }
      setStep(2);
      return;
    }

    // Step 2 for signup or direct submit for login
    setSubmitting(true);

    try {
      if (isSignup) {
        await signUp(form.email, form.password, profilePayload);
      } else {
        await signIn(form.email, form.password);
      }

      router.push('/');
    } catch (err: any) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setSubmitting(true);

    try {
      await signInWithGoogle();
      router.push('/');
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed');
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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>
              {isSignup ? (step === 1 ? 'Create your account' : 'Complete your profile') : 'Sign in'}
            </h1>
            {step === 1 && (
              <div className="flex items-center gap-3">
                <a
                  href="/auth/register"
                  className={`text-sm ${isSignup ? 'font-semibold' : ''}`}
                  style={{ color: 'var(--accent)' }}
                >
                  Register
                </a>
                <a
                  href="/auth/login"
                  className={`text-sm ${!isSignup ? 'font-semibold' : ''}`}
                  style={{ color: 'var(--accent)' }}
                >
                  Sign in
                </a>
              </div>
            )}
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm px-4 py-2 rounded-lg transition-colors"
                style={{ 
                  color: 'var(--accent)',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--accent)'
                }}
              >
                ← Back
              </button>
            )}
          </div>

          {/* Step indicator for signup */}
          {isSignup && (
            <div className="mb-6 flex items-center gap-2">
              <div className={`flex-1 h-2 rounded-full transition-all ${step >= 1 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className={`flex-1 h-2 rounded-full transition-all ${step >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            </div>
          )}

          {/* Google Sign-In Button */}
          {step === 1 && (
            <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={submitting || loading}
                className="w-full mb-4 rounded-lg px-4 py-3 font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', color: '#1f2937' }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderColor: 'var(--card-border)' }}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-secondary)' }}>
                    or continue with email
                  </span>
                </div>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Email and Password (always shown for login, step 1 for signup) */}
            {(!isSignup || step === 1) && (
              <>
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={onChange}
                    className="w-full rounded-lg border px-3 py-2"
                    style={{ backgroundColor: 'var(--background)', borderColor: 'var(--card-border)' }}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    value={form.password}
                    onChange={onChange}
                    className="w-full rounded-lg border px-3 py-2"
                    style={{ backgroundColor: 'var(--background)', borderColor: 'var(--card-border)' }}
                  />
                </div>
              </>
            )}

            {/* Step 2: Profile Information (only for signup) */}
            {isSignup && step === 2 && (
              <div className="space-y-4">
                {/* Explanation Box */}
                <div className="p-5 rounded-xl mb-6" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '2px solid #3b82f6' }}>
                  <h3 className="text-lg font-bold mb-3" style={{ color: '#3b82f6' }}>
                    ⚡ Speed up your crypto purchases
                  </h3>
                  <div className="space-y-2 text-sm" style={{ color: 'var(--foreground)' }}>
                    <p>
                      <strong>Save time on every purchase!</strong> By filling out these details now, you won't have to enter them over and over again each time you buy crypto.
                    </p>
                    <p>
                      Your information is securely stored and pre-filled automatically during checkout, making future purchases lightning-fast.
                    </p>
                    <p className="font-semibold" style={{ color: '#3b82f6' }}>
                      💡 These fields are <span className="underline">recommended but optional</span> — you can skip them and fill them out later in your profile if you prefer.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                      First name
                    </label>
                    <input
                      name="first_name"
                      type="text"
                      value={form.first_name}
                      onChange={onChange}
                      className="w-full rounded-lg border px-3 py-2"
                      style={{ backgroundColor: 'var(--background)', borderColor: 'var(--card-border)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                      Last name
                    </label>
                    <input
                      name="last_name"
                      type="text"
                      value={form.last_name}
                      onChange={onChange}
                      className="w-full rounded-lg border px-3 py-2"
                      style={{ backgroundColor: 'var(--background)', borderColor: 'var(--card-border)' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                      DOB Day
                    </label>
                    <input
                      name="dob_day"
                      type="number"
                      min="1"
                      max="31"
                      value={form.dob_day}
                      onChange={onChange}
                      className="w-full rounded-lg border px-3 py-2"
                      style={{ backgroundColor: 'var(--background)', borderColor: 'var(--card-border)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                      DOB Month
                    </label>
                    <input
                      name="dob_month"
                      type="number"
                      min="1"
                      max="12"
                      value={form.dob_month}
                      onChange={onChange}
                      className="w-full rounded-lg border px-3 py-2"
                      style={{ backgroundColor: 'var(--background)', borderColor: 'var(--card-border)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                      DOB Year
                    </label>
                    <input
                      name="dob_year"
                      type="number"
                      min="1900"
                      max="2100"
                      value={form.dob_year}
                      onChange={onChange}
                      className="w-full rounded-lg border px-3 py-2"
                      style={{ backgroundColor: 'var(--background)', borderColor: 'var(--card-border)' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Country (2-letter code)
                  </label>
                  <input
                    name="address_country"
                    type="text"
                    value={form.address_country}
                    onChange={onChange}
                    className="w-full rounded-lg border px-3 py-2"
                    placeholder="US"
                    style={{ backgroundColor: 'var(--background)', borderColor: 'var(--card-border)' }}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Address Line 1
                  </label>
                  <input
                    name="address_line1"
                    type="text"
                    value={form.address_line1}
                    onChange={onChange}
                    className="w-full rounded-lg border px-3 py-2"
                    style={{ backgroundColor: 'var(--background)', borderColor: 'var(--card-border)' }}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Address Line 2
                  </label>
                  <input
                    name="address_line2"
                    type="text"
                    value={form.address_line2}
                    onChange={onChange}
                    className="w-full rounded-lg border px-3 py-2"
                    style={{ backgroundColor: 'var(--background)', borderColor: 'var(--card-border)' }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                      City
                    </label>
                    <input
                      name="address_city"
                      type="text"
                      value={form.address_city}
                      onChange={onChange}
                      className="w-full rounded-lg border px-3 py-2"
                      style={{ backgroundColor: 'var(--background)', borderColor: 'var(--card-border)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                      State
                    </label>
                    <input
                      name="address_state"
                      type="text"
                      value={form.address_state}
                      onChange={onChange}
                      className="w-full rounded-lg border px-3 py-2"
                      style={{ backgroundColor: 'var(--background)', borderColor: 'var(--card-border)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                      Postal code
                    </label>
                    <input
                      name="address_postal_code"
                      type="text"
                      value={form.address_postal_code}
                      onChange={onChange}
                      className="w-full rounded-lg border px-3 py-2"
                      style={{ backgroundColor: 'var(--background)', borderColor: 'var(--card-border)' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg border p-3 text-sm" style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full rounded-lg px-4 py-2 text-white font-semibold disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {submitting 
                ? 'Please wait...' 
                : isSignup 
                  ? (step === 1 ? 'Continue →' : 'Create account') 
                  : 'Sign in'}
            </button>

            {/* Skip button for step 2 */}
            {isSignup && step === 2 && !submitting && (
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg px-4 py-2 font-semibold transition-colors"
                style={{ 
                  backgroundColor: 'transparent',
                  border: '1px solid var(--card-border)',
                  color: 'var(--text-secondary)'
                }}
              >
                Skip for now (I'll fill this out later)
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
