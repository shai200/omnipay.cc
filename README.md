# Northfield (omnipay.cc Studio project)

Regenerative farming site built for the OmniPay Studio project
(`opensource_remote` → `https://github.com/shai200/omnipay.cc`).

## Local

```bash
npm ci --legacy-peer-deps
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- Firebase Hosting static export (`output: "export"`) for preview channels

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

Do **not** commit service-account JSON or `.env*` files.
