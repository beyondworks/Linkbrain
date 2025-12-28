import React from 'react';

// SVG Icons for Admin Dashboard
const ChartBarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" x2="12" y1="20" y2="10" />
        <line x1="18" x2="18" y1="20" y2="4" />
        <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
);

const TrendingUpIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
    </svg>
);

const UsersIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const CreditCardIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
);

const FolderIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    </svg>
);

const ActivityIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
);

const BellIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const MessageCircleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
    </svg>
);

/**
 * AdminDashboard 스토리
 *
 * 관리자 대시보드 레이아웃입니다.
 */

export default {
    title: 'Section/AdminDashboard',
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: `
## AdminDashboard

관리자 전용 대시보드입니다.

### 패널 구성
- Overview (개요)
- Service Stats (서비스 통계)
- User Management (사용자 관리)
- Subscription Management (구독 관리)
- Category Analytics (카테고리 분석)
- Detailed Analytics (상세 분석)
        `,
            },
        },
    },
};

// Navigation items with SVG icons
const navItems = [
    { icon: <ChartBarIcon />, label: 'Overview', active: true },
    { icon: <TrendingUpIcon />, label: 'Service Stats', active: false },
    { icon: <UsersIcon />, label: 'Users', active: false },
    { icon: <CreditCardIcon />, label: 'Subscriptions', active: false },
    { icon: <FolderIcon />, label: 'Categories', active: false },
    { icon: <ActivityIcon />, label: 'Analytics', active: false },
    { icon: <BellIcon />, label: 'Announcements', active: false },
    { icon: <MessageCircleIcon />, label: 'Inquiries', active: false },
];

export const Default = {
    render: () => (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#21DBA4] rounded-lg" />
                    <span className="font-bold text-slate-800">Linkbrain Admin</span>
                </div>
                <div className="ml-auto flex items-center gap-4">
                    <span className="text-sm text-slate-500">kim@linkbrain.io</span>
                    <div className="w-8 h-8 bg-slate-200 rounded-full" />
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-60 bg-white border-r border-slate-200 min-h-[calc(100vh-64px)] p-4">
                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <div
                                key={item.label}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${item.active
                                    ? 'bg-[#21DBA4]/10 text-[#21DBA4]'
                                    : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                            >
                                {item.icon}
                                <span className="text-sm font-medium">{item.label}</span>
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    <h1 className="text-2xl font-bold text-slate-800 mb-6">Overview</h1>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {[
                            { label: '총 사용자', value: '1,234', change: '+12%', positive: true },
                            { label: '총 클립', value: '45,678', change: '+8%', positive: true },
                            { label: '활성 구독', value: '89', change: '+5%', positive: true },
                            { label: 'API 호출', value: '12.3K', change: '-2%', positive: false },
                        ].map((stat) => (
                            <div key={stat.label} className="p-4 bg-white rounded-3xl border border-slate-100 hover:border-[#21DBA4]/30 transition-colors">
                                <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                                <p className={`text-xs font-medium ${stat.positive ? 'text-[#21DBA4]' : 'text-red-500'}`}>
                                    {stat.change} 이번 주
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="p-4 bg-white rounded-3xl border border-slate-100">
                            <h3 className="font-bold text-slate-700 mb-4">일별 가입자</h3>
                            <div className="h-48 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                [차트 영역]
                            </div>
                        </div>
                        <div className="p-4 bg-white rounded-3xl border border-slate-100">
                            <h3 className="font-bold text-slate-700 mb-4">카테고리별 분포</h3>
                            <div className="h-48 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                [차트 영역]
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    ),
};

export const UsersPanel = {
    render: () => (
        <div className="p-6 bg-white rounded-3xl border border-slate-100 max-w-4xl">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800">사용자 관리</h2>
                <div className="flex gap-2">
                    <input
                        type="search"
                        placeholder="검색..."
                        className="h-9 px-3 border border-slate-200 rounded-xl text-sm"
                    />
                    <button className="h-9 px-4 bg-[#21DBA4] text-white text-sm font-medium rounded-xl">
                        내보내기
                    </button>
                </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-100">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50">
                            <th className="py-3 px-4 text-xs font-bold text-slate-500">이메일</th>
                            <th className="py-3 px-4 text-xs font-bold text-slate-500">플랜</th>
                            <th className="py-3 px-4 text-xs font-bold text-slate-500">클립 수</th>
                            <th className="py-3 px-4 text-xs font-bold text-slate-500">가입일</th>
                            <th className="py-3 px-4 text-xs font-bold text-slate-500">상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { email: 'user1@example.com', plan: 'Pro', clips: 234, date: '2024-12-01', status: '활성' },
                            { email: 'user2@example.com', plan: 'Free', clips: 45, date: '2024-12-15', status: '활성' },
                            { email: 'user3@example.com', plan: 'Pro', clips: 567, date: '2024-11-20', status: '비활성' },
                        ].map((user) => (
                            <tr key={user.email} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                <td className="py-3 px-4 text-sm">{user.email}</td>
                                <td className="py-3 px-4">
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${user.plan === 'Pro' ? 'bg-[#21DBA4]/10 text-[#21DBA4]' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {user.plan}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-slate-600">{user.clips}</td>
                                <td className="py-3 px-4 text-sm text-slate-400">{user.date}</td>
                                <td className="py-3 px-4">
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${user.status === '활성' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    ),
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                story: '사용자 관리 패널입니다.',
            },
        },
    },
};
