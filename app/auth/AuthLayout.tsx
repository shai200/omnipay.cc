import type { ReactNode } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '../components/ThemeToggle';
import { Logo } from '../components/ui/Logo';
import { IconCheck } from '../components/ui/icons';

const POINTS = [
  'Crypto is sent straight to the wallet you control',
  'Card payment and identity checks handled by Stripe',
  'Save your details once for faster checkout',
];

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <aside className="relative hidden overflow-hidden bg-surface-inverse lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div aria-hidden className="hero-backdrop absolute inset-0 opacity-90" />
        <div className="relative [&_a]:text-fg-inverse">
          <Logo />
        </div>
        <div className="relative max-w-md">
          <p className="text-3xl font-semibold leading-tight tracking-[-0.025em] text-fg-inverse text-balance">
            Buy Bitcoin with your card, straight to your own wallet.
          </p>
          <ul className="mt-8 space-y-3">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-fg-inverse/80">
                <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-fg-inverse dark:bg-black/10">
                  <IconCheck size={13} strokeWidth={2.5} />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-fg-inverse/60">© 2026 Omnipay.cc. All rights reserved.</p>
      </aside>

      <div className="flex flex-col">
        <div className="flex h-16 items-center justify-between px-5 sm:px-8">
          <div className="lg:invisible">
            <Logo />
          </div>
          <ThemeToggle />
        </div>
        <main id="main" className="flex flex-1 items-start justify-center px-5 pb-16 pt-6 sm:px-8 sm:pt-12">
          <div className="w-full max-w-[26rem] animate-fade-up">{children}</div>
        </main>
        <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-5 gap-y-2 px-5 pb-8 text-sm text-fg-subtle">
          <Link href="/TermsOfService" className="hover:text-fg">Terms of Service</Link>
          <Link href="/PrivacyPolicy" className="hover:text-fg">Privacy Policy</Link>
          <Link href="/BusinessInfo" className="hover:text-fg">Business Info</Link>
        </nav>
      </div>
    </div>
  );
}
