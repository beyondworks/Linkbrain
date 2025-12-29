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
import {
    Clock,
    Calendar,
    TrendingUp,
    RefreshCw,
    Loader2,
    Activity,
    Layers
} from 'lucide-react';
import { cn } from '../ui/utils';
import { SectionHeader } from '../shared/SectionHeader';

interface DetailedAnalyticsPanelProps {
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    admin: ReturnType<typeof useAdmin>;
}

// ═══════════════════════════════════════════════════
// Theme System (Reference Design)
// ═══════════════════════════════════════════════════

const useTheme = (isDark: boolean) => ({
    card: isDark ? 'bg-[#161B22]' : 'bg-white',
    cardBorder: isDark ? 'border-gray-800' : 'border-gray-200',
    text: isDark ? 'text-white' : 'text-gray-900',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-500',
    textSub: isDark ? 'text-gray-500' : 'text-gray-400',
    itemBg: isDark ? 'bg-gray-900/50' : 'bg-gray-50',
    itemHover: isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
});

export function DetailedAnalyticsPanel({ theme, language, admin }: DetailedAnalyticsPanelProps) {
    const { detailedAnalytics, fetchDetailedAnalytics } = admin;
    const [loading, setLoading] = React.useState(true);
    const [hasLoaded, setHasLoaded] = React.useState(false);
    const isDark = theme === 'dark';
    const t$ = useTheme(isDark);

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
        loading: language === 'ko' ? '로딩 중...' : 'Loading...',
        clips: language === 'ko' ? '클립' : 'clips'
    };

    const handleRefresh = async () => {
        setLoading(true);
        try { await fetchDetailedAnalytics(); }
        catch (error) { console.error('Failed to refresh:', error); }
        finally { setLoading(false); }
    };

    if (loading || !detailedAnalytics) {
        return (
            <div className={cn("rounded-3xl border p-16 text-center", t$.card, t$.cardBorder)}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-orange-500/20 to-orange-600/5 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                    </div>
                    <p className={t$.textMuted}>{t.loading}</p>
                </div>
            </div>
        );
    }

    const hourlyData = detailedAnalytics.hourlyActivity.map(h => ({ ...h, label: `${h.hour}h` }));

    return (
        <div className="space-y-8">
            {/* Header - Using SectionHeader Component */}
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

            {/* Hourly & Weekday Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hourly Activity */}
                <div className={cn("rounded-3xl border p-6", t$.card, t$.cardBorder)}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                            <Clock size={18} className="text-white" />
                        </div>
                        <span className={cn("font-semibold", t$.text)}>{t.hourlyActivity}</span>
                    </div>
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

                {/* Weekday Activity */}
                <div className={cn("rounded-3xl border p-6", t$.card, t$.cardBorder)}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                            <Calendar size={18} className="text-white" />
                        </div>
                        <span className={cn("font-semibold", t$.text)}>{t.weekdayActivity}</span>
                    </div>
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
            </div>

            {/* Platform Trends */}
            <div className={cn("rounded-3xl border p-6", t$.card, t$.cardBorder)}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <Layers size={18} className="text-white" />
                        </div>
                        <span className={cn("font-semibold", t$.text)}>{t.platformTrends}</span>
                    </div>
                    <span className={cn("text-xs", t$.textSub)}>30 days</span>
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
                            <Legend wrapperStyle={{ fontSize: '11px' }} formatter={(value) => <span className={t$.textMuted}>{value}</span>} />
                            <Area type="monotone" dataKey="youtube" stroke="#EF4444" strokeWidth={2} fill="url(#youtubeGrad)" />
                            <Area type="monotone" dataKey="instagram" stroke="#EC4899" strokeWidth={2} fill="url(#instaGrad)" />
                            <Area type="monotone" dataKey="threads" stroke="#3B82F6" strokeWidth={2} fill="url(#threadsGrad)" />
                            <Area type="monotone" dataKey="web" stroke="#21DBA4" strokeWidth={2} fill="url(#webGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Retention */}
            <div className={cn("rounded-3xl border p-6", t$.card, t$.cardBorder)}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <Activity size={18} className="text-white" />
                    </div>
                    <span className={cn("font-semibold", t$.text)}>{t.retention}</span>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {detailedAnalytics.retentionData.map((data) => (
                        <div key={data.week} className={cn("rounded-3xl p-5 text-center transition-all hover:scale-105", t$.itemBg)}>
                            <p className={cn("text-xs font-medium mb-2", t$.textSub)}>{data.week}</p>
                            <p className={cn("text-3xl font-bold tabular-nums", data.retention > 50 ? "text-[#21DBA4]" : data.retention > 25 ? "text-amber-500" : "text-red-500")}>
                                {data.retention}%
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
