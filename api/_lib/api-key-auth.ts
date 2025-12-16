/**
 * API Key Authentication Middleware
 * 
 * Allows external services (iPhone Shortcuts, Notion, Slack, etc.)
 * to authenticate with LinkBrain using API keys instead of Firebase Auth.
 * 
 * Usage:
 *   const auth = await authenticateRequest(req, res);
 *   if (!auth) return; // 401 already sent
 *   const userId = auth.userId;
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as crypto from 'crypto';

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

// API key format: lb_xxxxxxxxxxxxxxxx (24 chars total)
const API_KEY_PREFIX = 'lb_';
const API_KEY_LENGTH = 24;

/**
 * Generate a new API key for a user
 */
export const generateApiKey = (): string => {
    const randomPart = crypto.randomBytes(16).toString('hex').substring(0, API_KEY_LENGTH - API_KEY_PREFIX.length);
    return `${API_KEY_PREFIX}${randomPart}`;
};

/**
 * Hash an API key for secure storage
 */
export const hashApiKey = (key: string): string => {
    return crypto.createHash('sha256').update(key).digest('hex');
};

/**
 * Store API key for a user (stores hashed version)
 */
export const storeApiKey = async (userId: string, key: string): Promise<{ keyPrefix: string }> => {
    const hashedKey = hashApiKey(key);
    const keyPrefix = key.substring(0, 8) + '...';

    await db.collection('users').doc(userId).collection('settings').doc('apiKey').set({
        hashedKey,
        keyPrefix,
        createdAt: new Date().toISOString(),
        lastUsed: null
    });

    return { keyPrefix };
};

/**
 * Revoke (delete) API key for a user
 */
export const revokeApiKey = async (userId: string): Promise<void> => {
    await db.collection('users').doc(userId).collection('settings').doc('apiKey').delete();
};

/**
 * Validate API key and return userId if valid
 */
export const validateApiKey = async (key: string): Promise<string | null> => {
    if (!key || !key.startsWith(API_KEY_PREFIX)) {
        return null;
    }

    const hashedKey = hashApiKey(key);

    // Search for this hashed key across all users
    const usersSnapshot = await db.collectionGroup('settings')
        .where('hashedKey', '==', hashedKey)
        .limit(1)
        .get();

    if (usersSnapshot.empty) {
        return null;
    }

    const doc = usersSnapshot.docs[0];
    // Path is: users/{userId}/settings/apiKey
    const userId = doc.ref.parent.parent?.id;

    if (userId) {
        // Update last used timestamp (fire-and-forget)
        doc.ref.update({ lastUsed: new Date().toISOString() }).catch(() => { });
    }

    return userId || null;
};

/**
 * Authenticate a request using either API key or Firebase token
 * Returns { userId, method: 'apiKey' | 'firebase' } or null if unauthorized
 */
export const authenticateRequest = async (req: any, res: any): Promise<{ userId: string; method: string } | null> => {
    // Check for API key first
    const apiKey = req.headers['x-api-key'] as string;
    if (apiKey) {
        const userId = await validateApiKey(apiKey);
        if (userId) {
            console.log('[API Auth] Authenticated via API key, userId:', userId);
            return { userId, method: 'apiKey' };
        } else {
            res.status(401).json({ error: 'Invalid API key' });
            return null;
        }
    }

    // Fall back to Firebase Auth (existing behavior)
    const authHeader = req.headers['authorization'] as string;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Missing authentication. Use X-API-Key header or Bearer token.' });
        return null;
    }

    try {
        const { getAuth } = await import('firebase-admin/auth');
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await getAuth().verifyIdToken(token);
        console.log('[API Auth] Authenticated via Firebase token, userId:', decodedToken.uid);
        return { userId: decodedToken.uid, method: 'firebase' };
    } catch (error) {
        console.error('[API Auth] Token verification failed:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
        return null;
    }
};
