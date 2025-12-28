import * as React from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import {
    Users,
    FileText,
    TrendingUp,
    TrendingDown,
    Youtube,
    Instagram,
    Globe,
    RefreshCw,
    Zap,
    Clock,
    Activity,
    ArrowUpRight
} from 'lucide-react';
import { cn } from '../ui/utils';

interface AnalyticsPanelProps {
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    admin: ReturnType<typeof useAdmin>;
}

export function AnalyticsPanel({ theme, language, admin }: AnalyticsPanelProps) {
    const { analytics, fetchAnalytics } = admin;
    const isDark = theme === 'dark';

    const t = {
        title: language === 'ko' ? '서비스 통계' : 'Analytics',
        subtitle: language === 'ko' ? '실시간 서비스 현황 및 주요 지표' : 'Real-time metrics & insights',
        totalUsers: language === 'ko' ? '전체 사용자' : 'Total Users',
        totalClips: language === 'ko' ? '전체 클립' : 'Total Clips',
        recentClips: language === 'ko' ? '최근 7일' : 'Last 7 Days',
        avgClipsPerUser: language === 'ko' ? '인당 평균' : 'Avg/User',
        subscription: language === 'ko' ? '구독 현황' : 'Subscriptions',
        platforms: language === 'ko' ? '플랫폼별 클립' : 'Clips by Platform',
        refresh: language === 'ko' ? '새로고침' : 'Refresh',
        noData: language === 'ko' ? '데이터를 불러오는 중...' : 'Loading data...',
        newUsers: language === 'ko' ? '신규 가입자' : 'New Signups',
        activeUsers: language === 'ko' ? '활성 사용자' : 'Active Users',
        clipTrends: language === 'ko' ? '클립 생성 추이' : 'Clip Trends',
        active: language === 'ko' ? '활성' : 'Active',
        trial: language === 'ko' ? '체험' : 'Trial',
        expired: language === 'ko' ? '만료' : 'Expired',
        today: language === 'ko' ? '오늘' : 'Today',
        thisWeek: language === 'ko' ? '이번 주' : 'This Week',
        thisMonth: language === 'ko' ? '이번 달' : 'This Month'
    };

    // ═══════════════════════════════════════════════════
    // Plus X Design Tokens
    // ═══════════════════════════════════════════════════
    const tokens = {
        // Backgrounds
        bgCard: isDark ? 'bg-[#111113]' : 'bg-white',
        bgSurface: isDark ? 'bg-[#18181B]' : 'bg-[#F9FAFB]',
        bgHover: isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-black/[0.01]',

        // Borders
        border: isDark ? 'border-white/[0.06]' : 'border-black/[0.05]',
        borderHover: isDark ? 'hover:border-white/[0.12]' : 'hover:border-black/[0.10]',

        // Typography
        textPrimary: isDark ? 'text-[#FAFAFA]' : 'text-[#111111]',
        textSecondary: isDark ? 'text-[#A1A1AA]' : 'text-[#525252]',
        textTertiary: isDark ? 'text-[#71717A]' : 'text-[#A3A3A3]',

        // Chart colors
        chartLine: isDark ? '#3F3F46' : '#E5E7EB',
        chartTick: isDark ? '#71717A' : '#9CA3AF',
    };

    // Loading state
    if (!analytics) {
        return (
            <div className={cn(
                "flex flex-col items-center justify-center min-h-[400px] rounded-3xl border border-dashed",
                tokens.border
            )}>
                <Activity className={cn("w-6 h-6 mb-3 animate-pulse", tokens.textTertiary)} />
                <p className={cn("text-sm font-medium", tokens.textSecondary)}>{t.noData}</p>
            </div>
        );
    }

    // ═══════════════════════════════════════════════════
    // Data Preparation
    // ═══════════════════════════════════════════════════
    const mainStats = [
        {
            label: t.totalUsers,
            value: analytics.totalUsers,
            icon: Users,
            trend: "+12.5%",
            trendUp: true,
            accent: 'emerald'
        },
        {
            label: t.totalClips,
            value: analytics.totalClips,
            icon: FileText,
            trend: "+8.2%",
            trendUp: true,
            accent: 'blue'
        },
        {
            label: t.recentClips,
            value: analytics.recentClipsCount,
            icon: Clock,
            trend: "-2.1%",
            trendUp: false,
            accent: 'amber'
        },
        {
            label: t.avgClipsPerUser,
            value: analytics.avgClipsPerUser || 0,
            icon: Zap,
            trend: null,
            trendUp: null,
            accent: 'violet'
        }
    ];

    const platformData = [
        { name: 'YouTube', value: analytics.platformStats.youtube, icon: Youtube, color: '#FF0000' },
        { name: 'Instagram', value: analytics.platformStats.instagram, icon: Instagram, color: '#E1306C' },
        { name: 'Threads', value: analytics.platformStats.threads, textIcon: '@', color: isDark ? '#FAFAFA' : '#111111' },
        { name: 'Web', value: analytics.platformStats.web, icon: Globe, color: '#21DBA4' }
    ];

    const maxPlatformValue = Math.max(...platformData.map(p => p.value), 1);

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto">
            {/* ═══════════════════════════════════════════════════
                Header Section - Plus X Style
                ═══════════════════════════════════════════════════ */}
            <div className="flex items-end justify-between">
                <div className="space-y-1">
                    <h2 className={cn("text-2xl font-bold tracking-tight", tokens.textPrimary)}>
                        {t.title}
                    </h2>
                    <p className={cn("text-sm", tokens.textSecondary)}>
                        {t.subtitle}
                    </p>
                </div>
                <button
                    onClick={() => fetchAnalytics()}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200",
                        tokens.border,
                        tokens.borderHover,
                        tokens.textSecondary,
                        "hover:text-[#21DBA4]"
                    )}
                >
                    <RefreshCw size={14} />
                    {t.refresh}
                </button>
            </div>

            {/* ═══════════════════════════════════════════════════
                KPI Cards - Storybook Pattern (Simple & Clean)
                ═══════════════════════════════════════════════════ */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {mainStats.map((stat, i) => (
                    <div
                        key={i}
                        className={cn(
                            "p-5 rounded-3xl border transition-all duration-200 hover:border-[#21DBA4]/30",
                            tokens.bgCard,
                            tokens.border
                        )}
                    >
                        {/* Label */}
                        <p className={cn("text-xs font-medium mb-2", tokens.textTertiary)}>
                            {stat.label}
                        </p>

                        {/* Hero Value */}
                        <p className={cn(
                            "text-2xl font-bold tabular-nums mb-1",
                            tokens.textPrimary
                        )}>
                            {typeof stat.value === 'number'
                                ? stat.value.toLocaleString()
                                : stat.value}
                        </p>

                        {/* Trend */}
                        {stat.trend && (
                            <p className={cn(
                                "text-xs font-medium",
                                stat.trendUp ? "text-[#21DBA4]" : "text-rose-500"
                            )}>
                                {stat.trend} {language === 'ko' ? '이번 주' : 'this week'}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* ═══════════════════════════════════════════════════
                Main Content Grid - 7:5 Ratio
                ═══════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Column - Charts (7 cols) */}
                <div className="lg:col-span-7 space-y-6">

                    {/* Clip Trends Chart */}
                    <div className={cn(
                        "rounded-3xl border p-6",
                        tokens.bgCard,
                        tokens.border
                    )}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className={cn("text-base font-semibold", tokens.textPrimary)}>
                                {t.clipTrends}
                            </h3>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#21DBA4]" />
                                <span className={cn("text-xs font-medium", tokens.textTertiary)}>
                                    Clips
                                </span>
                            </div>
                        </div>

                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={analytics.dailyStats || []}
                                    margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="clipGradientPlusX" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#21DBA4" stopOpacity={0.15} />
                                            <stop offset="100%" stopColor="#21DBA4" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                        stroke={tokens.chartLine}
                                    />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: tokens.chartTick, fontSize: 11, fontWeight: 500 }}
                                        dy={8}
                                        tickFormatter={(v: string) => v.slice(5)}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: tokens.chartTick, fontSize: 11, fontWeight: 500 }}
                                        dx={-8}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                                            borderColor: isDark ? '#27272A' : '#E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                            fontWeight: 500,
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                            padding: '8px 12px'
                                        }}
                                        cursor={{ stroke: isDark ? '#3F3F46' : '#E5E7EB', strokeWidth: 1 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="clips"
                                        stroke="#21DBA4"
                                        strokeWidth={2}
                                        fill="url(#clipGradientPlusX)"
                                        activeDot={{
                                            r: 4,
                                            fill: '#21DBA4',
                                            strokeWidth: 2,
                                            stroke: isDark ? '#111113' : '#FFFFFF'
                                        }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Platform Stats - Strict 8px Grid */}
                    <div className={cn(
                        "rounded-3xl border p-6",
                        tokens.bgCard,
                        tokens.border
                    )}>
                        <h3 className={cn("text-base font-semibold mb-6", tokens.textPrimary)}>
                            {t.platforms}
                        </h3>

                        {/* 2x2 Grid with equal spacing */}
                        <div className="grid grid-cols-2 gap-6">
                            {platformData.map((platform, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "p-4 rounded-xl",
                                        isDark ? "bg-white/[0.02]" : "bg-black/[0.015]"
                                    )}
                                >
                                    {/* Platform Label */}
                                    <div className="flex items-center gap-2 mb-3">
                                        {platform.textIcon ? (
                                            <span className="text-base leading-none font-bold" style={{ color: platform.color }}>{platform.textIcon}</span>
                                        ) : (
                                            platform.icon && <platform.icon size={16} style={{ color: platform.color }} />
                                        )}
                                        <span className={cn("text-sm font-medium", tokens.textSecondary)}>
                                            {platform.name}
                                        </span>
                                    </div>

                                    {/* Value */}
                                    <p className={cn("text-2xl font-bold tabular-nums mb-3", tokens.textPrimary)}>
                                        {platform.value.toLocaleString()}
                                    </p>

                                    {/* Progress Bar */}
                                    <div className={cn(
                                        "w-full h-1.5 rounded-full overflow-hidden",
                                        isDark ? "bg-white/[0.06]" : "bg-black/[0.04]"
                                    )}>
                                        <div
                                            className="h-full rounded-full transition-all duration-500 ease-out"
                                            style={{
                                                width: `${(platform.value / maxPlatformValue) * 100}%`,
                                                backgroundColor: platform.color
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Secondary Metrics (5 cols) */}
                <div className="lg:col-span-5 space-y-6">

                    {/* New Users - Compact Chart */}
                    <div className={cn(
                        "rounded-3xl border p-6",
                        tokens.bgCard,
                        tokens.border
                    )}>
                        <h3 className={cn("text-base font-semibold mb-5", tokens.textPrimary)}>
                            {t.newUsers}
                        </h3>

                        <div className="flex items-baseline gap-2 mb-4">
                            <span className={cn("text-4xl font-black tabular-nums", tokens.textPrimary)}>
                                {(analytics.newUsersThisMonth || 0).toLocaleString()}
                            </span>
                            <span className={cn("text-sm font-medium", tokens.textTertiary)}>
                                {t.thisMonth}
                            </span>
                        </div>

                        <div className="h-[72px] mb-5">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={(analytics.dailyStats || []).slice(-14)}>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                                            borderColor: isDark ? '#27272A' : '#E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '11px',
                                            padding: '6px 10px'
                                        }}
                                        cursor={{ fill: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}
                                    />
                                    <Bar
                                        dataKey="newUsers"
                                        fill="#3B82F6"
                                        radius={[3, 3, 0, 0]}
                                        barSize={6}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className={cn(
                            "grid grid-cols-2 gap-4 pt-4 border-t",
                            isDark ? "border-white/[0.06]" : "border-black/[0.05]"
                        )}>
                            <div>
                                <p className={cn("text-xs font-medium mb-1", tokens.textTertiary)}>{t.today}</p>
                                <p className={cn("text-lg font-bold tabular-nums", tokens.textPrimary)}>
                                    {analytics.newUsersToday || 0}
                                </p>
                            </div>
                            <div>
                                <p className={cn("text-xs font-medium mb-1", tokens.textTertiary)}>{t.thisWeek}</p>
                                <p className={cn("text-lg font-bold tabular-nums", tokens.textPrimary)}>
                                    {analytics.newUsersThisWeek || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Subscription Status */}
                    <div className={cn(
                        "rounded-3xl border p-6",
                        tokens.bgCard,
                        tokens.border
                    )}>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className={cn("text-base font-semibold", tokens.textPrimary)}>
                                {t.subscription}
                            </h3>
                            <Zap size={16} className="text-[#21DBA4]" />
                        </div>

                        <div className="space-y-3">
                            {/* Active - Highlighted */}
                            <div className={cn(
                                "flex items-center justify-between p-4 rounded-xl",
                                "bg-emerald-500/[0.06] border border-emerald-500/[0.12]"
                            )}>
                                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                    {t.active}
                                </span>
                                <span className="text-xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                                    {analytics.subscriptionStats.active.toLocaleString()}
                                </span>
                            </div>

                            {/* Trial */}
                            <div className={cn(
                                "flex items-center justify-between px-4 py-3 rounded-xl",
                                isDark ? "bg-white/[0.02]" : "bg-black/[0.02]"
                            )}>
                                <span className={cn("text-sm font-medium", tokens.textSecondary)}>
                                    {t.trial}
                                </span>
                                <span className={cn("text-lg font-bold tabular-nums", tokens.textPrimary)}>
                                    {analytics.subscriptionStats.trial.toLocaleString()}
                                </span>
                            </div>

                            {/* Expired */}
                            <div className="flex items-center justify-between px-4 py-3">
                                <span className={cn("text-sm font-medium", tokens.textTertiary)}>
                                    {t.expired}
                                </span>
                                <span className={cn("text-lg font-semibold tabular-nums", tokens.textTertiary)}>
                                    {analytics.subscriptionStats.expired.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Active Users (DAU/WAU/MAU) */}
                    <div className={cn(
                        "rounded-3xl border p-6",
                        tokens.bgCard,
                        tokens.border
                    )}>
                        <h3 className={cn("text-base font-semibold mb-5", tokens.textPrimary)}>
                            {t.activeUsers}
                        </h3>

                        <div className="space-y-4">
                            {[
                                { label: 'DAU', value: analytics.dau, change: '+2%', active: true },
                                { label: 'WAU', value: analytics.wau, change: '+5%', active: false },
                                { label: 'MAU', value: analytics.mau, change: '+12%', active: false }
                            ].map((metric, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            metric.active ? "bg-[#21DBA4]" : isDark ? "bg-white/20" : "bg-black/20"
                                        )} />
                                        <span className={cn(
                                            "text-sm font-semibold",
                                            metric.active ? tokens.textPrimary : tokens.textSecondary
                                        )}>
                                            {metric.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={cn("text-lg font-bold tabular-nums", tokens.textPrimary)}>
                                            {(metric.value || 0).toLocaleString()}
                                        </span>
                                        <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                            {metric.change}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
