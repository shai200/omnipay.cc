'use client';

import Link from 'next/link';
import OnrampWidget from './OnrampWidget';
import { useAuth } from '../contexts/AuthContext';
import { walletAddressForNetwork } from '@/lib/wallet';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';
import { IconBitcoin, IconWallet } from './ui/icons';

function shortAddress(address: string): string {
  return address.length > 16 ? `${address.slice(0, 8)}…${address.slice(-6)}` : address;
}

export function BuyPanel() {
  const { user, profile, loading } = useAuth();
  const wallet = walletAddressForNetwork(profile?.wallet_addresses, 'bitcoin');

  return (
    <Card elevated className="relative overflow-hidden">
      <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#f7931a]/12 text-[#b45309] dark:text-[#fbbf24]">
            <IconBitcoin size={22} />
          </span>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-fg">Buy Bitcoin</h2>
            <p className="text-sm text-fg-muted">Credit or debit card · checkout by Stripe</p>
          </div>
        </div>
        <Badge tone="success" dot>
          Secure
        </Badge>
      </div>

      {user && !loading && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-6 pt-4 text-sm sm:px-8">
          <span className="inline-flex min-w-0 items-center gap-2 text-fg-muted">
            <IconWallet size={16} className="shrink-0" />
            {wallet ? (
              <>
                <span className="sr-only">Sending to saved wallet</span>
                <span className="truncate font-mono text-xs text-fg" title={wallet}>
                  {shortAddress(wallet)}
                </span>
              </>
            ) : (
              <span>No saved Bitcoin wallet</span>
            )}
          </span>
          <Link
            href="/checkout-settings"
            className="font-medium text-brand underline-offset-4 hover:underline"
          >
            {wallet ? 'Change' : 'Add wallet'}
          </Link>
        </div>
      )}

      <div className="pt-4">
        <OnrampWidget
          walletAddress={wallet}
          sourceAmount={profile?.source_amount || '100'}
          sourceCurrency={profile?.source_currency || 'usd'}
          destinationCurrency="btc"
          destinationNetwork="bitcoin"
        />
      </div>
    </Card>
  );
}
