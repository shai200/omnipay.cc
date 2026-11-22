'use client';

import { useId, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { IconChevronDown, IconEye, IconEyeOff } from './icons';

const CONTROL =
  'block w-full rounded-md border bg-surface px-3.5 text-[0.9375rem] text-fg shadow-xs ' +
  'placeholder:text-fg-subtle transition-[border-color,box-shadow] duration-150 ' +
  'focus:outline-none focus:border-brand focus:ring-4 focus:ring-[var(--brand-ring)] ' +
  'disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-fg-subtle';

function controlClass(invalid: boolean, extra?: string) {
  return cn(
    CONTROL,
    'h-11',
    invalid ? 'border-danger focus:border-danger focus:ring-[color-mix(in_srgb,var(--danger)_30%,transparent)]' : 'border-border-strong',
    extra,
  );
}

type FieldChrome = {
  label: ReactNode;
  hint?: ReactNode;
  error?: string | null;
  optional?: boolean;
  className?: string;
};

function FieldShell({
  id,
  label,
  hint,
  error,
  optional,
  className,
  children,
}: FieldChrome & { id: string; children: ReactNode }) {
  return (
    <div className={cn('min-w-0', className)}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-medium text-fg">
        <span>{label}</span>
        {optional && <span className="text-xs font-normal text-fg-subtle">Optional</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-fg-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, error?: string | null, hint?: ReactNode) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

export function TextField({
  label,
  hint,
  error,
  optional,
  className,
  inputClassName,
  id: idProp,
  ...props
}: FieldChrome & InputHTMLAttributes<HTMLInputElement> & { inputClassName?: string }) {
  const generated = useId();
  const id = idProp ?? generated;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={controlClass(Boolean(error), inputClassName)}
        {...props}
      />
    </FieldShell>
  );
}

export function PasswordField({
  label,
  hint,
  error,
  className,
  id: idProp,
  ...props
}: FieldChrome & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  const generated = useId();
  const id = idProp ?? generated;
  const [visible, setVisible] = useState(false);
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          className={controlClass(Boolean(error), 'pr-12')}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md text-fg-subtle hover:text-fg"
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          aria-controls={id}
        >
          {visible ? <IconEyeOff size={18} /> : <IconEye size={18} />}
        </button>
      </div>
    </FieldShell>
  );
}

export function SelectField({
  label,
  hint,
  error,
  optional,
  className,
  id: idProp,
  children,
  ...props
}: FieldChrome & SelectHTMLAttributes<HTMLSelectElement>) {
  const generated = useId();
  const id = idProp ?? generated;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional} className={className}>
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          className={controlClass(Boolean(error), 'appearance-none pr-10')}
          {...props}
        >
          {children}
        </select>
        <IconChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-fg-subtle" />
      </div>
    </FieldShell>
  );
}

export function Checkbox({
  label,
  description,
  className,
  id: idProp,
  ...props
}: { label: ReactNode; description?: ReactNode; className?: string } & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  const generated = useId();
  const id = idProp ?? generated;
  return (
    <div className={cn('flex gap-3', className)}>
      <input
        id={id}
        type="checkbox"
        aria-describedby={description ? `${id}-desc` : undefined}
        className="mt-0.5 size-5 shrink-0 cursor-pointer rounded accent-[var(--brand)] disabled:cursor-not-allowed"
        {...props}
      />
      <div className="min-w-0">
        <label htmlFor={id} className="cursor-pointer text-sm font-medium text-fg">
          {label}
        </label>
        {description && (
          <p id={`${id}-desc`} className="mt-0.5 text-sm text-fg-muted">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

// A radio rendered as a selectable card. Native input, so keyboard arrows and
// screen readers behave as a normal radio group.
export function RadioCard({
  label,
  description,
  badge,
  className,
  id: idProp,
  ...props
}: {
  label: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  const generated = useId();
  const id = idProp ?? generated;
  return (
    <label
      htmlFor={id}
      className={cn(
        'group relative flex cursor-pointer gap-3 rounded-lg border border-border bg-surface p-4 shadow-xs',
        'transition-[border-color,background-color,box-shadow] duration-150 hover:border-border-strong',
        'has-[:checked]:border-brand has-[:checked]:bg-brand-soft/40 has-[:checked]:ring-1 has-[:checked]:ring-brand',
        'has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-[var(--brand-ring)]',
        'has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60',
        className,
      )}
    >
      <input
        id={id}
        type="radio"
        aria-describedby={description ? `${id}-desc` : undefined}
        className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[var(--brand)] focus:outline-none"
        {...props}
      />
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2 text-sm font-medium text-fg">
          {label}
          {badge}
        </span>
        {description && (
          <span id={`${id}-desc`} className="mt-0.5 block text-sm text-fg-muted">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
