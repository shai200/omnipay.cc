import type { Dob } from '@/lib/age';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function readLine(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max || /[\u0000-\u001f\u007f]/.test(trimmed)) {
    return null;
  }
  return trimmed;
}

function readEmail(value: unknown): string | null {
  const email = readLine(value, 320);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return null;
  }
  return email;
}

const ADDRESS_FIELDS = ['country', 'line1', 'line2', 'city', 'state', 'postal_code'] as const;

export function appendCustomerInformation(
  form: URLSearchParams,
  profile: unknown,
  dob: Dob,
): void {
  const data = isRecord(profile) ? profile : {};
  const email = readEmail(data.email);
  if (email) form.append('customer_information[email]', email);

  const firstName = readLine(data.first_name, 100);
  if (firstName) form.append('customer_information[first_name]', firstName);

  const lastName = readLine(data.last_name, 100);
  if (lastName) form.append('customer_information[last_name]', lastName);

  form.append('customer_information[dob][year]', String(dob.year));
  form.append('customer_information[dob][month]', String(dob.month));
  form.append('customer_information[dob][day]', String(dob.day));

  if (!isRecord(data.address)) return;

  for (const field of ADDRESS_FIELDS) {
    const value = readLine(data.address[field], 200);
    if (value) {
      form.append(`customer_information[address][${field}]`, value);
    }
  }
}
