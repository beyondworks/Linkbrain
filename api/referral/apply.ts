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

// Credit bonuses
const REFERRAL_BONUS = {
    free: 100,
    pro: 200,
    welcome: 50,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { referralCode, newUserId } = req.body;

        if (!referralCode || !newUserId) {
            return res.status(400).json({ error: 'Missing referralCode or newUserId' });
        }

        // 1. Find the referrer by their referral code
        const usersRef = db.collectionGroup('credits');
        const snapshot = await usersRef.where('referralCode', '==', referralCode).limit(1).get();

        if (snapshot.empty) {
            return res.status(404).json({ error: 'Invalid referral code' });
        }

        const referrerDoc = snapshot.docs[0];
        const referrerData = referrerDoc.data();
        const referrerId = referrerDoc.ref.parent.parent?.id;

        if (!referrerId) {
            return res.status(500).json({ error: 'Could not find referrer user' });
        }

        // 2. Check if new user already used a referral
        const newUserCreditsRef = db.doc(`users/${newUserId}/settings/credits`);
        const newUserCreditsSnap = await newUserCreditsRef.get();

        if (newUserCreditsSnap.exists && newUserCreditsSnap.data()?.referredBy) {
            return res.status(400).json({ error: 'Referral already applied' });
        }

        // 3. Determine bonus amounts
        const referrerTier = referrerData.tier || 'free';
        const referrerBonus = REFERRAL_BONUS[referrerTier as 'free' | 'pro'] || REFERRAL_BONUS.free;
        const newUserBonus = REFERRAL_BONUS.welcome;

        // 4. Apply bonuses in a batch
        const batch = db.batch();

        // Referrer gets bonus
        const referrerCreditsRef = db.doc(`users/${referrerId}/settings/credits`);
        batch.update(referrerCreditsRef, {
            credits: FieldValue.increment(referrerBonus),
            referralCount: FieldValue.increment(1),
        });

        // New user gets welcome bonus and marks referrer
        batch.set(newUserCreditsRef, {
            referredBy: referrerId,
            credits: FieldValue.increment(newUserBonus),
        }, { merge: true });

        await batch.commit();

        return res.status(200).json({
            success: true,
            message: 'Referral applied successfully',
            bonuses: {
                referrer: referrerBonus,
                newUser: newUserBonus,
            },
        });

    } catch (error: any) {
        console.error('[Referral API] Error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}
