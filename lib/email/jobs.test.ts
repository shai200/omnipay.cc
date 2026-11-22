import { beforeEach, describe, expect, it, vi } from 'vitest';
import { eq } from 'drizzle-orm';
import { onrampSessions, profiles, user, webhookEvents } from '@/lib/db/schema';
import { openTestDatabase, resetTestData } from '../../test/db';
import { runEmailJobs, type Mailer } from './jobs';

const EMAIL = 'buyer@example.com';
const NOW = new Date(Date.UTC(2026, 10, 16, 17, 5, 0));

function mailer() {
  const sent: Array<{ to: string; templateId: string; dynamicTemplateData: Record<string, string> }> = [];
  const client: Mailer = {
    async send(message) {
      sent.push(message);
    },
  };
  return { client, sent };
}

async function seedUser(id: string, options?: { weekly?: boolean | null; monthly?: boolean | null; disabled?: boolean }) {
  const db = await openTestDatabase();
  await db.insert(user).values({
    id,
    email: `${id}@example.com`,
    name: 'Buyer Example',
    emailVerified: true,
    disabled: options?.disabled ?? false,
  });
  await db.insert(profiles).values({
    userId: id,
    firstName: 'Buyer',
    reminderWeekly: options?.weekly ?? null,
    reminderMonthly: options?.monthly ?? null,
    welcomeEmailSentAt: new Date('2020-01-01T00:00:00.000Z'),
  });
  return db;
}

describe('email jobs', () => {
  beforeEach(async () => {
    await resetTestData();
  });

  it('sends a welcome email once and does not log the address', async () => {
    const db = await seedUser('welcome-user');
    await db.update(profiles).set({ welcomeEmailSentAt: null }).where(eq(profiles.userId, 'welcome-user'));
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const outbound = mailer();

    const first = await runEmailJobs(db, outbound.client, NOW);
    const second = await runEmailJobs(db, outbound.client, NOW);

    expect(first.welcomeSent).toBe(1);
    expect(second.welcomeSent).toBe(0);
    expect(outbound.sent.filter((message) => message.to === 'welcome-user@example.com')).toHaveLength(1);
    const logs = [...logSpy.mock.calls, ...errorSpy.mock.calls].flat().join('\n');
    expect(logs).not.toContain('welcome-user@example.com');
    expect(logs).not.toContain('Buyer');
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('sends the first-purchase email only for one verified completion', async () => {
    const db = await seedUser('buyer');
    await db.insert(webhookEvents).values({
      id: 'evt_complete',
      type: 'crypto.onramp_session.updated',
      sessionId: 'cos_done',
      status: 'fulfillment_complete',
      eventCreated: 100,
      signatureVerified: true,
      applied: true,
    });
    await db.insert(onrampSessions).values({
      id: 'cos_done',
      userId: 'buyer',
      status: 'fulfillment_complete',
      verifiedCompletionEventId: 'evt_complete',
      transactionDetails: { source_amount: '25.00', source_currency: 'usd' },
    });
    const outbound = mailer();
    const report = await runEmailJobs(db, outbound.client, NOW);
    expect(report.firstPurchaseSent).toBe(1);
    expect(outbound.sent.some((message) => message.dynamicTemplateData.transaction_amount === '25.00')).toBe(true);

    await db.insert(webhookEvents).values({
      id: 'evt_second',
      type: 'crypto.onramp_session.updated',
      sessionId: 'cos_second',
      status: 'fulfillment_complete',
      eventCreated: 200,
      signatureVerified: true,
      applied: true,
    });
    await db.insert(onrampSessions).values({
      id: 'cos_second',
      userId: 'buyer',
      status: 'fulfillment_complete',
      verifiedCompletionEventId: 'evt_second',
    });
    await db.update(profiles).set({ firstPurchaseEmailSentAt: null }).where(eq(profiles.userId, 'buyer'));
    const again = mailer();
    const second = await runEmailJobs(db, again.client, NOW);
    expect(second.firstPurchaseSent).toBe(0);
    expect(again.sent).toHaveLength(0);
  });

  it('does not email a completion that was not applied by the webhook', async () => {
    const db = await seedUser('buyer');
    await db.insert(onrampSessions).values({
      id: 'cos_unverified',
      userId: 'buyer',
      status: 'fulfillment_complete',
    });
    const outbound = mailer();
    const report = await runEmailJobs(db, outbound.client, NOW);
    expect(report.firstPurchaseSent).toBe(0);
    expect(outbound.sent).toHaveLength(0);
  });

  it('follows the abandoned-cart schedule without moving the session clock', async () => {
    const db = await seedUser('buyer');
    const updatedAt = new Date(NOW.getTime() - 2 * 60 * 60 * 1000);
    await db.insert(onrampSessions).values({
      id: 'cos_cart',
      userId: 'buyer',
      status: 'requires_payment',
      updatedAt,
      transactionDetails: { source_amount: '40.00' },
    });
    const outbound = mailer();
    expect((await runEmailJobs(db, outbound.client, NOW)).abandonedCartSent).toBe(1);
    const [session] = await db.select().from(onrampSessions).where(eq(onrampSessions.id, 'cos_cart'));
    expect(session?.abandonmentEmailCount).toBe(1);
    expect(session?.updatedAt.toISOString()).toBe(updatedAt.toISOString());
    expect((await runEmailJobs(db, outbound.client, NOW)).abandonedCartSent).toBe(0);

    const later = new Date(updatedAt.getTime() + 4 * 24 * 60 * 60 * 1000);
    expect((await runEmailJobs(db, outbound.client, later)).abandonedCartSent).toBe(1);
    const [after] = await db.select().from(onrampSessions).where(eq(onrampSessions.id, 'cos_cart'));
    expect(after?.abandonmentEmailCount).toBe(2);
  });

  it('sends weekly reminders on Monday at 17:00 UTC and not on other hours', async () => {
    const db = await seedUser('weekly', { weekly: true });
    await seedUser('monthly', { monthly: true });
    const outbound = mailer();
    const early = new Date(Date.UTC(2026, 10, 16, 16, 0, 0));
    expect((await runEmailJobs(db, outbound.client, early)).reminderSent).toBe(0);

    const monday = await runEmailJobs(db, outbound.client, NOW);
    expect(monday.reminderSent).toBe(1);
    expect(outbound.sent.filter((message) => message.to === 'weekly@example.com')).toHaveLength(1);
    expect(outbound.sent.some((message) => message.to === 'monthly@example.com')).toBe(false);

    const first = new Date(Date.UTC(2026, 11, 1, 17, 0, 0));
    const next = mailer();
    expect((await runEmailJobs(db, next.client, first)).reminderSent).toBe(1);
    expect(next.sent.map((message) => message.to)).toEqual(['monthly@example.com']);
  });

  it('sends the next weekly reminder when the cron starts slightly earlier than last week', async () => {
    const db = await seedUser('weekly', { weekly: true });
    const outbound = mailer();
    const lastMonday = new Date(Date.UTC(2026, 10, 9, 17, 0, 42));
    expect((await runEmailJobs(db, outbound.client, lastMonday)).reminderSent).toBe(1);

    // Same hour, a second run must not send again.
    const sameHour = new Date(Date.UTC(2026, 10, 9, 17, 30, 0));
    expect((await runEmailJobs(db, outbound.client, sameHour)).reminderSent).toBe(0);

    // One week later, 40 seconds earlier in the hour than the previous send.
    const thisMonday = new Date(Date.UTC(2026, 10, 16, 17, 0, 2));
    expect((await runEmailJobs(db, outbound.client, thisMonday)).reminderSent).toBe(1);
    expect(outbound.sent).toHaveLength(2);
  });

  it('sends the monthly reminder after a 28-day month', async () => {
    const db = await seedUser('monthly', { monthly: true });
    const outbound = mailer();
    const february = new Date(Date.UTC(2027, 1, 1, 17, 0, 30));
    expect((await runEmailJobs(db, outbound.client, february)).reminderSent).toBe(1);
    const march = new Date(Date.UTC(2027, 2, 1, 17, 0, 5));
    expect((await runEmailJobs(db, outbound.client, march)).reminderSent).toBe(1);
    expect(outbound.sent).toHaveLength(2);
  });

  it('rolls the claim back when sending fails', async () => {
    const db = await seedUser('welcome-user');
    await db.update(profiles).set({ welcomeEmailSentAt: null }).where(eq(profiles.userId, 'welcome-user'));
    const failing: Mailer = {
      async send() {
        throw new Error('smtp down');
      },
    };
    const report = await runEmailJobs(db, failing, NOW);
    expect(report.failed).toBeGreaterThan(0);
    expect(report.welcomeSent).toBe(0);
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, 'welcome-user'));
    expect(profile?.welcomeEmailSentAt).toBeNull();
    expect(EMAIL).not.toBe('');
  });
});
