"use client";

import { FormEvent, useMemo, useState } from "react";

const presets = [25, 50, 100, 250] as const;
const minAmount = 10;
const maxAmount = 10_000;

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
    assets: ["sol"],
    placeholder: "Base58 Solana address",
    pattern: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
  },
] as const;

function formatReceive(amount: number, assetId: (typeof assets)[number]["id"]) {
  const rate = teaseRatesUsd[assetId];
  const units = amount / rate;
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
  const [submitHint, setSubmitHint] = useState<string | null>(null);

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

  const feeEstimate = amountValid
    ? `~$${(parsedAmount * 0.015).toFixed(2)}`
    : "—";
  const totalEstimate = amountValid
    ? `~$${(parsedAmount * 1.015).toFixed(2)}`
    : "—";
  const receiveEstimate = amountValid
    ? formatReceive(parsedAmount, selectedAsset.id)
    : "—";

  const trimmedWallet = wallet.trim();
  const walletStatus = !trimmedWallet
    ? "empty"
    : activeNetwork?.pattern.test(trimmedWallet)
      ? "valid"
      : "invalid";

  const readyAmount = amountValid;
  const readyNetwork = Boolean(activeNetwork);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    setAmountTouched(true);
    if (trimmedWallet) setWalletTouched(true);

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
      </ul>
      <fieldset className="mt-6">
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
            setAmount(event.target.value);
            setSubmitHint(null);
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
      <div className="mt-4 rounded-xl border border-sky-300/25 bg-sky-400/10 px-4 py-3 text-sm leading-6 text-sky-50">
        <p>
          Order preview: {amountLabel} → {selectedAsset.label} on{" "}
          {activeNetwork?.label ?? selectedAsset.network}
          {trimmedWallet
            ? ` → ${trimmedWallet.slice(0, 6)}…${trimmedWallet.slice(-4)}`
            : " → your wallet"}
          .
        </p>
        <p className="mt-2 text-sky-100/80">
          You&apos;ll receive about{" "}
          <span className="font-semibold text-white">{receiveEstimate}</span>{" "}
          (tease rate — final quote locks in checkout).
        </p>
        <p className="mt-2 text-sky-100/80">
          Est. network + processing {feeEstimate} · card total {totalEstimate} ·
          ETA under 1 min after payment.
        </p>
      </div>
      <p className="mt-3 text-xs leading-5 text-sky-100/65">
        Pay with Visa, Mastercard, Amex, or debit — Stripe Crypto Onramp.
      </p>
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
