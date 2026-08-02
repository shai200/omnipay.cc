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
          <nav className="flex items-center gap-3">
            <a
              href="#reminders"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-sky-100/90 transition-colors hover:text-white sm:inline"
            >
              Reminders
            </a>
            <a
              href="https://omnipay.cc/auth/login"
              className="rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/20"
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

      <section className="relative z-10 border-t border-[var(--line)] bg-[#0b1b33] py-20 text-white">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center md:px-10">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight md:text-4xl">
              Buy crypto, sent directly to your wallet
            </h2>
            <p className="mt-4 text-lg leading-8 text-sky-100/85">
              Use any credit or debit card. Keep full control — crypto goes
              straight to your wallet, not a custodial middleman.
            </p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-8 backdrop-blur">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-sky-200/80">
              Card on-ramp
            </p>
            <p className="mt-3 text-xl font-semibold">
              Fiat in. Crypto out — to your address.
            </p>
            <p className="mt-3 text-base leading-7 text-sky-100/80">
              Live Stripe Crypto Onramp wiring needs App Hosting / API keys
              (Founder GO). Until then, start on the production auth flow.
            </p>
            <a
              href="https://omnipay.cc/auth/register"
              className="mt-6 inline-flex rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-deep)]"
            >
              Continue on Omnipay.cc
            </a>
          </div>
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
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a
              href="https://omnipay.cc/reminders"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[var(--accent-deep)]"
            >
              Set up your reminders
            </a>
            <p className="text-sm text-[var(--muted)]">
              Sign in on Omnipay.cc to customize alerts.
            </p>
          </div>
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

      <footer className="border-t border-[var(--line)] bg-white py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 text-sm text-[var(--muted)] md:flex-row md:items-center md:justify-between md:px-10">
          <p>© {new Date().getFullYear()} Omnipay.cc · Your secure gateway to cryptocurrency</p>
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
      </footer>
    </div>
  );
}
