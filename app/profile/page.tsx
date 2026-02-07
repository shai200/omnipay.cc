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
  wallet_address_ethereum: '',
  wallet_address_bitcoin: '',
  lock_wallet_address: false,
  source_currency: 'usd',
  source_amount: '100',
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading, updateProfile, refreshProfile, signOutUser } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [ethAddressError, setEthAddressError] = useState('');
  const [btcAddressError, setBtcAddressError] = useState('');

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
        wallet_address_ethereum: profile.wallet_addresses?.ethereum || '',
        wallet_address_bitcoin: profile.wallet_addresses?.bitcoin || '',
        lock_wallet_address: profile.lock_wallet_address === true,
        source_currency: profile.source_currency || 'usd',
        source_amount: profile.source_amount || '100',
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
    const walletAddresses: { [key: string]: string } = {};
    if (form.wallet_address_ethereum) walletAddresses.ethereum = form.wallet_address_ethereum;
    if (form.wallet_address_bitcoin) walletAddresses.bitcoin = form.wallet_address_bitcoin;

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
      wallet_addresses: Object.keys(walletAddresses).length > 0 ? walletAddresses : undefined,
      lock_wallet_address: form.lock_wallet_address,
      source_currency: form.source_currency || undefined,
      source_amount: form.source_amount || undefined,
    };
  }, [form]);

  const validateEthAddress = (address: string): boolean => {
    if (!address) {
      setEthAddressError('');
      return true;
    }
    const ethRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!ethRegex.test(address)) {
      setEthAddressError('Invalid Ethereum address format');
      return false;
    }
    setEthAddressError('');
    return true;
  };

  const validateBtcAddress = (address: string): boolean => {
    if (!address) {
      setBtcAddressError('');
      return true;
    }
    const btcRegex = /^((bc1[0-9A-Za-z]{32,64})|([13][a-km-zA-HJ-NP-Z1-9]{25,34}))$/;
    if (!btcRegex.test(address)) {
      setBtcAddressError('Invalid Bitcoin address format');
      return false;
    }
    setBtcAddressError('');
    return true;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'wallet_address_ethereum') {
      validateEthAddress(value);
    }
    
    if (name === 'wallet_address_bitcoin') {
      validateBtcAddress(value);
    }
    
    setForm((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setSaving(true);

    // Validate age if DOB is provided
    if (form.dob_year && form.dob_month && form.dob_day) {
      const birthDate = new Date(
        parseInt(form.dob_year),
        parseInt(form.dob_month) - 1,
        parseInt(form.dob_day)
      );
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 13) {
        setMessage('You must be at least 13 years old to use this service.');
        setSaving(false);
        return;
      }
    }

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
              Checkout Settings
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

          {/* Crypto Purchase Reminders Button - Top Priority */}
          <div className="mb-8">
            <button
              type="button"
              onClick={() => router.push('/reminders')}
              className="w-full rounded-lg px-4 py-3 text-white font-bold transition-all hover:scale-105 flex items-center justify-center gap-2"
              style={{ backgroundColor: '#dc2626' }}
            >
              🔔 Crypto Purchase Reminders (IMPORTANT)
            </button>
            <p className="text-xs text-center mt-2" style={{ color: 'var(--text-secondary)' }}>
              Set up regular reminders to build your wealth habit — this is the most critical step!
            </p>
          </div>

          {/* Profile Info Explainer */}
          <div className="mb-8 p-5 rounded-xl" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '2px solid #22c55e' }}>
            <h2 className="text-lg font-bold mb-3" style={{ color: '#22c55e' }}>
              ⚡ Speed up your crypto purchases
            </h2>
            <div className="space-y-3 text-sm" style={{ color: 'var(--foreground)' }}>
              <p className="font-semibold" style={{ color: '#22c55e' }}>
                💡 Fill out these details once, then enjoy lightning-fast checkouts for your weekly or monthly purchases.
              </p>
              <p>
                Your profile information is stored here so you can <strong>buy crypto in seconds</strong>. No more re-entering your name, address, or payment details every single time.
              </p>
              <p>
                <strong>Build wealth through frequent purchases.</strong> The best way to invest in crypto is through consistent, small purchases over time — not waiting for the "perfect" price.
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
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

            {/* Onramp Settings Section */}
            <div className="border-t pt-6 mt-6" style={{ borderColor: 'var(--card-border)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                Onramp Settings
              </h3>
              
              <div className="space-y-4">
                {/* Wallet Addresses */}
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Ethereum Wallet Address
                  </label>
                  <input
                    name="wallet_address_ethereum"
                    type="text"
                    value={form.wallet_address_ethereum}
                    onChange={onChange}
                    disabled={!profileLoaded || saving}
                    className="w-full rounded-lg border px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: 'var(--background)', borderColor: 'var(--card-border)' }}
                    placeholder="0x..."
                  />
                  {ethAddressError && (
                    <p className="text-sm mt-1" style={{ color: '#ef4444' }}>
                      {ethAddressError}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Bitcoin Wallet Address
                  </label>
                  <input
                    name="wallet_address_bitcoin"
                    type="text"
                    value={form.wallet_address_bitcoin}
                    onChange={onChange}
                    disabled={!profileLoaded || saving}
                    className="w-full rounded-lg border px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: 'var(--background)', borderColor: 'var(--card-border)' }}
                    placeholder="bc1..."
                  />
                  {btcAddressError && (
                    <p className="text-sm mt-1" style={{ color: '#ef4444' }}>
                      {btcAddressError}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="lock_wallet_address"
                    name="lock_wallet_address"
                    checked={form.lock_wallet_address}
                    onChange={onChange}
                    disabled={!profileLoaded || saving}
                    className="w-4 h-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <label htmlFor="lock_wallet_address" className="text-sm" style={{ color: 'var(--foreground)' }}>
                    Lock this wallet address (this prevents you from being able to change this address when you buy crypto. To make it editable during checkout, uncheck this box)
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                      Default Currency
                    </label>
                    <select
                      name="source_currency"
                      value={form.source_currency}
                      onChange={(e) => setForm(prev => ({ ...prev, source_currency: e.target.value }))}
                      disabled={!profileLoaded || saving}
                      className="w-full rounded-lg border px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: 'var(--background)', borderColor: 'var(--card-border)' }}
                    >
                      <option value="usd">USD</option>
                      <option value="eur">EUR</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                      Default Amount
                    </label>
                    <input
                      name="source_amount"
                      type="number"
                      min="1"
                      value={form.source_amount}
                      onChange={onChange}
                      disabled={!profileLoaded || saving}
                      className="w-full rounded-lg border px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: 'var(--background)', borderColor: 'var(--card-border)' }}
                    />
                  </div>
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
