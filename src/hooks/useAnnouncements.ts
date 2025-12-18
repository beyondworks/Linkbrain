import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    query,
    orderBy,
    onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// Types
export interface AppAnnouncement {
    id: string;
    title: string;
    message: string;
    type: 'update' | 'notice' | 'tip';
    createdAt: string;
    isRead?: boolean;
}

export interface AppPopup {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    linkUrl?: string;
    startDate?: string;
    endDate?: string;
}

const DISMISSED_ANNOUNCEMENTS_KEY = 'linkbrain_dismissed_announcements';
const DISMISSED_POPUPS_KEY = 'linkbrain_dismissed_popups';

// Get dismissed items from localStorage
const getDismissedItems = (key: string): Set<string> => {
    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            const data = JSON.parse(stored);
            // Clean expired items (older than 24 hours)
            const now = Date.now();
            const validItems = Object.entries(data).filter(
                ([_, timestamp]) => now - (timestamp as number) < 24 * 60 * 60 * 1000
            );
            return new Set(validItems.map(([id]) => id));
        }
    } catch (e) {
        console.warn('Failed to load dismissed items:', e);
    }
    return new Set();
};

// Save dismissed item to localStorage
const addDismissedItem = (key: string, id: string) => {
    try {
        const stored = localStorage.getItem(key);
        const data = stored ? JSON.parse(stored) : {};
        data[id] = Date.now();
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.warn('Failed to save dismissed item:', e);
    }
};

export const useAnnouncements = (language: 'en' | 'ko') => {
    const [announcements, setAnnouncements] = useState<AppAnnouncement[]>([]);
    const [readIds, setReadIds] = useState<Set<string>>(() => getDismissedItems(DISMISSED_ANNOUNCEMENTS_KEY));
    const [loading, setLoading] = useState(true);

    // Fetch active announcements from Firestore
    useEffect(() => {
        // Simple query without compound index requirement
        // Filter isActive on client side to avoid index requirement
        const q = query(
            collection(db, 'announcements'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs
                .map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        title: data.title,
                        message: data.message,
                        type: data.type,
                        createdAt: data.createdAt,
                        isActive: data.isActive
                    };
                })
                .filter(item => item.isActive === true) // Client-side filter
                .map(({ isActive, ...rest }) => rest as AppAnnouncement);

            console.log('[useAnnouncements] Fetched:', items.length, 'active announcements');
            setAnnouncements(items);
            setLoading(false);
        }, (error) => {
            console.error('[useAnnouncements] Error fetching:', error);
            // Try fallback without orderBy if index is missing
            if (error.code === 'failed-precondition') {
                console.log('[useAnnouncements] Trying fallback query...');
                const fallbackQ = query(collection(db, 'announcements'));
                onSnapshot(fallbackQ, (snapshot) => {
                    const items = snapshot.docs
                        .map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        }))
                        .filter((item: any) => item.isActive === true)
                        .sort((a: any, b: any) =>
                            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
                        )
                        .map((item: any) => ({
                            id: item.id,
                            title: item.title,
                            message: item.message,
                            type: item.type,
                            createdAt: item.createdAt
                        } as AppAnnouncement));
                    setAnnouncements(items);
                    setLoading(false);
                });
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // Computed announcements with read status
    const notificationsWithReadStatus = announcements.map(a => ({
        ...a,
        isRead: readIds.has(a.id)
    }));

    const unreadCount = notificationsWithReadStatus.filter(n => !n.isRead).length;

    const markAsRead = useCallback((id: string) => {
        setReadIds(prev => new Set([...prev, id]));
        addDismissedItem(DISMISSED_ANNOUNCEMENTS_KEY, id);
    }, []);

    const markAllAsRead = useCallback(() => {
        const newReadIds = new Set([...readIds, ...announcements.map(a => a.id)]);
        setReadIds(newReadIds);
        announcements.forEach(a => addDismissedItem(DISMISSED_ANNOUNCEMENTS_KEY, a.id));
    }, [announcements, readIds]);

    return {
        announcements: notificationsWithReadStatus,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead
    };
};

export const usePopups = () => {
    const [popups, setPopups] = useState<AppPopup[]>([]);
    const [dismissedIds, setDismissedIds] = useState<Set<string>>(() => getDismissedItems(DISMISSED_POPUPS_KEY));
    const [loading, setLoading] = useState(true);

    // Fetch active popups from Firestore
    useEffect(() => {
        // Simple query without compound index - filter on client side
        const q = query(
            collection(db, 'popups'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const now = new Date();
            const items = snapshot.docs
                .map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        title: data.title,
                        content: data.content,
                        imageUrl: data.imageUrl,
                        linkUrl: data.linkUrl,
                        startDate: data.startDate,
                        endDate: data.endDate,
                        isActive: data.isActive
                    };
                })
                .filter(popup => {
                    // Filter by active status
                    if (popup.isActive !== true) return false;
                    // Filter by date range
                    if (popup.startDate && new Date(popup.startDate) > now) return false;
                    if (popup.endDate && new Date(popup.endDate) < now) return false;
                    return true;
                })
                .map(({ isActive, ...rest }) => rest as AppPopup);

            console.log('[usePopups] Fetched:', items.length, 'active popups');
            setPopups(items);
            setLoading(false);
        }, (error) => {
            console.error('[usePopups] Error fetching:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Filter out dismissed popups
    const activePopups = popups.filter(p => !dismissedIds.has(p.id));

    const dismissPopup = useCallback((id: string) => {
        setDismissedIds(prev => new Set([...prev, id]));
        addDismissedItem(DISMISSED_POPUPS_KEY, id);
    }, []);

    const dismissPopupForever = useCallback((id: string) => {
        // Store with a very long expiry
        try {
            const stored = localStorage.getItem(DISMISSED_POPUPS_KEY);
            const data = stored ? JSON.parse(stored) : {};
            data[id] = Date.now() + 365 * 24 * 60 * 60 * 1000; // 1 year
            localStorage.setItem(DISMISSED_POPUPS_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to dismiss popup forever:', e);
        }
        setDismissedIds(prev => new Set([...prev, id]));
    }, []);

    return {
        popups: activePopups,
        loading,
        dismissPopup,
        dismissPopupForever
    };
};
