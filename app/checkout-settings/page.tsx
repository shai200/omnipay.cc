'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AppPage } from '../components/AppPage';
import { Alert } from '../components/ui/Alert';
import { Button, ButtonLink } from '../components/ui/Button';
import { Card, CardHeader } from '../components/ui/Card';
import { Checkbox, SelectField, TextField } from '../components/ui/Field';
import { IconBell, IconCalendar, IconCard, IconUser, IconWallet } from '../components/ui/icons';
import type { PublicProfile } from '@/lib/profile';
import {
  profileFormError,
  profileFormToPayload,
  profileToForm,
  walletAddressError,
  type ProfileFormValues,
} from '@/lib/profile-form';

export default function CheckoutSettingsPage() {
  return (
    <AppPage
      title="Checkout settings"
      description="Fill these in once and checkout is prefilled every time you buy."
      actions={
        <ButtonLink href="/reminders" variant="outline" size="sm" leadingIcon={<IconBell size={16} />}>
          Reminders & alerts
        </ButtonLink>
      }
    >
      <SettingsForm />
    </AppPage>
  );
}

function SettingsForm() {
  const { profile, updateProfile } = useAuth();
  // AppPage renders this only once the profile has loaded, so the initial
  // state is the saved profile, never a blank form.
  const [saved, setSaved] = useState<PublicProfile | null>(profile);
  const [form, setForm] = useState<ProfileFormValues>(() => profileToForm(profile));
  const [status, setStatus] = useState<{ tone: 'success' | 'danger'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [touchedWallets, setTouchedWallets] = useState({ bitcoin: false, ethereum: false });

  // Pick up a profile refreshed elsewhere (e.g. another tab) when not editing.
  if (profile !== saved && !saving) {
    setSaved(profile);
    setForm(profileToForm(profile));
  }

  const btcError = touchedWallets.bitcoin ? walletAddressError('bitcoin', form.wallet_address_bitcoin) : null;
  const ethError = touchedWallets.ethereum ? walletAddressError('ethereum', form.wallet_address_ethereum) : null;
  const dirty = JSON.stringify(form) !== JSON.stringify(profileToForm(saved));

  const set = <K extends keyof ProfileFormValues>(key: K, value: ProfileFormValues[K]) => {
    setStatus(null);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const text = (key: keyof ProfileFormValues) => ({
    name: key,
    value: form[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(key, e.target.value as never),
    disabled: saving,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setTouchedWallets({ bitcoin: true, ethereum: true });

    if (walletAddressError('bitcoin', form.wallet_address_bitcoin) || walletAddressError('ethereum', form.wallet_address_ethereum)) {
      setStatus({ tone: 'danger', text: 'Fix the wallet address before saving.' });
      return;
    }
    const problem = profileFormError(form);
    if (problem) {
      setStatus({ tone: 'danger', text: problem });
      return;
    }

    setSaving(true);
    try {
      await updateProfile(profileFormToPayload(form));
      setStatus({ tone: 'success', text: 'Checkout settings updated successfully.' });
    } catch (err: unknown) {
      setStatus({ tone: 'danger', text: err instanceof Error && err.message ? err.message : 'Failed to update.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 pb-28" noValidate>
      <Card className="p-5 sm:p-7">
        <CardHeader icon={<IconUser size={18} />} title="Personal details" description="Used to prefill Stripe checkout." />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <TextField label="First name" autoComplete="given-name" {...text('first_name')} />
          <TextField label="Last name" autoComplete="family-name" {...text('last_name')} />
        </div>
      </Card>

      <Card className="p-5 sm:p-7">
        <CardHeader
          icon={<IconCalendar size={18} />}
          title="Date of birth"
          description="Required to buy. You must be 18 or older."
        />
        <div className="mt-6 grid max-w-md grid-cols-[1fr_1fr_1.4fr] gap-3">
          <TextField label="Day" inputMode="numeric" maxLength={2} placeholder="DD" autoComplete="bday-day" {...text('dob_day')} />
          <TextField label="Month" inputMode="numeric" maxLength={2} placeholder="MM" autoComplete="bday-month" {...text('dob_month')} />
          <TextField label="Year" inputMode="numeric" maxLength={4} placeholder="YYYY" autoComplete="bday-year" {...text('dob_year')} />
        </div>
      </Card>

      <Card className="p-5 sm:p-7">
        <CardHeader icon={<IconUser size={18} />} title="Address" description="Your residential address." />
        <div className="mt-6 grid gap-4">
          <TextField
            label="Country"
            hint="2-letter code, e.g. US, GB, DE"
            maxLength={2}
            placeholder="US"
            autoComplete="country"
            inputClassName="uppercase max-w-32"
            {...text('address_country')}
          />
          <TextField label="Address line 1" autoComplete="address-line1" {...text('address_line1')} />
          <TextField label="Address line 2" optional autoComplete="address-line2" {...text('address_line2')} />
          <div className="grid gap-4 sm:grid-cols-3">
            <TextField label="City" autoComplete="address-level2" {...text('address_city')} />
            <TextField label="State / region" autoComplete="address-level1" {...text('address_state')} />
            <TextField label="Postal code" autoComplete="postal-code" {...text('address_postal_code')} />
          </div>
        </div>
      </Card>

      <Card className="p-5 sm:p-7">
        <CardHeader
          icon={<IconWallet size={18} />}
          title="Wallets"
          description="Crypto is sent to these addresses. Double-check them — on-chain transfers can’t be reversed."
        />
        <div className="mt-6 grid gap-4">
          <TextField
            label="Bitcoin wallet address"
            placeholder="bc1…"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            inputClassName="font-mono text-sm"
            error={btcError}
            onBlur={() => setTouchedWallets((t) => ({ ...t, bitcoin: true }))}
            {...text('wallet_address_bitcoin')}
          />
          <TextField
            label="Ethereum wallet address"
            placeholder="0x…"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            inputClassName="font-mono text-sm"
            error={ethError}
            onBlur={() => setTouchedWallets((t) => ({ ...t, ethereum: true }))}
            {...text('wallet_address_ethereum')}
          />
          <Checkbox
            label="Lock this wallet address"
            description="This prevents you from being able to change this address when you buy crypto. To make it editable during checkout, uncheck this box."
            checked={form.lock_wallet_address}
            onChange={(e) => set('lock_wallet_address', e.target.checked)}
            disabled={saving}
          />
        </div>
      </Card>

      <Card className="p-5 sm:p-7">
        <CardHeader icon={<IconCard size={18} />} title="Checkout defaults" description="Starting values for the buy form. You can change them in checkout." />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Default currency"
            name="source_currency"
            value={form.source_currency}
            onChange={(e) => set('source_currency', e.target.value)}
            disabled={saving}
          >
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
          </SelectField>
          <TextField
            label="Default amount"
            inputMode="decimal"
            placeholder="100"
            hint="Up to two decimal places."
            inputClassName="tabular"
            {...text('source_amount')}
          />
        </div>
      </Card>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg/85 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="min-h-6 text-sm" aria-live="polite">
            {status ? (
              <Alert tone={status.tone} className="py-2">{status.text}</Alert>
            ) : (
              <span className="text-fg-subtle">{dirty ? 'You have unsaved changes.' : 'All changes saved.'}</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setForm(profileToForm(saved));
                setStatus(null);
                setTouchedWallets({ bitcoin: false, ethereum: false });
              }}
              disabled={!dirty || saving}
            >
              Discard
            </Button>
            <Button type="submit" loading={saving} disabled={!dirty} className="min-w-32">
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
