'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authClient } from '@/lib/auth/client';
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

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  // The uid whose profile is in `profile`. While it differs from the session
  // uid the profile is still loading, so pages must not treat it as empty.
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  useEffect(() => {
    if (isPending) return;
    let cancelled = false;

    // Signed out: nothing to load. The values below are derived from the
    // session uid, so stale profile state is never exposed.
    if (!sessionUserId) return;

    readProfile()
      .then((nextProfile) => {
        if (cancelled) return;
        setProfile(nextProfile);
        setProfileError(null);
      })
      .catch(() => {
        if (cancelled) return;
        setProfile(null);
        setProfileError(PROFILE_LOAD_ERROR);
      })
      .finally(() => {
        if (!cancelled) setLoadedFor(sessionUserId);
      });

    return () => {
      cancelled = true;
    };
  }, [isPending, sessionUserId]);

  const user = useMemo<AuthUser | null>(
    () => (sessionUserId ? { uid: sessionUserId, email: sessionEmail } : null),
    [sessionUserId, sessionEmail],
  );
  const loading = isPending || (sessionUserId !== null && loadedFor !== sessionUserId);
  const current = sessionUserId !== null && loadedFor === sessionUserId;
  const visibleProfile = current ? profile : null;
  const visibleProfileError = current ? profileError : null;

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

    const saved = await writeProfile(profileData, 'Account created, but the profile could not be saved.');
    setProfile(saved);
    setProfileError(null);
    if (result.data?.user.id) setLoadedFor(result.data.user.id);
  }, []);

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
    await authClient.signOut();
    setProfile(null);
    setProfileError(null);
    setLoadedFor(null);
  }, []);

  const updateProfile = useCallback(async (profileData: PublicProfile) => {
    const saved = await writeProfile(profileData, 'Failed to update.');
    setProfile(saved);
    setProfileError(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!sessionUserId) return;
    try {
      setProfile(await readProfile());
      setProfileError(null);
    } catch (error) {
      setProfileError(PROFILE_LOAD_ERROR);
      throw error;
    }
  }, [sessionUserId]);

  const value = useMemo(
    () => ({
      user,
      profile: visibleProfile,
      loading,
      profileError: visibleProfileError,
      signUp,
      signIn,
      signInWithGoogle,
      signOutUser,
      updateProfile,
      refreshProfile,
    }),
    [user, visibleProfile, loading, visibleProfileError, signUp, signIn, signInWithGoogle, signOutUser, updateProfile, refreshProfile],
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
