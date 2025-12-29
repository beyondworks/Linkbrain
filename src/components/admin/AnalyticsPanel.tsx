import * as React from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { RefreshCw } from 'lucide-react';
import { cn } from '../ui/utils';
import { StatCard } from '../shared/StatCard';
import { SectionHeader } from '../shared/SectionHeader';

interface AnalyticsPanelProps {
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    admin: ReturnType<typeof useAdmin>;
}

/**
 * AnalyticsPanel (Overview + Service Stats 통합)
 * 
 * 3번 스크린샷처럼 Overview와 Service Stats를 하나의 페이지에 표시
 */
export function AnalyticsPanel({ theme, language, admin }: AnalyticsPanelProps) {
    const { analytics, fetchAnalytics } = admin;
    const isDark = theme === 'dark';

    const t = {
        title: 'Overview',
        subtitle: language === 'ko' ? '실시간 서비스 현황' : 'Real-time metrics',
        totalUsers: language === 'ko' ? '총 사용자' : 'Total Users',
        totalClips: language === 'ko' ? '총 클립' : 'Total Clips',
        activeSubscriptions: language === 'ko' ? '활성 구독' : 'Active Subs',
        apiCalls: language === 'ko' ? 'API 호출' : 'API Calls',
        refresh: language === 'ko' ? '새로고침' : 'Refresh',
        noData: language === 'ko' ? '데이터 로딩 중...' : 'Loading data...',
        dailySignups: language === 'ko' ? '일별 가입자' : 'Daily Signups',
        categoryDist: language === 'ko' ? '카테고리별 분포' : 'Category Distribution',
        chartArea: language === 'ko' ? '차트 영역' : 'Chart Area',
        thisWeek: language === 'ko' ? '이번 주' : 'this week',
        serviceStats: language === 'ko' ? '서비스 통계' : 'Service Stats',
        serviceSubtitle: language === 'ko' ? '실시간 서비스 현황' : 'Real-time metrics',
        platformUsage: language === 'ko' ? '플랫폼별 사용량' : 'Platform Usage'
    };

    const chartLine = isDark ? '#27272A' : '#E5E7EB';
    const chartTick = isDark ? '#71717A' : '#9CA3AF';

    if (!analytics) {
        return (
            <div className={cn(
                "p-6 rounded-3xl border text-center",
                isDark ? "bg-[#111113] border-gray-800 text-gray-500" : "bg-white border-slate-100 text-slate-400"
            )}>
                {t.noData}
            </div>
        );
    }

    // Stats data
    const mainStats = [
        { label: t.totalUsers, value: analytics.totalUsers, trend: "+12% " + t.thisWeek, trendUp: true },
        { label: t.totalClips, value: analytics.totalClips, trend: "+8% " + t.thisWeek, trendUp: true },
        { label: t.activeSubscriptions, value: analytics.subscriptionStats?.active || 0, trend: "+5% " + t.thisWeek, trendUp: true },
        { label: t.apiCalls, value: "12.3K", trend: "-2% " + t.thisWeek, trendUp: false }
    ];

    // Platform data for Service Stats
    const platformData = [
        { platform: 'YouTube', count: analytics.platformStats?.youtube || 0, color: '#FF0000' },
        { platform: 'Instagram', count: analytics.platformStats?.instagram || 0, color: '#E4405F' },
        { platform: 'Threads', count: analytics.platformStats?.threads || 0, color: isDark ? '#FFFFFF' : '#000000' },
        { platform: 'Web', count: analytics.platformStats?.web || 0, color: '#21DBA4' }
    ];
    const maxCount = Math.max(...platformData.map(p => p.count), 1);

    return (
        <div className="space-y-8">
            {/* ========== Overview Section ========== */}
            <SectionHeader
                title={t.title}
                subtitle={t.subtitle}
                isDark={isDark}
                action={
                    <button
                        onClick={() => fetchAnalytics()}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border transition-colors",
                            isDark
                                ? "text-gray-400 bg-slate-50 hover:bg-slate-100 border-gray-800"
                                : "text-slate-500 bg-slate-50 hover:bg-slate-100 border-slate-200"
                        )}
                    >
                        <RefreshCw size={14} />
                        {t.refresh}
                    </button>
                }
            />

            {/* Stats Grid - 4-column */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mainStats.map((stat, i) => (
                    <StatCard
                        key={i}
                        label={stat.label}
                        value={stat.value}
                        trend={stat.trend}
                        trendUp={stat.trendUp}
                        isDark={isDark}
                    />
                ))}
            </div>

            {/* Charts Grid - 2-column */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 일별 가입자 Chart */}
                <div className={cn(
                    "p-4 rounded-3xl border",
                    isDark ? "bg-[#111113] border-gray-800" : "bg-white border-slate-100"
                )}>
                    <h3 className={cn("font-bold mb-4", isDark ? "text-slate-200" : "text-slate-700")}>
                        {t.dailySignups}
                    </h3>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={analytics.dailyStats || []}
                                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="clipGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#21DBA4" stopOpacity={0.15} />
                                        <stop offset="100%" stopColor="#21DBA4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartLine} />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: chartTick, fontSize: 11 }}
                                    tickFormatter={(v: string) => v.slice(5)}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: chartTick, fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                                        borderColor: isDark ? '#27272A' : '#E5E7EB',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}
                                />
                                <Area type="monotone" dataKey="clips" stroke="#21DBA4" strokeWidth={2} fill="url(#clipGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 카테고리별 분포 Chart */}
                <div className={cn(
                    "p-4 rounded-3xl border",
                    isDark ? "bg-[#111113] border-gray-800" : "bg-white border-slate-100"
                )}>
                    <h3 className={cn("font-bold mb-4", isDark ? "text-slate-200" : "text-slate-700")}>
                        {t.categoryDist}
                    </h3>
                    <div className={cn(
                        "h-48 rounded-xl flex items-center justify-center",
                        isDark ? "bg-gray-900/50 text-gray-500" : "bg-slate-50 text-slate-400"
                    )}>
                        [{t.chartArea}]
                    </div>
                </div>
            </div>

            {/* ========== Service Stats Section ========== */}
            <SectionHeader
                title={t.serviceStats}
                subtitle={t.serviceSubtitle}
                isDark={isDark}
            />

            {/* DAU/WAU/MAU/Retention */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="DAU" value={analytics.dau || 0} trend="+12%" trendUp={true} isDark={isDark} />
                <StatCard label="WAU" value={analytics.wau || 0} trend="+8%" trendUp={true} isDark={isDark} />
                <StatCard label="MAU" value={analytics.mau || 0} trend="+15%" trendUp={true} isDark={isDark} />
                <StatCard label="Retention" value="68%" trend="-2%" trendUp={false} isDark={isDark} />
            </div>

            {/* Platform Usage */}
            <div className={cn(
                "p-6 rounded-3xl border",
                isDark ? "bg-[#111113] border-gray-800" : "bg-white border-slate-100"
            )}>
                <h4 className={cn("font-semibold mb-4", isDark ? "text-slate-200" : "text-slate-700")}>
                    {t.platformUsage}
                </h4>
                <div className="space-y-3">
                    {platformData.map((item) => (
                        <div key={item.platform} className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className={cn("text-sm w-20", isDark ? "text-gray-400" : "text-slate-600")}>
                                {item.platform}
                            </span>
                            <div className={cn(
                                "flex-1 h-2 rounded-full overflow-hidden",
                                isDark ? "bg-gray-800" : "bg-slate-200"
                            )}>
                                <div
                                    className="h-full rounded-full"
                                    style={{ width: `${(item.count / maxCount) * 100}%`, backgroundColor: item.color }}
                                />
                            </div>
                            <span className={cn("text-sm font-medium w-16 text-right", isDark ? "text-slate-200" : "text-slate-700")}>
                                {item.count.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
