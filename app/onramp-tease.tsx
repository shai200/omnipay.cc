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
  { id: "bitcoin", label: "Bitcoin", assets: ["btc"] },
  { id: "ethereum", label: "Ethereum", assets: ["eth", "usdc"] },
  { id: "solana", label: "Solana", assets: ["sol"] },
] as const;

export function OnrampTease() {
  const [amount, setAmount] = useState("50");
  const [asset, setAsset] = useState<(typeof assets)[number]["id"]>("btc");

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
  const amountLabel =
    Number.isFinite(parsedAmount) && parsedAmount > 0
      ? `$${parsedAmount.toLocaleString("en-US")}`
      : "your amount";

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
                onClick={() => setNetwork(option.id)}
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
          placeholder="0x… or your chain address"
          className="mt-2 w-full rounded-xl border border-white/20 bg-[#071222]/70 px-4 py-3 text-base text-white placeholder:text-sky-200/40 outline-none transition focus:border-sky-300/60"
        />
      </label>
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
      <p className="mt-4 rounded-xl border border-sky-300/25 bg-sky-400/10 px-4 py-3 text-sm leading-6 text-sky-50">
        Order preview: {amountLabel} → {selectedAsset.label} on{" "}
        {activeNetwork?.label ?? selectedAsset.network}. Final quote locks in
        checkout.
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
