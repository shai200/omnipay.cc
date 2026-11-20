import { describe, expect, it } from 'vitest';
import { resolveOnrampRequest } from './onramp-request';
import { walletAddressForNetwork } from './wallet';

const BTC = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4';
const ETH = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';

describe('resolveOnrampRequest wallet network', () => {
  it('sends a bitcoin address on the bitcoin network', () => {
    const result = resolveOnrampRequest({
      walletAddress: BTC,
      destinationCurrency: 'btc',
      destinationNetwork: 'bitcoin',
      userId: 'ignored-caller-id',
    });
    expect(result).toMatchObject({
      ok: true,
      destinationNetwork: 'bitcoin',
      destinationCurrency: 'btc',
      walletAddress: BTC,
    });
  });

  it('infers bitcoin when a BTC address is saved and the network field was omitted', () => {
    const result = resolveOnrampRequest({
      walletAddress: `  ${BTC}  `,
      destinationCurrency: 'BTC',
    });
    expect(result).toMatchObject({
      ok: true,
      destinationNetwork: 'bitcoin',
      walletAddress: BTC,
    });
  });

  it('rejects an ethereum address for a bitcoin purchase', () => {
    const result = resolveOnrampRequest({
      walletAddress: ETH,
      destinationCurrency: 'btc',
      destinationNetwork: 'bitcoin',
    });
    expect(result).toEqual({
      ok: false,
      error: 'Wallet address does not match the destination network.',
    });
  });

  it('rejects unsupported networks and invalid addresses', () => {
    expect(resolveOnrampRequest({ destinationNetwork: 'solana' })).toEqual({
      ok: false,
      error: 'Unsupported destination network.',
    });
    expect(resolveOnrampRequest({ walletAddress: 'not-a-wallet', destinationNetwork: 'bitcoin' })).toEqual({
      ok: false,
      error: 'Invalid wallet address.',
    });
  });

  it('rejects a currency that disagrees with the network', () => {
    expect(resolveOnrampRequest({
      destinationCurrency: 'btc',
      destinationNetwork: 'ethereum',
      walletAddress: ETH,
    })).toEqual({
      ok: false,
      error: 'Destination currency does not match the destination network.',
    });
  });
});

describe('walletAddressForNetwork', () => {
  it('does not substitute an ethereum address for a bitcoin purchase', () => {
    expect(walletAddressForNetwork({ ethereum: ETH, bitcoin: BTC }, 'bitcoin')).toBe(BTC);
    expect(walletAddressForNetwork({ ethereum: ETH }, 'bitcoin')).toBeUndefined();
    expect(walletAddressForNetwork({ bitcoin: '  ' }, 'bitcoin')).toBeUndefined();
  });
});
