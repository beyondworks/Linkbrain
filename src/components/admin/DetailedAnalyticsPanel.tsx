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
    Activity
} from 'lucide-react';

interface DetailedAnalyticsPanelProps {
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    admin: ReturnType<typeof useAdmin>;
}

export function DetailedAnalyticsPanel({ theme, language, admin }: DetailedAnalyticsPanelProps) {
    const { detailedAnalytics, fetchDetailedAnalytics } = admin;
    const [loading, setLoading] = React.useState(true);
    const [hasLoaded, setHasLoaded] = React.useState(false);

    useEffect(() => {
        if (hasLoaded) return;
        const loadData = async () => {
            try {
                await fetchDetailedAnalytics();
            } catch (error) {
                console.error('Failed to load detailed analytics:', error);
            } finally {
                setLoading(false);
                setHasLoaded(true);
            }
        };
        loadData();
    }, [hasLoaded, fetchDetailedAnalytics]);

    const t = {
        title: language === 'ko' ? '상세 분석' : 'Detailed Analytics',
        refresh: language === 'ko' ? '새로고침' : 'Refresh',
        hourlyActivity: language === 'ko' ? '시간대별 활동' : 'Hourly Activity',
        weekdayActivity: language === 'ko' ? '요일별 활동' : 'Weekly Activity',
        platformTrends: language === 'ko' ? '플랫폼별 추이 (30일)' : 'Platform Trends (30 days)',
        retention: language === 'ko' ? '주간 리텐션' : 'Weekly Retention',
        loading: language === 'ko' ? '데이터 로딩 중...' : 'Loading data...',
        noData: language === 'ko' ? '데이터가 없습니다' : 'No data available',
        clips: language === 'ko' ? '클립' : 'clips'
    };

    const cardBg = theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
    const textPrimary = theme === 'dark' ? 'text-white' : 'text-slate-900';
    const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

    const handleRefresh = async () => {
        setLoading(true);
        try {
            await fetchDetailedAnalytics();
        } catch (error) {
            console.error('Failed to refresh detailed analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !detailedAnalytics) {
        return (
            <div className={`rounded-xl border p-12 text-center ${cardBg}`}>
                <Loader2 className="w-8 h-8 animate-spin text-[#21DBA4] mx-auto mb-3" />
                <p className={textSecondary}>{t.loading}</p>
            </div>
        );
    }

    const hourlyData = detailedAnalytics.hourlyActivity.map(h => ({
        ...h,
        label: `${h.hour}:00`
    }));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className={`text-xl font-bold ${textPrimary}`}>{t.title}</h2>
                <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${theme === 'dark'
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    {t.refresh}
                </button>
            </div>

            {/* Hourly Activity */}
            <div className={`rounded-xl border p-5 ${cardBg}`}>
                <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${textSecondary}`}>
                    <Clock size={16} />
                    {t.hourlyActivity}
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={hourlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                            <XAxis
                                dataKey="label"
                                stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
                                fontSize={10}
                                interval={2}
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
                            <Bar dataKey="count" fill="#21DBA4" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Weekday Activity */}
            <div className={`rounded-xl border p-5 ${cardBg}`}>
                <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${textSecondary}`}>
                    <Calendar size={16} />
                    {t.weekdayActivity}
                </h3>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={detailedAnalytics.weekdayActivity} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                            <XAxis dataKey="day" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={12} />
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
                            <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Platform Trends */}
            <div className={`rounded-xl border p-5 ${cardBg}`}>
                <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${textSecondary}`}>
                    <TrendingUp size={16} />
                    {t.platformTrends}
                </h3>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={detailedAnalytics.platformTrends} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
                            />
                            <Legend />
                            <Area type="monotone" dataKey="youtube" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                            <Area type="monotone" dataKey="instagram" stackId="1" stroke="#EC4899" fill="#EC4899" fillOpacity={0.6} />
                            <Area type="monotone" dataKey="threads" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                            <Area type="monotone" dataKey="web" stackId="1" stroke="#21DBA4" fill="#21DBA4" fillOpacity={0.6} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Retention */}
            <div className={`rounded-xl border p-5 ${cardBg}`}>
                <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${textSecondary}`}>
                    <Activity size={16} />
                    {t.retention}
                </h3>
                <div className="grid grid-cols-4 gap-4">
                    {detailedAnalytics.retentionData.map((data, index) => (
                        <div
                            key={data.week}
                            className={`rounded-lg p-4 text-center ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}
                        >
                            <p className={`text-xs font-medium mb-1 ${textSecondary}`}>{data.week}</p>
                            <p className={`text-2xl font-bold ${data.retention > 50 ? 'text-[#21DBA4]' : data.retention > 25 ? 'text-yellow-500' : 'text-red-500'}`}>
                                {data.retention}%
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
