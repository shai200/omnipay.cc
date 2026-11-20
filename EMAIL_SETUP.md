# Email jobs

Welcome, first-purchase, abandoned-cart, and reminder mail is sent by the hourly worker, not by a web request.

```bash
npm run jobs:email
```

On Railway the email-jobs service runs `node dist/worker.js` every hour at minute 0 UTC (`railway.worker.toml`). The process exits when the pass finishes. Reminders are sent only when that run falls in the 17:00 UTC hour, on Monday for weekly preferences and on the 1st for monthly preferences.

Set `SENDGRID_API_KEY` and a verified `SENDGRID_FROM_EMAIL` (default `support@omnipay.cc`). With no API key the worker logs that mail is skipped and does not mark anything sent. `EMAIL_JOBS_DRY_RUN=true` counts the work and does not send.

Template ids default to the existing SendGrid dynamic templates. Override them with:

- `SENDGRID_TEMPLATE_WELCOME`
- `SENDGRID_TEMPLATE_FIRST_PURCHASE`
- `SENDGRID_TEMPLATE_ABANDONED_CART`
- `SENDGRID_TEMPLATE_REMINDER`

Password reset mail is sent by the web service when a customer asks for it. It uses the same API key and from address, and a plain message rather than a template. The link expires in one hour.

## What each job sends

- Welcome: a profile whose welcome timestamp is empty. Imported Firebase profiles are marked sent so old customers are not mailed again.
- First purchase: the customer's only `fulfillment_complete` session whose completion marker matches a signature-verified, applied `crypto.onramp_session.updated` webhook row. A status written any other way does not qualify.
- Abandoned cart: `requires_payment` sessions idle for at least an hour, then again after 3 days and 30 days, and not after three emails. Recording the send does not move the session's update time.
- Reminders: `reminder_weekly` on Mondays and `reminder_monthly` on the 1st, after 7 or 30 days. The price-drop preference is stored and is not sent by this worker.

The worker logs counts only. It does not log email addresses, names, or wallet addresses.
