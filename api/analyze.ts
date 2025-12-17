/**
 * URL Analysis API - Timeout-Safe Version
 * 
 * This endpoint accepts a URL and returns rich clip metadata.
 * 
 * Key Design: 6-second timeout + lightweight fallback
 * - Guarantees response within Vercel's 10s limit
 * - Returns full clip on success, basic clip on timeout
 * 
 * Request: { url: string, language?: string }
 * Response: Clip object (with status: 'full' | 'basic')
 */

import { createClipFromContent, detectPlatform, Clip } from './_lib/clip-service';
import { authenticateRequest } from './_lib/api-key-auth';
import { setCorsHeaders, handlePreflight } from './_lib/cors';
import { validateUrl } from './_lib/url-validator';

// Timeout constants
const HEAVY_OPERATION_TIMEOUT = 6000; // 6 seconds for heavy operations
const LIGHTWEIGHT_TIMEOUT = 3000;     // 3 seconds for fallback fetch

/**
 * Promise.race wrapper with timeout
 */
const withTimeout = <T>(promise: Promise<T>, ms: number, errorMessage: string): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(errorMessage)), ms)
        )
    ]);
};

/**
 * Lightweight metadata extraction using simple fetch + regex
 * Used as fallback when heavy extraction times out
 */
const lightweightExtract = async (url: string): Promise<{ title: string; description: string; image?: string }> => {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; LinkBrain/1.0)',
                'Accept': 'text/html'
            },
            signal: AbortSignal.timeout(LIGHTWEIGHT_TIMEOUT)
        });

        const html = await response.text();

        // Extract title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
        const title = ogTitleMatch?.[1] || titleMatch?.[1] || new URL(url).hostname;

        // Extract description
        const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
        const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
        const description = ogDescMatch?.[1] || descMatch?.[1] || '';

        // Extract image
        const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
        const image = ogImageMatch?.[1];

        return {
            title: title.trim().slice(0, 200),
            description: description.trim().slice(0, 500),
            image
        };
    } catch (error) {
        console.warn('[Lightweight Extract] Failed:', error);
        return {
            title: new URL(url).hostname,
            description: ''
        };
    }
};

/**
 * Heavy extraction with full pipeline
 */
const heavyExtract = async (url: string) => {
    // Dynamic imports to reduce cold start time
    const [{ fetchUrlContent }, { extractImages }] = await Promise.all([
        import('./_lib/url-content-fetcher'),
        import('./_lib/image-extractor')
    ]);

    const [content, extractedImages] = await Promise.all([
        fetchUrlContent(url),
        extractImages(url)
    ]);

    const imageUrls = extractedImages.map(img => img.url);
    const isNaverBlog = url.toLowerCase().includes('blog.naver.com');
    const allImages = isNaverBlog
        ? [...new Set([...(content.images || []), ...imageUrls])]
        : [...new Set([...imageUrls, ...(content.images || [])])];

    return {
        rawText: content.rawText,
        htmlContent: content.htmlContent,
        images: allImages,
        author: content.author,
        authorAvatar: content.authorAvatar,
        authorHandle: content.authorHandle,
        finalUrl: content.finalUrl
    };
};

/**
 * Main handler
 */
export default async function handler(req: any, res: any) {
    const startTime = Date.now();

    // CORS
    setCorsHeaders(req, res);

    if (handlePreflight(req, res)) {
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Parse request body (handle string or object)
        let body = req.body;
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            } catch {
                return res.status(400).json({ error: 'Invalid JSON body' });
            }
        }

        const { url, language } = body;

        if (!url) {
            return res.status(400).json({
                error: 'Missing required field: url',
                hint: 'Ensure your request body contains {"url": "https://..."}'
            });
        }

        // Validate URL (SSRF prevention)
        const urlValidation = validateUrl(url);
        if (!urlValidation.valid) {
            return res.status(400).json({ error: urlValidation.error });
        }

        // Authenticate via API key OR Firebase token
        const auth = await authenticateRequest(req, res);
        if (!auth) return; // 401 already sent

        const userId = auth.userId;
        let sourceType = detectPlatform(url);

        console.log(`[URL Import] Processing: ${url}`);
        console.log(`[URL Import] User ID: ${userId}, Platform: ${sourceType}`);

        let clip: Clip;
        let status: 'full' | 'basic' = 'full';

        try {
            // Try heavy extraction with 6-second timeout
            const content = await withTimeout(
                heavyExtract(url),
                HEAVY_OPERATION_TIMEOUT,
                'Heavy extraction timeout'
            );

            console.log(`[URL Import] Heavy extraction succeeded in ${Date.now() - startTime}ms`);

            // Re-detect platform from final URL if redirected
            if (content.finalUrl && content.finalUrl !== url) {
                sourceType = detectPlatform(content.finalUrl);
            }

            // Create full clip with AI analysis
            clip = await createClipFromContent({
                url,
                sourceType: sourceType as any,
                rawText: content.rawText,
                htmlContent: content.htmlContent,
                images: content.images,
                userId,
                author: content.author,
                authorAvatar: content.authorAvatar,
                authorHandle: content.authorHandle
            }, {
                language: language || 'KR',
                skipImageCache: true  // Speed up by skipping image cache
            }) as Clip;

        } catch (extractError: any) {
            console.warn(`[URL Import] Heavy extraction failed: ${extractError.message}`);
            console.log(`[URL Import] Falling back to lightweight extraction...`);
            status = 'basic';

            // Fallback: lightweight extraction
            const basicMeta = await lightweightExtract(url);

            console.log(`[URL Import] Lightweight extraction got: "${basicMeta.title}"`);

            // Create basic clip without AI analysis
            clip = await createClipFromContent({
                url,
                sourceType: sourceType as any,
                rawText: basicMeta.description || basicMeta.title,
                htmlContent: '',
                images: basicMeta.image ? [basicMeta.image] : [],
                userId
            }, {
                language: language || 'KR',
                skipAI: true,          // Skip AI to save time
                skipImageCache: true,  // Skip image cache
                fallbackTitle: basicMeta.title
            }) as Clip;
        }

        const totalTime = Date.now() - startTime;
        console.log(`[URL Import] Clip created: ${clip.id} (${status}) in ${totalTime}ms`);

        // Return clip with status indicator
        return res.status(201).json({
            ...clip,
            _meta: {
                status,
                processingTimeMs: totalTime
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
