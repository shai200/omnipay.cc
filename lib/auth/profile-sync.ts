import type { PublicProfile } from '@/lib/profile';

// Framework-free pieces of AuthContext's profile state, kept here so the
// ordering rules can be unit tested without a DOM.

/** The profile last loaded or saved, and the user it belongs to. */
export type LoadedProfile = {
  userId: string;
  profile: PublicProfile | null;
  error: string | null;
};

/**
 * Hands out increasing tokens for profile reads and writes. Only the newest
 * request may replace the stored profile, so a read that was started by a
 * session change cannot finish after a profile write and overwrite it.
 */
export class ProfileRequests {
  private latest = 0;

  begin(): number {
    this.latest += 1;
    return this.latest;
  }

  isLatest(token: number): boolean {
    return token === this.latest;
  }

  /** Drops every request in flight (used on sign-out). */
  invalidate(): void {
    this.latest += 1;
  }
}

/**
 * State after a profile read finishes. A superseded read is still used when
 * nothing newer is stored for this user, so the first load always settles
 * `loading`; it never replaces a newer write for the same user.
 */
export function settleProfileRead(
  previous: LoadedProfile | null,
  next: LoadedProfile,
  superseded: boolean,
): LoadedProfile {
  if (superseded && previous?.userId === next.userId) return previous;
  return next;
}

export type DerivedAuthState = {
  profile: PublicProfile | null;
  profileError: string | null;
  /** True until the session is known and, if signed in, the profile has loaded once. */
  loading: boolean;
};

export function deriveAuthState(input: {
  isPending: boolean;
  sessionUserId: string | null;
  loaded: LoadedProfile | null;
}): DerivedAuthState {
  const { isPending, sessionUserId, loaded } = input;
  const current = sessionUserId !== null && loaded !== null && loaded.userId === sessionUserId;
  return {
    profile: current ? loaded.profile : null,
    profileError: current ? loaded.error : null,
    loading: isPending || (sessionUserId !== null && !current),
  };
}
