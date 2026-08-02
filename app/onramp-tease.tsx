"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const presets = [25, 50, 100, 250] as const;
const minAmount = 10;
const maxAmount = 10_000;
/** Preview-only: tease quotes soft-stale after this many seconds. */
const quoteTtlSeconds = 45;

const assets = [
  { id: "btc", label: "BTC", name: "Bitcoin", network: "Bitcoin" },
  { id: "eth", label: "ETH", name: "Ethereum", network: "Ethereum" },
  { id: "usdc", label: "USDC", name: "USD Coin", network: "Ethereum" },
  { id: "sol", label: "SOL", name: "Solana", network: "Solana" },
] as const;

/** Preview-only tease rates (USD per 1 unit). Not live quotes. */
const teaseRatesUsd: Record<(typeof assets)[number]["id"], number> = {
  btc: 95_000,
  eth: 3_400,
  usdc: 1,
  sol: 180,
};

const networks = [
  {
    id: "bitcoin",
    label: "Bitcoin",
    assets: ["btc"],
    placeholder: "bc1… or 1… / 3…",
    pattern: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/,
  },
  {
    id: "ethereum",
    label: "Ethereum",
    assets: ["eth", "usdc"],
    placeholder: "0x… Ethereum address",
    pattern: /^0x[a-fA-F0-9]{40}$/,
  },
  {
    id: "solana",
    label: "Solana",
    assets: ["sol", "usdc"],
    placeholder: "Base58 Solana address",
    pattern: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  },
] as const;

const paymentMethods = [
  { id: "visa", label: "Visa" },
  { id: "mastercard", label: "Mastercard" },
  { id: "amex", label: "Amex" },
  { id: "debit", label: "Debit" },
] as const;

const buyCadences = [
  { id: "once", label: "Once", detail: "Single buy" },
  { id: "weekly", label: "Weekly", detail: "DCA habit" },
  { id: "monthly", label: "Monthly", detail: "Long game" },
] as const;

const slippageOptions = [
  { id: "0.5", label: "0.5%", detail: "Tight" },
  { id: "1", label: "1%", detail: "Balanced" },
  { id: "2", label: "2%", detail: "Flexible" },
] as const;

const networkSpeeds = [
  {
    id: "standard",
    label: "Standard",
    detail: "~60s settle",
    feeRate: 0.015,
    eta: "under 1 min",
  },
  {
    id: "priority",
    label: "Priority",
    detail: "~15s settle",
    feeRate: 0.022,
    eta: "~15s after pay",
  },
] as const;

const billingCountries = [
  {
    id: "us",
    label: "United States",
    detail: "Cards + debit",
    payments: ["visa", "mastercard", "amex", "debit"] as const,
  },
  {
    id: "uk",
    label: "United Kingdom",
    detail: "Visa / MC / debit",
    payments: ["visa", "mastercard", "debit"] as const,
  },
  {
    id: "eu",
    label: "European Union",
    detail: "Visa / MC",
    payments: ["visa", "mastercard"] as const,
  },
  {
    id: "ca",
    label: "Canada",
    detail: "Visa / MC / Amex",
    payments: ["visa", "mastercard", "amex"] as const,
  },
  {
    id: "other",
    label: "Other",
    detail: "Visa / MC only",
    payments: ["visa", "mastercard"] as const,
  },
] as const;

/** Preview-only tease promo codes (not live Stripe coupons). */
const promoCodes: Record<string, { label: string; discountPct: number }> = {
  OMNI10: { label: "10% off fees", discountPct: 10 },
  ACCUMULATE: { label: "5% off fees", discountPct: 5 },
};

/** Preview-only fiat currencies — tease FX only, not live Stripe FX. */
const fiatCurrencies = [
  {
    id: "usd",
    label: "USD",
    detail: "US dollar",
    symbol: "$",
    /** Tease: units of this fiat ≈ 1 USD. */
    perUsd: 1,
  },
  {
    id: "eur",
    label: "EUR",
    detail: "Euro",
    symbol: "€",
    perUsd: 0.92,
  },
  {
    id: "gbp",
    label: "GBP",
    detail: "Pound",
    symbol: "£",
    perUsd: 0.79,
  },
] as const;

/** Preview-only compliance tease — not a live KYC answer. */
const fundSources = [
  { id: "salary", label: "Salary", detail: "Paycheck" },
  { id: "savings", label: "Savings", detail: "Existing cash" },
  { id: "business", label: "Business", detail: "Company funds" },
  { id: "other", label: "Other", detail: "Tell us later" },
] as const;

/** Preview-only purchase purpose tease — not a live KYC answer. */
const purchasePurposes = [
  { id: "invest", label: "Invest", detail: "Accumulate" },
  { id: "spend", label: "Spend", detail: "Pay / use" },
  { id: "remit", label: "Remit", detail: "Send abroad" },
  { id: "gift", label: "Gift", detail: "Someone else" },
] as const;

/** Preview-only tax residency tease — not a live W-9 / CRS answer. */
const taxResidencies = [
  { id: "us", label: "US person", detail: "Tax resident US" },
  { id: "non-us", label: "Non-US", detail: "Outside US" },
  { id: "prefer-not", label: "Prefer not", detail: "Tell us later" },
] as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Preview-only E.164-ish phone (digits, optional leading +). */
const smsPattern = /^\+?[1-9]\d{7,14}$/;
const memoMaxLen = 80;
const promoMaxLen = 24;
const smsMaxLen = 18;
/** Preview-only draft in this browser — not a server-side order. */
const draftStorageKey = "omnipay-preview-draft-v1";
/** Preview-only A/B pin slot (this browser) — independent of Save draft. */
const pinStorageKey = "omnipay-preview-pin-v1";
/** Preview-only autosave preference (this browser). */
const autosavePrefKey = "omnipay-preview-autosave-v1";
/** Debounce for preview autosave writes. */
const autosaveDebounceMs = 800;
/** Preview-only shareable draft hash prefix (client-side only). */
const draftHashPrefix = "omn-draft=";

type PreviewDraftV1 = {
  v: 1;
  savedAt: string;
  amount: string;
  asset: (typeof assets)[number]["id"];
  network: (typeof networks)[number]["id"];
  wallet: string;
  confirmWallet: boolean;
  paymentMethod: (typeof paymentMethods)[number]["id"];
  buyCadence: (typeof buyCadences)[number]["id"];
  slippage: (typeof slippageOptions)[number]["id"];
  networkSpeed: (typeof networkSpeeds)[number]["id"];
  orderMemo: string;
  riskAccepted: boolean;
  tosAccepted: boolean;
  privacyAccepted: boolean;
  selfCustodyAccepted: boolean;
  ageConfirmed: boolean;
  receiptEmail: string;
  receiptConfirm: string;
  billingCountry: (typeof billingCountries)[number]["id"];
  promoCode: string;
  fundSource: (typeof fundSources)[number]["id"];
  purchasePurpose: (typeof purchasePurposes)[number]["id"];
  fiatCurrency: (typeof fiatCurrencies)[number]["id"];
  taxResidency: (typeof taxResidencies)[number]["id"];
  smsPhone: string;
};

/** Preview-only: stable fingerprint ignores savedAt so copy/verify compares fields. */
function canonicalDraftForFingerprint(draft: PreviewDraftV1): string {
  const { savedAt: _savedAt, ...rest } = draft;
  return JSON.stringify(rest);
}

/** Preview-only FNV-1a 32-bit hex — not a cryptographic hash. */
function fingerprintDraft(draft: PreviewDraftV1): string {
  const s = canonicalDraftForFingerprint(draft);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0").toUpperCase();
}

/** Human labels for preview draft field diffs (ignores savedAt). */
const draftFieldLabels: Record<
  Exclude<keyof PreviewDraftV1, "v" | "savedAt">,
  string
> = {
  amount: "Amount",
  asset: "Asset",
  network: "Network",
  wallet: "Wallet",
  confirmWallet: "Confirm wallet",
  paymentMethod: "Pay method",
  buyCadence: "Buy frequency",
  slippage: "Slippage",
  networkSpeed: "Network speed",
  orderMemo: "Order memo",
  riskAccepted: "Risk disclosure",
  tosAccepted: "Terms of Service",
  privacyAccepted: "Privacy Policy",
  selfCustodyAccepted: "Self-custody",
  ageConfirmed: "Age 18+",
  receiptEmail: "Receipt email",
  receiptConfirm: "Receipt confirm",
  billingCountry: "Billing country",
  promoCode: "Promo code",
  fundSource: "Source of funds",
  purchasePurpose: "Purchase purpose",
  fiatCurrency: "Fiat currency",
  taxResidency: "Tax residency",
  smsPhone: "SMS phone",
};

function formatDraftDiffValue(value: unknown): string {
  if (typeof value === "boolean") return value ? "yes" : "no";
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "(empty)";
    if (trimmed.length > 28) return `${trimmed.slice(0, 24)}…`;
    return trimmed;
  }
  return String(value);
}

/** Preview-only: field-level diff, ignores v + savedAt. */
function diffDraftFields(
  current: PreviewDraftV1,
  other: PreviewDraftV1,
  otherLabel: "link" | "pin" = "link",
  currentLabel: "form" | "pin" = "form",
): string[] {
  const keys = Object.keys(draftFieldLabels) as Array<
    keyof typeof draftFieldLabels
  >;
  const lines: string[] = [];
  for (const key of keys) {
    if (current[key] === other[key]) continue;
    lines.push(
      `${draftFieldLabels[key]}: ${currentLabel} ${formatDraftDiffValue(current[key])} → ${otherLabel} ${formatDraftDiffValue(other[key])}`,
    );
  }
  return lines;
}

function isDraftEnum<T extends string>(
  value: unknown,
  allowed: readonly { id: T }[],
): value is T {
  return (
    typeof value === "string" &&
    allowed.some((option) => option.id === value)
  );
}

/** Preview-only: accept localStorage or imported .json drafts. */
function parseDraftPayload(raw: unknown): PreviewDraftV1 | null {
  if (!raw || typeof raw !== "object") return null;
  const parsed = raw as Partial<PreviewDraftV1>;
  if (parsed.v !== 1 || typeof parsed.amount !== "string") return null;
  if (
    !isDraftEnum(parsed.asset, assets) ||
    !isDraftEnum(parsed.network, networks) ||
    !isDraftEnum(parsed.paymentMethod, paymentMethods) ||
    !isDraftEnum(parsed.buyCadence, buyCadences) ||
    !isDraftEnum(parsed.slippage, slippageOptions) ||
    !isDraftEnum(parsed.networkSpeed, networkSpeeds) ||
    !isDraftEnum(parsed.billingCountry, billingCountries) ||
    !isDraftEnum(parsed.fundSource, fundSources) ||
    !isDraftEnum(parsed.purchasePurpose, purchasePurposes) ||
    !isDraftEnum(parsed.fiatCurrency, fiatCurrencies) ||
    !isDraftEnum(parsed.taxResidency, taxResidencies)
  ) {
    return null;
  }
  if (
    typeof parsed.wallet !== "string" ||
    typeof parsed.confirmWallet !== "boolean" ||
    typeof parsed.orderMemo !== "string" ||
    typeof parsed.riskAccepted !== "boolean" ||
    typeof parsed.tosAccepted !== "boolean" ||
    typeof parsed.privacyAccepted !== "boolean" ||
    typeof parsed.selfCustodyAccepted !== "boolean" ||
    typeof parsed.ageConfirmed !== "boolean" ||
    typeof parsed.receiptEmail !== "string" ||
    typeof parsed.receiptConfirm !== "string" ||
    typeof parsed.promoCode !== "string" ||
    typeof parsed.smsPhone !== "string" ||
    typeof parsed.savedAt !== "string"
  ) {
    return null;
  }
  return parsed as PreviewDraftV1;
}

function readDraftFromStorage(): PreviewDraftV1 | null {
  try {
    const raw = window.localStorage.getItem(draftStorageKey);
    if (!raw) return null;
    return parseDraftPayload(JSON.parse(raw));
  } catch {
    return null;
  }
}

function readPinFromStorage(): PreviewDraftV1 | null {
  try {
    const raw = window.localStorage.getItem(pinStorageKey);
    if (!raw) return null;
    return parseDraftPayload(JSON.parse(raw));
  } catch {
    return null;
  }
}

/** Preview-only: base64url encode draft for URL hash (not a server order). */
function encodeDraftForHash(draft: PreviewDraftV1): string {
  const json = JSON.stringify(draft);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decodeDraftFromHash(token: string): PreviewDraftV1 | null {
  try {
    const b64 = token.replace(/-/g, "+").replace(/_/g, "/");
    const pad =
      b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
    const binary = atob(b64 + pad);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return parseDraftPayload(JSON.parse(json));
  } catch {
    return null;
  }
}

function readDraftFromHash(): PreviewDraftV1 | null {
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash.startsWith(draftHashPrefix)) return null;
  return decodeDraftFromHash(
    decodeURIComponent(hash.slice(draftHashPrefix.length)),
  );
}

/** Preview-only: extract draft from a pasted URL, hash, or bare token. */
function extractDraftFromPaste(raw: string): PreviewDraftV1 | null {
  const text = raw.trim();
  if (!text) return null;
  try {
    if (text.includes("#") || text.startsWith("http")) {
      const asUrl = text.includes("://")
        ? new URL(text)
        : new URL(text, window.location.origin);
      const hash = asUrl.hash.replace(/^#/, "");
      if (hash.startsWith(draftHashPrefix)) {
        return decodeDraftFromHash(
          decodeURIComponent(hash.slice(draftHashPrefix.length)),
        );
      }
    }
  } catch {
    /* fall through to bare-token parse */
  }
  const hashIdx = text.indexOf(`#${draftHashPrefix}`);
  if (hashIdx >= 0) {
    return decodeDraftFromHash(
      decodeURIComponent(text.slice(hashIdx + 1 + draftHashPrefix.length)),
    );
  }
  if (text.startsWith(draftHashPrefix)) {
    return decodeDraftFromHash(
      decodeURIComponent(text.slice(draftHashPrefix.length)),
    );
  }
  // Bare base64url token (no prefix) — attempt decode.
  return decodeDraftFromHash(text);
}

function clearDraftHash() {
  if (!window.location.hash.startsWith(`#${draftHashPrefix}`)) return;
  const { pathname, search } = window.location;
  window.history.replaceState(null, "", `${pathname}${search}`);
}

function makeOrderRef() {
  const n = Math.floor(Math.random() * 900_000) + 100_000;
  return `OMN-${n}`;
}

function formatReceive(amount: number, assetId: (typeof assets)[number]["id"]) {
  const rate = teaseRatesUsd[assetId];
  const units = amount / rate;
  if (assetId === "usdc") return `~${units.toFixed(2)} USDC`;
  if (assetId === "btc") return `~${units.toFixed(6)} BTC`;
  if (assetId === "eth") return `~${units.toFixed(5)} ETH`;
  return `~${units.toFixed(4)} SOL`;
}

function formatQuoteTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

/** Preview-only settle window from speed tease (seconds after quote). */
function arrivalBounds(speedId: (typeof networkSpeeds)[number]["id"]) {
  return speedId === "priority"
    ? ({ lo: 10, hi: 30 } as const)
    : ({ lo: 45, hi: 90 } as const);
}

function formatArrivalWindow(
  speedId: (typeof networkSpeeds)[number]["id"],
  from: Date,
) {
  const { lo, hi } = arrivalBounds(speedId);
  const start = new Date(from.getTime() + lo * 1000);
  const end = new Date(from.getTime() + hi * 1000);
  return `${formatQuoteTime(start)}–${formatQuoteTime(end)}`;
}

function formatUnitRate(
  assetId: (typeof assets)[number]["id"],
  jitterBps: number,
) {
  const base = teaseRatesUsd[assetId];
  const adjusted = base * (1 + jitterBps / 10_000);
  if (assetId === "usdc") return `$${adjusted.toFixed(4)}`;
  if (assetId === "btc") {
    return `$${Math.round(adjusted).toLocaleString("en-US")}`;
  }
  if (assetId === "eth") {
    return `$${Math.round(adjusted).toLocaleString("en-US")}`;
  }
  return `$${adjusted.toFixed(2)}`;
}

function formatUnits(
  units: number,
  assetId: (typeof assets)[number]["id"],
) {
  if (assetId === "usdc") return `~${units.toFixed(2)} USDC`;
  if (assetId === "btc") return `~${units.toFixed(6)} BTC`;
  if (assetId === "eth") return `~${units.toFixed(5)} ETH`;
  return `~${units.toFixed(4)} SOL`;
}

export function OnrampTease() {
  const [amount, setAmount] = useState("50");
  const [asset, setAsset] = useState<(typeof assets)[number]["id"]>("btc");
  const [wallet, setWallet] = useState("");
  const [walletTouched, setWalletTouched] = useState(false);
  const [amountTouched, setAmountTouched] = useState(false);
  const [confirmWallet, setConfirmWallet] = useState(false);
  const [submitHint, setSubmitHint] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] =
    useState<(typeof paymentMethods)[number]["id"]>("visa");
  const [buyCadence, setBuyCadence] =
    useState<(typeof buyCadences)[number]["id"]>("once");
  const [slippage, setSlippage] =
    useState<(typeof slippageOptions)[number]["id"]>("1");
  const [networkSpeed, setNetworkSpeed] =
    useState<(typeof networkSpeeds)[number]["id"]>("standard");
  const [orderMemo, setOrderMemo] = useState("");
  const [riskAccepted, setRiskAccepted] = useState(false);
  const [tosAccepted, setTosAccepted] = useState(false);
  const [receiptEmail, setReceiptEmail] = useState("");
  const [receiptTouched, setReceiptTouched] = useState(false);
  const [billingCountry, setBillingCountry] =
    useState<(typeof billingCountries)[number]["id"]>("us");
  const [promoCode, setPromoCode] = useState("");
  const [promoTouched, setPromoTouched] = useState(false);
  const [fundSource, setFundSource] =
    useState<(typeof fundSources)[number]["id"]>("salary");
  const [purchasePurpose, setPurchasePurpose] =
    useState<(typeof purchasePurposes)[number]["id"]>("invest");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [receiptConfirm, setReceiptConfirm] = useState("");
  const [receiptConfirmTouched, setReceiptConfirmTouched] = useState(false);
  const [orderRef] = useState(() => makeOrderRef());
  const [refCopied, setRefCopied] = useState(false);
  const [summaryCopied, setSummaryCopied] = useState(false);
  const [fiatCurrency, setFiatCurrency] =
    useState<(typeof fiatCurrencies)[number]["id"]>("usd");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [taxResidency, setTaxResidency] =
    useState<(typeof taxResidencies)[number]["id"]>("us");
  const [selfCustodyAccepted, setSelfCustodyAccepted] = useState(false);
  const [smsPhone, setSmsPhone] = useState("");
  const [smsTouched, setSmsTouched] = useState(false);
  const [quoteAt, setQuoteAt] = useState(() => new Date());
  const [quoteJitterBps, setQuoteJitterBps] = useState(0);
  const [quoteAgeSec, setQuoteAgeSec] = useState(0);
  const [lockedUnits, setLockedUnits] = useState<number | null>(null);
  const [draftAvailable, setDraftAvailable] = useState(false);
  const [draftBanner, setDraftBanner] = useState(false);
  const [draftHint, setDraftHint] = useState<string | null>(null);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [autosaveOn, setAutosaveOn] = useState(false);
  const [summaryDownloaded, setSummaryDownloaded] = useState(false);
  const [draftExported, setDraftExported] = useState(false);
  const [draftImported, setDraftImported] = useState(false);
  const [draftLinkCopied, setDraftLinkCopied] = useState(false);
  const [draftLinkPasted, setDraftLinkPasted] = useState(false);
  const [draftVerifyStatus, setDraftVerifyStatus] = useState<
    "idle" | "match" | "mismatch" | "invalid"
  >("idle");
  const [verifiedFormFp, setVerifiedFormFp] = useState<string | null>(null);
  const [draftDiffLines, setDraftDiffLines] = useState<string[]>([]);
  const [pinAvailable, setPinAvailable] = useState(false);
  const [pinFingerprint, setPinFingerprint] = useState<string | null>(null);
  const [pinSwapped, setPinSwapped] = useState(false);
  const [pinApplied, setPinApplied] = useState(false);
  const [pinLinkCopied, setPinLinkCopied] = useState(false);
  const [pinExported, setPinExported] = useState(false);
  const [pinLinkPasted, setPinLinkPasted] = useState(false);
  const [pinImported, setPinImported] = useState(false);
  const [pinFromDrafted, setPinFromDrafted] = useState(false);
  const [draftFromPinned, setDraftFromPinned] = useState(false);
  const [verifyAnchor, setVerifyAnchor] = useState<"form" | "pin">("form");
  const autosaveSkipRef = useRef(true);
  const autosaveTimerRef = useRef<number | null>(null);
  const importDraftInputRef = useRef<HTMLInputElement | null>(null);
  const importPinInputRef = useRef<HTMLInputElement | null>(null);
  const pasteDraftInputRef = useRef<HTMLInputElement | null>(null);

  const selectedAsset = useMemo(
    () => assets.find((option) => option.id === asset) ?? assets[0],
    [asset],
  );

  const availableNetworks = useMemo(
    () =>
      networks.filter((network) =>
        (network.assets as readonly string[]).includes(asset),
      ),
    [asset],
  );

  const [network, setNetwork] = useState<(typeof networks)[number]["id"]>(
    "bitcoin",
  );

  const activeNetwork =
    availableNetworks.find((option) => option.id === network) ??
    availableNetworks[0];

  const parsedAmount = Number(amount);
  const amountFinite = Number.isFinite(parsedAmount);
  const amountStatus = !amount.trim()
    ? "empty"
    : !amountFinite
      ? "invalid"
      : parsedAmount < minAmount
        ? "low"
        : parsedAmount > maxAmount
          ? "high"
          : "valid";
  const amountValid = amountStatus === "valid";
  const selectedFiat =
    fiatCurrencies.find((option) => option.id === fiatCurrency) ??
    fiatCurrencies[0];
  const amountInUsd = amountValid ? parsedAmount / selectedFiat.perUsd : 0;
  const amountLabel = amountValid
    ? `${selectedFiat.symbol}${parsedAmount.toLocaleString("en-US")}`
    : "your amount";
  const amountUsdLabel = amountValid
    ? `≈$${amountInUsd.toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })}`
    : "—";

  const selectedSpeed =
    networkSpeeds.find((option) => option.id === networkSpeed) ??
    networkSpeeds[0];
  const selectedCountry =
    billingCountries.find((option) => option.id === billingCountry) ??
    billingCountries[0];
  const availablePayments = useMemo(
    () =>
      paymentMethods.filter((method) =>
        (selectedCountry.payments as readonly string[]).includes(method.id),
      ),
    [selectedCountry],
  );
  const paymentAvailable = availablePayments.some(
    (method) => method.id === paymentMethod,
  );
  const effectivePayment = paymentAvailable
    ? paymentMethod
    : (availablePayments[0]?.id ?? "visa");

  const trimmedPromo = promoCode.trim().toUpperCase();
  const promoStatus = !trimmedPromo
    ? "empty"
    : trimmedPromo.length > promoMaxLen
      ? "long"
      : promoCodes[trimmedPromo]
        ? "valid"
        : "invalid";
  const activePromo =
    promoStatus === "valid" ? promoCodes[trimmedPromo] : null;

  const adjustedAmount = amountValid
    ? amountInUsd * (1 + quoteJitterBps / 10_000)
    : 0;
  const rawFee = amountValid ? adjustedAmount * selectedSpeed.feeRate : 0;
  const feeDiscount = activePromo
    ? rawFee * (activePromo.discountPct / 100)
    : 0;
  const feeAmount = Math.max(0, rawFee - feeDiscount);
  const feeEstimate = amountValid ? `~$${feeAmount.toFixed(2)}` : "—";
  const totalEstimate = amountValid
    ? `~$${(adjustedAmount + feeAmount).toFixed(2)}`
    : "—";
  const fiatTotalEstimate = amountValid
    ? `~${selectedFiat.symbol}${(
        (adjustedAmount + feeAmount) *
        selectedFiat.perUsd
      ).toFixed(2)}`
    : "—";
  const receiveEstimate = amountValid
    ? formatReceive(adjustedAmount, selectedAsset.id)
    : "—";
  const currentUnits = amountValid
    ? adjustedAmount / teaseRatesUsd[selectedAsset.id]
    : 0;
  const slippagePct = Number(slippage);
  const floorUnits =
    lockedUnits !== null
      ? lockedUnits * (1 - slippagePct / 100)
      : amountValid
        ? currentUnits * (1 - slippagePct / 100)
        : 0;
  const minReceiveEstimate = amountValid
    ? formatUnits(floorUnits, selectedAsset.id)
    : "—";
  const slippageBreach =
    amountValid && lockedUnits !== null && currentUnits + 1e-12 < floorUnits;
  const unitRate = formatUnitRate(selectedAsset.id, quoteJitterBps);
  const quoteRemaining = Math.max(0, quoteTtlSeconds - quoteAgeSec);
  const quoteStale = quoteRemaining === 0;

  const trimmedWallet = wallet.trim();
  const walletStatus = !trimmedWallet
    ? "empty"
    : activeNetwork?.pattern.test(trimmedWallet)
      ? "valid"
      : "invalid";

  const trimmedReceipt = receiptEmail.trim();
  const receiptStatus = !trimmedReceipt
    ? "empty"
    : emailPattern.test(trimmedReceipt)
      ? "valid"
      : "invalid";

  const trimmedReceiptConfirm = receiptConfirm.trim();
  const receiptConfirmStatus =
    receiptStatus !== "valid"
      ? "skipped"
      : !trimmedReceiptConfirm
        ? "empty"
        : trimmedReceiptConfirm.toLowerCase() === trimmedReceipt.toLowerCase()
          ? "match"
          : "mismatch";

  const trimmedMemo = orderMemo.trim();
  const memoStatus =
    trimmedMemo.length > memoMaxLen ? "long" : trimmedMemo ? "ok" : "empty";

  const trimmedSms = smsPhone.replace(/[\s().-]/g, "");
  const smsStatus = !trimmedSms
    ? "empty"
    : trimmedSms.length > smsMaxLen
      ? "long"
      : smsPattern.test(trimmedSms)
        ? "valid"
        : "invalid";
  const arrivalWindow = formatArrivalWindow(selectedSpeed.id, quoteAt);

  const readyAmount = amountValid;
  const readyNetwork = Boolean(activeNetwork);
  const readyConfirm =
    walletStatus !== "valid" || confirmWallet;
  const selectedPayment =
    paymentMethods.find((option) => option.id === effectivePayment) ??
    paymentMethods[0];
  const selectedCadence =
    buyCadences.find((option) => option.id === buyCadence) ?? buyCadences[0];
  const selectedSlippage =
    slippageOptions.find((option) => option.id === slippage) ??
    slippageOptions[1];
  const selectedFundSource =
    fundSources.find((option) => option.id === fundSource) ?? fundSources[0];
  const selectedPurpose =
    purchasePurposes.find((option) => option.id === purchasePurpose) ??
    purchasePurposes[0];
  const selectedTaxResidency =
    taxResidencies.find((option) => option.id === taxResidency) ??
    taxResidencies[0];

  useEffect(() => {
    const tick = () => {
      setQuoteAgeSec(
        Math.floor((Date.now() - quoteAt.getTime()) / 1000),
      );
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [quoteAt]);

  useEffect(() => {
    const fromHash = readDraftFromHash();
    if (fromHash) {
      applyDraft(fromHash);
      try {
        window.localStorage.setItem(
          draftStorageKey,
          JSON.stringify(fromHash),
        );
        setDraftAvailable(true);
        setDraftSavedAt(fromHash.savedAt);
      } catch {
        /* form applied even if storage blocked */
      }
      setDraftBanner(false);
      setDraftHint(
        "Draft loaded from shared link — refresh quote if the tease looks stale.",
      );
    } else {
      const existing = readDraftFromStorage();
      if (existing) {
        setDraftAvailable(true);
        setDraftBanner(true);
        setDraftSavedAt(existing.savedAt);
      }
    }
    const pinned = readPinFromStorage();
    if (pinned) {
      setPinAvailable(true);
      setPinFingerprint(fingerprintDraft(pinned));
    }
    try {
      const pref = window.localStorage.getItem(autosavePrefKey);
      if (pref === "1") setAutosaveOn(true);
    } catch {
      /* ignore */
    }
    // Mount-only: apply hash draft or surface localStorage banner.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Seed min-receive floor from the initial tease amount/asset.
    if (lockedUnits === null && amountValid) {
      setLockedUnits(amountInUsd / teaseRatesUsd[selectedAsset.id]);
    }
  }, [amountValid, amountInUsd, lockedUnits, selectedAsset.id]);

  useEffect(() => {
    // Keep Pay with aligned to billing-country availability.
    if (!paymentAvailable && availablePayments[0]) {
      setPaymentMethod(availablePayments[0].id);
    }
  }, [paymentAvailable, availablePayments]);

  useEffect(() => {
    if (!autosaveOn) {
      autosaveSkipRef.current = true;
      return;
    }
    if (autosaveSkipRef.current) {
      autosaveSkipRef.current = false;
      return;
    }
    if (autosaveTimerRef.current !== null) {
      window.clearTimeout(autosaveTimerRef.current);
    }
    autosaveTimerRef.current = window.setTimeout(() => {
      persistDraft({ silent: true });
    }, autosaveDebounceMs);
    return () => {
      if (autosaveTimerRef.current !== null) {
        window.clearTimeout(autosaveTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- draft fields listed below
  }, [
    autosaveOn,
    amount,
    asset,
    network,
    wallet,
    confirmWallet,
    paymentMethod,
    buyCadence,
    slippage,
    networkSpeed,
    orderMemo,
    riskAccepted,
    tosAccepted,
    privacyAccepted,
    selfCustodyAccepted,
    ageConfirmed,
    receiptEmail,
    receiptConfirm,
    billingCountry,
    promoCode,
    fundSource,
    purchasePurpose,
    fiatCurrency,
    taxResidency,
    smsPhone,
  ]);

  function lockQuoteUnits(
    nextAmount: number,
    nextAsset: (typeof assets)[number]["id"],
    nextJitter: number,
  ) {
    setLockedUnits(
      (nextAmount * (1 + nextJitter / 10_000)) / teaseRatesUsd[nextAsset],
    );
  }

  function refreshQuote() {
    // Preview-only ±80 bps wobble so "Refresh quote" can soft-trip a tight
    // min-receive floor without pretending to be a live market feed.
    const next = Math.round((Math.random() * 160 - 80) * 10) / 10;
    // Lock floor against the zero-jitter baseline for this amount/asset.
    if (amountValid) {
      lockQuoteUnits(amountInUsd, selectedAsset.id, 0);
    }
    setQuoteJitterBps(next);
    setQuoteAt(new Date());
    setQuoteAgeSec(0);
    setSubmitHint(null);
  }

  async function copyOrderRef() {
    try {
      await navigator.clipboard.writeText(orderRef);
      setRefCopied(true);
      window.setTimeout(() => setRefCopied(false), 2000);
      setSubmitHint(null);
    } catch {
      setSubmitHint(
        `Copy failed — select ${orderRef} manually if you need the preview ref.`,
      );
    }
  }

  async function shareSummary() {
    const line = buildSummaryLine();
    try {
      await navigator.clipboard.writeText(line);
      setSummaryCopied(true);
      window.setTimeout(() => setSummaryCopied(false), 2000);
      setSubmitHint(null);
    } catch {
      setSubmitHint(
        "Share summary copy failed — select the order preview text manually.",
      );
    }
  }

  function downloadSummary() {
    const line = buildSummaryLine();
    const body = [
      "Omnipay.cc preview order summary",
      "(tease only — not a live Stripe receipt)",
      "",
      line,
      "",
      `Generated: ${new Date().toISOString()}`,
    ].join("\n");
    try {
      const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${orderRef.toLowerCase()}-preview.txt`;
      anchor.rel = "noopener";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setSummaryDownloaded(true);
      window.setTimeout(() => setSummaryDownloaded(false), 2000);
      setSubmitHint(null);
    } catch {
      setSubmitHint(
        "Download summary failed — use Share summary to copy instead.",
      );
    }
  }

  function buildSummaryLine() {
    return [
      `Omnipay preview ${orderRef}`,
      `${amountLabel} (${selectedFiat.label}${selectedFiat.id !== "usd" ? ` ${amountUsdLabel}` : ""}) → ${selectedAsset.label}`,
      `on ${activeNetwork?.label ?? selectedAsset.network}`,
      `via ${selectedPayment.label} · ${selectedCountry.label}`,
      `${selectedCadence.label} · ${selectedSpeed.label}`,
      `funds ${selectedFundSource.label} · purpose ${selectedPurpose.label}`,
      `tax ${selectedTaxResidency.label}`,
      `arrive ${arrivalWindow}`,
      smsStatus === "valid" ? `sms ${trimmedSms}` : null,
      receiveEstimate !== "—" ? `receive ${receiveEstimate}` : null,
      totalEstimate !== "—" ? `card total ${totalEstimate}` : null,
    ]
      .filter(Boolean)
      .join(" · ");
  }

  function resetPreview() {
    setAmount("50");
    setAsset("btc");
    setWallet("");
    setWalletTouched(false);
    setAmountTouched(false);
    setConfirmWallet(false);
    setSubmitHint(null);
    setPaymentMethod("visa");
    setBuyCadence("once");
    setSlippage("1");
    setNetworkSpeed("standard");
    setOrderMemo("");
    setRiskAccepted(false);
    setTosAccepted(false);
    setReceiptEmail("");
    setReceiptTouched(false);
    setBillingCountry("us");
    setPromoCode("");
    setPromoTouched(false);
    setFundSource("salary");
    setPurchasePurpose("invest");
    setAgeConfirmed(false);
    setReceiptConfirm("");
    setReceiptConfirmTouched(false);
    setRefCopied(false);
    setSummaryCopied(false);
    setSummaryDownloaded(false);
    setDraftExported(false);
    setDraftImported(false);
    setDraftLinkCopied(false);
    setDraftLinkPasted(false);
    setDraftVerifyStatus("idle");
    setVerifiedFormFp(null);
    setDraftDiffLines([]);
    setFiatCurrency("usd");
    setPrivacyAccepted(false);
    setTaxResidency("us");
    setSelfCustodyAccepted(false);
    setSmsPhone("");
    setSmsTouched(false);
    setQuoteJitterBps(0);
    setQuoteAt(new Date());
    setQuoteAgeSec(0);
    setLockedUnits(null);
    setNetwork("bitcoin");
    setDraftHint(null);
    autosaveSkipRef.current = true;
  }

  function buildDraftPayload(): PreviewDraftV1 {
    return {
      v: 1,
      savedAt: new Date().toISOString(),
      amount,
      asset,
      network,
      wallet,
      confirmWallet,
      paymentMethod,
      buyCadence,
      slippage,
      networkSpeed,
      orderMemo,
      riskAccepted,
      tosAccepted,
      privacyAccepted,
      selfCustodyAccepted,
      ageConfirmed,
      receiptEmail,
      receiptConfirm,
      billingCountry,
      promoCode,
      fundSource,
      purchasePurpose,
      fiatCurrency,
      taxResidency,
      smsPhone,
    };
  }

  const draftFingerprint = fingerprintDraft(buildDraftPayload());
  const liveVerifyAnchorFp =
    verifyAnchor === "pin" ? pinFingerprint : draftFingerprint;
  const liveVerifyStatus =
    draftVerifyStatus === "invalid"
      ? "invalid"
      : draftVerifyStatus !== "idle" &&
          liveVerifyAnchorFp !== null &&
          verifiedFormFp === liveVerifyAnchorFp
        ? draftVerifyStatus
        : "idle";

  function persistDraft(opts?: { silent?: boolean }) {
    const payload = buildDraftPayload();
    try {
      window.localStorage.setItem(draftStorageKey, JSON.stringify(payload));
      setDraftAvailable(true);
      setDraftBanner(false);
      setDraftSavedAt(payload.savedAt);
      if (!opts?.silent) {
        setDraftHint("Draft saved in this browser — Restore after refresh.");
      } else {
        setDraftHint(
          `Autosaved ${new Date(payload.savedAt).toLocaleTimeString("en-US")} — stays in this browser.`,
        );
      }
      setSubmitHint(null);
    } catch {
      setDraftHint(
        "Save draft failed — browser storage may be blocked in this preview.",
      );
    }
  }

  function saveDraft() {
    persistDraft({ silent: false });
  }

  function toggleAutosave(next: boolean) {
    setAutosaveOn(next);
    autosaveSkipRef.current = true;
    try {
      window.localStorage.setItem(autosavePrefKey, next ? "1" : "0");
    } catch {
      /* ignore */
    }
    if (next) {
      persistDraft({ silent: true });
      setDraftHint("Autosave on — drafts write as you edit (this browser).");
    } else {
      setDraftHint("Autosave off — use Save draft to persist manually.");
    }
  }

  function applyDraft(draft: PreviewDraftV1) {
    autosaveSkipRef.current = true;
    setAmount(draft.amount);
    setAsset(draft.asset);
    setNetwork(draft.network);
    setWallet(draft.wallet);
    setWalletTouched(Boolean(draft.wallet.trim()));
    setAmountTouched(Boolean(draft.amount.trim()));
    setConfirmWallet(draft.confirmWallet);
    setPaymentMethod(draft.paymentMethod);
    setBuyCadence(draft.buyCadence);
    setSlippage(draft.slippage);
    setNetworkSpeed(draft.networkSpeed);
    setOrderMemo(draft.orderMemo);
    setRiskAccepted(draft.riskAccepted);
    setTosAccepted(draft.tosAccepted);
    setPrivacyAccepted(draft.privacyAccepted);
    setSelfCustodyAccepted(draft.selfCustodyAccepted);
    setAgeConfirmed(draft.ageConfirmed);
    setReceiptEmail(draft.receiptEmail);
    setReceiptTouched(Boolean(draft.receiptEmail.trim()));
    setReceiptConfirm(draft.receiptConfirm);
    setReceiptConfirmTouched(Boolean(draft.receiptConfirm.trim()));
    setBillingCountry(draft.billingCountry);
    setPromoCode(draft.promoCode);
    setPromoTouched(Boolean(draft.promoCode.trim()));
    setFundSource(draft.fundSource);
    setPurchasePurpose(draft.purchasePurpose);
    setFiatCurrency(draft.fiatCurrency);
    setTaxResidency(draft.taxResidency);
    setSmsPhone(draft.smsPhone);
    setSmsTouched(Boolean(draft.smsPhone.trim()));
    setQuoteJitterBps(0);
    setQuoteAt(new Date());
    setQuoteAgeSec(0);
    setLockedUnits(null);
    setRefCopied(false);
    setSummaryCopied(false);
    setSummaryDownloaded(false);
    setDraftExported(false);
    setDraftImported(false);
    setDraftLinkCopied(false);
    setDraftLinkPasted(false);
    setDraftVerifyStatus("idle");
    setVerifiedFormFp(null);
    setDraftDiffLines([]);
    setSubmitHint(null);
  }

  function exportDraftJson() {
    const payload = buildDraftPayload();
    const body = `${JSON.stringify(payload, null, 2)}\n`;
    try {
      const blob = new Blob([body], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${orderRef.toLowerCase()}-draft.json`;
      anchor.rel = "noopener";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setDraftExported(true);
      window.setTimeout(() => setDraftExported(false), 2000);
      setDraftHint(
        "Draft JSON exported — Import draft on another browser to restore.",
      );
      setSubmitHint(null);
    } catch {
      setDraftHint(
        "Export draft failed — use Save draft (localStorage) instead.",
      );
    }
  }

  function openImportDraftPicker() {
    importDraftInputRef.current?.click();
  }

  function onImportDraftFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text =
          typeof reader.result === "string" ? reader.result : "";
        const draft = parseDraftPayload(JSON.parse(text));
        if (!draft) {
          setDraftHint(
            "Import draft failed — file is not a valid Omnipay preview draft v1.",
          );
          return;
        }
        applyDraft(draft);
        try {
          window.localStorage.setItem(
            draftStorageKey,
            JSON.stringify(draft),
          );
          setDraftAvailable(true);
          setDraftSavedAt(draft.savedAt);
        } catch {
          /* imported into form even if storage blocked */
        }
        setDraftBanner(false);
        setDraftImported(true);
        window.setTimeout(() => setDraftImported(false), 2000);
        setDraftHint(
          "Draft imported — refresh quote if the tease looks stale.",
        );
      } catch {
        setDraftHint(
          "Import draft failed — choose a .json exported from this preview.",
        );
      }
    };
    reader.onerror = () => {
      setDraftHint("Import draft failed — could not read that file.");
    };
    reader.readAsText(file);
  }

  async function copyDraftLink() {
    const payload = buildDraftPayload();
    try {
      const encoded = encodeDraftForHash(payload);
      const url = `${window.location.origin}${window.location.pathname}${window.location.search}#${draftHashPrefix}${encoded}`;
      await navigator.clipboard.writeText(url);
      window.history.replaceState(null, "", url);
      setDraftLinkCopied(true);
      window.setTimeout(() => setDraftLinkCopied(false), 2000);
      setDraftVerifyStatus("idle");
      setVerifiedFormFp(null);
      setDraftDiffLines([]);
      setDraftHint(
        `Draft link copied (FP ${fingerprintDraft(payload)}) — open or Verify on another browser.`,
      );
      setSubmitHint(null);
    } catch {
      setDraftHint(
        "Copy draft link failed — use Export draft .json instead.",
      );
    }
  }

  function applyPastedDraft(raw: string) {
    const draft = extractDraftFromPaste(raw);
    if (!draft) {
      setDraftHint(
        "Paste draft link failed — need a #omn-draft= URL or Export draft .json.",
      );
      return false;
    }
    applyDraft(draft);
    try {
      window.localStorage.setItem(draftStorageKey, JSON.stringify(draft));
      setDraftAvailable(true);
      setDraftSavedAt(draft.savedAt);
    } catch {
      /* form applied even if storage blocked */
    }
    try {
      const encoded = encodeDraftForHash(draft);
      const url = `${window.location.origin}${window.location.pathname}${window.location.search}#${draftHashPrefix}${encoded}`;
      window.history.replaceState(null, "", url);
    } catch {
      /* hash sync best-effort */
    }
    setDraftBanner(false);
    setDraftLinkPasted(true);
    window.setTimeout(() => setDraftLinkPasted(false), 2000);
    setDraftVerifyStatus("match");
    setVerifiedFormFp(fingerprintDraft(draft));
    setDraftDiffLines([]);
    setDraftHint(
      `Draft pasted from link (FP ${fingerprintDraft(draft)}) — refresh quote if the tease looks stale.`,
    );
    setSubmitHint(null);
    return true;
  }

  async function pasteDraftLinkFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        setDraftHint(
          "Clipboard is empty — paste a #omn-draft= link into the field below.",
        );
        pasteDraftInputRef.current?.focus();
        return;
      }
      if (!applyPastedDraft(text)) {
        pasteDraftInputRef.current?.focus();
      }
    } catch {
      setDraftHint(
        "Clipboard read blocked — paste the #omn-draft= link into the field below.",
      );
      pasteDraftInputRef.current?.focus();
    }
  }

  function applyFromPasteField(input: HTMLInputElement) {
    const value = input.value;
    if (!value.trim()) return;
    if (applyPastedDraft(value)) {
      input.value = "";
    }
  }

  /** Preview-only: compare a #omn-draft= link to the current form without applying. */
  function verifyDraftAgainstCurrent(raw: string): boolean {
    const draft = extractDraftFromPaste(raw);
    if (!draft) {
      setDraftVerifyStatus("invalid");
      setVerifiedFormFp(null);
      setDraftDiffLines([]);
      setVerifyAnchor("form");
      setDraftHint(
        "Verify failed — need a #omn-draft= URL/token (or paste into the field).",
      );
      return false;
    }
    const current = buildDraftPayload();
    const currentFp = fingerprintDraft(current);
    const linkFp = fingerprintDraft(draft);
    setVerifyAnchor("form");
    setVerifiedFormFp(currentFp);
    if (currentFp === linkFp) {
      setDraftVerifyStatus("match");
      setDraftDiffLines([]);
      setDraftHint(
        `Draft link matches this form (FP ${currentFp}) — safe to share or Paste.`,
      );
    } else {
      const diffs = diffDraftFields(current, draft);
      setDraftVerifyStatus("mismatch");
      setDraftDiffLines(diffs);
      setDraftHint(
        `Draft link FP ${linkFp} ≠ form FP ${currentFp} — ${diffs.length} field${diffs.length === 1 ? "" : "s"} differ (see Diff). Paste to apply.`,
      );
    }
    setSubmitHint(null);
    return true;
  }

  /** Preview-only: list field diffs vs a #omn-draft= link without applying. */
  function diffDraftAgainstCurrent(raw: string): boolean {
    const draft = extractDraftFromPaste(raw);
    if (!draft) {
      setDraftVerifyStatus("invalid");
      setVerifiedFormFp(null);
      setDraftDiffLines([]);
      setVerifyAnchor("form");
      setDraftHint(
        "Diff failed — need a #omn-draft= URL/token (or paste into the field).",
      );
      return false;
    }
    const current = buildDraftPayload();
    const currentFp = fingerprintDraft(current);
    const linkFp = fingerprintDraft(draft);
    setVerifyAnchor("form");
    setVerifiedFormFp(currentFp);
    if (currentFp === linkFp) {
      setDraftVerifyStatus("match");
      setDraftDiffLines([]);
      setDraftHint(
        `No field diffs — draft link matches this form (FP ${currentFp}).`,
      );
    } else {
      const diffs = diffDraftFields(current, draft);
      setDraftVerifyStatus("mismatch");
      setDraftDiffLines(diffs);
      setDraftHint(
        `Diff draft link: ${diffs.length} field${diffs.length === 1 ? "" : "s"} differ (FP ${linkFp} ≠ ${currentFp}). Paste to apply link values.`,
      );
    }
    setSubmitHint(null);
    return true;
  }

  async function verifyDraftLinkFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        setDraftVerifyStatus("invalid");
        setDraftDiffLines([]);
        setDraftHint(
          "Clipboard is empty — paste a #omn-draft= link into the field, then Verify.",
        );
        pasteDraftInputRef.current?.focus();
        return;
      }
      if (!verifyDraftAgainstCurrent(text)) {
        pasteDraftInputRef.current?.focus();
      }
    } catch {
      const field = pasteDraftInputRef.current?.value ?? "";
      if (field.trim()) {
        verifyDraftAgainstCurrent(field);
        return;
      }
      setDraftVerifyStatus("invalid");
      setDraftDiffLines([]);
      setDraftHint(
        "Clipboard read blocked — paste the #omn-draft= link into the field, then Verify.",
      );
      pasteDraftInputRef.current?.focus();
    }
  }

  async function diffDraftLinkFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        setDraftVerifyStatus("invalid");
        setDraftDiffLines([]);
        setDraftHint(
          "Clipboard is empty — paste a #omn-draft= link into the field, then Diff.",
        );
        pasteDraftInputRef.current?.focus();
        return;
      }
      if (!diffDraftAgainstCurrent(text)) {
        pasteDraftInputRef.current?.focus();
      }
    } catch {
      const field = pasteDraftInputRef.current?.value ?? "";
      if (field.trim()) {
        diffDraftAgainstCurrent(field);
        return;
      }
      setDraftVerifyStatus("invalid");
      setDraftDiffLines([]);
      setDraftHint(
        "Clipboard read blocked — paste the #omn-draft= link into the field, then Diff.",
      );
      pasteDraftInputRef.current?.focus();
    }
  }

  function restoreDraft() {
    const draft = readDraftFromStorage();
    if (!draft) {
      setDraftAvailable(false);
      setDraftBanner(false);
      setDraftHint("No saved draft in this browser.");
      return;
    }
    applyDraft(draft);
    setDraftBanner(false);
    setDraftSavedAt(draft.savedAt);
    setDraftHint("Draft restored — refresh quote if the tease looks stale.");
  }

  function clearDraft() {
    try {
      window.localStorage.removeItem(draftStorageKey);
    } catch {
      /* ignore */
    }
    clearDraftHash();
    autosaveSkipRef.current = true;
    setDraftAvailable(false);
    setDraftBanner(false);
    setDraftSavedAt(null);
    setDraftLinkCopied(false);
    setDraftLinkPasted(false);
    setDraftVerifyStatus("idle");
    setVerifiedFormFp(null);
    setDraftDiffLines([]);
    setVerifyAnchor("form");
    setDraftHint("Draft cleared from this browser.");
  }

  /** Preview-only: stash current form in the A/B pin slot (localStorage). */
  function pinDraft() {
    const payload = buildDraftPayload();
    try {
      window.localStorage.setItem(pinStorageKey, JSON.stringify(payload));
      const fp = fingerprintDraft(payload);
      setPinAvailable(true);
      setPinFingerprint(fp);
      setPinSwapped(false);
      setPinApplied(false);
      setDraftHint(
        `Pin saved (FP ${fp}) — Apply / Swap / Diff / Copy / Paste / Export / Import / Verify / Diff pin link / Pin from draft / Draft from pin. Clear pin removes it.`,
      );
      setSubmitHint(null);
    } catch {
      setDraftHint(
        "Pin draft failed — browser storage may be blocked in this preview.",
      );
    }
  }

  /** Preview-only: swap form ↔ pin without touching Save draft storage. */
  function swapPin() {
    const pinned = readPinFromStorage();
    if (!pinned) {
      setPinAvailable(false);
      setPinFingerprint(null);
      setDraftHint("No pin in this browser — Pin draft first.");
      return;
    }
    const current = buildDraftPayload();
    const currentFp = fingerprintDraft(current);
    const pinFp = fingerprintDraft(pinned);
    try {
      window.localStorage.setItem(pinStorageKey, JSON.stringify(current));
      setPinAvailable(true);
      setPinFingerprint(currentFp);
    } catch {
      setDraftHint(
        "Swap pin failed — could not write pin slot (storage blocked).",
      );
      return;
    }
    applyDraft(pinned);
    setPinSwapped(true);
    setPinApplied(false);
    window.setTimeout(() => setPinSwapped(false), 2000);
    setDraftVerifyStatus("idle");
    setVerifiedFormFp(null);
    setDraftDiffLines([]);
    setDraftHint(
      `Swapped with pin (form was FP ${currentFp} → now FP ${pinFp}; pin holds previous). Refresh quote if stale.`,
    );
    setSubmitHint(null);
  }

  /** Preview-only: load pin into form without changing the pin slot. */
  function applyPin() {
    const pinned = readPinFromStorage();
    if (!pinned) {
      setPinAvailable(false);
      setPinFingerprint(null);
      setDraftHint("No pin in this browser — Pin draft first.");
      return;
    }
    const current = buildDraftPayload();
    const currentFp = fingerprintDraft(current);
    const pinFp = fingerprintDraft(pinned);
    setVerifyAnchor("form");
    setVerifiedFormFp(currentFp);
    if (currentFp === pinFp) {
      setDraftVerifyStatus("match");
      setDraftDiffLines([]);
      setDraftHint(
        `Form already matches pin (FP ${pinFp}) — nothing to apply.`,
      );
      setSubmitHint(null);
      return;
    }
    applyDraft(pinned);
    setPinApplied(true);
    setPinSwapped(false);
    window.setTimeout(() => setPinApplied(false), 2000);
    setDraftVerifyStatus("idle");
    setVerifiedFormFp(null);
    setDraftDiffLines([]);
    setVerifyAnchor("form");
    setDraftHint(
      `Applied pin (FP ${pinFp}) — pin slot unchanged. Form was FP ${currentFp}. Refresh quote if stale.`,
    );
    setSubmitHint(null);
  }

  /** Preview-only: list field diffs vs pin without applying. */
  function diffVsPin() {
    const pinned = readPinFromStorage();
    if (!pinned) {
      setPinAvailable(false);
      setPinFingerprint(null);
      setDraftDiffLines([]);
      setDraftHint("No pin in this browser — Pin draft first.");
      return;
    }
    const current = buildDraftPayload();
    const currentFp = fingerprintDraft(current);
    const pinFp = fingerprintDraft(pinned);
    setVerifyAnchor("form");
    setVerifiedFormFp(currentFp);
    if (currentFp === pinFp) {
      setDraftVerifyStatus("match");
      setDraftDiffLines([]);
      setDraftHint(`No field diffs — form matches pin (FP ${pinFp}).`);
    } else {
      const diffs = diffDraftFields(current, pinned, "pin");
      setDraftVerifyStatus("mismatch");
      setDraftDiffLines(diffs);
      setDraftHint(
        `Diff vs pin: ${diffs.length} field${diffs.length === 1 ? "" : "s"} differ (pin FP ${pinFp} ≠ form FP ${currentFp}). Apply pin to load pin values.`,
      );
    }
    setSubmitHint(null);
  }

  /** Preview-only: copy pin slot as a #omn-draft= share URL (form untouched). */
  async function copyPinLink() {
    const pinned = readPinFromStorage();
    if (!pinned) {
      setPinAvailable(false);
      setPinFingerprint(null);
      setDraftHint("No pin in this browser — Pin draft first.");
      return;
    }
    const pinFp = fingerprintDraft(pinned);
    try {
      const encoded = encodeDraftForHash(pinned);
      const url = `${window.location.origin}${window.location.pathname}${window.location.search}#${draftHashPrefix}${encoded}`;
      await navigator.clipboard.writeText(url);
      setPinLinkCopied(true);
      setPinExported(false);
      window.setTimeout(() => setPinLinkCopied(false), 2000);
      setDraftHint(
        `Pin link copied (FP ${pinFp}) — open / Paste / Verify on another browser. Form and pin slot unchanged.`,
      );
      setSubmitHint(null);
    } catch {
      setDraftHint(
        "Copy pin link failed — use Export pin .json instead.",
      );
    }
  }

  /** Preview-only: download pin slot as JSON (form / Save draft untouched). */
  function exportPinJson() {
    const pinned = readPinFromStorage();
    if (!pinned) {
      setPinAvailable(false);
      setPinFingerprint(null);
      setDraftHint("No pin in this browser — Pin draft first.");
      return;
    }
    const pinFp = fingerprintDraft(pinned);
    const body = `${JSON.stringify(pinned, null, 2)}\n`;
    try {
      const blob = new Blob([body], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${orderRef.toLowerCase()}-pin.json`;
      anchor.rel = "noopener";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setPinExported(true);
      setPinLinkCopied(false);
      window.setTimeout(() => setPinExported(false), 2000);
      setDraftHint(
        `Pin JSON exported (FP ${pinFp}) — Import pin on another browser to restore the pin slot. Form and pin slot unchanged.`,
      );
      setSubmitHint(null);
    } catch {
      setDraftHint(
        "Export pin failed — use Copy pin link instead.",
      );
    }
  }

  /** Preview-only: write pin slot from a #omn-draft= paste (form / Save draft untouched). */
  function applyPastedToPin(raw: string): boolean {
    const draft = extractDraftFromPaste(raw);
    if (!draft) {
      setDraftHint(
        "Paste pin link failed — need a #omn-draft= URL or Export pin .json.",
      );
      return false;
    }
    const fp = fingerprintDraft(draft);
    try {
      window.localStorage.setItem(pinStorageKey, JSON.stringify(draft));
    } catch {
      setDraftHint(
        "Paste pin link failed — browser storage may be blocked in this preview.",
      );
      return false;
    }
    setPinAvailable(true);
    setPinFingerprint(fp);
    setPinSwapped(false);
    setPinApplied(false);
    setPinLinkCopied(false);
    setPinExported(false);
    setPinLinkPasted(true);
    setPinImported(false);
    window.setTimeout(() => setPinLinkPasted(false), 2000);
    setDraftVerifyStatus("idle");
    setVerifiedFormFp(null);
    setDraftDiffLines([]);
    setDraftHint(
      `Pin pasted from link (FP ${fp}) — form and Save draft unchanged. Apply pin to load into the form.`,
    );
    setSubmitHint(null);
    return true;
  }

  async function pastePinLinkFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        const field = pasteDraftInputRef.current?.value ?? "";
        if (field.trim() && applyPastedToPin(field)) {
          if (pasteDraftInputRef.current) pasteDraftInputRef.current.value = "";
          return;
        }
        setDraftHint(
          "Clipboard is empty — paste a #omn-draft= link into the field, then Paste pin link.",
        );
        pasteDraftInputRef.current?.focus();
        return;
      }
      if (!applyPastedToPin(text)) {
        pasteDraftInputRef.current?.focus();
      }
    } catch {
      const field = pasteDraftInputRef.current?.value ?? "";
      if (field.trim() && applyPastedToPin(field)) {
        if (pasteDraftInputRef.current) pasteDraftInputRef.current.value = "";
        return;
      }
      setDraftHint(
        "Clipboard read blocked — paste the #omn-draft= link into the field, then Paste pin link.",
      );
      pasteDraftInputRef.current?.focus();
    }
  }

  function openImportPinPicker() {
    importPinInputRef.current?.click();
  }

  function onImportPinFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text =
          typeof reader.result === "string" ? reader.result : "";
        const draft = parseDraftPayload(JSON.parse(text));
        if (!draft) {
          setDraftHint(
            "Import pin failed — file is not a valid Omnipay preview draft v1.",
          );
          return;
        }
        const fp = fingerprintDraft(draft);
        try {
          window.localStorage.setItem(pinStorageKey, JSON.stringify(draft));
        } catch {
          setDraftHint(
            "Import pin failed — browser storage may be blocked in this preview.",
          );
          return;
        }
        setPinAvailable(true);
        setPinFingerprint(fp);
        setPinSwapped(false);
        setPinApplied(false);
        setPinLinkCopied(false);
        setPinExported(false);
        setPinLinkPasted(false);
        setPinImported(true);
        window.setTimeout(() => setPinImported(false), 2000);
        setDraftVerifyStatus("idle");
        setVerifiedFormFp(null);
        setDraftDiffLines([]);
        setDraftHint(
          `Pin imported (FP ${fp}) — form and Save draft unchanged. Apply pin to load into the form.`,
        );
        setSubmitHint(null);
      } catch {
        setDraftHint(
          "Import pin failed — choose a .json exported from Export pin / Export draft.",
        );
      }
    };
    reader.onerror = () => {
      setDraftHint("Import pin failed — could not read that file.");
    };
    reader.readAsText(file);
  }

  /** Preview-only: compare a #omn-draft= link to the pin slot without applying. */
  function verifyPinAgainstLink(raw: string): boolean {
    const pinned = readPinFromStorage();
    if (!pinned) {
      setPinAvailable(false);
      setPinFingerprint(null);
      setDraftVerifyStatus("invalid");
      setVerifiedFormFp(null);
      setDraftDiffLines([]);
      setVerifyAnchor("pin");
      setDraftHint("No pin in this browser — Pin draft first.");
      return false;
    }
    const link = extractDraftFromPaste(raw);
    if (!link) {
      setDraftVerifyStatus("invalid");
      setVerifiedFormFp(null);
      setDraftDiffLines([]);
      setVerifyAnchor("pin");
      setDraftHint(
        "Verify pin link failed — need a #omn-draft= URL/token (or paste into the field).",
      );
      return false;
    }
    const pinFp = fingerprintDraft(pinned);
    const linkFp = fingerprintDraft(link);
    setPinFingerprint(pinFp);
    setVerifyAnchor("pin");
    setVerifiedFormFp(pinFp);
    if (pinFp === linkFp) {
      setDraftVerifyStatus("match");
      setDraftDiffLines([]);
      setDraftHint(
        `Pin link matches pin slot (FP ${pinFp}) — form and pin unchanged.`,
      );
    } else {
      const diffs = diffDraftFields(pinned, link, "link", "pin");
      setDraftVerifyStatus("mismatch");
      setDraftDiffLines(diffs);
      setDraftHint(
        `Pin link FP ${linkFp} ≠ pin FP ${pinFp} — ${diffs.length} field${diffs.length === 1 ? "" : "s"} differ (see Diff). Paste pin link to overwrite pin.`,
      );
    }
    setSubmitHint(null);
    return true;
  }

  /** Preview-only: list field diffs between pin slot and a #omn-draft= link. */
  function diffPinAgainstLink(raw: string): boolean {
    const pinned = readPinFromStorage();
    if (!pinned) {
      setPinAvailable(false);
      setPinFingerprint(null);
      setDraftVerifyStatus("invalid");
      setVerifiedFormFp(null);
      setDraftDiffLines([]);
      setVerifyAnchor("pin");
      setDraftHint("No pin in this browser — Pin draft first.");
      return false;
    }
    const link = extractDraftFromPaste(raw);
    if (!link) {
      setDraftVerifyStatus("invalid");
      setVerifiedFormFp(null);
      setDraftDiffLines([]);
      setVerifyAnchor("pin");
      setDraftHint(
        "Diff pin link failed — need a #omn-draft= URL/token (or paste into the field).",
      );
      return false;
    }
    const pinFp = fingerprintDraft(pinned);
    const linkFp = fingerprintDraft(link);
    setPinFingerprint(pinFp);
    setVerifyAnchor("pin");
    setVerifiedFormFp(pinFp);
    if (pinFp === linkFp) {
      setDraftVerifyStatus("match");
      setDraftDiffLines([]);
      setDraftHint(
        `No field diffs — pin link matches pin slot (FP ${pinFp}).`,
      );
    } else {
      const diffs = diffDraftFields(pinned, link, "link", "pin");
      setDraftVerifyStatus("mismatch");
      setDraftDiffLines(diffs);
      setDraftHint(
        `Diff pin link: ${diffs.length} field${diffs.length === 1 ? "" : "s"} differ (link FP ${linkFp} ≠ pin FP ${pinFp}). Paste pin link to overwrite pin.`,
      );
    }
    setSubmitHint(null);
    return true;
  }

  async function verifyPinLinkFromClipboard() {
    const pinned = readPinFromStorage();
    if (!pinned) {
      setPinAvailable(false);
      setPinFingerprint(null);
      setDraftHint("No pin in this browser — Pin draft first.");
      return;
    }
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        setDraftVerifyStatus("invalid");
        setDraftDiffLines([]);
        setVerifyAnchor("pin");
        setDraftHint(
          "Clipboard is empty — paste a #omn-draft= link into the field, then Verify pin link.",
        );
        pasteDraftInputRef.current?.focus();
        return;
      }
      if (!verifyPinAgainstLink(text)) {
        pasteDraftInputRef.current?.focus();
      }
    } catch {
      const field = pasteDraftInputRef.current?.value ?? "";
      if (field.trim()) {
        verifyPinAgainstLink(field);
        return;
      }
      setDraftVerifyStatus("invalid");
      setDraftDiffLines([]);
      setVerifyAnchor("pin");
      setDraftHint(
        "Clipboard read blocked — paste the #omn-draft= link into the field, then Verify pin link.",
      );
      pasteDraftInputRef.current?.focus();
    }
  }

  async function diffPinLinkFromClipboard() {
    const pinned = readPinFromStorage();
    if (!pinned) {
      setPinAvailable(false);
      setPinFingerprint(null);
      setDraftHint("No pin in this browser — Pin draft first.");
      return;
    }
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        setDraftVerifyStatus("invalid");
        setDraftDiffLines([]);
        setVerifyAnchor("pin");
        setDraftHint(
          "Clipboard is empty — paste a #omn-draft= link into the field, then Diff pin link.",
        );
        pasteDraftInputRef.current?.focus();
        return;
      }
      if (!diffPinAgainstLink(text)) {
        pasteDraftInputRef.current?.focus();
      }
    } catch {
      const field = pasteDraftInputRef.current?.value ?? "";
      if (field.trim()) {
        diffPinAgainstLink(field);
        return;
      }
      setDraftVerifyStatus("invalid");
      setDraftDiffLines([]);
      setVerifyAnchor("pin");
      setDraftHint(
        "Clipboard read blocked — paste the #omn-draft= link into the field, then Diff pin link.",
      );
      pasteDraftInputRef.current?.focus();
    }
  }

  /** Preview-only: copy Save draft storage → pin slot (form untouched). */
  function pinFromDraft() {
    const draft = readDraftFromStorage();
    if (!draft) {
      setDraftAvailable(false);
      setDraftHint("No saved draft in this browser — Save draft first.");
      return;
    }
    const fp = fingerprintDraft(draft);
    try {
      window.localStorage.setItem(pinStorageKey, JSON.stringify(draft));
    } catch {
      setDraftHint(
        "Pin from draft failed — browser storage may be blocked in this preview.",
      );
      return;
    }
    setPinAvailable(true);
    setPinFingerprint(fp);
    setPinSwapped(false);
    setPinApplied(false);
    setPinLinkCopied(false);
    setPinExported(false);
    setPinLinkPasted(false);
    setPinImported(false);
    setPinFromDrafted(true);
    setDraftFromPinned(false);
    window.setTimeout(() => setPinFromDrafted(false), 2000);
    setDraftVerifyStatus("idle");
    setVerifiedFormFp(null);
    setDraftDiffLines([]);
    setDraftHint(
      `Pin from draft (FP ${fp}) — form unchanged. Apply pin to load into the form.`,
    );
    setSubmitHint(null);
  }

  /** Preview-only: copy pin slot → Save draft storage (form untouched). */
  function draftFromPin() {
    const pinned = readPinFromStorage();
    if (!pinned) {
      setPinAvailable(false);
      setPinFingerprint(null);
      setDraftHint("No pin in this browser — Pin draft first.");
      return;
    }
    const payload: PreviewDraftV1 = {
      ...pinned,
      savedAt: new Date().toISOString(),
    };
    const fp = fingerprintDraft(payload);
    try {
      window.localStorage.setItem(draftStorageKey, JSON.stringify(payload));
    } catch {
      setDraftHint(
        "Draft from pin failed — browser storage may be blocked in this preview.",
      );
      return;
    }
    setDraftAvailable(true);
    setDraftBanner(false);
    setDraftSavedAt(payload.savedAt);
    setDraftFromPinned(true);
    setPinFromDrafted(false);
    window.setTimeout(() => setDraftFromPinned(false), 2000);
    setPinFingerprint(fp);
    setDraftHint(
      `Draft from pin (FP ${fp}) — form and pin slot unchanged. Restore draft to load into the form.`,
    );
    setSubmitHint(null);
  }

  function clearPin() {
    try {
      window.localStorage.removeItem(pinStorageKey);
    } catch {
      /* ignore */
    }
    setPinAvailable(false);
    setPinFingerprint(null);
    setPinSwapped(false);
    setPinApplied(false);
    setPinLinkCopied(false);
    setPinExported(false);
    setPinLinkPasted(false);
    setPinImported(false);
    setPinFromDrafted(false);
    if (verifyAnchor === "pin") {
      setDraftVerifyStatus("idle");
      setVerifiedFormFp(null);
      setDraftDiffLines([]);
      setVerifyAnchor("form");
    }
    setDraftHint("Pin cleared from this browser (Save draft untouched).");
  }

  function dismissDraftBanner() {
    setDraftBanner(false);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    setAmountTouched(true);
    if (trimmedWallet) setWalletTouched(true);
    if (trimmedReceipt) setReceiptTouched(true);
    if (trimmedReceipt) setReceiptConfirmTouched(true);

    if (!amountValid) {
      event.preventDefault();
      setSubmitHint(
        amountStatus === "low"
          ? `Minimum preview buy is $${minAmount}.`
          : amountStatus === "high"
            ? `Preview max is $${maxAmount.toLocaleString("en-US")} — raise limits in checkout.`
            : "Enter a valid USD amount to continue.",
      );
      return;
    }

    if (walletStatus === "invalid") {
      event.preventDefault();
      setSubmitHint(
        `Fix the ${activeNetwork?.label ?? "wallet"} address format, or clear it to finish on Omnipay.cc.`,
      );
      return;
    }

    if (walletStatus === "valid" && !confirmWallet) {
      event.preventDefault();
      setSubmitHint(
        "Confirm the destination wallet before continuing — crypto is sent to that address.",
      );
      return;
    }

    if (receiptStatus === "invalid") {
      event.preventDefault();
      setSubmitHint(
        "Receipt email looks invalid — fix it or clear the field to continue.",
      );
      return;
    }

    if (receiptStatus === "valid" && receiptConfirmStatus !== "match") {
      event.preventDefault();
      setSubmitHint(
        receiptConfirmStatus === "empty"
          ? "Confirm the receipt email before continuing — it must match."
          : "Receipt confirmation does not match — fix it or clear both fields.",
      );
      return;
    }

    if (smsStatus === "invalid" || smsStatus === "long") {
      event.preventDefault();
      setSubmitHint(
        smsStatus === "long"
          ? `SMS phone is too long — keep it under ${smsMaxLen} characters.`
          : "SMS phone looks invalid — use E.164 (e.g. +15551234567) or clear the field.",
      );
      return;
    }

    if (quoteStale) {
      event.preventDefault();
      setSubmitHint(
        "Tease quote expired — tap Refresh quote, then continue.",
      );
      return;
    }

    if (slippageBreach) {
      event.preventDefault();
      setSubmitHint(
        `Tease receive fell below your ${selectedSlippage.label} min-receive floor — refresh quote or widen slippage.`,
      );
      return;
    }

    if (memoStatus === "long") {
      event.preventDefault();
      setSubmitHint(
        `Order memo is too long — keep it under ${memoMaxLen} characters.`,
      );
      return;
    }

    if (promoStatus === "long" || promoStatus === "invalid") {
      event.preventDefault();
      setSubmitHint(
        promoStatus === "long"
          ? `Promo code is too long — keep it under ${promoMaxLen} characters.`
          : "Promo code not recognized in preview — try OMNI10 / ACCUMULATE, or clear the field.",
      );
      return;
    }

    if (!riskAccepted) {
      event.preventDefault();
      setSubmitHint(
        "Accept the preview risk disclosure before continuing to Omnipay.cc.",
      );
      return;
    }

    if (!tosAccepted) {
      event.preventDefault();
      setSubmitHint(
        "Accept the Terms of Service soft-gate before continuing to Omnipay.cc.",
      );
      return;
    }

    if (!privacyAccepted) {
      event.preventDefault();
      setSubmitHint(
        "Accept the Privacy Policy soft-gate before continuing to Omnipay.cc.",
      );
      return;
    }

    if (!selfCustodyAccepted) {
      event.preventDefault();
      setSubmitHint(
        "Acknowledge self-custody before continuing — crypto settles to your wallet, not Omnipay custody.",
      );
      return;
    }

    if (!ageConfirmed) {
      event.preventDefault();
      setSubmitHint(
        "Confirm you are 18+ before continuing to Omnipay.cc.",
      );
      return;
    }

    setSubmitHint(null);
  }

  return (
    <form
      action="https://omnipay.cc/auth/register"
      method="get"
      onSubmit={onSubmit}
      className="rounded-2xl border border-white/15 bg-white/5 p-8 backdrop-blur"
    >
      <p className="text-sm font-medium uppercase tracking-[0.14em] text-sky-200/80">
        Card on-ramp
      </p>
      <p className="mt-3 text-xl font-semibold">
        Fiat in. Crypto out — to your address.
      </p>
      {draftBanner ? (
        <div
          className="mt-4 rounded-xl border border-sky-300/30 bg-sky-400/10 px-4 py-3 text-sm text-sky-50"
          role="status"
        >
          <p>
            Saved draft found
            {draftSavedAt
              ? ` (${new Date(draftSavedAt).toLocaleString("en-US")})`
              : ""}{" "}
            in this browser.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={restoreDraft}
              className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
            >
              Restore draft
            </button>
            <button
              type="button"
              onClick={dismissDraftBanner}
              className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
            >
              Dismiss
            </button>
            <button
              type="button"
              onClick={clearDraft}
              className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
            >
              Clear draft
            </button>
          </div>
        </div>
      ) : null}
      {draftHint ? (
        <p className="mt-3 text-xs text-sky-100/80" role="status">
          {draftHint}
        </p>
      ) : null}
      <ul
        className="mt-4 flex flex-wrap gap-2 text-xs text-sky-100/75"
        aria-label="Preview readiness"
      >
        <li
          className={`rounded-full px-2.5 py-1 ${
            readyAmount
              ? "bg-emerald-400/15 text-emerald-100"
              : "bg-white/5 text-sky-100/70"
          }`}
        >
          Amount {readyAmount ? "ready" : "needed"}
        </li>
        <li
          className={`rounded-full px-2.5 py-1 ${
            readyNetwork
              ? "bg-emerald-400/15 text-emerald-100"
              : "bg-white/5 text-sky-100/70"
          }`}
        >
          Network {readyNetwork ? "ready" : "needed"}
        </li>
        <li
          className={`rounded-full px-2.5 py-1 ${
            walletStatus === "valid"
              ? "bg-emerald-400/15 text-emerald-100"
              : walletStatus === "invalid"
                ? "bg-amber-400/15 text-amber-100"
                : "bg-white/5 text-sky-100/70"
          }`}
        >
          Wallet{" "}
          {walletStatus === "valid"
            ? "ready"
            : walletStatus === "invalid"
              ? "fix"
              : "optional"}
        </li>
        <li className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-emerald-100">
          Pay {selectedPayment.label}
        </li>
        <li
          className={`rounded-full px-2.5 py-1 ${
            quoteStale
              ? "bg-amber-400/15 text-amber-100"
              : "bg-emerald-400/15 text-emerald-100"
          }`}
        >
          Quote {quoteStale ? "stale" : `${quoteRemaining}s`}
        </li>
        {walletStatus === "valid" ? (
          <li
            className={`rounded-full px-2.5 py-1 ${
              readyConfirm
                ? "bg-emerald-400/15 text-emerald-100"
                : "bg-amber-400/15 text-amber-100"
            }`}
          >
            Dest {readyConfirm ? "confirmed" : "confirm"}
          </li>
        ) : null}
        <li className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-emerald-100">
          {selectedCadence.label}
        </li>
        <li
          className={`rounded-full px-2.5 py-1 ${
            slippageBreach
              ? "bg-amber-400/15 text-amber-100"
              : "bg-emerald-400/15 text-emerald-100"
          }`}
        >
          Slip {selectedSlippage.label}
        </li>
        <li className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-emerald-100">
          {selectedSpeed.label}
        </li>
        <li className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-emerald-100">
          {selectedCountry.label}
        </li>
        {receiptStatus === "valid" ? (
          <li
            className={`rounded-full px-2.5 py-1 ${
              receiptConfirmStatus === "match"
                ? "bg-emerald-400/15 text-emerald-100"
                : "bg-amber-400/15 text-amber-100"
            }`}
          >
            Receipt{" "}
            {receiptConfirmStatus === "match" ? "confirmed" : "confirm"}
          </li>
        ) : receiptStatus === "invalid" ? (
          <li className="rounded-full bg-amber-400/15 px-2.5 py-1 text-amber-100">
            Receipt fix
          </li>
        ) : null}
        {promoStatus === "valid" ? (
          <li className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-emerald-100">
            Promo {activePromo?.discountPct}%
          </li>
        ) : promoStatus === "invalid" || promoStatus === "long" ? (
          <li className="rounded-full bg-amber-400/15 px-2.5 py-1 text-amber-100">
            Promo fix
          </li>
        ) : null}
        <li
          className={`rounded-full px-2.5 py-1 ${
            riskAccepted
              ? "bg-emerald-400/15 text-emerald-100"
              : "bg-amber-400/15 text-amber-100"
          }`}
        >
          Risk {riskAccepted ? "accepted" : "needed"}
        </li>
        <li
          className={`rounded-full px-2.5 py-1 ${
            tosAccepted
              ? "bg-emerald-400/15 text-emerald-100"
              : "bg-amber-400/15 text-amber-100"
          }`}
        >
          ToS {tosAccepted ? "accepted" : "needed"}
        </li>
        <li
          className={`rounded-full px-2.5 py-1 ${
            privacyAccepted
              ? "bg-emerald-400/15 text-emerald-100"
              : "bg-amber-400/15 text-amber-100"
          }`}
        >
          Privacy {privacyAccepted ? "accepted" : "needed"}
        </li>
        <li
          className={`rounded-full px-2.5 py-1 ${
            selfCustodyAccepted
              ? "bg-emerald-400/15 text-emerald-100"
              : "bg-amber-400/15 text-amber-100"
          }`}
        >
          Custody {selfCustodyAccepted ? "acked" : "needed"}
        </li>
        <li className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-emerald-100">
          {selectedFiat.label}
        </li>
        <li className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-emerald-100">
          Funds {selectedFundSource.label}
        </li>
        <li className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-emerald-100">
          Purpose {selectedPurpose.label}
        </li>
        <li className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-emerald-100">
          Tax {selectedTaxResidency.label}
        </li>
        <li className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-emerald-100">
          Arrive {selectedSpeed.label}
        </li>
        <li
          className={`rounded-full px-2.5 py-1 ${
            smsStatus === "valid"
              ? "bg-emerald-400/15 text-emerald-100"
              : smsStatus === "invalid" || smsStatus === "long"
                ? "bg-amber-400/15 text-amber-100"
                : "bg-white/5 text-sky-100/70"
          }`}
        >
          SMS{" "}
          {smsStatus === "valid"
            ? "ready"
            : smsStatus === "invalid" || smsStatus === "long"
              ? "fix"
              : "optional"}
        </li>
        <li
          className={`rounded-full px-2.5 py-1 ${
            draftFromPinned
              ? "bg-emerald-400/15 text-emerald-100"
              : draftAvailable
                ? "bg-emerald-400/15 text-emerald-100"
                : "bg-white/5 text-sky-100/70"
          }`}
        >
          Draft{" "}
          {draftFromPinned
            ? "from pin"
            : draftAvailable
              ? "saved"
              : "none"}
        </li>
        <li
          className={`rounded-full px-2.5 py-1 ${
            autosaveOn
              ? "bg-emerald-400/15 text-emerald-100"
              : "bg-white/5 text-sky-100/70"
          }`}
        >
          Autosave {autosaveOn ? "on" : "off"}
        </li>
        <li
          className={`rounded-full px-2.5 py-1 ${
            draftLinkCopied
              ? "bg-emerald-400/15 text-emerald-100"
              : "bg-white/5 text-sky-100/70"
          }`}
        >
          Link {draftLinkCopied ? "copied" : "share"}
        </li>
        <li
          className={`rounded-full px-2.5 py-1 ${
            draftLinkPasted
              ? "bg-emerald-400/15 text-emerald-100"
              : "bg-white/5 text-sky-100/70"
          }`}
        >
          Link {draftLinkPasted ? "pasted" : "paste"}
        </li>
        <li className="rounded-full bg-emerald-400/15 px-2.5 py-1 font-mono text-emerald-100">
          FP {draftFingerprint}
        </li>
        <li
          className={`rounded-full px-2.5 py-1 ${
            liveVerifyStatus === "match"
              ? "bg-emerald-400/15 text-emerald-100"
              : liveVerifyStatus === "mismatch" ||
                  liveVerifyStatus === "invalid"
                ? "bg-amber-400/15 text-amber-100"
                : "bg-white/5 text-sky-100/70"
          }`}
        >
          Verify{" "}
          {liveVerifyStatus === "match"
            ? "match"
            : liveVerifyStatus === "mismatch"
              ? "mismatch"
              : liveVerifyStatus === "invalid"
                ? "invalid"
                : "idle"}
        </li>
        <li
          className={`rounded-full px-2.5 py-1 ${
            draftDiffLines.length > 0 && liveVerifyStatus === "mismatch"
              ? "bg-amber-400/15 text-amber-100"
              : "bg-white/5 text-sky-100/70"
          }`}
        >
          Diff{" "}
          {draftDiffLines.length > 0 && liveVerifyStatus === "mismatch"
            ? `${draftDiffLines.length}`
            : "idle"}
        </li>
        <li
          className={`rounded-full px-2.5 py-1 ${
            pinSwapped ||
            pinApplied ||
            pinLinkCopied ||
            pinExported ||
            pinLinkPasted ||
            pinImported ||
            pinFromDrafted
              ? "bg-emerald-400/15 text-emerald-100"
              : pinAvailable
                ? "bg-sky-400/15 text-sky-100"
                : "bg-white/5 text-sky-100/70"
          }`}
        >
          Pin{" "}
          {pinSwapped
            ? "swapped"
            : pinApplied
              ? "applied"
              : pinLinkCopied
                ? "link copied"
                : pinExported
                  ? "exported"
                  : pinLinkPasted
                    ? "link pasted"
                    : pinImported
                      ? "imported"
                      : pinFromDrafted
                        ? "from draft"
                        : pinAvailable
                          ? pinFingerprint
                            ? `FP ${pinFingerprint}`
                            : "ready"
                          : "none"}
        </li>
        <li
          className={`rounded-full px-2.5 py-1 ${
            ageConfirmed
              ? "bg-emerald-400/15 text-emerald-100"
              : "bg-amber-400/15 text-amber-100"
          }`}
        >
          Age {ageConfirmed ? "18+" : "needed"}
        </li>
        <li className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-emerald-100">
          Ref {orderRef}
        </li>
      </ul>
      <fieldset className="mt-6">
        <legend className="text-sm text-sky-100/80">Buy frequency</legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {buyCadences.map((option) => {
            const selected = buyCadence === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setBuyCadence(option.id);
                  setSubmitHint(null);
                }}
                aria-pressed={selected}
                className={`rounded-lg px-2 py-2.5 text-left transition-colors ${
                  selected
                    ? "bg-white text-[#0b1b33]"
                    : "border border-white/20 bg-white/5 text-sky-100/90 hover:bg-white/10"
                }`}
              >
                <span className="block text-sm font-semibold">
                  {option.label}
                </span>
                <span
                  className={`mt-0.5 block text-[11px] ${
                    selected ? "text-[#0b1b33]/70" : "text-sky-100/65"
                  }`}
                >
                  {option.detail}
                </span>
              </button>
            );
          })}
        </div>
        <input type="hidden" name="buy_cadence" value={buyCadence} />
      </fieldset>
      <fieldset className="mt-4">
        <legend className="text-sm text-sky-100/80">Buy asset</legend>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {assets.map((option) => {
            const selected = asset === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setAsset(option.id);
                  const nextNetwork =
                    networks.find((candidate) =>
                      (candidate.assets as readonly string[]).includes(
                        option.id,
                      ),
                    )?.id ?? "ethereum";
                  setNetwork(nextNetwork);
                  setWalletTouched(false);
                  setConfirmWallet(false);
                  setQuoteJitterBps(0);
                  setQuoteAt(new Date());
                  setQuoteAgeSec(0);
                  if (amountValid) {
                    lockQuoteUnits(amountInUsd, option.id, 0);
                  } else {
                    setLockedUnits(null);
                  }
                  setSubmitHint(null);
                }}
                aria-pressed={selected}
                title={option.name}
                className={`rounded-lg px-2 py-2.5 text-sm font-semibold transition-colors ${
                  selected
                    ? "bg-white text-[#0b1b33]"
                    : "border border-white/20 bg-white/5 text-sky-100/90 hover:bg-white/10"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <input type="hidden" name="asset" value={asset} />
      </fieldset>
      <fieldset className="mt-4">
        <legend className="text-sm text-sky-100/80">Network</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {availableNetworks.map((option) => {
            const selected = activeNetwork?.id === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setNetwork(option.id);
                  setWalletTouched(false);
                  setConfirmWallet(false);
                  setSubmitHint(null);
                }}
                aria-pressed={selected}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  selected
                    ? "bg-white text-[#0b1b33]"
                    : "border border-white/20 bg-white/5 text-sky-100/90 hover:bg-white/10"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <input type="hidden" name="network" value={activeNetwork?.id ?? ""} />
      </fieldset>
      <label className="mt-4 block text-sm text-sky-100/80">
        Destination wallet
        <input
          name="wallet"
          type="text"
          value={wallet}
          onChange={(event) => {
            setWallet(event.target.value);
            setConfirmWallet(false);
            setSubmitHint(null);
          }}
          onBlur={() => setWalletTouched(true)}
          placeholder={activeNetwork?.placeholder ?? "Your chain address"}
          autoComplete="off"
          spellCheck={false}
          aria-invalid={walletTouched && walletStatus === "invalid"}
          className="mt-2 w-full rounded-xl border border-white/20 bg-[#071222]/70 px-4 py-3 text-base text-white placeholder:text-sky-200/40 outline-none transition focus:border-sky-300/60"
        />
      </label>
      {walletTouched && walletStatus === "invalid" ? (
        <p className="mt-2 text-xs text-amber-200/90" role="status">
          Address doesn&apos;t match {activeNetwork?.label ?? "selected"} format
          yet — checkout will re-check.
        </p>
      ) : null}
      {walletStatus === "valid" ? (
        <p className="mt-2 text-xs text-emerald-200/90" role="status">
          Looks like a valid {activeNetwork?.label} address for preview.
        </p>
      ) : null}
      {walletStatus === "valid" ? (
        <label className="mt-3 flex items-start gap-3 text-sm text-sky-100/90">
          <input
            type="checkbox"
            name="confirm_wallet"
            value="1"
            checked={confirmWallet}
            onChange={(event) => {
              setConfirmWallet(event.target.checked);
              setSubmitHint(null);
            }}
            className="mt-1 h-4 w-4 rounded border-white/30 accent-[var(--accent)]"
          />
          <span>
            <span className="font-semibold text-white">
              Confirm destination wallet
            </span>
            <span className="mt-1 block text-xs text-sky-100/70">
              I understand crypto will be sent to{" "}
              {trimmedWallet.slice(0, 6)}…{trimmedWallet.slice(-4)} on{" "}
              {activeNetwork?.label}.
            </span>
          </span>
        </label>
      ) : null}
      <fieldset className="mt-4">
        <legend className="text-sm text-sky-100/80">Fiat currency</legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {fiatCurrencies.map((option) => {
            const selected = fiatCurrency === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setFiatCurrency(option.id);
                  setQuoteJitterBps(0);
                  setQuoteAt(new Date());
                  setQuoteAgeSec(0);
                  if (amountValid) {
                    lockQuoteUnits(
                      parsedAmount / option.perUsd,
                      selectedAsset.id,
                      0,
                    );
                  } else {
                    setLockedUnits(null);
                  }
                  setSubmitHint(null);
                }}
                aria-pressed={selected}
                className={`rounded-lg px-2 py-2.5 text-left transition-colors ${
                  selected
                    ? "bg-white text-[#0b1b33]"
                    : "border border-white/20 bg-white/5 text-sky-100/90 hover:bg-white/10"
                }`}
              >
                <span className="block text-sm font-semibold">
                  {option.label}
                </span>
                <span
                  className={`mt-0.5 block text-[11px] ${
                    selected ? "text-[#0b1b33]/70" : "text-sky-100/65"
                  }`}
                >
                  {option.detail}
                </span>
              </button>
            );
          })}
        </div>
        <input type="hidden" name="fiat_currency" value={fiatCurrency} />
        <p className="mt-2 text-xs text-sky-100/65">
          Tease FX only — live Stripe settles in the card&apos;s billing
          currency at checkout.
        </p>
      </fieldset>
      <fieldset className="mt-4">
        <legend className="text-sm text-sky-100/80">
          Buy amount ({selectedFiat.label})
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {presets.map((preset) => {
            const selected = amount === String(preset);
            return (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setAmount(String(preset));
                  setAmountTouched(true);
                  setQuoteJitterBps(0);
                  setQuoteAt(new Date());
                  setQuoteAgeSec(0);
                  lockQuoteUnits(
                    preset / selectedFiat.perUsd,
                    selectedAsset.id,
                    0,
                  );
                  setSubmitHint(null);
                }}
                aria-pressed={selected}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  selected
                    ? "bg-white text-[#0b1b33]"
                    : "border border-white/20 bg-white/5 text-sky-100/90 hover:bg-white/10"
                }`}
              >
                ${preset}
              </button>
            );
          })}
        </div>
        <input
          name="amount"
          type="number"
          min={minAmount}
          max={maxAmount}
          step="1"
          value={amount}
          onChange={(event) => {
            const next = event.target.value;
            setAmount(next);
            setSubmitHint(null);
            const nextParsed = Number(next);
            if (
              Number.isFinite(nextParsed) &&
              nextParsed >= minAmount &&
              nextParsed <= maxAmount
            ) {
              setQuoteJitterBps(0);
              setQuoteAt(new Date());
              setQuoteAgeSec(0);
              lockQuoteUnits(
                nextParsed / selectedFiat.perUsd,
                selectedAsset.id,
                0,
              );
            } else {
              setLockedUnits(null);
            }
          }}
          onBlur={() => setAmountTouched(true)}
          placeholder="50"
          aria-invalid={amountTouched && !amountValid}
          className="mt-3 w-full rounded-xl border border-white/20 bg-[#071222]/70 px-4 py-3 text-base text-white placeholder:text-sky-200/40 outline-none transition focus:border-sky-300/60"
        />
      </fieldset>
      {amountTouched && amountStatus === "low" ? (
        <p className="mt-2 text-xs text-amber-200/90" role="status">
          Minimum buy is ${minAmount} USD for preview.
        </p>
      ) : null}
      {amountTouched && amountStatus === "high" ? (
        <p className="mt-2 text-xs text-amber-200/90" role="status">
          Preview caps at ${maxAmount.toLocaleString("en-US")} — higher limits
          available after sign-in.
        </p>
      ) : null}
      <fieldset className="mt-4">
        <legend className="text-sm text-sky-100/80">Billing country</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {billingCountries.map((option) => {
            const selected = billingCountry === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setBillingCountry(option.id);
                  setSubmitHint(null);
                }}
                aria-pressed={selected}
                className={`rounded-lg px-2 py-2.5 text-left transition-colors ${
                  selected
                    ? "bg-white text-[#0b1b33]"
                    : "border border-white/20 bg-white/5 text-sky-100/90 hover:bg-white/10"
                }`}
              >
                <span className="block text-sm font-semibold">
                  {option.label}
                </span>
                <span
                  className={`mt-0.5 block text-[11px] ${
                    selected ? "text-[#0b1b33]/70" : "text-sky-100/65"
                  }`}
                >
                  {option.detail}
                </span>
              </button>
            );
          })}
        </div>
        <input type="hidden" name="billing_country" value={billingCountry} />
      </fieldset>
      <fieldset className="mt-4">
        <legend className="text-sm text-sky-100/80">Pay with</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {availablePayments.map((option) => {
            const selected = effectivePayment === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setPaymentMethod(option.id)}
                aria-pressed={selected}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  selected
                    ? "bg-white text-[#0b1b33]"
                    : "border border-white/20 bg-white/5 text-sky-100/90 hover:bg-white/10"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <input type="hidden" name="payment_method" value={effectivePayment} />
        <p className="mt-2 text-xs text-sky-100/65">
          Card options follow billing country — live Stripe still confirms
          bank/region at checkout.
        </p>
      </fieldset>
      <fieldset className="mt-4">
        <legend className="text-sm text-sky-100/80">
          Max slippage / min receive
        </legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {slippageOptions.map((option) => {
            const selected = slippage === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setSlippage(option.id);
                  setSubmitHint(null);
                }}
                aria-pressed={selected}
                className={`rounded-lg px-2 py-2.5 text-left transition-colors ${
                  selected
                    ? "bg-white text-[#0b1b33]"
                    : "border border-white/20 bg-white/5 text-sky-100/90 hover:bg-white/10"
                }`}
              >
                <span className="block text-sm font-semibold">
                  {option.label}
                </span>
                <span
                  className={`mt-0.5 block text-[11px] ${
                    selected ? "text-[#0b1b33]/70" : "text-sky-100/65"
                  }`}
                >
                  {option.detail}
                </span>
              </button>
            );
          })}
        </div>
        <input type="hidden" name="slippage" value={slippage} />
      </fieldset>
      <fieldset className="mt-4">
        <legend className="text-sm text-sky-100/80">Network speed</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {networkSpeeds.map((option) => {
            const selected = networkSpeed === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setNetworkSpeed(option.id);
                  setSubmitHint(null);
                }}
                aria-pressed={selected}
                className={`rounded-lg px-2 py-2.5 text-left transition-colors ${
                  selected
                    ? "bg-white text-[#0b1b33]"
                    : "border border-white/20 bg-white/5 text-sky-100/90 hover:bg-white/10"
                }`}
              >
                <span className="block text-sm font-semibold">
                  {option.label}
                </span>
                <span
                  className={`mt-0.5 block text-[11px] ${
                    selected ? "text-[#0b1b33]/70" : "text-sky-100/65"
                  }`}
                >
                  {option.detail}
                </span>
              </button>
            );
          })}
        </div>
        <input type="hidden" name="network_speed" value={networkSpeed} />
      </fieldset>
      <label className="mt-4 block text-sm text-sky-100/80">
        Order memo{" "}
        <span className="text-sky-100/55">(optional)</span>
        <input
          name="order_memo"
          type="text"
          maxLength={memoMaxLen + 20}
          value={orderMemo}
          onChange={(event) => {
            setOrderMemo(event.target.value);
            setSubmitHint(null);
          }}
          placeholder="Invoice #, client tag…"
          autoComplete="off"
          className="mt-2 w-full rounded-xl border border-white/20 bg-[#071222]/70 px-4 py-3 text-base text-white placeholder:text-sky-200/40 outline-none transition focus:border-sky-300/60"
        />
      </label>
      {memoStatus === "long" ? (
        <p className="mt-2 text-xs text-amber-200/90" role="status">
          Memo max is {memoMaxLen} characters for preview.
        </p>
      ) : trimmedMemo ? (
        <p className="mt-2 text-xs text-sky-100/65" role="status">
          {trimmedMemo.length}/{memoMaxLen} · tagged on the order preview.
        </p>
      ) : null}
      <label className="mt-4 block text-sm text-sky-100/80">
        Receipt email{" "}
        <span className="text-sky-100/55">(optional)</span>
        <input
          name="receipt_email"
          type="email"
          autoComplete="email"
          value={receiptEmail}
          onChange={(event) => {
            const next = event.target.value;
            setReceiptEmail(next);
            if (!next.trim()) {
              setReceiptConfirm("");
              setReceiptConfirmTouched(false);
            }
            setSubmitHint(null);
          }}
          onBlur={() => setReceiptTouched(true)}
          placeholder="you@company.com"
          aria-invalid={receiptTouched && receiptStatus === "invalid"}
          className="mt-2 w-full rounded-xl border border-white/20 bg-[#071222]/70 px-4 py-3 text-base text-white placeholder:text-sky-200/40 outline-none transition focus:border-sky-300/60"
        />
      </label>
      {receiptTouched && receiptStatus === "invalid" ? (
        <p className="mt-2 text-xs text-amber-200/90" role="status">
          Enter a valid email, or clear the field to skip receipts in preview.
        </p>
      ) : null}
      {receiptStatus === "valid" ? (
        <p className="mt-2 text-xs text-emerald-200/90" role="status">
          Receipt tease will go to {trimmedReceipt} after checkout — confirm it
          below.
        </p>
      ) : null}
      {receiptStatus === "valid" ? (
        <label className="mt-3 block text-sm text-sky-100/80">
          Confirm receipt email
          <input
            name="receipt_email_confirm"
            type="email"
            autoComplete="email"
            value={receiptConfirm}
            onChange={(event) => {
              setReceiptConfirm(event.target.value);
              setSubmitHint(null);
            }}
            onBlur={() => setReceiptConfirmTouched(true)}
            placeholder="Re-enter email"
            aria-invalid={
              receiptConfirmTouched && receiptConfirmStatus === "mismatch"
            }
            className="mt-2 w-full rounded-xl border border-white/20 bg-[#071222]/70 px-4 py-3 text-base text-white placeholder:text-sky-200/40 outline-none transition focus:border-sky-300/60"
          />
        </label>
      ) : null}
      {receiptConfirmTouched && receiptConfirmStatus === "mismatch" ? (
        <p className="mt-2 text-xs text-amber-200/90" role="status">
          Confirmation does not match — emails must be identical (case
          insensitive).
        </p>
      ) : null}
      {receiptConfirmStatus === "match" ? (
        <p className="mt-2 text-xs text-emerald-200/90" role="status">
          Receipt email confirmed for preview.
        </p>
      ) : null}
      <label className="mt-4 block text-sm text-sky-100/80">
        SMS for settlement alerts{" "}
        <span className="text-sky-100/55">(optional)</span>
        <input
          name="sms_phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={smsPhone}
          onChange={(event) => {
            setSmsPhone(event.target.value);
            setSubmitHint(null);
          }}
          onBlur={() => setSmsTouched(true)}
          placeholder="+15551234567"
          maxLength={smsMaxLen + 8}
          aria-invalid={
            smsTouched && (smsStatus === "invalid" || smsStatus === "long")
          }
          className="mt-2 w-full rounded-xl border border-white/20 bg-[#071222]/70 px-4 py-3 text-base text-white placeholder:text-sky-200/40 outline-none transition focus:border-sky-300/60"
        />
      </label>
      {smsTouched && (smsStatus === "invalid" || smsStatus === "long") ? (
        <p className="mt-2 text-xs text-amber-200/90" role="status">
          Use E.164 (e.g. +15551234567), or clear the field to skip SMS in
          preview.
        </p>
      ) : null}
      {smsStatus === "valid" ? (
        <p className="mt-2 text-xs text-emerald-200/90" role="status">
          Settlement SMS tease → {trimmedSms} (preview only — live Twilio/Stripe
          wiring finishes on Omnipay.cc).
        </p>
      ) : null}
      <label className="mt-4 block text-sm text-sky-100/80">
        Promo code{" "}
        <span className="text-sky-100/55">(optional)</span>
        <input
          name="promo_code"
          type="text"
          maxLength={promoMaxLen + 8}
          value={promoCode}
          onChange={(event) => {
            setPromoCode(event.target.value);
            setSubmitHint(null);
          }}
          onBlur={() => setPromoTouched(true)}
          placeholder="OMNI10"
          autoComplete="off"
          spellCheck={false}
          aria-invalid={
            promoTouched &&
            (promoStatus === "invalid" || promoStatus === "long")
          }
          className="mt-2 w-full rounded-xl border border-white/20 bg-[#071222]/70 px-4 py-3 text-base uppercase text-white placeholder:text-sky-200/40 outline-none transition focus:border-sky-300/60"
        />
      </label>
      {promoTouched && promoStatus === "invalid" ? (
        <p className="mt-2 text-xs text-amber-200/90" role="status">
          Preview teases OMNI10 or ACCUMULATE — clear the field to continue
          without a promo.
        </p>
      ) : null}
      {promoTouched && promoStatus === "long" ? (
        <p className="mt-2 text-xs text-amber-200/90" role="status">
          Promo max is {promoMaxLen} characters for preview.
        </p>
      ) : null}
      {promoStatus === "valid" && activePromo ? (
        <p className="mt-2 text-xs text-emerald-200/90" role="status">
          Promo {trimmedPromo} applied — {activePromo.label} (tease only).
        </p>
      ) : null}
      <fieldset className="mt-4">
        <legend className="text-sm text-sky-100/80">Source of funds</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {fundSources.map((option) => {
            const selected = fundSource === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setFundSource(option.id);
                  setSubmitHint(null);
                }}
                aria-pressed={selected}
                className={`rounded-lg px-2 py-2.5 text-left transition-colors ${
                  selected
                    ? "bg-white text-[#0b1b33]"
                    : "border border-white/20 bg-white/5 text-sky-100/90 hover:bg-white/10"
                }`}
              >
                <span className="block text-sm font-semibold">
                  {option.label}
                </span>
                <span
                  className={`mt-0.5 block text-[11px] ${
                    selected ? "text-[#0b1b33]/70" : "text-sky-100/65"
                  }`}
                >
                  {option.detail}
                </span>
              </button>
            );
          })}
        </div>
        <input type="hidden" name="fund_source" value={fundSource} />
        <p className="mt-2 text-xs text-sky-100/65">
          Compliance tease only — live Omnipay.cc may ask again at KYC.
        </p>
      </fieldset>
      <fieldset className="mt-4">
        <legend className="text-sm text-sky-100/80">Purchase purpose</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {purchasePurposes.map((option) => {
            const selected = purchasePurpose === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setPurchasePurpose(option.id);
                  setSubmitHint(null);
                }}
                aria-pressed={selected}
                className={`rounded-lg px-2 py-2.5 text-left transition-colors ${
                  selected
                    ? "bg-white text-[#0b1b33]"
                    : "border border-white/20 bg-white/5 text-sky-100/90 hover:bg-white/10"
                }`}
              >
                <span className="block text-sm font-semibold">
                  {option.label}
                </span>
                <span
                  className={`mt-0.5 block text-[11px] ${
                    selected ? "text-[#0b1b33]/70" : "text-sky-100/65"
                  }`}
                >
                  {option.detail}
                </span>
              </button>
            );
          })}
        </div>
        <input type="hidden" name="purchase_purpose" value={purchasePurpose} />
        <p className="mt-2 text-xs text-sky-100/65">
          Preview only — live Omnipay.cc may collect purpose again for
          compliance.
        </p>
      </fieldset>
      <fieldset className="mt-4">
        <legend className="text-sm text-sky-100/80">Tax residency</legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {taxResidencies.map((option) => {
            const selected = taxResidency === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setTaxResidency(option.id);
                  setSubmitHint(null);
                }}
                aria-pressed={selected}
                className={`rounded-lg px-2 py-2.5 text-left transition-colors ${
                  selected
                    ? "bg-white text-[#0b1b33]"
                    : "border border-white/20 bg-white/5 text-sky-100/90 hover:bg-white/10"
                }`}
              >
                <span className="block text-sm font-semibold">
                  {option.label}
                </span>
                <span
                  className={`mt-0.5 block text-[11px] ${
                    selected ? "text-[#0b1b33]/70" : "text-sky-100/65"
                  }`}
                >
                  {option.detail}
                </span>
              </button>
            );
          })}
        </div>
        <input type="hidden" name="tax_residency" value={taxResidency} />
        <p className="mt-2 text-xs text-sky-100/65">
          Compliance tease only — live Omnipay.cc may collect W-9 / CRS forms
          at KYC. Prefer not is allowed in preview.
        </p>
      </fieldset>
      <div
        className={`mt-4 rounded-xl border px-4 py-3 text-sm leading-6 ${
          quoteStale || slippageBreach
            ? "border-amber-300/40 bg-amber-400/10 text-amber-50"
            : "border-sky-300/25 bg-sky-400/10 text-sky-50"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs uppercase tracking-[0.12em] text-sky-200/80">
            Tease quote as of {formatQuoteTime(quoteAt)}
            {quoteStale
              ? " · expired"
              : ` · valid ${quoteRemaining}s`}
          </p>
          <button
            type="button"
            onClick={refreshQuote}
            className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
          >
            Refresh quote
          </button>
        </div>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-sky-200/85">
          <span>
            Preview order ref{" "}
            <span className="font-semibold tracking-wide text-white">
              {orderRef}
            </span>{" "}
            · draft FP{" "}
            <span className="font-mono font-semibold tracking-wide text-white">
              {draftFingerprint}
            </span>{" "}
            — cite ref if you continue to Omnipay.cc support (tease only).
          </span>
          <button
            type="button"
            onClick={copyOrderRef}
            className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
          >
            {refCopied ? "Copied" : "Copy ref"}
          </button>
          <button
            type="button"
            onClick={shareSummary}
            className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
          >
            {summaryCopied ? "Shared" : "Share summary"}
          </button>
          <button
            type="button"
            onClick={downloadSummary}
            className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
          >
            {summaryDownloaded ? "Downloaded" : "Download summary"}
          </button>
          <button
            type="button"
            onClick={exportDraftJson}
            className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
          >
            {draftExported ? "Exported" : "Export draft"}
          </button>
          <button
            type="button"
            onClick={openImportDraftPicker}
            className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
          >
            {draftImported ? "Imported" : "Import draft"}
          </button>
          <button
            type="button"
            onClick={copyDraftLink}
            className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
          >
            {draftLinkCopied ? "Link copied" : "Copy draft link"}
          </button>
          <button
            type="button"
            onClick={pasteDraftLinkFromClipboard}
            className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
          >
            {draftLinkPasted ? "Link pasted" : "Paste draft link"}
          </button>
          <button
            type="button"
            onClick={verifyDraftLinkFromClipboard}
            className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
          >
            {verifyAnchor === "form" && liveVerifyStatus === "match"
              ? "Link matches"
              : verifyAnchor === "form" && liveVerifyStatus === "mismatch"
                ? "Link mismatch"
                : "Verify draft link"}
          </button>
          <button
            type="button"
            onClick={diffDraftLinkFromClipboard}
            className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
          >
            {verifyAnchor === "form" &&
            draftDiffLines.length > 0 &&
            liveVerifyStatus === "mismatch"
              ? `Diff (${draftDiffLines.length})`
              : "Diff draft link"}
          </button>
          <button
            type="button"
            onClick={pinDraft}
            className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
          >
            {pinAvailable ? "Repin draft" : "Pin draft"}
          </button>
          {pinAvailable ? (
            <button
              type="button"
              onClick={swapPin}
              className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
            >
              {pinSwapped ? "Pin swapped" : "Swap pin"}
            </button>
          ) : null}
          {pinAvailable ? (
            <button
              type="button"
              onClick={applyPin}
              className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
            >
              {pinApplied ? "Pin applied" : "Apply pin"}
            </button>
          ) : null}
          {pinAvailable ? (
            <button
              type="button"
              onClick={diffVsPin}
              className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
            >
              {verifyAnchor === "form" &&
              draftDiffLines.length > 0 &&
              liveVerifyStatus === "mismatch"
                ? `Diff pin (${draftDiffLines.length})`
                : "Diff vs pin"}
            </button>
          ) : null}
          {pinAvailable ? (
            <button
              type="button"
              onClick={() => {
                void copyPinLink();
              }}
              className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
            >
              {pinLinkCopied ? "Pin link copied" : "Copy pin link"}
            </button>
          ) : null}
          {pinAvailable ? (
            <button
              type="button"
              onClick={exportPinJson}
              className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
            >
              {pinExported ? "Pin exported" : "Export pin"}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => {
              void pastePinLinkFromClipboard();
            }}
            className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
          >
            {pinLinkPasted ? "Pin link pasted" : "Paste pin link"}
          </button>
          <button
            type="button"
            onClick={openImportPinPicker}
            className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
          >
            {pinImported ? "Pin imported" : "Import pin"}
          </button>
          <button
            type="button"
            onClick={pinFromDraft}
            className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
          >
            {pinFromDrafted ? "Pin from draft ✓" : "Pin from draft"}
          </button>
          {pinAvailable ? (
            <button
              type="button"
              onClick={draftFromPin}
              className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
            >
              {draftFromPinned ? "Draft from pin ✓" : "Draft from pin"}
            </button>
          ) : null}
          {pinAvailable ? (
            <button
              type="button"
              onClick={() => {
                void verifyPinLinkFromClipboard();
              }}
              className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
            >
              {verifyAnchor === "pin" && liveVerifyStatus === "match"
                ? "Pin link matches"
                : verifyAnchor === "pin" && liveVerifyStatus === "mismatch"
                  ? "Pin link mismatch"
                  : "Verify pin link"}
            </button>
          ) : null}
          {pinAvailable ? (
            <button
              type="button"
              onClick={() => {
                void diffPinLinkFromClipboard();
              }}
              className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
            >
              {verifyAnchor === "pin" &&
              draftDiffLines.length > 0 &&
              liveVerifyStatus === "mismatch"
                ? `Diff pin link (${draftDiffLines.length})`
                : "Diff pin link"}
            </button>
          ) : null}
          {pinAvailable ? (
            <button
              type="button"
              onClick={clearPin}
              className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
            >
              Clear pin
            </button>
          ) : null}
          <input
            ref={pasteDraftInputRef}
            type="text"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            placeholder="#omn-draft=… or full URL"
            aria-label="Paste draft link"
            onPaste={(event) => {
              const text = event.clipboardData.getData("text");
              if (!text.trim()) return;
              event.preventDefault();
              if (applyPastedDraft(text)) {
                event.currentTarget.value = "";
              }
            }}
            onKeyDown={(event) => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              applyFromPasteField(event.currentTarget);
            }}
            className="min-w-[12rem] flex-1 rounded-lg border border-white/20 bg-[#071222]/70 px-2.5 py-1 text-xs text-white placeholder:text-sky-200/40 outline-none transition focus:border-sky-300/60"
          />
          <input
            ref={importDraftInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            aria-hidden
            tabIndex={-1}
            onChange={onImportDraftFile}
          />
          <input
            ref={importPinInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            aria-hidden
            tabIndex={-1}
            onChange={onImportPinFile}
          />
          <button
            type="button"
            onClick={saveDraft}
            className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
          >
            Save draft
          </button>
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white">
            <input
              type="checkbox"
              checked={autosaveOn}
              onChange={(event) => toggleAutosave(event.target.checked)}
              className="h-3.5 w-3.5 rounded border-white/30 accent-[var(--accent)]"
            />
            Autosave
          </label>
          {draftAvailable ? (
            <button
              type="button"
              onClick={restoreDraft}
              className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
            >
              Restore draft
            </button>
          ) : null}
          {draftAvailable ? (
            <button
              type="button"
              onClick={clearDraft}
              className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
            >
              Clear draft
            </button>
          ) : null}
          <button
            type="button"
            onClick={resetPreview}
            className="rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/20"
          >
            Reset preview
          </button>
        </p>
        {draftDiffLines.length > 0 && liveVerifyStatus === "mismatch" ? (
          <ul
            className="mt-2 max-h-40 list-disc space-y-1 overflow-y-auto rounded-lg border border-amber-300/35 bg-amber-400/10 px-4 py-2 text-xs text-amber-50"
            aria-label="Draft field diffs"
          >
            {draftDiffLines.slice(0, 12).map((line) => (
              <li key={line}>{line}</li>
            ))}
            {draftDiffLines.length > 12 ? (
              <li>+{draftDiffLines.length - 12} more fields</li>
            ) : null}
          </ul>
        ) : null}
        <input type="hidden" name="order_ref" value={orderRef} />
        <p className="mt-2">
          Order preview: {amountLabel}
          {selectedFiat.id !== "usd" ? ` (${amountUsdLabel} USD tease)` : ""} →{" "}
          {selectedAsset.label} on{" "}
          {activeNetwork?.label ?? selectedAsset.network}
          {trimmedWallet
            ? ` → ${trimmedWallet.slice(0, 6)}…${trimmedWallet.slice(-4)}`
            : " → your wallet"}{" "}
          via {selectedPayment.label} · {selectedCountry.label} ·{" "}
          {selectedCadence.label.toLowerCase()} ·{" "}
          {selectedSpeed.label.toLowerCase()} · funds{" "}
          {selectedFundSource.label.toLowerCase()} · purpose{" "}
          {selectedPurpose.label.toLowerCase()} · tax{" "}
          {selectedTaxResidency.label.toLowerCase()}
          {trimmedMemo ? ` · memo “${trimmedMemo.slice(0, 24)}${trimmedMemo.length > 24 ? "…" : ""}”` : ""}
          {activePromo ? ` · promo ${trimmedPromo}` : ""}
          {smsStatus === "valid" ? ` · sms ${trimmedSms}` : ""}
          .
        </p>
        <p className="mt-2 text-sky-100/80">
          Expected arrival window{" "}
          <span className="font-semibold text-white">{arrivalWindow}</span>{" "}
          ({selectedSpeed.label.toLowerCase()} · {selectedSpeed.eta} tease from
          quote time).
        </p>
        <p className="mt-2 text-sky-100/80">
          Tease unit rate{" "}
          <span className="font-semibold text-white">{unitRate}</span> /{" "}
          {selectedAsset.label}
          {quoteJitterBps !== 0
            ? ` (${quoteJitterBps > 0 ? "+" : ""}${quoteJitterBps} bps)`
            : ""}
          .
        </p>
        <p className="mt-2 text-sky-100/80">
          You&apos;ll receive about{" "}
          <span className="font-semibold text-white">{receiveEstimate}</span>{" "}
          (tease rate — final quote locks in checkout).
        </p>
        <p className="mt-2 text-sky-100/80">
          Min receive floor{" "}
          <span className="font-semibold text-white">{minReceiveEstimate}</span>{" "}
          at {selectedSlippage.label} slippage.
        </p>
        <p className="mt-2 text-sky-100/80">
          Est. network + processing {feeEstimate}
          {activePromo
            ? ` (−${activePromo.discountPct}% promo off fees)`
            : ""}{" "}
          · card total {totalEstimate}
          {selectedFiat.id !== "usd" ? ` (${fiatTotalEstimate})` : ""} · ETA{" "}
          {selectedSpeed.eta} · arrive {arrivalWindow}
          {receiptStatus === "valid" ? ` · receipt → ${trimmedReceipt}` : ""}
          {smsStatus === "valid" ? ` · sms → ${trimmedSms}` : ""}.
        </p>
        {quoteStale ? (
          <p className="mt-2 text-xs text-amber-100" role="status">
            Preview quote went soft-stale — refresh before continuing.
          </p>
        ) : null}
        {slippageBreach ? (
          <p className="mt-2 text-xs text-amber-100" role="status">
            Tease receive is under your min-receive floor — refresh quote or
            widen slippage.
          </p>
        ) : null}
      </div>
      <p className="mt-3 text-xs leading-5 text-sky-100/65">
        Pay with Visa, Mastercard, Amex, or debit — Stripe Crypto Onramp.
      </p>
      <label className="mt-4 flex items-start gap-3 text-sm text-sky-100/90">
        <input
          type="checkbox"
          name="risk_accepted"
          value="1"
          checked={riskAccepted}
          onChange={(event) => {
            setRiskAccepted(event.target.checked);
            setSubmitHint(null);
          }}
          className="mt-1 h-4 w-4 rounded border-white/30 accent-[var(--accent)]"
        />
        <span>
          <span className="font-semibold text-white">
            Accept preview risk disclosure
          </span>
          <span className="mt-1 block text-xs text-sky-100/70">
            Crypto prices move. Tease quotes are not live Stripe locks — final
            amount and fees confirm on Omnipay.cc before you pay.
          </span>
        </span>
      </label>
      <label className="mt-3 flex items-start gap-3 text-sm text-sky-100/90">
        <input
          type="checkbox"
          name="tos_accepted"
          value="1"
          checked={tosAccepted}
          onChange={(event) => {
            setTosAccepted(event.target.checked);
            setSubmitHint(null);
          }}
          className="mt-1 h-4 w-4 rounded border-white/30 accent-[var(--accent)]"
        />
        <span>
          <span className="font-semibold text-white">
            Accept Terms of Service
          </span>
          <span className="mt-1 block text-xs text-sky-100/70">
            Preview soft-gate only — the binding{" "}
            <a
              href="https://omnipay.cc/TermsOfService"
              className="underline decoration-sky-200/50 underline-offset-2 hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              Omnipay.cc Terms
            </a>{" "}
            still apply at live checkout.
          </span>
        </span>
      </label>
      <label className="mt-3 flex items-start gap-3 text-sm text-sky-100/90">
        <input
          type="checkbox"
          name="privacy_accepted"
          value="1"
          checked={privacyAccepted}
          onChange={(event) => {
            setPrivacyAccepted(event.target.checked);
            setSubmitHint(null);
          }}
          className="mt-1 h-4 w-4 rounded border-white/30 accent-[var(--accent)]"
        />
        <span>
          <span className="font-semibold text-white">
            Accept Privacy Policy
          </span>
          <span className="mt-1 block text-xs text-sky-100/70">
            Preview soft-gate only — the binding{" "}
            <a
              href="https://omnipay.cc/PrivacyPolicy"
              className="underline decoration-sky-200/50 underline-offset-2 hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              Omnipay.cc Privacy Policy
            </a>{" "}
            still applies at live checkout.
          </span>
        </span>
      </label>
      <label className="mt-3 flex items-start gap-3 text-sm text-sky-100/90">
        <input
          type="checkbox"
          name="self_custody_accepted"
          value="1"
          checked={selfCustodyAccepted}
          onChange={(event) => {
            setSelfCustodyAccepted(event.target.checked);
            setSubmitHint(null);
          }}
          className="mt-1 h-4 w-4 rounded border-white/30 accent-[var(--accent)]"
        />
        <span>
          <span className="font-semibold text-white">
            I understand crypto settles to my wallet (self-custody)
          </span>
          <span className="mt-1 block text-xs text-sky-100/70">
            Preview soft-gate — after settle, Omnipay does not custody your
            assets. Wrong address risk is yours; confirm destination carefully.
          </span>
        </span>
      </label>
      <label className="mt-3 flex items-start gap-3 text-sm text-sky-100/90">
        <input
          type="checkbox"
          name="age_confirmed"
          value="1"
          checked={ageConfirmed}
          onChange={(event) => {
            setAgeConfirmed(event.target.checked);
            setSubmitHint(null);
          }}
          className="mt-1 h-4 w-4 rounded border-white/30 accent-[var(--accent)]"
        />
        <span>
          <span className="font-semibold text-white">
            I confirm I am 18 or older
          </span>
          <span className="mt-1 block text-xs text-sky-100/70">
            Preview soft-gate — live Omnipay.cc still enforces eligibility and
            regional rules at checkout.
          </span>
        </span>
      </label>
      {submitHint ? (
        <p className="mt-3 text-xs text-amber-200/90" role="alert">
          {submitHint}
        </p>
      ) : null}
      <button
        type="submit"
        className="mt-6 w-full rounded-xl bg-[var(--accent)] px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-deep)]"
      >
        Continue to Omnipay.cc
      </button>
      <p className="mt-3 text-xs leading-5 text-sky-100/60">
        Opens the live checkout flow on Omnipay.cc. Powered by Stripe.
      </p>
    </form>
  );
}
