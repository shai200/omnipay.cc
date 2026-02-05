'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

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

export default function AuthPage() {
  const router = useRouter();
  const { signIn, signUp, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
    setSubmitting(true);

    try {
      if (isSignup) {
        await signUp(form.email, form.password, profilePayload);
      } else {
        await signIn(form.email, form.password);
      }

      router.push('/profile');
    } catch (err: any) {
      setError(err?.message || 'Something went wrong');
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
              {isSignup ? 'Create your account' : 'Welcome back'}
            </h1>
            <button
              onClick={() => setMode(isSignup ? 'login' : 'signup')}
              className="text-sm"
              style={{ color: 'var(--accent)' }}
            >
              {isSignup ? 'Have an account? Sign in' : 'New here? Sign up'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            {isSignup && (
              <div className="pt-4 border-t" style={{ borderColor: 'var(--card-border)' }}>
                <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
                  Optional details for faster checkout
                </h2>

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

                <div className="grid grid-cols-3 gap-4 mt-4">
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

                <div className="mt-4">
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

                <div className="mt-4">
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

                <div className="mt-4">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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
              {submitting ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
