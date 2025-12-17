import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Firebase Admin
if (!getApps().length) {
    const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    if (serviceAccountBase64) {
        const serviceAccount = JSON.parse(Buffer.from(serviceAccountBase64, 'base64').toString('utf8'));
        initializeApp({ credential: cert(serviceAccount) });
    }
}

const db = getFirestore();

// Content moderation using Gemini
async function moderateContent(title: string, summary: string, keywords: string[]): Promise<{ approved: boolean; flags: string[] }> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.warn('No Gemini API key, skipping moderation');
        return { approved: true, flags: [] };
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Analyze the following content and determine if it should be REJECTED for a public community feed.

REJECT if content contains ANY of these:
- Political content (elections, political parties, political ideology, government criticism)
- Adult/obscene/sexual content
- Horror/gore/violence
- Spam or low-quality content
- Hate speech or discrimination

Content to analyze:
Title: ${title}
Summary: ${summary}
Keywords: ${keywords.join(', ')}

Respond in JSON format only:
{"approved": true/false, "flags": ["list", "of", "issues"]}

If content is acceptable, return: {"approved": true, "flags": []}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
    } catch (error) {
        console.error('Moderation error:', error);
    }

    return { approved: true, flags: [] };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // GET: Fetch public clips
        if (req.method === 'GET') {
            const { category, limit = '20', offset = '0' } = req.query;
            const limitNum = parseInt(limit as string, 10);
            const offsetNum = parseInt(offset as string, 10);

            let query = db.collection('publicClips')
                .where('isApproved', '==', true)
                .orderBy('saveCount', 'desc')
                .orderBy('createdAt', 'desc')
                .limit(limitNum)
                .offset(offsetNum);

            if (category && category !== 'All') {
                query = db.collection('publicClips')
                    .where('isApproved', '==', true)
                    .where('category', '==', category)
                    .orderBy('saveCount', 'desc')
                    .orderBy('createdAt', 'desc')
                    .limit(limitNum)
                    .offset(offsetNum);
            }

            const snapshot = await query.get();
            const clips = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            return res.status(200).json({ clips });
        }

        // POST: Publish clip to public
        if (req.method === 'POST') {
            const { url, title, summary, image, platform, category, keywords } = req.body;

            if (!url || !title) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // AI Moderation
            const moderation = await moderateContent(title, summary || '', keywords || []);

            if (!moderation.approved) {
                return res.status(200).json({
                    success: false,
                    reason: 'Content not suitable for community',
                    flags: moderation.flags
                });
            }

            // Check if already exists
            const existingQuery = await db.collection('publicClips')
                .where('url', '==', url)
                .limit(1)
                .get();

            if (!existingQuery.empty) {
                return res.status(200).json({ success: true, message: 'Already published' });
            }

            // Create public clip (decoupled snapshot, no user info)
            const publicClip = {
                url,
                title,
                summary: summary || '',
                image: image || null,
                platform: platform || 'web',
                category: category || 'Uncategorized',
                keywords: keywords || [],
                saveCount: 0,
                viewCount: 0,
                commentCount: 0,
                isApproved: true,
                moderationFlags: [],
                createdAt: new Date().toISOString()
            };

            const docRef = await db.collection('publicClips').add(publicClip);

            return res.status(200).json({ success: true, id: docRef.id });
        }

        // DELETE: Remove from public (when privacy toggled ON)
        if (req.method === 'DELETE') {
            const { url } = req.body;

            if (!url) {
                return res.status(400).json({ error: 'URL required' });
            }

            const snapshot = await db.collection('publicClips')
                .where('url', '==', url)
                .get();

            const batch = db.batch();
            snapshot.docs.forEach(doc => batch.delete(doc.ref));
            await batch.commit();

            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error: any) {
        console.error('Public clips API error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}
