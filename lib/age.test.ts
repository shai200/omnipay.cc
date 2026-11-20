import { describe, expect, it } from 'vitest';
import { ageInYears, dobEligibility, parseDob } from './age';

const NOW = new Date(Date.UTC(2026, 10, 20, 23, 30, 0));

describe('parseDob', () => {
  it('accepts numeric and numeric-string calendar dates', () => {
    expect(parseDob({ year: 1990, month: 2, day: 15 })).toEqual({ year: 1990, month: 2, day: 15 });
    expect(parseDob({ year: '2000', month: '02', day: '29' })).toEqual({ year: 2000, month: 2, day: 29 });
  });

  it('rejects incomplete, impossible, and out-of-range dates', () => {
    expect(parseDob(null)).toBeNull();
    expect(parseDob({})).toBeNull();
    expect(parseDob({ year: 1990, month: 1 })).toBeNull();
    expect(parseDob({ year: 1990, month: 2, day: 31 })).toBeNull();
    expect(parseDob({ year: 1900, month: 2, day: 29 })).toBeNull();
    expect(parseDob({ year: 1899, month: 1, day: 1 })).toBeNull();
    expect(parseDob({ year: '1990.5', month: 1, day: 1 })).toBeNull();
  });
});

describe('dobEligibility', () => {
  it('allows a person who turns 18 on the UTC calendar date', () => {
    const result = dobEligibility({ year: 2008, month: 11, day: 20 }, NOW);
    expect(result.ok).toBe(true);
    expect(ageInYears({ year: 2008, month: 11, day: 20 }, { year: 2026, month: 11, day: 20 })).toBe(18);
  });

  it('does not treat 13 as old enough', () => {
    const result = dobEligibility({ year: 2013, month: 11, day: 20 }, NOW);
    expect(result).toMatchObject({ ok: false, reason: 'underage' });
  });

  it('blocks the day before the 18th birthday', () => {
    const result = dobEligibility({ year: 2008, month: 11, day: 21 }, NOW);
    expect(result).toMatchObject({
      ok: false,
      reason: 'underage',
      error: 'You must be at least 18 years old to use this service.',
    });
  });

  it('blocks a missing or invalid date of birth', () => {
    expect(dobEligibility(undefined, NOW)).toMatchObject({ ok: false, reason: 'invalid' });
    expect(dobEligibility({ year: 1990, month: 2, day: 31 }, NOW)).toMatchObject({
      ok: false,
      reason: 'invalid',
      error: 'A valid date of birth is required.',
    });
  });

  it('blocks a date in the future', () => {
    expect(dobEligibility({ year: 2027, month: 1, day: 1 }, NOW)).toMatchObject({
      ok: false,
      reason: 'invalid',
    });
  });
});
