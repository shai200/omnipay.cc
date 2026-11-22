import type { ReactNode } from 'react';
import { PageShell } from './PageShell';

// Shared frame for the legal documents. It only supplies layout and the
// .legal-prose typography; the documents' wording lives in the pages.
export function LegalPage({
  title,
  subtitle,
  children,
}: {
  title: ReactNode;
  subtitle: ReactNode;
  children: ReactNode;
}) {
  return (
    <PageShell>
      <div className="border-b border-line bg-surface">
        <div className="container-page py-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-title">{title}</h1>
            <p className="mt-3 text-muted">{subtitle}</p>
          </div>
        </div>
      </div>
      <div className="container-page py-10 md:py-14">
        <article className="legal-prose mx-auto max-w-3xl">{children}</article>
      </div>
    </PageShell>
  );
}
