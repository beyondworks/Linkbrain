import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { setCorsHeaders, handlePreflight } from './_lib/cors';

interface VercelRequest {
    method: string;
    body: any;
    query: any;
    headers: any;
}

interface VercelResponse {
    setHeader: (name: string, value: string) => void;
    status: (code: number) => VercelResponse;
    send: (body: string) => void;
    json: (body: any) => void; // Adding json just in case, though usually send for XML
}

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
const DOMAIN = 'https://linkbrain.ai'; // Replace with actual domain if env var available

export default async function handler(req: VercelRequest, res: VercelResponse) {
    setCorsHeaders(req, res);

    if (handlePreflight(req, res)) {
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Fetch all clips sorted by date
        // Note: For large datasets, you might need pagination or separate sitemap index files.
        // For now, we assume reasonable size for MVP.
        const snapshot = await db.collection('clips')
            .orderBy('updatedAt', 'desc')
            .limit(5000) // Standard sitemap limit is 50k, but let's be safe
            .get();

        const clips = snapshot.docs.map(doc => ({
            id: doc.id,
            updatedAt: doc.data().updatedAt || doc.data().createdAt || new Date().toISOString()
        }));

        // Generate XML
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- Main Pages -->
    <url>
        <loc>${DOMAIN}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${DOMAIN}/#features</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    
    <!-- Dynamic Clip Pages -->
    ${clips.map(clip => `
    <url>
        <loc>${DOMAIN}/clip/${clip.id}</loc>
        <lastmod>${clip.updatedAt.split('T')[0]}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>`).join('')}
</urlset>`;

        // Send response
        res.setHeader('Content-Type', 'text/xml');
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // Cache for 1 hour
        res.status(200).send(sitemap);

    } catch (error: any) {
        console.error('Sitemap generation error:', error);
        res.status(500).send(`Error generating sitemap: ${error.message}`);
    }
}
