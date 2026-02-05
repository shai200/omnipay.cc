'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

type PrefillDob = {
  day?: number;
  month?: number;
  year?: number;
};

type PrefillAddress = {
  country?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
};

type PrefillProfile = {
  email?: string;
  first_name?: string;
  last_name?: string;
  dob?: PrefillDob;
  address?: PrefillAddress;
};

interface AuthContextType {
  user: User | null;
  profile: PrefillProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, profile: PrefillProfile) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  updateProfile: (profile: PrefillProfile) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const cleanProfile = (profile: PrefillProfile): PrefillProfile => {
  const cleaned: PrefillProfile = {};

  if (profile.email) cleaned.email = profile.email;
  if (profile.first_name) cleaned.first_name = profile.first_name;
  if (profile.last_name) cleaned.last_name = profile.last_name;

  if (profile.dob) {
    const dob: PrefillDob = {};
    if (profile.dob.day) dob.day = profile.dob.day;
    if (profile.dob.month) dob.month = profile.dob.month;
    if (profile.dob.year) dob.year = profile.dob.year;
    if (Object.keys(dob).length > 0) cleaned.dob = dob;
  }

  if (profile.address) {
    const address: PrefillAddress = {};
    if (profile.address.country) address.country = profile.address.country;
    if (profile.address.line1) address.line1 = profile.address.line1;
    if (profile.address.line2) address.line2 = profile.address.line2;
    if (profile.address.city) address.city = profile.address.city;
    if (profile.address.state) address.state = profile.address.state;
    if (profile.address.postal_code) address.postal_code = profile.address.postal_code;
    if (Object.keys(address).length > 0) cleaned.address = address;
  }

  return cleaned;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<PrefillProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string) => {
    const ref = doc(db, 'users', uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      setProfile(snap.data() as PrefillProfile);
    } else {
      setProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, profileData: PrefillProfile) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = credential.user.uid;

    const cleaned = cleanProfile({ ...profileData, email });
    await setDoc(
      doc(db, 'users', uid),
      {
        ...cleaned,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    setProfile(cleaned);
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  const updateProfile = async (profileData: PrefillProfile) => {
    if (!user) return;

    const cleaned = cleanProfile(profileData);
    await updateDoc(doc(db, 'users', user.uid), {
      ...cleaned,
      updatedAt: serverTimestamp(),
    });

    setProfile((prev) => ({ ...(prev || {}), ...cleaned }));
  };

  const refreshProfile = async () => {
    if (!user) return;
    await fetchProfile(user.uid);
  };

  const value = useMemo(
    () => ({ user, profile, loading, signUp, signIn, signOutUser, updateProfile, refreshProfile }),
    [user, profile, loading]
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
