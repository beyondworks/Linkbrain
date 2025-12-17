// Paste this in browser console while the app is running (localhost:5173)
// Make sure you're logged in first

(async function seedPublicClips() {
    const { collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');

    // Get db from window (exposed by the app)
    const db = window.__FIREBASE_DB__ || (await import('/src/lib/firebase.ts')).db;

    const sampleClips = [
        {
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            title: 'Building a Modern Design System with Figma',
            summary: 'Learn how to create scalable design systems that work across teams. This comprehensive guide covers tokens, components, and documentation.',
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
            platform: 'youtube',
            category: 'UI Design',
            keywords: ['figma', 'design system', 'ui', 'components'],
            saveCount: 42,
            viewCount: 156,
            commentCount: 5,
            isApproved: true,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
            url: 'https://github.com/vercel/next.js',
            title: 'Next.js 15: Server Components Deep Dive',
            summary: 'Understanding React Server Components in Next.js 15. Performance optimization, streaming, and best practices for production apps.',
            image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
            platform: 'web',
            category: 'Frontend Development',
            keywords: ['nextjs', 'react', 'server components', 'javascript'],
            saveCount: 89,
            viewCount: 324,
            commentCount: 12,
            isApproved: true,
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        {
            url: 'https://openai.com/blog/gpt-4-turbo',
            title: 'GPT-4 Turbo vs Claude 3.5: Complete Comparison',
            summary: 'Detailed analysis of the latest LLM models. Benchmarks, use cases, pricing, and which one to choose for your project.',
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
            platform: 'web',
            category: 'AI',
            keywords: ['gpt-4', 'claude', 'llm', 'artificial intelligence'],
            saveCount: 156,
            viewCount: 523,
            commentCount: 23,
            isApproved: true,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            url: 'https://ethereum.org/roadmap',
            title: 'Ethereum 2024 Roadmap: What to Expect',
            summary: 'Analysis of Ethereum upcoming upgrades including Dencun, proto-danksharding, and the path to full scalability.',
            image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80',
            platform: 'web',
            category: 'Blockchain',
            keywords: ['ethereum', 'crypto', 'web3', 'blockchain'],
            saveCount: 67,
            viewCount: 234,
            commentCount: 8,
            isApproved: true,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            url: 'https://www.ycombinator.com/blog/startup-playbook',
            title: 'Y Combinator Startup Playbook 2024 Edition',
            summary: 'Updated guide from YC on building successful startups. Product-market fit, fundraising, and scaling strategies.',
            image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
            platform: 'web',
            category: 'Startup',
            keywords: ['startup', 'yc', 'entrepreneurship', 'funding'],
            saveCount: 234,
            viewCount: 789,
            commentCount: 34,
            isApproved: true,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            url: 'https://blog.hubspot.com/marketing/ai-marketing',
            title: 'AI Marketing Automation: Complete Guide',
            summary: 'How to leverage AI tools for marketing. Email automation, content generation, and personalization at scale.',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
            platform: 'web',
            category: 'Marketing',
            keywords: ['marketing', 'automation', 'ai', 'growth'],
            saveCount: 45,
            viewCount: 178,
            commentCount: 6,
            isApproved: true,
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            url: 'https://www.notion.so/templates',
            title: 'Notion Templates for Maximum Productivity',
            summary: 'Top 10 Notion templates that will transform your workflow. Project management, note-taking, and life organization.',
            image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80',
            platform: 'web',
            category: 'Productivity',
            keywords: ['notion', 'templates', 'productivity', 'workflow'],
            saveCount: 78,
            viewCount: 267,
            commentCount: 9,
            isApproved: true,
            createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];

    console.log('Seeding public clips...');

    for (const clip of sampleClips) {
        try {
            const docRef = await addDoc(collection(db, 'publicClips'), clip);
            console.log('✓ Added:', clip.title);
        } catch (error) {
            console.error('✗ Error adding:', clip.title, error);
        }
    }

    console.log('Done! Refresh the page to see the clips.');
})();
