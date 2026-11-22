'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { ButtonLink, Button } from './ui/Button';
import { Logo } from './ui/Logo';
import { IconClose, IconLogout, IconMenu } from './ui/icons';
import { cn } from '@/lib/cn';

const MARKETING_LINKS = [
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#security', label: 'Security' },
  { href: '/#roadmap', label: 'Roadmap' },
  { href: '/#faq', label: 'FAQ' },
];

const APP_LINKS = [
  { href: '/#buy', label: 'Buy' },
  { href: '/profile', label: 'Dashboard' },
  { href: '/reminders', label: 'Alerts' },
  { href: '/checkout-settings', label: 'Settings' },
];

export function SiteHeader() {
  const { user, loading, signOutUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const links = user ? APP_LINKS : MARKETING_LINKS;

  // Close the mobile menu after navigation and on Escape.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const signOut = async () => {
    setOpen(false);
    await signOutUser();
    router.push('/');
  };

  const isActive = (href: string) => !href.includes('#') && pathname === href;

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/80 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/70">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive(link.href) ? 'text-fg bg-surface-2' : 'text-fg-muted hover:text-fg',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <div className="hidden items-center gap-2 md:flex">
            {loading ? (
              <span className="h-10 w-36 animate-pulse rounded-md bg-surface-2" aria-hidden />
            ) : user ? (
              <>
                <span className="max-w-[12rem] truncate px-2 text-sm text-fg-subtle" title={user.email ?? undefined}>
                  {user.email}
                </span>
                <Button variant="outline" size="sm" onClick={signOut} leadingIcon={<IconLogout size={16} />}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <ButtonLink href="/auth/login" variant="ghost" size="sm">
                  Sign in
                </ButtonLink>
                <ButtonLink href="/auth/register" size="sm">
                  Get started
                </ButtonLink>
              </>
            )}
          </div>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-md text-fg md:hidden hover:bg-surface-2"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <IconClose size={20} /> : <IconMenu size={20} />}
          </button>
        </div>
      </div>

      <div
        id={menuId}
        hidden={!open}
        className="border-t border-border bg-bg md:hidden animate-fade-in"
      >
        <nav aria-label="Mobile" className="mx-auto max-w-6xl px-5 py-4">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className="flex h-12 items-center rounded-md px-3 text-base font-medium text-fg hover:bg-surface-2"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-border pt-4">
            {user ? (
              <div className="flex flex-col gap-3">
                <p className="truncate px-3 text-sm text-fg-subtle">{user.email}</p>
                <Button variant="outline" block onClick={signOut} leadingIcon={<IconLogout size={16} />}>
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <ButtonLink href="/auth/login" variant="outline" block>
                  Sign in
                </ButtonLink>
                <ButtonLink href="/auth/register" block>
                  Get started
                </ButtonLink>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
