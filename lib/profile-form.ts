import { dobEligibility, type Dob } from '@/lib/age';
import { classifyWalletAddress, type SupportedNetwork } from '@/lib/wallet';

// Shared by the sign-up form and the checkout settings form. The server
// (lib/profile.ts) stays the authority. This module only makes sure the
// browser sends what the person sees on screen, and reports the same errors
// before a request is made.

export type ProfileFormValues = {
  first_name: string;
  last_name: string;
  dob_day: string;
  dob_month: string;
  dob_year: string;
  address_country: string;
  address_line1: string;
  address_line2: string;
  address_city: string;
  address_state: string;
  address_postal_code: string;
};

const PROFILE_FIELDS = [
  'first_name',
  'last_name',
  'dob_day',
  'dob_month',
  'dob_year',
  'address_country',
  'address_line1',
  'address_line2',
  'address_city',
  'address_state',
  'address_postal_code',
] as const satisfies ReadonlyArray<keyof ProfileFormValues>;

export type CheckoutFormValues = ProfileFormValues & {
  wallet_address_ethereum: string;
  wallet_address_bitcoin: string;
  lock_wallet_address: boolean;
  source_currency: string;
  source_amount: string;
};

export type DobFieldsResult =
  | { ok: true; dob: Dob | null }
  | { ok: false; error: string };

const INCOMPLETE_DOB = 'Enter the day, month and year of your date of birth, or leave all three empty.';

// All three empty means "no date of birth". A partly filled date is an error
// here instead of a generic server rejection after the request.
export function readDobFields(
  fields: Pick<ProfileFormValues, 'dob_day' | 'dob_month' | 'dob_year'>,
  now: Date = new Date(),
): DobFieldsResult {
  const day = fields.dob_day.trim();
  const month = fields.dob_month.trim();
  const year = fields.dob_year.trim();
  if (!day && !month && !year) return { ok: true, dob: null };
  if (!day || !month || !year) return { ok: false, error: INCOMPLETE_DOB };
  const eligibility = dobEligibility({ day, month, year }, now);
  if (!eligibility.ok) return { ok: false, error: eligibility.error };
  return { ok: true, dob: eligibility.dob };
}

const WALLET_LABEL: Record<SupportedNetwork, string> = {
  bitcoin: 'Bitcoin',
  ethereum: 'Ethereum',
};

// Uses the same classifier as the server so the form never accepts an
// address the API will reject, or the reverse.
export function walletFieldError(network: SupportedNetwork, value: string): string {
  const address = value.trim();
  if (!address) return '';
  return classifyWalletAddress(address) === network ? '' : `Invalid ${WALLET_LABEL[network]} address format`;
}

export function countryFieldError(value: string): string {
  const country = value.trim();
  if (!country) return '';
  return /^[A-Za-z]{2}$/.test(country) ? '' : 'Use the 2-letter country code, for example US.';
}

export function sourceAmountFieldError(value: string): string {
  const amount = value.trim();
  if (!amount) return '';
  if (!/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.test(amount) || Number(amount) <= 0 || amount.length > 16) {
    return 'Enter an amount greater than zero with at most two decimals.';
  }
  return '';
}

function textOrNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export type ProfilePayload = {
  first_name: string | null;
  last_name: string | null;
  dob: Dob | null;
  address: {
    country: string | null;
    line1: string | null;
    line2: string | null;
    city: string | null;
    state: string | null;
    postal_code: string | null;
  };
};

export type CheckoutPayload = ProfilePayload & {
  wallet_addresses: Partial<Record<SupportedNetwork, string>>;
  lock_wallet_address: boolean;
  source_currency: string | null;
  source_amount: string | null;
};

// Empty fields are sent as null, not dropped. JSON.stringify removes
// undefined keys and the API leaves missing keys unchanged, so a cleared
// field used to come back after the next load.
export function buildProfilePayload(values: ProfileFormValues, dob: Dob | null): ProfilePayload {
  return {
    first_name: textOrNull(values.first_name),
    last_name: textOrNull(values.last_name),
    dob,
    address: {
      country: textOrNull(values.address_country)?.toUpperCase() ?? null,
      line1: textOrNull(values.address_line1),
      line2: textOrNull(values.address_line2),
      city: textOrNull(values.address_city),
      state: textOrNull(values.address_state),
      postal_code: textOrNull(values.address_postal_code),
    },
  };
}

export function buildCheckoutPayload(values: CheckoutFormValues, dob: Dob | null): CheckoutPayload {
  const wallets: Partial<Record<SupportedNetwork, string>> = {};
  const bitcoin = textOrNull(values.wallet_address_bitcoin);
  const ethereum = textOrNull(values.wallet_address_ethereum);
  if (bitcoin) wallets.bitcoin = bitcoin;
  if (ethereum) wallets.ethereum = ethereum;

  return {
    ...buildProfilePayload(values, dob),
    // Always present. An empty object tells the API to clear both addresses.
    wallet_addresses: wallets,
    lock_wallet_address: values.lock_wallet_address,
    source_currency: textOrNull(values.source_currency),
    source_amount: textOrNull(values.source_amount),
  };
}

// True when the sign-up profile step has nothing worth sending.
export function profileFormIsEmpty(values: ProfileFormValues): boolean {
  return PROFILE_FIELDS.every((field) => values[field].trim() === '');
}
