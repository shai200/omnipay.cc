'use client';

import OnrampWidget from './components/OnrampWidget';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';
import { useState } from 'react';

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { user, profile, signOutUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-2">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white" style={{ backgroundColor: 'var(--accent)' }}>
              Ω
            </div>
            <span className="font-bold text-xl hidden sm:inline" style={{ color: 'var(--foreground)' }}>Omnipay.cc</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {user?.email && (
              <span className="text-sm truncate max-w-[150px]" style={{ color: 'var(--text-secondary)' }}>
                {user.email}
              </span>
            )}
            {user ? (
              <>
                <a
                  href="/reminders"
                  className="px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
                  style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
                >
                  🔔 Reminders
                </a>
                <a
                  href="/checkout-settings"
                  className="px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
                  style={{ backgroundColor: 'var(--accent)', color: '#ffffff' }}
                >
                  Checkout Settings
                </a>
                <button
                  onClick={() => signOutUser()}
                  className="px-3 py-2 rounded-lg text-sm font-semibold"
                  style={{ backgroundColor: 'var(--card-border)', color: 'var(--foreground)' }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <a
                  href="/auth/register"
                  className="px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap"
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
              </>
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

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
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
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg transition-colors"
              style={{ 
                backgroundColor: 'var(--card-border)',
                color: 'var(--foreground)'
              }}
              aria-label="Menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {user?.email && (
                <div className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                  {user.email}
                </div>
              )}
              {user ? (
                <>
                  <a
                    href="/reminders"
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-center"
                    style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
                  >
                    🔔 Reminders
                  </a>
                  <a
                    href="/checkout-settings"
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-center"
                    style={{ backgroundColor: 'var(--accent)', color: '#ffffff' }}
                  >
                    Checkout Settings
                  </a>
                  <button
                    onClick={() => signOutUser()}
                    className="px-3 py-2 rounded-lg text-sm font-semibold"
                    style={{ backgroundColor: 'var(--card-border)', color: 'var(--foreground)' }}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/auth/register"
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-center"
                    style={{ backgroundColor: 'var(--accent)', color: '#ffffff' }}
                  >
                    Register
                  </a>
                  <a
                    href="/auth/login"
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-center"
                    style={{ backgroundColor: 'var(--card-border)', color: 'var(--foreground)' }}
                  >
                    Sign in
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="max-w-3xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              Your Crypto, Your Wallet, Your Control
            </h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Buy crypto with any credit or debit card and receive it directly into your personal wallet. Set up smart reminders to never miss an opportunity - join the select few who are building wealth through disciplined, consistent accumulation.
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
                Buy Crypto, Sent Directly to Your Wallet
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                Use any credit or debit card. Keep full control - crypto goes straight to your wallet.
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

        {/* Reminders CTA Section */}
        <section className="max-w-3xl mx-auto mb-12">
          <div 
            className="rounded-2xl border p-8 md:p-10"
            style={{ 
              backgroundColor: 'var(--card-bg)',
              borderColor: '#dc2626',
              borderWidth: '2px'
            }}
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#dc2626' }}>
                <span className="text-3xl">🔔</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--foreground)' }}>
                Never Forget to Accumulate Again
              </h2>
              <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
                The secret to wealth building isn&apos;t just buying once - it&apos;s buying <strong style={{ color: 'var(--foreground)' }}>consistently</strong>. Set up smart reminders to build the habit that separates winners from wishers.
              </p>
            </div>

            <div className="space-y-4 mb-6 text-left">
              <div className="flex gap-3">
                <span className="text-xl flex-shrink-0">📅</span>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Schedule Recurring Reminders</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Set weekly, bi-weekly, or monthly alerts to accumulate at your own pace</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl flex-shrink-0">📉</span>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Get Crypto Drop Alerts</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Receive notifications after major price drops - buy cheap when Mr. Market is giving away specials</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl flex-shrink-0">⭐</span>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--foreground)' }}>Prioritize These Emails</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Mark our reminders as important in your inbox so you never miss an opportunity to act</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <a
                href="/reminders"
                className="inline-block px-8 py-4 rounded-lg text-lg font-bold transition-transform hover:scale-105"
                style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
              >
                🔔 Set Up Your Reminders Now
              </a>
              <p className="text-sm mt-3" style={{ color: 'var(--text-secondary)' }}>
                {user ? "Configure your reminder preferences" : "Sign in to customize your alerts"}
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-5xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--foreground)' }}>
            The Smart Way to Build Crypto Wealth
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
                <span className="text-white text-xl">🔑</span>
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--foreground)' }}>
                Your Wallet, Your Control
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Crypto is sent directly to your personal wallet - no custody, no middlemen. Use any credit or debit card for instant purchases.
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
                <span className="text-white text-xl">📈</span>
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--foreground)' }}>
                Accumulate Safely Over Time
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Buying crypto in small, regular chunks is one of the safest ways to grow your portfolio. Reduce risk and build wealth steadily.
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
                <span className="text-white text-xl">⚡</span>
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--foreground)' }}>
                Join the Elite Few
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Most investors don&apos;t have this discipline. Be part of the select group of smart accumulators who are positioned to dominate in the future.
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
