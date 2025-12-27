import React from 'react';

/**
 * FilterDropdown 스토리
 *
 * 필터 및 정렬 드롭다운 컴포넌트입니다.
 */

export default {
    title: 'Custom Component/FilterDropdown',
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
## FilterDropdown

클립 목록을 필터링하고 정렬하는 드롭다운 메뉴입니다.

### 구성 요소
- 정렬 옵션 (최신순, 오래된순, 미열람)
- 기간 필터 (전체, 오늘, 이번 주, 이번 달)
- 카테고리 필터
        `,
            },
        },
    },
};

export const Default = {
    render: () => (
        <div className="w-[280px] bg-white rounded-xl border border-slate-100 shadow-lg p-4 space-y-6">
            {/* Sort Options */}
            <div>
                <h4 className="text-xs font-bold text-slate-400 mb-2 tracking-wide">SORT BY</h4>
                <div className="space-y-1">
                    {['최신순', '오래된순', '미열람'].map((option, index) => (
                        <div
                            key={option}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors
                ${index === 0 ? 'text-[#21DBA4] font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <span className="text-sm">{option}</span>
                            {index === 0 && (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Period Filter */}
            <div>
                <h4 className="text-xs font-bold text-slate-400 mb-2 tracking-wide">기간</h4>
                <div className="flex flex-wrap gap-2">
                    {['전체', '오늘', '이번 주', '이번 달'].map((period, index) => (
                        <button
                            key={period}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                ${index === 0
                                    ? 'bg-[#21DBA4] text-white'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                        >
                            {period}
                        </button>
                    ))}
                </div>
            </div>

            {/* Category Filter */}
            <div>
                <h4 className="text-xs font-bold text-slate-400 mb-2 tracking-wide">카테고리</h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                    {[
                        'Productivity', 'Education', 'Entertainment', 'Career',
                        'Design', 'Business', 'Marketing', 'Lifestyle',
                        'Other', 'Shorts', 'AI', 'Product', 'Automation',
                        'Dev', 'Diffusion', 'Health', 'Personal finance'
                    ].map((category) => (
                        <label key={category} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-50 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#21DBA4] focus:ring-[#21DBA4]" />
                            <span className="text-sm text-slate-600">{category}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    ),
};

export const TriggerButton = {
    render: () => (
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#21DBA4] text-[#21DBA4] hover:bg-[#21DBA4]/5 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span className="text-sm font-medium">필터 및 정렬</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
            </svg>
        </button>
    ),
    parameters: {
        docs: {
            description: {
                story: '필터 드롭다운을 열기 위한 트리거 버튼입니다.',
            },
        },
    },
};

export const ViewToggle = {
    render: () => (
        <div className="flex items-center gap-2">
            {/* Status Indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-slate-500 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                대기 중
            </div>

            {/* View Toggle */}
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                <button className="p-2 bg-slate-100 text-slate-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                    </svg>
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="8" y1="6" x2="21" y2="6" />
                        <line x1="8" y1="12" x2="21" y2="12" />
                        <line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" />
                        <line x1="3" y1="12" x2="3.01" y2="12" />
                        <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                </button>
            </div>

            {/* Selection Mode */}
            <button className="p-2 text-slate-400 hover:text-slate-700 border border-slate-200 rounded-lg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 11 12 14 22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
            </button>

            {/* Add Link Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-[#21DBA4] text-white rounded-lg font-medium text-sm hover:bg-[#1BC290] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                링크 추가
            </button>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '상단 툴바의 뷰 토글 및 액션 버튼입니다.',
            },
        },
    },
};
