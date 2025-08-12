// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "startlabx-3bq2h",
  appId: "1:454227799829:web:030d1cfe6253fb5a3d031c",
  storageBucket: "startlabx-3bq2h.firebasestorage.app",
  apiKey: "AIzaSyCug7zF2nstDDVNfxZlsul61YPYgUGkfb0",
  authDomain: "startlabx-3bq2h.firebaseapp.com",
  messagingSenderId: "454227799829",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
