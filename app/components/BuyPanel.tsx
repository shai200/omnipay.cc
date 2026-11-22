'use client';

import Link from 'next/link';
import OnrampWidget from './OnrampWidget';
import { useAuth } from '../contexts/AuthContext';
import { walletAddressForNetwork } from '@/lib/wallet';
import { BitcoinIcon, CardIcon, CheckCircleIcon, CircleIcon, LockIcon, WalletIcon } from './ui/icons';

function Step({ done, children, href, action }: { done: boolean; children: React.ReactNode; href: string; action: string }) {
  return (
    <li className="flex items-center justify-between gap-3 py-2.5">
      <span className="flex items-center gap-2.5 text-sm">
        {done ? (
          <CheckCircleIcon size={18} className="text-success" title="Done" />
        ) : (
          <CircleIcon size={18} className="text-muted" title="Not done yet" />
        )}
        <span className={done ? 'text-muted' : 'text-fg'}>{children}</span>
      </span>
      {done ? null : (
        <Link href={href} className="link shrink-0 text-sm">{action}</Link>
      )}
    </li>
  );
}

// Signed-in summary of what checkout will use, with links to fix what is missing.
function AccountSummary() {
  const { profile } = useAuth();
  const hasDob = Boolean(profile?.dob?.year && profile.dob.month && profile.dob.day);
  const hasWallet = Boolean(walletAddressForNetwork(profile?.wallet_addresses, 'bitcoin'));
  const hasReminder = profile?.reminder_weekly === true || profile?.reminder_monthly === true;
  if (hasDob && hasWallet && hasReminder) return null;

  return (
    <section aria-labelledby="setup-heading" className="mb-5 rounded-xl border border-line bg-surface-2 px-4 py-3">
      <h3 id="setup-heading" className="text-sm font-semibold text-fg">Finish setting up</h3>
      <ul className="mt-1 divide-y divide-line">
        <Step done={hasDob} href="/checkout-settings" action="Add">
          Date of birth <span className="text-muted">(required, 18+)</span>
        </Step>
        <Step done={hasWallet} href="/checkout-settings" action="Add">
          Bitcoin wallet address
        </Step>
        <Step done={hasReminder} href="/reminders" action="Set up">
          Purchase reminders
        </Step>
      </ul>
    </section>
  );
}

function SignedOutPreview() {
  return (
    <div>
      <ol className="space-y-3">
        {[
          { icon: <CardIcon size={18} />, title: 'Pay with any credit or debit card', body: 'Checkout is handled by Stripe.' },
          { icon: <WalletIcon size={18} />, title: 'Sent directly to your wallet', body: 'You keep full control of your crypto.' },
          { icon: <LockIcon size={18} />, title: 'Identity checks by Stripe', body: 'For adults aged 18 and above.' },
        ].map((item) => (
          <li key={item.title} className="flex items-start gap-3 rounded-xl border border-line bg-surface-2 p-3.5">
            <span className="icon-tile !h-9 !w-9">{item.icon}</span>
            <span>
              <span className="block text-sm font-semibold text-fg">{item.title}</span>
              <span className="block text-sm text-muted">{item.body}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2" data-testid="onramp-sign-in">
        <Link href="/auth/register" className="btn btn-primary btn-lg">Register</Link>
        <Link href="/auth/login" className="btn btn-secondary btn-lg">Sign in</Link>
      </div>
      <p className="mt-3 text-center text-sm text-muted">
        Sign in to buy crypto and send it to your wallet.
      </p>
    </div>
  );
}

export function BuyPanel() {
  const { user, profile, loading } = useAuth();

  return (
    <div id="buy" className="card card-raised mx-auto w-full max-w-[536px] scroll-mt-24 p-5 sm:p-7">
      <div className="mb-5 flex items-start gap-3.5">
        <BitcoinIcon size={40} className="shrink-0" />
        <div>
          <h2 className="text-heading">Buy Crypto, Sent Directly to Your Wallet</h2>
          <p className="mt-1 text-sm text-muted">
            Use any credit or debit card. Keep full control - crypto goes straight to your wallet.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3" role="status" aria-label="Loading">
          <div className="skeleton h-12 w-full" />
          <div className="skeleton h-12 w-full" />
          <div className="skeleton h-28 w-full" />
        </div>
      ) : user ? (
        <>
          <AccountSummary />
          <OnrampWidget
            key={`${profile?.source_amount}-${profile?.source_currency}`}
            walletAddress={walletAddressForNetwork(profile?.wallet_addresses, 'bitcoin')}
            sourceAmount={profile?.source_amount ? Number(profile.source_amount) : 100}
            sourceCurrency={profile?.source_currency || 'usd'}
            destinationCurrency="btc"
            destinationNetwork="bitcoin"
          />
        </>
      ) : (
        <SignedOutPreview />
      )}

      <p className="mt-5 flex items-center justify-center gap-2 border-t border-line pt-4 text-xs text-muted">
        <LockIcon size={14} />
        Payments and identity verification are processed by Stripe.
      </p>
    </div>
  );
}
