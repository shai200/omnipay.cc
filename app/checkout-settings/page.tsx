'use client';

import Link from 'next/link';
import { useEffect, useId, useState, type ChangeEvent, type FormEvent } from 'react';
import { AccountPage, PageLoading } from '../components/PageShell';
import { ProfileFields } from '../components/ProfileFields';
import { Alert } from '../components/ui/Alert';
import { TextField } from '../components/ui/Field';
import { ArrowRightIcon, BellIcon } from '../components/ui/icons';
import { useRequireAuth } from '../hooks';
import {
  buildCheckoutPayload,
  countryFieldError,
  readDobFields,
  sourceAmountFieldError,
  walletFieldError,
  type CheckoutFormValues,
} from '@/lib/profile-form';
import type { PublicProfile } from '@/lib/profile';

const initialForm: CheckoutFormValues = {
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

function formFromProfile(profile: PublicProfile): CheckoutFormValues {
  return {
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
  };
}

type Errors = { dob: string; country: string; bitcoin: string; ethereum: string; amount: string };
const NO_ERRORS: Errors = { dob: '', country: '', bitcoin: '', ethereum: '', amount: '' };

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="card p-5 sm:p-7">
      <h2 id={id} className="text-lg font-semibold tracking-tight">{title}</h2>
      {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function CheckoutSettingsForm({
  email,
  initial,
  onSave,
}: {
  email: string;
  initial: CheckoutFormValues;
  onSave: (values: ReturnType<typeof buildCheckoutPayload>) => Promise<void>;
}) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Errors>(NO_ERRORS);
  const [status, setStatus] = useState<{ tone: 'success' | 'danger'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const currencyId = useId();
  const lockId = useId();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setForm((previous) => ({ ...previous, [name]: type === 'checkbox' ? checked : value }));
    setStatus(null);

    if (name === 'wallet_address_ethereum') {
      setErrors((previous) => ({ ...previous, ethereum: walletFieldError('ethereum', value) }));
    } else if (name === 'wallet_address_bitcoin') {
      setErrors((previous) => ({ ...previous, bitcoin: walletFieldError('bitcoin', value) }));
    } else if (name === 'address_country') {
      setErrors((previous) => ({ ...previous, country: '' }));
    } else if (name === 'source_amount') {
      setErrors((previous) => ({ ...previous, amount: '' }));
    } else if (name.startsWith('dob_')) {
      setErrors((previous) => ({ ...previous, dob: '' }));
    }
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    setStatus(null);

    const dob = readDobFields(form);
    const nextErrors: Errors = {
      dob: dob.ok ? '' : dob.error,
      country: countryFieldError(form.address_country),
      bitcoin: walletFieldError('bitcoin', form.wallet_address_bitcoin),
      ethereum: walletFieldError('ethereum', form.wallet_address_ethereum),
      amount: sourceAmountFieldError(form.source_amount),
    };
    setErrors(nextErrors);
    if (!dob.ok || Object.values(nextErrors).some(Boolean)) {
      setStatus({ tone: 'danger', text: 'Please fix the highlighted fields, then save again.' });
      return;
    }

    setSaving(true);
    try {
      await onSave(buildCheckoutPayload(form, dob.dob));
      setStatus({ tone: 'success', text: 'Checkout settings updated successfully.' });
    } catch (err: unknown) {
      setStatus({ tone: 'danger', text: err instanceof Error && err.message ? err.message : 'Failed to update.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6" noValidate>
      <Section title="Personal details" description={`Signed in as ${email}. These details are pre-filled at checkout.`}>
        <ProfileFields
          values={form}
          onChange={onChange}
          disabled={saving}
          dobError={errors.dob}
          countryError={errors.country}
        />
      </Section>

      <Section title="Onramp Settings" description="Where your crypto is sent, and the amount checkout starts with.">
        <div className="space-y-5">
          <TextField
            label="Bitcoin Wallet Address"
            name="wallet_address_bitcoin"
            type="text"
            mono
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            maxLength={120}
            placeholder="bc1..."
            value={form.wallet_address_bitcoin}
            onChange={onChange}
            disabled={saving}
            error={errors.bitcoin}
            hint="Used for purchases on the home page. Double-check it: blockchain transactions cannot be reversed."
          />
          <TextField
            label="Ethereum Wallet Address"
            name="wallet_address_ethereum"
            type="text"
            mono
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            maxLength={120}
            placeholder="0x..."
            value={form.wallet_address_ethereum}
            onChange={onChange}
            disabled={saving}
            error={errors.ethereum}
          />

          <label className="choice" htmlFor={lockId}>
            <input
              type="checkbox"
              id={lockId}
              name="lock_wallet_address"
              checked={form.lock_wallet_address}
              onChange={onChange}
              disabled={saving}
            />
            <span className="text-sm">
              Lock this wallet address (this prevents you from being able to change this address when you buy
              crypto. To make it editable during checkout, uncheck this box)
            </span>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor={currencyId}>Default Currency</label>
              <select
                id={currencyId}
                name="source_currency"
                value={form.source_currency}
                onChange={(event) => {
                  setForm((previous) => ({ ...previous, source_currency: event.target.value }));
                  setStatus(null);
                }}
                disabled={saving}
                className="input"
              >
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
              </select>
            </div>
            <TextField
              label="Default Amount"
              name="source_amount"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              maxLength={16}
              value={form.source_amount}
              onChange={onChange}
              disabled={saving}
              error={errors.amount}
            />
          </div>
        </div>
      </Section>

      {status ? <Alert tone={status.tone}>{status.text}</Alert> : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="btn btn-ghost">Back to Home</Link>
        <button type="submit" disabled={saving} className="btn btn-primary btn-lg sm:min-w-[12rem]">
          {saving ? (
            <>
              <span className="spinner" aria-hidden="true" /> Saving...
            </>
          ) : (
            'Save changes'
          )}
        </button>
      </div>
    </form>
  );
}

export default function CheckoutSettingsPage() {
  const { user, profile, loading, updateProfile } = useRequireAuth('/checkout-settings');

  useEffect(() => {
    document.title = 'Checkout Settings · OmniPurchase';
  }, []);

  if (loading || !user) {
    return (
      <AccountPage title="Checkout Settings">
        <PageLoading />
      </AccountPage>
    );
  }

  return (
    <AccountPage
      title="Checkout Settings"
      description="Fill these in once so checkout is quicker next time. You can change them whenever you like."
    >
      <Link
        href="/reminders"
        className="card card-interactive mb-6 flex items-center justify-between gap-4 p-5"
      >
        <span className="flex items-center gap-4">
          <span className="icon-tile"><BellIcon /></span>
          <span>
            <span className="block font-semibold tracking-tight">Crypto Purchase Reminders</span>
            <span className="block text-sm text-muted">Choose a weekly or monthly email reminder.</span>
          </span>
        </span>
        <ArrowRightIcon className="shrink-0 text-muted" />
      </Link>

      {/* Keyed by user so the form is rebuilt from the right profile after an account switch. */}
      <CheckoutSettingsForm
        key={user.uid}
        email={profile?.email || user.email || ''}
        initial={profile ? formFromProfile(profile) : initialForm}
        onSave={updateProfile}
      />
    </AccountPage>
  );
}
