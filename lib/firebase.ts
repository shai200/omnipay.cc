'use client';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const getFirebaseConfig = () => {
  // Use Firebase-provided config in production, or env vars in development
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FIREBASE_WEBAPP_CONFIG) {
    return JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_WEBAPP_CONFIG);
  }
  
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
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
