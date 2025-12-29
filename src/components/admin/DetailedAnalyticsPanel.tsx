import * as React from 'react';
import { useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { RefreshCw, Loader2 } from 'lucide-react';
import { cn } from '../ui/utils';
import { SectionHeader } from '../shared/SectionHeader';

interface DetailedAnalyticsPanelProps {
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    admin: ReturnType<typeof useAdmin>;
}

/**
 * DetailedAnalyticsPanel - Storybook Style
 * 
 * 수정사항:
 * - 아이콘 박스 제거, 텍스트 헤더만
 * - 시간대별/요일별/플랫폼추이 → 1열/3줄
 * - 주간 리텐션 → 4열/1줄
 */
export function DetailedAnalyticsPanel({ theme, language, admin }: DetailedAnalyticsPanelProps) {
    const { detailedAnalytics, fetchDetailedAnalytics } = admin;
    const [loading, setLoading] = React.useState(true);
    const [hasLoaded, setHasLoaded] = React.useState(false);
    const isDark = theme === 'dark';

    useEffect(() => {
        if (hasLoaded) return;
        const loadData = async () => {
            try { await fetchDetailedAnalytics(); }
            catch (error) { console.error('Failed to load detailed analytics:', error); }
            finally { setLoading(false); setHasLoaded(true); }
        };
        loadData();
    }, [hasLoaded, fetchDetailedAnalytics]);

    const t = {
        title: language === 'ko' ? '상세 분석' : 'Detailed Analytics',
        subtitle: language === 'ko' ? '심층 분석 데이터' : 'Deep-dive analytics',
        refresh: language === 'ko' ? '새로고침' : 'Refresh',
        hourlyActivity: language === 'ko' ? '시간대별 활동' : 'Hourly Activity',
        weekdayActivity: language === 'ko' ? '요일별 활동' : 'Weekly Pattern',
        platformTrends: language === 'ko' ? '플랫폼 추이' : 'Platform Trends',
        retention: language === 'ko' ? '주간 리텐션' : 'Weekly Retention',
        loading: language === 'ko' ? '로딩 중...' : 'Loading...'
    };

    const handleRefresh = async () => {
        setLoading(true);
        try { await fetchDetailedAnalytics(); }
        catch (error) { console.error('Failed to refresh:', error); }
        finally { setLoading(false); }
    };

    if (loading || !detailedAnalytics) {
        return (
            <div className={cn(
                "rounded-3xl border p-16 text-center",
                isDark ? "bg-[#111113] border-gray-800" : "bg-white border-slate-100"
            )}>
                <Loader2 className="w-8 h-8 text-[#21DBA4] animate-spin mx-auto mb-4" />
                <p className={isDark ? "text-gray-400" : "text-slate-500"}>{t.loading}</p>
            </div>
        );
    }

    const hourlyData = detailedAnalytics.hourlyActivity.map(h => ({ ...h, label: `${h.hour}h` }));

    // Retention colors
    const retentionColors = ['text-[#21DBA4]', 'text-[#21DBA4]', 'text-amber-500', 'text-orange-500'];

    return (
        <div className="space-y-6">
            {/* Header */}
            <SectionHeader
                title={t.title}
                subtitle={t.subtitle}
                isDark={isDark}
                action={
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                            isDark ? "bg-white/5 text-gray-400 hover:bg-white/10" : "bg-black/5 text-gray-500 hover:bg-black/10"
                        )}
                    >
                        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                        {t.refresh}
                    </button>
                }
            />

            {/* 시간대별 활동 (1열) */}
            <div className={cn(
                "rounded-3xl border p-6",
                isDark ? "bg-[#111113] border-gray-800" : "bg-white border-slate-100"
            )}>
                <h3 className={cn("text-base font-bold mb-6", isDark ? "text-white" : "text-slate-900")}>
                    {t.hourlyActivity}
                </h3>
                <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={hourlyData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1f1f23' : '#f1f5f9'} />
                            <XAxis dataKey="label" stroke={isDark ? '#3f3f46' : '#cbd5e1'} fontSize={9} interval={3} />
                            <YAxis stroke={isDark ? '#3f3f46' : '#cbd5e1'} fontSize={10} />
                            <Tooltip contentStyle={{ backgroundColor: isDark ? '#18181b' : '#fff', border: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}`, borderRadius: '12px', fontSize: '12px' }} />
                            <Bar dataKey="count" fill="#21DBA4" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 요일별 활동 (1열) */}
            <div className={cn(
                "rounded-3xl border p-6",
                isDark ? "bg-[#111113] border-gray-800" : "bg-white border-slate-100"
            )}>
                <h3 className={cn("text-base font-bold mb-6", isDark ? "text-white" : "text-slate-900")}>
                    {t.weekdayActivity}
                </h3>
                <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={detailedAnalytics.weekdayActivity} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1f1f23' : '#f1f5f9'} />
                            <XAxis dataKey="day" stroke={isDark ? '#3f3f46' : '#cbd5e1'} fontSize={11} />
                            <YAxis stroke={isDark ? '#3f3f46' : '#cbd5e1'} fontSize={10} />
                            <Tooltip contentStyle={{ backgroundColor: isDark ? '#18181b' : '#fff', border: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}`, borderRadius: '12px', fontSize: '12px' }} />
                            <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 플랫폼 추이 (1열) */}
            <div className={cn(
                "rounded-3xl border p-6",
                isDark ? "bg-[#111113] border-gray-800" : "bg-white border-slate-100"
            )}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className={cn("text-base font-bold", isDark ? "text-white" : "text-slate-900")}>
                        {t.platformTrends}
                    </h3>
                    <span className={cn("text-xs", isDark ? "text-gray-500" : "text-slate-400")}>30 days</span>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={detailedAnalytics.platformTrends} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                            <defs>
                                <linearGradient id="youtubeGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#EF4444" stopOpacity={0.5} />
                                    <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="instaGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#EC4899" stopOpacity={0.5} />
                                    <stop offset="100%" stopColor="#EC4899" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="threadsGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.5} />
                                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="webGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#21DBA4" stopOpacity={0.5} />
                                    <stop offset="100%" stopColor="#21DBA4" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1f1f23' : '#f1f5f9'} />
                            <XAxis dataKey="date" stroke={isDark ? '#3f3f46' : '#cbd5e1'} fontSize={9} tickFormatter={(v: string) => v.slice(5)} interval={5} />
                            <YAxis stroke={isDark ? '#3f3f46' : '#cbd5e1'} fontSize={10} />
                            <Tooltip contentStyle={{ backgroundColor: isDark ? '#18181b' : '#fff', border: `1px solid ${isDark ? '#27272a' : '#e2e8f0'}`, borderRadius: '12px', fontSize: '11px' }} />
                            <Legend wrapperStyle={{ fontSize: '11px' }} />
                            <Area type="monotone" dataKey="youtube" stroke="#EF4444" strokeWidth={2} fill="url(#youtubeGrad)" />
                            <Area type="monotone" dataKey="instagram" stroke="#EC4899" strokeWidth={2} fill="url(#instaGrad)" />
                            <Area type="monotone" dataKey="threads" stroke="#3B82F6" strokeWidth={2} fill="url(#threadsGrad)" />
                            <Area type="monotone" dataKey="web" stroke="#21DBA4" strokeWidth={2} fill="url(#webGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 주간 리텐션 (4열/1줄) */}
            <div className={cn(
                "rounded-3xl border p-6",
                isDark ? "bg-[#111113] border-gray-800" : "bg-white border-slate-100"
            )}>
                <h3 className={cn("text-base font-bold mb-6", isDark ? "text-white" : "text-slate-900")}>
                    {t.retention}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    {detailedAnalytics.retentionData.map((data, index) => (
                        <div
                            key={data.week}
                            className={cn(
                                "rounded-2xl p-5 text-center",
                                isDark ? "bg-gray-800/50" : "bg-slate-50"
                            )}
                        >
                            <p className={cn("text-xs font-medium mb-3", isDark ? "text-gray-500" : "text-slate-500")}>
                                {data.week}
                            </p>
                            <p className={cn("text-3xl font-bold tabular-nums", retentionColors[index] || retentionColors[3])}>
                                {data.retention}%
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
