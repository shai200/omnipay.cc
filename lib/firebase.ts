'use client';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const getFirebaseConfig = () => {
  // Next.js replaces process.env.NEXT_PUBLIC_* at build time
  const config = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
  
  if (config) {
    return JSON.parse(config);
  }
  
  // Fallback: try to get from window if injected
  if (typeof window !== 'undefined' && (window as any).__FIREBASE_CONFIG__) {
    return (window as any).__FIREBASE_CONFIG__;
  }
  
  throw new Error('NEXT_PUBLIC_FIREBASE_CONFIG is not defined');
};

let app: any;
let auth: any;
let db: any;

const initFirebase = () => {
  if (!app) {
    app = initializeApp(getFirebaseConfig());
    auth = getAuth(app);
    db = getFirestore(app);
  }
  return { app, auth, db };
};

export const getFirebaseServices = () => initFirebase();
