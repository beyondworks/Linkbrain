import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { setCorsHeaders, handlePreflight } from '../_lib/cors';

interface VercelRequest {
    method: string;
    body: any;
    query: any;
    headers: any;
}

interface VercelResponse {
    setHeader: (name: string, value: string) => void;
    status: (code: number) => VercelResponse;
    json: (body: any) => void;
}

// Initialize Firebase Admin (shared logic, should be in _lib really)
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
    setCorsHeaders(req, res);

    if (handlePreflight(req, res)) {
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { paymentKey, orderId, amount, userId } = req.body;

    if (!paymentKey || !orderId || !amount) {
        return res.status(400).json({ error: 'Missing payment details' });
    }

    try {
        // 1. Confirm payment with Toss Payments API
        const encryptedSecretKey = Buffer.from(`${process.env.TOSS_SECRET_KEY}:`).toString('base64');

        const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
            method: 'POST',
            body: JSON.stringify({ paymentKey, orderId, amount }),
            headers: {
                Authorization: `Basic ${encryptedSecretKey}`,
                'Content-Type': 'application/json',
            },
        });

        const json = await response.json();

        if (!response.ok) {
            console.error('Toss Payments Confirm Failed:', json);
            return res.status(response.status).json({ error: json.message || 'Payment confirmation failed' });
        }

        // 2. Update User Subscription in Firestore
        // Assuming orderId roughly maps to subscription tracking or we just enable Pro for now
        if (userId) {
            await db.collection('users').doc(userId).set({
                subscriptionStatus: 'active',
                subscriptionTier: 'pro',
                subscriptionProvider: 'toss',
                subscriptionId: json.paymentKey, // or orderId
                updatedAt: new Date().toISOString()
            }, { merge: true });
        }

        res.status(200).json({ success: true, payment: json });

    } catch (error: any) {
        console.error('Toss Payments Error:', error);
        res.status(500).json({ error: error.message });
    }
}
