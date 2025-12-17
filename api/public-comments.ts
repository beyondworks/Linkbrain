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

// Comment moderation using Gemini
async function moderateComment(content: string): Promise<{ approved: boolean; reason: string }> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return { approved: true, reason: '' };
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Analyze this comment and determine if it should be REJECTED.

REJECT if comment contains ANY of these:
- Profanity or vulgar language
- Slander or personal attacks
- Spam (random characters, repeated text, promotional content)
- Hate speech or discrimination
- Threats or harassment

Comment: "${content}"

Respond in JSON format only:
{"approved": true/false, "reason": "brief reason if rejected"}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
    } catch (error) {
        console.error('Comment moderation error:', error);
    }

    return { approved: true, reason: '' };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { clipId } = req.query;

        if (!clipId || typeof clipId !== 'string') {
            return res.status(400).json({ error: 'clipId is required' });
        }

        // GET: Fetch comments for a public clip
        if (req.method === 'GET') {
            const snapshot = await db.collection('publicClips')
                .doc(clipId)
                .collection('comments')
                .where('isHidden', '==', false)
                .orderBy('createdAt', 'desc')
                .limit(50)
                .get();

            const comments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return res.status(200).json({ comments });
        }

        // POST: Add anonymous comment
        if (req.method === 'POST') {
            const { content } = req.body;

            if (!content || typeof content !== 'string') {
                return res.status(400).json({ error: 'Comment content is required' });
            }

            if (content.trim().length < 1 || content.length > 500) {
                return res.status(400).json({ error: 'Comment must be 1-500 characters' });
            }

            // AI Moderation for comments
            const moderation = await moderateComment(content.trim());

            if (!moderation.approved) {
                return res.status(200).json({
                    success: false,
                    reason: moderation.reason || 'Comment not allowed'
                });
            }

            // Add anonymous comment (no userId stored)
            const comment = {
                content: content.trim(),
                createdAt: new Date().toISOString(),
                isHidden: false
            };

            const docRef = await db.collection('publicClips')
                .doc(clipId)
                .collection('comments')
                .add(comment);

            // Increment comment count
            await db.collection('publicClips').doc(clipId).update({
                commentCount: FieldValue.increment(1)
            });

            return res.status(200).json({ success: true, id: docRef.id, comment });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error: any) {
        console.error('Public comments API error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}
