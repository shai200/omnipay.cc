'use client';

import { useEffect, useRef, useState } from 'react';
import { loadStripeOnramp } from '@stripe/crypto';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface OnrampWidgetProps {
  walletAddress?: string;
  sourceAmount?: number;
  sourceCurrency?: string;
  destinationCurrency?: string;
  destinationNetwork?: string;
}

let globalOnrampMounted = false;

export default function OnrampWidget({
  walletAddress,
  sourceAmount,
  sourceCurrency,
  destinationCurrency,
  destinationNetwork,
}: OnrampWidgetProps) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const onrampRef = useRef<HTMLDivElement>(null);
  const onrampSessionRef = useRef<any>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeOnramp = async () => {
      try {
        // Reset for new prop values
        globalOnrampMounted = false;

        setLoading(true);
        setError(null);

        if (!onrampRef.current) {
          setLoading(false);
          return;
        }

        // Clear container
        onrampRef.current.innerHTML = '';

        // Create onramp session on the server
        const response = await fetch('/api/onramp-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletAddress,
            sourceAmount,
            sourceCurrency,
            destinationCurrency,
            destinationNetwork,
            userId: user?.uid || undefined,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error || 'Failed to create onramp session';
          
          // Provide user-friendly error messages
          if (errorMessage.includes('at least 13 years of age')) {
            throw new Error('You must be at least 13 years old to use this service. Please update your profile with a valid date of birth.');
          } else if (errorMessage.includes('Crypto onramp is not enabled')) {
            throw new Error('Crypto purchases are currently unavailable. Please try again later.');
          }
          
          throw new Error(errorMessage);
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
        onrampSession.addEventListener('onramp_session_updated', async (event) => {
          const status = event.payload.session.status;
          const sessionId = event.payload.session.id;
          
          console.log('Onramp session updated:', event.payload);

          // Track session state changes in DB for email campaigns
          try {
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            
            // Add auth token if user is logged in
            if (user) {
              const token = await user.getIdToken();
              headers['Authorization'] = `Bearer ${token}`;
            }
            
            await fetch('/api/track-onramp-event', {
              method: 'POST',
              headers,
              body: JSON.stringify({
                sessionId,
                status,
                transactionDetails: (event.payload.session as any).transaction_details,
                timestamp: new Date().toISOString(),
              }),
            });
          } catch (error) {
            console.error('Failed to track onramp event:', error);
          }

          // Handle specific states
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

        // Mount the widget
        if (onrampRef.current) {
          onrampSession.mount(onrampRef.current);
          globalOnrampMounted = true;
          console.log('Onramp widget mounted');
        }

        setLoading(false);
      } catch (err: any) {
        console.error('Error initializing onramp:', err);
        setError(err.message || 'Failed to initialize onramp');
        setLoading(false);
      }
    };

    initializeOnramp();

    // Cleanup function
    return () => {
      console.log('Onramp component unmounting');
      if (onrampSessionRef.current) {
        try {
          onrampSessionRef.current.unmount();
        } catch (e) {
          console.log('Error unmounting onramp session:', e);
        }
      }
      if (onrampRef.current) {
        onrampRef.current.innerHTML = '';
      }
      globalOnrampMounted = false;
    };
  }, [walletAddress, sourceAmount, sourceCurrency, destinationCurrency, destinationNetwork]);

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
        data-onramp-container
      />
    </div>
  );
}
