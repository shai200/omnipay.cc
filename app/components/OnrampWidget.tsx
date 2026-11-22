'use client';

import { useEffect, useRef, useState } from 'react';
import { loadStripeOnramp, type OnrampSession, type OnrampSessionResult } from '@stripe/crypto';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Alert } from './ui/Alert';
import { Button, ButtonLink } from './ui/Button';
import { Spinner } from './ui/Spinner';
import { IconLock } from './ui/icons';

type OnrampSnapshot = OnrampSessionResult;

interface OnrampWidgetProps {
  walletAddress?: string;
  /** Decimal string as stored on the profile (e.g. "100" or "25.50"). */
  sourceAmount?: string;
  sourceCurrency?: string;
  destinationCurrency?: string;
  destinationNetwork?: string;
}

const UNAVAILABLE = 'Crypto purchases are currently unavailable. Please try again later.';
const DOB_REQUIRED = 'A valid date of birth is required.';

export default function OnrampWidget({
  walletAddress,
  sourceAmount,
  sourceCurrency,
  destinationCurrency,
  destinationNetwork,
}: OnrampWidgetProps) {
  const { theme } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const onrampRef = useRef<HTMLDivElement>(null);
  const onrampSessionRef = useRef<OnrampSession | null>(null);
  const themeRef = useRef(theme);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const uid = user?.uid;

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    if (authLoading || !uid) return;
    const container = onrampRef.current;
    if (!container) return;

    let cancelled = false;

    const initializeOnramp = async () => {
      try {
        setLoading(true);
        setError(null);
        container.innerHTML = '';

        const response = await fetch('/api/onramp-session', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress,
            sourceAmount,
            sourceCurrency,
            destinationCurrency,
            destinationNetwork,
          }),
        });

        if (cancelled) return;

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({})) as { error?: unknown };
          const errorMessage = typeof errorData.error === 'string' ? errorData.error : 'Failed to create onramp session';
          if (errorMessage.includes('Crypto onramp is not enabled') || errorMessage.includes('currently unavailable')) {
            throw new Error(UNAVAILABLE);
          }
          throw new Error(errorMessage);
        }

        const { clientSecret } = await response.json() as { clientSecret: string };

        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        if (!publishableKey) {
          throw new Error('Stripe publishable key not found');
        }

        const stripeOnramp = await loadStripeOnramp(publishableKey);
        if (!stripeOnramp) {
          throw new Error('Failed to load Stripe Onramp');
        }
        if (cancelled) return;

        const onrampSession = stripeOnramp.createSession({
          clientSecret,
          appearance: { theme: themeRef.current },
        });
        onrampSessionRef.current = onrampSession;

        // Display only. Purchase status is recorded from the signed Stripe webhook.
        onrampSession.addEventListener('onramp_session_updated', (event) => {
          const session = event.payload.session as OnrampSnapshot;
          console.log('Onramp session updated', { sessionId: session.id, status: session.status });
        });

        onrampSession.mount(container);
        if (!cancelled) setLoading(false);
      } catch (err: unknown) {
        console.error('Error initializing onramp');
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to initialize onramp');
          setLoading(false);
        }
      }
    };

    void initializeOnramp();

    return () => {
      cancelled = true;
      const currentSession = onrampSessionRef.current;
      onrampSessionRef.current = null;
      if (currentSession && 'unmount' in currentSession && typeof currentSession.unmount === 'function') {
        try {
          currentSession.unmount();
        } catch {
          // Already unmounted.
        }
      }
      container.innerHTML = '';
    };
  }, [authLoading, uid, walletAddress, sourceAmount, sourceCurrency, destinationCurrency, destinationNetwork, attempt]);

  if (authLoading) {
    return <WidgetSkeleton />;
  }

  if (!user) {
    return (
      <div className="px-6 pb-6 pt-2 text-center sm:px-8" data-testid="onramp-sign-in">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand-soft text-brand-soft-fg">
          <IconLock size={22} />
        </div>
        <p className="mx-auto mt-4 max-w-xs text-sm text-fg-muted">
          Sign in to buy crypto and send it to your wallet.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <ButtonLink href="/auth/register" block>
            Register
          </ButtonLink>
          <ButtonLink href="/auth/login" variant="outline" block>
            Sign in
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {error && (
        <div className="px-4 pb-4 sm:px-6">
          <Alert
            tone={error === DOB_REQUIRED ? 'warning' : 'danger'}
            title={error === DOB_REQUIRED ? 'Add your date of birth to continue' : 'Checkout could not start'}
          >
            <p>{error}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {error === DOB_REQUIRED ? (
                <ButtonLink href="/checkout-settings" size="sm">
                  Open checkout settings
                </ButtonLink>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setAttempt((value) => value + 1)}>
                  Try again
                </Button>
              )}
            </div>
          </Alert>
        </div>
      )}
      <div className="relative">
        {loading && !error && <WidgetSkeleton overlay />}
        <div
          ref={onrampRef}
          className={error ? 'hidden' : 'min-h-[600px] px-2 sm:px-4'}
          data-onramp-container
        />
      </div>
    </div>
  );
}

function WidgetSkeleton({ overlay = false }: { overlay?: boolean }) {
  return (
    <div
      className={
        overlay
          ? 'absolute inset-0 z-10 flex flex-col gap-4 bg-surface px-6 pt-2'
          : 'flex min-h-[420px] flex-col gap-4 px-6 pt-2'
      }
    >
      <div className="flex items-center gap-2 text-sm text-fg-subtle">
        <Spinner size={16} label="Loading secure checkout" />
        <span aria-hidden>Loading secure checkout…</span>
      </div>
      <div className="h-24 animate-pulse rounded-lg bg-surface-2" />
      <div className="h-24 animate-pulse rounded-lg bg-surface-2" />
      <div className="h-12 animate-pulse rounded-lg bg-surface-2" />
    </div>
  );
}
