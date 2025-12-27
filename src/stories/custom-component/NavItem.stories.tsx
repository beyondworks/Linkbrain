import React from 'react';

/**
 * NavItem 스토리
 *
 * 사이드바 네비게이션 아이템 컴포넌트입니다.
 */

export default {
    title: 'Custom Component/NavItem',
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
## NavItem

사이드바 네비게이션에서 사용하는 아이템 컴포넌트입니다.

### 특징
- 아이콘 + 라벨
- 카운트 배지 (선택적)
- BETA 태그 지원
- 활성/비활성 상태
        `,
            },
        },
    },
};

const NavItem = ({
    icon,
    label,
    count,
    active = false,
    hasBeta = false,
}: {
    icon: React.ReactNode;
    label: string;
    count?: number;
    active?: boolean;
    hasBeta?: boolean;
}) => (
    <div
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all
      ${active
                ? 'bg-[#E0FBF4] text-[#21DBA4]'
                : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
            }`}
    >
        <div className={active ? 'text-[#21DBA4]' : 'text-slate-400'}>
            {icon}
        </div>
        <span className="text-sm font-bold flex-1">
            {label}
            {hasBeta && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-[#21DBA4]/10 text-[#21DBA4] text-[9px] font-extrabold">
                    BETA
                </span>
            )}
        </span>
        {count !== undefined && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md 
        ${active ? 'bg-[#21DBA4]/20 text-[#21DBA4]' : 'bg-slate-100 text-slate-400'}`}>
                {count}
            </span>
        )}
    </div>
);

// Icon components
const HomeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const ExploreIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
);

const ClockIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const StarIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const ArchiveIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="20" height="5" rx="2" />
        <path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9" />
        <path d="M10 13h4" />
    </svg>
);

const ChatIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

const SparklesIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
);

export const Default = {
    render: () => (
        <div className="w-[240px] space-y-1 p-2 bg-white rounded-xl border border-slate-100">
            <NavItem icon={<HomeIcon />} label="홈" active />
            <NavItem icon={<ExploreIcon />} label="탐색" hasBeta />
            <NavItem icon={<ClockIcon />} label="나중에 읽기" count={0} />
            <NavItem icon={<StarIcon />} label="즐겨찾기" count={2} />
            <NavItem icon={<ArchiveIcon />} label="보관함" count={0} />
            <NavItem icon={<ChatIcon />} label="AskAI" count={6} />
            <NavItem icon={<SparklesIcon />} label="AI 인사이트" hasBeta />
        </div>
    ),
};

export const States = {
    render: () => (
        <div className="space-y-4">
            <div>
                <p className="text-xs text-slate-500 mb-2">Default</p>
                <div className="w-[240px]">
                    <NavItem icon={<HomeIcon />} label="홈" />
                </div>
            </div>
            <div>
                <p className="text-xs text-slate-500 mb-2">Active</p>
                <div className="w-[240px]">
                    <NavItem icon={<HomeIcon />} label="홈" active />
                </div>
            </div>
            <div>
                <p className="text-xs text-slate-500 mb-2">With Count</p>
                <div className="w-[240px]">
                    <NavItem icon={<StarIcon />} label="즐겨찾기" count={12} />
                </div>
            </div>
            <div>
                <p className="text-xs text-slate-500 mb-2">With BETA Tag</p>
                <div className="w-[240px]">
                    <NavItem icon={<ExploreIcon />} label="탐색" hasBeta />
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'NavItem의 다양한 상태입니다.',
            },
        },
    },
};
