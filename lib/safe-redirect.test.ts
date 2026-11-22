import { describe, expect, it } from 'vitest';
import { safeNextPath } from '@/lib/safe-redirect';

describe('safeNextPath', () => {
  it('keeps same-site paths', () => {
    expect(safeNextPath('/reminders')).toBe('/reminders');
    expect(safeNextPath('/#buy')).toBe('/#buy');
  });
  it('rejects external, protocol-relative and auth/api targets', () => {
    for (const value of ['https://evil.example', '//evil.example', '/\\evil.example', 'javascript:alert(1)', '/api/profile', '/auth/login', '', null]) {
      expect(safeNextPath(value)).toBe('/');
    }
  });
});
