import React from 'react';

/**
 * ResponsiveSystem 스토리
 *
 * Linkbrain의 반응형 시스템을 문서화합니다.
 */

export default {
    title: 'Style/Responsive',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
## Responsive System

Linkbrain은 모바일 퍼스트 반응형 디자인을 따릅니다.

### 브레이크포인트
| 접두사 | 최소 너비 | 디바이스 |
|--------|----------|----------|
| (기본) | 0px | 모바일 |
| \`sm:\` | 640px | 태블릿 세로 |
| \`md:\` | 768px | 태블릿 가로 |
| \`lg:\` | 1024px | 노트북 |
| \`xl:\` | 1280px | 데스크톱 |
| \`2xl:\` | 1536px | 대형 모니터 |
        `,
            },
        },
    },
};

export const Breakpoints = {
    render: () => (
        <div className="space-y-4">
            {[
                { prefix: '기본', width: '0px', color: 'bg-blue-500', desc: '모바일 (기본값)' },
                { prefix: 'sm:', width: '640px', color: 'bg-green-500', desc: '태블릿 세로' },
                { prefix: 'md:', width: '768px', color: 'bg-yellow-500', desc: '태블릿 가로' },
                { prefix: 'lg:', width: '1024px', color: 'bg-orange-500', desc: '노트북' },
                { prefix: 'xl:', width: '1280px', color: 'bg-red-500', desc: '데스크톱' },
                { prefix: '2xl:', width: '1536px', color: 'bg-purple-500', desc: '대형 모니터' },
            ].map((bp) => (
                <div key={bp.prefix} className="flex items-center gap-4">
                    <code className="w-12 text-sm font-mono font-bold text-[#21DBA4]">{bp.prefix}</code>
                    <div className={`h-8 ${bp.color} rounded flex items-center justify-end px-2`} style={{ width: `${parseInt(bp.width) / 8}px`, minWidth: '60px' }}>
                        <span className="text-white text-xs font-bold">{bp.width}</span>
                    </div>
                    <span className="text-sm text-slate-500">{bp.desc}</span>
                </div>
            ))}
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Tailwind CSS 브레이크포인트 시각화입니다.',
            },
        },
    },
};

export const GridResponsive = {
    render: () => (
        <div className="space-y-8">
            <div>
                <h4 className="text-sm font-bold text-slate-600 mb-3">
                    <code className="text-[#21DBA4]">grid-cols-1 md:grid-cols-2 lg:grid-cols-3</code>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="h-20 bg-[#21DBA4]/10 rounded-xl flex items-center justify-center text-[#21DBA4] font-bold">
                            {n}
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="text-sm font-bold text-slate-600 mb-3">
                    <code className="text-[#21DBA4]">grid-cols-2 md:grid-cols-4</code> (통계 카드)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['총 클립', '이번 주', '컬렉션', '카테고리'].map((label) => (
                        <div key={label} className="p-4 bg-white border border-slate-100 rounded-xl">
                            <p className="text-xs text-slate-400">{label}</p>
                            <p className="text-2xl font-bold text-slate-800">{Math.floor(Math.random() * 100)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '반응형 그리드 패턴입니다. 브라우저 크기를 조절해보세요.',
            },
        },
    },
};

export const LayoutPattern = {
    render: () => (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="h-14 bg-white border-b border-slate-100 flex items-center px-4 gap-4">
                <div className="w-8 h-8 bg-[#21DBA4] rounded-lg" />
                <div className="hidden md:block flex-1 h-8 bg-slate-100 rounded-lg max-w-md" />
                <div className="ml-auto flex gap-2">
                    <div className="hidden sm:block w-24 h-8 bg-slate-100 rounded-lg" />
                    <div className="w-8 h-8 bg-[#21DBA4] rounded-lg" />
                </div>
            </div>

            <div className="flex min-h-[300px]">
                {/* Sidebar - hidden on mobile */}
                <div className="hidden lg:block w-60 bg-white border-r border-slate-100 p-4">
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                            <div key={n} className="h-10 bg-slate-50 rounded-lg" />
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-4 bg-slate-50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="h-40 bg-white rounded-xl border border-slate-100" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Linkbrain 앱의 반응형 레이아웃 구조입니다. 사이드바는 lg 이상에서만 표시됩니다.',
            },
        },
    },
};

export const TouchTargets = {
    render: () => (
        <div className="space-y-6">
            <div>
                <h4 className="text-sm font-bold text-slate-600 mb-3">터치 타겟 최소 크기: 44x44px</h4>
                <div className="flex gap-4 items-center">
                    <button className="w-11 h-11 bg-[#21DBA4] rounded-xl flex items-center justify-center text-white">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </button>
                    <span className="text-sm text-slate-500">44x44px - 모바일 최적 크기</span>
                </div>
            </div>

            <div>
                <h4 className="text-sm font-bold text-slate-600 mb-3">버튼 높이</h4>
                <div className="flex flex-wrap gap-3 items-end">
                    <button className="h-8 px-3 bg-slate-100 rounded text-sm">sm: 32px</button>
                    <button className="h-10 px-4 bg-slate-200 rounded text-sm">default: 40px</button>
                    <button className="h-12 px-6 bg-slate-300 rounded text-sm">lg: 48px</button>
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '모바일 터치 타겟 가이드라인입니다.',
            },
        },
    },
};
