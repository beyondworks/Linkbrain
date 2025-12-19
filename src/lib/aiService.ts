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

    console.log('[AI Config] Provider:', provider, 'Model:', model, 'API Key exists:', !!apiKey);

    if (!provider || !apiKey || apiKey.length < 10) {
        console.warn('[AI Config] Missing config - provider:', provider, 'apiKey length:', apiKey?.length);
        return null;
    }

    // Migrate invalid model names to valid ones
    let finalModel = model || getDefaultModel(provider);

    // List of valid models - 실제 API에서 작동하는 모델명
    const validOpenAIModels = [
        'gpt-5.2-pro', 'gpt-5.2-chat-latest', 'gpt-5.2',  // GPT-5 시리즈
        'gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4',  // GPT-4 시리즈
        'gpt-3.5-turbo'  // 레거시
    ];
    const validGeminiModels = [
        'gemini-2.5-pro-preview-05-06', 'gemini-2.5-flash-preview-05-20',  // Gemini 2.5
        'gemini-2.0-flash', 'gemini-2.0-flash-exp',  // Gemini 2.0
        'gemini-1.5-pro', 'gemini-1.5-flash'  // Gemini 1.5
    ];

    if (provider === 'openai' && !validOpenAIModels.includes(finalModel)) {
        console.warn('[AI Config] Invalid OpenAI model:', finalModel, '- resetting to gpt-4o');
        finalModel = 'gpt-4o';
        localStorage.setItem('ai_model', finalModel);
        localStorage.setItem('openai_model', finalModel);
    }

    if (provider === 'gemini' && !validGeminiModels.includes(finalModel)) {
        console.warn('[AI Config] Invalid Gemini model:', finalModel, '- resetting to gemini-1.5-pro');
        finalModel = 'gemini-1.5-pro';
        localStorage.setItem('ai_model', finalModel);
        localStorage.setItem('gemini_model', finalModel);
    }

    console.log('[AI Config] Using model:', finalModel);

    return { provider, apiKey, model: finalModel };
};

const getDefaultModel = (provider: 'openai' | 'gemini'): string => {
    return provider === 'openai' ? 'gpt-4o' : 'gemini-2.5-flash';
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

        // GPT-5.2 및 최신 모델은 max_completion_tokens 사용
        const isNewModel = actualModel.startsWith('gpt-5') || actualModel.startsWith('o1') || actualModel.startsWith('o3') || actualModel.startsWith('o4');
        const tokenParams = isNewModel
            ? { max_completion_tokens: 2000 }
            : { max_tokens: 2000 };

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: actualModel,
                messages: [{ role: 'user', content: prompt }],
                ...tokenParams,
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
export const generateAIReport = async (
    clips: any[],
    relatedClips: any[],
    startDate: string,
    endDate: string,
    language: 'ko' | 'en'
): Promise<AIResponse> => {
    const config = getAIConfig();
    if (!config) {
        return { success: false, error: 'AI not configured' };
    }

    const clipSummaries = clips.map((clip, i) =>
        `[${i + 1}] Title: ${clip.title || clip.url}\n    Date: ${new Date(clip.createdAt?.seconds ? clip.createdAt.seconds * 1000 : clip.createdAt).toISOString().split('T')[0]}\n    Keywords: ${(clip.tags || clip.keywords || []).join(', ')}\n    Summary: ${clip.summary || clip.description || ''}`
    ).join('\n\n');

    const relatedSummaries = relatedClips.map((clip, i) =>
        `[R-${i + 1}] Title: ${clip.title || clip.url}\n    Date: ${new Date(clip.createdAt?.seconds ? clip.createdAt.seconds * 1000 : clip.createdAt).toISOString().split('T')[0]}\n    Keywords: ${(clip.tags || clip.keywords || []).join(', ')}\n    Summary: ${clip.summary || clip.description || ''}`
    ).join('\n\n');

    const prompt = language === 'ko'
        ? `
[인사이트 리포트 생성 요청]

다음은 사용자가 선택한 기간(${startDate} ~ ${endDate}) 동안 저장한 클립 목록입니다.
또한, 이 기간의 클립과 주제적으로 연관된 과거 클립들도 함께 제공됩니다.

[선택 기간 클립 (${clips.length}개)]
${clipSummaries}

[과거 연관 클립 (${relatedClips.length}개) - 맥락 참고용]
${relatedSummaries}

📌 분석 지침:
1. 선택 기간 내 클립들을 개별적으로 요약하지 마세요.
2. 반복 등장하는 키워드, 문제의식, 관점 변화를 중심으로 '하나의 큰 흐름'을 먼저 도출하세요.
3. 그 흐름이 과거 클립의 어떤 맥락에서 출발했는지 연결하세요.
4. 사용자의 관심사가 과거엔 무엇이었고, 어떻게 확장/변형되었으며, 현재 어떤 단계에 도달했는지 '관심사의 진화' 관점에서 설명하세요.

[지식 네트워크 관점]
이 클립들을 하나의 '지식 네트워크'로 간주하세요.
각 클립은 노드(node)이며, 공통 키워드, 문제의식, 인용, 주제 확장은 엣지(edge)입니다.
- 가장 중심이 되는 노드(주제)는 무엇인가?
- 주변부에서 점점 중심으로 이동한 주제는 무엇인가?
- 최근에 새롭게 등장한 노드는 무엇이며, 기존 어떤 노드와 연결되는가?

📌 출력 형식 (Markdown):
## 핵심 인사이트 요약
(3~5줄로 핵심만 요약)

## 관심사 흐름 타임라인
- **과거**: (과거 클립 기반 배경)
- **전환점**: (변화의 계기가 된 콘텐츠나 시점)
- **현재**: (최근 집중하고 있는 주제)

## 최근 변화의 특징
(최근 기간의 두드러진 특징 서술)

## 주목하고 있는 핵심 주제
1. **주제 1**: 설명
2. **주제 2**: 설명
3. **주제 3**: 설명

## 다음 단계 제안
(데이터 기반으로 추론된 다음 관심사 제안 - 추측 금지)

⚠️ 주의:
- 데이터에 없는 내용은 절대 생성하지 마세요.
- 일반적인 트렌드 설명을 하지 말고, 오직 제공된 클립 간의 관계만 분석하세요.

[시스템 안전장치]
선택 기간이 길 경우, 최근 클립을 우선적으로 분석하되 과거 클립은 '연결 맥락 설명'에만 사용하세요.
모든 클립을 동일 비중으로 처리하지 마세요.
`
        : `
[Generate Insights Report]

Here is the list of clips saved by the user during the selected period (${startDate} ~ ${endDate}).
Also provided are past clips that are thematically related to this period.

[Selected Period Clips (${clips.length})]
${clipSummaries}

[Related Past Clips (${relatedClips.length}) - For Context]
${relatedSummaries}

📌 Analysis Guidelines:
1. Do NOT summarize clips individually.
2. Identify a "major flow" focusing on recurring keywords, issues, and perspective shifts.
3. Connect this flow to the context from past clips.
4. Explain the "Evolution of Interests": what they were initially, how they expanded/changed, and where they are now.

[Knowledge Network Perspective]
Treat these clips as a 'knowledge network'.
Each clip is a node, and common keywords, issues, citations, topic expansions are edges.
- What is the most central node (topic)?
- Which topics moved from the periphery to the center?
- What new nodes appeared recently, and which existing nodes do they connect to?

📌 Output Format (Markdown):
## Key Insights Summary
(3-5 lines of core summary)

## Interest Timeline
- **Past**: (Background from past clips)
- **Turning Point**: (Content or moment that triggered change)
- **Present**: (Currently focused topics)

## Characteristics of Recent Changes
(Description of notable changes in the recent period)

## Core Topics in Focus
1. **Topic 1**: Description
2. **Topic 2**: Description
3. **Topic 3**: Description

## Suggested Next Steps
(Data-driven suggestions for future interests - no speculation)

⚠️ Warning:
- Do NOT generate content not present in the data.
- Do NOT describe general trends, only analyze relationships between provided clips.

[System Safeguard]
If the period is long, prioritize recent clips for analysis and use past clips only for contextual connection.
Do not treat all clips with equal weight.
`;

    if (config.provider === 'openai') {
        return await callOpenAI(config.apiKey, config.model, prompt);
    } else {
        return await callGemini(config.apiKey, config.model, prompt);
    }
};

// Generate AI article
export const generateAIArticle = async (
    clips: any[],
    relatedClips: any[],
    insightSummary: string,
    language: 'ko' | 'en'
): Promise<AIResponse> => {
    const config = getAIConfig();
    if (!config) {
        return { success: false, error: 'AI not configured' };
    }

    const clipSummaries = clips.map((clip, i) =>
        `[Current-${i + 1}] ${clip.title || clip.url}\n   Date: ${new Date(clip.createdAt?.seconds ? clip.createdAt.seconds * 1000 : clip.createdAt).toISOString().split('T')[0]}\n   Keywords: ${(clip.tags || clip.keywords || []).join(', ')}\n   Summary: ${clip.summary || clip.description || ''}`
    ).join('\n\n');

    const relatedSummaries = relatedClips.map((clip, i) =>
        `[Past-${i + 1}] ${clip.title || clip.url}\n   Date: ${new Date(clip.createdAt?.seconds ? clip.createdAt.seconds * 1000 : clip.createdAt).toISOString().split('T')[0]}\n   Keywords: ${(clip.tags || clip.keywords || []).join(', ')}\n   Summary: ${clip.summary || clip.description || ''}`
    ).join('\n\n');

    const prompt = language === 'ko'
        ? `
[오리지널 아티클 작성 요청]

다음은 한 사용자가 일정 기간 동안 저장한 콘텐츠와, 그 이전부터 축적해온 관련 콘텐츠를 기반으로 도출된 인사이트입니다.

[인사이트 요약]
${insightSummary}

[선택 기간 클립 - 최근 (${clips.length}개)]
${clipSummaries}

[과거 연관 클립 - 배경/맥락 (${relatedClips.length}개)]
${relatedSummaries}

📌 아티클 작성 지침:
1. 단일 게시물 소개 형태로 작성하지 마세요.
2. 하나의 주제를 중심으로 '생각의 축적 과정'이 드러나야 합니다.
3. 과거 콘텐츠는 배경과 맥락 설명에 활용하세요.
4. 시간이 흐르며 관점이 어떻게 변화했는지를 명확히 보여주세요.
5. 독자는 "이 주제에 대해 깊이 고민해온 사람의 기록"을 읽는 느낌을 받아야 합니다.

📌 문체 및 구조 (Markdown):
# (흥미로운 제목)

## 서론: 최근의 맥락
(왜 이 주제가 지금 중요해졌는지)

## 1. 생각의 출발점
(과거 관심사 및 배경 - 과거 클립 참조)

## 2. 관점의 변화와 확장
(최근 콘텐츠를 통해 알게 된 새로운 사실이나 시각)

## 3. 현재의 문제의식
(사용자가 지금 가장 집중하고 있는 포인트)

## 결론: 질문과 전망
(정답 제시 금지 - 다음으로 이어질 좋은 질문 제시)

⚠️ 금지 사항:
- 사실을 일반화하지 마세요.
- 제공되지 않은 정보로 논리를 확장하지 마세요.
- 마케팅 문구처럼 쓰지 마세요.
- 반드시 제공된 클립 데이터만 활용하세요.
`
        : `
[Generate Original Article]

Based on the content saved by a user over a period and related past content, write an original article.

[Insight Summary]
${insightSummary}

[Selected Period Clips - Recent (${clips.length})]
${clipSummaries}

[Related Past Clips - Background/Context (${relatedClips.length})]
${relatedSummaries}

📌 Writing Guidelines:
1. Do NOT write as a list of individual links.
2. Show the "accumulation of thought" around a central theme.
3. Use past content for background and context.
4. Clearly show how perspectives have changed over time.
5. Create a feeling of reading "records of someone who has thought deeply about this topic".

📌 Structure (Markdown):
# (Compelling Title)

## Introduction: Recent Context
(Why this topic has become important now)

## 1. Origin of Thought
(Past interests and background - reference past clips)

## 2. Shift in Perspective
(New facts or viewpoints discovered through recent content)

## 3. Current Focus
(The point the user is most focused on now)

## Conclusion: Questions for the Future
(Do NOT provide answers - present good questions for the next step)

⚠️ Prohibited:
- Do NOT generalize facts.
- Do NOT extend logic with information not provided.
- Do NOT write like marketing copy.
- Use ONLY the provided clip data.
`;

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
