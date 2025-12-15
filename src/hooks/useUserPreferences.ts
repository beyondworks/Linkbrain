import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface NotificationSettings {
    weeklyDigest: boolean;
    productUpdates: boolean;
    securityAlerts: boolean;
}

export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    language: 'en' | 'ko';
    showThumbnails: boolean;
    notifications: NotificationSettings;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    theme: 'system',
    language: 'ko',
    showThumbnails: true,
    notifications: {
        weeklyDigest: true,
        productUpdates: true,
        securityAlerts: true
    }
};

export const useUserPreferences = (user: User | null) => {
    // Initialize from localStorage or defaults
    const [preferences, setPreferences] = useState<UserPreferences>(() => {
        if (typeof window === 'undefined') return DEFAULT_PREFERENCES;

        try {
            const saved = localStorage.getItem('linkbrain_preferences');
            if (saved) {
                // Merge with defaults to ensure all keys exist (for schema evolution)
                return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
            }

            // Legacy migration: try to read individual keys if new key doesn't exist
            const legacyTheme = localStorage.getItem('themePreference') as 'light' | 'dark' | 'system';
            const legacyLanguage = localStorage.getItem('language') as 'en' | 'ko';

            if (legacyTheme || legacyLanguage) {
                return {
                    ...DEFAULT_PREFERENCES,
                    theme: legacyTheme || DEFAULT_PREFERENCES.theme,
                    language: legacyLanguage || DEFAULT_PREFERENCES.language
                };
            }
        } catch (e) {
            console.error('Failed to parse preferences from localStorage', e);
        }

        return DEFAULT_PREFERENCES;
    });

    // Save to localStorage whenever preferences change
    useEffect(() => {
        localStorage.setItem('linkbrain_preferences', JSON.stringify(preferences));

        // Also keep legacy keys in sync for now (optional, but good for safety)
        localStorage.setItem('themePreference', preferences.theme);
        localStorage.setItem('language', preferences.language);
    }, [preferences]);

    // Firestore Sync
    useEffect(() => {
        if (!user) return;

        const docRef = doc(db, `users/${user.uid}/settings/preferences`);

        // Load initially and listen for changes (cross-device sync)
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const cloudPrefs = docSnap.data() as Partial<UserPreferences>;
                setPreferences(prev => {
                    // Start with defaults, then legacy/local state, then cloud override?
                    // Strategy: Cloud wins. But we don't want to overwrite local un-synced changes?
                    // Simpler Strategy: Cloud writes update State. State writes update Local.
                    // If cloud is updated, we accept it.

                    // Check if deep equal to avoid infinite loops if we write back?
                    // No, onSnapshot fires on local writes too if we aren't careful? 
                    // Actually onSnapshot fires on remote writes.

                    return { ...prev, ...cloudPrefs };
                });
            } else {
                // If no cloud prefs, save current defaults to cloud?
                // Or just do nothing.
                // Let's safe-guard: if documents doesn't exist, we might want to upload our current local prefs?
                // Only if it's the first time?
                // Let's implement lazy save on update instead.
            }
        });

        return () => unsubscribe();
    }, [user]);

    const updatePreference = async <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
        // 1. Optimistic Update
        setPreferences(prev => {
            const newPrefs = { ...prev, [key]: value };
            return newPrefs;
        });

        // 2. Sync to Firestore if user is logged in
        if (user) {
            try {
                const docRef = doc(db, `users/${user.uid}/settings/preferences`);
                // Use setDoc with merge to ensure we don't wipe other fields
                await setDoc(docRef, { [key]: value }, { merge: true });
            } catch (error) {
                console.error("Failed to sync preference to cloud:", error);
                // Optionally revert state here if strict consistency is needed
            }
        }
    };

    // Bulk update (e.g. for notifications object)
    const updatePreferences = async (newPrefs: Partial<UserPreferences>) => {
        setPreferences(prev => ({ ...prev, ...newPrefs }));

        if (user) {
            try {
                const docRef = doc(db, `users/${user.uid}/settings/preferences`);
                await setDoc(docRef, newPrefs, { merge: true });
            } catch (error) {
                console.error("Failed to sync preferences to cloud:", error);
            }
        }
    };

    return {
        preferences,
        updatePreference,
        updatePreferences
    };
};
