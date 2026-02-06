# Email Integration Setup Guide

## Components Added

1. **Firebase Cloud Functions** (`functions/src/index.ts`)
   - `onFirstPurchaseComplete`: Triggers when purchase completes
   - `checkAbandonedCarts`: Runs hourly to find abandoned carts

2. **SendGrid Integration**
   - Uses dynamic templates for emails

## Setup Steps

### 1. Install Functions Dependencies
```bash
cd functions
npm install
```

### 2. Configure Environment Variables

Edit `functions/.env` file (already created):
```bash
SENDGRID_API_KEY=SG.your_actual_key_here
FROM_EMAIL=support@omnipay.cc
FIRST_PURCHASE_TEMPLATE_ID=d-your_template_id
CART_ABANDONMENT_TEMPLATE_ID=d-your_template_id
```

**Note:** The `.env` file is gitignored for security.

### 3. Create SendGrid Templates

Log into SendGrid Dashboard → Email API → Dynamic Templates

**Template 1: First Purchase Welcome**
- Template ID: `d-xxxxxxxxxxxxxx`
- Variables: `{{first_name}}`, `{{transaction_amount}}`, `{{transaction_currency}}`, `{{crypto_amount}}`, `{{crypto_currency}}`

**Template 2: Cart Abandonment**
- Template ID: `d-yyyyyyyyyyyyyy`
- Variables: `{{first_name}}`, `{{cart_amount}}`, `{{cart_currency}}`, `{{crypto_currency}}`, `{{resume_link}}`

### 4. Update Template IDs

In `functions/src/index.ts`:
```typescript.env`:
```bash
FIRST_PURCHASE_TEMPLATE_ID=d-YOUR_ACTUAL_TEMPLATE_ID
CART_ABANDONMENT_TEMPLATE_ID=d-YOUR_ACTUAL_TEMPLATE_ID

### 5. Verify Sender Email

In SendGrid Dashboard → Settings → Sender Authentication
- Verify `support@omnipay.cc`

### 6. Deploy Functions
```bash
firebase deploy --only functions
```

### 7. Test Functions Locally (Optional)
```bash
cd functions
npm run serve
```

## Email Triggers

### First Purchase Email
- **Trigger**: When `onramp_sessions` status changes to `fulfillment_complete`
- **Condition**: Only if it's the user's first completed purchase
- **Data**: Transaction details, amounts, crypto purchased

### Cart Abandonment Email
- **Trigger**: Cron job runs every 1 hour
- **Condition**: Session in `requires_payment` for >1 hour, email not sent yet
- **Data**: Cart details, resume link

## Monitoring

View logs:
```bash
firebase functions:log
```

Check function execution:
```bash
firebase functions:list
```

## Cost Estimates

- **Cloud Functions**: Free tier includes 2M invocations/month
- **SendGrid**: Free tier includes 100 emails/day
- **Firestore Reads**: ~2-5 reads per cart check

## Customization

Edit `functions/src/index.ts` to:
- Add more email triggers (rejected users, etc.)
- Adjust timing (change `'every 1 hours'` to `'every 30 minutes'`)
- Add SMS via Twilio
- Track email opens/clicks
