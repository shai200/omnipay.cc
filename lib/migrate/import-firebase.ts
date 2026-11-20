import { and, eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import type { AppDatabase } from '@/lib/db/client';
import {
  account,
  legacyOnrampEvents,
  onrampSessions,
  profiles,
  user,
  webhookEvents,
  type StatusHistoryEntry,
} from '@/lib/db/schema';
import { encodeFirebaseScryptHash, isBcryptHash, isFirebaseScryptHash } from '@/lib/auth/password';
import { parseDob } from '@/lib/age';
import { sanitizeTransactionDetails } from '@/lib/onramp-webhook';
import { classifyWalletAddress } from '@/lib/wallet';
import type { FirebaseSnapshot, FirestoreDocExport, ImportCounts } from '@/lib/migrate/types';

const KNOWN_PROFILE_KEYS = new Set([
  'email',
  'first_name',
  'firstName',
  'last_name',
  'lastName',
  'dob',
  'address',
  'reminder_monthly',
  'reminder_weekly',
  'reminder_price_drop',
  'reminderFrequency',
  'lastReminderSent',
  'wallet_addresses',
  'lock_wallet_address',
  'source_currency',
  'source_amount',
  'createdAt',
  'updatedAt',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function text(value: unknown, max = 500): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return null;
  return trimmed;
}

function booleanOrNull(value: unknown): boolean | null {
  return typeof value === 'boolean' ? value : null;
}

function timestamp(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  if (isRecord(value) && typeof value._seconds === 'number') {
    const date = new Date(value._seconds * 1000);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return null;
}

function leftover(data: Record<string, unknown>, known: Set<string>): Record<string, unknown> {
  const extra: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (!known.has(key)) extra[key] = value;
  }
  return extra;
}

function history(value: unknown): StatusHistoryEntry[] {
  if (!Array.isArray(value)) return [];
  const entries: StatusHistoryEntry[] = [];
  for (const item of value) {
    if (!isRecord(item)) continue;
    const status = text(item.status, 64);
    const eventId = text(item.eventId, 128);
    const at = text(item.timestamp, 40) ?? (timestamp(item.timestamp)?.toISOString() ?? null);
    if (!status || !eventId || !at) continue;
    entries.push({ status, eventId, timestamp: at });
  }
  return entries;
}

function emptyCounts(): ImportCounts {
  return {
    users: 0,
    accounts: 0,
    profiles: 0,
    sessions: 0,
    webhookEvents: 0,
    legacyEvents: 0,
    skippedUsers: 0,
    orphanSessions: 0,
  };
}

export async function importFirebaseSnapshot(db: AppDatabase, snapshot: FirebaseSnapshot): Promise<ImportCounts> {
  const counts = emptyCounts();
  const profileDocs = new Map(snapshot.users.map((doc) => [doc.id, doc.data]));
  const importedUsers = new Set<string>();
  const completedUserIds = new Set(
    snapshot.onrampSessions
      .filter((doc) => doc.data.status === 'fulfillment_complete' && typeof doc.data.userId === 'string')
      .map((doc) => doc.data.userId as string),
  );

  for (const authUser of snapshot.authUsers) {
    const email = text(authUser.email, 320)?.toLowerCase() ?? null;
    if (!authUser.uid || !email) {
      counts.skippedUsers += 1;
      continue;
    }
    const profile = profileDocs.get(authUser.uid) ?? {};
    const createdAt = timestamp(authUser.createdAt) ?? timestamp(profile.createdAt) ?? new Date();
    const name = text(authUser.displayName, 200)
      ?? [text(profile.first_name, 100), text(profile.last_name, 100)].filter(Boolean).join(' ')
      ?? 'Account';

    await db.insert(user).values({
      id: authUser.uid,
      email,
      name,
      emailVerified: authUser.emailVerified === true,
      image: text(authUser.photoURL, 2000),
      disabled: authUser.disabled === true,
      createdAt,
      updatedAt: timestamp(profile.updatedAt) ?? createdAt,
    }).onConflictDoUpdate({
      target: user.id,
      set: {
        email,
        name,
        emailVerified: authUser.emailVerified === true,
        image: text(authUser.photoURL, 2000),
        disabled: authUser.disabled === true,
        updatedAt: new Date(),
      },
    });
    importedUsers.add(authUser.uid);
    counts.users += 1;

    if (authUser.passwordHash && authUser.passwordSalt) {
      await upsertCredential(db, authUser.uid, encodeFirebaseScryptHash(authUser.passwordHash, authUser.passwordSalt), createdAt);
      counts.accounts += 1;
    }

    for (const provider of authUser.providerData ?? []) {
      if (provider.providerId !== 'google.com' || !provider.uid) continue;
      await upsertAccount(db, {
        userId: authUser.uid,
        providerId: 'google',
        accountId: provider.uid,
        createdAt,
      });
      counts.accounts += 1;
    }

    await upsertProfile(db, authUser.uid, profile, createdAt, completedUserIds.has(authUser.uid));
    counts.profiles += 1;
  }

  for (const doc of snapshot.users) {
    if (importedUsers.has(doc.id)) continue;
    const email = text(doc.data.email, 320)?.toLowerCase();
    if (!email) {
      counts.skippedUsers += 1;
      continue;
    }
    const createdAt = timestamp(doc.data.createdAt) ?? new Date();
    await db.insert(user).values({
      id: doc.id,
      email,
      name: [text(doc.data.first_name, 100), text(doc.data.last_name, 100)].filter(Boolean).join(' ') || 'Account',
      emailVerified: false,
      disabled: false,
      createdAt,
      updatedAt: timestamp(doc.data.updatedAt) ?? createdAt,
    }).onConflictDoNothing();
    importedUsers.add(doc.id);
    await upsertProfile(db, doc.id, doc.data, createdAt, completedUserIds.has(doc.id));
    counts.users += 1;
    counts.profiles += 1;
  }

  for (const doc of snapshot.onrampSessions) {
    const orphan = await upsertSession(db, doc, importedUsers);
    if (orphan) counts.orphanSessions += 1;
    counts.sessions += 1;
  }

  for (const doc of snapshot.webhookEvents) {
    await upsertWebhook(db, doc);
    counts.webhookEvents += 1;
  }

  for (const doc of snapshot.onrampEvents) {
    const userId = text(doc.data.userId, 128);
    await db.insert(legacyOnrampEvents).values({
      id: doc.id,
      userId: userId && importedUsers.has(userId) ? userId : null,
      payload: doc.data,
    }).onConflictDoNothing();
    counts.legacyEvents += 1;
  }

  return counts;
}

async function upsertCredential(db: AppDatabase, userId: string, nextPassword: string, createdAt: Date): Promise<void> {
  const [existing] = await db
    .select({ password: account.password })
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, 'credential')))
    .limit(1);
  if (existing?.password && isBcryptHash(existing.password) && isFirebaseScryptHash(nextPassword)) {
    return;
  }
  await upsertAccount(db, {
    userId,
    providerId: 'credential',
    accountId: userId,
    password: nextPassword,
    createdAt,
  });
}

async function upsertAccount(
  db: AppDatabase,
  input: { userId: string; providerId: string; accountId: string; password?: string; createdAt: Date },
): Promise<void> {
  const [existing] = await db
    .select({ id: account.id, password: account.password })
    .from(account)
    .where(and(eq(account.providerId, input.providerId), eq(account.accountId, input.accountId)))
    .limit(1);
  if (!existing) {
    await db.insert(account).values({
      id: randomUUID(),
      userId: input.userId,
      providerId: input.providerId,
      accountId: input.accountId,
      password: input.password ?? null,
      createdAt: input.createdAt,
      updatedAt: input.createdAt,
    });
    return;
  }
  const keepPassword = existing.password && isBcryptHash(existing.password) && input.password && isFirebaseScryptHash(input.password);
  await db.update(account).set({
    userId: input.userId,
    password: keepPassword ? existing.password : (input.password ?? existing.password),
    updatedAt: new Date(),
  }).where(eq(account.id, existing.id));
}

async function upsertProfile(
  db: AppDatabase,
  userId: string,
  data: Record<string, unknown>,
  createdAt: Date,
  alreadyCompleted: boolean,
): Promise<void> {
  const dob = parseDob(data.dob);
  const address = isRecord(data.address) ? data.address : {};
  const wallets = isRecord(data.wallet_addresses) ? data.wallet_addresses : {};
  const bitcoin = text(wallets.bitcoin, 120);
  const ethereum = text(wallets.ethereum, 120);
  const frequency = text(data.reminderFrequency, 16);
  const weekly = booleanOrNull(data.reminder_weekly) ?? (frequency === 'weekly' ? true : null);
  const monthly = booleanOrNull(data.reminder_monthly) ?? (frequency === 'monthly' ? true : null);

  await db.insert(profiles).values({
    userId,
    firstName: text(data.first_name, 100) ?? text(data.firstName, 100),
    lastName: text(data.last_name, 100) ?? text(data.lastName, 100),
    dobYear: dob?.year ?? null,
    dobMonth: dob?.month ?? null,
    dobDay: dob?.day ?? null,
    addressCountry: text(address.country, 2)?.toUpperCase() ?? null,
    addressLine1: text(address.line1, 200),
    addressLine2: text(address.line2, 200),
    addressCity: text(address.city, 200),
    addressState: text(address.state, 200),
    addressPostalCode: text(address.postal_code, 32),
    walletBitcoin: bitcoin && classifyWalletAddress(bitcoin) === 'bitcoin' ? bitcoin : null,
    walletEthereum: ethereum && classifyWalletAddress(ethereum) === 'ethereum' ? ethereum : null,
    lockWalletAddress: data.lock_wallet_address === true,
    sourceCurrency: text(data.source_currency, 3)?.toLowerCase() ?? null,
    sourceAmount: text(data.source_amount, 16),
    reminderWeekly: weekly,
    reminderMonthly: monthly,
    reminderPriceDrop: booleanOrNull(data.reminder_price_drop),
    lastReminderSentAt: timestamp(data.lastReminderSent),
    // Registration mail already ran in Cloud Functions. Do not send it again.
    welcomeEmailSentAt: createdAt,
    firstPurchaseEmailSentAt: alreadyCompleted ? createdAt : null,
    legacy: leftover(data, KNOWN_PROFILE_KEYS),
    createdAt,
    updatedAt: timestamp(data.updatedAt) ?? createdAt,
  }).onConflictDoUpdate({
    target: profiles.userId,
    set: {
      firstName: text(data.first_name, 100) ?? text(data.firstName, 100),
      lastName: text(data.last_name, 100) ?? text(data.lastName, 100),
      dobYear: dob?.year ?? null,
      dobMonth: dob?.month ?? null,
      dobDay: dob?.day ?? null,
      addressCountry: text(address.country, 2)?.toUpperCase() ?? null,
      addressLine1: text(address.line1, 200),
      addressLine2: text(address.line2, 200),
      addressCity: text(address.city, 200),
      addressState: text(address.state, 200),
      addressPostalCode: text(address.postal_code, 32),
      walletBitcoin: bitcoin && classifyWalletAddress(bitcoin) === 'bitcoin' ? bitcoin : null,
      walletEthereum: ethereum && classifyWalletAddress(ethereum) === 'ethereum' ? ethereum : null,
      lockWalletAddress: data.lock_wallet_address === true,
      sourceCurrency: text(data.source_currency, 3)?.toLowerCase() ?? null,
      sourceAmount: text(data.source_amount, 16),
      reminderWeekly: weekly,
      reminderMonthly: monthly,
      reminderPriceDrop: booleanOrNull(data.reminder_price_drop),
      lastReminderSentAt: timestamp(data.lastReminderSent),
      updatedAt: new Date(),
    },
  });
}

async function upsertSession(db: AppDatabase, doc: FirestoreDocExport, users: Set<string>): Promise<boolean> {
  const data = doc.data;
  const requestedUser = text(data.userId, 128);
  const userId = requestedUser && users.has(requestedUser) ? requestedUser : null;
  const createdAt = timestamp(data.createdAt) ?? new Date();
  const updatedAt = timestamp(data.lastUpdated) ?? timestamp(data.updatedAt) ?? createdAt;
  const status = text(data.status, 64);
  const marker = text(data.verifiedCompletionEventId, 128);
  const [existing] = await db.select().from(onrampSessions).where(eq(onrampSessions.id, doc.id)).limit(1);
  const keepComplete = existing?.status === 'fulfillment_complete' || Boolean(existing?.verifiedCompletionEventId);

  const values = {
    userId: existing?.userId ?? userId,
    status: keepComplete ? existing?.status ?? 'fulfillment_complete' : status,
    lastStatus: keepComplete ? existing?.lastStatus ?? existing?.status ?? null : text(data.lastStatus, 64) ?? status,
    statusEventCreated: keepComplete ? existing?.statusEventCreated ?? null : numberOrNull(data.statusEventCreated),
    statusEventId: keepComplete ? existing?.statusEventId ?? null : text(data.statusEventId, 128),
    verifiedCompletionEventId: existing?.verifiedCompletionEventId ?? marker,
    transactionDetails: sanitizeTransactionDetails(data.transactionDetails),
    statusHistory: keepComplete ? existing?.statusHistory ?? [] : history(data.statusHistory),
    abandonmentEmailCount: numberOrNull(data.abandonmentEmailCount) ?? existing?.abandonmentEmailCount ?? 0,
    lastAbandonmentEmailSentAt: timestamp(data.lastAbandonmentEmailSent) ?? existing?.lastAbandonmentEmailSentAt ?? null,
    legacy: leftover(data, new Set([
      'sessionId', 'userId', 'status', 'lastStatus', 'statusEventCreated', 'statusEventId',
      'verifiedCompletionEventId', 'transactionDetails', 'statusHistory', 'abandonmentEmailCount',
      'lastAbandonmentEmailSent', 'abandonmentEmailSent', 'createdAt', 'lastUpdated', 'updatedAt',
    ])),
    updatedAt,
  };

  if (!existing) {
    await db.insert(onrampSessions).values({
      id: doc.id,
      createdAt,
      ...values,
    });
  } else {
    await db.update(onrampSessions).set(values).where(eq(onrampSessions.id, doc.id));
  }
  return Boolean(requestedUser) && !userId;
}

function numberOrNull(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? Math.trunc(value) : null;
}

async function upsertWebhook(db: AppDatabase, doc: FirestoreDocExport): Promise<void> {
  const data = doc.data;
  const sessionId = text(data.sessionId, 128);
  const status = text(data.status, 64);
  const type = text(data.type, 128);
  const eventCreated = numberOrNull(data.eventCreated);
  if (!sessionId || !status || !type || eventCreated == null) return;
  await db.insert(webhookEvents).values({
    id: doc.id,
    type,
    sessionId,
    status,
    eventCreated,
    signatureVerified: data.signatureVerified === true,
    applied: data.applied === true,
    processedAt: timestamp(data.processedAt) ?? new Date(),
  }).onConflictDoNothing();
}
