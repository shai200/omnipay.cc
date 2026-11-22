import { PageShell } from './components/PageShell';
import { ButtonLink } from './components/ui/Button';
import { Container } from './components/ui/Container';

export default function NotFound() {
  return (
    <PageShell>
      <Container size="sm" className="py-24 text-center sm:py-32">
        <p className="font-mono text-sm text-brand">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-fg sm:text-4xl">Page not found</h1>
        <p className="mt-4 text-fg-muted">The page you’re looking for doesn’t exist or has moved.</p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/">Go home</ButtonLink>
          <ButtonLink href="/#faq" variant="outline">Read the FAQ</ButtonLink>
        </div>
      </Container>
    </PageShell>
  );
}
