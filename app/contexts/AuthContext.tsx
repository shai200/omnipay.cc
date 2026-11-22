'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { authClient } from '@/lib/auth/client';
import type { PublicProfile } from '@/lib/profile';
import type { ProfileUpdate } from '@/lib/profile-form';

export type AuthUser = {
  uid: string;
  email: string | null;
};

// Thrown by signUp when the account exists but the profile write failed.
// The caller must not try to create the account a second time.
export class ProfileSaveError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProfileSaveError';
  }
}

interface AuthContextType {
  user: AuthUser | null;
  profile: PublicProfile | null;
  // True until the session is known and, for a signed-in user, the profile
  // has been read once. Consumers can rely on `profile` being final when
  // this is false.
  loading: boolean;
  signUp: (email: string, password: string, profile: ProfileUpdate | null) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (callbackURL?: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  updateProfile: (profile: ProfileUpdate) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function authError(message: string | undefined, fallback: string): Error {
  if (!message || message.length > 200) return new Error(fallback);
  return new Error(message);
}

async function readProfile(): Promise<PublicProfile | null> {
  const response = await fetch('/api/profile', { credentials: 'same-origin', cache: 'no-store' });
  if (response.status === 401) return null;
  if (!response.ok) {
    throw new Error('Unable to load profile.');
  }
  const body = await response.json() as { profile?: PublicProfile | null };
  return body.profile ?? null;
}

async function writeProfile(profileData: ProfileUpdate): Promise<
  { ok: true; profile: PublicProfile | null } | { ok: false; error: string | undefined }
> {
  const response = await fetch('/api/profile', {
    method: 'PUT',
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(profileData),
  });
  const body = await response.json().catch(() => ({})) as { error?: string; profile?: PublicProfile };
  if (!response.ok) return { ok: false, error: body.error };
  return { ok: true, profile: body.profile ?? null };
}

type LoadedProfile = { userId: string; profile: PublicProfile | null };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isPending } = authClient.useSession();
  const sessionUserId = data?.user?.id ?? null;
  const sessionEmail = data?.user?.email ?? null;

  const [loaded, setLoaded] = useState<LoadedProfile | null>(null);
  // Counts profile reads and writes. A read that finishes after a newer
  // write must not replace what that write stored.
  const requestRef = useRef(0);
  const userIdRef = useRef<string | null>(sessionUserId);
  useEffect(() => {
    userIdRef.current = sessionUserId;
  }, [sessionUserId]);

  useEffect(() => {
    if (!sessionUserId) return;
    let cancelled = false;
    const request = ++requestRef.current;

    readProfile()
      .catch(() => null)
      .then((nextProfile) => {
        if (cancelled) return;
        setLoaded((previous) => {
          const superseded = requestRef.current !== request;
          if (superseded && previous?.userId === sessionUserId) return previous;
          return { userId: sessionUserId, profile: nextProfile };
        });
      });

    return () => {
      cancelled = true;
    };
  }, [sessionUserId]);

  const user = useMemo<AuthUser | null>(
    () => (sessionUserId ? { uid: sessionUserId, email: sessionEmail } : null),
    [sessionUserId, sessionEmail],
  );
  const profileReady = sessionUserId != null && loaded?.userId === sessionUserId;
  const profile = profileReady ? loaded.profile : null;
  const loading = isPending || (sessionUserId != null && !profileReady);

  const signUp = useCallback(async (email: string, password: string, profileData: ProfileUpdate | null) => {
    const name = [profileData?.first_name, profileData?.last_name].filter(Boolean).join(' ') || 'Account';
    const result = await authClient.signUp.email({ email, password, name });
    if (result.error) {
      throw authError(result.error.message, 'Unable to create an account.');
    }
    if (!profileData) return;

    const request = ++requestRef.current;
    const saved = await writeProfile(profileData);
    if (!saved.ok) {
      throw new ProfileSaveError(saved.error || 'Account created, but the profile could not be saved.');
    }
    const userId = result.data?.user.id;
    if (userId && requestRef.current === request) {
      setLoaded({ userId, profile: saved.profile });
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await authClient.signIn.email({ email, password });
    if (result.error) {
      throw authError(result.error.message, 'Invalid email or password.');
    }
  }, []);

  const signInWithGoogle = useCallback(async (callbackURL: string = '/') => {
    const result = await authClient.signIn.social({ provider: 'google', callbackURL });
    if (result.error) {
      throw authError(result.error.message, 'Google sign-in failed.');
    }
  }, []);

  const signOutUser = useCallback(async () => {
    requestRef.current += 1;
    await authClient.signOut();
    setLoaded(null);
  }, []);

  const updateProfile = useCallback(async (profileData: ProfileUpdate) => {
    const request = ++requestRef.current;
    const saved = await writeProfile(profileData);
    if (!saved.ok) {
      throw new Error(saved.error || 'Failed to update.');
    }
    const userId = userIdRef.current;
    if (userId && requestRef.current === request) {
      setLoaded({ userId, profile: saved.profile });
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    const userId = userIdRef.current;
    if (!userId) return;
    const request = ++requestRef.current;
    const nextProfile = await readProfile();
    if (requestRef.current === request) {
      setLoaded({ userId, profile: nextProfile });
    }
  }, []);

  const value = useMemo(
    () => ({ user, profile, loading, signUp, signIn, signInWithGoogle, signOutUser, updateProfile, refreshProfile }),
    [user, profile, loading, signUp, signIn, signInWithGoogle, signOutUser, updateProfile, refreshProfile],
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
