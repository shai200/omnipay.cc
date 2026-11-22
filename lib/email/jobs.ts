import { and, eq, isNotNull, isNull, lt, or } from 'drizzle-orm';
import type { AppDatabase } from '@/lib/db/client';
import { onrampSessions, profiles, user, webhookEvents } from '@/lib/db/schema';
import { appOrigin, templateId } from '@/lib/email/config';
import { verifiedCompletionAllowsEmail } from '@/lib/email/verified-completion';
import type { OutboundEmail } from '@/lib/email/send';

const FULFILLMENT_COMPLETE = 'fulfillment_complete';
const REQUIRES_PAYMENT = 'requires_payment';
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

export type Mailer = {
  send(message: OutboundEmail): Promise<void>;
};

export type EmailJobReport = {
  welcomeSent: number;
  firstPurchaseSent: number;
  abandonedCartSent: number;
  reminderSent: number;
  skipped: number;
  failed: number;
};

function emptyReport(): EmailJobReport {
  return {
    welcomeSent: 0,
    firstPurchaseSent: 0,
    abandonedCartSent: 0,
    reminderSent: 0,
    skipped: 0,
    failed: 0,
  };
}

function displayName(firstName: string | null): string {
  const trimmed = firstName?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : 'there';
}

function detail(details: unknown, key: string, fallback: string): string {
  if (!details || typeof details !== 'object') return fallback;
  const value = (details as Record<string, unknown>)[key];
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

async function sendOrRollback(
  mailer: Mailer,
  message: OutboundEmail,
  rollback: () => Promise<void>,
  report: EmailJobReport,
): Promise<boolean> {
  try {
    await mailer.send(message);
    return true;
  } catch {
    report.failed += 1;
    try {
      await rollback();
    } catch {
      console.error('Email claim rollback failed');
    }
    return false;
  }
}

export async function runEmailJobs(
  db: AppDatabase,
  mailer: Mailer,
  now: Date = new Date(),
): Promise<EmailJobReport> {
  const report = emptyReport();
  await sendWelcomeEmails(db, mailer, now, report);
  await sendFirstPurchaseEmails(db, mailer, now, report);
  await sendAbandonedCartEmails(db, mailer, now, report);
  await sendReminderEmails(db, mailer, now, report);
  return report;
}

async function sendWelcomeEmails(
  db: AppDatabase,
  mailer: Mailer,
  now: Date,
  report: EmailJobReport,
): Promise<void> {
  const rows = await db
    .select({
      userId: profiles.userId,
      email: user.email,
      firstName: profiles.firstName,
    })
    .from(profiles)
    .innerJoin(user, eq(user.id, profiles.userId))
    .where(and(isNull(profiles.welcomeEmailSentAt), eq(user.disabled, false)));

  for (const row of rows) {
    if (!row.email) {
      report.skipped += 1;
      continue;
    }
    const claimed = await db
      .update(profiles)
      .set({ welcomeEmailSentAt: now })
      .where(and(eq(profiles.userId, row.userId), isNull(profiles.welcomeEmailSentAt)))
      .returning({ userId: profiles.userId });
    if (claimed.length === 0) {
      report.skipped += 1;
      continue;
    }
    const sent = await sendOrRollback(
      mailer,
      {
        to: row.email,
        templateId: templateId('welcome'),
        dynamicTemplateData: { first_name: displayName(row.firstName) },
      },
      () => db
        .update(profiles)
        .set({ welcomeEmailSentAt: null })
        .where(and(eq(profiles.userId, row.userId), eq(profiles.welcomeEmailSentAt, now)))
        .then(() => undefined),
      report,
    );
    if (sent) report.welcomeSent += 1;
  }
}

async function sendFirstPurchaseEmails(
  db: AppDatabase,
  mailer: Mailer,
  now: Date,
  report: EmailJobReport,
): Promise<void> {
  const completed = await db
    .select({
      userId: onrampSessions.userId,
      sessionId: onrampSessions.id,
      status: onrampSessions.status,
      marker: onrampSessions.verifiedCompletionEventId,
      details: onrampSessions.transactionDetails,
    })
    .from(onrampSessions)
    .where(and(
      eq(onrampSessions.status, FULFILLMENT_COMPLETE),
      isNotNull(onrampSessions.verifiedCompletionEventId),
      isNotNull(onrampSessions.userId),
    ));

  const byUser = new Map<string, typeof completed>();
  for (const row of completed) {
    if (!row.userId) continue;
    const list = byUser.get(row.userId) ?? [];
    list.push(row);
    byUser.set(row.userId, list);
  }

  for (const [userId, sessions] of byUser) {
    if (sessions.length !== 1) {
      report.skipped += 1;
      continue;
    }
    const session = sessions[0];
    if (!session) continue;
    const [event] = session.marker
      ? await db.select().from(webhookEvents).where(eq(webhookEvents.id, session.marker)).limit(1)
      : [];
    const allowed = verifiedCompletionAllowsEmail({
      sessionId: session.sessionId,
      beforeMarker: undefined,
      afterMarker: session.marker,
      afterStatus: session.status,
      event: event
        ? {
            signatureVerified: event.signatureVerified,
            applied: event.applied,
            type: event.type,
            status: event.status,
            sessionId: event.sessionId,
          }
        : undefined,
    });
    if (!allowed) {
      report.skipped += 1;
      continue;
    }

    const [person] = await db
      .select({
        email: user.email,
        firstName: profiles.firstName,
        disabled: user.disabled,
        alreadySent: profiles.firstPurchaseEmailSentAt,
      })
      .from(user)
      .leftJoin(profiles, eq(profiles.userId, user.id))
      .where(eq(user.id, userId))
      .limit(1);
    if (!person || person.disabled || !person.email || person.alreadySent) {
      report.skipped += 1;
      continue;
    }

    const claimed = await db
      .update(profiles)
      .set({ firstPurchaseEmailSentAt: now })
      .where(and(eq(profiles.userId, userId), isNull(profiles.firstPurchaseEmailSentAt)))
      .returning({ userId: profiles.userId });
    if (claimed.length === 0) {
      report.skipped += 1;
      continue;
    }

    const sent = await sendOrRollback(
      mailer,
      {
        to: person.email,
        templateId: templateId('firstPurchase'),
        dynamicTemplateData: {
          first_name: displayName(person.firstName),
          transaction_amount: detail(session.details, 'source_amount', 'N/A'),
          transaction_currency: detail(session.details, 'source_currency', 'USD'),
          crypto_amount: detail(session.details, 'destination_amount', 'N/A'),
          crypto_currency: detail(session.details, 'destination_currency', 'BTC'),
        },
      },
      () => db
        .update(profiles)
        .set({ firstPurchaseEmailSentAt: null })
        .where(and(eq(profiles.userId, userId), eq(profiles.firstPurchaseEmailSentAt, now)))
        .then(() => undefined),
      report,
    );
    if (sent) report.firstPurchaseSent += 1;
  }
}

async function sendAbandonedCartEmails(
  db: AppDatabase,
  mailer: Mailer,
  now: Date,
  report: EmailJobReport,
): Promise<void> {
  const cutoff = new Date(now.getTime() - HOUR_MS);
  const rows = await db
    .select({
      id: onrampSessions.id,
      userId: onrampSessions.userId,
      updatedAt: onrampSessions.updatedAt,
      count: onrampSessions.abandonmentEmailCount,
      details: onrampSessions.transactionDetails,
    })
    .from(onrampSessions)
    .where(and(
      eq(onrampSessions.status, REQUIRES_PAYMENT),
      lt(onrampSessions.updatedAt, cutoff),
      lt(onrampSessions.abandonmentEmailCount, 3),
      isNotNull(onrampSessions.userId),
    ));

  for (const row of rows) {
    if (!row.userId) {
      report.skipped += 1;
      continue;
    }
    const ageMs = now.getTime() - row.updatedAt.getTime();
    const due = row.count === 0
      || (row.count === 1 && ageMs >= 3 * DAY_MS)
      || (row.count === 2 && ageMs >= 30 * DAY_MS);
    if (!due) {
      report.skipped += 1;
      continue;
    }

    const [person] = await db
      .select({ email: user.email, firstName: profiles.firstName, disabled: user.disabled })
      .from(user)
      .leftJoin(profiles, eq(profiles.userId, user.id))
      .where(eq(user.id, row.userId))
      .limit(1);
    if (!person || person.disabled || !person.email) {
      report.skipped += 1;
      continue;
    }

    const nextCount = row.count + 1;
    const claimed = await db
      .update(onrampSessions)
      .set({ abandonmentEmailCount: nextCount, lastAbandonmentEmailSentAt: now })
      .where(and(
        eq(onrampSessions.id, row.id),
        eq(onrampSessions.abandonmentEmailCount, row.count),
        eq(onrampSessions.status, REQUIRES_PAYMENT),
      ))
      .returning({ id: onrampSessions.id });
    if (claimed.length === 0) {
      report.skipped += 1;
      continue;
    }

    const sent = await sendOrRollback(
      mailer,
      {
        to: person.email,
        templateId: templateId('abandonedCart'),
        dynamicTemplateData: {
          first_name: displayName(person.firstName),
          cart_amount: detail(row.details, 'source_amount', 'N/A'),
          cart_currency: detail(row.details, 'source_currency', 'USD'),
          crypto_currency: detail(row.details, 'destination_currency', 'BTC'),
          resume_link: `${appOrigin()}/?session=${row.id}`,
        },
      },
      () => db
        .update(onrampSessions)
        .set({ abandonmentEmailCount: row.count, lastAbandonmentEmailSentAt: null })
        .where(and(eq(onrampSessions.id, row.id), eq(onrampSessions.abandonmentEmailCount, nextCount)))
        .then(() => undefined),
      report,
    );
    if (sent) report.abandonedCartSent += 1;
  }
}

// Sends only happen in the Monday / first-of-month 17:00 UTC hour, so this
// check exists to stop a second send inside the same period. It must not
// require a full 7 x 24h or 30 x 24h gap: the hourly cron does not start at
// the same millisecond each run, and months are 28 to 31 days long. A full-gap
// rule skipped every other weekly send and every send after a short month.
const WEEKLY_MIN_GAP_MS = 6 * DAY_MS;
const MONTHLY_MIN_GAP_MS = 27 * DAY_MS;

export function reminderIsDue(frequency: 'weekly' | 'monthly', lastSent: Date, now: Date): boolean {
  const gap = now.getTime() - lastSent.getTime();
  return gap >= (frequency === 'weekly' ? WEEKLY_MIN_GAP_MS : MONTHLY_MIN_GAP_MS);
}

async function sendReminderEmails(
  db: AppDatabase,
  mailer: Mailer,
  now: Date,
  report: EmailJobReport,
): Promise<void> {
  if (now.getUTCHours() !== 17) {
    report.skipped += 1;
    return;
  }
  const monday = now.getUTCDay() === 1;
  const firstOfMonth = now.getUTCDate() === 1;
  if (!monday && !firstOfMonth) {
    report.skipped += 1;
    return;
  }

  const rows = await db
    .select({
      userId: profiles.userId,
      email: user.email,
      firstName: profiles.firstName,
      weekly: profiles.reminderWeekly,
      monthly: profiles.reminderMonthly,
      lastSent: profiles.lastReminderSentAt,
      disabled: user.disabled,
    })
    .from(profiles)
    .innerJoin(user, eq(user.id, profiles.userId))
    .where(or(eq(profiles.reminderWeekly, true), eq(profiles.reminderMonthly, true)));

  for (const row of rows) {
    if (row.disabled || !row.email) {
      report.skipped += 1;
      continue;
    }
    const frequency = row.weekly ? 'weekly' : row.monthly ? 'monthly' : null;
    if (!frequency) {
      report.skipped += 1;
      continue;
    }
    if (frequency === 'weekly' && !monday) {
      report.skipped += 1;
      continue;
    }
    if (frequency === 'monthly' && !firstOfMonth) {
      report.skipped += 1;
      continue;
    }
    if (row.lastSent && !reminderIsDue(frequency, row.lastSent, now)) {
      report.skipped += 1;
      continue;
    }

    const claimed = await db
      .update(profiles)
      .set({ lastReminderSentAt: now })
      .where(and(
        eq(profiles.userId, row.userId),
        row.lastSent ? eq(profiles.lastReminderSentAt, row.lastSent) : isNull(profiles.lastReminderSentAt),
      ))
      .returning({ userId: profiles.userId });
    if (claimed.length === 0) {
      report.skipped += 1;
      continue;
    }

    const sent = await sendOrRollback(
      mailer,
      {
        to: row.email,
        templateId: templateId('reminder'),
        dynamicTemplateData: {
          first_name: displayName(row.firstName),
          frequency,
        },
      },
      () => db
        .update(profiles)
        .set({ lastReminderSentAt: row.lastSent })
        .where(and(eq(profiles.userId, row.userId), eq(profiles.lastReminderSentAt, now)))
        .then(() => undefined),
      report,
    );
    if (sent) report.reminderSent += 1;
  }
}
