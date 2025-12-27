import React from 'react';

/**
 * AddLinkModal 스토리
 *
 * 링크 추가 모달 컴포넌트입니다.
 */

export default {
    title: 'Custom Component/AddLinkModal',
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
## AddLinkModal

새 링크를 추가할 때 사용하는 모달입니다.

### 기능
- URL 입력
- 카테고리 선택
- AI 분석 요청
        `,
            },
        },
    },
};

export const Default = {
    render: () => (
        <div className="w-[400px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">링크 추가</h2>
                <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
                {/* URL Input */}
                <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">URL</label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                        </div>
                        <input
                            type="url"
                            placeholder="https://example.com"
                            className="w-full h-11 pl-10 pr-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#21DBA4] focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">카테고리</label>
                    <select className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#21DBA4] focus:border-transparent appearance-none bg-white">
                        <option>선택하세요</option>
                        <option>Dev</option>
                        <option>Design</option>
                        <option>AI</option>
                        <option>Productivity</option>
                        <option>Other</option>
                    </select>
                </div>

                {/* AI Analysis Toggle */}
                <div className="flex items-center justify-between p-3 bg-[#21DBA4]/5 rounded-xl">
                    <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#21DBA4" strokeWidth="2">
                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                        </svg>
                        <span className="text-sm font-medium text-slate-700">AI 분석 요청</span>
                    </div>
                    <div className="w-10 h-6 bg-[#21DBA4] rounded-full p-0.5 cursor-pointer">
                        <div className="w-5 h-5 bg-white rounded-full translate-x-4 shadow-sm transition-transform" />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 flex gap-3">
                <button className="flex-1 h-11 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors">
                    취소
                </button>
                <button className="flex-1 h-11 bg-[#21DBA4] text-white font-medium rounded-xl hover:bg-[#1BC290] transition-colors">
                    추가
                </button>
            </div>
        </div>
    ),
};

export const WithValidation = {
    render: () => (
        <div className="w-[400px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">링크 추가</h2>
                <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>

            <div className="p-4 space-y-4">
                <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">URL</label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            </svg>
                        </div>
                        <input
                            type="url"
                            value="invalid-url"
                            className="w-full h-11 pl-10 pr-4 border-2 border-red-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200 bg-red-50"
                            readOnly
                        />
                    </div>
                    <p className="text-xs text-red-500 mt-1">유효한 URL을 입력해주세요</p>
                </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex gap-3">
                <button className="flex-1 h-11 border border-slate-200 text-slate-600 font-medium rounded-xl">
                    취소
                </button>
                <button className="flex-1 h-11 bg-slate-200 text-slate-400 font-medium rounded-xl cursor-not-allowed" disabled>
                    추가
                </button>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '유효성 검사 실패 상태입니다.',
            },
        },
    },
};
