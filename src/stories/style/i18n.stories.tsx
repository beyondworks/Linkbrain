import React from 'react';

/**
 * i18n 스토리
 *
 * Linkbrain의 다국어 시스템을 문서화합니다.
 */

export default {
    title: 'Style/i18n',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
## i18n (다국어 지원)

Linkbrain은 한국어와 영어를 지원합니다.

### 사용 방법
\`\`\`tsx
// 인라인 패턴
{language === 'ko' ? '저장' : 'Save'}

// 번역 객체 패턴
const t = {
  save: language === 'ko' ? '저장' : 'Save',
  cancel: language === 'ko' ? '취소' : 'Cancel',
};
\`\`\`
        `,
            },
        },
    },
};

const translations = {
    ko: {
        home: '홈',
        explore: '탐색',
        readLater: '나중에 읽기',
        favorites: '즐겨찾기',
        archive: '보관함',
        askAI: 'AskAI',
        aiInsights: 'AI 인사이트',
        categories: '카테고리',
        settings: '설정',
        logout: '로그아웃',
        addLink: '링크 추가',
        filter: '필터 및 정렬',
        save: '저장',
        cancel: '취소',
        delete: '삭제',
        confirm: '확인',
        aiSummary: 'AI 요약',
    },
    en: {
        home: 'Home',
        explore: 'Explore',
        readLater: 'Read Later',
        favorites: 'Favorites',
        archive: 'Archive',
        askAI: 'AskAI',
        aiInsights: 'AI Insights',
        categories: 'Categories',
        settings: 'Settings',
        logout: 'Logout',
        addLink: 'Add Link',
        filter: 'Filter & Sort',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        confirm: 'Confirm',
        aiSummary: 'AI Summary',
    },
};

const TranslationRow = ({ keyName, ko, en }: { keyName: string; ko: string; en: string }) => (
    <tr className="border-b border-slate-100">
        <td className="py-2 px-4">
            <code className="text-xs text-[#21DBA4] bg-[#21DBA4]/10 px-1.5 py-0.5 rounded">{keyName}</code>
        </td>
        <td className="py-2 px-4 text-sm">{ko}</td>
        <td className="py-2 px-4 text-sm text-slate-500">{en}</td>
    </tr>
);

export const TranslationTable = {
    render: () => (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-slate-50">
                        <th className="py-2 px-4 text-xs font-bold text-slate-500">Key</th>
                        <th className="py-2 px-4 text-xs font-bold text-slate-500">🇰🇷 한국어</th>
                        <th className="py-2 px-4 text-xs font-bold text-slate-500">🇺🇸 English</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(translations.ko).map(([key, ko]) => (
                        <TranslationRow
                            key={key}
                            keyName={key}
                            ko={ko}
                            en={translations.en[key as keyof typeof translations.en]}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '주요 UI 텍스트 번역 목록입니다.',
            },
        },
    },
};

export const LanguageComparison = {
    render: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Korean */}
            <div className="p-4 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">🇰🇷</span>
                    <span className="font-bold">한국어</span>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-3 px-3 py-2 bg-[#E0FBF4] text-[#21DBA4] rounded-xl">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        <span className="font-bold text-sm">홈</span>
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2 text-slate-500 rounded-xl hover:bg-slate-50">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                        </svg>
                        <span className="font-bold text-sm">탐색</span>
                        <span className="ml-auto px-1.5 py-0.5 text-[9px] font-bold bg-[#21DBA4]/10 text-[#21DBA4] rounded-full">BETA</span>
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2 text-slate-500 rounded-xl hover:bg-slate-50">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <span className="font-bold text-sm">즐겨찾기</span>
                        <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-400 rounded-md">2</span>
                    </div>
                </div>
            </div>

            {/* English */}
            <div className="p-4 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">🇺🇸</span>
                    <span className="font-bold">English</span>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-3 px-3 py-2 bg-[#E0FBF4] text-[#21DBA4] rounded-xl">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        <span className="font-bold text-sm">Home</span>
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2 text-slate-500 rounded-xl hover:bg-slate-50">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                        </svg>
                        <span className="font-bold text-sm">Explore</span>
                        <span className="ml-auto px-1.5 py-0.5 text-[9px] font-bold bg-[#21DBA4]/10 text-[#21DBA4] rounded-full">BETA</span>
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2 text-slate-500 rounded-xl hover:bg-slate-50">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <span className="font-bold text-sm">Favorites</span>
                        <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-400 rounded-md">2</span>
                    </div>
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '동일한 UI의 한국어/영어 비교입니다.',
            },
        },
    },
};

export const UsagePattern = {
    render: () => (
        <div className="max-w-2xl space-y-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-sm font-bold text-slate-700 mb-2">인라인 패턴 (간단한 텍스트)</h4>
                <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                    {`// 단일 텍스트
<button>
  {language === 'ko' ? '저장' : 'Save'}
</button>`}
                </pre>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-sm font-bold text-slate-700 mb-2">객체 패턴 (여러 텍스트)</h4>
                <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                    {`// 컴포넌트 상단에 번역 객체 정의
const t = {
  title: language === 'ko' ? '설정' : 'Settings',
  save: language === 'ko' ? '저장' : 'Save',
  cancel: language === 'ko' ? '취소' : 'Cancel',
};

// 사용
<h1>{t.title}</h1>
<button>{t.save}</button>`}
                </pre>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-sm font-bold text-slate-700 mb-2">번역 파일 패턴 (재사용)</h4>
                <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                    {`// constants/landingTranslations.ts
export const translations = {
  ko: { hero: '링크를 저장하세요' },
  en: { hero: 'Save your links' },
};

// 사용
import { translations } from '@/constants/landingTranslations';
const t = translations[language];
<h1>{t.hero}</h1>`}
                </pre>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'i18n 구현 패턴입니다.',
            },
        },
    },
};
