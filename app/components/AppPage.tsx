'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { PageShell } from './PageShell';
import { Alert } from './ui/Alert';
import { Button } from './ui/Button';
import { Container } from './ui/Container';
import { Spinner } from './ui/Spinner';

// Shell for signed-in pages: sends signed-out visitors to sign in (and back
// here afterwards), shows a loading state until the profile has loaded, and
// surfaces a failed profile load instead of rendering an empty form.
export function AppPage({
  title,
  description,
  actions,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { user, loading, profileError, refreshProfile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, router, pathname]);

  return (
    <PageShell>
      <Container size="md" className="py-10 sm:py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-[-0.025em] text-fg">{title}</h1>
            {description && <p className="mt-2 max-w-xl text-fg-muted">{description}</p>}
          </div>
          {actions}
        </div>
        <div className="mt-8 sm:mt-10">
          {loading || !user ? (
            <div className="flex min-h-[40vh] items-center justify-center text-fg-subtle">
              <Spinner size={24} label="Loading your account" />
            </div>
          ) : profileError ? (
            <Alert
              tone="danger"
              title="We couldn’t load your account details"
              action={
                <Button size="sm" variant="outline" onClick={() => void refreshProfile().catch(() => undefined)}>
                  Retry
                </Button>
              }
            >
              {profileError} Nothing has been changed.
            </Alert>
          ) : (
            <div className="animate-fade-in">{children}</div>
          )}
        </div>
      </Container>
    </PageShell>
  );
}
