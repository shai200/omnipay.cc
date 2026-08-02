"use client";

import { useMemo, useState } from "react";

const presets = [25, 50, 100, 250] as const;
const assets = [
  { id: "btc", label: "BTC", name: "Bitcoin", network: "Bitcoin" },
  { id: "eth", label: "ETH", name: "Ethereum", network: "Ethereum" },
  { id: "usdc", label: "USDC", name: "USD Coin", network: "Ethereum" },
  { id: "sol", label: "SOL", name: "Solana", network: "Solana" },
] as const;

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

export function OnrampTease() {
  const [amount, setAmount] = useState("50");
  const [asset, setAsset] = useState<(typeof assets)[number]["id"]>("btc");
  const [wallet, setWallet] = useState("");
  const [walletTouched, setWalletTouched] = useState(false);

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
  const amountValid = Number.isFinite(parsedAmount) && parsedAmount > 0;
  const amountLabel = amountValid
    ? `$${parsedAmount.toLocaleString("en-US")}`
    : "your amount";

  const feeEstimate = amountValid
    ? `~$${(parsedAmount * 0.015).toFixed(2)}`
    : "—";
  const totalEstimate = amountValid
    ? `~$${(parsedAmount * 1.015).toFixed(2)}`
    : "—";

  const trimmedWallet = wallet.trim();
  const walletStatus = !trimmedWallet
    ? "empty"
    : activeNetwork?.pattern.test(trimmedWallet)
      ? "valid"
      : "invalid";

  return (
    <form
      action="https://omnipay.cc/auth/register"
      method="get"
      className="rounded-2xl border border-white/15 bg-white/5 p-8 backdrop-blur"
    >
      <p className="text-sm font-medium uppercase tracking-[0.14em] text-sky-200/80">
        Card on-ramp
      </p>
      <p className="mt-3 text-xl font-semibold">
        Fiat in. Crypto out — to your address.
      </p>
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
          onChange={(event) => setWallet(event.target.value)}
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
                onClick={() => setAmount(String(preset))}
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
          min="10"
          step="1"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="50"
          className="mt-3 w-full rounded-xl border border-white/20 bg-[#071222]/70 px-4 py-3 text-base text-white placeholder:text-sky-200/40 outline-none transition focus:border-sky-300/60"
        />
      </fieldset>
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
          Est. network + processing {feeEstimate} · card total {totalEstimate} ·
          ETA under 1 min after payment. Final quote locks in checkout.
        </p>
      </div>
      <p className="mt-3 text-xs leading-5 text-sky-100/65">
        Pay with Visa, Mastercard, Amex, or debit — Stripe Crypto Onramp.
      </p>
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
