import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
    collection,
    query,
    where,
    orderBy,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    getCountFromServer,
    Timestamp
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

// Types
export interface Announcement {
    id?: string;
    title: string;
    message: string;
    type: 'update' | 'notice' | 'tip';
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface Inquiry {
    id?: string;
    userId: string;
    userEmail: string;
    subject: string;
    message: string;
    status: 'pending' | 'replied' | 'closed';
    reply?: string;
    createdAt?: string;
    repliedAt?: string;
}

export interface Popup {
    id?: string;
    title: string;
    content: string;
    imageUrl?: string;
    linkUrl?: string;
    isActive: boolean;
    startDate?: string;
    endDate?: string;
    createdAt?: string;
}

export interface AnalyticsData {
    totalUsers: number;
    totalClips: number;
    subscriptionStats: {
        trial: number;
        active: number;
        expired: number;
    };
    platformStats: {
        youtube: number;
        instagram: number;
        threads: number;
        web: number;
    };
    recentClipsCount: number; // Last 7 days
}

export interface AdminState {
    isAdmin: boolean;
    loading: boolean;
    announcements: Announcement[];
    inquiries: Inquiry[];
    popups: Popup[];
    analytics: AnalyticsData | null;
}

// Admin emails stored in Firestore config collection for dynamic management
const FALLBACK_ADMIN_EMAILS = ['beyondworks.br@gmail.com'];

export const useAdmin = () => {
    const [user, setUser] = useState<User | null>(null);
    const [adminEmails, setAdminEmails] = useState<string[]>(FALLBACK_ADMIN_EMAILS);
    const [state, setState] = useState<AdminState>({
        isAdmin: false,
        loading: true,
        announcements: [],
        inquiries: [],
        popups: [],
        analytics: null
    });

    // Auth state listener
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    // Fetch admin emails from Firestore config (for dynamic admin management)
    useEffect(() => {
        const configRef = doc(db, 'config', 'adminSettings');
        const unsubscribe = onSnapshot(configRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                if (data?.adminEmails && Array.isArray(data.adminEmails)) {
                    setAdminEmails(data.adminEmails);
                }
            }
        }, (error) => {
            console.warn('[useAdmin] Could not fetch admin config, using fallback:', error.message);
        });
        return () => unsubscribe();
    }, []);

    // Check admin status
    useEffect(() => {
        if (!user) {
            setState(prev => ({ ...prev, isAdmin: false, loading: false }));
            return;
        }

        const isAdmin = adminEmails.includes(user.email || '');
        setState(prev => ({ ...prev, isAdmin, loading: false }));
    }, [user, adminEmails]);

    // Fetch announcements
    const fetchAnnouncements = useCallback(async () => {
        try {
            const q = query(
                collection(db, 'announcements'),
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(q);
            const announcements = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Announcement[];
            setState(prev => ({ ...prev, announcements }));
        } catch (error) {
            console.error('[useAdmin] Failed to fetch announcements:', error);
        }
    }, []);

    // Create announcement
    const createAnnouncement = useCallback(async (data: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>) => {
        const now = new Date().toISOString();
        const docRef = await addDoc(collection(db, 'announcements'), {
            ...data,
            createdAt: now,
            updatedAt: now
        });
        await fetchAnnouncements();
        return docRef.id;
    }, [fetchAnnouncements]);

    // Update announcement
    const updateAnnouncement = useCallback(async (id: string, data: Partial<Announcement>) => {
        const docRef = doc(db, 'announcements', id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: new Date().toISOString()
        });
        await fetchAnnouncements();
    }, [fetchAnnouncements]);

    // Delete announcement
    const deleteAnnouncement = useCallback(async (id: string) => {
        await deleteDoc(doc(db, 'announcements', id));
        await fetchAnnouncements();
    }, [fetchAnnouncements]);

    // Fetch inquiries
    const fetchInquiries = useCallback(async () => {
        try {
            const q = query(
                collection(db, 'inquiries'),
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(q);
            const inquiries = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Inquiry[];
            setState(prev => ({ ...prev, inquiries }));
        } catch (error) {
            console.error('[useAdmin] Failed to fetch inquiries:', error);
        }
    }, []);

    // Reply to inquiry
    const replyToInquiry = useCallback(async (id: string, reply: string) => {
        const docRef = doc(db, 'inquiries', id);
        await updateDoc(docRef, {
            reply,
            status: 'replied',
            repliedAt: new Date().toISOString()
        });
        await fetchInquiries();
    }, [fetchInquiries]);

    // Close inquiry
    const closeInquiry = useCallback(async (id: string) => {
        const docRef = doc(db, 'inquiries', id);
        await updateDoc(docRef, { status: 'closed' });
        await fetchInquiries();
    }, [fetchInquiries]);

    // Fetch popups
    const fetchPopups = useCallback(async () => {
        try {
            const q = query(
                collection(db, 'popups'),
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(q);
            const popups = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Popup[];
            setState(prev => ({ ...prev, popups }));
        } catch (error) {
            console.error('[useAdmin] Failed to fetch popups:', error);
        }
    }, []);

    // Create popup
    const createPopup = useCallback(async (data: Omit<Popup, 'id' | 'createdAt'>) => {
        const docRef = await addDoc(collection(db, 'popups'), {
            ...data,
            createdAt: new Date().toISOString()
        });
        await fetchPopups();
        return docRef.id;
    }, [fetchPopups]);

    // Update popup
    const updatePopup = useCallback(async (id: string, data: Partial<Popup>) => {
        const docRef = doc(db, 'popups', id);
        await updateDoc(docRef, data);
        await fetchPopups();
    }, [fetchPopups]);

    // Delete popup
    const deletePopup = useCallback(async (id: string) => {
        await deleteDoc(doc(db, 'popups', id));
        await fetchPopups();
    }, [fetchPopups]);

    // Fetch analytics
    const fetchAnalytics = useCallback(async () => {
        try {
            // Get user count
            const usersSnapshot = await getCountFromServer(collection(db, 'users'));
            const totalUsers = usersSnapshot.data().count;

            // Get clips count by querying all users' clips
            // Note: This is a simplified approach - in production, consider aggregation
            const clipsSnapshot = await getDocs(collection(db, 'clips'));
            const clipsData = clipsSnapshot.docs.map(d => d.data());

            const platformStats = {
                youtube: clipsData.filter(c => c.platform === 'youtube').length,
                instagram: clipsData.filter(c => c.platform === 'instagram').length,
                threads: clipsData.filter(c => c.platform === 'threads').length,
                web: clipsData.filter(c => c.platform === 'web').length
            };

            // Get subscription stats
            const subscriptionStats = { trial: 0, active: 0, expired: 0 };
            const usersDataSnapshot = await getDocs(collection(db, 'users'));
            usersDataSnapshot.docs.forEach(doc => {
                const data = doc.data();
                if (data.subscriptionStatus === 'active' || data.subscriptionTier === 'pro') {
                    subscriptionStats.active++;
                } else if (data.trialStartDate) {
                    const trialStart = new Date(data.trialStartDate);
                    const daysSinceStart = Math.ceil((Date.now() - trialStart.getTime()) / (1000 * 60 * 60 * 24));
                    if (daysSinceStart <= 15) {
                        subscriptionStats.trial++;
                    } else {
                        subscriptionStats.expired++;
                    }
                }
            });

            // Recent clips (last 7 days)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const recentClipsCount = clipsData.filter(c => {
                if (!c.createdAt) return false;
                return new Date(c.createdAt) >= sevenDaysAgo;
            }).length;

            setState(prev => ({
                ...prev,
                analytics: {
                    totalUsers,
                    totalClips: clipsData.length,
                    subscriptionStats,
                    platformStats,
                    recentClipsCount
                }
            }));
        } catch (error) {
            console.error('[useAdmin] Failed to fetch analytics:', error);
        }
    }, []);

    // Load all data when admin is confirmed
    useEffect(() => {
        if (state.isAdmin && !state.loading) {
            fetchAnnouncements();
            fetchInquiries();
            fetchPopups();
            fetchAnalytics();
        }
    }, [state.isAdmin, state.loading, fetchAnnouncements, fetchInquiries, fetchPopups, fetchAnalytics]);

    return {
        ...state,
        user,
        fetchAnnouncements,
        createAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        fetchInquiries,
        replyToInquiry,
        closeInquiry,
        fetchPopups,
        createPopup,
        updatePopup,
        deletePopup,
        fetchAnalytics
    };
};
