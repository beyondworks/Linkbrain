/**
 * API Key Revocation Endpoint
 * 
 * DELETE /api/keys/revoke
 * - Requires Firebase Auth
 * - Deletes the API key for the authenticated user
 * 
 * Response: { success: true }
 */

import { requireAuth } from '../_lib/auth';
import { setCorsHeaders, handlePreflight } from '../_lib/cors';
import { revokeApiKey } from '../_lib/api-key-auth';

export default async function handler(req: any, res: any) {
    setCorsHeaders(req, res);

    if (handlePreflight(req, res)) {
        return;
    }

    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Require Firebase Auth
        const auth = await requireAuth(req, res);
        if (!auth) return;

        const userId = auth.userId;

        // Revoke API key
        await revokeApiKey(userId);

        console.log(`[API Keys] Revoked key for user: ${userId}`);

        return res.status(200).json({
            success: true,
            message: 'API key revoked successfully.'
        });

    } catch (error: any) {
        console.error('[API Keys] Revoke error:', error);
        return res.status(500).json({ error: 'Failed to revoke API key' });
    }
}
