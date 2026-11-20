import { classifyWalletAddress, type SupportedNetwork } from '@/lib/wallet';

const CURRENCY_NETWORK: Partial<Record<string, SupportedNetwork>> = {
  btc: 'bitcoin',
  eth: 'ethereum',
};

export type ResolvedOnrampRequest = {
  sourceAmount: string | null;
  sourceCurrency: string | null;
  destinationCurrency: string | null;
  destinationNetwork: SupportedNetwork | null;
  walletAddress: string | null;
};

export type OnrampRequestResult =
  | ({ ok: true } & ResolvedOnrampRequest)
  | { ok: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function isBlank(value: unknown): boolean {
  return value == null || (typeof value === 'string' && value.trim() === '');
}

export function parseSourceAmount(
  value: unknown,
): { ok: true; value: string | null } | { ok: false; error: string } {
  if (isBlank(value)) {
    return { ok: true, value: null };
  }

  const raw = typeof value === 'number' ? String(value) : typeof value === 'string' ? value.trim() : null;
  if (
    raw == null ||
    raw.length > 16 ||
    !/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.test(raw) ||
    Number(raw) <= 0
  ) {
    return { ok: false, error: 'Invalid source amount.' };
  }

  return { ok: true, value: raw };
}

function parseSourceCurrency(
  value: unknown,
): { ok: true; value: string | null } | { ok: false; error: string } {
  if (isBlank(value)) {
    return { ok: true, value: null };
  }
  if (typeof value !== 'string' || !/^[a-zA-Z]{3}$/.test(value.trim())) {
    return { ok: false, error: 'Invalid source currency.' };
  }
  return { ok: true, value: value.trim().toLowerCase() };
}

function parseDestinationCurrency(
  value: unknown,
): { ok: true; value: string | null } | { ok: false; error: string } {
  if (isBlank(value)) {
    return { ok: true, value: null };
  }
  if (typeof value !== 'string' || !/^[a-zA-Z]{2,10}$/.test(value.trim())) {
    return { ok: false, error: 'Invalid destination currency.' };
  }
  return { ok: true, value: value.trim().toLowerCase() };
}

function parseDestinationNetwork(
  value: unknown,
): { ok: true; value: SupportedNetwork | null } | { ok: false; error: string } {
  if (isBlank(value)) {
    return { ok: true, value: null };
  }
  if (typeof value !== 'string') {
    return { ok: false, error: 'Unsupported destination network.' };
  }
  const network = value.trim().toLowerCase();
  if (network !== 'bitcoin' && network !== 'ethereum') {
    return { ok: false, error: 'Unsupported destination network.' };
  }
  return { ok: true, value: network };
}

function parseWallet(
  value: unknown,
): { ok: true; address: string | null; network: SupportedNetwork | null } | { ok: false; error: string } {
  if (isBlank(value)) {
    return { ok: true, address: null, network: null };
  }
  if (typeof value !== 'string') {
    return { ok: false, error: 'Invalid wallet address.' };
  }
  const address = value.trim();
  const network = classifyWalletAddress(address);
  if (!network) {
    return { ok: false, error: 'Invalid wallet address.' };
  }
  return { ok: true, address, network };
}

// Caller-supplied userId is intentionally ignored. The route derives the uid from the ID token.
export function resolveOnrampRequest(body: unknown): OnrampRequestResult {
  const record = isRecord(body) ? body : {};

  const sourceAmount = parseSourceAmount(record.sourceAmount);
  if (!sourceAmount.ok) return sourceAmount;

  const sourceCurrency = parseSourceCurrency(record.sourceCurrency);
  if (!sourceCurrency.ok) return sourceCurrency;

  const destinationCurrency = parseDestinationCurrency(record.destinationCurrency);
  if (!destinationCurrency.ok) return destinationCurrency;

  const destinationNetwork = parseDestinationNetwork(record.destinationNetwork);
  if (!destinationNetwork.ok) return destinationNetwork;

  const implied = destinationCurrency.value ? CURRENCY_NETWORK[destinationCurrency.value] : undefined;
  if (implied && destinationNetwork.value && implied !== destinationNetwork.value) {
    return { ok: false, error: 'Destination currency does not match the destination network.' };
  }

  let network = destinationNetwork.value ?? implied ?? null;
  const wallet = parseWallet(record.walletAddress);
  if (!wallet.ok) return wallet;

  if (wallet.network) {
    if (network && network !== wallet.network) {
      return { ok: false, error: 'Wallet address does not match the destination network.' };
    }
    network = network ?? wallet.network;
  }

  return {
    ok: true,
    sourceAmount: sourceAmount.value,
    sourceCurrency: sourceCurrency.value,
    destinationCurrency: destinationCurrency.value,
    destinationNetwork: network,
    walletAddress: wallet.address,
  };
}

export function isSafeSessionId(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  if (value.length < 1 || value.length > 128) return false;
  if (value === '.' || value === '..') return false;
  if (value.includes('/') || value.includes('\\')) return false;
  return !/[\u0000-\u001f\u007f]/.test(value);
}
