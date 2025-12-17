import Stripe from 'stripe';
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

// Initialize Firebase Admin
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

    const { userId, returnUrl } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
        console.error('Missing Stripe Secret Key');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-12-15.clover',
    });

    try {
        // Get user's Stripe customer ID from Firestore
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();

        let customerId = userData?.stripeCustomerId;

        // If no customer ID stored, try to find by email or create new
        if (!customerId && userData?.email) {
            const customers = await stripe.customers.list({
                email: userData.email,
                limit: 1
            });

            if (customers.data.length > 0) {
                customerId = customers.data[0].id;
                // Save for future
                await db.collection('users').doc(userId).update({
                    stripeCustomerId: customerId
                });
            } else {
                // Create new customer
                const newCustomer = await stripe.customers.create({
                    email: userData.email,
                    metadata: { userId }
                });
                customerId = newCustomer.id;
                await db.collection('users').doc(userId).update({
                    stripeCustomerId: customerId
                });
            }
        }

        if (!customerId) {
            return res.status(404).json({ error: 'No billing information found' });
        }

        // Create Stripe Customer Portal session
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: returnUrl || `${req.headers.origin || 'https://linkbrain.cloud'}/`,
        });

        res.status(200).json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe Portal Error:', error);
        res.status(500).json({ error: error.message });
    }
}
