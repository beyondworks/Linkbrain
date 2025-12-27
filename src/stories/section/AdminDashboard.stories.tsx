import React from 'react';

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
                        {[
                            { icon: '📊', label: 'Overview', active: true },
                            { icon: '📈', label: 'Service Stats', active: false },
                            { icon: '👥', label: 'Users', active: false },
                            { icon: '💳', label: 'Subscriptions', active: false },
                            { icon: '📁', label: 'Categories', active: false },
                            { icon: '📉', label: 'Analytics', active: false },
                            { icon: '📢', label: 'Announcements', active: false },
                            { icon: '💬', label: 'Inquiries', active: false },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${item.active
                                        ? 'bg-[#21DBA4]/10 text-[#21DBA4]'
                                        : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                            >
                                <span>{item.icon}</span>
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
                            { label: '총 사용자', value: '1,234', change: '+12%', color: 'text-[#21DBA4]' },
                            { label: '총 클립', value: '45,678', change: '+8%', color: 'text-[#21DBA4]' },
                            { label: '활성 구독', value: '89', change: '+5%', color: 'text-[#21DBA4]' },
                            { label: 'API 호출', value: '12.3K', change: '-2%', color: 'text-red-500' },
                        ].map((stat) => (
                            <div key={stat.label} className="p-4 bg-white rounded-xl border border-slate-100">
                                <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
                                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                                <p className={`text-xs font-medium ${stat.color}`}>{stat.change} 이번 주</p>
                            </div>
                        ))}
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="p-4 bg-white rounded-xl border border-slate-100">
                            <h3 className="font-bold text-slate-700 mb-4">일별 가입자</h3>
                            <div className="h-48 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                                [차트 영역]
                            </div>
                        </div>
                        <div className="p-4 bg-white rounded-xl border border-slate-100">
                            <h3 className="font-bold text-slate-700 mb-4">카테고리별 분포</h3>
                            <div className="h-48 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
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
        <div className="p-6 bg-white rounded-xl border border-slate-100 max-w-4xl">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800">사용자 관리</h2>
                <div className="flex gap-2">
                    <input
                        type="search"
                        placeholder="검색..."
                        className="h-9 px-3 border border-slate-200 rounded-lg text-sm"
                    />
                    <button className="h-9 px-4 bg-[#21DBA4] text-white text-sm font-medium rounded-lg">
                        내보내기
                    </button>
                </div>
            </div>

            <table className="w-full text-left">
                <thead>
                    <tr className="bg-slate-50">
                        <th className="py-2 px-4 text-xs font-bold text-slate-500">이메일</th>
                        <th className="py-2 px-4 text-xs font-bold text-slate-500">플랜</th>
                        <th className="py-2 px-4 text-xs font-bold text-slate-500">클립 수</th>
                        <th className="py-2 px-4 text-xs font-bold text-slate-500">가입일</th>
                        <th className="py-2 px-4 text-xs font-bold text-slate-500">상태</th>
                    </tr>
                </thead>
                <tbody>
                    {[
                        { email: 'user1@example.com', plan: 'Pro', clips: 234, date: '2024-12-01', status: '활성' },
                        { email: 'user2@example.com', plan: 'Free', clips: 45, date: '2024-12-15', status: '활성' },
                        { email: 'user3@example.com', plan: 'Pro', clips: 567, date: '2024-11-20', status: '비활성' },
                    ].map((user) => (
                        <tr key={user.email} className="border-b border-slate-100">
                            <td className="py-3 px-4 text-sm">{user.email}</td>
                            <td className="py-3 px-4">
                                <span className={`text-xs font-medium px-2 py-1 rounded ${user.plan === 'Pro' ? 'bg-[#21DBA4]/10 text-[#21DBA4]' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                    {user.plan}
                                </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-slate-600">{user.clips}</td>
                            <td className="py-3 px-4 text-sm text-slate-400">{user.date}</td>
                            <td className="py-3 px-4">
                                <span className={`text-xs font-medium px-2 py-1 rounded ${user.status === '활성' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                    }`}>
                                    {user.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
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
