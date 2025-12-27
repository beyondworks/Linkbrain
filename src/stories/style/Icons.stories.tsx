import React from 'react';

/**
 * Icons 스토리
 *
 * Linkbrain에서 사용하는 SVG 아이콘 팩입니다.
 */

export default {
    title: 'Style/Icons',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
## Icon Pack

Linkbrain UI에서 사용하는 SVG 아이콘입니다.
모든 아이콘은 Lucide 스타일을 따르며, 24x24 뷰박스 기준입니다.

### 사용법
\`\`\`tsx
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
  <!-- path -->
</svg>
\`\`\`
        `,
            },
        },
    },
};

// Icon Component
const Icon = ({ children, name }: { children: React.ReactNode; name: string }) => (
    <div className="flex flex-col items-center gap-2 p-3">
        <div className="w-10 h-10 flex items-center justify-center text-slate-600">
            {children}
        </div>
        <span className="text-[10px] text-slate-400 font-medium">{name}</span>
    </div>
);

// Navigation Icons
const NavigationIcons = () => (
    <>
        <Icon name="home">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        </Icon>
        <Icon name="search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
            </svg>
        </Icon>
        <Icon name="menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
        </Icon>
        <Icon name="close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
            </svg>
        </Icon>
        <Icon name="chevron-down">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m6 9 6 6 6-6" />
            </svg>
        </Icon>
        <Icon name="chevron-right">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6" />
            </svg>
        </Icon>
        <Icon name="arrow-left">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
            </svg>
        </Icon>
        <Icon name="external-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" x2="21" y1="14" y2="3" />
            </svg>
        </Icon>
    </>
);

// Action Icons
const ActionIcons = () => (
    <>
        <Icon name="plus">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14" />
                <path d="M12 5v14" />
            </svg>
        </Icon>
        <Icon name="edit">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
        </Icon>
        <Icon name="trash">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
        </Icon>
        <Icon name="copy">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
        </Icon>
        <Icon name="share">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
            </svg>
        </Icon>
        <Icon name="download">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
        </Icon>
        <Icon name="upload">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
        </Icon>
        <Icon name="refresh">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
            </svg>
        </Icon>
    </>
);

// Status Icons
const StatusIcons = () => (
    <>
        <Icon name="check">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
            </svg>
        </Icon>
        <Icon name="check-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        </Icon>
        <Icon name="x-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6" />
                <path d="m9 9 6 6" />
            </svg>
        </Icon>
        <Icon name="alert-triangle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
            </svg>
        </Icon>
        <Icon name="info">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
            </svg>
        </Icon>
        <Icon name="loader">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
        </Icon>
    </>
);

// Content Icons
const ContentIcons = () => (
    <>
        <Icon name="star">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        </Icon>
        <Icon name="star-filled">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        </Icon>
        <Icon name="link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
        </Icon>
        <Icon name="folder">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
            </svg>
        </Icon>
        <Icon name="tag">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
                <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
            </svg>
        </Icon>
        <Icon name="calendar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
        </Icon>
        <Icon name="clock">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        </Icon>
        <Icon name="globe">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
            </svg>
        </Icon>
    </>
);

// AI/Brand Icons
const BrandIcons = () => (
    <>
        <Icon name="sparkles">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
        </Icon>
        <Icon name="sparkle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
            </svg>
        </Icon>
        <Icon name="zap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        </Icon>
        <Icon name="brain">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
                <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
                <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
                <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
                <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
                <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
                <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
                <path d="M6 18a4 4 0 0 1-1.967-.516" />
                <path d="M19.967 17.484A4 4 0 0 1 18 18" />
            </svg>
        </Icon>
        <Icon name="message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        </Icon>
    </>
);

// Settings Icons
const SettingsIcons = () => (
    <>
        <Icon name="settings">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        </Icon>
        <Icon name="user">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        </Icon>
        <Icon name="log-out">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
        </Icon>
        <Icon name="moon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
        </Icon>
        <Icon name="sun">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
            </svg>
        </Icon>
        <Icon name="bell">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
        </Icon>
    </>
);

export const Navigation = {
    render: () => (
        <div>
            <h3 className="text-sm font-bold text-slate-800 mb-4">Navigation</h3>
            <div className="flex flex-wrap bg-slate-50 rounded-xl p-4">
                <NavigationIcons />
            </div>
        </div>
    ),
};

export const Actions = {
    render: () => (
        <div>
            <h3 className="text-sm font-bold text-slate-800 mb-4">Actions</h3>
            <div className="flex flex-wrap bg-slate-50 rounded-xl p-4">
                <ActionIcons />
            </div>
        </div>
    ),
};

export const Status = {
    render: () => (
        <div>
            <h3 className="text-sm font-bold text-slate-800 mb-4">Status</h3>
            <div className="flex flex-wrap bg-slate-50 rounded-xl p-4">
                <StatusIcons />
            </div>
        </div>
    ),
};

export const Content = {
    render: () => (
        <div>
            <h3 className="text-sm font-bold text-slate-800 mb-4">Content</h3>
            <div className="flex flex-wrap bg-slate-50 rounded-xl p-4">
                <ContentIcons />
            </div>
        </div>
    ),
};

export const Brand = {
    render: () => (
        <div>
            <h3 className="text-sm font-bold text-slate-800 mb-4">AI / Brand</h3>
            <div className="flex flex-wrap bg-slate-50 rounded-xl p-4">
                <BrandIcons />
            </div>
        </div>
    ),
};

export const Settings = {
    render: () => (
        <div>
            <h3 className="text-sm font-bold text-slate-800 mb-4">Settings</h3>
            <div className="flex flex-wrap bg-slate-50 rounded-xl p-4">
                <SettingsIcons />
            </div>
        </div>
    ),
};

export const AllIcons = {
    render: () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3">Navigation</h3>
                <div className="flex flex-wrap bg-slate-50 rounded-xl p-4">
                    <NavigationIcons />
                </div>
            </div>
            <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3">Actions</h3>
                <div className="flex flex-wrap bg-slate-50 rounded-xl p-4">
                    <ActionIcons />
                </div>
            </div>
            <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3">Status</h3>
                <div className="flex flex-wrap bg-slate-50 rounded-xl p-4">
                    <StatusIcons />
                </div>
            </div>
            <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3">Content</h3>
                <div className="flex flex-wrap bg-slate-50 rounded-xl p-4">
                    <ContentIcons />
                </div>
            </div>
            <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3">AI / Brand</h3>
                <div className="flex flex-wrap bg-slate-50 rounded-xl p-4">
                    <BrandIcons />
                </div>
            </div>
            <div>
                <h3 className="text-sm font-bold text-slate-800 mb-3">Settings</h3>
                <div className="flex flex-wrap bg-slate-50 rounded-xl p-4">
                    <SettingsIcons />
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '모든 아이콘을 한눈에 볼 수 있습니다.',
            },
        },
    },
};

export const Sizes = {
    render: () => (
        <div className="flex items-end gap-6">
            {[12, 16, 20, 24, 32, 48].map((size) => (
                <div key={size} className="flex flex-col items-center gap-2">
                    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-600">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span className="text-[10px] text-slate-400">{size}px</span>
                </div>
            ))}
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '아이콘 크기 스케일입니다.',
            },
        },
    },
};

export const Colors = {
    render: () => (
        <div className="flex items-center gap-6">
            {[
                { color: 'text-slate-400', label: 'Muted' },
                { color: 'text-slate-600', label: 'Default' },
                { color: 'text-slate-900', label: 'Strong' },
                { color: 'text-[#21DBA4]', label: 'Brand' },
                { color: 'text-red-500', label: 'Danger' },
                { color: 'text-yellow-500', label: 'Warning' },
            ].map(({ color, label }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={color}>
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                    </svg>
                    <span className="text-[10px] text-slate-400">{label}</span>
                </div>
            ))}
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '아이콘 색상 사용법입니다.',
            },
        },
    },
};
