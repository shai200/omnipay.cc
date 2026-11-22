import { describe, expect, it } from 'vitest';
import { parseProfilePatch } from '@/lib/profile';
import {
  buildCheckoutPayload,
  countryFieldError,
  profileFormIsEmpty,
  readDobFields,
  sourceAmountFieldError,
  walletFieldError,
  type CheckoutFormValues,
} from './profile-form';

const NOW = new Date(Date.UTC(2026, 10, 22));
const BTC = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4';
const ETH = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';

const EMPTY: CheckoutFormValues = {
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
  wallet_address_ethereum: '',
  wallet_address_bitcoin: '',
  lock_wallet_address: false,
  source_currency: 'usd',
  source_amount: '',
};

describe('profile form helpers', () => {
  it('treats an empty date of birth as none and a partial one as an error', () => {
    expect(readDobFields(EMPTY, NOW)).toEqual({ ok: true, dob: null });
    const partial = readDobFields({ dob_day: '4', dob_month: '', dob_year: '1990' }, NOW);
    expect(partial.ok).toBe(false);
  });

  it('keeps the 18+ rule and the same messages as the server', () => {
    expect(readDobFields({ dob_day: '22', dob_month: '11', dob_year: '2008' }, NOW)).toEqual({
      ok: true,
      dob: { year: 2008, month: 11, day: 22 },
    });
    expect(readDobFields({ dob_day: '23', dob_month: '11', dob_year: '2008' }, NOW)).toEqual({
      ok: false,
      error: 'You must be at least 18 years old to use this service.',
    });
    expect(readDobFields({ dob_day: '31', dob_month: '2', dob_year: '1990' }, NOW)).toEqual({
      ok: false,
      error: 'A valid date of birth is required.',
    });
  });

  it('validates wallet addresses with the server classifier', () => {
    expect(walletFieldError('bitcoin', BTC)).toBe('');
    expect(walletFieldError('ethereum', ETH)).toBe('');
    expect(walletFieldError('bitcoin', ETH)).not.toBe('');
    expect(walletFieldError('ethereum', BTC)).not.toBe('');
    // Accepted by the old client-only pattern, rejected by the API.
    expect(walletFieldError('bitcoin', 'bc1' + 'B'.repeat(40))).not.toBe('');
    expect(walletFieldError('bitcoin', '')).toBe('');
  });

  it('checks country codes and amounts the way the API does', () => {
    expect(countryFieldError('us')).toBe('');
    expect(countryFieldError('USA')).not.toBe('');
    expect(sourceAmountFieldError('50.50')).toBe('');
    expect(sourceAmountFieldError('0')).not.toBe('');
    expect(sourceAmountFieldError('1.999')).not.toBe('');
  });

  it('sends cleared fields as explicit nulls so the API clears them', () => {
    const payload = JSON.parse(JSON.stringify(buildCheckoutPayload(EMPTY, null)));
    const parsed = parseProfilePatch(payload, NOW);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.patch.firstName).toBeNull();
    expect(parsed.patch.lastName).toBeNull();
    expect(parsed.patch.dob).toBeNull();
    expect(parsed.patch.address).toEqual({
      country: null, line1: null, line2: null, city: null, state: null, postalCode: null,
    });
    expect(parsed.patch.walletsProvided).toBe(true);
    expect(parsed.patch.walletBitcoin).toBeNull();
    expect(parsed.patch.walletEthereum).toBeNull();
    expect(parsed.patch.sourceAmount).toBeNull();
    expect(parsed.patch.sourceCurrency).toBe('usd');
  });

  it('round-trips a filled form through the API parser', () => {
    const values: CheckoutFormValues = {
      ...EMPTY,
      first_name: ' Ada ',
      address_country: 'gb',
      wallet_address_bitcoin: BTC,
      wallet_address_ethereum: ETH,
      lock_wallet_address: true,
      source_amount: '75',
      dob_day: '10', dob_month: '12', dob_year: '1990',
    };
    const dob = readDobFields(values, NOW);
    expect(dob.ok).toBe(true);
    if (!dob.ok) return;
    const parsed = parseProfilePatch(JSON.parse(JSON.stringify(buildCheckoutPayload(values, dob.dob))), NOW);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.patch.firstName).toBe('Ada');
    expect(parsed.patch.address?.country).toBe('GB');
    expect(parsed.patch.walletBitcoin).toBe(BTC);
    expect(parsed.patch.walletEthereum).toBe(ETH);
    expect(parsed.patch.lockWalletAddress).toBe(true);
    expect(parsed.patch.dob).toEqual({ year: 1990, month: 12, day: 10 });
  });

  it('knows when the optional sign-up step was left empty', () => {
    expect(profileFormIsEmpty(EMPTY)).toBe(true);
    expect(profileFormIsEmpty({ ...EMPTY, address_city: 'Oslo' })).toBe(false);
  });
});
