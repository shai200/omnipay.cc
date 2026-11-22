import type { ReactNode } from 'react';
import { PageShell } from './PageShell';

// Frame for Terms, Privacy and Business Info. Only the presentation lives
// here; each page's legal copy stays exactly as written.
export function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <PageShell>
      <div className="border-b border-border bg-surface">
        <div aria-hidden className="hero-backdrop h-2 opacity-60" />
      </div>
      <article className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8 legal-page">{children}</article>
    </PageShell>
  );
}
