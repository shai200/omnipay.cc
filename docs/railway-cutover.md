# Railway cutover

This repository can run without Firebase. Nothing here creates Railway services, changes DNS, talks to the live Firebase project, or sends mail. Do those steps only after the items in "Needs an explicit OK" are decided.

## What replaced Firebase

- Hosting: the Next.js standalone server in the Dockerfile, started with `node server.js`.
- Database: Railway Postgres. Schema is `drizzle/0000_init.sql`, applied by `node dist/migrate.js` before each deploy.
- Auth: Better Auth email/password and Google, with httpOnly session cookies. New passwords are bcrypt of a SHA-256 digest. Existing Firebase scrypt hashes are checked on sign-in and then replaced with bcrypt. If the scrypt parameters are missing or a password does not verify, the customer uses the reset link. That is the safer path: a wrong parameter fails closed, and a mass reset is only the fallback.
- Email: `node dist/worker.js` on an hourly Railway cron. The Stripe webhook remains the only writer of purchase status.

`railway.toml` is the web service. `railway.worker.toml` is the cron service. `.railway/railway.ts` describes the Postgres database plus both services for `railway config plan`. Config-as-code files stop being read on 2026-12-01, so the TypeScript file is the one to apply for a new project. Applying it is a later, reviewed step.

## Needs an explicit OK

1. Create the Railway project and Postgres database, and accept Railway's pricing and region.
2. Copy the Firebase password-hash parameters (signer key, salt separator, rounds, memory cost) into the web service. They are visible only to a Firebase owner. `FIREBASE_SCRYPT_MEM_COST` must be 15 or less.
3. Create a Google OAuth client whose redirect URI is `https://<domain>/api/auth/callback/google`. The Firebase web config is not this client.
4. Choose the maintenance window. Export and import immediately before the DNS and Stripe webhook switch so events during the gap are not lost.
5. Confirm the SendGrid sender `support@omnipay.cc` and the four template ids, or set the override variables.
6. Confirm the domain that `BETTER_AUTH_URL` will use before Google and the session cookie are configured.
7. Approve `railway config plan` before `railway config apply`. The checked-in file uses `preserve()` and does not contain secret values; the first apply does not fill secrets that are not set yet.
8. After traffic is on Railway, disable Firebase Hosting, App Hosting, Cloud Functions, and the old Stripe webhook endpoint. Do not delete the Firebase project until a backup of the export file is stored somewhere other than the app server.

## Cutover steps

1. Create a Railway project with the Postgres plugin and two services from this repo, both built with the Dockerfile.
2. Point the web service at `railway.toml` (or leave the root file to be picked up). Point the email-jobs service at `/railway.worker.toml` before its first deploy so it does not start the web server. Give only the web service a public domain.
3. Set the web variables from `.env.example`. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` must be available at image build time. Set `DATABASE_URL` from the Postgres plugin. Do not put `FIREBASE_SERVICE_ACCOUNT` on the web service.
4. Set the email-jobs variables: `DATABASE_URL`, `BETTER_AUTH_URL`, `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`, and any template overrides. Leave the API key unset until a dry run looks right.
5. Deploy the web service once so `preDeployCommand` applies the SQL migration. Confirm `GET /api/health` returns `{ "ok": true }`. Do not point DNS at it yet.
6. On a trusted machine, with a checkout of this repo and `npm ci`:
   - `ALLOW_DATA_MIGRATION=yes FIREBASE_SERVICE_ACCOUNT='...' npm run migrate:firebase -- export --out migration-data/export.json`
   - `ALLOW_DATA_MIGRATION=yes DATABASE_URL='...' npm run migrate:firebase -- import --in migration-data/export.json --confirm-host <host>`
   The export is read-only on Firebase. The import writes only to the host you confirm. The file contains password hashes and personal data, is written mode `0600`, is gitignored, and should be deleted after the backup is stored. Run the export again immediately before the switch and import that file too; the import is idempotent and will not replace a bcrypt password with a Firebase hash or clear a completed purchase.
7. Run the email service once with `EMAIL_JOBS_DRY_RUN=true` and read the counts. Imported customers are marked as already welcomed. Customers who already had a completed purchase are marked so the first-purchase mail is not sent again. Reminder mail can still go out on the next Monday or the 1st for people who are due. Set the SendGrid key only after those counts are acceptable.
8. In Stripe, add the new endpoint `https://<domain>/api/stripe/webhook` for `crypto.onramp_session.updated` and put its signing secret in `STRIPE_WEBHOOK_SECRET`. Keep the old endpoint until this one has accepted a test event, then disable the old one in the same window.
9. Switch DNS to the Railway domain. Auth cookies and Google both use `BETTER_AUTH_URL`, so set that to the final https origin before this step.
10. Watch a real sign-in, a checkout, and one webhook delivery. Status changes must arrive only from the webhook. Then turn off Firebase Hosting, App Hosting, and Cloud Functions. Revoke the migration service account after the export file is deleted.

## Password migration

Firebase Auth stores a modified scrypt hash. On a successful sign-in the app checks that hash with the project parameters and immediately stores a bcrypt hash. The check fails closed when the parameters are absent, out of range, or do not match. Those customers, and Google-only customers who want a password, use `/auth/forgot`. Google accounts that were linked in Firebase are imported as Google accounts, so those customers keep signing in with Google. A disabled Firebase user stays disabled and cannot open a session.

## Local checks

`npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` do not need a live database. Tests use an embedded Postgres. Do not run `migrate:firebase` against production from a developer machine as part of those checks.
