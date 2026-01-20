// Firebase configuration - lazy initialization for SSR safety
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// Using mock config for development - will be replaced with actual backend integration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDemoKey123456789",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "equitybuild-demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "equitybuild-demo",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "equitybuild-demo.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abc123def456",
};

// Lazy initialization - only initialize when accessed
let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _analytics: Analytics | null = null;

// Safe getters that only initialize on client side
export const getFirebaseApp = (): FirebaseApp | null => {
  if (typeof window === 'undefined') return null;
  if (!_app) {
    _app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  }
  return _app;
};

export const getFirebaseAuth = (): Auth | null => {
  if (typeof window === 'undefined') return null;
  const app = getFirebaseApp();
  if (!app) return null;
  if (!_auth) {
    _auth = getAuth(app);
  }
  return _auth;
};

export const getFirebaseDb = (): Firestore | null => {
  if (typeof window === 'undefined') return null;
  const app = getFirebaseApp();
  if (!app) return null;
  if (!_db) {
    _db = getFirestore(app);
  }
  return _db;
};

export const getFirebaseAnalytics = (): Analytics | null => {
  if (typeof window === 'undefined') return null;
  const app = getFirebaseApp();
  if (!app) return null;
  if (!_analytics) {
    isSupported().then((supported) => {
      if (supported && app) {
        _analytics = getAnalytics(app);
      }
    });
  }
  return _analytics;
};

// Legacy exports for backward compatibility (will return null on server)
export const app = typeof window !== 'undefined' ? getFirebaseApp() : null;
export const auth = typeof window !== 'undefined' ? getFirebaseAuth() : null;
export const db = typeof window !== 'undefined' ? getFirebaseDb() : null;
export const analytics = typeof window !== 'undefined' ? getFirebaseAnalytics() : null;

// Log warning if using mock configuration
if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  console.warn("⚠️ Using mock Firebase configuration. Set environment variables for production.");
}
