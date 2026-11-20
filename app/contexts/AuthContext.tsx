'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authClient } from '@/lib/auth/client';
import type { PublicProfile } from '@/lib/profile';

export type AuthUser = {
  uid: string;
  email: string | null;
};

interface AuthContextType {
  user: AuthUser | null;
  profile: PublicProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, profile: PublicProfile) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  updateProfile: (profile: PublicProfile) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function authError(message: string | undefined, fallback: string): Error {
  if (!message || message.length > 200) return new Error(fallback);
  return new Error(message);
}

async function readProfile(): Promise<PublicProfile | null> {
  const response = await fetch('/api/profile', { credentials: 'same-origin' });
  if (response.status === 401) return null;
  if (!response.ok) {
    throw new Error('Unable to load profile.');
  }
  const body = await response.json() as { profile?: PublicProfile | null };
  return body.profile ?? null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isPending } = authClient.useSession();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (isPending) return;
      const sessionUser = data?.user;
      if (!sessionUser) {
        if (!cancelled) {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      if (!cancelled) {
        setUser({ uid: sessionUser.id, email: sessionUser.email ?? null });
      }

      try {
        const nextProfile = await readProfile();
        if (!cancelled) setProfile(nextProfile);
      } catch {
        if (!cancelled) setProfile(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [isPending, data?.user]);

  const signUp = async (email: string, password: string, profileData: PublicProfile) => {
    const name = [profileData.first_name, profileData.last_name].filter(Boolean).join(' ') || 'Account';
    const result = await authClient.signUp.email({ email, password, name });
    if (result.error) {
      throw authError(result.error.message, 'Unable to create an account.');
    }

    const response = await fetch('/api/profile', {
      method: 'PUT',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    const body = await response.json().catch(() => ({})) as { error?: string; profile?: PublicProfile };
    if (!response.ok) {
      throw new Error(body.error || 'Account created, but the profile could not be saved.');
    }
    setUser({ uid: result.data?.user.id ?? '', email });
    setProfile(body.profile ?? null);
  };

  const signIn = async (email: string, password: string) => {
    const result = await authClient.signIn.email({ email, password });
    if (result.error) {
      throw authError(result.error.message, 'Invalid email or password.');
    }
  };

  const signInWithGoogle = async () => {
    const result = await authClient.signIn.social({ provider: 'google', callbackURL: '/' });
    if (result.error) {
      throw authError(result.error.message, 'Google sign-in failed.');
    }
  };

  const signOutUser = async () => {
    await authClient.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (profileData: PublicProfile) => {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    const body = await response.json().catch(() => ({})) as { error?: string; profile?: PublicProfile };
    if (!response.ok) {
      throw new Error(body.error || 'Failed to update.');
    }
    setProfile(body.profile ?? null);
  };

  const refreshProfile = async () => {
    if (!user) return;
    setProfile(await readProfile());
  };

  const value = useMemo(
    () => ({ user, profile, loading, signUp, signIn, signInWithGoogle, signOutUser, updateProfile, refreshProfile }),
    [user, profile, loading],
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
