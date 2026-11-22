'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { loadStripeOnramp, type OnrampSession } from '@stripe/crypto';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Alert } from './ui/Alert';

interface OnrampWidgetProps {
  walletAddress?: string;
  sourceAmount?: number;
  sourceCurrency?: string;
  destinationCurrency?: string;
  destinationNetwork?: string;
}

type WidgetError = { message: string; needsDob: boolean };

// Returned by the API when the profile has no usable date of birth. The
// 18+ check itself stays on the server; this only decides which help to show.
const DOB_REQUIRED = 'A valid date of birth is required.';
const UNAVAILABLE = 'Crypto purchases are currently unavailable. Please try again later.';

type AppearanceCapable = { setAppearance: (appearance: { theme: 'light' | 'dark' }) => void };

function canSetAppearance(session: unknown): session is AppearanceCapable {
  return typeof (session as Partial<AppearanceCapable> | null)?.setAppearance === 'function';
}

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

  const [error, setError] = useState<WidgetError | null>(null);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  const userId = user?.uid ?? null;

  // Keep the embedded Stripe UI in step with the site theme without
  // creating a new session.
  useEffect(() => {
    themeRef.current = theme;
    const session = onrampSessionRef.current;
    if (canSetAppearance(session)) {
      try {
        session.setAppearance({ theme });
      } catch {
        // Older onramp builds: the theme applies on the next session.
      }
    }
  }, [theme]);

  useEffect(() => {
    if (authLoading || !userId) return;
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
          headers: {
            'Content-Type': 'application/json',
          },
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
          const errorMessage = typeof errorData.error === 'string' && errorData.error
            ? errorData.error
            : 'Failed to create onramp session';

          if (errorMessage.includes('Crypto onramp is not enabled') || errorMessage.includes('currently unavailable')) {
            throw new Error(UNAVAILABLE);
          }

          throw new Error(errorMessage);
        }

        const { clientSecret } = await response.json() as { clientSecret: string };

        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        if (!publishableKey) {
          throw new Error(UNAVAILABLE);
        }

        const stripeOnramp = await loadStripeOnramp(publishableKey);

        if (!stripeOnramp) {
          throw new Error('Failed to load Stripe Onramp');
        }

        if (cancelled) return;

        const onrampSession = stripeOnramp.createSession({
          clientSecret,
          appearance: {
            theme: themeRef.current,
          },
        });

        onrampSessionRef.current = onrampSession;
        onrampSession.mount(container);

        if (!cancelled) {
          setLoading(false);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to initialize onramp';
          setError({ message, needsDob: message === DOB_REQUIRED });
          setLoading(false);
        }
      }
    };

    void initializeOnramp();

    return () => {
      cancelled = true;
      const currentSession = onrampSessionRef.current as (OnrampSession & { unmount?: () => void }) | null;
      onrampSessionRef.current = null;
      if (currentSession && typeof currentSession.unmount === 'function') {
        try {
          currentSession.unmount();
        } catch {
          // The container is cleared below either way.
        }
      }
      container.innerHTML = '';
    };
  }, [authLoading, userId, walletAddress, sourceAmount, sourceCurrency, destinationCurrency, destinationNetwork, attempt]);

  if (!authLoading && !user) {
    return (
      <div className="text-center" data-testid="onramp-sign-in">
        <p className="mb-4 text-muted">
          Sign in to buy crypto and send it to your wallet.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/auth/register" className="btn btn-primary">Register</Link>
          <Link href="/auth/login" className="btn btn-secondary">Sign in</Link>
        </div>
      </div>
    );
  }

  const busy = authLoading || loading;

  return (
    <div className="w-full">
      {error ? (
        error.needsDob ? (
          <Alert tone="info">
            <p className="font-semibold">Add your date of birth to continue</p>
            <p className="mt-1 text-muted">
              You must be at least 18 years old to use this service, so we need your date of birth before
              checkout can start.
            </p>
            <Link href="/checkout-settings" className="btn btn-primary btn-sm mt-3">
              Open Checkout Settings
            </Link>
          </Alert>
        ) : (
          <Alert tone="danger">
            <p>{error.message}</p>
            <button
              type="button"
              className="btn btn-secondary btn-sm mt-3"
              onClick={() => setAttempt((value) => value + 1)}
            >
              Try again
            </button>
          </Alert>
        )
      ) : null}

      {busy && !error ? (
        <div className="space-y-3" role="status" aria-label="Loading secure checkout">
          <div className="skeleton h-12 w-full" />
          <div className="skeleton h-12 w-full" />
          <div className="skeleton h-24 w-full" />
          <div className="skeleton h-12 w-full" />
          <p className="pt-1 text-center text-sm text-muted">Loading secure checkout…</p>
        </div>
      ) : null}

      {/* Stripe mounts its iframe here. It stays rendered (never display:none) while loading so the iframe can size itself. */}
      <div
        ref={onrampRef}
        className={error ? 'hidden' : busy ? '' : 'min-h-[560px] overflow-hidden rounded-xl'}
        data-onramp-container
      />
    </div>
  );
}
