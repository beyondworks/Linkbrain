/**
 * URL Analysis API - Server-Side DOM Rendering Version (Fire-and-Forget)
 * 
 * This endpoint accepts a URL and returns immediately with a pending clip.
 * Processing continues in the background:
 * 1. Creates a "pending" clip immediately (returns to client)
 * 2. Fetches content in background
 * 3. Updates clip with full data when ready
 * 
 * This ensures analysis continues even if user minimizes app or switches tabs.
 * 
 * Request: { url: string, language?: string }
 * Response: Clip object with status: 'pending' or 'complete'
 */

import { createClipFromContent, detectPlatform } from './_lib/clip-service';
import { fetchUrlContent } from './_lib/url-content-fetcher';
import { extractImages } from './_lib/image-extractor';
import { requireAuth } from './_lib/auth';
import { setCorsHeaders, handlePreflight } from './_lib/cors';
import { validateUrl } from './_lib/url-validator';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already
if (getApps().length === 0) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        })
    });
}

const db = getFirestore();

/**
 * Main handler
 */
export default async function handler(req: any, res: any) {
    // CORS
    setCorsHeaders(req, res);

    if (handlePreflight(req, res)) {
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { url, language } = req.body;

        // Validate URL (SSRF prevention)
        const urlValidation = validateUrl(url);
        if (!urlValidation.valid) {
            return res.status(400).json({ error: urlValidation.error });
        }

        // Require authentication (no userId fallback)
        const auth = await requireAuth(req, res);
        if (!auth) return; // 401 already sent

        const userId = auth.userId;

        console.log(`[URL Import] Processing: ${url}`);
        console.log(`[URL Import] User ID: ${userId}`);

        // 1. Detect platform from URL (initial)
        let sourceType = detectPlatform(url);
        console.log(`[URL Import] Initial platform detection: ${sourceType}`);

        // 2. Create a "pending" clip immediately so user sees feedback
        const now = Timestamp.now();
        const pendingClip = {
            userId,
            url,
            platform: sourceType,
            template: sourceType,
            source: sourceType,
            title: new URL(url).hostname.replace('www.', ''),
            summary: '분석 중...',
            keywords: [],
            category: 'Other',
            sentiment: 'neutral',
            type: 'website',
            image: '/fallback-thumbnails/fallback-1.png',
            author: '',
            authorProfile: null,
            mediaItems: [],
            engagement: { likes: '0', views: '0', comments: '0' },
            mentions: [{ label: 'Original link', url }],
            comments: [],
            publishDate: null,
            htmlContent: '',
            collectionIds: [],
            viewCount: 0,
            likeCount: 0,
            createdAt: now,
            updatedAt: now,
            rawMarkdown: '',
            contentMarkdown: '',
            contentHtml: '',
            images: [],
            status: 'pending' // Mark as pending
        };

        const pendingDocRef = await db.collection('clips').add(pendingClip);
        console.log(`[URL Import] Pending clip created: ${pendingDocRef.id}`);

        // 3. Return immediately so client doesn't wait
        res.status(202).json({
            id: pendingDocRef.id,
            ...pendingClip,
            createdAt: now.toDate().toISOString(),
            updatedAt: now.toDate().toISOString(),
            status: 'pending'
        });

        // 4. Process in background (after response is sent)
        // Using setImmediate to ensure response is sent first
        setImmediate(async () => {
            try {
                console.log(`[URL Import Background] Starting processing for ${pendingDocRef.id}`);

                // Fetch content from URL
                const content = await fetchUrlContent(url);
                console.log(`[URL Import Background] Fetched content: ${content.rawText.length} chars`);

                // Extract images
                const extractedImages = await extractImages(url);
                const imageUrls = extractedImages.map(img => img.url);

                // Merge images
                const isNaverBlog = url.toLowerCase().includes('blog.naver.com');
                const allImages = isNaverBlog
                    ? [...new Set([...(content.images || []), ...imageUrls])]
                    : [...new Set([...imageUrls, ...(content.images || [])])];

                // Re-detect platform from final URL
                let finalSourceType = sourceType;
                if (content.finalUrl && content.finalUrl !== url) {
                    finalSourceType = detectPlatform(content.finalUrl);
                }

                // Create full clip (this handles AI metadata + image caching)
                const fullClip = await createClipFromContent({
                    url,
                    sourceType: finalSourceType as any,
                    rawText: content.rawText,
                    htmlContent: content.htmlContent,
                    images: allImages,
                    userId,
                    author: content.author,
                    authorAvatar: content.authorAvatar,
                    authorHandle: content.authorHandle
                }, {
                    language: language || 'KR'
                });

                // Update the pending clip with full data
                await db.collection('clips').doc(pendingDocRef.id).update({
                    ...fullClip,
                    id: pendingDocRef.id, // Keep original ID
                    status: 'complete',
                    updatedAt: Timestamp.now()
                });

                // Delete the duplicate clip created by createClipFromContent
                if (fullClip.id && fullClip.id !== pendingDocRef.id) {
                    await db.collection('clips').doc(fullClip.id).delete();
                }

                console.log(`[URL Import Background] Completed: ${pendingDocRef.id}`);

            } catch (bgError: any) {
                console.error(`[URL Import Background] Error:`, bgError);
                // Update clip with error status
                await db.collection('clips').doc(pendingDocRef.id).update({
                    status: 'error',
                    summary: `분석 실패: ${bgError.message}`,
                    updatedAt: Timestamp.now()
                });
            }
        });

    } catch (error: any) {
        console.error('[URL Import] Error:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            details: error.message
        });
    }
}
