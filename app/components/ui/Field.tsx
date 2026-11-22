import { useId, type InputHTMLAttributes, type ReactNode } from 'react';

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  label: string;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  mono?: boolean;
};

// Label, input, hint and error wired together: the label is bound by id, and
// the hint and error are referenced by aria-describedby so screen readers
// read them with the field.
export function TextField({ label, hint, error, optional, mono, className = '', ...input }: TextFieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={className}>
      <label className="label" htmlFor={id}>
        {label}
        {optional ? <span className="ml-1.5 font-normal text-muted">(optional)</span> : null}
      </label>
      <input
        id={id}
        className={`input ${mono ? 'input-mono' : ''}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...input}
      />
      {error ? <p id={errorId} className="field-error">{error}</p> : null}
      {hint ? <p id={hintId} className="field-hint">{hint}</p> : null}
    </div>
  );
}
