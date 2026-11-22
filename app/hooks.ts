'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './contexts/AuthContext';
import { loginHref, type NextPath } from '@/lib/next-path';

// Sends signed-out visitors to sign-in and brings them back afterwards.
export function useRequireAuth(next: NextPath) {
  const router = useRouter();
  const auth = useAuth();
  const { loading, user } = auth;

  useEffect(() => {
    if (!loading && !user) {
      router.replace(loginHref(next));
    }
  }, [loading, user, router, next]);

  return auth;
}
