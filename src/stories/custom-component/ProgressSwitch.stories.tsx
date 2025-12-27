import React from 'react';

/**
 * Progress & Switch 스토리
 *
 * 진행률 바와 스위치 컴포넌트입니다.
 */

export default {
    title: 'Custom Component/Progress & Switch',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
## Progress & Switch

진행률 표시와 토글 스위치 컴포넌트입니다.
        `,
            },
        },
    },
};

// Progress Bar
const ProgressBar = ({ value = 60, color = 'brand' }: { value?: number; color?: 'brand' | 'blue' | 'red' }) => {
    const colors = {
        brand: 'bg-[#21DBA4]',
        blue: 'bg-blue-500',
        red: 'bg-red-500',
    };

    return (
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
                className={`h-full ${colors[color]} transition-all duration-500`}
                style={{ width: `${value}%` }}
            />
        </div>
    );
};

// Switch
const Switch = ({ checked = false, disabled = false }: { checked?: boolean; disabled?: boolean }) => (
    <div className={`
        w-11 h-6 rounded-full p-0.5 cursor-pointer transition-colors
        ${checked ? 'bg-[#21DBA4]' : 'bg-slate-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}>
        <div className={`
            w-5 h-5 bg-white rounded-full shadow-sm transition-transform
            ${checked ? 'translate-x-5' : 'translate-x-0'}
        `} />
    </div>
);

export const ProgressVariants = {
    render: () => (
        <div className="space-y-6 max-w-md">
            <div>
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">저장 용량</span>
                    <span className="text-sm text-slate-500">60%</span>
                </div>
                <ProgressBar value={60} color="brand" />
            </div>
            <div>
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">AI 분석 진행</span>
                    <span className="text-sm text-slate-500">35%</span>
                </div>
                <ProgressBar value={35} color="blue" />
            </div>
            <div>
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">용량 초과 경고</span>
                    <span className="text-sm text-red-500">95%</span>
                </div>
                <ProgressBar value={95} color="red" />
            </div>
        </div>
    ),
};

export const ProgressSizes = {
    render: () => (
        <div className="space-y-4 max-w-md">
            <div>
                <span className="text-xs text-slate-400 mb-1 block">Small (2px)</span>
                <div className="w-full h-0.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-[#21DBA4]" />
                </div>
            </div>
            <div>
                <span className="text-xs text-slate-400 mb-1 block">Default (8px)</span>
                <ProgressBar value={75} />
            </div>
            <div>
                <span className="text-xs text-slate-400 mb-1 block">Large (12px)</span>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-[#21DBA4]" />
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '다양한 크기의 진행률 바입니다.',
            },
        },
    },
};

export const SwitchVariants = {
    render: () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl max-w-sm">
                <div>
                    <p className="text-sm font-medium text-slate-700">알림 활성화</p>
                    <p className="text-xs text-slate-400">새 알림을 받습니다</p>
                </div>
                <Switch checked={true} />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl max-w-sm">
                <div>
                    <p className="text-sm font-medium text-slate-700">다크 모드</p>
                    <p className="text-xs text-slate-400">어두운 테마를 사용합니다</p>
                </div>
                <Switch checked={false} />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl max-w-sm opacity-60">
                <div>
                    <p className="text-sm font-medium text-slate-700">베타 기능</p>
                    <p className="text-xs text-slate-400">Pro 플랜 전용</p>
                </div>
                <Switch checked={false} disabled={true} />
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'ON/OFF 스위치 상태입니다.',
            },
        },
    },
};

export const CombinedUsage = {
    render: () => (
        <div className="p-4 bg-white rounded-xl border border-slate-100 max-w-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">AI 분석</h3>
                <Switch checked={true} />
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">이번 달 사용량</span>
                    <span className="font-medium text-slate-700">45/100</span>
                </div>
                <ProgressBar value={45} />
                <p className="text-xs text-slate-400">55회 남음</p>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Progress와 Switch를 함께 사용하는 예시입니다.',
            },
        },
    },
};
