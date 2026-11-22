import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false,
    ...props,
  };
}

export const IconArrowRight = (p: IconProps) => (
  <svg {...base(p)}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
);
export const IconArrowLeft = (p: IconProps) => (
  <svg {...base(p)}><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></svg>
);
export const IconCheck = (p: IconProps) => (
  <svg {...base(p)}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);
export const IconChevronDown = (p: IconProps) => (
  <svg {...base(p)}><path d="m6 9 6 6 6-6" /></svg>
);
export const IconShield = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z" /><path d="m9 12 2 2 4-4" /></svg>
);
export const IconWallet = (p: IconProps) => (
  <svg {...base(p)}><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18a1 1 0 0 1 1 1v2" /><path d="M4 7.5v10A2.5 2.5 0 0 0 6.5 20H19a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H6.5A2.5 2.5 0 0 1 4 7.5Z" /><circle cx="16" cy="14.5" r="1.25" /></svg>
);
export const IconCard = (p: IconProps) => (
  <svg {...base(p)}><rect x="3" y="5.5" width="18" height="13" rx="2.5" /><path d="M3 10h18" /><path d="M7 15h3" /></svg>
);
export const IconUser = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="8.5" r="3.75" /><path d="M4.5 20c1.2-3.6 4.1-5.5 7.5-5.5s6.3 1.9 7.5 5.5" /></svg>
);
export const IconBell = (p: IconProps) => (
  <svg {...base(p)}><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></svg>
);
export const IconTrendDown = (p: IconProps) => (
  <svg {...base(p)}><path d="m3 7 6.5 6.5 4-4L21 17" /><path d="M21 11.5V17h-5.5" /></svg>
);
export const IconMessage = (p: IconProps) => (
  <svg {...base(p)}><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12Z" /></svg>
);
export const IconCalendar = (p: IconProps) => (
  <svg {...base(p)}><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
);
export const IconLock = (p: IconProps) => (
  <svg {...base(p)}><rect x="4.5" y="10.5" width="15" height="10" rx="2.5" /><path d="M8 10.5V7.5a4 4 0 1 1 8 0v3" /></svg>
);
export const IconKey = (p: IconProps) => (
  <svg {...base(p)}><circle cx="8" cy="15" r="4" /><path d="m11 12 8.5-8.5M16 7l2.5 2.5M14 9l2 2" /></svg>
);
export const IconSettings = (p: IconProps) => (
  <svg {...base(p)}><path d="M4 7h10M18 7h2M4 17h4M12 17h8" /><circle cx="16" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></svg>
);
export const IconHome = (p: IconProps) => (
  <svg {...base(p)}><path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1v-8.5Z" /></svg>
);
export const IconSun = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" /></svg>
);
export const IconMoon = (p: IconProps) => (
  <svg {...base(p)}><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" /></svg>
);
export const IconMenu = (p: IconProps) => (
  <svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const IconClose = (p: IconProps) => (
  <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const IconAlert = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.5h.01" /></svg>
);
export const IconInfo = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 11v5.5M12 7.5h.01" /></svg>
);
export const IconMail = (p: IconProps) => (
  <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></svg>
);
export const IconEye = (p: IconProps) => (
  <svg {...base(p)}><path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" /><circle cx="12" cy="12" r="3" /></svg>
);
export const IconEyeOff = (p: IconProps) => (
  <svg {...base(p)}><path d="M3 3l18 18" /><path d="M10.6 5.1A9.7 9.7 0 0 1 12 5c6 0 9.5 7 9.5 7a17 17 0 0 1-3 3.9M6.6 6.6C4 8.3 2.5 12 2.5 12S6 19 12 19c1.6 0 3-.4 4.3-1.1" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></svg>
);
export const IconBitcoin = (p: IconProps) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M9.5 7.5h3.75a2.25 2.25 0 0 1 0 4.5H9.5h4.25a2.25 2.25 0 0 1 0 4.5H9.5v-9ZM11 6v1.5M11 16.5V18M13 6v1.5M13 16.5V18" /></svg>
);
export const IconSparkle = (p: IconProps) => (
  <svg {...base(p)}><path d="M12 3.5 13.8 9l5.7 1.5-5.7 1.5L12 17.5 10.2 12l-5.7-1.5L10.2 9 12 3.5Z" /></svg>
);
export const IconLogout = (p: IconProps) => (
  <svg {...base(p)}><path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" /><path d="M10 16l-4-4 4-4M6 12h10" /></svg>
);
export const IconGoogle = (p: IconProps) => (
  <svg width={p.size ?? 18} height={p.size ?? 18} viewBox="0 0 24 24" aria-hidden focusable={false}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);
