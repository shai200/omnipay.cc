import Link from 'next/link';
import { BuyPanel } from './components/BuyPanel';
import { PageShell } from './components/PageShell';
import { Badge } from './components/ui/Badge';
import { ButtonLink } from './components/ui/Button';
import { Container, SectionHeading } from './components/ui/Container';
import {
  IconArrowRight,
  IconBell,
  IconCalendar,
  IconCard,
  IconCheck,
  IconChevronDown,
  IconKey,
  IconLock,
  IconMessage,
  IconShield,
  IconTrendDown,
  IconUser,
  IconWallet,
} from './components/ui/icons';

const STEPS = [
  {
    icon: IconUser,
    title: 'Create your account',
    body: 'Sign up with email or Google. Add your name, date of birth and address once so checkout can prefill them. You must be 18 or older.',
  },
  {
    icon: IconWallet,
    title: 'Add your wallet',
    body: 'Save the Bitcoin address you control. Your crypto is sent there directly — OmniPurchase never holds it.',
  },
  {
    icon: IconCard,
    title: 'Pay with your card',
    body: 'Choose an amount and pay in Stripe’s secure checkout. Stripe handles identity verification, payment and delivery.',
  },
];

const TRUST = [
  {
    icon: IconShield,
    title: 'Payments and verification by Stripe',
    body: 'Card payments, identity checks (KYC) and anti-money-laundering checks run inside Stripe’s Crypto Onramp. We never see or store your card details or ID documents.',
  },
  {
    icon: IconKey,
    title: 'Self-custody by default',
    body: 'Purchases go straight to the wallet address you choose. We don’t hold crypto or fiat funds for you.',
  },
  {
    icon: IconLock,
    title: 'Account protection',
    body: 'Passwords are stored as salted bcrypt hashes, sessions use secure HTTP-only cookies, and sign-in attempts are rate limited.',
  },
  {
    icon: IconCheck,
    title: 'Verified purchase status',
    body: 'A purchase is only marked complete when Stripe sends a cryptographically signed confirmation — never from the browser.',
  },
];

type RoadmapItem = {
  icon: typeof IconBell;
  title: string;
  body: string;
  status: { label: string; tone: 'success' | 'brand' | 'neutral' };
};

const ROADMAP: RoadmapItem[] = [
  {
    icon: IconCalendar,
    title: 'Purchase reminders',
    body: 'A friendly weekly or monthly email nudge, on a schedule you choose. Turn it off any time.',
    status: { label: 'Available', tone: 'success' },
  },
  {
    icon: IconTrendDown,
    title: 'Free Bitcoin price-drop alerts',
    body: 'Opt in to an email when Bitcoin’s price falls sharply. Free, informational, and never a recommendation to buy.',
    status: { label: 'Opt in now · rolling out', tone: 'brand' },
  },
  {
    icon: IconMessage,
    title: 'SMS & WhatsApp alerts',
    body: 'Get your reminders and price alerts where you already read messages.',
    status: { label: 'Coming soon', tone: 'neutral' },
  },
  {
    icon: IconBell,
    title: 'Monthly Bitcoin savings plan',
    body: 'We’re exploring a simple way to plan a monthly Bitcoin purchase. Not available today — every purchase is a one-time purchase you confirm yourself.',
    status: { label: 'Planned', tone: 'neutral' },
  },
];

const FAQ: { q: string; a: React.ReactNode }[] = [
  {
    q: 'What is OmniPurchase?',
    a: 'OmniPurchase is a simple way to buy Bitcoin with a credit or debit card and have it sent straight to your own wallet. It is a product of OmniPay.cc and uses Stripe’s Crypto Onramp for checkout.',
  },
  {
    q: 'Does OmniPurchase hold my crypto or money?',
    a: 'No. Your purchase is delivered to the wallet address you provide. We don’t operate as a bank, exchange or custodian, and we don’t hold your crypto or fiat funds.',
  },
  {
    q: 'Who verifies my identity?',
    a: 'Stripe. Stripe may ask for identification before a purchase. All verification is handled directly by Stripe; we don’t receive or keep your identity documents or card details.',
  },
  {
    q: 'What does it cost?',
    a: 'Transaction fees are set by Stripe and shown to you in checkout before you confirm. Review the final amount and fees before paying.',
  },
  {
    q: 'Who can use it?',
    a: (
      <>
        You must be at least 18 and a resident of a supported region. The full list of supported and prohibited
        jurisdictions is in our{' '}
        <Link href="/TermsOfService" className="font-medium text-brand underline underline-offset-4">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/BusinessInfo" className="font-medium text-brand underline underline-offset-4">
          Business Info
        </Link>
        .
      </>
    ),
  },
  {
    q: 'Can I cancel or refund a purchase?',
    a: (
      <>
        Crypto purchases are final once delivered on-chain, so double-check your wallet address before you pay. See the
        refund and dispute policy in{' '}
        <Link href="/BusinessInfo" className="font-medium text-brand underline underline-offset-4">
          Business Info
        </Link>
        .
      </>
    ),
  },
  {
    q: 'Is this financial advice?',
    a: 'No. OmniPurchase doesn’t give financial, investment or tax advice, and reminders or price alerts are not recommendations. Crypto prices can go down as well as up.',
  },
];

export default function Home() {
  return (
    <PageShell>
      {/* Hero */}
      <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
        <div aria-hidden className="hero-backdrop absolute inset-0 -z-10" />
        <div aria-hidden className="hero-grid absolute inset-0 -z-10" />
        <Container className="grid items-start gap-12 pb-20 pt-12 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-28 lg:pt-24">
          <div className="animate-fade-up lg:pt-8">
            <Badge tone="brand" className="mb-6">
              <IconShield size={14} /> Checkout powered by Stripe
            </Badge>
            <h1
              id="hero-title"
              className="text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.035em] text-fg text-balance sm:text-5xl lg:text-[3.75rem]"
            >
              Buy Bitcoin with your card.{' '}
              <span className="text-gradient">
                Straight to your wallet.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted text-pretty">
              OmniPurchase makes buying Bitcoin simple: save your details once, pay with any credit or debit card, and
              receive it in the wallet you control. Optional reminders help you stick to your own plan.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#buy" size="lg" trailingIcon={<IconArrowRight size={18} />}>
                Buy Bitcoin
              </ButtonLink>
              <ButtonLink href="#how-it-works" size="lg" variant="outline">
                How it works
              </ButtonLink>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-fg-muted" aria-label="Highlights">
              {['Self-custody wallet delivery', 'Identity checks by Stripe', '18+ only'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
                    <IconCheck size={13} strokeWidth={2.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div id="buy" className="w-full scroll-mt-24 animate-fade-up [animation-delay:120ms] lg:max-w-[536px] lg:justify-self-end">
            <BuyPanel />
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-20 border-t border-border bg-surface py-20 sm:py-28">
        <Container>
          <SectionHeading
            id="how-title"
            eyebrow="How it works"
            title="From card to wallet in three steps"
            description="No exchange account to manage. You stay in control of where your Bitcoin goes."
          />
          <ol className="mt-14 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title} className="relative rounded-xl border border-border bg-bg p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="inline-flex size-11 items-center justify-center rounded-lg bg-brand-soft text-brand-soft-fg">
                    <step.icon size={22} />
                  </span>
                  <span className="tabular font-mono text-sm text-fg-subtle" aria-hidden>
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold tracking-tight text-fg">
                  <span className="sr-only">Step {index + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-fg-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Trust & security */}
      <section id="security" aria-labelledby="security-title" className="scroll-mt-20 py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              id="security-title"
              align="left"
              eyebrow="Trust & security"
              title="Built on regulated rails, designed for self-custody"
              description="We keep the parts that matter in specialist hands: Stripe runs payment and compliance, and your wallet receives the crypto."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/TermsOfService" variant="outline" size="sm">
                Terms of Service
              </ButtonLink>
              <ButtonLink href="/PrivacyPolicy" variant="outline" size="sm">
                Privacy Policy
              </ButtonLink>
            </div>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {TRUST.map((item) => (
              <li key={item.title} className="rounded-xl border border-border bg-surface p-6 shadow-xs">
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-surface-2 text-fg">
                  <item.icon size={20} />
                </span>
                <h3 className="mt-5 font-semibold tracking-tight text-fg">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Features & roadmap */}
      <section id="roadmap" aria-labelledby="roadmap-title" className="scroll-mt-20 border-y border-border bg-surface py-20 sm:py-28">
        <Container>
          <SectionHeading
            id="roadmap-title"
            eyebrow="Features & roadmap"
            title="Stay on your plan, without watching charts"
            description="Tools that help you buy on your own terms. Here’s what’s live and what we’re building next."
          />
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ROADMAP.map((item) => (
              <li key={item.title} className="flex flex-col rounded-xl border border-border bg-bg p-6">
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-lg bg-brand-soft text-brand-soft-fg">
                    <item.icon size={20} />
                  </span>
                  <Badge tone={item.status.tone}>{item.status.label}</Badge>
                </div>
                <h3 className="mt-5 font-semibold tracking-tight text-fg">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{item.body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center">
            <ButtonLink href="/reminders" variant="outline" trailingIcon={<IconArrowRight size={16} />}>
              Set up reminders & alerts
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20 py-20 sm:py-28">
        <Container size="md">
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Questions, answered" />
          <div className="mt-12 divide-y divide-border rounded-xl border border-border bg-surface shadow-xs">
            {FAQ.map((item) => (
              <details key={item.q} className="group px-5 sm:px-6">
                <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-4 text-left font-medium text-fg">
                  {item.q}
                  <IconChevronDown size={18} className="faq-chevron shrink-0 text-fg-subtle transition-transform duration-200" />
                </summary>
                <div className="pb-5 pr-8 text-[0.9375rem] leading-relaxed text-fg-muted">{item.a}</div>
              </details>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-fg-muted">
            Still have a question? Email{' '}
            <a href="mailto:support@omnipay.cc" className="font-medium text-brand underline-offset-4 hover:underline">
              support@omnipay.cc
            </a>
          </p>
        </Container>
      </section>

      {/* Closing CTA */}
      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-[#0b0d12] px-6 py-14 text-center sm:px-12">
            <div aria-hidden className="hero-backdrop absolute inset-0 opacity-80" />
            <div className="relative">
              <h2 className="text-3xl font-semibold tracking-[-0.025em] text-white text-balance sm:text-4xl">
                Ready when you are.
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-white/75">
                Create an account, add your wallet, and buy Bitcoin in Stripe’s secure checkout.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <ButtonLink href="/auth/register" size="lg" variant="onDark">
                  Create account
                </ButtonLink>
                <ButtonLink href="#buy" size="lg" variant="onDarkOutline">
                  Buy Bitcoin
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}
