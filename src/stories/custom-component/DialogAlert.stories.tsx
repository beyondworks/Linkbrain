import React from 'react';

/**
 * Dialog & Alert 스토리
 *
 * 대화상자 및 알림 컴포넌트입니다.
 */

export default {
    title: 'Custom Component/Dialog & Alert',
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
## Dialog & Alert

모달 대화상자와 인라인 알림 컴포넌트입니다.
        `,
            },
        },
    },
};

export const ConfirmDialog = {
    render: () => (
        <div className="w-[400px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">클립을 삭제하시겠습니까?</h3>
                <p className="text-sm text-slate-500">이 작업은 되돌릴 수 없습니다. 삭제된 클립은 복구할 수 없습니다.</p>
            </div>
            <div className="p-4 bg-slate-50 flex gap-3">
                <button className="flex-1 h-11 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-100 transition-colors">
                    취소
                </button>
                <button className="flex-1 h-11 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors">
                    삭제
                </button>
            </div>
        </div>
    ),
};

export const InfoDialog = {
    render: () => (
        <div className="w-[400px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#21DBA4]/10 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#21DBA4" strokeWidth="2">
                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Pro 플랜으로 업그레이드</h3>
                </div>
                <ul className="space-y-2 mb-4">
                    {['무제한 클립 저장', 'AI 분석 무제한', '우선 고객 지원'].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#21DBA4" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="p-4 bg-slate-50 flex gap-3">
                <button className="flex-1 h-11 border border-slate-200 text-slate-600 font-medium rounded-xl">
                    나중에
                </button>
                <button className="flex-1 h-11 bg-[#21DBA4] text-white font-medium rounded-xl">
                    업그레이드
                </button>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '정보 제공용 대화상자입니다.',
            },
        },
    },
};

export const AlertInline = {
    render: () => (
        <div className="space-y-4 max-w-md">
            {/* Success */}
            <div className="p-4 rounded-xl bg-[#21DBA4]/5 border border-[#21DBA4]/20">
                <div className="flex items-start gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#21DBA4" strokeWidth="2" className="shrink-0 mt-0.5">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <div>
                        <p className="font-medium text-sm text-slate-800">저장이 완료되었습니다</p>
                        <p className="text-xs text-slate-500 mt-0.5">변경사항이 성공적으로 적용되었습니다.</p>
                    </div>
                </div>
            </div>

            {/* Warning */}
            <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                <div className="flex items-start gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" className="shrink-0 mt-0.5">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <div>
                        <p className="font-medium text-sm text-slate-800">저장 용량이 80%에 도달했습니다</p>
                        <p className="text-xs text-slate-500 mt-0.5">Pro 플랜으로 업그레이드하여 용량을 늘리세요.</p>
                    </div>
                </div>
            </div>

            {/* Error */}
            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                <div className="flex items-start gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" className="shrink-0 mt-0.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    <div>
                        <p className="font-medium text-sm text-slate-800">연결에 실패했습니다</p>
                        <p className="text-xs text-slate-500 mt-0.5">네트워크 연결을 확인하고 다시 시도해주세요.</p>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <div className="flex items-start gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" className="shrink-0 mt-0.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    <div>
                        <p className="font-medium text-sm text-slate-800">새로운 기능이 추가되었습니다</p>
                        <p className="text-xs text-slate-500 mt-0.5">AI 인사이트에서 저장 패턴을 분석해보세요.</p>
                    </div>
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '인라인 알림 메시지입니다.',
            },
        },
    },
};
