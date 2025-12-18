import * as React from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import {
    Users,
    FileText,
    TrendingUp,
    Youtube,
    Instagram,
    Globe,
    RefreshCw
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
        subscription: language === 'ko' ? '구독 현황' : 'Subscription Status',
        trial: language === 'ko' ? '체험판' : 'Trial',
        active: language === 'ko' ? '활성 구독' : 'Active',
        expired: language === 'ko' ? '만료' : 'Expired',
        platforms: language === 'ko' ? '플랫폼별 클립' : 'Clips by Platform',
        refresh: language === 'ko' ? '새로고침' : 'Refresh',
        noData: language === 'ko' ? '데이터를 불러오는 중...' : 'Loading data...'
    };

    const cardBg = theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
    const textPrimary = theme === 'dark' ? 'text-white' : 'text-slate-900';
    const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

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
        }
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

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {statCards.map((stat, i) => (
                    <div key={i} className={`rounded-xl border p-5 ${cardBg}`}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <span className={`text-sm font-medium ${textSecondary}`}>{stat.label}</span>
                        </div>
                        <p className={`text-3xl font-bold ${textPrimary}`}>
                            {stat.value.toLocaleString()}
                        </p>
                    </div>
                ))}
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

            {/* Platform Stats */}
            <div className={`rounded-xl border p-5 ${cardBg}`}>
                <h3 className={`text-sm font-bold mb-4 ${textSecondary}`}>{t.platforms}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
    );
}
