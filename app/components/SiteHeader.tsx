'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Logo } from './ui/Logo';
import { CloseIcon, MenuIcon, MoonIcon, SunIcon } from './ui/icons';

type NavItem = { href: string; label: string };

const MARKETING_NAV: NavItem[] = [
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#security', label: 'Security' },
  { href: '/#roadmap', label: 'Roadmap' },
  { href: '/#faq', label: 'FAQ' },
];

const ACCOUNT_NAV: NavItem[] = [
  { href: '/', label: 'Buy' },
  { href: '/reminders', label: 'Reminders' },
  { href: '/checkout-settings', label: 'Checkout Settings' },
];

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const next = theme === 'light' ? 'dark' : 'light';
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="btn btn-ghost btn-icon"
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      {/* Both icons render; CSS shows the right one so there is no mismatch before hydration. */}
      <span className="theme-icon-light"><MoonIcon /></span>
      <span className="theme-icon-dark"><SunIcon /></span>
    </button>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const { user, loading, signOutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuId = useId();

  const nav = user ? ACCOUNT_NAV : MARKETING_NAV;

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOutUser();
    } finally {
      setSigningOut(false);
      setMenuOpen(false);
    }
  };

  const isCurrent = (href: string) => !href.includes('#') && pathname === href;

  return (
    <header className="site-header">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <div className="flex items-center gap-6">
          <Logo />
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="nav-link" aria-current={isCurrent(item.href) ? 'page' : undefined}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          <div className="hidden items-center gap-2 md:flex" aria-busy={loading}>
            {loading ? (
              <span className="skeleton h-10 w-40" aria-hidden="true" />
            ) : user ? (
              <>
                {user.email ? (
                  <span className="max-w-[14rem] truncate text-sm text-muted" title={user.email}>
                    {user.email}
                  </span>
                ) : null}
                <button type="button" onClick={handleSignOut} disabled={signingOut} className="btn btn-secondary btn-sm">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="btn btn-ghost btn-sm">Sign in</Link>
                <Link href="/auth/register" className="btn btn-primary btn-sm">Register</Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-icon md:hidden"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <div id={menuId} hidden={!menuOpen} className="border-t border-line bg-bg md:hidden">
        <div className="container-page animate-enter py-4" style={{ animationDuration: '220ms' }}>
          <nav aria-label="Mobile">
            <ul className="flex flex-col">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="nav-link w-full !min-h-12 text-base"
                    aria-current={isCurrent(item.href) ? 'page' : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-4 border-t border-line pt-4">
            {loading ? null : user ? (
              <div className="flex flex-col gap-3">
                {user.email ? <p className="truncate px-3 text-sm text-muted">{user.email}</p> : null}
                <button type="button" onClick={handleSignOut} disabled={signingOut} className="btn btn-secondary btn-block">
                  Sign out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link href="/auth/login" className="btn btn-secondary" onClick={() => setMenuOpen(false)}>Sign in</Link>
                <Link href="/auth/register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
