import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
if (!getApps().length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY || '{}');
    initializeApp({
        credential: cert(serviceAccount),
    });
}

const db = getFirestore();

/**
 * 초대 코드 검증 API
 * 
 * POST /api/invite/validate
 * Body: { code: string }
 * 
 * 응답:
 * - 200: { valid: true, inviterUid: string }
 * - 400: { valid: false, error: string }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ valid: false, error: 'Method not allowed' });
    }

    try {
        const { code } = req.body;

        if (!code || typeof code !== 'string') {
            return res.status(400).json({ valid: false, error: 'Invalid code format' });
        }

        // 코드 형식 검증 (LB-XXXXXX)
        const codePattern = /^LB-[A-Z2-9]{6}$/;
        if (!codePattern.test(code.toUpperCase())) {
            return res.status(400).json({ valid: false, error: 'Invalid code format' });
        }

        const normalizedCode = code.toUpperCase();

        // 모든 유저의 subscription에서 해당 코드 검색
        const usersRef = db.collection('users');
        const usersSnap = await usersRef.get();

        let inviterUid: string | null = null;
        let codeData: any = null;

        for (const userDoc of usersSnap.docs) {
            const subRef = db.doc(`users/${userDoc.id}/settings/subscription`);
            const subSnap = await subRef.get();

            if (subSnap.exists) {
                const subscription = subSnap.data();
                const inviteCodes = subscription?.inviteCodes || [];

                const matchedCode = inviteCodes.find((c: any) => c.code === normalizedCode);

                if (matchedCode) {
                    inviterUid = userDoc.id;
                    codeData = matchedCode;
                    break;
                }
            }
        }

        if (!inviterUid || !codeData) {
            return res.status(400).json({ valid: false, error: 'Code not found' });
        }

        if (codeData.usedBy) {
            return res.status(400).json({ valid: false, error: 'Code already used' });
        }

        return res.status(200).json({
            valid: true,
            inviterUid,
        });

    } catch (error: any) {
        console.error('[Invite Validate API] Error:', error);
        return res.status(500).json({ valid: false, error: error.message || 'Internal server error' });
    }
}
