/**
 * API Key Status Endpoint
 * 
 * GET /api/keys/status
 * - Requires Firebase Auth
 * - Returns the status of the user's API key (exists, prefix, lastUsed)
 * 
 * Response: { hasKey: boolean, keyPrefix?: string, lastUsed?: string }
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { requireAuth } from '../_lib/auth';
import { setCorsHeaders, handlePreflight } from '../_lib/cors';

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

export default async function handler(req: any, res: any) {
    setCorsHeaders(req, res);

    if (handlePreflight(req, res)) {
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Require Firebase Auth
        const auth = await requireAuth(req, res);
        if (!auth) return;

        const userId = auth.userId;

        // Get API key document
        const keyDoc = await db.collection('users').doc(userId).collection('settings').doc('apiKey').get();

        if (!keyDoc.exists) {
            return res.status(200).json({
                hasKey: false
            });
        }

        const data = keyDoc.data();

        return res.status(200).json({
            hasKey: true,
            keyPrefix: data?.keyPrefix || 'lb_****...',
            createdAt: data?.createdAt,
            lastUsed: data?.lastUsed
        });

    } catch (error: any) {
        console.error('[API Keys] Status error:', error);
        return res.status(500).json({ error: 'Failed to get API key status' });
    }
}
