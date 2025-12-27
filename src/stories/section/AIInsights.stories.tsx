import React from 'react';

/**
 * AIInsights 스토리
 *
 * AI 인사이트 대시보드 컴포넌트입니다.
 */

export default {
    title: 'Section/AIInsights',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
## AI Insights Dashboard

저장된 클립들을 분석하여 트렌드와 패턴을 보여주는 대시보드입니다.

### 구성 요소
- TrendCards (트렌드 카드)
- KeywordSection (키워드 분석)
- InterestTimeline (관심 타임라인)
- SavePatternHeatmap (저장 패턴 히트맵)
        `,
            },
        },
    },
};

export const TrendCards = {
    render: () => (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800">이번 주 트렌드</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { rank: 1, keyword: 'AI 도구', count: 23, change: '+12' },
                    { rank: 2, keyword: '생산성', count: 18, change: '+8' },
                    { rank: 3, keyword: '디자인', count: 15, change: '+5' },
                ].map((trend) => (
                    <div key={trend.rank} className="p-4 bg-white rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${trend.rank === 1 ? 'bg-[#21DBA4] text-white' : 'bg-slate-100 text-slate-500'
                                }`}>
                                {trend.rank}
                            </span>
                            <span className="font-bold text-slate-800">{trend.keyword}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">{trend.count} 클립</span>
                            <span className="text-xs font-medium text-[#21DBA4]">{trend.change}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    ),
};

export const KeywordCloud = {
    render: () => (
        <div className="p-6 bg-white rounded-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">관심 키워드</h3>
            <div className="flex flex-wrap gap-2">
                {[
                    { word: 'AI', size: 'text-2xl', color: 'text-[#21DBA4]' },
                    { word: 'React', size: 'text-xl', color: 'text-blue-500' },
                    { word: 'Design', size: 'text-lg', color: 'text-purple-500' },
                    { word: 'Tailwind', size: 'text-base', color: 'text-teal-500' },
                    { word: 'Next.js', size: 'text-lg', color: 'text-slate-700' },
                    { word: 'TypeScript', size: 'text-base', color: 'text-blue-600' },
                    { word: 'Firebase', size: 'text-sm', color: 'text-orange-500' },
                    { word: 'Figma', size: 'text-xl', color: 'text-pink-500' },
                    { word: 'Vercel', size: 'text-sm', color: 'text-slate-600' },
                    { word: 'Claude', size: 'text-lg', color: 'text-amber-600' },
                ].map((tag) => (
                    <span key={tag.word} className={`${tag.size} ${tag.color} font-bold cursor-pointer hover:opacity-70 transition-opacity`}>
                        {tag.word}
                    </span>
                ))}
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '사용자의 관심 키워드를 시각화한 워드 클라우드입니다.',
            },
        },
    },
};

export const SavePatternHeatmap = {
    render: () => (
        <div className="p-6 bg-white rounded-xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">저장 패턴</h3>
            <div className="space-y-2">
                {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
                    <div key={day} className="flex items-center gap-2">
                        <span className="w-8 text-xs text-slate-400">{day}</span>
                        <div className="flex gap-1">
                            {Array.from({ length: 24 }, (_, hour) => {
                                const intensity = Math.random();
                                return (
                                    <div
                                        key={hour}
                                        className="w-3 h-3 rounded-sm transition-colors"
                                        style={{
                                            backgroundColor: intensity > 0.7
                                                ? '#21DBA4'
                                                : intensity > 0.4
                                                    ? 'rgba(33,219,164,0.5)'
                                                    : intensity > 0.2
                                                        ? 'rgba(33,219,164,0.2)'
                                                        : '#F1F5F9',
                                        }}
                                        title={`${day} ${hour}시`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}
                <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
                    <span>적음</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-slate-100" />
                        <div className="w-3 h-3 rounded-sm bg-[#21DBA4]/20" />
                        <div className="w-3 h-3 rounded-sm bg-[#21DBA4]/50" />
                        <div className="w-3 h-3 rounded-sm bg-[#21DBA4]" />
                    </div>
                    <span>많음</span>
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '시간대별 저장 패턴을 보여주는 히트맵입니다.',
            },
        },
    },
};

export const FullDashboard = {
    render: () => (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">AI 인사이트</h1>
                    <p className="text-sm text-slate-500">지난 7일간의 저장 패턴 분석</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-[#21DBA4] text-white text-xs font-bold rounded-full">이번 주</button>
                    <button className="px-3 py-1.5 text-slate-500 text-xs font-bold rounded-full hover:bg-slate-100">이번 달</button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: '총 저장', value: '142', icon: '📎' },
                    { label: '분석 완료', value: '138', icon: '✅' },
                    { label: '카테고리', value: '12', icon: '📁' },
                    { label: 'AI 질문', value: '45', icon: '💬' },
                ].map((stat) => (
                    <div key={stat.label} className="p-4 bg-white rounded-xl border border-slate-100 text-center">
                        <span className="text-2xl mb-1 block">{stat.icon}</span>
                        <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                        <p className="text-xs text-slate-400">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-4 bg-white rounded-xl border border-slate-100">
                    <h3 className="font-bold text-slate-700 mb-4">인기 소스</h3>
                    <div className="space-y-3">
                        {[
                            { name: 'YouTube', count: 45, color: 'bg-red-500' },
                            { name: 'Threads', count: 38, color: 'bg-black' },
                            { name: 'X', count: 24, color: 'bg-slate-800' },
                            { name: 'GitHub', count: 18, color: 'bg-slate-700' },
                        ].map((source) => (
                            <div key={source.name} className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${source.color}`} />
                                <span className="text-sm font-medium text-slate-700 flex-1">{source.name}</span>
                                <span className="text-sm text-slate-400">{source.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-100">
                    <h3 className="font-bold text-slate-700 mb-4">최근 AI 질문</h3>
                    <div className="space-y-3">
                        {[
                            '이 기술의 장단점은?',
                            '비슷한 도구 추천해줘',
                            '초보자도 사용 가능해?',
                        ].map((q, i) => (
                            <div key={i} className="p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
                                {q}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'AI 인사이트 대시보드 전체 레이아웃입니다.',
            },
        },
    },
};
