import { OnrampTease } from "./onramp-tease";
import { ReminderTease } from "./reminder-tease";

const features = [
  {
    title: "Your wallet, your control",
    body: "Crypto goes straight to your personal wallet — no custody middlemen. Pay with any credit or debit card.",
  },
  {
    title: "Accumulate over time",
    body: "Small, regular buys reduce timing risk. Build a position steadily instead of chasing one perfect entry.",
  },
  {
    title: "Discipline that compounds",
    body: "Most investors buy once and forget. Recurring reminders keep you accumulating when markets are loud and when life gets busy.",
  },
] as const;

const reminderPoints = [
  {
    title: "Schedule recurring reminders",
    body: "Weekly, bi-weekly, or monthly alerts — accumulate at your own pace.",
  },
  {
    title: "Get crypto drop alerts",
    body: "Notifications after major price drops so you can act when the market is giving specials.",
  },
  {
    title: "Prioritize these emails",
    body: "Mark reminder mail as important so a busy week never breaks the habit.",
  },
] as const;

const onrampSteps = [
  { label: "Card", detail: "Any credit or debit card" },
  { label: "Wallet", detail: "Your address, not ours" },
  { label: "Crypto", detail: "Arrives in minutes" },
] as const;

const trustSignals = [
  { value: "100%", label: "Secure" },
  { value: "24/7", label: "Available" },
  { value: "<1min", label: "Processing" },
  { value: "0", label: "Fraud verified" },
] as const;

const faqItems = [
  {
    q: "Where does the crypto go?",
    a: "Straight to the wallet address you provide — Omnipay does not custody your assets after the buy settles.",
  },
  {
    q: "What cards work?",
    a: "Visa, Mastercard, Amex, and debit via Stripe Crypto Onramp. Final availability depends on your bank and region.",
  },
  {
    q: "What networks are supported?",
    a: "Bitcoin, Ethereum, and Solana for native assets — plus USDC on Ethereum or Solana. Checkout confirms the final route.",
  },
  {
    q: "What fees should I expect?",
    a: "Preview shows an estimate (~1.5% network + processing tease). Live checkout locks the Stripe quote before you pay.",
  },
  {
    q: "Are reminder emails required?",
    a: "No. Reminders are optional discipline tools — weekly, bi-weekly, or monthly, with preferred send windows and optional drop alerts.",
  },
] as const;

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <section className="relative isolate min-h-screen overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(125deg,#071222_0%,#0d2748_42%,#0670d2_100%)]"
        />
        <div
          aria-hidden
          className="hero-orb absolute -left-24 top-10 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.35),transparent_68%)] blur-2xl"
        />
        <div
          aria-hidden
          className="hero-orb absolute -right-16 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(6,112,210,0.55),transparent_70%)] blur-xl"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-200/70 to-transparent hero-scan"
        />

        <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 md:px-10">
          <a href="/" className="flex items-center gap-3 text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-lg font-bold backdrop-blur">
              Ω
            </span>
            <span className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
              Omnipay.cc
            </span>
          </a>
          <nav
            aria-label="Primary"
            className="flex flex-wrap items-center justify-end gap-1 sm:gap-3"
          >
            <a
              href="#onramp"
              className="rounded-lg px-2.5 py-2 text-sm font-medium text-sky-100/90 transition-colors hover:text-white sm:px-3"
            >
              Buy crypto
            </a>
            <a
              href="#reminders"
              className="rounded-lg px-2.5 py-2 text-sm font-medium text-sky-100/90 transition-colors hover:text-white sm:px-3"
            >
              Reminders
            </a>
            <a
              href="#faq"
              className="hidden rounded-lg px-2.5 py-2 text-sm font-medium text-sky-100/90 transition-colors hover:text-white sm:inline-block sm:px-3"
            >
              FAQ
            </a>
            <a
              href="https://omnipay.cc/auth/register"
              className="rounded-lg px-2.5 py-2 text-sm font-medium text-sky-100/90 transition-colors hover:text-white sm:px-3"
            >
              Register
            </a>
            <a
              href="https://omnipay.cc/auth/login"
              className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/20 sm:px-4 sm:py-2.5"
            >
              Sign in
            </a>
          </nav>
        </header>

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5.5rem)] w-full max-w-6xl flex-col justify-center px-6 pb-20 pt-8 md:px-10">
          <p className="animate-rise font-[family-name:var(--font-display)] text-5xl font-semibold tracking-tight text-white sm:text-6xl md:text-7xl">
            Omnipay.cc
          </p>
          <h1 className="animate-rise-delay mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            Build wealth with recurring crypto buys
          </h1>
          <p className="animate-rise-late mt-6 max-w-2xl text-lg leading-8 text-sky-100/90">
            Buy crypto regularly with any credit or debit card — sent directly
            to your wallet. Smart reminders turn small, consistent purchases
            into lasting wealth.
          </p>
          <div className="animate-rise-late mt-10 flex flex-wrap gap-3">
            <a
              href="https://omnipay.cc/auth/register"
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-[#0b1b33] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Start buying
            </a>
            <a
              href="#reminders"
              className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              Set reminders
            </a>
          </div>
        </div>
      </section>

      <section
        id="onramp"
        className="relative z-10 border-t border-[var(--line)] bg-[#0b1b33] py-20 text-white"
      >
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 md:grid-cols-2 md:items-center md:px-10">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight md:text-4xl">
              Buy crypto, sent directly to your wallet
            </h2>
            <p className="mt-4 text-lg leading-8 text-sky-100/85">
              Use any credit or debit card. Keep full control — crypto goes
              straight to your wallet, not a custodial middleman.
            </p>
            <ol className="mt-8 space-y-4">
              {onrampSteps.map((step, index) => (
                <li key={step.label} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-sky-100">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{step.label}</p>
                    <p className="text-sm text-sky-100/75">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <OnrampTease />
        </div>
      </section>

      <section
        id="reminders"
        className="relative z-10 border-t border-[var(--line)] bg-white/80 py-20 backdrop-blur-sm"
      >
        <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
            Never forget to accumulate again
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            The secret isn&apos;t buying once — it&apos;s buying consistently.
            Set up smart reminders so discipline survives busy weeks.
          </p>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {reminderPoints.map((point) => (
              <article key={point.title} className="max-w-sm">
                <h3 className="text-xl font-semibold text-[var(--foreground)]">
                  {point.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-[var(--muted)]">
                  {point.body}
                </p>
              </article>
            ))}
          </div>
          <ReminderTease />
        </div>
      </section>

      <section
        id="how"
        className="relative z-10 border-t border-[var(--line)] bg-[#f7f9fc] py-20"
      >
        <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
            The smart way to build crypto wealth
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Omnipay is built around recurring buys and reminders — so you keep
            accumulating when markets are loud and when life gets busy.
          </p>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="max-w-sm">
                <h3 className="text-xl font-semibold text-[var(--foreground)]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-[var(--muted)]">
                  {feature.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="relative z-10 border-t border-[var(--line)] bg-white py-20"
        aria-label="Frequently asked questions"
      >
        <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--foreground)] md:text-4xl">
            Questions before your first buy
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Short answers for custody, cards, and reminders — full detail lives
            on Omnipay.cc after you sign in.
          </p>
          <dl className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {faqItems.map((item) => (
              <div key={item.q} className="max-w-sm">
                <dt className="text-lg font-semibold text-[var(--foreground)]">
                  {item.q}
                </dt>
                <dd className="mt-3 text-base leading-7 text-[var(--muted)]">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        id="trust"
        className="relative z-10 border-t border-[var(--line)] bg-[#0b1b33] py-16 text-white"
        aria-label="Trust signals"
      >
        <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
          <p className="text-center text-sm font-medium uppercase tracking-[0.16em] text-sky-200/75">
            Trusted by thousands
          </p>
          <dl className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
            {trustSignals.map((signal) => (
              <div key={signal.label} className="text-center">
                <dt className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  {signal.value}
                </dt>
                <dd className="mt-2 text-sm text-sky-100/75">{signal.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        id="start"
        className="relative z-10 border-t border-[var(--line)] bg-[linear-gradient(120deg,#0670d2_0%,#034f97_100%)] py-16 text-white"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-6 md:flex-row md:items-center md:justify-between md:px-10">
          <div className="max-w-xl">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight md:text-4xl">
              Ready to accumulate?
            </h2>
            <p className="mt-3 text-lg leading-8 text-sky-100/90">
              Open an account, set a reminder cadence, and send your next buy
              straight to your wallet.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://omnipay.cc/auth/register"
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-[#0b1b33] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Create account
            </a>
            <a
              href="#onramp"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              Try the on-ramp
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--line)] bg-white py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 text-sm text-[var(--muted)] md:px-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-[family-name:var(--font-display)] text-base font-semibold text-[var(--foreground)]">
                Omnipay.cc
              </p>
              <p className="mt-1">Your secure gateway to cryptocurrency</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://omnipay.cc/PrivacyPolicy"
                className="hover:text-[var(--foreground)]"
              >
                Privacy
              </a>
              <a
                href="https://omnipay.cc/TermsOfService"
                className="hover:text-[var(--foreground)]"
              >
                Terms
              </a>
              <a
                href="https://omnipay.cc/BusinessInfo"
                className="hover:text-[var(--foreground)]"
              >
                Business info
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-2 border-t border-[var(--line)] pt-6 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} Omnipay.cc. All rights reserved.</p>
            <p className="text-xs md:text-sm">
              Bank-grade encryption · Verified by Stripe · PCI-DSS compliant
            </p>
          </div>
          <p className="text-xs text-[var(--muted)]">
            Latest release: February 5, 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
