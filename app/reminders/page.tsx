'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AppPage } from '../components/AppPage';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardHeader } from '../components/ui/Card';
import { Checkbox, RadioCard } from '../components/ui/Field';
import { IconCalendar, IconMail, IconMessage, IconTrendDown } from '../components/ui/icons';
import type { PublicProfile } from '@/lib/profile';

type Frequency = 'never' | 'weekly' | 'monthly';

// Null in the database means "not chosen yet"; the page shows monthly as the
// default in that case, as it always has.
function initialPrefs(profile: PublicProfile | null) {
  const weekly = profile?.reminder_weekly === true;
  const monthly = profile?.reminder_monthly === true;
  const defaultMonthly = profile?.reminder_monthly === undefined && !weekly;
  const frequency: Frequency = weekly ? 'weekly' : monthly || defaultMonthly ? 'monthly' : 'never';
  return { frequency, priceDrop: profile?.reminder_price_drop !== false };
}

export default function RemindersPage() {
  return (
    <AppPage
      title="Reminders & alerts"
      description="Choose the emails that help you stick to your own plan. You can change or turn them off any time."
    >
      <RemindersForm />
    </AppPage>
  );
}

function RemindersForm() {
  const { profile, updateProfile } = useAuth();
  const [initial] = useState(() => initialPrefs(profile));
  const [frequency, setFrequency] = useState<Frequency>(initial.frequency);
  const [priceDrop, setPriceDrop] = useState(initial.priceDrop);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ tone: 'success' | 'danger'; text: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setSaving(true);
    try {
      await updateProfile({
        reminder_weekly: frequency === 'weekly',
        reminder_monthly: frequency === 'monthly',
        reminder_price_drop: priceDrop,
      });
      setStatus({ tone: 'success', text: 'Reminder preferences updated successfully.' });
    } catch (err: unknown) {
      setStatus({ tone: 'danger', text: err instanceof Error && err.message ? err.message : 'Failed to update reminders.' });
    } finally {
      setSaving(false);
    }
  };

  const change = (value: Frequency) => {
    setStatus(null);
    setFrequency(value);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <Card className="p-5 sm:p-7">
        <CardHeader
          icon={<IconCalendar size={18} />}
          title="Purchase reminders"
          description="A short email reminding you of the plan you set. It never buys anything for you."
        />
        <fieldset className="mt-6">
          <legend className="sr-only">Reminder frequency</legend>
          <div className="grid gap-3">
            <RadioCard
              name="reminder_frequency"
              value="weekly"
              checked={frequency === 'weekly'}
              onChange={() => change('weekly')}
              disabled={saving}
              label="Once a week"
              description="Every Monday."
            />
            <RadioCard
              name="reminder_frequency"
              value="monthly"
              checked={frequency === 'monthly'}
              onChange={() => change('monthly')}
              disabled={saving}
              label="Once a month"
              description="On the 1st of each month."
            />
            <RadioCard
              name="reminder_frequency"
              value="never"
              checked={frequency === 'never'}
              onChange={() => change('never')}
              disabled={saving}
              label="Never"
              description="No purchase reminder emails."
            />
          </div>
        </fieldset>
      </Card>

      <Card className="p-5 sm:p-7">
        <CardHeader
          icon={<IconTrendDown size={18} />}
          title="Price-drop alerts"
          description="Informational only — an alert is not a recommendation to buy."
          action={<Badge tone="brand">Rolling out</Badge>}
        />
        <Checkbox
          className="mt-6"
          label="Alert me after sharp price drops (more than 10%)"
          description="Free email alert when the Bitcoin price falls sharply."
          checked={priceDrop}
          onChange={(e) => {
            setStatus(null);
            setPriceDrop(e.target.checked);
          }}
          disabled={saving}
        />
      </Card>

      <Card className="flex items-start gap-3 border-dashed p-5 sm:p-6">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-surface-2 text-fg-muted">
          <IconMessage size={18} />
        </span>
        <div>
          <p className="flex flex-wrap items-center gap-2 font-medium text-fg">
            SMS and WhatsApp notifications <Badge>Coming soon</Badge>
          </p>
          <p className="mt-1 text-sm text-fg-muted">Get the same reminders and alerts by text message.</p>
        </div>
      </Card>

      <div className="flex items-start gap-3 rounded-lg bg-surface-2 p-4 text-sm text-fg-muted">
        <IconMail size={18} className="mt-0.5 shrink-0" />
        <p>
          Tip: add our emails to your contacts or a priority folder so reminders don’t land in spam.
        </p>
      </div>

      {status && <Alert tone={status.tone}>{status.text}</Alert>}

      <div className="flex justify-end">
        <Button type="submit" size="lg" loading={saving} className="w-full sm:w-auto sm:min-w-48">
          {saving ? 'Saving…' : 'Save preferences'}
        </Button>
      </div>
    </form>
  );
}
