import { parseProfilePatch, type PublicProfile } from '@/lib/profile';
import { classifyWalletAddress, type SupportedNetwork } from '@/lib/wallet';

// String values of the checkout settings form. Every field is a string so it
// can back a controlled input.
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
  wallet_address_bitcoin: string;
  wallet_address_ethereum: string;
  lock_wallet_address: boolean;
  source_currency: string;
  source_amount: string;
};

export const EMPTY_PROFILE_FORM: ProfileFormValues = {
  first_name: '',
  last_name: '',
  dob_day: '',
  dob_month: '',
  dob_year: '',
  address_country: '',
  address_line1: '',
  address_line2: '',
  address_city: '',
  address_state: '',
  address_postal_code: '',
  wallet_address_bitcoin: '',
  wallet_address_ethereum: '',
  lock_wallet_address: false,
  source_currency: 'usd',
  source_amount: '100',
};

export function profileToForm(profile: PublicProfile | null | undefined): ProfileFormValues {
  if (!profile) return { ...EMPTY_PROFILE_FORM };
  return {
    first_name: profile.first_name ?? '',
    last_name: profile.last_name ?? '',
    dob_day: profile.dob?.day?.toString() ?? '',
    dob_month: profile.dob?.month?.toString() ?? '',
    dob_year: profile.dob?.year?.toString() ?? '',
    address_country: profile.address?.country ?? '',
    address_line1: profile.address?.line1 ?? '',
    address_line2: profile.address?.line2 ?? '',
    address_city: profile.address?.city ?? '',
    address_state: profile.address?.state ?? '',
    address_postal_code: profile.address?.postal_code ?? '',
    wallet_address_bitcoin: profile.wallet_addresses?.bitcoin ?? '',
    wallet_address_ethereum: profile.wallet_addresses?.ethereum ?? '',
    lock_wallet_address: profile.lock_wallet_address === true,
    source_currency: profile.source_currency || 'usd',
    source_amount: profile.source_amount || '100',
  };
}

function numberOrUndefined(value: string): number | undefined {
  const trimmed = value.trim();
  return trimmed ? Number(trimmed) : undefined;
}

// Builds the PUT /api/profile body. Empty strings are sent (not dropped) so a
// cleared field is cleared on the server: it stores '' as null. Dropping them
// meant an emptied wallet, address line or name silently kept its old value.
export function profileFormToPayload(form: ProfileFormValues): PublicProfile {
  return {
    first_name: form.first_name.trim(),
    last_name: form.last_name.trim(),
    dob: {
      day: numberOrUndefined(form.dob_day),
      month: numberOrUndefined(form.dob_month),
      year: numberOrUndefined(form.dob_year),
    },
    address: {
      country: form.address_country.trim(),
      line1: form.address_line1.trim(),
      line2: form.address_line2.trim(),
      city: form.address_city.trim(),
      state: form.address_state.trim(),
      postal_code: form.address_postal_code.trim(),
    },
    wallet_addresses: {
      bitcoin: form.wallet_address_bitcoin.trim(),
      ethereum: form.wallet_address_ethereum.trim(),
    },
    lock_wallet_address: form.lock_wallet_address,
    source_currency: form.source_currency.trim(),
    source_amount: form.source_amount.trim(),
  };
}

const NETWORK_LABEL: Record<SupportedNetwork, string> = {
  bitcoin: 'Bitcoin',
  ethereum: 'Ethereum',
};

// Same format check the server applies, so the form never accepts an address
// the API will reject (or the reverse).
export function walletAddressError(network: SupportedNetwork, value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const detected = classifyWalletAddress(trimmed);
  if (detected === network) return null;
  if (detected) {
    return `This looks like a ${NETWORK_LABEL[detected]} address. Enter a ${NETWORK_LABEL[network]} address here.`;
  }
  return `Enter a valid ${NETWORK_LABEL[network]} address.`;
}

// Runs the server's own parser so the form reports the same error before saving.
export function profileFormError(form: ProfileFormValues): string | null {
  const result = parseProfilePatch(profileFormToPayload(form));
  return result.ok ? null : result.error;
}
