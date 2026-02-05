'use client';

import { useEffect, useRef, useState } from 'react';
import { loadStripeOnramp } from '@stripe/crypto';
import { useTheme } from '../contexts/ThemeContext';

interface OnrampWidgetProps {
  walletAddress?: string;
  sourceAmount?: number;
  destinationCurrency?: string;
  destinationNetwork?: string;
}

export default function OnrampWidget({
  walletAddress,
  sourceAmount,
  destinationCurrency,
  destinationNetwork,
}: OnrampWidgetProps) {
  const { theme } = useTheme();
  const onrampRef = useRef<HTMLDivElement>(null);
  const onrampSessionRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeOnramp = async () => {
      try {
        setLoading(true);
        setError(null);

        // Clean up previous widget if it exists
        if (onrampRef.current) {
          onrampRef.current.innerHTML = '';
        }

        // Create onramp session on the server
        const response = await fetch('/api/onramp-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletAddress,
            sourceAmount,
            destinationCurrency,
            destinationNetwork,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create onramp session');
        }

        const { clientSecret } = await response.json();

        // Load Stripe Onramp
        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        if (!publishableKey) {
          throw new Error('Stripe publishable key not found');
        }

        const stripeOnramp = await loadStripeOnramp(publishableKey);

        if (!stripeOnramp) {
          throw new Error('Failed to load Stripe Onramp');
        }

        // Create and mount the onramp session with dynamic theme
        const onrampSession = stripeOnramp.createSession({
          clientSecret,
          appearance: {
            theme: theme,
          },
        });

        onrampSessionRef.current = onrampSession;

        // Listen to session updates
        onrampSession.addEventListener('onramp_session_updated', (event) => {
          console.log('Onramp session updated:', event.payload);

          if (event.payload.session.status === 'fulfillment_complete') {
            console.log('Crypto purchase completed!');
          } else if (event.payload.session.status === 'rejected') {
            console.log('Transaction rejected');
          }
        });

        // Mount the widget
        if (onrampRef.current) {
          onrampSession.mount(onrampRef.current);
        }

        setLoading(false);
      } catch (err: any) {
        console.error('Error initializing onramp:', err);
        setError(err.message || 'Failed to initialize onramp');
        setLoading(false);
      }
    };

    initializeOnramp();
  }, [walletAddress, sourceAmount, destinationCurrency, destinationNetwork]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {loading && (
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
      />
    </div>
  );
}
