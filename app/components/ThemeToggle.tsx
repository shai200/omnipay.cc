'use client';

import { useTheme } from '../contexts/ThemeContext';
import { IconMoon, IconSun } from './ui/icons';
import { cn } from '@/lib/cn';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'inline-flex size-10 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg',
        className,
      )}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      {/* Icons swap through CSS so the server and client markup match. */}
      <IconMoon size={18} className="dark:hidden" />
      <IconSun size={18} className="hidden dark:block" />
    </button>
  );
}
