/**
 * Article Generation API Endpoint
 * 
 * POST /api/insights/article
 * Generates an AI-written article from user's weekly clips
 * 
 * Request body:
 * {
 *   userId: string,
 *   period: 'weekly' | 'monthly',
 *   language: 'ko' | 'en'
 * }
 */

import { getFirestore, collection, query, where, orderBy, getDocs, doc, setDoc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Define simple interfaces for Vercel Request/Response
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
    end: () => void;
}

// Initialize Firebase
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

// CORS middleware
const setCorsHeaders = (res: VercelResponse) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );
};

interface ClipData {
    id: string;
    title: string;
    summary: string;
    url: string;
    platform: string;
    keywords: string[];
    category: string;
    createdAt: any;
}

interface GeneratedArticle {
    id: string;
    title: string;
    content: string;
    topics: string[];
    generatedAt: string;
    wordCount: number;
    sourceClips: string[];
}

/**
 * Main handler
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { userId, period = 'weekly', language = 'ko' } = req.body;

        if (!userId) {
            return res.status(401).json({ error: 'User ID is required' });
        }

        console.log(`[Article API] Generating ${period} article for user ${userId}`);

        // Get date range
        const end = new Date();
        const start = new Date();
        if (period === 'monthly') {
            start.setMonth(end.getMonth() - 1);
        } else {
            start.setDate(end.getDate() - 7);
        }

        // Fetch user's clips
        const clipsRef = collection(db, 'clips');
        const q = query(
            clipsRef,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(q);
        const allClips = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as ClipData[];

        // Filter by date
        const clips = allClips.filter(clip => {
            if (!clip.createdAt) return false;
            let clipDate: Date;
            if (clip.createdAt.toDate) {
                clipDate = clip.createdAt.toDate();
            } else if (typeof clip.createdAt === 'string') {
                clipDate = new Date(clip.createdAt);
            } else if (clip.createdAt.seconds) {
                clipDate = new Date(clip.createdAt.seconds * 1000);
            } else {
                return false;
            }
            return clipDate >= start && clipDate <= end;
        });

        console.log(`[Article API] Found ${clips.length} clips in ${period} period`);

        if (clips.length < 3) {
            return res.status(400).json({
                error: language === 'ko'
                    ? '아티클 생성을 위해 최소 3개의 클립이 필요합니다'
                    : 'At least 3 clips are required to generate an article'
            });
        }

        // Generate article using Gemini
        const article = await generateArticle(clips, period, language);

        // Save to Firestore
        const articleId = `${userId}_${period}_${Date.now()}`;
        await setDoc(doc(db, 'generated_articles', articleId), {
            userId,
            ...article,
            period,
            sourceClips: clips.slice(0, 10).map(c => c.id)
        });

        return res.status(200).json({ article });

    } catch (error: any) {
        console.error('[Article API] Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

/**
 * Generate article using Gemini AI
 */
async function generateArticle(
    clips: ClipData[],
    period: 'weekly' | 'monthly',
    language: 'ko' | 'en'
): Promise<GeneratedArticle> {
    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('Gemini API key not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Extract main topics from clips
    const allKeywords: Record<string, number> = {};
    const allCategories: Record<string, number> = {};

    clips.forEach(clip => {
        if (clip.keywords) {
            clip.keywords.forEach(k => {
                const key = k.toLowerCase().trim();
                allKeywords[key] = (allKeywords[key] || 0) + 1;
            });
        }
        if (clip.category) {
            allCategories[clip.category] = (allCategories[clip.category] || 0) + 1;
        }
    });

    const topTopics = Object.entries(allKeywords)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([k]) => k);

    const topCategory = Object.entries(allCategories)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'General';

    // Prepare clip summaries for context
    const clipSummaries = clips.slice(0, 10).map(clip => ({
        title: clip.title,
        summary: clip.summary?.slice(0, 300) || '',
        platform: clip.platform,
        keywords: clip.keywords?.slice(0, 3) || []
    }));

    const periodText = period === 'weekly'
        ? (language === 'ko' ? '이번 주' : 'this week')
        : (language === 'ko' ? '이번 달' : 'this month');

    const prompt = language === 'ko' ? `
당신은 전문 콘텐츠 큐레이터이자 에디터입니다. 사용자가 ${periodText} 저장한 다양한 콘텐츠를 분석하여, 하나의 통합된 인사이트 아티클을 작성해주세요.

## 저장된 콘텐츠 요약
${JSON.stringify(clipSummaries, null, 2)}

## 주요 키워드
${topTopics.join(', ')}

## 작성 가이드라인
1. **글자 수**: 1,500자 ~ 3,000자 사이로 작성
2. **톤&매너**: 전문적이면서도 친근하고 읽기 쉬운 문체
3. **구성**: 
   - 훅(Hook)이 있는 도입부
   - 주요 인사이트 3-4개를 섹션으로 나누어 설명
   - 실용적인 결론 및 액션 아이템
4. **요소**: 팩트 기반, 신뢰성, 전문성, 재미 요소를 모두 포함
5. **형식**: 소제목(##), 불릿 포인트, 이모지를 적절히 활용

## 출력 형식 (JSON)
{
  "title": "아티클 제목 (호기심을 자극하는)",
  "content": "본문 내용 (마크다운 형식)",
  "topics": ["주제1", "주제2", "주제3"]
}

JSON만 출력하세요.
` : `
You are a professional content curator and editor. Analyze the user's saved content from ${periodText} and write a unified insight article.

## Saved Content Summaries
${JSON.stringify(clipSummaries, null, 2)}

## Main Keywords
${topTopics.join(', ')}

## Writing Guidelines
1. **Length**: Between 1,500 to 3,000 characters
2. **Tone**: Professional yet approachable and easy to read
3. **Structure**: 
   - Hook-driven introduction
   - 3-4 main insights as sections
   - Practical conclusion with action items
4. **Elements**: Include facts, credibility, expertise, and engaging elements
5. **Format**: Use subheadings (##), bullet points, and emojis appropriately

## Output Format (JSON)
{
  "title": "Article title (curiosity-inducing)",
  "content": "Body content (markdown format)",
  "topics": ["topic1", "topic2", "topic3"]
}

Output JSON only.
`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Parse JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            const content = parsed.content || '';

            return {
                id: `article_${Date.now()}`,
                title: parsed.title || (language === 'ko' ? '주간 인사이트' : 'Weekly Insights'),
                content: content,
                topics: parsed.topics || topTopics,
                generatedAt: new Date().toISOString(),
                wordCount: content.length,
                sourceClips: []
            };
        }
    } catch (error) {
        console.error('[Article API] Gemini generation error:', error);
    }

    // Fallback article
    return {
        id: `article_${Date.now()}`,
        title: language === 'ko' ? `${periodText} 저장한 콘텐츠 인사이트` : `${periodText} Content Insights`,
        content: language === 'ko'
            ? `## 📊 ${periodText} 트렌드\n\n${topTopics.slice(0, 3).map(t => `- **${t}**: 관련 콘텐츠가 자주 저장되었습니다.`).join('\n')}\n\n## 💡 주요 인사이트\n\n저장하신 콘텐츠들을 분석한 결과, **${topCategory}** 분야에 높은 관심을 보이고 계십니다.\n\n계속해서 관심 분야의 콘텐츠를 저장하시면 더 정확한 분석을 제공해 드릴 수 있습니다.`
            : `## 📊 ${periodText} Trends\n\n${topTopics.slice(0, 3).map(t => `- **${t}**: Frequently saved content.`).join('\n')}\n\n## 💡 Key Insights\n\nBased on your saved content, you show high interest in **${topCategory}**.\n\nContinue saving content in your areas of interest for more accurate analysis.`,
        topics: topTopics,
        generatedAt: new Date().toISOString(),
        wordCount: 500,
        sourceClips: []
    };
}
