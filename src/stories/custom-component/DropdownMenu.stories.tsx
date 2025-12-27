import React from 'react';

/**
 * DropdownMenu 스토리
 *
 * 드롭다운 메뉴 컴포넌트입니다.
 */

export default {
    title: 'Custom Component/DropdownMenu',
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
## DropdownMenu

클릭 시 열리는 드롭다운 메뉴입니다.

### 사용법
\`\`\`tsx
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
\`\`\`
        `,
            },
        },
    },
};

const MenuItem = ({ icon, label, shortcut, danger = false }: {
    icon: React.ReactNode;
    label: string;
    shortcut?: string;
    danger?: boolean;
}) => (
    <div className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors ${danger
            ? 'text-red-500 hover:bg-red-50'
            : 'text-slate-600 hover:bg-slate-100'
        }`}>
        {icon}
        <span className="flex-1">{label}</span>
        {shortcut && <span className="text-xs text-slate-400">{shortcut}</span>}
    </div>
);

export const Default = {
    render: () => (
        <div className="relative inline-block">
            <button className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium flex items-center gap-2">
                메뉴
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {/* Dropdown */}
            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl p-1.5">
                <MenuItem
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>}
                    label="편집"
                    shortcut="⌘E"
                />
                <MenuItem
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>}
                    label="복사"
                    shortcut="⌘C"
                />
                <MenuItem
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>}
                    label="공유"
                />

                <div className="my-1.5 h-px bg-slate-100" />

                <MenuItem
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>}
                    label="즐겨찾기 추가"
                />
                <MenuItem
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>}
                    label="보관함으로 이동"
                />

                <div className="my-1.5 h-px bg-slate-100" />

                <MenuItem
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>}
                    label="삭제"
                    danger
                />
            </div>
        </div>
    ),
};

export const ProfileMenu = {
    render: () => (
        <div className="relative inline-block">
            <button className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#21DBA4] flex items-center justify-center text-white font-bold text-sm">
                    K
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="p-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#21DBA4] flex items-center justify-center text-white font-bold">
                            K
                        </div>
                        <div>
                            <p className="font-medium text-sm text-slate-800">김유저</p>
                            <p className="text-xs text-slate-400">kim@example.com</p>
                        </div>
                    </div>
                    <div className="mt-3 px-2 py-1 bg-[#21DBA4]/10 rounded-lg text-center">
                        <span className="text-xs font-medium text-[#21DBA4]">Pro 플랜</span>
                    </div>
                </div>

                <div className="p-1.5">
                    <MenuItem
                        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>}
                        label="설정"
                    />
                    <MenuItem
                        icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>}
                        label="로그아웃"
                        danger
                    />
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '프로필 드롭다운 메뉴입니다.',
            },
        },
    },
};

export const SelectDropdown = {
    render: () => (
        <div className="relative inline-block">
            <button className="w-48 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-left flex items-center justify-between">
                <span className="text-slate-700">카테고리 선택</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-xl p-1.5">
                {['Dev', 'Design', 'AI', 'Productivity', 'Other'].map((cat) => (
                    <div key={cat} className="px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer flex items-center justify-between">
                        {cat}
                        {cat === 'Dev' && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#21DBA4" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        )}
                    </div>
                ))}
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '선택 드롭다운입니다.',
            },
        },
    },
};
