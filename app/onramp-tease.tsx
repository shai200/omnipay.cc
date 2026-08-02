"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

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

/** Preview-only compliance tease — not a live KYC answer. */
const fundSources = [
  { id: "salary", label: "Salary", detail: "Paycheck" },
  { id: "savings", label: "Savings", detail: "Existing cash" },
  { id: "business", label: "Business", detail: "Company funds" },
  { id: "other", label: "Other", detail: "Tell us later" },
] as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const memoMaxLen = 80;
const promoMaxLen = 24;

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
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [orderRef] = useState(() => makeOrderRef());
  const [quoteAt, setQuoteAt] = useState(() => new Date());
  const [quoteJitterBps, setQuoteJitterBps] = useState(0);
  const [quoteAgeSec, setQuoteAgeSec] = useState(0);
  const [lockedUnits, setLockedUnits] = useState<number | null>(null);

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
  const amountLabel = amountValid
    ? `$${parsedAmount.toLocaleString("en-US")}`
    : "your amount";

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
    ? parsedAmount * (1 + quoteJitterBps / 10_000)
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

  const trimmedMemo = orderMemo.trim();
  const memoStatus =
    trimmedMemo.length > memoMaxLen ? "long" : trimmedMemo ? "ok" : "empty";

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
    // Seed min-receive floor from the initial tease amount/asset.
    if (lockedUnits === null && amountValid) {
      setLockedUnits(parsedAmount / teaseRatesUsd[selectedAsset.id]);
    }
  }, [amountValid, lockedUnits, parsedAmount, selectedAsset.id]);

  useEffect(() => {
    // Keep Pay with aligned to billing-country availability.
    if (!paymentAvailable && availablePayments[0]) {
      setPaymentMethod(availablePayments[0].id);
    }
  }, [paymentAvailable, availablePayments]);

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
      lockQuoteUnits(parsedAmount, selectedAsset.id, 0);
    }
    setQuoteJitterBps(next);
    setQuoteAt(new Date());
    setQuoteAgeSec(0);
    setSubmitHint(null);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    setAmountTouched(true);
    if (trimmedWallet) setWalletTouched(true);
    if (trimmedReceipt) setReceiptTouched(true);

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
          <li className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-emerald-100">
            Receipt ready
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
        <li className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-emerald-100">
          Funds {selectedFundSource.label}
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
                    lockQuoteUnits(parsedAmount, option.id, 0);
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
        <legend className="text-sm text-sky-100/80">Buy amount (USD)</legend>
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
                  lockQuoteUnits(preset, selectedAsset.id, 0);
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
              lockQuoteUnits(nextParsed, selectedAsset.id, 0);
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
            setReceiptEmail(event.target.value);
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
          Receipt tease will go to {trimmedReceipt} after checkout.
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
        <p className="mt-2 text-xs text-sky-200/85">
          Preview order ref{" "}
          <span className="font-semibold tracking-wide text-white">
            {orderRef}
          </span>{" "}
          — cite this if you continue to Omnipay.cc support (tease only).
        </p>
        <input type="hidden" name="order_ref" value={orderRef} />
        <p className="mt-2">
          Order preview: {amountLabel} → {selectedAsset.label} on{" "}
          {activeNetwork?.label ?? selectedAsset.network}
          {trimmedWallet
            ? ` → ${trimmedWallet.slice(0, 6)}…${trimmedWallet.slice(-4)}`
            : " → your wallet"}{" "}
          via {selectedPayment.label} · {selectedCountry.label} ·{" "}
          {selectedCadence.label.toLowerCase()} ·{" "}
          {selectedSpeed.label.toLowerCase()} · funds{" "}
          {selectedFundSource.label.toLowerCase()}
          {trimmedMemo ? ` · memo “${trimmedMemo.slice(0, 24)}${trimmedMemo.length > 24 ? "…" : ""}”` : ""}
          {activePromo ? ` · promo ${trimmedPromo}` : ""}
          .
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
          · card total {totalEstimate} · ETA {selectedSpeed.eta}
          {receiptStatus === "valid" ? ` · receipt → ${trimmedReceipt}` : ""}.
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
