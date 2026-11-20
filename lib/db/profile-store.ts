import { eq } from 'drizzle-orm';
import type { AppDatabase } from '@/lib/db/client';
import { profiles, user } from '@/lib/db/schema';
import {
  splitDisplayName,
  type ProfilePatch,
  type PublicProfile,
} from '@/lib/profile';

type ProfileRow = typeof profiles.$inferSelect;
type UserRow = typeof user.$inferSelect;

function textOrUndefined(value: string | null): string | undefined {
  return value && value.length > 0 ? value : undefined;
}

export function toPublicProfile(row: ProfileRow | undefined, email: string | null | undefined): PublicProfile | null {
  if (!row && !email) return null;
  const profile: PublicProfile = {};
  if (email) profile.email = email;
  if (!row) return profile;

  const firstName = textOrUndefined(row.firstName);
  const lastName = textOrUndefined(row.lastName);
  if (firstName) profile.first_name = firstName;
  if (lastName) profile.last_name = lastName;

  if (row.dobYear != null && row.dobMonth != null && row.dobDay != null) {
    profile.dob = { year: row.dobYear, month: row.dobMonth, day: row.dobDay };
  }

  const address = {
    country: textOrUndefined(row.addressCountry),
    line1: textOrUndefined(row.addressLine1),
    line2: textOrUndefined(row.addressLine2),
    city: textOrUndefined(row.addressCity),
    state: textOrUndefined(row.addressState),
    postal_code: textOrUndefined(row.addressPostalCode),
  };
  if (Object.values(address).some((value) => value)) profile.address = address;

  if (row.reminderWeekly != null) profile.reminder_weekly = row.reminderWeekly;
  if (row.reminderMonthly != null) profile.reminder_monthly = row.reminderMonthly;
  if (row.reminderPriceDrop != null) profile.reminder_price_drop = row.reminderPriceDrop;

  const wallets: { [key: string]: string } = {};
  const bitcoin = textOrUndefined(row.walletBitcoin);
  const ethereum = textOrUndefined(row.walletEthereum);
  if (bitcoin) wallets.bitcoin = bitcoin;
  if (ethereum) wallets.ethereum = ethereum;
  if (Object.keys(wallets).length > 0) profile.wallet_addresses = wallets;

  profile.lock_wallet_address = row.lockWalletAddress;
  const currency = textOrUndefined(row.sourceCurrency);
  const amount = textOrUndefined(row.sourceAmount);
  if (currency) profile.source_currency = currency;
  if (amount) profile.source_amount = amount;
  return profile;
}

export async function getOwnedProfile(db: AppDatabase, userId: string): Promise<PublicProfile | null> {
  const [row] = await db
    .select({ profile: profiles, email: user.email, disabled: user.disabled })
    .from(user)
    .leftJoin(profiles, eq(profiles.userId, user.id))
    .where(eq(user.id, userId))
    .limit(1);
  if (!row || row.disabled) return null;
  return toPublicProfile(row.profile ?? undefined, row.email);
}

export async function getCheckoutProfile(
  db: AppDatabase,
  userId: string,
): Promise<PublicProfile | undefined> {
  const profile = await getOwnedProfile(db, userId);
  return profile ?? undefined;
}

export async function ensureProfile(db: AppDatabase, account: Pick<UserRow, 'id' | 'name'>): Promise<void> {
  const names = splitDisplayName(account.name);
  await db.insert(profiles).values({
    userId: account.id,
    firstName: names.firstName,
    lastName: names.lastName,
  }).onConflictDoNothing();
}

export async function updateOwnedProfile(db: AppDatabase, userId: string, patch: ProfilePatch): Promise<PublicProfile | null> {
  const [owner] = await db
    .select({ id: user.id, email: user.email, disabled: user.disabled })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  if (!owner || owner.disabled) return null;

  await ensureProfile(db, { id: owner.id, name: 'Account' });

  const values: Partial<typeof profiles.$inferInsert> = { updatedAt: new Date() };
  if (patch.firstName !== undefined) values.firstName = patch.firstName;
  if (patch.lastName !== undefined) values.lastName = patch.lastName;
  if (patch.dob !== undefined) {
    values.dobYear = patch.dob?.year ?? null;
    values.dobMonth = patch.dob?.month ?? null;
    values.dobDay = patch.dob?.day ?? null;
  }
  if (patch.address) {
    if (patch.address.country !== undefined) values.addressCountry = patch.address.country;
    if (patch.address.line1 !== undefined) values.addressLine1 = patch.address.line1;
    if (patch.address.line2 !== undefined) values.addressLine2 = patch.address.line2;
    if (patch.address.city !== undefined) values.addressCity = patch.address.city;
    if (patch.address.state !== undefined) values.addressState = patch.address.state;
    if (patch.address.postalCode !== undefined) values.addressPostalCode = patch.address.postalCode;
  }
  if (patch.walletsProvided) {
    values.walletBitcoin = patch.walletBitcoin ?? null;
    values.walletEthereum = patch.walletEthereum ?? null;
  }
  if (patch.lockWalletAddress !== undefined) values.lockWalletAddress = patch.lockWalletAddress;
  if (patch.sourceCurrency !== undefined) values.sourceCurrency = patch.sourceCurrency;
  if (patch.sourceAmount !== undefined) values.sourceAmount = patch.sourceAmount;
  if (patch.reminderWeekly !== undefined) values.reminderWeekly = patch.reminderWeekly;
  if (patch.reminderMonthly !== undefined) values.reminderMonthly = patch.reminderMonthly;
  if (patch.reminderPriceDrop !== undefined) values.reminderPriceDrop = patch.reminderPriceDrop;

  await db.update(profiles).set(values).where(eq(profiles.userId, userId));
  return getOwnedProfile(db, userId);
}
