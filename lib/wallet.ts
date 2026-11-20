export const SUPPORTED_NETWORKS = ['bitcoin', 'ethereum'] as const;

export type SupportedNetwork = (typeof SUPPORTED_NETWORKS)[number];

const ETH_ADDRESS = /^0x[a-fA-F0-9]{40}$/;
const BTC_BASE58 = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
const BTC_BECH32 = /^bc1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{11,71}$/;
const BTC_BECH32_UPPER = /^BC1[QPZRY9X8GF2TVDW0S3JN54KHCE6MUA7L]{11,71}$/;

// Format check used to choose a network. Stripe still rejects checksum failures.
export function classifyWalletAddress(address: string): SupportedNetwork | null {
  const trimmed = address.trim();
  if (trimmed.length === 0 || trimmed.length > 120) {
    return null;
  }
  if (ETH_ADDRESS.test(trimmed)) {
    return 'ethereum';
  }
  if (BTC_BASE58.test(trimmed) || BTC_BECH32.test(trimmed) || BTC_BECH32_UPPER.test(trimmed)) {
    return 'bitcoin';
  }
  return null;
}

export function walletAddressForNetwork(
  addresses: Partial<Record<string, string>> | null | undefined,
  network: SupportedNetwork,
): string | undefined {
  const value = addresses?.[network];
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
