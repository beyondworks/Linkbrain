import { useState, useEffect, useCallback } from 'react';
import { db } from '../lib/firebase';
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    onSnapshot,
    Unsubscribe
} from 'firebase/firestore';

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

export function usePublicClips(): UsePublicClipsReturn {
    const [publicClips, setPublicClips] = useState<PublicClip[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPublicClips = useCallback(async (category?: string) => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (category && category !== 'All') {
                params.append('category', category);
            }
            params.append('limit', '50');

            const response = await fetch(`/api/public-clips?${params.toString()}`);
            const data = await response.json();

            if (data.clips) {
                setPublicClips(data.clips);
            }
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
            const response = await fetch('/api/public-clips', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clip)
            });

            const data = await response.json();
            return { success: data.success, reason: data.reason };
        } catch (err: any) {
            console.error('Failed to publish clip:', err);
            return { success: false, reason: err.message };
        }
    }, []);

    const removeFromPublic = useCallback(async (url: string) => {
        try {
            await fetch('/api/public-clips', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
        } catch (err) {
            console.error('Failed to remove from public:', err);
        }
    }, []);

    const importToMyClips = useCallback(async (publicClip: PublicClip) => {
        // This will be handled by the component that calls createClip from useClips
        // Just increment the save count here
        try {
            await fetch('/api/public-clips', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'incrementSave',
                    clipId: publicClip.id
                })
            });
        } catch (err) {
            console.error('Failed to increment save count:', err);
        }
    }, []);

    const fetchComments = useCallback(async (clipId: string): Promise<PublicComment[]> => {
        try {
            const response = await fetch(`/api/public-comments?clipId=${clipId}`);
            const data = await response.json();
            return data.comments || [];
        } catch (err) {
            console.error('Failed to fetch comments:', err);
            return [];
        }
    }, []);

    const addComment = useCallback(async (clipId: string, content: string): Promise<{ success: boolean; reason?: string }> => {
        try {
            const response = await fetch(`/api/public-comments?clipId=${clipId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });

            const data = await response.json();
            return { success: data.success !== false, reason: data.reason };
        } catch (err: any) {
            console.error('Failed to add comment:', err);
            return { success: false, reason: err.message };
        }
    }, []);

    const incrementSaveCount = useCallback(async (clipId: string) => {
        // Called when user imports a public clip
        try {
            await fetch('/api/public-clips', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'incrementSave',
                    clipId
                })
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
