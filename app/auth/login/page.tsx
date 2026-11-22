import type { Metadata } from 'next';
import AuthForm from '../AuthForm';
import { googleSignInEnabled } from '@/lib/auth/google';
import { safeNextPath } from '@/lib/next-path';

export const metadata: Metadata = { title: 'Sign in' };

// Rendered per request: whether Google sign-in is configured is a runtime
// setting, not something to freeze into the build.
export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  return <AuthForm mode="login" googleEnabled={googleSignInEnabled()} next={safeNextPath(next)} />;
}
