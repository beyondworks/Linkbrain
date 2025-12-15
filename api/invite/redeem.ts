import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Initialize Firebase Admin
if (!getApps().length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY || '{}');
    initializeApp({
        credential: cert(serviceAccount),
    });
}

const db = getFirestore();

// 체험 기간 연장 일수
const EXTENSION_DAYS = 2;

/**
 * 초대 코드 사용 API
 * 
 * POST /api/invite/redeem
 * Body: { code: string, newUserUid: string }
 * 
 * 기능:
 * 1. 초대 코드 사용 처리
 * 2. 초대한 사람 체험 기간 +2일 연장
 * 3. 신규 유저 구독 초기화
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const { code, newUserUid } = req.body;

        if (!code || !newUserUid) {
            return res.status(400).json({ success: false, error: 'Missing code or newUserUid' });
        }

        const normalizedCode = code.toUpperCase();

        // 1. 초대 코드 소유자 찾기
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

        // 2. 초대 코드 사용 처리 & 초대자 체험 기간 연장
        const updatedCodes = inviterSubscription.inviteCodes.map((c: any) => {
            if (c.code === normalizedCode) {
                return {
                    ...c,
                    usedBy: newUserUid,
                    usedAt: new Date().toISOString(),
                };
            }
            return c;
        });

        const currentEndDate = new Date(inviterSubscription.trialEndDate);
        currentEndDate.setDate(currentEndDate.getDate() + EXTENSION_DAYS);

        const inviterSubRef = db.doc(`users/${inviterUid}/settings/subscription`);
        await inviterSubRef.update({
            inviteCodes: updatedCodes,
            referralCount: (inviterSubscription.referralCount || 0) + 1,
            trialEndDate: currentEndDate.toISOString(),
        });

        // 3. 신규 유저 구독 초기화
        const now = new Date();
        const trialEnd = new Date(now);
        trialEnd.setDate(trialEnd.getDate() + 15); // 15일 체험

        // 초대 코드 5개 생성
        const generateCode = () => {
            const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            let code = '';
            for (let i = 0; i < 6; i++) {
                code += charset.charAt(Math.floor(Math.random() * charset.length));
            }
            return `LB-${code}`;
        };

        const newUserCodes = [];
        for (let i = 0; i < 5; i++) {
            newUserCodes.push({
                code: generateCode(),
                usedBy: null,
                usedAt: null,
                createdAt: now.toISOString(),
            });
        }

        const newUserSubRef = db.doc(`users/${newUserUid}/settings/subscription`);
        await newUserSubRef.set({
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

    } catch (error: any) {
        console.error('[Invite Redeem API] Error:', error);
        return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
    }
}
