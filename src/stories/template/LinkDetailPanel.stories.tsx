import React from 'react';

/**
 * LinkDetailPanel 스토리
 *
 * 클립 상세보기 패널 레이아웃입니다.
 */

export default {
    title: 'Template/LinkDetailPanel',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
## LinkDetailPanel

클립을 클릭했을 때 나타나는 상세보기 패널입니다.

### 구성 요소
- 헤더 (닫기, 소스 배지, 공유 상태, 액션 버튼들)
- 이미지 캐러셀
- AI 요약 / 질문
- Ask AI 채팅 인터페이스
        `,
            },
        },
    },
};

export const Default = {
    render: () => (
        <div className="w-[480px] bg-white rounded-xl border border-slate-100 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-black text-white">Threads</span>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#21DBA4]/10 text-[#21DBA4]">Shared</span>
                </div>
                <div className="flex items-center gap-1">
                    <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                        </svg>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center text-yellow-400 hover:bg-slate-100 rounded-lg">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Image Carousel */}
            <div className="relative h-64 bg-slate-100">
                <img
                    src="https://via.placeholder.com/480x256/1a1a2e/ffffff?text=Content+Preview"
                    alt="Content preview"
                    className="w-full h-full object-cover"
                />
                <button className="absolute top-1/2 left-2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
                <button className="absolute top-1/2 right-2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>
                <button className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/60 text-white text-xs rounded-lg backdrop-blur-sm hover:bg-black/80 flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    원문 보기
                </button>
                {/* Carousel Indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                    <div className="w-6 h-1 bg-[#21DBA4] rounded-full" />
                    <div className="w-1 h-1 bg-white/50 rounded-full" />
                    <div className="w-1 h-1 bg-white/50 rounded-full" />
                    <div className="w-1 h-1 bg-white/50 rounded-full" />
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* AI Question */}
                <div className="flex items-start gap-2 p-3 bg-[#21DBA4]/5 rounded-xl mb-4">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#21DBA4" strokeWidth="2" className="shrink-0 mt-0.5">
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                    </svg>
                    <div>
                        <p className="text-xs text-slate-500 mb-1">이 질문은 이해 콘텐츠를 기반으로 답변되요</p>
                        <p className="text-sm font-medium text-slate-800">정지된 이미지를 3D 공간으로 변환하는 웹 앱</p>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1.5 bg-[#21DBA4]/10 text-[#21DBA4] text-xs font-medium rounded-full">AI 요약</span>
                    <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">3D 공간, 웹 앱, SHARP 모델</span>
                    <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">나 메모</span>
                </div>

                {/* Related Questions */}
                <button className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 rounded-xl transition-colors">
                    <span className="text-sm text-slate-600">더해 2개</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </button>
            </div>

            {/* Ask AI Input */}
            <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#21DBA4] flex items-center justify-center text-white">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                    </div>
                    <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
                        <input
                            type="text"
                            placeholder="이 콘텐츠에 대해 질문하세요..."
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                        />
                        <button className="w-6 h-6 rounded-full bg-[#21DBA4] text-white flex items-center justify-center">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        </button>
                    </div>
                    <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-[#21DBA4] transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    ),
};
