'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRightIcon } from './ui/icons';

// The primary call to action depends on whether someone is signed in.
// Signed-out is the default so the server-rendered HTML is useful as is.
export function HeroActions() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {user ? (
        <Link href="/#buy" className="btn btn-primary btn-lg">
          Buy Bitcoin <ArrowRightIcon size={18} />
        </Link>
      ) : (
        <Link href="/auth/register" className="btn btn-primary btn-lg">
          Create your account <ArrowRightIcon size={18} />
        </Link>
      )}
      <Link href="/#how-it-works" className="btn btn-secondary btn-lg">
        See how it works
      </Link>
    </div>
  );
}

export function RemindersCta() {
  const { user } = useAuth();
  return (
    <div>
      <Link href="/reminders" className="btn btn-primary btn-lg">
        Set up your reminders <ArrowRightIcon size={18} />
      </Link>
      <p className="mt-3 text-sm text-muted">
        {user ? 'Configure your reminder preferences' : 'Sign in to customize your alerts'}
      </p>
    </div>
  );
}
