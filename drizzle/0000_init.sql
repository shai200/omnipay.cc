CREATE TABLE "user" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "emailVerified" boolean DEFAULT false NOT NULL,
  "image" text,
  "disabled" boolean DEFAULT false NOT NULL,
  "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
  "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "session" (
  "id" text PRIMARY KEY NOT NULL,
  "expiresAt" timestamp with time zone NOT NULL,
  "token" text NOT NULL,
  "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
  "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
  "ipAddress" text,
  "userAgent" text,
  "userId" text NOT NULL,
  CONSTRAINT "session_token_unique" UNIQUE("token"),
  CONSTRAINT "session_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" ("userId");
--> statement-breakpoint
CREATE TABLE "account" (
  "id" text PRIMARY KEY NOT NULL,
  "accountId" text NOT NULL,
  "providerId" text NOT NULL,
  "userId" text NOT NULL,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamp with time zone,
  "refreshTokenExpiresAt" timestamp with time zone,
  "scope" text,
  "password" text,
  "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
  "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "account_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" ("userId");
--> statement-breakpoint
CREATE UNIQUE INDEX "account_provider_account_unique" ON "account" ("providerId", "accountId");
--> statement-breakpoint
CREATE TABLE "verification" (
  "id" text PRIMARY KEY NOT NULL,
  "identifier" text NOT NULL,
  "value" text NOT NULL,
  "expiresAt" timestamp with time zone NOT NULL,
  "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
  "updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");
--> statement-breakpoint
CREATE TABLE "profiles" (
  "user_id" text PRIMARY KEY NOT NULL,
  "first_name" text,
  "last_name" text,
  "dob_year" integer,
  "dob_month" integer,
  "dob_day" integer,
  "address_country" text,
  "address_line1" text,
  "address_line2" text,
  "address_city" text,
  "address_state" text,
  "address_postal_code" text,
  "wallet_bitcoin" text,
  "wallet_ethereum" text,
  "lock_wallet_address" boolean DEFAULT false NOT NULL,
  "source_currency" text,
  "source_amount" text,
  "reminder_weekly" boolean,
  "reminder_monthly" boolean,
  "reminder_price_drop" boolean,
  "last_reminder_sent_at" timestamp with time zone,
  "welcome_email_sent_at" timestamp with time zone,
  "first_purchase_email_sent_at" timestamp with time zone,
  "legacy" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "profiles_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX "profiles_reminder_weekly_idx" ON "profiles" ("reminder_weekly");
--> statement-breakpoint
CREATE INDEX "profiles_reminder_monthly_idx" ON "profiles" ("reminder_monthly");
--> statement-breakpoint
CREATE TABLE "onramp_sessions" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text,
  "status" text,
  "last_status" text,
  "status_event_created" integer,
  "status_event_id" text,
  "verified_completion_event_id" text,
  "transaction_details" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "status_history" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "abandonment_email_count" integer DEFAULT 0 NOT NULL,
  "last_abandonment_email_sent_at" timestamp with time zone,
  "legacy" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "onramp_sessions_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX "onramp_sessions_user_status_idx" ON "onramp_sessions" ("user_id", "status");
--> statement-breakpoint
CREATE INDEX "onramp_sessions_status_updated_idx" ON "onramp_sessions" ("status", "updated_at");
--> statement-breakpoint
CREATE TABLE "stripe_webhook_events" (
  "id" text PRIMARY KEY NOT NULL,
  "type" text NOT NULL,
  "session_id" text NOT NULL,
  "status" text NOT NULL,
  "event_created" integer NOT NULL,
  "signature_verified" boolean NOT NULL,
  "applied" boolean NOT NULL,
  "processed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "legacy_onramp_events" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text,
  "payload" jsonb NOT NULL,
  "imported_at" timestamp with time zone DEFAULT now() NOT NULL
);
