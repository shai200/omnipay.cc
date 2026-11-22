import type { Metadata } from 'next';
import Link from 'next/link';
import { BuyPanel } from './components/BuyPanel';
import { HeroActions, RemindersCta } from './components/HeroActions';
import { PageShell } from './components/PageShell';
import { Reveal } from './components/Reveal';
import {
  BellIcon,
  CalendarIcon,
  CardIcon,
  CheckIcon,
  FileIcon,
  KeyIcon,
  LockIcon,
  MessageIcon,
  PlusIcon,
  ShieldIcon,
  SlidersIcon,
  TrendDownIcon,
  UserIcon,
  WalletIcon,
} from './components/ui/icons';

export const metadata: Metadata = {
  title: 'OmniPurchase - Buy Bitcoin with your card, sent to your own wallet',
  description:
    'Buy crypto with any credit or debit card and have it sent directly to your own wallet. Checkout and identity verification are handled by Stripe.',
};

const HERO_POINTS = [
  'Checkout by Stripe',
  'Sent to your own wallet',
  '18+ only',
];

const STEPS = [
  {
    icon: <UserIcon />,
    title: 'Create your account',
    body: 'Register in a minute. OmniPurchase is for adults aged 18 and above, so we ask for your date of birth before your first purchase.',
  },
  {
    icon: <WalletIcon />,
    title: 'Add your wallet',
    body: 'Save your Bitcoin address and a default amount once in Checkout Settings. They are filled in for you each time you buy.',
  },
  {
    icon: <CardIcon />,
    title: 'Pay by card',
    body: 'Complete checkout with any credit or debit card. Stripe shows the price and fees before you confirm, and your crypto is sent to your wallet.',
  },
];

const SECURITY = [
  {
    icon: <CardIcon />,
    title: 'Payments handled by Stripe',
    body: 'Purchases are processed by Stripe through its Crypto Onramp. We do not store or have access to your full payment details.',
  },
  {
    icon: <KeyIcon />,
    title: 'Your wallet, your control',
    body: 'We do not hold or store your cryptocurrency or fiat funds. Each purchase goes to the wallet address you provide.',
  },
  {
    icon: <ShieldIcon />,
    title: 'Identity verification by Stripe',
    body: 'Verification is handled directly by Stripe. We do not receive or retain your identity documents.',
  },
  {
    icon: <UserIcon />,
    title: 'Adults only',
    body: 'You must be at least 18 years old. Your date of birth is checked on our servers before every checkout starts.',
  },
  {
    icon: <LockIcon />,
    title: 'Verified purchase status',
    body: 'A purchase is only recorded as complete from a signed notification sent by Stripe, never from the browser.',
  },
  {
    icon: <FileIcon />,
    title: 'Fees shown before you pay',
    body: 'Transaction fees are determined and displayed by Stripe during checkout, before you confirm.',
  },
];

const AVAILABLE = [
  {
    icon: <CardIcon />,
    title: 'Card purchases to your wallet',
    body: 'Buy Bitcoin with any credit or debit card. No custody, no middlemen holding your coins.',
  },
  {
    icon: <SlidersIcon />,
    title: 'Saved checkout details',
    body: 'Keep your name, address, wallet and default amount on file so repeat purchases take less typing.',
  },
  {
    icon: <BellIcon />,
    title: 'Purchase reminder emails',
    body: 'Choose a weekly or monthly email reminder. It is only a reminder: you decide whether to buy each time.',
  },
];

const ROADMAP = [
  {
    icon: <TrendDownIcon />,
    title: 'Bitcoin price-drop email alerts',
    badge: 'Coming soon',
    extra: 'Free',
    body: 'An email after a sharp drop in the Bitcoin price. You can already save your preference in Reminders.',
  },
  {
    icon: <MessageIcon />,
    title: 'SMS and WhatsApp alerts',
    badge: 'Planned',
    body: 'The same reminders and alerts, delivered by text message or WhatsApp instead of email.',
  },
  {
    icon: <CalendarIcon />,
    title: 'Monthly Bitcoin savings plan',
    badge: 'Planned',
    body: 'A way to set a fixed monthly amount and schedule. Today every purchase is a one-time purchase you confirm yourself.',
  },
];

const FAQ: { question: string; answer: React.ReactNode }[] = [
  {
    question: 'What is OmniPurchase?',
    answer: (
      <p>
        OmniPurchase is a simple way to buy cryptocurrency with a credit or debit card. It is a product of
        OmniPay.cc. Purchases are processed through Stripe&apos;s Crypto Onramp and sent to a wallet you control.
      </p>
    ),
  },
  {
    question: 'Who can use it?',
    answer: (
      <p>
        You must be at least 18 years old (or the age of legal majority in your jurisdiction) and a resident of
        a supported region. The full list of supported and prohibited regions is in the{' '}
        <Link href="/TermsOfService" className="link">Terms of Service</Link> and{' '}
        <Link href="/BusinessInfo" className="link">Business Info</Link>.
      </p>
    ),
  },
  {
    question: 'What does it cost?',
    answer: (
      <p>
        Transaction fees are determined and displayed by Stripe during checkout. You see the price and the fees
        before you confirm a purchase. Creating an account and receiving reminder emails is free.
      </p>
    ),
  },
  {
    question: 'Do you hold my crypto?',
    answer: (
      <p>
        No. We do not hold or store your cryptocurrency or fiat funds. Your purchase is sent to the wallet
        address you provide, so make sure the address is correct and that you control it.
      </p>
    ),
  },
  {
    question: 'Which wallet do I need?',
    answer: (
      <p>
        A Bitcoin wallet address that you control. You can save it in Checkout Settings so it is filled in at
        checkout. Blockchain transactions cannot be reversed, so double-check the address before you pay.
      </p>
    ),
  },
  {
    question: 'Can I cancel or get a refund?',
    answer: (
      <p>
        Cryptocurrency transactions are final and irreversible once completed on the blockchain. Please review
        every detail before you confirm. The refund, dispute and cancellation policies are in{' '}
        <Link href="/BusinessInfo" className="link">Business Info</Link>.
      </p>
    ),
  },
  {
    question: 'How do reminders work?',
    answer: (
      <p>
        Reminders are optional emails, sent weekly on Monday or monthly on the 1st. They do not buy anything
        for you and they are not financial advice. You can change or turn them off at any time in Reminders.
      </p>
    ),
  },
  {
    question: 'Are price-drop alerts, SMS alerts and the savings plan available?',
    answer: (
      <p>
        Not yet. They are on our roadmap and may change before release. Nothing on the roadmap is a promise
        about the price of Bitcoin or about returns.
      </p>
    ),
  },
];

function SectionHeading({ eyebrow, title, lead, id }: { eyebrow: string; title: string; lead?: string; id: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="text-title mt-3">{title}</h2>
      {lead ? <p className="text-lead mt-4">{lead}</p> : null}
    </div>
  );
}

export default function Home() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="relative isolate" aria-labelledby="hero-heading">
        <div className="hero-backdrop" aria-hidden="true" />
        <div className="container-page grid items-start gap-12 pb-16 pt-12 md:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,536px)] lg:gap-14 lg:pb-24">
          <div className="animate-enter lg:pt-8">
            <p className="badge badge-info">
              <LockIcon size={13} /> Checkout powered by Stripe
            </p>
            <h1 id="hero-heading" className="text-display mt-5">
              Buy Bitcoin with your card.{' '}
              <span className="text-muted">Sent to your own wallet.</span>
            </h1>
            <p className="text-lead mt-6 max-w-xl">
              OmniPurchase is a simple way to buy crypto with any credit or debit card. Checkout and identity
              verification run on Stripe, and every purchase goes directly to a wallet you control.
            </p>
            <div className="mt-8">
              <HeroActions />
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              {HERO_POINTS.map((point) => (
                <li key={point} className="flex items-center gap-2">
                  <CheckIcon size={16} className="text-success" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-enter" style={{ animationDelay: '120ms' }}>
            <BuyPanel />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="section scroll-mt-16 border-t border-line bg-surface" aria-labelledby="how-heading">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              id="how-heading"
              eyebrow="How it works"
              title="From card to wallet in three steps"
              lead="No exchange account to fund and no coins left sitting with a third party."
            />
          </Reveal>
          <ol className="mt-14 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <Reveal delay={index * 90} className="h-full">
                  <div className="card h-full p-6 md:p-7">
                    <div className="flex items-center justify-between">
                      <span className="icon-tile">{step.icon}</span>
                      <span className="font-mono text-sm text-muted" aria-hidden="true">
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold tracking-tight">
                      <span className="sr-only">Step {index + 1}: </span>
                      {step.title}
                    </h3>
                    <p className="mt-2 text-muted">{step.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Trust and security */}
      <section id="security" className="section scroll-mt-16" aria-labelledby="security-heading">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              id="security-heading"
              eyebrow="Trust and security"
              title="Built on Stripe. Delivered to you."
              lead="We keep our part small on purpose: Stripe handles payments and verification, and your crypto never sits with us."
            />
          </Reveal>
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SECURITY.map((item, index) => (
              <li key={item.title}>
                <Reveal delay={(index % 3) * 80} className="h-full">
                  <div className="card card-interactive h-full p-6">
                    <span className="icon-tile">{item.icon}</span>
                    <h3 className="mt-4 font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal>
            <aside className="alert alert-warning mx-auto mt-10 max-w-3xl" aria-labelledby="risk-heading">
              <ShieldIcon size={18} />
              <div>
                <h3 id="risk-heading" className="font-semibold">Know the risks</h3>
                <p className="mt-1 text-sm text-muted">
                  Cryptocurrency prices can fluctuate dramatically, and you may lose value. Completed
                  transactions are final. OmniPurchase does not provide financial, investment, or tax advice.
                  Read the <Link href="/TermsOfService" className="link">Terms of Service</Link> before you buy.
                </p>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* Features and roadmap */}
      <section id="roadmap" className="section scroll-mt-16 border-y border-line bg-surface" aria-labelledby="roadmap-heading">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              id="roadmap-heading"
              eyebrow="Features and roadmap"
              title="What you can do today, and what is next"
            />
          </Reveal>

          <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-12">
            <Reveal>
              <div>
                <h3 className="flex items-center gap-3 text-lg font-semibold tracking-tight">
                  Available now <span className="badge badge-success">Live</span>
                </h3>
                <ul className="mt-5 space-y-4">
                  {AVAILABLE.map((item) => (
                    <li key={item.title} className="card flex gap-4 p-5">
                      <span className="icon-tile">{item.icon}</span>
                      <div>
                        <h4 className="font-semibold tracking-tight">{item.title}</h4>
                        <p className="mt-1 text-sm leading-6 text-muted">{item.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div>
                <h3 className="flex items-center gap-3 text-lg font-semibold tracking-tight">
                  On the roadmap <span className="badge">Not available yet</span>
                </h3>
                <ul className="mt-5 space-y-4">
                  {ROADMAP.map((item) => (
                    <li key={item.title} className="card flex gap-4 border-dashed p-5">
                      <span className="icon-tile icon-tile-accent">{item.icon}</span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-semibold tracking-tight">{item.title}</h4>
                          <span className="badge badge-warning">{item.badge}</span>
                          {item.extra ? <span className="badge badge-success">{item.extra}</span> : null}
                        </div>
                        <p className="mt-1 text-sm leading-6 text-muted">{item.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-muted">
                  Roadmap items are plans, not commitments, and may change. None of them is a promise about
                  prices or returns.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div className="card mt-12 flex flex-col items-start gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div className="flex items-start gap-4">
                <span className="icon-tile"><BellIcon /></span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">Prefer a nudge? Turn on reminders.</h3>
                  <p className="mt-1 max-w-xl text-muted">
                    Get an email weekly or monthly so buying on a schedule is your choice, not something you
                    have to remember.
                  </p>
                </div>
              </div>
              <RemindersCta />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section scroll-mt-16" aria-labelledby="faq-heading">
        <div className="container-page">
          <Reveal>
            <SectionHeading id="faq-heading" eyebrow="FAQ" title="Questions, answered plainly" />
          </Reveal>
          <Reveal>
            <div className="mx-auto mt-12 max-w-3xl border-t border-line">
              {FAQ.map((item) => (
                <details key={item.question} className="faq-item">
                  <summary>
                    {item.question}
                    <PlusIcon size={18} />
                  </summary>
                  <div className="faq-body">{item.answer}</div>
                </details>
              ))}
            </div>
          </Reveal>
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-muted">
            Still have a question? Email{' '}
            <a href="mailto:support@omnipay.cc" className="link">support@omnipay.cc</a>.
          </p>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="pb-20 md:pb-28" aria-labelledby="cta-heading">
        <div className="container-page">
          <Reveal>
            <div className="relative isolate overflow-hidden rounded-3xl bg-surface-inverse px-6 py-14 text-center md:px-12 md:py-20">
              <h2 id="cta-heading" className="text-title text-fg-inverse">Ready when you are</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted-inverse">
                Create an account, add your wallet, and make your first purchase with a card.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/auth/register" className="btn btn-primary btn-lg">Create your account</Link>
                <Link href="/#buy" className="btn btn-lg border-line-strong text-fg-inverse hover:bg-white/10">
                  Go to checkout
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
