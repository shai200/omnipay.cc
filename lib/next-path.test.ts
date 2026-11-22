import { describe, expect, it } from 'vitest';
import { loginHref, registerHref, safeNextPath } from './next-path';

describe('post sign-in redirect target', () => {
  it('accepts only known in-app pages', () => {
    expect(safeNextPath('/reminders')).toBe('/reminders');
    expect(safeNextPath('/checkout-settings')).toBe('/checkout-settings');
    expect(safeNextPath(['/reminders', '/x'])).toBe('/reminders');
  });

  it('falls back to home for anything else, including off-site targets', () => {
    for (const value of [
      undefined, null, 42, '', 'reminders', '//evil.example', 'https://evil.example',
      '/\\evil.example', '/reminders/../x', '/reminders?x=1', 'javascript:alert(1)',
    ]) {
      expect(safeNextPath(value)).toBe('/');
    }
  });

  it('builds sign-in links that carry the target', () => {
    expect(loginHref('/')).toBe('/auth/login');
    expect(loginHref('/reminders')).toBe('/auth/login?next=%2Freminders');
    expect(registerHref('/checkout-settings')).toBe('/auth/register?next=%2Fcheckout-settings');
  });
});
