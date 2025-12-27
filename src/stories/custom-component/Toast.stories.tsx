import React from 'react';

/**
 * Toast 스토리
 *
 * 토스트 메시지 (Sonner) 컴포넌트입니다.
 */

export default {
    title: 'Custom Component/Toast',
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
## Toast (Sonner)

사용자 피드백을 위한 토스트 메시지입니다.

### 사용법
\`\`\`tsx
import { toast } from 'sonner';

toast.success('저장되었습니다');
toast.error('오류가 발생했습니다');
toast.loading('처리 중...');
\`\`\`
        `,
            },
        },
    },
};

const ToastItem = ({
    type = 'default',
    title,
    description
}: {
    type: 'success' | 'error' | 'warning' | 'info' | 'default';
    title: string;
    description?: string;
}) => {
    const colors = {
        success: 'border-[#21DBA4] bg-[#21DBA4]/5',
        error: 'border-red-400 bg-red-50',
        warning: 'border-yellow-400 bg-yellow-50',
        info: 'border-blue-400 bg-blue-50',
        default: 'border-slate-200 bg-white',
    };

    const icons = {
        success: (
            <div className="w-5 h-5 rounded-full bg-[#21DBA4] flex items-center justify-center text-white">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            </div>
        ),
        error: (
            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </div>
        ),
        warning: (
            <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs font-bold">
                !
            </div>
        ),
        info: (
            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                i
            </div>
        ),
        default: null,
    };

    return (
        <div className={`w-[360px] p-4 rounded-xl border shadow-lg ${colors[type]}`}>
            <div className="flex items-start gap-3">
                {icons[type]}
                <div className="flex-1">
                    <p className="font-medium text-sm text-slate-800">{title}</p>
                    {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export const AllVariants = {
    render: () => (
        <div className="space-y-4">
            <ToastItem type="success" title="클립이 저장되었습니다" description="홈 컬렉션에 추가됨" />
            <ToastItem type="error" title="저장에 실패했습니다" description="네트워크 연결을 확인해주세요" />
            <ToastItem type="warning" title="저장 용량이 부족합니다" description="Pro 플랜으로 업그레이드하세요" />
            <ToastItem type="info" title="AI 분석이 완료되었습니다" />
            <ToastItem type="default" title="링크가 복사되었습니다" />
        </div>
    ),
};

export const Loading = {
    render: () => (
        <div className="w-[360px] p-4 rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-[#21DBA4] border-t-transparent rounded-full animate-spin" />
                <div className="flex-1">
                    <p className="font-medium text-sm text-slate-800">AI 분석 중...</p>
                    <p className="text-xs text-slate-500 mt-0.5">잠시만 기다려주세요</p>
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '로딩 상태의 토스트입니다.',
            },
        },
    },
};

export const WithAction = {
    render: () => (
        <div className="w-[360px] p-4 rounded-xl border border-slate-200 bg-white shadow-lg">
            <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    </svg>
                </div>
                <div className="flex-1">
                    <p className="font-medium text-sm text-slate-800">클립이 삭제되었습니다</p>
                    <button className="text-xs text-[#21DBA4] font-medium mt-1 hover:underline">
                        되돌리기
                    </button>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '되돌리기 액션이 있는 토스트입니다.',
            },
        },
    },
};
