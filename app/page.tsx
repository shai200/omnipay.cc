'use client';

import { useState } from 'react';
import OnrampWidget from './components/OnrampWidget';
import AuthModal from './components/AuthModal';
import { UserKYCInfo, ReminderPreferences } from './types/user';

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<UserKYCInfo | null>(null);
  const [reminderPrefs, setReminderPrefs] = useState<ReminderPreferences | null>(null);

  const handleAuthSuccess = (kycInfo: UserKYCInfo, reminderPreferences: ReminderPreferences) => {
    setCustomerInfo(kycInfo);
    setReminderPrefs(reminderPreferences);
    setShowAuthModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">OmniPay</h1>
          <p className="text-xl text-gray-400">
            Your Gateway from Fiat to Crypto
          </p>
        </header>

        <main className="max-w-2xl mx-auto">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Buy Crypto Instantly</h2>
              {!customerInfo ? (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                >
                  Sign In
                </button>
              ) : (
                <div className="text-sm text-gray-300">
                  Welcome, {customerInfo.firstName}!
                </div>
              )}
            </div>
            
            {!customerInfo && (
              <div className="mb-4 p-3 bg-blue-900 bg-opacity-30 border border-blue-500 rounded">
                <p className="text-sm text-blue-200">
                  💡 Sign in to pre-fill your information and save time on future purchases
                </p>
              </div>
            )}

            <p className="text-gray-300 mb-6">
              Convert your fiat currency to cryptocurrency with ease. Powered by Stripe.
            </p>

            <OnrampWidget
              sourceAmount={100}
              destinationCurrency="eth"
              destinationNetwork="ethereum"
              customerInformation={customerInfo ? {
                email: customerInfo.email,
                firstName: customerInfo.firstName,
                lastName: customerInfo.lastName,
                dob: customerInfo.dob,
                address: customerInfo.address,
              } : undefined}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold mb-2">Fast & Secure</h3>
              <p className="text-sm text-gray-400">
                Instant transactions with bank-grade security
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💳</div>
              <h3 className="font-semibold mb-2">Multiple Payment Methods</h3>
              <p className="text-sm text-gray-400">
                Credit card, debit card, and more
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🌐</div>
              <h3 className="font-semibold mb-2">Multi-Chain Support</h3>
              <p className="text-sm text-gray-400">
                BTC, ETH, SOL, MATIC, USDC, XLM
              </p>
            </div>
          </div>
        </main>

        <footer className="text-center mt-16 text-gray-500 text-sm">
          <div className="mb-4 space-x-4">
            <a href="/BusinessInfo" className="hover:text-gray-300 transition-colors">
              Business Info
            </a>
            <span>•</span>
            <a href="/PrivacyPolicy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="/TermsOfService" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </a>
          </div>
          <p>Powered by Stripe Crypto Onramp</p>
        </footer>

        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuthSuccess}
          />
        )}
      </div>
    </div>
  );
}
