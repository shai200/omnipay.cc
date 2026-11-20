# OmniPay.cc

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

## Environment variables

Copy `.env.example` to `.env.local` for local development. `.env.local` is gitignored. Do not commit real values.

| Variable | Used by | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Browser, crypto onramp widget | Publishable key. Safe to expose to the browser, but set it in the environment instead of committing it. |
| `NEXT_PUBLIC_FIREBASE_CONFIG` | Browser, Firebase Auth and Firestore | JSON string of the Firebase web app config. Public by design, but set it in the environment instead of committing it. |
| `STRIPE_SECRET_KEY` | Server, `POST /api/onramp-session` | Secret. Prefer a restricted key with only the crypto onramp permissions this route needs. |
| `FIREBASE_SERVICE_ACCOUNT` | Server, `lib/firebase-admin.ts` | Secret. Service account JSON as a single-line string. |
| `FIREBASE_PROJECT_ID` | Server, optional | Needed only when the service account JSON has no `project_id`. |
| `SENDGRID_API_KEY` | Cloud Functions runtime | Secret. Not read by the Next.js app. |

Firebase App Hosting maps these names in `apphosting.yaml`. Each one is a Cloud Secret Manager secret, including the browser-public values, so live config stays out of git. `NEXT_PUBLIC_*` values are still inlined into the client bundle at build time. Create `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `NEXT_PUBLIC_FIREBASE_CONFIG` before the next rollout and grant the App Hosting service account access to them.

`npm test` runs the auth and age-gate tests.

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

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
