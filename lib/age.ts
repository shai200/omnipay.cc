export const MINIMUM_ONRAMP_AGE = 18;

export type Dob = {
  year: number;
  month: number;
  day: number;
};

export type AgeEligibility =
  | { ok: true; dob: Dob }
  | { ok: false; reason: 'invalid' | 'underage'; error: string };

const INVALID_DOB = 'A valid date of birth is required.';
const UNDERAGE = 'You must be at least 18 years old to use this service.';

type CalendarDate = {
  year: number;
  month: number;
  day: number;
};

function integer(value: unknown): number | null {
  if (typeof value === 'number' && Number.isInteger(value)) {
    return value;
  }
  if (typeof value === 'string' && /^-?\d+$/.test(value.trim())) {
    return Number(value.trim());
  }
  return null;
}

export function parseDob(input: unknown): Dob | null {
  if (!input || typeof input !== 'object') {
    return null;
  }

  const raw = input as Record<string, unknown>;
  const year = integer(raw.year);
  const month = integer(raw.month);
  const day = integer(raw.day);

  if (year == null || month == null || day == null) {
    return null;
  }
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  const utc = new Date(Date.UTC(year, month - 1, day));
  if (
    utc.getUTCFullYear() !== year ||
    utc.getUTCMonth() !== month - 1 ||
    utc.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

function calendarDate(now: Date): CalendarDate {
  return {
    year: now.getUTCFullYear(),
    month: now.getUTCMonth() + 1,
    day: now.getUTCDate(),
  };
}

function isAfter(dob: CalendarDate, today: CalendarDate): boolean {
  if (dob.year !== today.year) return dob.year > today.year;
  if (dob.month !== today.month) return dob.month > today.month;
  return dob.day > today.day;
}

export function ageInYears(dob: CalendarDate, today: CalendarDate): number {
  let age = today.year - dob.year;
  if (today.month < dob.month || (today.month === dob.month && today.day < dob.day)) {
    age -= 1;
  }
  return age;
}

// Calendar age in UTC. The stored DOB is a calendar date, not a timestamp.
export function dobEligibility(input: unknown, now: Date = new Date()): AgeEligibility {
  const dob = parseDob(input);
  if (!dob) {
    return { ok: false, reason: 'invalid', error: INVALID_DOB };
  }

  const today = calendarDate(now);
  if (isAfter(dob, today)) {
    return { ok: false, reason: 'invalid', error: INVALID_DOB };
  }
  if (ageInYears(dob, today) < MINIMUM_ONRAMP_AGE) {
    return { ok: false, reason: 'underage', error: UNDERAGE };
  }

  return { ok: true, dob };
}
