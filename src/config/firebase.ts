import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import type { Auth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import type { Firestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import type { FirebaseStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

/**
 * Firebase is only initialized when valid config is present.
 * When env vars are missing for example when first deploy before config is set
 * the app still renders the landing page but Firebase-dependent features
 * will throw a clear error if accessed.
 */
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)

let _auth: Auth | null = null
let _db: Firestore | null = null
let _storage: FirebaseStorage | null = null

if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig)
    _auth = getAuth(app)
    _db = getFirestore(app)
    _storage = getStorage(app)
  } catch (e) {
    console.error('Firebase initialisation failed:', e)
  }
}

// exports first with non-null types via assertion. these are only used inside hooks that are gated behind auth which checks `isFirebaseConfigured` before calling anything
export const auth = _auth as Auth
export const db = _db as Firestore
export const storage = _storage as FirebaseStorage
