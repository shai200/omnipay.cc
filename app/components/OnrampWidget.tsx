'use client';

import { useEffect, useRef, useState } from 'react';
import { loadStripeOnramp, type OnrampSession, type OnrampSessionResult } from '@stripe/crypto';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

type OnrampSnapshot = OnrampSessionResult;

interface OnrampWidgetProps {
  walletAddress?: string;
  sourceAmount?: number;
  sourceCurrency?: string;
  destinationCurrency?: string;
  destinationNetwork?: string;
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
  const userRef = useRef(user);
  themeRef.current = theme;
  userRef.current = user;

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    const activeUser = userRef.current;
    if (!activeUser) {
      setLoading(false);
      return;
    }

    const container = onrampRef.current;
    if (!container) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const initializeOnramp = async () => {
      try {
        setLoading(true);
        setError(null);
        container.innerHTML = '';

        const token = await activeUser.getIdToken();
        if (cancelled) return;

        const response = await fetch('/api/onramp-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
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
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error || 'Failed to create onramp session';

          if (errorMessage.includes('Crypto onramp is not enabled') || errorMessage.includes('currently unavailable')) {
            throw new Error('Crypto purchases are currently unavailable. Please try again later.');
          }

          throw new Error(errorMessage);
        }

        const { clientSecret } = await response.json();

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
          appearance: {
            theme: themeRef.current,
          },
        });

        onrampSessionRef.current = onrampSession;

        onrampSession.addEventListener('onramp_session_updated', (event) => {
          const session = event.payload.session as OnrampSnapshot;
          const status = session.status;
          const sessionId = session.id;

          console.log('Onramp session updated', { sessionId, status });

          if (status === 'fulfillment_complete') {
            console.log('Crypto purchase completed!');
          } else if (status === 'rejected') {
            console.log('Transaction rejected');
          } else if (status === 'requires_payment') {
            console.log('Customer ready to pay - cart active');
          } else if (status === 'fulfillment_processing') {
            console.log('Payment successful, processing crypto delivery');
          } else if (status === 'initialized') {
            console.log('Session initialized');
          }
        });

        onrampSession.mount(container);
        console.log('Onramp widget mounted');

        if (!cancelled) {
          setLoading(false);
        }
      } catch (err: unknown) {
        console.error('Error initializing onramp:', err);
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Failed to initialize onramp';
          setError(message);
          setLoading(false);
        }
      }
    };

    initializeOnramp();

    return () => {
      cancelled = true;
      const currentSession = onrampSessionRef.current;
      if (currentSession && 'unmount' in currentSession && typeof currentSession.unmount === 'function') {
        try {
          currentSession.unmount();
        } catch (unmountError: unknown) {
          console.log('Error unmounting onramp session:', unmountError);
        }
      }
      container.innerHTML = '';
    };
  }, [authLoading, user?.uid, walletAddress, sourceAmount, sourceCurrency, destinationCurrency, destinationNetwork]);

  if (!authLoading && !user) {
    return (
      <div className="px-8 pb-4 text-center" data-testid="onramp-sign-in">
        <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
          Sign in to buy crypto and send it to your wallet.
        </p>
        <div className="flex items-center justify-center gap-3">
          <a
            href="/auth/register"
            className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: 'var(--accent)', color: '#ffffff' }}
          >
            Register
          </a>
          <a
            href="/auth/login"
            className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: 'var(--card-border)', color: 'var(--foreground)' }}
          >
            Sign in
          </a>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {(authLoading || loading) && (
        <div className="flex items-center justify-center p-8">
          <div style={{ color: 'var(--text-secondary)' }}>Loading onramp widget...</div>
        </div>
      )}
      <div
        ref={onrampRef}
        className="min-h-[600px] rounded-lg p-4"
        style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--card-border)'
        }}
        data-onramp-container
      />
    </div>
  );
}
