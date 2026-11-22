import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export function Container({ className, size = 'lg', ...props }: HTMLAttributes<HTMLDivElement> & { size?: 'sm' | 'md' | 'lg' }) {
  const max = size === 'sm' ? 'max-w-2xl' : size === 'md' ? 'max-w-4xl' : 'max-w-6xl';
  return <div className={cn('mx-auto w-full px-5 sm:px-6 lg:px-8', max, className)} {...props} />;
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-sm font-medium tracking-tight text-brand', className)}>{children}</p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  id,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'center' | 'left';
  id?: string;
}) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 id={id} className="mt-2 text-3xl font-semibold tracking-[-0.025em] text-fg text-balance sm:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-4 text-lg leading-relaxed text-fg-muted text-pretty">{description}</p>}
    </div>
  );
}
