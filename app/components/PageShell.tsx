import type { ReactNode } from 'react';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

// Header, main landmark and footer shared by every page.
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

// Narrow column used by the signed-in account pages.
export function AccountPage({
  title,
  description,
  children,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <PageShell>
      <div className="container-page py-10 md:py-14">
        <div className="mx-auto max-w-3xl">
          <header className="mb-8">
            <h1 className="text-title">{title}</h1>
            {description ? <p className="mt-3 max-w-2xl text-lead">{description}</p> : null}
          </header>
          {children}
        </div>
      </div>
    </PageShell>
  );
}

export function PageLoading({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center gap-3 text-muted" role="status">
      <span className="spinner" aria-hidden="true" />
      <span>{label}…</span>
    </div>
  );
}
