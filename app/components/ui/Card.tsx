import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Card({
  className,
  elevated = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & { elevated?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface',
        elevated ? 'shadow-lg' : 'shadow-sm',
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  title,
  description,
  action,
  icon,
  className,
  titleAs: Title = 'h2',
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
  titleAs?: 'h1' | 'h2' | 'h3';
}) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div className="flex min-w-0 items-start gap-3">
        {icon && (
          <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand-soft-fg">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <Title className="text-base font-semibold tracking-tight text-fg">{title}</Title>
          {description && <p className="mt-1 text-sm text-fg-muted">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
