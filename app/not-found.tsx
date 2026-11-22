import Link from 'next/link';
import { PageShell } from './components/PageShell';

export default function NotFound() {
  return (
    <PageShell>
      <div className="container-page flex min-h-[55vh] flex-col items-center justify-center py-16 text-center">
        <p className="eyebrow">404</p>
        <h1 className="text-title mt-3">Page not found</h1>
        <p className="text-lead mt-4 max-w-md">
          The page you are looking for does not exist or has moved.
        </p>
        <Link href="/" className="btn btn-primary btn-lg mt-8">Back to home</Link>
      </div>
    </PageShell>
  );
}
