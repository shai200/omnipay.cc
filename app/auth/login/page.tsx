import type { Metadata } from 'next';
import { Suspense } from 'react';
import AuthForm from '../AuthForm';
import { AuthLayout } from '../AuthLayout';

export const metadata: Metadata = { title: 'Sign in' };

export default function Page() {
  return (
    <AuthLayout>
      <Suspense>
        <AuthForm mode="login" />
      </Suspense>
    </AuthLayout>
  );
}
