'use client';

import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

function readFirebaseOptions(): FirebaseOptions {
  // Next.js replaces process.env.NEXT_PUBLIC_* at build time
  const config = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;

  if (config) {
    return JSON.parse(config) as FirebaseOptions;
  }

  if (typeof window !== 'undefined') {
    const injected = (window as Window & { __FIREBASE_CONFIG__?: FirebaseOptions }).__FIREBASE_CONFIG__;
    if (injected) return injected;
  }

  throw new Error('NEXT_PUBLIC_FIREBASE_CONFIG is not defined');
}

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

const initFirebase = () => {
  if (!app || !auth || !db) {
    app = initializeApp(readFirebaseOptions());
    auth = getAuth(app);
    db = getFirestore(app);
  }
  return { app, auth, db };
};

export const getFirebaseServices = () => initFirebase();
