import { dobEligibility, type Dob } from '@/lib/age';
import { parseSourceAmount } from '@/lib/onramp-request';
import { classifyWalletAddress } from '@/lib/wallet';

export type ProfileAddress = {
  country?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
};

export type PublicProfile = {
  email?: string;
  first_name?: string;
  last_name?: string;
  dob?: { day?: number; month?: number; year?: number };
  address?: ProfileAddress;
  reminder_monthly?: boolean;
  reminder_price_drop?: boolean;
  reminder_weekly?: boolean;
  wallet_addresses?: { [key: string]: string };
  lock_wallet_address?: boolean;
  source_currency?: string;
  source_amount?: string;
};

export type ProfilePatch = {
  firstName?: string | null;
  lastName?: string | null;
  dob?: Dob | null;
  address?: {
    country?: string | null;
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
  };
  walletBitcoin?: string | null;
  walletEthereum?: string | null;
  walletsProvided?: boolean;
  lockWalletAddress?: boolean;
  sourceCurrency?: string | null;
  sourceAmount?: string | null;
  reminderWeekly?: boolean | null;
  reminderMonthly?: boolean | null;
  reminderPriceDrop?: boolean | null;
};

export type ProfilePatchResult = { ok: true; patch: ProfilePatch } | { ok: false; status: number; error: string };

const INVALID_DOB = 'A valid date of birth is required.';
const UNDERAGE = 'You must be at least 18 years old to use this service.';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function hasOwn(record: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function readText(value: unknown, max: number): { ok: true; value: string | null } | { ok: false } {
  if (value == null) return { ok: true, value: null };
  if (typeof value !== 'string') return { ok: false };
  const trimmed = value.trim();
  if (!trimmed) return { ok: true, value: null };
  if (trimmed.length > max || /[\u0000-\u001f\u007f]/.test(trimmed)) return { ok: false };
  return { ok: true, value: trimmed };
}

export function parseProfilePatch(body: unknown, now: Date = new Date()): ProfilePatchResult {
  if (!isRecord(body)) {
    return { ok: false, status: 400, error: 'Invalid profile.' };
  }

  const patch: ProfilePatch = {};

  if (hasOwn(body, 'first_name')) {
    const name = readText(body.first_name, 100);
    if (!name.ok) return { ok: false, status: 400, error: 'Invalid first name.' };
    patch.firstName = name.value;
  }
  if (hasOwn(body, 'last_name')) {
    const name = readText(body.last_name, 100);
    if (!name.ok) return { ok: false, status: 400, error: 'Invalid last name.' };
    patch.lastName = name.value;
  }

  if (hasOwn(body, 'dob')) {
    if (body.dob == null) {
      patch.dob = null;
    } else if (!isRecord(body.dob)) {
      return { ok: false, status: 400, error: INVALID_DOB };
    } else {
      const year = body.dob.year;
      const month = body.dob.month;
      const day = body.dob.day;
      const empty = (year == null || year === '') && (month == null || month === '') && (day == null || day === '');
      if (!empty) {
        const eligibility = dobEligibility(body.dob, now);
        if (!eligibility.ok) {
          return {
            ok: false,
            status: eligibility.reason === 'underage' ? 403 : 400,
            error: eligibility.reason === 'underage' ? UNDERAGE : INVALID_DOB,
          };
        }
        patch.dob = eligibility.dob;
      }
    }
  }

  if (hasOwn(body, 'address')) {
    if (body.address == null) {
      patch.address = {
        country: null,
        line1: null,
        line2: null,
        city: null,
        state: null,
        postalCode: null,
      };
    } else if (!isRecord(body.address)) {
      return { ok: false, status: 400, error: 'Invalid address.' };
    } else {
      const address: NonNullable<ProfilePatch['address']> = {};
      const fields = [
        ['country', 'country', 2],
        ['line1', 'line1', 200],
        ['line2', 'line2', 200],
        ['city', 'city', 200],
        ['state', 'state', 200],
        ['postal_code', 'postalCode', 32],
      ] as const;
      for (const [source, target, max] of fields) {
        if (!hasOwn(body.address, source)) continue;
        const text = readText(body.address[source], max);
        if (!text.ok) return { ok: false, status: 400, error: 'Invalid address.' };
        if (source === 'country' && text.value && !/^[A-Za-z]{2}$/.test(text.value)) {
          return { ok: false, status: 400, error: 'Invalid address.' };
        }
        address[target] = source === 'country' && text.value ? text.value.toUpperCase() : text.value;
      }
      patch.address = address;
    }
  }

  if (hasOwn(body, 'wallet_addresses')) {
    patch.walletsProvided = true;
    patch.walletBitcoin = null;
    patch.walletEthereum = null;
    if (body.wallet_addresses != null) {
      if (!isRecord(body.wallet_addresses)) {
        return { ok: false, status: 400, error: 'Invalid wallet address.' };
      }
      for (const key of Object.keys(body.wallet_addresses)) {
        if (key !== 'bitcoin' && key !== 'ethereum') {
          return { ok: false, status: 400, error: 'Invalid wallet address.' };
        }
      }
      for (const network of ['bitcoin', 'ethereum'] as const) {
        if (!hasOwn(body.wallet_addresses, network)) continue;
        const text = readText(body.wallet_addresses[network], 120);
        if (!text.ok || (text.value && classifyWalletAddress(text.value) !== network)) {
          return { ok: false, status: 400, error: 'Invalid wallet address.' };
        }
        if (network === 'bitcoin') patch.walletBitcoin = text.value;
        else patch.walletEthereum = text.value;
      }
    }
  }

  if (hasOwn(body, 'lock_wallet_address')) {
    if (typeof body.lock_wallet_address !== 'boolean') {
      return { ok: false, status: 400, error: 'Invalid wallet setting.' };
    }
    patch.lockWalletAddress = body.lock_wallet_address;
  }

  if (hasOwn(body, 'source_currency')) {
    const currency = readText(body.source_currency, 3);
    if (!currency.ok || (currency.value && currency.value.toLowerCase() !== 'usd' && currency.value.toLowerCase() !== 'eur')) {
      return { ok: false, status: 400, error: 'Invalid source currency.' };
    }
    patch.sourceCurrency = currency.value ? currency.value.toLowerCase() : null;
  }

  if (hasOwn(body, 'source_amount')) {
    const amount = parseSourceAmount(body.source_amount);
    if (!amount.ok) return { ok: false, status: 400, error: amount.error };
    patch.sourceAmount = amount.value;
  }

  for (const [source, target] of [
    ['reminder_weekly', 'reminderWeekly'],
    ['reminder_monthly', 'reminderMonthly'],
    ['reminder_price_drop', 'reminderPriceDrop'],
  ] as const) {
    if (!hasOwn(body, source)) continue;
    const value = body[source];
    if (value != null && typeof value !== 'boolean') {
      return { ok: false, status: 400, error: 'Invalid reminder preference.' };
    }
    patch[target] = value == null ? null : value;
  }

  return { ok: true, patch };
}

export function splitDisplayName(name: string | null | undefined): { firstName: string | null; lastName: string | null } {
  const trimmed = (name ?? '').trim();
  if (!trimmed || trimmed === 'Account') return { firstName: null, lastName: null };
  const parts = trimmed.split(/\s+/);
  return {
    firstName: parts[0] ?? null,
    lastName: parts.length > 1 ? parts.slice(1).join(' ') : null,
  };
}
