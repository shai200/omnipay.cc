'use client';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const getFirebaseConfig = () => {
  const config = process.env.NEXT_PUBLIC_FIREBASE_WEBAPP_CONFIG;
  if (config) {
    return JSON.parse(config);
  }
  throw new Error('NEXT_PUBLIC_FIREBASE_WEBAPP_CONFIG is not defined');
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
