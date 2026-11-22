'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { AppPage } from '../components/AppPage';
import { Badge } from '../components/ui/Badge';
import { ButtonLink } from '../components/ui/Button';
import { Card, CardHeader } from '../components/ui/Card';
import {
  IconArrowRight,
  IconBell,
  IconBitcoin,
  IconCalendar,
  IconCheck,
  IconSettings,
  IconWallet,
} from '../components/ui/icons';
import { dobEligibility } from '@/lib/age';
import type { PublicProfile } from '@/lib/profile';
import { walletAddressForNetwork } from '@/lib/wallet';
import { cn } from '@/lib/cn';

type Check = { label: string; done: boolean; required?: boolean; hint: string };

function readiness(profile: PublicProfile | null): Check[] {
  const address = profile?.address;
  return [
    {
      label: 'Date of birth',
      done: dobEligibility(profile?.dob).ok,
      required: true,
      hint: 'Required to buy (18+).',
    },
    {
      label: 'Bitcoin wallet',
      done: Boolean(walletAddressForNetwork(profile?.wallet_addresses, 'bitcoin')),
      hint: 'Saves pasting it at checkout.',
    },
    {
      label: 'Name',
      done: Boolean(profile?.first_name && profile?.last_name),
      hint: 'Prefills checkout.',
    },
    {
      label: 'Address',
      done: Boolean(address?.country && address?.line1 && address?.city),
      hint: 'Prefills checkout.',
    },
  ];
}

function reminderSummary(profile: PublicProfile | null): string {
  if (profile?.reminder_weekly) return 'Weekly, every Monday';
  if (profile?.reminder_monthly) return 'Monthly, on the 1st';
  if (profile?.reminder_monthly === undefined) return 'Monthly (default)';
  return 'Off';
}

export default function DashboardPage() {
  const { profile } = useAuth();
  const name = profile?.first_name;
  return (
    <AppPage
      title={name ? `Welcome back, ${name}` : 'Your dashboard'}
      description="Everything you need to buy Bitcoin and stay on your plan."
      actions={
        <ButtonLink href="/#buy" trailingIcon={<IconArrowRight size={16} />}>
          Buy Bitcoin
        </ButtonLink>
      }
    >
      <Dashboard />
    </AppPage>
  );
}

function Dashboard() {
  const { user, profile } = useAuth();
  const checks = readiness(profile);
  const done = checks.filter((check) => check.done).length;
  const canBuy = checks.every((check) => !check.required || check.done);
  const wallet = walletAddressForNetwork(profile?.wallet_addresses, 'bitcoin');
  const percent = Math.round((done / checks.length) * 100);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <Card className="p-5 sm:p-7 lg:row-span-2">
        <CardHeader
          title="Checkout readiness"
          description={canBuy ? 'You’re ready to buy.' : 'Add your date of birth to start buying.'}
          action={<Badge tone={canBuy ? 'success' : 'warning'} dot>{canBuy ? 'Ready' : 'Action needed'}</Badge>}
        />
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-fg-muted">Profile complete</span>
            <span className="tabular font-medium text-fg">{percent}%</span>
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2"
            role="progressbar"
            aria-label="Profile complete"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="h-full rounded-full bg-brand transition-[width] duration-700 ease-out" style={{ width: `${percent}%` }} />
          </div>
        </div>
        <ul className="mt-6 divide-y divide-border">
          {checks.map((check) => (
            <li key={check.label} className="flex items-center gap-3 py-3.5">
              <span
                className={cn(
                  'inline-flex size-6 shrink-0 items-center justify-center rounded-full border',
                  check.done ? 'border-transparent bg-success-soft text-success' : 'border-border-strong text-transparent',
                )}
              >
                <IconCheck size={14} strokeWidth={2.5} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-fg">
                  {check.label}
                  {check.required && <span className="ml-2 text-xs font-normal text-fg-subtle">Required</span>}
                </p>
                <p className="text-sm text-fg-subtle">{check.done ? 'Done' : check.hint}</p>
              </div>
              <span className="sr-only">{check.done ? 'Complete' : 'Not complete'}</span>
            </li>
          ))}
        </ul>
        <ButtonLink href="/checkout-settings" variant="outline" block className="mt-4" leadingIcon={<IconSettings size={16} />}>
          {done === checks.length ? 'Review checkout settings' : 'Complete checkout settings'}
        </ButtonLink>
      </Card>

      <Card className="p-5 sm:p-6">
        <CardHeader icon={<IconWallet size={18} />} title="Bitcoin wallet" titleAs="h2" />
        {wallet ? (
          <p className="mt-4 break-all rounded-md bg-surface-2 px-3 py-2.5 font-mono text-xs text-fg">{wallet}</p>
        ) : (
          <p className="mt-4 text-sm text-fg-muted">No wallet saved. You can still enter one during checkout.</p>
        )}
        <Link href="/checkout-settings" className="mt-4 inline-flex text-sm font-medium text-brand underline-offset-4 hover:underline">
          {wallet ? 'Change wallet' : 'Add a wallet'}
        </Link>
      </Card>

      <Card className="p-5 sm:p-6">
        <CardHeader icon={<IconBell size={18} />} title="Reminders & alerts" />
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-fg-muted">Purchase reminder</dt>
            <dd className="font-medium text-fg">{reminderSummary(profile)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-fg-muted">Price-drop alerts</dt>
            <dd className="font-medium text-fg">{profile?.reminder_price_drop === false ? 'Off' : 'On'}</dd>
          </div>
        </dl>
        <Link href="/reminders" className="mt-4 inline-flex text-sm font-medium text-brand underline-offset-4 hover:underline">
          Manage reminders
        </Link>
      </Card>

      <Card className="p-5 sm:p-6 lg:col-span-2">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#f7931a]/12 text-[#b45309] dark:text-[#fbbf24]">
              <IconBitcoin size={22} />
            </span>
            <div>
              <h2 className="font-semibold tracking-tight text-fg">Buy Bitcoin</h2>
              <p className="text-sm text-fg-muted">
                Default {(profile?.source_currency || 'usd').toUpperCase()}{' '}
                <span className="tabular">{profile?.source_amount || '100'}</span>
                {' · '}checkout by Stripe
              </p>
            </div>
          </div>
          <ButtonLink href="/#buy" trailingIcon={<IconArrowRight size={16} />}>
            Go to checkout
          </ButtonLink>
        </div>
      </Card>

      <Card className="border-dashed p-5 sm:p-6 lg:col-span-2">
        <CardHeader
          icon={<IconCalendar size={18} />}
          title="Coming to OmniPurchase"
          description="SMS & WhatsApp alerts and a monthly Bitcoin savings plan are on our roadmap. Not available yet."
        />
      </Card>

      <p className="text-sm text-fg-subtle lg:col-span-2">Signed in as {user?.email}</p>
    </div>
  );
}
