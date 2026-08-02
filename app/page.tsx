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
    q: "How fresh is the preview quote?",
    a: "Tease quotes soft-expire after ~45 seconds with a visible countdown. Refresh quote to renew — the locked Stripe price still happens only at checkout.",
  },
  {
    q: "Are reminder emails required?",
    a: "No. Reminders are optional discipline tools — weekly, bi-weekly, or monthly, with preferred send windows, timezone, and optional drop-alert thresholds.",
  },
  {
    q: "What is max slippage?",
    a: "Preview lets you set a 0.5% / 1% / 2% min-receive floor against the tease quote. If refresh wobble drops below that floor, refresh again or widen slippage — live Stripe still locks at checkout.",
  },
  {
    q: "Can I schedule recurring buys from the preview?",
    a: "Choose Once, Weekly, or Monthly on the on-ramp tease. Recurring settlement and reminder wiring finish after sign-in on Omnipay.cc.",
  },
  {
    q: "What is network speed?",
    a: "Standard (~60s, ~1.5% tease fee) or Priority (~15s, ~2.2% tease fee). Preview only — live Stripe settlement timing still depends on chain and bank.",
  },
  {
    q: "Why accept a risk disclosure?",
    a: "Preview quotes are soft teases, not locked prices. Accepting the disclosure is required before Continue — real risk language and terms still live on Omnipay.cc checkout.",
  },
  {
    q: "Does billing country change cards?",
    a: "Yes in preview — US shows Visa/MC/Amex/debit; UK/EU/CA/Other narrow the tease set. Live Stripe still confirms bank and region availability at checkout.",
  },
  {
    q: "Do promo codes work on preview?",
    a: "Try OMNI10 (10% off fees) or ACCUMULATE (5% off fees) as teases. Invalid codes soft-block Continue until fixed or cleared — live coupons redeem only on Omnipay.cc.",
  },
  {
    q: "Why accept Terms of Service?",
    a: "Preview requires a ToS soft-gate before Continue. The binding Omnipay.cc Terms still apply at live checkout — this checkbox is not a substitute for signing in.",
  },
  {
    q: "Why ask source of funds?",
    a: "Preview lets you pick Salary, Savings, Business, or Other as a compliance tease. Live Omnipay.cc KYC may ask again — this picker does not replace identity verification.",
  },
  {
    q: "Why confirm age 18+?",
    a: "Preview soft-gates Continue behind an 18+ confirmation. Live Omnipay.cc still enforces eligibility and regional rules at checkout.",
  },
  {
    q: "What is the preview order ref?",
    a: "Each preview session mints an OMN-###### reference on the order summary. Use Copy ref to clipboard, then cite it if you continue into Omnipay.cc support — it is not a live Stripe payment id.",
  },
  {
    q: "Why ask purchase purpose?",
    a: "Preview lets you pick Invest, Spend, Remit, or Gift as a compliance tease. Live Omnipay.cc may collect purpose again — this picker does not replace KYC.",
  },
  {
    q: "Why confirm the receipt email?",
    a: "When you enter a receipt email, preview requires a matching confirmation before Continue. Clear both fields to skip receipts in the tease.",
  },
  {
    q: "Can I buy in EUR or GBP?",
    a: "Preview lets you pick USD, EUR, or GBP with a tease FX rate. Amounts convert to a USD-equivalent for crypto estimates — live Stripe still settles in your card’s billing currency at checkout.",
  },
  {
    q: "Why accept the Privacy Policy?",
    a: "Preview soft-gates Continue behind a Privacy Policy checkbox (alongside Terms). The binding Omnipay.cc Privacy Policy still applies at live checkout — this checkbox is not a substitute for signing in.",
  },
  {
    q: "What does Share summary do?",
    a: "Copies a one-line order preview (ref, amount, asset, network, cadence, fees) to your clipboard so you can paste it into notes or support — tease only, not a live payment receipt.",
  },
  {
    q: "Why ask tax residency?",
    a: "Preview lets you pick US person, Non-US, or Prefer not as a compliance tease. Live Omnipay.cc may collect W-9 / CRS forms at KYC — this picker does not replace tax forms.",
  },
  {
    q: "Why acknowledge self-custody?",
    a: "Preview soft-gates Continue behind a self-custody acknowledgment: after settle, crypto is in your wallet, not Omnipay custody. Wrong-address risk remains yours — confirm destination carefully.",
  },
  {
    q: "What does Reset preview do?",
    a: "Clears the on-ramp tease back to defaults (amount, wallet, soft-gates, promo, SMS, quote jitter) so you can start a clean preview session. The order ref stays for the page load. Saved drafts are left alone until you Clear draft.",
  },
  {
    q: "Can I get SMS settlement alerts?",
    a: "Preview accepts an optional E.164 phone (e.g. +15551234567) for settlement SMS teases. Invalid numbers soft-block Continue until fixed or cleared — live Twilio/Stripe SMS wiring finishes on Omnipay.cc.",
  },
  {
    q: "What is the expected arrival window?",
    a: "Preview shows a clock window from the tease quote time based on Standard (~45–90s) or Priority (~10–30s) network speed. Live chain settlement still varies — this is not a locked Stripe ETA.",
  },
  {
    q: "Can I save a preview draft?",
    a: "Yes — Save draft stores the on-ramp tease in this browser’s localStorage (wallet + form fields). Restore draft reloads it after refresh; Clear draft removes it. Drafts never leave your browser and are not live Stripe orders.",
  },
  {
    q: "What is Autosave?",
    a: "Optional preview toggle that debounces localStorage writes (~800ms) as you edit. Preference sticks in this browser. Autosave never uploads to Omnipay servers — turn it off anytime and use Save draft manually.",
  },
  {
    q: "Can I download the order summary?",
    a: "Yes — Download summary saves a plain-text .txt (OMN-######-preview.txt) with the tease line. Share summary still copies to clipboard. Neither is a live Stripe receipt.",
  },
  {
    q: "Can I export or import a draft?",
    a: "Yes — Export draft downloads a preview draft v1 .json you can move between browsers. Import draft validates the file, applies fields, and optionally writes localStorage. Export/import never hits Omnipay servers.",
  },
  {
    q: "Can I share a draft link?",
    a: "Yes — Copy draft link puts a preview-only URL hash (#omn-draft=…) on your clipboard. Opening that link restores the tease client-side. The hash never uploads to Omnipay servers; Clear draft removes it from the address bar.",
  },
  {
    q: "Can I paste a draft link?",
    a: "Yes — Paste draft link reads the clipboard (or the paste field) for a #omn-draft= URL/token and restores the tease client-side. If clipboard access is blocked, paste into the field next to the button. Same preview-only hash — never uploaded to Omnipay servers.",
  },
  {
    q: "What is draft FP / Verify draft link?",
    a: "Draft FP is a short client-side fingerprint of the tease fields (ignores savedAt). Verify draft link compares a #omn-draft= URL to the current form without applying it — match means the link equals this tease; mismatch means Paste would change fields. Fingerprints never leave your browser.",
  },
  {
    q: "Can I Diff a draft link?",
    a: "Yes — Diff draft link (or Verify on mismatch) lists which tease fields differ between the form and a #omn-draft= URL without applying it. Paste draft link still applies the link. Diffs stay in your browser.",
  },
  {
    q: "What is Pin draft / Swap pin?",
    a: "Pin draft stashes the current tease in a second localStorage slot (independent of Save draft). Swap pin exchanges the form with the pin so you can A/B two configurations. Clear pin removes only the pin — drafts and #omn-draft= hashes stay until you Clear draft.",
  },
  {
    q: "What is Apply pin / Diff vs pin?",
    a: "Apply pin loads the pinned tease into the form without changing the pin slot (unlike Swap pin). Diff vs pin lists which fields differ between the form and the pin without applying anything. Both stay in your browser — never uploaded to Omnipay servers.",
  },
  {
    q: "What is Copy pin link / Export pin?",
    a: "Copy pin link puts the pinned tease on the clipboard as a #omn-draft= URL (same format as Copy draft link) without changing the form or pin slot. Export pin downloads the pin as .json for Import pin elsewhere. Neither uploads to Omnipay servers.",
  },
  {
    q: "What is Paste pin link / Import pin?",
    a: "Paste pin link reads a #omn-draft= URL (clipboard or paste field) into the pin slot only — form and Save draft stay unchanged. Import pin loads Export pin / Export draft .json into the pin slot the same way. Use Apply pin to load the pin into the form. Nothing uploads to Omnipay servers.",
  },
  {
    q: "What is Verify pin link / Diff pin link?",
    a: "Verify pin link compares a #omn-draft= URL to the pin slot without writing anything — match means the link equals the pin; mismatch means Paste pin link would change the pin. Diff pin link lists which fields differ (pin → link). Form and Save draft stay untouched. Fingerprints never leave your browser.",
  },
  {
    q: "What is Pin from draft / Draft from pin?",
    a: "Pin from draft copies the Save draft localStorage slot into the pin slot without changing the form. Draft from pin copies the pin into Save draft (refreshes savedAt) without changing the form or pin. Use Apply pin / Restore draft to load into the form. Nothing uploads to Omnipay servers.",
  },
  {
    q: "What is Swap draft ↔ pin?",
    a: "Swap draft ↔ pin exchanges the Save draft and pin localStorage slots without touching the form. After the swap, Restore draft / Apply pin load the exchanged values. Fingerprints stay in your browser — nothing uploads to Omnipay servers.",
  },
  {
    q: "What is Verify form vs draft / Diff form vs draft?",
    a: "Verify form vs draft compares the live form to the Save draft slot without writing anything — match means Restore draft would change nothing; mismatch means the form diverged from the saved draft. Diff form vs draft lists which fields differ (form → draft). Pin slot stays untouched. Fingerprints never leave your browser.",
  },
  {
    q: "What is Verify form vs pin / Diff form vs pin?",
    a: "Verify form vs pin compares the live form to the pin slot without writing anything — match means Apply pin would change nothing; mismatch means the form diverged from the pin. Diff form vs pin lists which fields differ (form → pin). Save draft stays untouched. Fingerprints never leave your browser.",
  },
  {
    q: "What is Swap form ↔ draft?",
    a: "Swap form ↔ draft exchanges the live form with the Save draft localStorage slot without touching the pin. After the swap, Restore draft loads the previous form values; the form shows what was saved. Fingerprints stay in your browser — nothing uploads to Omnipay servers.",
  },
  {
    q: "What is Verify draft vs link / Diff draft vs link?",
    a: "Verify draft vs link compares a #omn-draft= URL to the Save draft localStorage slot without writing anything — match means the link equals the saved draft; mismatch means Paste draft link would diverge from Save draft (form stays untouched). Diff draft vs link lists which fields differ (draft → link). Pin slot stays untouched. Fingerprints never leave your browser.",
  },
  {
    q: "What is Copy Save draft link / Export Save draft?",
    a: "Copy Save draft link puts the Save draft localStorage slot on the clipboard as a #omn-draft= URL without changing the form or pin (unlike Copy draft link, which encodes the live form). Export Save draft downloads that same slot as .json. Use Verify draft vs link to confirm a shared URL matches Save draft. Nothing uploads to Omnipay servers.",
  },
  {
    q: "What is Paste Save draft link / Import Save draft?",
    a: "Paste Save draft link writes a #omn-draft= URL into the Save draft localStorage slot only — form and pin stay untouched (unlike Paste draft link, which also applies to the form). Import Save draft loads Export Save draft / Export draft .json into that same slot. Restore draft still loads into the form. Fingerprints never leave your browser.",
  },
  {
    q: "What is Verify draft vs pin / Diff draft vs pin?",
    a: "Verify draft vs pin compares the Save draft slot to the pin slot without writing anything — match means the two slots are equal; mismatch means Pin from draft or Draft from pin would change a slot. Diff draft vs pin lists which fields differ (draft → pin). The form stays untouched. Fingerprints never leave your browser.",
  },
  {
    q: "What is Save reminder / Restore reminder?",
    a: "Save reminder stores your reminder tease prefs (cadence, send window, timezone, email, drop alerts) in this browser only. Restore reminder reloads them; Clear reminder removes the slot. Nothing uploads to Omnipay servers — live schedules still confirm after sign-in on Omnipay.cc.",
  },
  {
    q: "What is Copy reminder link / Export reminder?",
    a: "Copy reminder link puts the Save reminder localStorage slot on the clipboard as a #omn-reminder= URL without changing the form. Export reminder downloads that same slot as .json. Share or move prefs across browsers client-side only — nothing uploads to Omnipay servers; live schedules still confirm after sign-in on Omnipay.cc.",
  },
  {
    q: "What is Paste reminder link / Import reminder?",
    a: "Paste reminder link writes a #omn-reminder= URL into the Save reminder localStorage slot only — the form stays untouched. Import reminder loads Export reminder .json into that same slot. Restore reminder still loads into the form. Nothing uploads to Omnipay servers; live schedules still confirm after sign-in on Omnipay.cc.",
  },
  {
    q: "What is Verify reminder vs link / Diff reminder vs link?",
    a: "Verify reminder vs link compares a #omn-reminder= URL to the Save reminder localStorage slot without writing anything — match means the link equals the saved prefs; mismatch means Paste reminder link would change the slot (form stays untouched). Diff reminder vs link lists which fields differ (slot → link). Fingerprints never leave your browser.",
  },
  {
    q: "What is Verify reminder vs form / Diff reminder vs form?",
    a: "Verify reminder vs form compares the live reminder form to the Save reminder localStorage slot without writing anything — match means Restore reminder would change nothing; mismatch means the form diverged from the saved prefs. Diff reminder vs form lists which fields differ (form → slot). Fingerprints never leave your browser.",
  },
  {
    q: "What is Swap reminder ↔ form?",
    a: "Swap reminder ↔ form exchanges the live reminder form with the Save reminder localStorage slot — the previous form is written into the slot (fresh savedAt) and the prior slot loads into the form. Completes the reminder save/restore/verify/diff loop for preview hygiene. Nothing uploads to Omnipay servers; live schedules still confirm after sign-in on Omnipay.cc.",
  },
  {
    q: "What is Clear form / Reminder FP?",
    a: "Clear form resets the live reminder form to defaults without touching the Save reminder slot — useful after Swap reminder ↔ form when you want a blank form but keep the swapped prefs. When the form differs from defaults, Clear form arms a Confirm reset to defaults step (second click applies). Reminder FP chips show Form FP, Defaults FP, and Slot FP (ignores savedAt). Copy form FP / Copy defaults FP / Copy Slot FP / Copy Defaults↔Slot pair / Copy Form↔Defaults pair put fingerprints on the clipboard. Compare Defaults FP ↔ Slot FP / Verify defaults vs slot report whether saved prefs equal Clear form targets. Apply defaults to slot / Reset slot to defaults write Clear form defaults into the slot; Export defaults downloads Clear form targets as JSON; Paste/Import defaults apply that JSON to the form only (slot untouched). Fingerprints never leave your browser.",
  },
  {
    q: "What is Defaults FP / Confirm reset to defaults?",
    a: "Defaults FP is the stable fingerprint of Clear form targets (weekly / morning / drop alerts on / ≥10 / local / empty email). Confirm reset to defaults is the armed Clear form state when the live form diverged — first click arms a 4s countdown on the button and Auto-disarm banner, second click applies defaults before expiry; if Form FP already equals Defaults FP, Clear form is a no-op. Cancel reset (or editing the form while armed) disarms without applying. Save reminder slot stays untouched. Fingerprints never leave your browser.",
  },
  {
    q: "What is Compare Form FP ↔ Defaults FP / Cancel reset?",
    a: "Form FP and Defaults FP chips highlight green when they match and amber when they diverge (Form FP shows = or ≠). Compare Form FP ↔ Defaults FP reports the match without writing; Cancel reset disarms Confirm reset to defaults without applying Clear form. Slot stays untouched. Fingerprints never leave your browser.",
  },
  {
    q: "What is Compare Form FP ↔ Slot FP / Arm countdown?",
    a: "Slot FP chip highlights green (=) when it matches Form FP and amber (≠) when it diverges. Compare Form FP ↔ Slot FP reports the match without writing and surfaces Diff lines on diverge. Arm countdown is the visible 4s timer on Confirm reset to defaults while Clear form is armed — expires back to Clear form if you do not confirm. Fingerprints never leave your browser.",
  },
  {
    q: "What is Copy Slot FP / Auto-disarm banner?",
    a: "Copy Slot FP puts the Save reminder Slot FP on the clipboard (form untouched) so you can cite it across browsers. Auto-disarm banner appears while Confirm reset is armed, shows the live countdown, and auto-disarms with no apply when the timer expires — Cancel reset or editing the form also disarms. Fingerprints never leave your browser.",
  },
  {
    q: "What is Compare Defaults FP ↔ Slot FP?",
    a: "Defaults FP chip highlights green (=) when it matches Slot FP and amber (≠) when it diverges (only when a Save reminder slot exists). Compare Defaults FP ↔ Slot FP reports the match without writing and surfaces Diff lines on diverge — useful to see whether saved prefs equal Clear form targets. Form stays untouched. Fingerprints never leave your browser.",
  },
  {
    q: "What is Verify defaults vs slot / Diff defaults vs slot?",
    a: "Verify defaults vs slot compares Clear form defaults to the Save reminder localStorage slot without writing anything — match means saved prefs equal Clear form targets; mismatch means the slot diverged from defaults. Diff defaults vs slot lists which fields differ (defaults → slot). Live form stays untouched. Fingerprints never leave your browser.",
  },
  {
    q: "What is Apply defaults to slot / Reset slot to defaults?",
    a: "Apply defaults to slot writes Clear form defaults into the Save reminder localStorage slot (creates the slot if missing) without touching the live form. Reset slot to defaults requires an existing slot — if Slot FP already equals Defaults FP it is a no-op; otherwise it overwrites the slot with Clear form defaults. Use Verify/Diff defaults vs slot first to inspect. Fingerprints never leave your browser.",
  },
  {
    q: "What is Copy Defaults↔Slot pair / Export defaults?",
    a: "Copy Defaults↔Slot pair puts a Defaults FP ↔ Slot FP citation (with = or ≠) on the clipboard so you can cite Clear form targets vs Save reminder across browsers — form untouched. Export defaults downloads Clear form defaults as omnipay-reminder-defaults.json (distinct from Export reminder, which dumps the slot) — form and slot untouched. Paste/Import defaults apply that JSON to the live form only; Import reminder can restore it into the slot. Fingerprints never leave your browser.",
  },
  {
    q: "What is Copy Form↔Defaults pair / Paste defaults / Import defaults?",
    a: "Copy Form↔Defaults pair puts a Form FP ↔ Defaults FP citation (with = or ≠) on the clipboard so you can cite the live form vs Clear form targets — slot untouched. Paste defaults reads Export defaults JSON (or #omn-reminder=) from the clipboard/field and applies it to the live form only. Import defaults loads the same .json via file picker into the form only — distinct from Paste reminder link / Import reminder, which write the Save reminder slot. Fingerprints never leave your browser.",
  },
  {
    q: "What is Verify form vs defaults / Diff form vs defaults?",
    a: "Verify form vs defaults compares the live reminder form to Clear form defaults without writing anything — match means Clear form would change nothing; mismatch means the form diverged from defaults. Diff form vs defaults lists which fields differ (form → defaults). Save reminder slot stays untouched. Fingerprints never leave your browser.",
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
