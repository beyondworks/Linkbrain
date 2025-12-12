import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence, browserSessionPersistence, setPersistence } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, memoryLocalCache } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with fallback persistence
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(() => {
    // Fallback to session persistence if local storage is blocked
    setPersistence(auth, browserSessionPersistence).catch(console.error);
});

// Initialize Firestore with memory cache fallback (avoids IndexedDB issues)
let db: ReturnType<typeof getFirestore>;
try {
    db = initializeFirestore(app, {
        localCache: memoryLocalCache()
    });
} catch (e) {
    // If already initialized, just get the instance
    db = getFirestore(app);
}
export { db };

export const storage = getStorage(app);

// Analytics with support check
export let analytics: ReturnType<typeof getAnalytics> | null = null;
isSupported().then((supported) => {
    if (supported) {
        analytics = getAnalytics(app);
    }
}).catch(() => {
    console.warn('Analytics not supported in this environment');
});
