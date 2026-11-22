import Link from 'next/link';
import { Logo } from './ui/Logo';

const PRODUCT = [
  { href: '/#buy', label: 'Buy Bitcoin' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#roadmap', label: 'Roadmap' },
  { href: '/#faq', label: 'FAQ' },
];

const ACCOUNT = [
  { href: '/profile', label: 'Dashboard' },
  { href: '/reminders', label: 'Alerts' },
  { href: '/checkout-settings', label: 'Checkout settings' },
];

const LEGAL = [
  { href: '/PrivacyPolicy', label: 'Privacy Policy' },
  { href: '/TermsOfService', label: 'Terms of Service' },
  { href: '/BusinessInfo', label: 'Business Info' },
];

function Column({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-fg">{title}</h2>
      <ul className="mt-3 space-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="inline-block py-1 text-sm text-fg-muted transition-colors hover:text-fg">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">
              Your secure gateway to cryptocurrency. OmniPurchase is a product of OmniPay.cc.
            </p>
            <p className="mt-4 text-sm text-fg-muted">
              Support:{' '}
              <a href="mailto:support@omnipay.cc" className="font-medium text-fg underline-offset-4 hover:underline">
                support@omnipay.cc
              </a>
            </p>
          </div>
          <Column title="Product" links={PRODUCT} />
          <Column title="Account" links={ACCOUNT} />
          <Column title="Legal" links={LEGAL} />
          <div>
            <h2 className="text-sm font-semibold text-fg">Security</h2>
            <p className="mt-3 text-sm leading-7 text-fg-muted">
              ✓ Bank-grade encryption<br />
              ✓ Verified by Stripe<br />
              ✓ PCI-DSS compliant
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-sm text-fg-subtle md:flex-row md:items-center md:justify-between">
          <p>© 2026 Omnipay.cc. All rights reserved.</p>
          <div className="flex flex-col gap-1 md:flex-row md:gap-4">
            <p>Version 0.2.2</p>
            <p>Latest Release: February 5, 2026</p>
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-fg-subtle">
          OmniPurchase does not provide financial, investment, or tax advice. See the{' '}
          <Link href="/TermsOfService" className="underline underline-offset-2 hover:text-fg">Terms of Service</Link>{' '}
          for risks and how purchases work.
        </p>
      </div>
    </footer>
  );
}
