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

Copy `.env.example` to `.env.local` for local development. `.env.local` is gitignored. Do not commit real values. Every variable is listed in `.env.example`.

| Variable | Used by | Notes |
| --- | --- | --- |
| `BETTER_AUTH_URL` | Server, auth cookies and email links | Public origin, such as `http://localhost:3000` or `https://omnipay.cc`. No trailing path. |
| `BETTER_AUTH_SECRET` | Server, session cookies | Secret. At least 32 random characters. |
| `GOOGLE_CLIENT_ID` | Server, Google sign-in | OAuth client id. Leave empty until Google sign-in should work. |
| `GOOGLE_CLIENT_SECRET` | Server, Google sign-in | Secret. Pair with the client id. Redirect URI is `${BETTER_AUTH_URL}/api/auth/callback/google`. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Browser, crypto onramp widget | Publishable key. Inlined at image build time. |
| `STRIPE_SECRET_KEY` | Server, `POST /api/onramp-session` | Secret. Prefer a restricted key with only the crypto onramp permissions this route needs. |
| `STRIPE_WEBHOOK_SECRET` | Server, `POST /api/stripe/webhook` | Secret. Signing secret for `crypto.onramp_session.updated`. Not a Stripe API key. |
| `DATABASE_URL` | Server and email cron | Secret. Postgres connection string. |
| `SENDGRID_API_KEY` | Email cron and password reset | Secret. Mail is not sent when this is empty. |
| `SENDGRID_FROM_EMAIL` | Email cron and password reset | Optional. Defaults to `support@omnipay.cc`. |
| `SENDGRID_TEMPLATE_WELCOME` | Email cron | Optional template override. |
| `SENDGRID_TEMPLATE_FIRST_PURCHASE` | Email cron | Optional template override. |
| `SENDGRID_TEMPLATE_ABANDONED_CART` | Email cron | Optional template override. |
| `SENDGRID_TEMPLATE_REMINDER` | Email cron | Optional template override. |
| `FIREBASE_SCRYPT_SIGNER_KEY` | Server, first sign-in of a migrated password | Secret. From the Firebase password-hash parameters. |
| `FIREBASE_SCRYPT_SALT_SEPARATOR` | Server, same | Secret. |
| `FIREBASE_SCRYPT_ROUNDS` | Server, same | Integer from those parameters. |
| `FIREBASE_SCRYPT_MEM_COST` | Server, same | Integer from those parameters. Must be 1–15. |
| `ALLOW_DATA_MIGRATION` | One-off import/export script only | Set to `yes` only for that run. |
| `FIREBASE_SERVICE_ACCOUNT` | One-off export script only | Secret. Not read by the web server. |
| `FIREBASE_PROJECT_ID` | One-off export script | Optional when the service account JSON has no `project_id`. |
| `EMAIL_JOBS_DRY_RUN` | Email cron | Optional. `true` counts work and does not send. |

Purchase status is written only by `POST /api/stripe/webhook` after Stripe signature verification. Checkout requires a session, an age of 18 or older, and a wallet that matches the network. Profile and session rows are readable only by the signed-in owner.

`npm test` runs the onramp auth, age-gate, webhook, password, email-job, and import tests.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Tech Stack

- [Next.js](https://nextjs.org) - React framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- Postgres and Drizzle - accounts, profiles, onramp sessions, and webhook idempotency
- Better Auth - email/password and Google sign-in

The hosted shape is a Railway web service, a Railway Postgres database, and an hourly Railway cron service. See `docs/railway-cutover.md`. The web image is the Dockerfile. `railway.toml` is the web service. `railway.worker.toml` is the email cron. `.railway/railway.ts` is the project definition to review before anything is created.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Hosting

The production process is the Next.js standalone server (`node server.js`) from the Dockerfile. Local development stays `npm run dev`. Apply database migrations with `npm run db:migrate` against the `DATABASE_URL` you intend to change. The one-off Firebase import is `npm run migrate:firebase` and refuses to run unless `ALLOW_DATA_MIGRATION=yes`. Do not point it at a live database until the cutover in `docs/railway-cutover.md` is approved.
