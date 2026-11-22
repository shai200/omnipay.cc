import Link from 'next/link';
import { cn } from '@/lib/cn';

export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden focusable={false} className={className}>
      <defs>
        <linearGradient id="op-mark" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#3730a3" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#op-mark)" />
      <path
        d="M16 7.5a8.5 8.5 0 0 0-4.6 15.65V25h-2v1.5h5.1v-4.2a5.6 5.6 0 1 1 3 0v4.2h5.1V25h-2v-1.85A8.5 8.5 0 0 0 16 7.5Z"
        fill="#fff"
      />
    </svg>
  );
}

export function Logo({ className, href = '/' }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn('inline-flex items-center gap-2.5 rounded-md text-fg', className)}
      aria-label="OmniPurchase home"
    >
      <LogoMark />
      <span className="text-[1.0625rem] font-semibold tracking-tight">OmniPurchase</span>
    </Link>
  );
}
