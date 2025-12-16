/**
 * API Key Generation Endpoint
 * 
 * POST /api/keys/generate
 * - Requires Firebase Auth
 * - Generates a new API key for the authenticated user
 * - Replaces any existing key
 * 
 * Response: { key: "lb_xxx...", keyPrefix: "lb_xxxx..." }
 */

import { requireAuth } from '../_lib/auth';
import { setCorsHeaders, handlePreflight } from '../_lib/cors';
import { generateApiKey, storeApiKey } from '../_lib/api-key-auth';

export default async function handler(req: any, res: any) {
    setCorsHeaders(req, res);

    if (handlePreflight(req, res)) {
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Require Firebase Auth (can't use API key to generate API key)
        const auth = await requireAuth(req, res);
        if (!auth) return;

        const userId = auth.userId;

        // Generate new API key
        const key = generateApiKey();

        // Store hashed version
        const { keyPrefix } = await storeApiKey(userId, key);

        console.log(`[API Keys] Generated new key for user: ${userId}`);

        // Return the full key (only shown once)
        return res.status(201).json({
            success: true,
            key,
            keyPrefix,
            message: 'API key generated. Save it securely - it will not be shown again.'
        });

    } catch (error: any) {
        console.error('[API Keys] Generate error:', error);
        return res.status(500).json({ error: 'Failed to generate API key' });
    }
}
