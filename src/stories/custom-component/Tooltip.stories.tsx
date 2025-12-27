import React from 'react';

/**
 * Tooltip 스토리
 *
 * 툴팁 컴포넌트입니다.
 */

export default {
    title: 'Custom Component/Tooltip',
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
## Tooltip

호버 시 추가 정보를 표시하는 툴팁입니다.

### 사용법
\`\`\`tsx
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

<Tooltip>
  <TooltipTrigger>호버하세요</TooltipTrigger>
  <TooltipContent>추가 정보</TooltipContent>
</Tooltip>
\`\`\`
        `,
            },
        },
    },
};

const TooltipPreview = ({
    position = 'top',
    content = '툴팁 내용'
}: {
    position: 'top' | 'bottom' | 'left' | 'right';
    content: string;
}) => {
    const arrow = {
        top: 'before:absolute before:left-1/2 before:-translate-x-1/2 before:top-full before:border-4 before:border-transparent before:border-t-slate-900',
        bottom: 'before:absolute before:left-1/2 before:-translate-x-1/2 before:bottom-full before:border-4 before:border-transparent before:border-b-slate-900',
        left: 'before:absolute before:top-1/2 before:-translate-y-1/2 before:left-full before:border-4 before:border-transparent before:border-l-slate-900',
        right: 'before:absolute before:top-1/2 before:-translate-y-1/2 before:right-full before:border-4 before:border-transparent before:border-r-slate-900',
    };

    return (
        <div className={`relative px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg whitespace-nowrap ${arrow[position]}`}>
            {content}
        </div>
    );
};

// SVG Icons
const StarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const LinkIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
);

const ShareIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
);

const TrashIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

export const Positions = {
    render: () => (
        <div className="grid grid-cols-2 gap-12 p-12">
            <div className="flex flex-col items-center gap-3">
                <TooltipPreview position="top" content="위쪽 툴팁" />
                <button className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium">Hover me</button>
                <span className="text-xs text-slate-400">top (기본)</span>
            </div>
            <div className="flex flex-col items-center gap-3">
                <button className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium">Hover me</button>
                <TooltipPreview position="bottom" content="아래쪽 툴팁" />
                <span className="text-xs text-slate-400">bottom</span>
            </div>
            <div className="flex items-center gap-3">
                <TooltipPreview position="left" content="왼쪽" />
                <button className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium">Hover</button>
                <span className="text-xs text-slate-400">left</span>
            </div>
            <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium">Hover</button>
                <TooltipPreview position="right" content="오른쪽" />
                <span className="text-xs text-slate-400">right</span>
            </div>
        </div>
    ),
};

export const IconTooltips = {
    render: () => (
        <div className="flex items-center gap-4">
            {[
                { icon: <StarIcon />, tip: '즐겨찾기' },
                { icon: <LinkIcon />, tip: '링크 복사' },
                { icon: <ShareIcon />, tip: '공유하기' },
                { icon: <TrashIcon />, tip: '삭제' },
            ].map((item) => (
                <div key={item.tip} className="relative group">
                    <button className="w-10 h-10 flex items-center justify-center text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                        {item.icon}
                    </button>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <TooltipPreview position="top" content={item.tip} />
                    </div>
                </div>
            ))}
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '아이콘 버튼에 사용하는 툴팁입니다.',
            },
        },
    },
};

export const RichTooltip = {
    render: () => (
        <div className="relative inline-block">
            <button className="px-4 py-2 bg-[#21DBA4] text-white font-medium rounded-lg">
                Pro 플랜
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 p-3 bg-slate-900 text-white rounded-xl">
                <p className="text-sm font-bold mb-2">Pro 플랜 혜택</p>
                <ul className="text-xs text-slate-300 space-y-1">
                    <li className="flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#21DBA4" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        무제한 클립 저장
                    </li>
                    <li className="flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#21DBA4" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        AI 분석 무제한
                    </li>
                    <li className="flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#21DBA4" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        우선 지원
                    </li>
                </ul>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '복잡한 내용이 있는 리치 툴팁입니다.',
            },
        },
    },
};
