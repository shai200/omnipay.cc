'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

const initialForm = {
  email: '',
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
  reminder_monthly: true,
  reminder_price_drop: true,
  reminder_weekly: false,
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading, updateProfile, refreshProfile, signOutUser } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        email: profile.email || user?.email || '',
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        dob_day: profile.dob?.day?.toString() || '',
        dob_month: profile.dob?.month?.toString() || '',
        dob_year: profile.dob?.year?.toString() || '',
        address_country: profile.address?.country || '',
        address_line1: profile.address?.line1 || '',
        address_line2: profile.address?.line2 || '',
        address_city: profile.address?.city || '',
        address_state: profile.address?.state || '',
        address_postal_code: profile.address?.postal_code || '',
        reminder_monthly: profile.reminder_monthly !== false,
        reminder_price_drop: profile.reminder_price_drop !== false,
        reminder_weekly: profile.reminder_weekly === true,
      });
      setProfileLoaded(true);
    } else if (user?.email) {
      setForm((prev) => ({ ...prev, email: user.email || '' }));
      setProfileLoaded(true);
    }
  }, [profile, user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [loading, user, router]);

  const payload = useMemo(() => {
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
      reminder_monthly: form.reminder_monthly,
      reminder_price_drop: form.reminder_price_drop,
      reminder_weekly: form.reminder_weekly,
    };
  }, [form]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setSaving(true);

    try {
      await updateProfile(payload);
      console.log('Profile saved with payload:', payload);
      // Don't need to refresh - the form already has the correct values
      setMessage('Profile updated successfully.');
      setSaving(false);
    } catch (err: any) {
      console.error('Save error:', err);
      setMessage(err?.message || 'Failed to update.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="container mx-auto px-4 py-12">
        <div
          className="max-w-2xl mx-auto rounded-2xl border p-8"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>
              Your Profile
            </h1>
            <button
              type="button"
              onClick={() => window.location.href = '/'}
              className="text-sm px-4 py-2 rounded-lg transition-colors"
              style={{ 
                color: 'var(--accent)',
                backgroundColor: 'transparent',
                border: '1px solid var(--accent)'
              }}
            >
              ← Back to Home
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                disabled={!profileLoaded || saving}
                className="w-full rounded-lg border px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--background)', borderColor: 'var(--card-border)' }}
              />
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
                  disabled={!profileLoaded || saving}
                  className="w-full rounded-lg border px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  disabled={!profileLoaded || saving}
                  className="w-full rounded-lg border px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  disabled={!profileLoaded || saving}
                  className="w-full rounded-lg border px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  disabled={!profileLoaded || saving}
                  className="w-full rounded-lg border px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  disabled={!profileLoaded || saving}
                  className="w-full rounded-lg border px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={!profileLoaded || saving}
                className="w-full rounded-lg border px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={!profileLoaded || saving}
                className="w-full rounded-lg border px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={!profileLoaded || saving}
                className="w-full rounded-lg border px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  disabled={!profileLoaded || saving}
                  className="w-full rounded-lg border px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  disabled={!profileLoaded || saving}
                  className="w-full rounded-lg border px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  disabled={!profileLoaded || saving}
                  className="w-full rounded-lg border px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: 'var(--background)', borderColor: 'var(--card-border)' }}
                />
              </div>
            </div>

            {/* Email Reminders Section */}
            <div className="border-t pt-6 mt-6" style={{ borderColor: 'var(--card-border)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                Email Reminders to Buy Again
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="reminder_monthly"
                    name="reminder_monthly"
                    checked={form.reminder_monthly}
                    onChange={onChange}
                    disabled={!profileLoaded || saving}
                    className="w-4 h-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <label htmlFor="reminder_monthly" className="text-sm" style={{ color: 'var(--foreground)' }}>
                    Once a month <span style={{ color: 'var(--accent)' }}>(popular)</span>
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="reminder_price_drop"
                    name="reminder_price_drop"
                    checked={form.reminder_price_drop}
                    onChange={onChange}
                    disabled={!profileLoaded || saving}
                    className="w-4 h-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <label htmlFor="reminder_price_drop" className="text-sm" style={{ color: 'var(--foreground)' }}>
                    After sharp drops (more than 10%) <span style={{ color: 'var(--accent)' }}>(popular)</span>
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="reminder_weekly"
                    name="reminder_weekly"
                    checked={form.reminder_weekly}
                    onChange={onChange}
                    disabled={!profileLoaded || saving}
                    className="w-4 h-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <label htmlFor="reminder_weekly" className="text-sm" style={{ color: 'var(--foreground)' }}>
                    Once a week <span style={{ color: 'var(--accent)' }}>(hot)</span>
                  </label>
                </div>
              </div>
            </div>

            {message && (
              <div className="rounded-lg border p-3 text-sm" style={{ borderColor: 'var(--card-border)', color: 'var(--text-secondary)' }}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={!profileLoaded || saving}
              className="w-full rounded-lg px-4 py-2 text-white font-semibold disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
