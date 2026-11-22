import Link from 'next/link';
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Spinner } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'inverse';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-brand-fg shadow-xs hover:bg-brand-hover',
  secondary: 'bg-surface-2 text-fg hover:bg-border',
  outline: 'border border-border-strong bg-surface text-fg shadow-xs hover:bg-surface-2',
  ghost: 'text-fg-muted hover:bg-surface-2 hover:text-fg',
  danger: 'bg-danger text-white hover:opacity-90',
  inverse: 'bg-surface-inverse text-fg-inverse hover:opacity-90',
};

// Every size keeps a touch target of at least 40px (44px at md and lg).
const SIZES: Record<ButtonSize, string> = {
  sm: 'h-10 px-3.5 text-sm gap-1.5 rounded-md',
  md: 'h-11 px-4.5 text-[0.9375rem] gap-2 rounded-md',
  lg: 'h-13 px-6 text-base gap-2 rounded-lg',
};

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  block = false,
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; block?: boolean; className?: string } = {}) {
  return cn(
    'inline-flex select-none items-center justify-center font-medium whitespace-nowrap',
    'transition-[background-color,color,box-shadow,transform,opacity] duration-150 ease-out',
    'active:translate-y-px disabled:pointer-events-none disabled:opacity-50',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
    VARIANTS[variant],
    SIZES[size],
    block && 'w-full',
    className,
  );
}

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

export function Button({
  variant,
  size,
  block,
  className,
  loading = false,
  leadingIcon,
  trailingIcon,
  children,
  disabled,
  type = 'button',
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, block, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner size={16} /> : leadingIcon}
      {children}
      {!loading && trailingIcon}
    </button>
  );
}

export function ButtonLink({
  variant,
  size,
  block,
  className,
  leadingIcon,
  trailingIcon,
  children,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link className={buttonClasses({ variant, size, block, className })} {...props}>
      {leadingIcon}
      {children}
      {trailingIcon}
    </Link>
  );
}
