import React from 'react';

/**
 * AnalysisIndicator 스토리
 *
 * AI 분석 진행 상태를 표시하는 인디케이터입니다.
 */

export default {
    title: 'Custom Component/AnalysisIndicator',
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
## AnalysisIndicator

AI 분석이 진행 중일 때 상태를 표시하는 인디케이터입니다.

### 상태
- 대기 중 (녹색)
- 분석 중 (애니메이션)
- 완료
        `,
            },
        },
    },
};

export const Idle = {
    render: () => (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-slate-500 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            대기 중
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '분석 대기 상태입니다.',
            },
        },
    },
};

export const Analyzing = {
    render: () => (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#21DBA4] text-[#21DBA4] bg-[#21DBA4]/5">
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <span className="text-xs font-medium">분석 중...</span>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'AI 분석이 진행 중인 상태입니다.',
            },
        },
    },
};

export const AnalyzingWithProgress = {
    render: () => (
        <div className="w-80 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#21DBA4]/10 flex items-center justify-center">
                    <svg className="animate-pulse" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#21DBA4" strokeWidth="2">
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-800">AI 분석 중</h4>
                    <p className="text-xs text-slate-400">콘텐츠를 분석하고 있습니다...</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#21DBA4] rounded-full transition-all duration-500"
                    style={{ width: '65%' }}
                />
            </div>

            <p className="text-[10px] text-slate-400 mt-2 text-right">3/5 완료</p>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '진행률을 표시하는 분석 인디케이터입니다.',
            },
        },
    },
};

export const QueueStatus = {
    render: () => (
        <div className="w-80 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold text-slate-800">분석 대기열</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#21DBA4]/10 text-[#21DBA4]">
                    12개 대기 중
                </span>
            </div>

            <div className="space-y-2">
                {[
                    { title: '정지된 이미지를 3D 공간으로...', status: 'analyzing' },
                    { title: '코덱스가 클로드 스킬을 흡수...', status: 'queued' },
                    { title: '99%가 그냥 지나치는 숨겨진...', status: 'queued' },
                ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                        {item.status === 'analyzing' ? (
                            <svg className="animate-spin shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#21DBA4" strokeWidth="2">
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                        ) : (
                            <div className="w-3 h-3 rounded-full border-2 border-slate-300 shrink-0" />
                        )}
                        <span className="text-xs text-slate-600 truncate">{item.title}</span>
                    </div>
                ))}
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '여러 클립이 분석 대기 중인 상태입니다.',
            },
        },
    },
};

export const AllStates = {
    render: () => (
        <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-slate-500 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                대기 중
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#21DBA4] text-[#21DBA4] bg-[#21DBA4]/5">
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                <span className="text-xs font-medium">분석 중...</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-green-200 text-green-600 bg-green-50 text-xs">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
                완료
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-200 text-red-600 bg-red-50 text-xs">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                실패
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '모든 분석 상태 인디케이터입니다.',
            },
        },
    },
};
