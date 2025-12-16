/**
 * Invite Code Management API
 * 
 * Unified endpoint for invite operations:
 * - POST /api/invite?action=validate - Validate code
 * - POST /api/invite?action=redeem - Redeem code
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { setCorsHeaders, handlePreflight } from './_lib/cors';

// Initialize Firebase Admin
if (!getApps().length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY || '{}');
    initializeApp({
        credential: cert(serviceAccount),
    });
}

const db = getFirestore();
const EXTENSION_DAYS = 2;

export default async function handler(req: any, res: any) {
    setCorsHeaders(req, res);

    if (handlePreflight(req, res)) {
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const action = req.query.action || req.body?.action || 'validate';

    try {
        if (action === 'validate') {
            return await handleValidate(req, res);
        } else if (action === 'redeem') {
            return await handleRedeem(req, res);
        } else {
            return res.status(400).json({ error: 'Invalid action' });
        }
    } catch (error: any) {
        console.error('[Invite API] Error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}

// Validate invite code
async function handleValidate(req: any, res: any) {
    const { code } = req.body;

    if (!code || typeof code !== 'string') {
        return res.status(400).json({ valid: false, error: 'Invalid code format' });
    }

    const codePattern = /^LB-[A-Z2-9]{6}$/;
    if (!codePattern.test(code.toUpperCase())) {
        return res.status(400).json({ valid: false, error: 'Invalid code format' });
    }

    const normalizedCode = code.toUpperCase();
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

    return res.status(200).json({ valid: true, inviterUid });
}

// Redeem invite code
async function handleRedeem(req: any, res: any) {
    const { code, newUserUid } = req.body;

    if (!code || !newUserUid) {
        return res.status(400).json({ success: false, error: 'Missing code or newUserUid' });
    }

    const normalizedCode = code.toUpperCase();
    const usersRef = db.collection('users');
    const usersSnap = await usersRef.get();

    let inviterUid: string | null = null;
    let inviterSubscription: any = null;

    for (const userDoc of usersSnap.docs) {
        const subRef = db.doc(`users/${userDoc.id}/settings/subscription`);
        const subSnap = await subRef.get();

        if (subSnap.exists) {
            const subscription = subSnap.data();
            const inviteCodes = subscription?.inviteCodes || [];
            const matchedCode = inviteCodes.find((c: any) => c.code === normalizedCode);

            if (matchedCode) {
                if (matchedCode.usedBy) {
                    return res.status(400).json({ success: false, error: 'Code already used' });
                }
                inviterUid = userDoc.id;
                inviterSubscription = subscription;
                break;
            }
        }
    }

    if (!inviterUid || !inviterSubscription) {
        return res.status(400).json({ success: false, error: 'Invalid code' });
    }

    // Update inviter's codes
    const updatedCodes = inviterSubscription.inviteCodes.map((c: any) => {
        if (c.code === normalizedCode) {
            return { ...c, usedBy: newUserUid, usedAt: new Date().toISOString() };
        }
        return c;
    });

    const currentEndDate = new Date(inviterSubscription.trialEndDate);
    currentEndDate.setDate(currentEndDate.getDate() + EXTENSION_DAYS);

    await db.doc(`users/${inviterUid}/settings/subscription`).update({
        inviteCodes: updatedCodes,
        referralCount: (inviterSubscription.referralCount || 0) + 1,
        trialEndDate: currentEndDate.toISOString(),
    });

    // Create new user subscription
    const now = new Date();
    const trialEnd = new Date(now);
    trialEnd.setDate(trialEnd.getDate() + 15);

    const generateCode = () => {
        const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return `LB-${code}`;
    };

    const newUserCodes = Array.from({ length: 5 }, () => ({
        code: generateCode(),
        usedBy: null,
        usedAt: null,
        createdAt: now.toISOString(),
    }));

    await db.doc(`users/${newUserUid}/settings/subscription`).set({
        plan: 'trial',
        trialStartDate: now.toISOString(),
        trialEndDate: trialEnd.toISOString(),
        referredBy: inviterUid,
        inviteCodes: newUserCodes,
        referralCount: 0,
        proStartDate: null,
        proEndDate: null,
    });

    return res.status(200).json({
        success: true,
        message: 'Invite code redeemed successfully',
        trialEndDate: trialEnd.toISOString(),
        inviterExtended: true,
    });
}
