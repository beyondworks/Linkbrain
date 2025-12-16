/**
 * API Keys Management Endpoint
 * 
 * Unified endpoint for API key operations:
 * - POST /api/keys?action=generate - Generate new key
 * - POST /api/keys?action=revoke - Revoke key
 * - GET /api/keys - Get key status
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { requireAuth } from './_lib/auth';
import { setCorsHeaders, handlePreflight } from './_lib/cors';
import { generateApiKey, storeApiKey, revokeApiKey } from './_lib/api-key-auth';

// Initialize Firebase Admin if not already
if (getApps().length === 0) {
    initializeApp({
        credential: cert({
            projectId: process.env.VITE_FIREBASE_PROJECT_ID,
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

    try {
        // Require Firebase Auth
        const auth = await requireAuth(req, res);
        if (!auth) return;

        const userId = auth.userId;
        const action = req.query.action || req.body?.action;

        // GET - Status
        if (req.method === 'GET') {
            const keyDoc = await db.collection('users').doc(userId).collection('settings').doc('apiKey').get();

            if (!keyDoc.exists) {
                return res.status(200).json({ hasKey: false });
            }

            const data = keyDoc.data();
            return res.status(200).json({
                hasKey: true,
                keyPrefix: data?.keyPrefix || 'lb_****...',
                createdAt: data?.createdAt,
                lastUsed: data?.lastUsed
            });
        }

        // POST - Generate or Revoke
        if (req.method === 'POST') {
            if (action === 'revoke') {
                await revokeApiKey(userId);
                console.log(`[API Keys] Revoked key for user: ${userId}`);
                return res.status(200).json({ success: true, message: 'API key revoked' });
            }

            // Default: generate
            const key = generateApiKey();
            const { keyPrefix } = await storeApiKey(userId, key);
            console.log(`[API Keys] Generated new key for user: ${userId}`);

            return res.status(201).json({
                success: true,
                key,
                keyPrefix,
                message: 'API key generated. Save it securely.'
            });
        }

        // DELETE - Revoke
        if (req.method === 'DELETE') {
            await revokeApiKey(userId);
            console.log(`[API Keys] Revoked key for user: ${userId}`);
            return res.status(200).json({ success: true, message: 'API key revoked' });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error: any) {
        console.error('[API Keys] Error:', error);
        return res.status(500).json({ error: 'API key operation failed' });
    }
}
