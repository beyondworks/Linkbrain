import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ClipData } from './useClips';

interface UsePublicClipReturn {
    clip: ClipData | null;
    loading: boolean;
    error: string | null;
}

export const usePublicClip = (clipId: string | undefined): UsePublicClipReturn => {
    const [clip, setClip] = useState<ClipData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClip = async () => {
            if (!clipId) {
                setLoading(false);
                setError("No clip ID provided");
                return;
            }

            try {
                setLoading(true);
                const docRef = doc(db, 'clips', clipId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setClip({ id: docSnap.id, ...docSnap.data() } as ClipData);
                    setError(null);
                } else {
                    setError("Clip not found");
                    setClip(null);
                }
            } catch (err: any) {
                console.error("Error fetching public clip:", err);
                setError(err.message || "Failed to load clip");
            } finally {
                setLoading(false);
            }
        };

        fetchClip();
    }, [clipId]);

    return { clip, loading, error };
};
