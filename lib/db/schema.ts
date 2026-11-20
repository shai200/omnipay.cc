import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import type { TransactionDetails } from '@/lib/onramp-webhook';

export type StatusHistoryEntry = {
  status: string;
  eventId: string;
  timestamp: string;
};

// Better Auth addresses these tables by the property names below. The SQL
// column names stay camelCase so they match the adapter's field names.
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  disabled: boolean('disabled').notNull().default(false),
  createdAt: timestamp('createdAt', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const authSession = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expiresAt', { withTimezone: true, mode: 'date' }).notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('createdAt', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    ipAddress: text('ipAddress'),
    userAgent: text('userAgent'),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [index('session_user_id_idx').on(table.userId)],
);

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('accountId').notNull(),
    providerId: text('providerId').notNull(),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('accessToken'),
    refreshToken: text('refreshToken'),
    idToken: text('idToken'),
    accessTokenExpiresAt: timestamp('accessTokenExpiresAt', { withTimezone: true, mode: 'date' }),
    refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt', { withTimezone: true, mode: 'date' }),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('createdAt', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('account_user_id_idx').on(table.userId),
    uniqueIndex('account_provider_account_unique').on(table.providerId, table.accountId),
  ],
);

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expiresAt', { withTimezone: true, mode: 'date' }).notNull(),
    createdAt: timestamp('createdAt', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
);

export const profiles = pgTable(
  'profiles',
  {
    userId: text('user_id')
      .primaryKey()
      .references(() => user.id, { onDelete: 'cascade' }),
    firstName: text('first_name'),
    lastName: text('last_name'),
    dobYear: integer('dob_year'),
    dobMonth: integer('dob_month'),
    dobDay: integer('dob_day'),
    addressCountry: text('address_country'),
    addressLine1: text('address_line1'),
    addressLine2: text('address_line2'),
    addressCity: text('address_city'),
    addressState: text('address_state'),
    addressPostalCode: text('address_postal_code'),
    walletBitcoin: text('wallet_bitcoin'),
    walletEthereum: text('wallet_ethereum'),
    lockWalletAddress: boolean('lock_wallet_address').notNull().default(false),
    sourceCurrency: text('source_currency'),
    sourceAmount: text('source_amount'),
    // Null means the customer has not chosen yet. The reminders page treats
    // that as its existing display default.
    reminderWeekly: boolean('reminder_weekly'),
    reminderMonthly: boolean('reminder_monthly'),
    reminderPriceDrop: boolean('reminder_price_drop'),
    lastReminderSentAt: timestamp('last_reminder_sent_at', { withTimezone: true, mode: 'date' }),
    welcomeEmailSentAt: timestamp('welcome_email_sent_at', { withTimezone: true, mode: 'date' }),
    firstPurchaseEmailSentAt: timestamp('first_purchase_email_sent_at', { withTimezone: true, mode: 'date' }),
    legacy: jsonb('legacy').$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('profiles_reminder_weekly_idx').on(table.reminderWeekly),
    index('profiles_reminder_monthly_idx').on(table.reminderMonthly),
  ],
);

export const onrampSessions = pgTable(
  'onramp_sessions',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
    status: text('status'),
    lastStatus: text('last_status'),
    statusEventCreated: integer('status_event_created'),
    statusEventId: text('status_event_id'),
    verifiedCompletionEventId: text('verified_completion_event_id'),
    transactionDetails: jsonb('transaction_details')
      .$type<TransactionDetails>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    statusHistory: jsonb('status_history')
      .$type<StatusHistoryEntry[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    abandonmentEmailCount: integer('abandonment_email_count').notNull().default(0),
    lastAbandonmentEmailSentAt: timestamp('last_abandonment_email_sent_at', {
      withTimezone: true,
      mode: 'date',
    }),
    legacy: jsonb('legacy').$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  },
  (table) => [
    index('onramp_sessions_user_status_idx').on(table.userId, table.status),
    index('onramp_sessions_status_updated_idx').on(table.status, table.updatedAt),
  ],
);

export const webhookEvents = pgTable('stripe_webhook_events', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  sessionId: text('session_id').notNull(),
  status: text('status').notNull(),
  eventCreated: integer('event_created').notNull(),
  signatureVerified: boolean('signature_verified').notNull(),
  applied: boolean('applied').notNull(),
  processedAt: timestamp('processed_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

// Historical client events. The app no longer writes this table. The import
// keeps the documents so they are not dropped, and no route reads them.
export const legacyOnrampEvents = pgTable('legacy_onramp_events', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  payload: jsonb('payload').$type<Record<string, unknown>>().notNull(),
  importedAt: timestamp('imported_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export const schema = {
  user,
  session: authSession,
  account,
  verification,
  profiles,
  onrampSessions,
  webhookEvents,
  legacyOnrampEvents,
};
