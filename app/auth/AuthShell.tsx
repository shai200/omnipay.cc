import Link from 'next/link';
import type { ReactNode } from 'react';
import { Logo } from '../components/ui/Logo';

// Focused single-card layout for sign-in, sign-up and password reset.
export function AuthShell({
  title,
  description,
  children,
  wide = false,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="relative isolate flex min-h-dvh flex-col">
      <div className="hero-backdrop" aria-hidden="true" />
      <header className="container-page flex h-16 items-center justify-between">
        <Logo />
        <Link href="/" className="nav-link">Back to home</Link>
      </header>
      <main id="main" className="container-page flex flex-1 items-start justify-center py-8 md:py-14">
        <div className={`card card-raised animate-enter w-full p-6 sm:p-9 ${wide ? 'max-w-2xl' : 'max-w-md'}`}>
          <h1 className="text-heading">{title}</h1>
          {description ? <p className="mt-2 text-muted">{description}</p> : null}
          <div className="mt-7">{children}</div>
        </div>
      </main>
      <footer className="container-page py-6 text-center text-sm text-muted">
        <Link href="/TermsOfService" className="hover:text-fg">Terms of Service</Link>
        <span aria-hidden="true" className="mx-2">·</span>
        <Link href="/PrivacyPolicy" className="hover:text-fg">Privacy Policy</Link>
      </footer>
    </div>
  );
}
