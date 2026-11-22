'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

// Fades content up the first time it scrolls into view. The hidden state is
// only applied from this effect, so content stays visible without
// JavaScript, and CSS neutralises it under prefers-reduced-motion.
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const rect = node.getBoundingClientRect();
    // Already on screen at load: leave it alone, no flash.
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    node.setAttribute('data-reveal', 'pending');
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          node.setAttribute('data-reveal', 'shown');
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal="shown"
      className={className}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
