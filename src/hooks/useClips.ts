import { useState, useCallback, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
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
    Unsubscribe
} from 'firebase/firestore';

export interface ClipData {
    id?: string;
    url: string;
    platform: 'youtube' | 'instagram' | 'threads' | 'web';
    template: string;
    title: string;
    summary: string;
    keywords: string[];
    category: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    type: 'article' | 'video' | 'image' | 'social_post' | 'website';
    image: string | null;
    author: string;
    authorProfile: any;
    mediaItems: any[];
    engagement: any;
    mentions: Array<{ label: string; url: string }>;
    comments: any[];
    publishDate: string | null;
    htmlContent: string;
    collectionIds?: string[];
    viewCount?: number;
    likeCount?: number;
    createdAt?: string;
    updatedAt?: string;
    isFavorite?: boolean;
    isArchived?: boolean;
    rawMarkdown?: string;
    contentMarkdown?: string;
    contentHtml?: string;
    images?: string[];
    userId?: string;
}

export interface CollectionData {
    id?: string;
    name: string;
    description?: string;
    color?: string;
    clipIds?: string[];
    isPublic?: boolean;
    createdAt?: string;
    updatedAt?: string;
    userId?: string;
}

interface UseClipsReturn {
    clips: ClipData[];
    collections: CollectionData[];
    loading: boolean;
    error: string | null;
    user: User | null;

    // Clip operations
    createClip: (clipData: ClipData) => Promise<ClipData>;
    getClips: (filters?: { category?: string; platform?: string; search?: string; collectionId?: string; limit?: number; offset?: number }) => Promise<void>;
    updateClip: (id: string, updates: Partial<ClipData>) => Promise<ClipData>;
    deleteClip: (id: string) => Promise<void>;
    analyzeUrl: (url: string) => Promise<ClipData>;

    // Collection operations
    createCollection: (collectionData: CollectionData) => Promise<CollectionData>;
    getCollections: () => Promise<void>;
    updateCollection: (id: string, updates: Partial<CollectionData>) => Promise<CollectionData>;
    deleteCollection: (id: string) => Promise<void>;
    addClipToCollection: (clipId: string, collectionId: string) => Promise<void>;
    removeClipFromCollection: (clipId: string, collectionId: string) => Promise<void>;
}

export const useClips = (): UseClipsReturn => {
    const [user, setUser] = useState<User | null>(auth.currentUser);
    const [clips, setClips] = useState<ClipData[]>([]);
    const [collections, setCollections] = useState<CollectionData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleError = (err: any, message: string) => {
        console.error(message, err);
        setError(err?.message || message);
    };

    // ANALYZE URL - For production, this would call an API. For dev, we create a placeholder.
    const analyzeUrl = useCallback(async (url: string): Promise<ClipData> => {
        if (!user) throw new Error('User must be authenticated');

        setLoading(true);
        setError(null);
        try {
            // In development without API, create a basic clip
            // In production, this would call /api/analyze
            const isProduction = import.meta.env.PROD;

            if (isProduction) {
                // Use API route in production
                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${await user.getIdToken()}`,
                    },
                    body: JSON.stringify({ url, userId: user.uid }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || `Failed to analyze URL: ${response.statusText}`);
                }

                const result = await response.json();
                setClips(prev => [result, ...prev]);
                return result;
            } else {
                // In development, create a basic clip directly
                const clipData: ClipData = {
                    url,
                    platform: 'web',
                    template: 'web',
                    title: `Link: ${url}`,
                    summary: 'Content analysis is only available in production. Deploy to Vercel to enable AI analysis.',
                    keywords: ['web'],
                    category: 'Other',
                    sentiment: 'neutral',
                    type: 'website',
                    image: null,
                    author: '',
                    authorProfile: {},
                    mediaItems: [],
                    engagement: {},
                    mentions: [{ label: 'Original', url }],
                    comments: [],
                    publishDate: null,
                    htmlContent: '',
                    collectionIds: [],
                    viewCount: 0,
                    likeCount: 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    userId: user.uid,
                };

                const docRef = await addDoc(collection(db, 'clips'), clipData);
                const newClip = { ...clipData, id: docRef.id };
                setClips(prev => [newClip, ...prev]);
                return newClip;
            }
        } catch (err) {
            handleError(err, 'Failed to analyze URL');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [user]);

    // CLIP OPERATIONS - Direct Firestore access
    const createClip = useCallback(async (clipData: ClipData): Promise<ClipData> => {
        if (!user) throw new Error('User must be authenticated');

        setLoading(true);
        setError(null);
        try {
            const dataToSave = {
                ...clipData,
                userId: user.uid,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const docRef = await addDoc(collection(db, 'clips'), dataToSave);
            const newClip = { ...dataToSave, id: docRef.id };
            setClips(prev => [newClip, ...prev]);
            return newClip;
        } catch (err) {
            handleError(err, 'Failed to create clip');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [user]);

    const getClips = useCallback(async (filters?: any) => {
        if (!user) return;

        setLoading(true);
        setError(null);
        try {
            const clipsRef = collection(db, 'clips');
            let q = query(
                clipsRef,
                where('userId', '==', user.uid),
                orderBy('createdAt', 'desc')
            );

            const snapshot = await getDocs(q);
            let clipsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ClipData[];

            // Client-side filtering
            if (filters?.category) {
                clipsData = clipsData.filter(c => c.category === filters.category);
            }
            if (filters?.platform) {
                clipsData = clipsData.filter(c => c.platform === filters.platform);
            }
            if (filters?.search) {
                const searchLower = filters.search.toLowerCase();
                clipsData = clipsData.filter(c =>
                    c.title?.toLowerCase().includes(searchLower) ||
                    c.summary?.toLowerCase().includes(searchLower) ||
                    c.keywords?.some((k: string) => k.toLowerCase().includes(searchLower))
                );
            }
            if (filters?.collectionId) {
                clipsData = clipsData.filter(c => c.collectionIds?.includes(filters.collectionId));
            }

            setClips(clipsData);
        } catch (err) {
            handleError(err, 'Failed to fetch clips');
        } finally {
            setLoading(false);
        }
    }, [user]);

    const updateClip = useCallback(async (id: string, updates: Partial<ClipData>): Promise<ClipData> => {
        if (!user) throw new Error('User must be authenticated');

        setLoading(true);
        setError(null);
        try {
            const docRef = doc(db, 'clips', id);
            const updateData = {
                ...updates,
                updatedAt: new Date().toISOString(),
            };
            await updateDoc(docRef, updateData);

            setClips(prev => prev.map(c => c.id === id ? { ...c, ...updateData } : c));
            return { id, ...updateData } as ClipData;
        } catch (err) {
            handleError(err, 'Failed to update clip');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [user]);

    const deleteClip = useCallback(async (id: string) => {
        if (!user) throw new Error('User must be authenticated');

        setLoading(true);
        setError(null);
        try {
            await deleteDoc(doc(db, 'clips', id));
            setClips(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            handleError(err, 'Failed to delete clip');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [user]);

    // COLLECTION OPERATIONS - Direct Firestore access
    const createCollection = useCallback(async (collectionData: CollectionData): Promise<CollectionData> => {
        if (!user) throw new Error('User must be authenticated');

        setLoading(true);
        setError(null);
        try {
            const dataToSave = {
                ...collectionData,
                userId: user.uid,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const docRef = await addDoc(collection(db, 'collections'), dataToSave);
            const newCollection = { ...dataToSave, id: docRef.id };
            setCollections(prev => [newCollection, ...prev]);
            return newCollection;
        } catch (err) {
            handleError(err, 'Failed to create collection');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [user]);

    const getCollections = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        setError(null);
        try {
            const collectionsRef = collection(db, 'collections');
            const q = query(
                collectionsRef,
                where('userId', '==', user.uid),
                orderBy('createdAt', 'desc')
            );

            const snapshot = await getDocs(q);
            const collectionsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as CollectionData[];

            setCollections(collectionsData);
        } catch (err) {
            handleError(err, 'Failed to fetch collections');
        } finally {
            setLoading(false);
        }
    }, [user]);

    const updateCollection = useCallback(async (id: string, updates: Partial<CollectionData>): Promise<CollectionData> => {
        if (!user) throw new Error('User must be authenticated');

        setLoading(true);
        setError(null);
        try {
            const docRef = doc(db, 'collections', id);
            const updateData = {
                ...updates,
                updatedAt: new Date().toISOString(),
            };
            await updateDoc(docRef, updateData);

            setCollections(prev => prev.map(c => c.id === id ? { ...c, ...updateData } : c));
            return { id, ...updateData } as CollectionData;
        } catch (err) {
            handleError(err, 'Failed to update collection');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [user]);

    const deleteCollection = useCallback(async (id: string) => {
        if (!user) throw new Error('User must be authenticated');

        setLoading(true);
        setError(null);
        try {
            await deleteDoc(doc(db, 'collections', id));
            setCollections(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            handleError(err, 'Failed to delete collection');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [user]);

    const addClipToCollection = useCallback(async (clipId: string, collectionId: string) => {
        if (!user) throw new Error('User must be authenticated');

        setLoading(true);
        try {
            const col = collections.find(c => c.id === collectionId);
            if (!col) throw new Error('Collection not found');

            const updatedClipIds = Array.from(new Set([...(col.clipIds || []), clipId]));
            await updateCollection(collectionId, { clipIds: updatedClipIds });
        } catch (err) {
            handleError(err, 'Failed to add clip to collection');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [user, collections, updateCollection]);

    const removeClipFromCollection = useCallback(async (clipId: string, collectionId: string) => {
        if (!user) throw new Error('User must be authenticated');

        setLoading(true);
        try {
            const col = collections.find(c => c.id === collectionId);
            if (!col) throw new Error('Collection not found');

            const updatedClipIds = (col.clipIds || []).filter(id => id !== clipId);
            await updateCollection(collectionId, { clipIds: updatedClipIds });
        } catch (err) {
            handleError(err, 'Failed to remove clip from collection');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [user, collections, updateCollection]);

    // Load data on user change
    useEffect(() => {
        if (user) {
            getClips();
            getCollections();
        } else {
            setClips([]);
            setCollections([]);
        }
    }, [user]);

    return {
        clips,
        collections,
        loading,
        error,
        user,
        createClip,
        getClips,
        updateClip,
        deleteClip,
        analyzeUrl,
        createCollection,
        getCollections,
        updateCollection,
        deleteCollection,
        addClipToCollection,
        removeClipFromCollection,
    };
};
