'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { AccountPage, PageLoading } from '../components/PageShell';
import { Alert } from '../components/ui/Alert';
import { MailIcon, MessageIcon } from '../components/ui/icons';
import { useRequireAuth } from '../hooks';
import type { PublicProfile } from '@/lib/profile';

type Frequency = 'never' | 'weekly' | 'monthly';

type ReminderState = { frequency: Frequency; priceDrop: boolean };

// Display defaults for someone who has never saved a choice: monthly
// selected and price-drop alerts ticked. Nothing is stored until they save.
function stateFromProfile(profile: PublicProfile | null): ReminderState {
  const hasWeekly = profile?.reminder_weekly === true;
  const hasMonthly = profile?.reminder_monthly === true;
  const defaultMonthly = profile?.reminder_monthly === undefined && !hasWeekly;
  return {
    frequency: hasWeekly ? 'weekly' : hasMonthly || defaultMonthly ? 'monthly' : 'never',
    priceDrop: profile?.reminder_price_drop !== false,
  };
}

const FREQUENCIES: { value: Frequency; title: string; detail: string; note?: string }[] = [
  {
    value: 'weekly',
    title: 'Once a week',
    detail: 'Every Monday',
  },
  {
    value: 'monthly',
    title: 'Once a month',
    detail: '1st of each month',
  },
  {
    value: 'never',
    title: 'Never',
    detail: 'No scheduled reminder emails',
  },
];

function RemindersForm({
  initial,
  onSave,
}: {
  initial: ReminderState;
  onSave: (state: ReminderState) => Promise<void>;
}) {
  const [state, setState] = useState(initial);
  const [status, setStatus] = useState<{ tone: 'success' | 'danger'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    setStatus(null);
    setSaving(true);
    try {
      await onSave(state);
      setStatus({ tone: 'success', text: 'Reminder preferences updated successfully!' });
    } catch (err: unknown) {
      setStatus({
        tone: 'danger',
        text: err instanceof Error && err.message ? err.message : 'Failed to update reminders.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <section className="card p-5 sm:p-7">
        <fieldset disabled={saving}>
          <legend className="text-lg font-semibold tracking-tight">Regular Purchase Reminders</legend>
          <p className="mt-1 text-sm text-muted">
            Choose how often you want to be reminded to buy crypto. A reminder is only an email: nothing is
            bought until you complete checkout yourself.
          </p>
          <div className="mt-5 space-y-3">
            {FREQUENCIES.map((option) => (
              <label key={option.value} className="choice">
                <input
                  type="radio"
                  name="reminder_frequency"
                  value={option.value}
                  checked={state.frequency === option.value}
                  onChange={() => {
                    setState((previous) => ({ ...previous, frequency: option.value }));
                    setStatus(null);
                  }}
                />
                <span>
                  <span className="block font-semibold">{option.title}</span>
                  <span className="block text-sm text-muted">{option.detail}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section className="card p-5 sm:p-7">
        <fieldset disabled={saving}>
          <legend className="flex flex-wrap items-center gap-2 text-lg font-semibold tracking-tight">
            Price-drop alerts
            <span className="badge badge-warning">Coming soon</span>
            <span className="badge badge-success">Free</span>
          </legend>
          <p className="mt-1 text-sm text-muted">
            Price-drop emails are not being sent yet. Save your preference now and it will apply when they
            launch.
          </p>
          <label className="choice mt-5">
            <input
              type="checkbox"
              name="reminder_price_drop"
              checked={state.priceDrop}
              onChange={(event) => {
                setState((previous) => ({ ...previous, priceDrop: event.target.checked }));
                setStatus(null);
              }}
            />
            <span className="font-medium">Alert me after sharp price drops (more than 10%)</span>
          </label>
        </fieldset>
      </section>

      {status ? <Alert tone={status.tone}>{status.text}</Alert> : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="btn btn-ghost">Back to Home</Link>
        <button type="submit" disabled={saving} className="btn btn-primary btn-lg sm:min-w-[14rem]">
          {saving ? (
            <>
              <span className="spinner" aria-hidden="true" /> Saving...
            </>
          ) : (
            'Save Reminder Preferences'
          )}
        </button>
      </div>
    </form>
  );
}

export default function RemindersPage() {
  const { user, profile, loading, updateProfile } = useRequireAuth('/reminders');

  useEffect(() => {
    document.title = 'Reminders · OmniPurchase';
  }, []);

  if (loading || !user) {
    return (
      <AccountPage title="Crypto Purchase Reminders">
        <PageLoading />
      </AccountPage>
    );
  }

  return (
    <AccountPage
      title="Crypto Purchase Reminders"
      description="Optional emails that remind you to make a purchase on the schedule you choose."
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="card flex gap-4 p-5">
          <span className="icon-tile"><MailIcon /></span>
          <div>
            <h2 className="font-semibold tracking-tight">Make sure they reach you</h2>
            <p className="mt-1 text-sm text-muted">
              Reminders are sent to {user.email || 'your account email'}. Add an inbox filter or mark them as
              important so they are not missed.
            </p>
          </div>
        </div>
        <div className="card flex gap-4 border-dashed p-5">
          <span className="icon-tile icon-tile-accent"><MessageIcon /></span>
          <div>
            <h2 className="flex flex-wrap items-center gap-2 font-semibold tracking-tight">
              SMS and WhatsApp <span className="badge badge-warning">Coming soon</span>
            </h2>
            <p className="mt-1 text-sm text-muted">
              SMS and WhatsApp notifications are planned. For now, reminders are sent by email.
            </p>
          </div>
        </div>
      </div>

      <RemindersForm
        key={user.uid}
        initial={stateFromProfile(profile)}
        onSave={(state) =>
          updateProfile({
            reminder_weekly: state.frequency === 'weekly',
            reminder_monthly: state.frequency === 'monthly',
            reminder_price_drop: state.priceDrop,
          })
        }
      />

      <p className="mt-8 text-sm text-muted">
        Reminders are a convenience, not financial advice. Cryptocurrency prices can fluctuate dramatically,
        and you may lose value. See the <Link href="/TermsOfService" className="link">Terms of Service</Link>.
      </p>
    </AccountPage>
  );
}
