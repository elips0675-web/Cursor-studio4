'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

/**
 * Initializes the Firebase app and its services.
 * Extracted to a separate file to prevent circular dependencies between providers and index.
 */
export function initializeFirebase(): { firebaseApp: FirebaseApp; firestore: Firestore; auth: Auth } {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  return { firebaseApp: app, firestore: db, auth };
}
