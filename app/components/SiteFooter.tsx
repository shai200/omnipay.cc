import Link from 'next/link';
import { LogoMark } from './ui/Logo';

// The security list, the copyright line and the version lines are existing
// company/compliance copy and are kept word for word.
export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-page py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12">
          <div className="col-span-2 md:col-span-5">
            <div className="flex items-center gap-2.5">
              <LogoMark size={28} />
              <span className="font-semibold tracking-tight text-fg">OmniPurchase</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-muted">
              Your secure gateway to cryptocurrency
            </p>
          </div>

          <nav aria-label="Product" className="md:col-span-2">
            <h2 className="text-sm font-semibold text-fg">Product</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/#buy" className="text-muted hover:text-fg">Buy Bitcoin</Link></li>
              <li><Link href="/#how-it-works" className="text-muted hover:text-fg">How it works</Link></li>
              <li><Link href="/reminders" className="text-muted hover:text-fg">Reminders</Link></li>
              <li><Link href="/#faq" className="text-muted hover:text-fg">FAQ</Link></li>
            </ul>
          </nav>

          <nav aria-label="Legal" className="md:col-span-2">
            <h2 className="text-sm font-semibold text-fg">Legal</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/PrivacyPolicy" className="text-muted hover:text-fg">Privacy Policy</Link></li>
              <li><Link href="/TermsOfService" className="text-muted hover:text-fg">Terms of Service</Link></li>
              <li><Link href="/BusinessInfo" className="text-muted hover:text-fg">Business Info</Link></li>
            </ul>
          </nav>

          <div className="col-span-2 md:col-span-3">
            <h2 className="text-sm font-semibold text-fg">Security</h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              ✓ Bank-grade encryption<br />
              ✓ Verified by Stripe<br />
              ✓ PCI-DSS compliant
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-8 text-sm text-muted md:flex-row md:items-end md:justify-between">
          <p>© 2026 Omnipay.cc. All rights reserved.</p>
          <div className="md:text-right">
            <p>Version 0.2.2</p>
            <p>Latest Release: February 5, 2026</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
