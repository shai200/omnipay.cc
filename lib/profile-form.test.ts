import { describe, expect, it } from 'vitest';
import { parseProfilePatch } from '@/lib/profile';
import {
  EMPTY_PROFILE_FORM,
  profileFormError,
  profileFormToPayload,
  profileToForm,
  walletAddressError,
} from '@/lib/profile-form';

const BTC = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4';
const ETH = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
const NOW = new Date(Date.UTC(2026, 10, 22));

describe('profile form payload', () => {
  it('clears wallets, names and address lines that were emptied', () => {
    const form = profileToForm({
      first_name: 'Ada',
      last_name: 'Lovelace',
      address: { line1: '1 Main St', line2: 'Apt 2' },
      wallet_addresses: { bitcoin: BTC, ethereum: ETH },
    });
    const emptied = {
      ...form,
      last_name: '',
      address_line2: '',
      wallet_address_bitcoin: '',
      wallet_address_ethereum: '',
    };
    const parsed = parseProfilePatch(JSON.parse(JSON.stringify(profileFormToPayload(emptied))), NOW);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.patch.lastName).toBeNull();
    expect(parsed.patch.address?.line2).toBeNull();
    expect(parsed.patch.address?.line1).toBe('1 Main St');
    expect(parsed.patch.walletsProvided).toBe(true);
    expect(parsed.patch.walletBitcoin).toBeNull();
    expect(parsed.patch.walletEthereum).toBeNull();
  });

  it('leaves an empty date of birth untouched', () => {
    const parsed = parseProfilePatch(JSON.parse(JSON.stringify(profileFormToPayload(EMPTY_PROFILE_FORM))), NOW);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(parsed.patch.dob).toBeUndefined();
  });

  it('reports the server age-gate error before saving', () => {
    expect(profileFormError({ ...EMPTY_PROFILE_FORM, dob_day: '1', dob_month: '1', dob_year: String(new Date().getUTCFullYear() - 10) }))
      .toBe('You must be at least 18 years old to use this service.');
    expect(profileFormError({ ...EMPTY_PROFILE_FORM, dob_day: '1', dob_month: '1', dob_year: '1990' })).toBeNull();
  });
});

describe('wallet address errors', () => {
  it('matches the server classifier', () => {
    expect(walletAddressError('bitcoin', BTC)).toBeNull();
    expect(walletAddressError('ethereum', ETH)).toBeNull();
    expect(walletAddressError('bitcoin', '')).toBeNull();
    // Mixed-case bech32 passed the old client regex but the server rejects it.
    expect(walletAddressError('bitcoin', 'bc1QW508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4')).not.toBeNull();
    expect(walletAddressError('bitcoin', ETH)).toMatch(/Ethereum address/);
    expect(walletAddressError('ethereum', BTC)).toMatch(/Bitcoin address/);
  });
});
