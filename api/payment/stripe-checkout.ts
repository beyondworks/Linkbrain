import Stripe from 'stripe';
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
    setCorsHeaders(req, res);

    if (handlePreflight(req, res)) {
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { priceId, successUrl, cancelUrl, customerEmail, userId } = req.body;

    if (!process.env.STRIPE_SECRET_KEY) {
        console.error('Missing Stripe Secret Key');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-11-20.acacia', // Or latest
    });

    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            customer_email: customerEmail,
            line_items: [
                {
                    price: priceId, // You'll need to pass the Stripe Price ID from frontend
                    quantity: 1,
                },
            ],
            success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl,
            metadata: {
                userId: userId, // Critical for matching user after payment
            },
        });

        res.status(200).json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        res.status(500).json({ error: error.message });
    }
}
