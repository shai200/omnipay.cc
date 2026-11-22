import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { IconAlert, IconCheck, IconInfo } from './icons';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

const TONES: Record<AlertTone, string> = {
  info: 'bg-info-soft text-fg border-[color-mix(in_srgb,var(--info)_30%,transparent)]',
  success: 'bg-success-soft text-fg border-[color-mix(in_srgb,var(--success)_30%,transparent)]',
  warning: 'bg-warning-soft text-fg border-[color-mix(in_srgb,var(--warning)_30%,transparent)]',
  danger: 'bg-danger-soft text-fg border-[color-mix(in_srgb,var(--danger)_30%,transparent)]',
};

const ICON_COLOR: Record<AlertTone, string> = {
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
};

// Errors interrupt (role=alert); everything else is announced politely.
export function Alert({
  tone = 'info',
  title,
  children,
  className,
  action,
}: {
  tone?: AlertTone;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  const Icon = tone === 'success' ? IconCheck : tone === 'info' ? IconInfo : IconAlert;
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn('flex gap-3 rounded-lg border p-3.5 text-sm animate-fade-in', TONES[tone], className)}
    >
      <Icon size={18} className={cn('mt-0.5 shrink-0', ICON_COLOR[tone])} />
      <div className="min-w-0 flex-1">
        {title && <p className="font-medium">{title}</p>}
        {children && <div className={cn('text-fg-muted', title ? 'mt-0.5' : undefined)}>{children}</div>}
      </div>
      {action}
    </div>
  );
}
