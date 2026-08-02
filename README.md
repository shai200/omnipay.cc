# OmniPay

A Fiat to Crypto bridge enabling seamless conversion between traditional currencies and cryptocurrencies.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Tech Stack

- [Next.js](https://nextjs.org) - React framework
- TypeScript - Type safety
- Tailwind CSS - Styling

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy (Firebase Hosting)

Firebase project: `omnipaycc-9e9cb`. This app currently uses Next.js
`output: "export"` so the static `out/` directory can be published to
Firebase Hosting (App Hosting IAM is not yet available to the agent SA).

```bash
npm ci --legacy-peer-deps
npm run build
npx firebase-tools hosting:channel:deploy <channel-name> --expires 7d
```

Prefer preview channels until production cutover is explicit. Do not commit
service-account JSON or `.env*` files.

Live marketing site today may still be served from another host
(`https://omnipay.cc`); Firebase default site is
`https://omnipaycc-9e9cb.web.app`.
