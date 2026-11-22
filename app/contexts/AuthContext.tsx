'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { authClient } from '@/lib/auth/client';
import { deriveAuthState, ProfileRequests, settleProfileRead, type LoadedProfile } from '@/lib/auth/profile-sync';
import { parseProfilePatch, type PublicProfile } from '@/lib/profile';

export type AuthUser = {
  uid: string;
  email: string | null;
};

interface AuthContextType {
  user: AuthUser | null;
  profile: PublicProfile | null;
  /** True until the session and, for a signed-in user, their profile have loaded. */
  loading: boolean;
  /** Set when the signed-in user's profile could not be loaded. */
  profileError: string | null;
  signUp: (email: string, password: string, profile: PublicProfile) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (callbackURL?: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  updateProfile: (profile: PublicProfile) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PROFILE_LOAD_ERROR = 'Unable to load profile.';

function authError(message: string | undefined, fallback: string): Error {
  if (!message || message.length > 200) return new Error(fallback);
  return new Error(message);
}

async function readProfile(): Promise<PublicProfile | null> {
  const response = await fetch('/api/profile', { credentials: 'same-origin', cache: 'no-store' });
  if (response.status === 401) return null;
  if (!response.ok) {
    throw new Error(PROFILE_LOAD_ERROR);
  }
  const body = await response.json() as { profile?: PublicProfile | null };
  return body.profile ?? null;
}

async function writeProfile(profileData: PublicProfile, fallback: string): Promise<PublicProfile | null> {
  const response = await fetch('/api/profile', {
    method: 'PUT',
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(profileData),
  });
  const body = await response.json().catch(() => ({})) as { error?: string; profile?: PublicProfile };
  if (!response.ok) {
    throw new Error(body.error || fallback);
  }
  return body.profile ?? null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isPending } = authClient.useSession();
  const sessionUserId = data?.user?.id ?? null;
  const sessionEmail = data?.user?.email ?? null;

  const [loaded, setLoaded] = useState<LoadedProfile | null>(null);
  // Orders profile reads and writes. Without it, the read started when
  // sign-up creates the session could finish after the sign-up profile write
  // and replace the saved profile (wallet, amount) with the empty one. The
  // buy widget then created a Stripe onramp session with defaults and a
  // second one once the real profile came back.
  const [requests] = useState(() => new ProfileRequests());
  const userIdRef = useRef<string | null>(sessionUserId);
  useEffect(() => {
    userIdRef.current = sessionUserId;
  }, [sessionUserId]);

  useEffect(() => {
    // Signed out: nothing to load. The values below are derived from the
    // session uid, so stale profile state is never exposed.
    if (isPending || !sessionUserId) return;
    const token = requests.begin();
    let cancelled = false;

    readProfile()
      .then(
        (profile) => ({ userId: sessionUserId, profile, error: null }),
        () => ({ userId: sessionUserId, profile: null, error: PROFILE_LOAD_ERROR }),
      )
      .then((next: LoadedProfile) => {
        if (cancelled) return;
        setLoaded((previous) => settleProfileRead(previous, next, !requests.isLatest(token)));
      });

    return () => {
      cancelled = true;
    };
  }, [isPending, sessionUserId, requests]);

  const user = useMemo<AuthUser | null>(
    () => (sessionUserId ? { uid: sessionUserId, email: sessionEmail } : null),
    [sessionUserId, sessionEmail],
  );
  const { profile, profileError, loading } = deriveAuthState({ isPending, sessionUserId, loaded });

  const signUp = useCallback(async (email: string, password: string, profileData: PublicProfile) => {
    // Validate the profile (including the 18+ date-of-birth rule) before the
    // account exists. Otherwise a rejected profile leaves a half-created,
    // signed-in account and a retry fails with "user already exists".
    const check = parseProfilePatch(profileData);
    if (!check.ok) {
      throw new Error(check.error);
    }

    const name = [profileData.first_name, profileData.last_name].filter(Boolean).join(' ') || 'Account';
    const result = await authClient.signUp.email({ email, password, name });
    if (result.error) {
      throw authError(result.error.message, 'Unable to create an account.');
    }

    const token = requests.begin();
    const saved = await writeProfile(profileData, 'Account created, but the profile could not be saved.');
    const userId = result.data?.user.id;
    if (userId && requests.isLatest(token)) {
      setLoaded({ userId, profile: saved, error: null });
    }
  }, [requests]);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await authClient.signIn.email({ email, password });
    if (result.error) {
      throw authError(result.error.message, 'Invalid email or password.');
    }
  }, []);

  const signInWithGoogle = useCallback(async (callbackURL = '/') => {
    const result = await authClient.signIn.social({ provider: 'google', callbackURL });
    if (result.error) {
      throw authError(result.error.message, 'Google sign-in failed.');
    }
  }, []);

  const signOutUser = useCallback(async () => {
    requests.invalidate();
    await authClient.signOut();
    setLoaded(null);
  }, [requests]);

  const updateProfile = useCallback(async (profileData: PublicProfile) => {
    const token = requests.begin();
    const saved = await writeProfile(profileData, 'Failed to update.');
    const userId = userIdRef.current;
    if (userId && requests.isLatest(token)) {
      setLoaded({ userId, profile: saved, error: null });
    }
  }, [requests]);

  const refreshProfile = useCallback(async () => {
    const userId = userIdRef.current;
    if (!userId) return;
    const token = requests.begin();
    try {
      const next = await readProfile();
      if (requests.isLatest(token)) setLoaded({ userId, profile: next, error: null });
    } catch (error) {
      if (requests.isLatest(token)) {
        setLoaded((previous) => ({
          userId,
          profile: previous?.userId === userId ? previous.profile : null,
          error: PROFILE_LOAD_ERROR,
        }));
      }
      throw error;
    }
  }, [requests]);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      profileError,
      signUp,
      signIn,
      signInWithGoogle,
      signOutUser,
      updateProfile,
      refreshProfile,
    }),
    [user, profile, loading, profileError, signUp, signIn, signInWithGoogle, signOutUser, updateProfile, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
