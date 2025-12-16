// AI Service - Handles OpenAI and Gemini API calls
// Supports GPT-5.2, GPT-4o, Gemini 3 Pro, Gemini 2.5, etc.

export interface AIConfig {
    provider: 'openai' | 'gemini';
    apiKey: string;
    model: string;
}

export interface AIResponse {
    success: boolean;
    content?: string;
    error?: string;
}

// Get current AI configuration from localStorage
export const getAIConfig = (): AIConfig | null => {
    const provider = localStorage.getItem('ai_provider') as 'openai' | 'gemini' | null;
    const apiKey = localStorage.getItem('ai_api_key');
    const model = localStorage.getItem('ai_model');

    if (!provider || !apiKey || apiKey.length < 10) {
        return null;
    }

    return { provider, apiKey, model: model || getDefaultModel(provider) };
};

const getDefaultModel = (provider: 'openai' | 'gemini'): string => {
    return provider === 'openai' ? 'gpt-4o' : 'gemini-2.0-flash';
};

// Validate API key by making a test request
export const validateApiKey = async (provider: 'openai' | 'gemini', apiKey: string, model: string): Promise<AIResponse> => {
    try {
        if (provider === 'openai') {
            return await callOpenAI(apiKey, model, 'Say "OK" if you can hear me.');
        } else {
            return await callGemini(apiKey, model, 'Say "OK" if you can hear me.');
        }
    } catch (error: any) {
        return { success: false, error: error.message || 'API validation failed' };
    }
};

// Call OpenAI API
export const callOpenAI = async (apiKey: string, model: string, prompt: string): Promise<AIResponse> => {
    try {
        // Use model directly - SettingsModal now uses real OpenAI model names
        const actualModel = model || 'gpt-4o';

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: actualModel,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 2000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        return { success: true, content };
    } catch (error: any) {
        console.error('[AI Service] OpenAI error:', error);
        return { success: false, error: error.message || 'OpenAI API call failed' };
    }
};

// Call Gemini API
export const callGemini = async (apiKey: string, model: string, prompt: string): Promise<AIResponse> => {
    try {
        // Use model directly - SettingsModal now uses real Gemini model names
        const actualModel = model || 'gemini-1.5-flash';

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${actualModel}:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2000
                    }
                })
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return { success: true, content };
    } catch (error: any) {
        console.error('[AI Service] Gemini error:', error);
        return { success: false, error: error.message || 'Gemini API call failed' };
    }
};

// Generate AI insights report
export const generateAIReport = async (clips: any[], language: 'ko' | 'en'): Promise<AIResponse> => {
    const config = getAIConfig();
    if (!config) {
        return { success: false, error: 'AI not configured' };
    }

    const clipSummaries = clips.slice(0, 10).map((clip, i) =>
        `${i + 1}. ${clip.title || clip.url}\n   Keywords: ${(clip.tags || clip.keywords || []).join(', ')}\n   Summary: ${clip.summary || clip.description || ''}`
    ).join('\n\n');

    const prompt = language === 'ko'
        ? `다음은 사용자가 저장한 콘텐츠 목록입니다. 이 콘텐츠들을 분석하여 인사이트 리포트를 작성해주세요.

콘텐츠 목록:
${clipSummaries}

다음 형식으로 작성해주세요:
1. **주요 관심 분야**: 사용자가 주로 관심있어 하는 주제들
2. **핵심 인사이트**: 콘텐츠에서 발견된 중요한 패턴이나 트렌드
3. **추천**: 사용자에게 도움이 될 수 있는 제안

간결하고 유익하게 작성해주세요.`
        : `Here are the contents saved by the user. Please analyze them and create an insights report.

Content list:
${clipSummaries}

Please write in the following format:
1. **Main Interests**: Topics the user is mainly interested in
2. **Key Insights**: Important patterns or trends found in the content
3. **Recommendations**: Suggestions that could help the user

Please write concisely and informatively.`;

    if (config.provider === 'openai') {
        return await callOpenAI(config.apiKey, config.model, prompt);
    } else {
        return await callGemini(config.apiKey, config.model, prompt);
    }
};

// Generate AI article
export const generateAIArticle = async (clips: any[], language: 'ko' | 'en'): Promise<AIResponse> => {
    const config = getAIConfig();
    if (!config) {
        return { success: false, error: 'AI not configured' };
    }

    const clipSummaries = clips.slice(0, 8).map((clip, i) =>
        `${i + 1}. ${clip.title || clip.url}\n   ${clip.summary || clip.description || ''}`
    ).join('\n\n');

    const topics = [...new Set(clips.flatMap(c => c.tags || c.keywords || []))].slice(0, 5);

    const prompt = language === 'ko'
        ? `다음 콘텐츠들을 바탕으로 "${topics[0] || '기술'}"에 대한 오리지널 아티클을 작성해주세요.

참고 콘텐츠:
${clipSummaries}

다음 조건으로 작성해주세요:
- 500-800자 분량
- 인사이트가 담긴 분석적 글
- 마크다운 형식 사용 (## 헤더, **강조** 등)
- 결론에 실천적 조언 포함`
        : `Based on the following content, please write an original article about "${topics[0] || 'technology'}".

Reference content:
${clipSummaries}

Please write with these conditions:
- 400-600 words
- Analytical writing with insights
- Use markdown format (## headers, **bold**, etc.)
- Include actionable advice in conclusion`;

    if (config.provider === 'openai') {
        return await callOpenAI(config.apiKey, config.model, prompt);
    } else {
        return await callGemini(config.apiKey, config.model, prompt);
    }
};

// AI Chat
export const sendAIChat = async (message: string, context: string, language: 'ko' | 'en'): Promise<AIResponse> => {
    const config = getAIConfig();
    if (!config) {
        return { success: false, error: 'AI not configured' };
    }

    const prompt = language === 'ko'
        ? `사용자의 저장된 콘텐츠를 기반으로 질문에 답변해주세요.

저장된 콘텐츠 요약:
${context}

사용자 질문: ${message}

간결하고 도움이 되는 답변을 제공해주세요.`
        : `Please answer the question based on the user's saved content.

Saved content summary:
${context}

User question: ${message}

Please provide a concise and helpful answer.`;

    if (config.provider === 'openai') {
        return await callOpenAI(config.apiKey, config.model, prompt);
    } else {
        return await callGemini(config.apiKey, config.model, prompt);
    }
};
