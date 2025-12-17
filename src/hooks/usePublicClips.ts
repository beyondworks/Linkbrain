import { useState, useEffect, useCallback } from 'react';
import { db } from '../lib/firebase';
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    increment
} from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface PublicClip {
    id: string;
    url: string;
    title: string;
    summary: string;
    image: string | null;
    platform: string;
    category: string;
    keywords: string[];
    saveCount: number;
    viewCount: number;
    commentCount: number;
    createdAt: string;
}

export interface PublicComment {
    id: string;
    content: string;
    createdAt: string;
}

interface UsePublicClipsReturn {
    publicClips: PublicClip[];
    loading: boolean;
    error: string | null;
    fetchPublicClips: (category?: string) => Promise<void>;
    publishClip: (clip: {
        url: string;
        title: string;
        summary: string;
        image: string | null;
        platform: string;
        category: string;
        keywords: string[];
    }) => Promise<{ success: boolean; reason?: string }>;
    removeFromPublic: (url: string) => Promise<void>;
    importToMyClips: (publicClip: PublicClip) => Promise<void>;
    fetchComments: (clipId: string) => Promise<PublicComment[]>;
    addComment: (clipId: string, content: string) => Promise<{ success: boolean; reason?: string }>;
    incrementSaveCount: (clipId: string) => Promise<void>;
}

// Simple content moderation check
function containsInappropriateContent(text: string): boolean {
    // Basic keyword filter for obvious issues
    const blockedPatterns = [
        /정치|politics|선거|election|대통령|president/i,
        /porn|xxx|성인|adult|19금/i,
        /gore|horror|공포|blood|murder/i,
    ];
    return blockedPatterns.some(pattern => pattern.test(text));
}

// Simple comment moderation
function isInappropriateComment(content: string): { inappropriate: boolean; reason: string } {
    // Check for spam (repeated characters or random text)
    if (/(.)\1{5,}/.test(content)) {
        return { inappropriate: true, reason: 'Spam detected' };
    }

    // Check for profanity (basic Korean/English)
    const profanityPatterns = [
        /시발|씨발|좆|병신|개새끼|fuck|shit|ass/i
    ];
    if (profanityPatterns.some(pattern => pattern.test(content))) {
        return { inappropriate: true, reason: 'Inappropriate language' };
    }

    return { inappropriate: false, reason: '' };
}

export function usePublicClips(): UsePublicClipsReturn {
    const [publicClips, setPublicClips] = useState<PublicClip[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPublicClips = useCallback(async (category?: string) => {
        setLoading(true);
        setError(null);

        try {
            let q;
            if (category && category !== 'All') {
                q = query(
                    collection(db, 'publicClips'),
                    where('isApproved', '==', true),
                    where('category', '==', category),
                    orderBy('saveCount', 'desc'),
                    limit(50)
                );
            } else {
                q = query(
                    collection(db, 'publicClips'),
                    where('isApproved', '==', true),
                    orderBy('saveCount', 'desc'),
                    limit(50)
                );
            }

            const snapshot = await getDocs(q);
            const clips = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as PublicClip[];

            setPublicClips(clips);
        } catch (err: any) {
            console.error('Failed to fetch public clips:', err);
            setError(err.message || 'Failed to fetch public clips');
        } finally {
            setLoading(false);
        }
    }, []);

    const publishClip = useCallback(async (clip: {
        url: string;
        title: string;
        summary: string;
        image: string | null;
        platform: string;
        category: string;
        keywords: string[];
    }): Promise<{ success: boolean; reason?: string }> => {
        try {
            // Basic moderation check
            const textToCheck = `${clip.title} ${clip.summary} ${clip.keywords.join(' ')}`;
            if (containsInappropriateContent(textToCheck)) {
                return { success: false, reason: 'Content not suitable for community' };
            }

            // Check if already exists
            const existingQuery = query(
                collection(db, 'publicClips'),
                where('url', '==', clip.url),
                limit(1)
            );
            const existingSnapshot = await getDocs(existingQuery);

            if (!existingSnapshot.empty) {
                return { success: true, reason: 'Already published' };
            }

            // Create public clip
            const publicClip = {
                url: clip.url,
                title: clip.title,
                summary: clip.summary || '',
                image: clip.image || null,
                platform: clip.platform || 'web',
                category: clip.category || 'Uncategorized',
                keywords: clip.keywords || [],
                saveCount: 0,
                viewCount: 0,
                commentCount: 0,
                isApproved: true,
                createdAt: new Date().toISOString()
            };

            await addDoc(collection(db, 'publicClips'), publicClip);
            return { success: true };
        } catch (err: any) {
            console.error('Failed to publish clip:', err);
            return { success: false, reason: err.message };
        }
    }, []);

    const removeFromPublic = useCallback(async (url: string) => {
        try {
            const q = query(
                collection(db, 'publicClips'),
                where('url', '==', url)
            );
            const snapshot = await getDocs(q);

            for (const docSnap of snapshot.docs) {
                await deleteDoc(doc(db, 'publicClips', docSnap.id));
            }
        } catch (err) {
            console.error('Failed to remove from public:', err);
        }
    }, []);

    const importToMyClips = useCallback(async (publicClip: PublicClip) => {
        // This is handled by the component calling createClip
        // Just increment save count here
        await incrementSaveCount(publicClip.id);
    }, []);

    const fetchComments = useCallback(async (clipId: string): Promise<PublicComment[]> => {
        try {
            const q = query(
                collection(db, 'publicClips', clipId, 'comments'),
                where('isHidden', '==', false),
                orderBy('createdAt', 'desc'),
                limit(50)
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as PublicComment[];
        } catch (err) {
            console.error('Failed to fetch comments:', err);
            return [];
        }
    }, []);

    const addComment = useCallback(async (clipId: string, content: string): Promise<{ success: boolean; reason?: string }> => {
        try {
            if (!content.trim() || content.length > 500) {
                return { success: false, reason: 'Comment must be 1-500 characters' };
            }

            // Moderation check
            const moderation = isInappropriateComment(content);
            if (moderation.inappropriate) {
                return { success: false, reason: moderation.reason };
            }

            // Add anonymous comment
            const comment = {
                content: content.trim(),
                createdAt: new Date().toISOString(),
                isHidden: false
            };

            await addDoc(collection(db, 'publicClips', clipId, 'comments'), comment);

            // Increment comment count
            await updateDoc(doc(db, 'publicClips', clipId), {
                commentCount: increment(1)
            });

            return { success: true };
        } catch (err: any) {
            console.error('Failed to add comment:', err);
            return { success: false, reason: err.message };
        }
    }, []);

    const incrementSaveCount = useCallback(async (clipId: string) => {
        try {
            await updateDoc(doc(db, 'publicClips', clipId), {
                saveCount: increment(1)
            });
        } catch (err) {
            console.error('Failed to increment save count:', err);
        }
    }, []);

    return {
        publicClips,
        loading,
        error,
        fetchPublicClips,
        publishClip,
        removeFromPublic,
        importToMyClips,
        fetchComments,
        addComment,
        incrementSaveCount
    };
}
