import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    indexedDBLocalPersistence,
    initializeAuth,
    browserLocalPersistence
} from "firebase/auth";
import { getFirestore, initializeFirestore, memoryLocalCache } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";
import { Capacitor } from "@capacitor/core";

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

const isNative = Capacitor.isNativePlatform();

let auth;
if (isNative) {
    auth = initializeAuth(app, {
        persistence: indexedDBLocalPersistence
    });
} else {
    auth = getAuth(app);
}

export { auth };

let db: ReturnType<typeof getFirestore>;
try {
    db = initializeFirestore(app, {
        localCache: memoryLocalCache()
    });
} catch (e) {
    db = getFirestore(app);
}
export { db };

export const storage = getStorage(app);

export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (!isNative) {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    }).catch(() => {});
}
