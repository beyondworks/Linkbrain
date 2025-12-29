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
    Timestamp,
    limit
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

// Helper function to parse Firebase Timestamp or ISO string to Date
const parseTimestamp = (value: any): Date | null => {
    if (!value) return null;
    // Firebase Timestamp object
    if (value && typeof value.toDate === 'function') {
        return value.toDate();
    }
    // Firestore Timestamp-like object with seconds
    if (value && typeof value.seconds === 'number') {
        return new Date(value.seconds * 1000);
    }
    // ISO string or any string date
    if (typeof value === 'string') {
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
    }
    // Already a Date
    if (value instanceof Date) {
        return value;
    }
    return null;
};

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
    displayType: 'modal' | 'banner';
    startDate?: string;
    endDate?: string;
    createdAt?: string;
}

// Extended Analytics Types
export interface DailyStats {
    date: string;
    users: number;
    clips: number;
    newUsers: number;
}

export interface UserInfo {
    id: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    createdAt: string;
    lastLoginAt?: string;
    clipCount: number;
    subscriptionStatus: 'trial' | 'active' | 'expired' | 'free';
    subscriptionTier?: 'free' | 'pro' | 'master';
    trialStartDate?: string;
    trialEndDate?: string;
    platforms: { youtube: number; instagram: number; threads: number; web: number };
}

export interface CategoryStats {
    name: string;
    count: number;
    percentage: number;
}

export interface KeywordStats {
    keyword: string;
    count: number;
}

export interface HourlyActivity {
    hour: number;
    count: number;
}

export interface AnalyticsData {
    // Basic stats
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
    recentClipsCount: number;

    // Extended stats
    dailyStats?: DailyStats[];
    newUsersToday?: number;
    newUsersThisWeek?: number;
    newUsersThisMonth?: number;
    dau?: number;
    wau?: number;
    mau?: number;
    avgClipsPerUser?: number;
}

export interface CategoryAnalytics {
    topCategories: CategoryStats[];
    topKeywords: KeywordStats[];
    totalCategories: number;
    avgCategoriesPerUser: number;
}

export interface DetailedAnalytics {
    hourlyActivity: HourlyActivity[];
    weekdayActivity: { day: string; count: number }[];
    platformTrends: { date: string; youtube: number; instagram: number; threads: number; web: number }[];
    retentionData: { week: string; retention: number }[];
}

export interface AdminState {
    isAdmin: boolean;
    loading: boolean;
    announcements: Announcement[];
    inquiries: Inquiry[];
    popups: Popup[];
    analytics: AnalyticsData | null;
    users: UserInfo[];
    categoryAnalytics: CategoryAnalytics | null;
    detailedAnalytics: DetailedAnalytics | null;
    usersLoading: boolean;
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
        analytics: null,
        users: [],
        categoryAnalytics: null,
        detailedAnalytics: null,
        usersLoading: false
    });

    // Auth state listener
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    // Fetch admin emails from Firestore config
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

    // Fetch enhanced analytics
    const fetchAnalytics = useCallback(async () => {
        try {
            const usersSnapshot = await getCountFromServer(collection(db, 'users'));
            const totalUsers = usersSnapshot.data().count;

            const clipsSnapshot = await getDocs(collection(db, 'clips'));
            const clipsData = clipsSnapshot.docs.map(d => ({ ...d.data(), id: d.id })) as any[];

            const platformStats = {
                youtube: clipsData.filter(c => c.platform === 'youtube').length,
                instagram: clipsData.filter(c => c.platform === 'instagram').length,
                threads: clipsData.filter(c => c.platform === 'threads').length,
                web: clipsData.filter(c => c.platform === 'web').length
            };

            // Get subscription stats and user activity
            const usersDataSnapshot = await getDocs(collection(db, 'users'));
            const subscriptionStats = { trial: 0, active: 0, expired: 0 };
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

            let newUsersToday = 0;
            let newUsersThisWeek = 0;
            let newUsersThisMonth = 0;
            const activeUsersToday = new Set<string>();
            const activeUsersWeek = new Set<string>();
            const activeUsersMonth = new Set<string>();

            usersDataSnapshot.docs.forEach(doc => {
                const data = doc.data();

                // Subscription stats
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

                // New users
                const userCreated = parseTimestamp(data.createdAt);
                if (userCreated) {
                    if (userCreated >= today) newUsersToday++;
                    if (userCreated >= weekAgo) newUsersThisWeek++;
                    if (userCreated >= monthAgo) newUsersThisMonth++;
                }

                // Active users (based on lastLoginAt)
                const lastLogin = parseTimestamp(data.lastLoginAt);
                if (lastLogin) {
                    if (lastLogin >= today) activeUsersToday.add(doc.id);
                    if (lastLogin >= weekAgo) activeUsersWeek.add(doc.id);
                    if (lastLogin >= monthAgo) activeUsersMonth.add(doc.id);
                }
            });

            // Recent clips (last 7 days)
            const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            const recentClipsCount = clipsData.filter(c => {
                const created = parseTimestamp(c.createdAt);
                if (!created) return false;
                return created >= sevenDaysAgo;
            }).length;

            // Daily stats for last 30 days
            const dailyStats: DailyStats[] = [];
            for (let i = 29; i >= 0; i--) {
                const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
                const dateStr = date.toISOString().split('T')[0];
                const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);

                const dayClips = clipsData.filter(c => {
                    const created = parseTimestamp(c.createdAt);
                    if (!created) return false;
                    return created >= date && created < nextDate;
                }).length;

                const dayNewUsers = usersDataSnapshot.docs.filter(d => {
                    const data = d.data();
                    const created = parseTimestamp(data.createdAt);
                    if (!created) return false;
                    return created >= date && created < nextDate;
                }).length;

                dailyStats.push({
                    date: dateStr,
                    users: totalUsers,
                    clips: dayClips,
                    newUsers: dayNewUsers
                });
            }

            setState(prev => ({
                ...prev,
                analytics: {
                    totalUsers,
                    totalClips: clipsData.length,
                    subscriptionStats,
                    platformStats,
                    recentClipsCount,
                    dailyStats,
                    newUsersToday,
                    newUsersThisWeek,
                    newUsersThisMonth,
                    dau: activeUsersToday.size,
                    wau: activeUsersWeek.size,
                    mau: activeUsersMonth.size,
                    avgClipsPerUser: totalUsers > 0 ? Math.round((clipsData.length / totalUsers) * 10) / 10 : 0
                }
            }));
        } catch (error) {
            console.error('[useAdmin] Failed to fetch analytics:', error);
        }
    }, []);

    // Fetch user list with details
    const fetchUserList = useCallback(async () => {
        setState(prev => ({ ...prev, usersLoading: true }));
        try {
            const usersSnapshot = await getDocs(collection(db, 'users'));
            const clipsSnapshot = await getDocs(collection(db, 'clips'));
            const clipsData = clipsSnapshot.docs.map(d => d.data());

            const users: UserInfo[] = usersSnapshot.docs.map(doc => {
                const data = doc.data();
                const userClips = clipsData.filter(c => c.userId === doc.id);

                // Determine subscription status
                let subscriptionStatus: 'trial' | 'active' | 'expired' | 'free' = 'free';
                if (data.subscriptionStatus === 'active' || data.subscriptionTier === 'pro') {
                    subscriptionStatus = 'active';
                } else if (data.trialStartDate) {
                    const trialStart = new Date(data.trialStartDate);
                    const daysSinceStart = Math.ceil((Date.now() - trialStart.getTime()) / (1000 * 60 * 60 * 24));
                    subscriptionStatus = daysSinceStart <= 15 ? 'trial' : 'expired';
                }

                // Calculate trial end date
                let trialEndDate = data.trialEndDate;
                if (!trialEndDate && data.trialStartDate) {
                    // Legacy: calculate from trialStartDate + 15 days
                    const trialStart = new Date(data.trialStartDate);
                    trialEndDate = new Date(trialStart.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString();
                }

                return {
                    id: doc.id,
                    email: data.email || 'Unknown',
                    displayName: data.displayName || data.name,
                    photoURL: data.photoURL,
                    createdAt: data.createdAt || '',
                    lastLoginAt: data.lastLoginAt,
                    clipCount: userClips.length,
                    subscriptionStatus,
                    subscriptionTier: data.subscriptionTier || 'free',
                    trialStartDate: data.trialStartDate,
                    trialEndDate,
                    platforms: {
                        youtube: userClips.filter(c => c.platform === 'youtube').length,
                        instagram: userClips.filter(c => c.platform === 'instagram').length,
                        threads: userClips.filter(c => c.platform === 'threads').length,
                        web: userClips.filter(c => c.platform === 'web').length
                    }
                };
            });

            // Sort by clip count desc
            users.sort((a, b) => b.clipCount - a.clipCount);

            setState(prev => ({ ...prev, users, usersLoading: false }));
        } catch (error) {
            console.error('[useAdmin] Failed to fetch user list:', error);
            setState(prev => ({ ...prev, usersLoading: false }));
        }
    }, []);

    // Update user subscription
    const updateUserSubscription = useCallback(async (
        userId: string,
        tier: 'free' | 'pro' | 'master',
        options?: { trialEndDate?: string }
    ) => {
        try {
            const userRef = doc(db, 'users', userId);
            const updateData: any = {
                subscriptionTier: tier,
                subscriptionStatus: tier === 'pro' || tier === 'master' ? 'active' : 'free',
                subscriptionUpdatedAt: new Date().toISOString(),
                subscriptionUpdatedBy: user?.email
            };
            if (options?.trialEndDate) {
                updateData.trialEndDate = options.trialEndDate;
            }
            await updateDoc(userRef, updateData);
            await fetchUserList();
        } catch (error) {
            console.error('[useAdmin] Failed to update user subscription:', error);
            throw error;
        }
    }, [user, fetchUserList]);

    // Bulk update trial period for multiple users
    const bulkUpdateTrialPeriod = useCallback(async (userIds: string[], daysToAdd: number) => {
        try {
            const newEndDate = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();
            const promises = userIds.map(userId => {
                const userRef = doc(db, 'users', userId);
                return updateDoc(userRef, {
                    trialEndDate: newEndDate,
                    subscriptionUpdatedAt: new Date().toISOString(),
                    subscriptionUpdatedBy: user?.email
                });
            });
            await Promise.all(promises);
            await fetchUserList();
        } catch (error) {
            console.error('[useAdmin] Failed to bulk update trial period:', error);
            throw error;
        }
    }, [user, fetchUserList]);

    // Fetch category analytics
    const fetchCategoryAnalytics = useCallback(async () => {
        try {
            const clipsSnapshot = await getDocs(collection(db, 'clips'));
            const clipsData = clipsSnapshot.docs.map(d => d.data());
            const categoriesSnapshot = await getDocs(collection(db, 'categories'));

            // Build category ID -> name mapping
            const categoryIdToName: Record<string, string> = {};
            categoriesSnapshot.docs.forEach(doc => {
                const data = doc.data();
                categoryIdToName[doc.id] = data.name || doc.id;
            });

            // Count clips per category
            const categoryCount: Record<string, number> = {};
            const keywordCount: Record<string, number> = {};

            clipsData.forEach(clip => {
                // Convert category ID to name
                const catId = clip.category || 'Uncategorized';
                const catName = categoryIdToName[catId] || catId;
                categoryCount[catName] = (categoryCount[catName] || 0) + 1;

                if (clip.keywords && Array.isArray(clip.keywords)) {
                    clip.keywords.forEach((kw: string) => {
                        if (kw && kw.trim()) {
                            keywordCount[kw.trim().toLowerCase()] = (keywordCount[kw.trim().toLowerCase()] || 0) + 1;
                        }
                    });
                }
            });

            const totalClips = clipsData.length;
            const topCategories: CategoryStats[] = Object.entries(categoryCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 20)
                .map(([name, count]) => ({
                    name,
                    count,
                    percentage: totalClips > 0 ? Math.round((count / totalClips) * 100) : 0
                }));

            const topKeywords: KeywordStats[] = Object.entries(keywordCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 30)
                .map(([keyword, count]) => ({ keyword, count }));

            // Calculate avg categories per user
            const usersSnapshot = await getDocs(collection(db, 'users'));
            const totalUsers = usersSnapshot.docs.length;
            const totalCategories = categoriesSnapshot.docs.length;

            setState(prev => ({
                ...prev,
                categoryAnalytics: {
                    topCategories,
                    topKeywords,
                    totalCategories,
                    avgCategoriesPerUser: totalUsers > 0 ? Math.round((totalCategories / totalUsers) * 10) / 10 : 0
                }
            }));
        } catch (error) {
            console.error('[useAdmin] Failed to fetch category analytics:', error);
            // Set empty data to prevent infinite loading
            setState(prev => ({
                ...prev,
                categoryAnalytics: {
                    topCategories: [],
                    topKeywords: [],
                    totalCategories: 0,
                    avgCategoriesPerUser: 0
                }
            }));
        }
    }, []);

    // Fetch detailed analytics
    const fetchDetailedAnalytics = useCallback(async () => {
        try {
            const clipsSnapshot = await getDocs(collection(db, 'clips'));
            const clipsData = clipsSnapshot.docs.map(d => d.data());

            // Hourly activity
            const hourlyActivity: HourlyActivity[] = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }));
            clipsData.forEach(clip => {
                const created = parseTimestamp(clip.createdAt);
                if (created) {
                    const hour = created.getHours();
                    hourlyActivity[hour].count++;
                }
            });

            // Weekday activity
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const weekdayCount = [0, 0, 0, 0, 0, 0, 0];
            clipsData.forEach(clip => {
                const created = parseTimestamp(clip.createdAt);
                if (created) {
                    const day = created.getDay();
                    weekdayCount[day]++;
                }
            });
            const weekdayActivity = dayNames.map((day, i) => ({ day, count: weekdayCount[i] }));

            // Platform trends (last 30 days)
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const platformTrends: { date: string; youtube: number; instagram: number; threads: number; web: number }[] = [];

            for (let i = 29; i >= 0; i--) {
                const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
                const dateStr = date.toISOString().split('T')[0];
                const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);

                const dayClips = clipsData.filter(c => {
                    const created = parseTimestamp(c.createdAt);
                    if (!created) return false;
                    return created >= date && created < nextDate;
                });

                platformTrends.push({
                    date: dateStr,
                    youtube: dayClips.filter(c => c.platform === 'youtube').length,
                    instagram: dayClips.filter(c => c.platform === 'instagram').length,
                    threads: dayClips.filter(c => c.platform === 'threads').length,
                    web: dayClips.filter(c => c.platform === 'web').length
                });
            }

            // Simple retention data (weekly)
            const retentionData: { week: string; retention: number }[] = [];
            const usersSnapshot = await getDocs(collection(db, 'users'));
            const usersData = usersSnapshot.docs.map(d => d.data());

            for (let w = 1; w <= 4; w++) {
                const weekStart = new Date(today.getTime() - w * 7 * 24 * 60 * 60 * 1000);
                const weekEnd = new Date(today.getTime() - (w - 1) * 7 * 24 * 60 * 60 * 1000);

                const usersCreatedBefore = usersData.filter(u => {
                    const created = parseTimestamp(u.createdAt);
                    if (!created) return false;
                    return created < weekStart;
                }).length;

                const activeInWeek = usersData.filter(u => {
                    const created = parseTimestamp(u.createdAt);
                    const lastLogin = parseTimestamp(u.lastLoginAt);
                    if (!lastLogin || !created) return false;
                    return created < weekStart && lastLogin >= weekStart && lastLogin < weekEnd;
                }).length;

                retentionData.push({
                    week: `Week ${w}`,
                    retention: usersCreatedBefore > 0 ? Math.round((activeInWeek / usersCreatedBefore) * 100) : 0
                });
            }

            setState(prev => ({
                ...prev,
                detailedAnalytics: {
                    hourlyActivity,
                    weekdayActivity,
                    platformTrends,
                    retentionData
                }
            }));
        } catch (error) {
            console.error('[useAdmin] Failed to fetch detailed analytics:', error);
            // Set empty data to prevent infinite loading
            setState(prev => ({
                ...prev,
                detailedAnalytics: {
                    hourlyActivity: Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 })),
                    weekdayActivity: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => ({ day, count: 0 })),
                    platformTrends: [],
                    retentionData: [
                        { week: 'Week 1', retention: 0 },
                        { week: 'Week 2', retention: 0 },
                        { week: 'Week 3', retention: 0 },
                        { week: 'Week 4', retention: 0 }
                    ]
                }
            }));
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
        fetchAnalytics,
        fetchUserList,
        updateUserSubscription,
        bulkUpdateTrialPeriod,
        fetchCategoryAnalytics,
        fetchDetailedAnalytics
    };
};
