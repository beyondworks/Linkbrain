/**
 * Lemon Squeezy Webhook Handler
 * 
 * Handles subscription lifecycle events from Lemon Squeezy
 */

import * as crypto from 'crypto';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin (singleton)
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

// Webhook secret from environment
const WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '';

// Lemon Squeezy Event Types
type LemonSqueezyEventName =
    | 'subscription_created'
    | 'subscription_updated'
    | 'subscription_cancelled'
    | 'subscription_resumed'
    | 'subscription_expired'
    | 'subscription_paused'
    | 'subscription_unpaused'
    | 'order_created';

interface LemonSqueezyWebhookPayload {
    meta: {
        event_name: LemonSqueezyEventName;
        custom_data?: {
            user_id?: string;
        };
    };
    data: {
        id: string;
        type: string;
        attributes: {
            store_id: number;
            customer_id: number;
            order_id?: number;
            product_id: number;
            variant_id: number;
            status: string;
            cancelled: boolean;
            renews_at: string | null;
            ends_at: string | null;
            created_at: string;
            updated_at: string;
            user_email?: string;
            user_name?: string;
        };
    };
}

/**
 * Verify webhook signature
 */
function verifySignature(payload: string, signature: string): boolean {
    if (!WEBHOOK_SECRET) {
        console.error('[LemonSqueezy Webhook] Missing WEBHOOK_SECRET');
        return false;
    }

    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
    const digest = hmac.update(payload).digest('hex');

    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(digest)
    );
}

/**
 * Update user subscription in Firebase
 */
async function updateUserSubscription(
    userId: string,
    subscriptionData: {
        status: 'active' | 'cancelled' | 'expired';
        lemonSqueezySubscriptionId: string;
        lemonSqueezyCustomerId: number;
        productId: number;
        variantId: number;
        renewsAt: string | null;
        endsAt: string | null;
    }
) {
    const userRef = db.collection('users').doc(userId);

    await userRef.set({
        subscriptionStatus: subscriptionData.status,
        subscriptionTier: subscriptionData.status === 'active' ? 'pro' : 'free',
        lemonSqueezy: {
            subscriptionId: subscriptionData.lemonSqueezySubscriptionId,
            customerId: subscriptionData.lemonSqueezyCustomerId,
            productId: subscriptionData.productId,
            variantId: subscriptionData.variantId,
            renewsAt: subscriptionData.renewsAt,
            endsAt: subscriptionData.endsAt,
        },
        updatedAt: new Date().toISOString(),
    }, { merge: true });

    console.log(`[LemonSqueezy Webhook] Updated subscription for user ${userId}: ${subscriptionData.status}`);
}

/**
 * Map Lemon Squeezy status to app status
 */
function mapStatus(lsStatus: string, cancelled: boolean): 'active' | 'cancelled' | 'expired' {
    if (cancelled) {
        return 'cancelled';
    }

    switch (lsStatus) {
        case 'active':
        case 'on_trial':
            return 'active';
        case 'cancelled':
        case 'past_due':
        case 'paused':
            return 'cancelled';
        case 'expired':
        case 'unpaid':
            return 'expired';
        default:
            return 'active';
    }
}

export default async function handler(req: any, res: any) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get raw body for signature verification
        const rawBody = JSON.stringify(req.body);
        const signature = req.headers['x-signature'] as string;

        // Verify signature
        if (!signature || !verifySignature(rawBody, signature)) {
            console.error('[LemonSqueezy Webhook] Invalid signature');
            return res.status(401).json({ error: 'Invalid signature' });
        }

        const payload = req.body as LemonSqueezyWebhookPayload;
        const eventName = payload.meta.event_name;
        const userId = payload.meta.custom_data?.user_id;

        console.log(`[LemonSqueezy Webhook] Received event: ${eventName}`);

        // Handle different event types
        switch (eventName) {
            case 'subscription_created':
            case 'subscription_updated':
            case 'subscription_resumed':
            case 'subscription_unpaused': {
                if (!userId) {
                    console.error('[LemonSqueezy Webhook] Missing user_id in custom_data');
                    return res.status(400).json({ error: 'Missing user_id' });
                }

                await updateUserSubscription(userId, {
                    status: mapStatus(payload.data.attributes.status, payload.data.attributes.cancelled),
                    lemonSqueezySubscriptionId: payload.data.id,
                    lemonSqueezyCustomerId: payload.data.attributes.customer_id,
                    productId: payload.data.attributes.product_id,
                    variantId: payload.data.attributes.variant_id,
                    renewsAt: payload.data.attributes.renews_at,
                    endsAt: payload.data.attributes.ends_at,
                });
                break;
            }

            case 'subscription_cancelled':
            case 'subscription_paused': {
                if (!userId) {
                    console.error('[LemonSqueezy Webhook] Missing user_id in custom_data');
                    return res.status(400).json({ error: 'Missing user_id' });
                }

                await updateUserSubscription(userId, {
                    status: 'cancelled',
                    lemonSqueezySubscriptionId: payload.data.id,
                    lemonSqueezyCustomerId: payload.data.attributes.customer_id,
                    productId: payload.data.attributes.product_id,
                    variantId: payload.data.attributes.variant_id,
                    renewsAt: payload.data.attributes.renews_at,
                    endsAt: payload.data.attributes.ends_at,
                });
                break;
            }

            case 'subscription_expired': {
                if (!userId) {
                    console.error('[LemonSqueezy Webhook] Missing user_id in custom_data');
                    return res.status(400).json({ error: 'Missing user_id' });
                }

                await updateUserSubscription(userId, {
                    status: 'expired',
                    lemonSqueezySubscriptionId: payload.data.id,
                    lemonSqueezyCustomerId: payload.data.attributes.customer_id,
                    productId: payload.data.attributes.product_id,
                    variantId: payload.data.attributes.variant_id,
                    renewsAt: null,
                    endsAt: payload.data.attributes.ends_at,
                });
                break;
            }

            case 'order_created': {
                // Order created - can be used for one-time purchases
                console.log('[LemonSqueezy Webhook] Order created:', payload.data.id);
                break;
            }

            default:
                console.log(`[LemonSqueezy Webhook] Unhandled event: ${eventName}`);
        }

        // Return 200 OK to acknowledge receipt
        return res.status(200).json({ received: true });

    } catch (error: any) {
        console.error('[LemonSqueezy Webhook] Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
