// Where to send someone after sign-in. Only a fixed set of in-app pages is
// accepted, so a crafted ?next= value can never redirect off-site.
const ALLOWED_NEXT_PATHS = ['/', '/reminders', '/checkout-settings'] as const;

export type NextPath = (typeof ALLOWED_NEXT_PATHS)[number];

export function safeNextPath(value: unknown): NextPath {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== 'string') return '/';
  const match = ALLOWED_NEXT_PATHS.find((path) => path === raw);
  return match ?? '/';
}

export function loginHref(next: NextPath): string {
  return next === '/' ? '/auth/login' : `/auth/login?next=${encodeURIComponent(next)}`;
}

export function registerHref(next: NextPath): string {
  return next === '/' ? '/auth/register' : `/auth/register?next=${encodeURIComponent(next)}`;
}
