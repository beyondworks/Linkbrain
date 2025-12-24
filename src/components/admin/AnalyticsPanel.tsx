import * as React from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    Users,
    FileText,
    TrendingUp,
    Youtube,
    Instagram,
    Globe,
    RefreshCw,
    UserPlus,
    Activity,
    Calendar
} from 'lucide-react';

interface AnalyticsPanelProps {
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    admin: ReturnType<typeof useAdmin>;
}

export function AnalyticsPanel({ theme, language, admin }: AnalyticsPanelProps) {
    const { analytics, fetchAnalytics } = admin;

    const t = {
        title: language === 'ko' ? '서비스 통계' : 'Service Analytics',
        totalUsers: language === 'ko' ? '전체 사용자' : 'Total Users',
        totalClips: language === 'ko' ? '전체 클립' : 'Total Clips',
        recentClips: language === 'ko' ? '최근 7일 클립' : 'Recent 7 Days',
        avgClipsPerUser: language === 'ko' ? '유저당 평균 클립' : 'Avg Clips/User',
        subscription: language === 'ko' ? '구독 현황' : 'Subscription Status',
        trial: language === 'ko' ? '체험판' : 'Trial',
        active: language === 'ko' ? '활성 구독' : 'Active',
        expired: language === 'ko' ? '만료' : 'Expired',
        platforms: language === 'ko' ? '플랫폼별 클립' : 'Clips by Platform',
        refresh: language === 'ko' ? '새로고침' : 'Refresh',
        noData: language === 'ko' ? '데이터를 불러오는 중...' : 'Loading data...',
        newUsers: language === 'ko' ? '신규 가입자' : 'New Users',
        today: language === 'ko' ? '오늘' : 'Today',
        thisWeek: language === 'ko' ? '이번 주' : 'This Week',
        thisMonth: language === 'ko' ? '이번 달' : 'This Month',
        activeUsers: language === 'ko' ? '활성 사용자' : 'Active Users',
        dau: language === 'ko' ? '일간' : 'DAU',
        wau: language === 'ko' ? '주간' : 'WAU',
        mau: language === 'ko' ? '월간' : 'MAU',
        clipTrends: language === 'ko' ? '클립 생성 추이 (30일)' : 'Clip Trends (30 days)',
        newUserTrends: language === 'ko' ? '신규 가입 추이 (30일)' : 'New User Trends (30 days)',
        clips: language === 'ko' ? '클립' : 'clips',
        users: language === 'ko' ? '유저' : 'users'
    };

    const cardBg = theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
    const textPrimary = theme === 'dark' ? 'text-white' : 'text-slate-900';
    const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

    const platformColors = {
        youtube: '#EF4444',
        instagram: '#EC4899',
        threads: '#3B82F6',
        web: '#21DBA4'
    };

    if (!analytics) {
        return (
            <div className={`rounded-xl border p-8 text-center ${cardBg}`}>
                <p className={textSecondary}>{t.noData}</p>
            </div>
        );
    }

    const statCards = [
        {
            label: t.totalUsers,
            value: analytics.totalUsers,
            icon: <Users size={20} />,
            color: 'text-blue-500',
            bg: theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'
        },
        {
            label: t.totalClips,
            value: analytics.totalClips,
            icon: <FileText size={20} />,
            color: 'text-[#21DBA4]',
            bg: theme === 'dark' ? 'bg-[#21DBA4]/10' : 'bg-[#E0FBF4]'
        },
        {
            label: t.recentClips,
            value: analytics.recentClipsCount,
            icon: <TrendingUp size={20} />,
            color: 'text-purple-500',
            bg: theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'
        },
        {
            label: t.avgClipsPerUser,
            value: analytics.avgClipsPerUser || 0,
            icon: <Activity size={20} />,
            color: 'text-orange-500',
            bg: theme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-50'
        }
    ];

    const platformData = [
        { name: 'YouTube', value: analytics.platformStats.youtube, color: platformColors.youtube },
        { name: 'Instagram', value: analytics.platformStats.instagram, color: platformColors.instagram },
        { name: 'Threads', value: analytics.platformStats.threads, color: platformColors.threads },
        { name: 'Web', value: analytics.platformStats.web, color: platformColors.web }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className={`text-xl font-bold ${textPrimary}`}>{t.title}</h2>
                <button
                    onClick={() => fetchAnalytics()}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${theme === 'dark'
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                >
                    <RefreshCw size={14} />
                    {t.refresh}
                </button>
            </div>

            {/* Main Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, i) => (
                    <div key={i} className={`rounded-xl border p-5 ${cardBg}`}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <span className={`text-xs font-medium ${textSecondary}`}>{stat.label}</span>
                        </div>
                        <p className={`text-2xl font-bold ${textPrimary}`}>
                            {stat.value.toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>

            {/* New Users & Active Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* New Users */}
                <div className={`rounded-xl border p-5 ${cardBg}`}>
                    <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${textSecondary}`}>
                        <UserPlus size={16} />
                        {t.newUsers}
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <p className={`text-2xl font-bold text-[#21DBA4]`}>{analytics.newUsersToday || 0}</p>
                            <p className={`text-xs mt-1 ${textSecondary}`}>{t.today}</p>
                        </div>
                        <div className="text-center">
                            <p className={`text-2xl font-bold text-blue-500`}>{analytics.newUsersThisWeek || 0}</p>
                            <p className={`text-xs mt-1 ${textSecondary}`}>{t.thisWeek}</p>
                        </div>
                        <div className="text-center">
                            <p className={`text-2xl font-bold text-purple-500`}>{analytics.newUsersThisMonth || 0}</p>
                            <p className={`text-xs mt-1 ${textSecondary}`}>{t.thisMonth}</p>
                        </div>
                    </div>
                </div>

                {/* Active Users */}
                <div className={`rounded-xl border p-5 ${cardBg}`}>
                    <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${textSecondary}`}>
                        <Activity size={16} />
                        {t.activeUsers}
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <p className={`text-2xl font-bold text-[#21DBA4]`}>{analytics.dau || 0}</p>
                            <p className={`text-xs mt-1 ${textSecondary}`}>{t.dau}</p>
                        </div>
                        <div className="text-center">
                            <p className={`text-2xl font-bold text-blue-500`}>{analytics.wau || 0}</p>
                            <p className={`text-xs mt-1 ${textSecondary}`}>{t.wau}</p>
                        </div>
                        <div className="text-center">
                            <p className={`text-2xl font-bold text-purple-500`}>{analytics.mau || 0}</p>
                            <p className={`text-xs mt-1 ${textSecondary}`}>{t.mau}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subscription Stats */}
            <div className={`rounded-xl border p-5 ${cardBg}`}>
                <h3 className={`text-sm font-bold mb-4 ${textSecondary}`}>{t.subscription}</h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <p className={`text-2xl font-bold text-yellow-500`}>
                            {analytics.subscriptionStats.trial}
                        </p>
                        <p className={`text-xs mt-1 ${textSecondary}`}>{t.trial}</p>
                    </div>
                    <div className="text-center">
                        <p className={`text-2xl font-bold text-[#21DBA4]`}>
                            {analytics.subscriptionStats.active}
                        </p>
                        <p className={`text-xs mt-1 ${textSecondary}`}>{t.active}</p>
                    </div>
                    <div className="text-center">
                        <p className={`text-2xl font-bold text-red-500`}>
                            {analytics.subscriptionStats.expired}
                        </p>
                        <p className={`text-xs mt-1 ${textSecondary}`}>{t.expired}</p>
                    </div>
                </div>
            </div>

            {/* Clip Trends Chart */}
            {analytics.dailyStats && analytics.dailyStats.length > 0 && (
                <div className={`rounded-xl border p-5 ${cardBg}`}>
                    <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${textSecondary}`}>
                        <Calendar size={16} />
                        {t.clipTrends}
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analytics.dailyStats} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                                <XAxis
                                    dataKey="date"
                                    stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
                                    fontSize={10}
                                    tickFormatter={(value: string) => value.slice(5)}
                                    interval={4}
                                />
                                <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                                        border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
                                        borderRadius: '8px',
                                        color: theme === 'dark' ? '#fff' : '#1e293b'
                                    }}
                                    formatter={(value: number) => [`${value} ${t.clips}`, '']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="clips"
                                    stroke="#21DBA4"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 6, fill: '#21DBA4' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* New User Trends Chart */}
            {analytics.dailyStats && analytics.dailyStats.length > 0 && (
                <div className={`rounded-xl border p-5 ${cardBg}`}>
                    <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${textSecondary}`}>
                        <UserPlus size={16} />
                        {t.newUserTrends}
                    </h3>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analytics.dailyStats} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                                <XAxis
                                    dataKey="date"
                                    stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
                                    fontSize={10}
                                    tickFormatter={(value: string) => value.slice(5)}
                                    interval={4}
                                />
                                <YAxis stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                                        border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
                                        borderRadius: '8px',
                                        color: theme === 'dark' ? '#fff' : '#1e293b'
                                    }}
                                    formatter={(value: number) => [`${value} ${t.users}`, '']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="newUsers"
                                    stroke="#3B82F6"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 6, fill: '#3B82F6' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Platform Stats with Pie Chart */}
            <div className={`rounded-xl border p-5 ${cardBg}`}>
                <h3 className={`text-sm font-bold mb-4 ${textSecondary}`}>{t.platforms}</h3>
                <div className="flex flex-col lg:flex-row items-center gap-6">
                    {/* Pie Chart */}
                    <div className="w-48 h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={platformData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {platformData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                                        border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
                                        borderRadius: '8px',
                                        color: theme === 'dark' ? '#fff' : '#1e293b'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Platform List */}
                    <div className="flex-1 grid grid-cols-2 gap-4">
                        <div className={`flex items-center gap-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
                            <Youtube size={20} className="text-red-500" />
                            <div>
                                <p className={`text-lg font-bold ${textPrimary}`}>{analytics.platformStats.youtube}</p>
                                <p className={`text-xs ${textSecondary}`}>YouTube</p>
                            </div>
                        </div>
                        <div className={`flex items-center gap-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
                            <Instagram size={20} className="text-pink-500" />
                            <div>
                                <p className={`text-lg font-bold ${textPrimary}`}>{analytics.platformStats.instagram}</p>
                                <p className={`text-xs ${textSecondary}`}>Instagram</p>
                            </div>
                        </div>
                        <div className={`flex items-center gap-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
                            <span className="text-lg">🧵</span>
                            <div>
                                <p className={`text-lg font-bold ${textPrimary}`}>{analytics.platformStats.threads}</p>
                                <p className={`text-xs ${textSecondary}`}>Threads</p>
                            </div>
                        </div>
                        <div className={`flex items-center gap-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
                            <Globe size={20} className="text-blue-500" />
                            <div>
                                <p className={`text-lg font-bold ${textPrimary}`}>{analytics.platformStats.web}</p>
                                <p className={`text-xs ${textSecondary}`}>Web</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
