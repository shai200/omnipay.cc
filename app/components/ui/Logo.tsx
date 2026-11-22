import Link from 'next/link';

// The mark keeps the existing omega glyph. Only its container is restyled.
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center rounded-[10px] bg-primary font-bold text-primary-contrast shadow-[inset_0_1px_0_rgb(255_255_255/0.25)]"
      style={{ width: size, height: size, fontSize: size * 0.56, lineHeight: 1 }}
    >
      Ω
    </span>
  );
}

export function Logo({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5 rounded-md" aria-label="OmniPurchase home">
      <LogoMark />
      <span className="text-[1.0625rem] font-semibold tracking-tight text-fg">OmniPurchase</span>
    </Link>
  );
}
