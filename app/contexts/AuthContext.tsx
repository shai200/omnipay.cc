'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  Auth,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  Firestore,
} from 'firebase/firestore';
import { getFirebaseServices } from '@/lib/firebase';

let auth: Auth | null = null;
let db: Firestore | null = null;

// Initialize on first access
const ensureInitialized = () => {
  if (!auth || !db) {
    const { auth: authService, db: dbService } = getFirebaseServices();
    auth = authService;
    db = dbService;
  }
  return { auth: auth!, db: db! };
};

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
  reminder_monthly?: boolean;
  reminder_price_drop?: boolean;
  reminder_weekly?: boolean;
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

  // Always include reminder settings, even if false
  if (profile.reminder_monthly !== undefined) cleaned.reminder_monthly = profile.reminder_monthly;
  if (profile.reminder_price_drop !== undefined) cleaned.reminder_price_drop = profile.reminder_price_drop;
  if (profile.reminder_weekly !== undefined) cleaned.reminder_weekly = profile.reminder_weekly;

  return cleaned;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<PrefillProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string) => {
    try {
      const { db: dbService } = ensureInitialized();
      const ref = doc(dbService, 'users', uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProfile(snap.data() as PrefillProfile);
      } else {
        setProfile(null);
      }
    } catch (error: any) {
      console.log('Profile does not exist or insufficient permissions:', error.code);
      setProfile(null);
    }
  };

  useEffect(() => {
    const { auth: authService } = ensureInitialized();
    const unsubscribe = onAuthStateChanged(authService, async (currentUser) => {
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
    try {
      const { auth: authService, db: dbService } = ensureInitialized();
      const credential = await createUserWithEmailAndPassword(authService, email, password);
      const uid = credential.user.uid;
      console.log('User created with UID:', uid);

      // Wait for auth token to be ready
      const token = await credential.user.getIdToken();
      console.log('Token obtained, length:', token.length);

      const cleaned = cleanProfile({ ...profileData, email });
      console.log('Attempting to write profile to Firestore:', cleaned);
      
      await setDoc(
        doc(dbService, 'users', uid),
        {
          ...cleaned,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      console.log('Profile saved successfully');
      setProfile(cleaned);
    } catch (error: any) {
      console.error('SignUp error details:', {
        code: error.code,
        message: error.message,
        fullError: error
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    const { auth: authService } = ensureInitialized();
    await signInWithEmailAndPassword(authService, email, password);
  };

  const signOutUser = async () => {
    const { auth: authService } = ensureInitialized();
    await signOut(authService);
  };

  const updateProfile = async (profileData: PrefillProfile) => {
    if (!user) return;

    const { db: dbService } = ensureInitialized();
    const cleaned = cleanProfile(profileData);
    await updateDoc(doc(dbService, 'users', user.uid), {
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
