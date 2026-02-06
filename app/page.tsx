'use client';

import OnrampWidget from './components/OnrampWidget';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { user, profile, signOutUser } = useAuth();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1040 240"
              role="img"
              aria-label="OmniPay logo"
              className="h-8 w-auto"
            >
              <defs>
                <style>
                  {`.s{fill:none;stroke:#0B0F1A;stroke-width:20;stroke-linecap:round;stroke-linejoin:round}
                  .t{fill:#0B0F1A;font:700 116px ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial}`}
                </style>
              </defs>

              <g transform="translate(80,40)">
                <circle className="s" cx="80" cy="80" r="72" />
                <rect className="s" x="48" y="48" width="64" height="64" rx="20.8" />
              </g>

              <text className="t" x="262" y="160">MNIPAY</text>
            </svg>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center gap-3">
            {user?.email && (
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {user.email}
              </span>
            )}
            {user ? (
              <a
                href="/profile"
                className="px-3 py-2 rounded-lg text-sm font-semibold"
                style={{ backgroundColor: 'var(--accent)', color: '#ffffff' }}
              >
                Profile
              </a>
            ) : (
              <div className="flex items-center gap-2">
                <a
                  href="/auth/register"
                  className="px-3 py-2 rounded-lg text-sm font-semibold"
                  style={{ backgroundColor: 'var(--accent)', color: '#ffffff' }}
                >
                  Register
                </a>
                <a
                  href="/auth/login"
                  className="px-3 py-2 rounded-lg text-sm font-semibold"
                  style={{ backgroundColor: 'var(--card-border)', color: 'var(--foreground)' }}
                >
                  Sign in
                </a>
              </div>
            )}
            {user && (
              <button
                onClick={() => signOutUser()}
                className="px-3 py-2 rounded-lg text-sm font-semibold"
                style={{ backgroundColor: 'var(--card-border)', color: 'var(--foreground)' }}
              >
                Sign out
              </button>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors"
              style={{ 
                backgroundColor: 'var(--card-border)',
                color: 'var(--foreground)'
              }}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="max-w-3xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              Buy Crypto with Smart Reminders
            </h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Get notified when it's time to buy. Set reminders for specific intervals or when prices drop. Never miss an opportunity to grow your portfolio.
            </p>
          </div>

          {/* Main Card - ATM-style */}
          <div 
            className="rounded-2xl shadow-lg border mb-8 py-6 mx-auto"
            style={{ 
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
              maxWidth: '536px'
            }}
          >
            <div className="mb-6 px-8">
              <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                Buy Cryptocurrency
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                Fast, secure transactions powered by Stripe
              </p>
            </div>

            <OnrampWidget
              key={`${profile?.source_amount}-${profile?.source_currency}`}
              walletAddress={profile?.wallet_addresses?.ethereum || profile?.wallet_addresses?.bitcoin}
              sourceAmount={profile?.source_amount ? Number(profile.source_amount) : 100}
              sourceCurrency={profile?.source_currency || 'usd'}
              destinationCurrency="btc"
              destinationNetwork="bitcoin"
            />
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-5xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--foreground)' }}>
            Why Choose Omnipay.cc
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div 
              className="rounded-xl border p-6"
              style={{ 
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)'
              }}
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--accent)' }}>
                <span className="text-white text-xl">🔒</span>
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--foreground)' }}>
                Bank-Grade Security
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Institutional security standards with encrypted transactions
              </p>
            </div>

            {/* Feature 2 */}
            <div 
              className="rounded-xl border p-6"
              style={{ 
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)'
              }}
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--accent)' }}>
                <span className="text-white text-xl">⚡</span>
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--foreground)' }}>
                Instant Settlement
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Real-time processing with immediate confirmations
              </p>
            </div>

            {/* Feature 3 */}
            <div 
              className="rounded-xl border p-6"
              style={{ 
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)'
              }}
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--accent)' }}>
                <span className="text-white text-xl">🌐</span>
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--foreground)' }}>
                Multi-Chain Support
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Support for major blockchains: Ethereum, Bitcoin, Solana, Polygon
              </p>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="max-w-5xl mx-auto mb-12">
          <div 
            className="rounded-xl border p-8"
            style={{ 
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)'
            }}
          >
            <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--foreground)' }}>
              Trusted by thousands
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>100%</p>
                <p style={{ color: 'var(--text-secondary)' }}>Secure</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>24/7</p>
                <p style={{ color: 'var(--text-secondary)' }}>Available</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>&lt;1min</p>
                <p style={{ color: 'var(--text-secondary)' }}>Processing</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>0 Fraud</p>
                <p style={{ color: 'var(--text-secondary)' }}>Verified</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer 
        className="border-t mt-16"
        style={{ 
          borderColor: 'var(--card-border)',
          backgroundColor: 'var(--card-bg)'
        }}
      >
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white" style={{ backgroundColor: 'var(--accent)' }}>
                    Ω
                  </div>
                  <span className="font-bold" style={{ color: 'var(--foreground)' }}>Omnipay.cc</span>
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Your secure gateway to cryptocurrency
                </p>
              </div>

              {/* Links */}
              <div>
                <h4 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Legal</h4>
                <div className="space-y-2">
                  <a href="/PrivacyPolicy" className="block transition-colors" style={{ color: 'var(--text-secondary)' }}>
                    Privacy Policy
                  </a>
                  <a href="/TermsOfService" className="block transition-colors" style={{ color: 'var(--text-secondary)' }}>
                    Terms of Service
                  </a>
                  <a href="/BusinessInfo" className="block transition-colors" style={{ color: 'var(--text-secondary)' }}>
                    Business Info
                  </a>
                </div>
              </div>

              {/* Security */}
              <div>
                <h4 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Security</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  ✓ Bank-grade encryption<br/>
                  ✓ Verified by Stripe<br/>
                  ✓ PCI-DSS compliant
                </p>
              </div>
            </div>

            <div 
              className="border-t pt-8"
              style={{ borderColor: 'var(--card-border)' }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  © 2026 Omnipay.cc. All rights reserved.
                </p>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  <p className="mb-1">Version 0.2.2</p>
                  <p>Latest Release: February 5, 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
