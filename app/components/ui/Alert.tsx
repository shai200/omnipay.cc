import type { ReactNode } from 'react';
import { AlertIcon, CheckCircleIcon, InfoIcon } from './icons';

type Tone = 'info' | 'success' | 'warning' | 'danger';

const TONE_CLASS: Record<Tone, string> = {
  info: '',
  success: 'alert-success',
  warning: 'alert-warning',
  danger: 'alert-danger',
};

// Errors interrupt (role="alert"); everything else is announced politely.
export function Alert({
  tone = 'info',
  children,
  className = '',
  live = true,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  live?: boolean;
}) {
  const TheIcon = tone === 'success' ? CheckCircleIcon : tone === 'info' ? InfoIcon : AlertIcon;
  const role = !live ? undefined : tone === 'danger' ? 'alert' : 'status';
  return (
    <div className={`alert ${TONE_CLASS[tone]} ${className}`} role={role}>
      <TheIcon size={18} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
