# OmniPay (`omnipay.cc`)

Fiat → crypto gateway focused on **recurring buys** and **smart reminders**.
Crypto goes to the user’s wallet; card purchases via Stripe Crypto Onramp
(live wiring needs Founder keys / App Hosting — static Hosting is v1).

## Local

```bash
npm ci --legacy-peer-deps
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- Firebase Hosting static export (`output: "export"`) for preview channels
- Stripe packages present for future onramp (not wired on static preview)

## Deploy (Firebase Hosting preview)

Firebase project: `omnipaycc-9e9cb`. Prefer preview channels until Founder
explicitly green-lights the live Firebase channel.

```bash
npm ci --legacy-peer-deps
npm run build
npx firebase-tools hosting:channel:deploy agent-smoke --expires 7d
```

Or: `npm run firebase:preview`.

| Surface | URL |
|---|---|
| Preview channel | `https://omnipaycc-9e9cb--agent-smoke-*.web.app` |
| Firebase live (untouched until FOUNDER_GO) | `https://omnipaycc-9e9cb.web.app` |
| Current marketing host | `https://omnipay.cc` |

Do **not** commit service-account JSON or `.env*` files.
