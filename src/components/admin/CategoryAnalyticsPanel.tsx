import * as React from 'react';
import { useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import {
    Layers,
    Hash,
    RefreshCw,
    Loader2,
    TrendingUp,
    BarChart3
} from 'lucide-react';
import { cn } from '../ui/utils';

interface CategoryAnalyticsPanelProps {
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    admin: ReturnType<typeof useAdmin>;
}

export function CategoryAnalyticsPanel({ theme, language, admin }: CategoryAnalyticsPanelProps) {
    const { categoryAnalytics, fetchCategoryAnalytics } = admin;
    const [loading, setLoading] = React.useState(true);
    const [hasLoaded, setHasLoaded] = React.useState(false);
    const isDark = theme === 'dark';

    // Theme
    const card = isDark ? 'bg-[#161B22]' : 'bg-white';
    const cardBorder = isDark ? 'border-gray-800' : 'border-gray-200';
    const text = isDark ? 'text-white' : 'text-gray-900';
    const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
    const textSub = isDark ? 'text-gray-500' : 'text-gray-400';
    const itemBg = isDark ? 'bg-gray-900/50' : 'bg-gray-50';
    const itemHover = isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100';

    useEffect(() => {
        if (hasLoaded) return;
        const loadData = async () => {
            try { await fetchCategoryAnalytics(); }
            catch (error) { console.error('Failed to load category analytics:', error); }
            finally { setLoading(false); setHasLoaded(true); }
        };
        loadData();
    }, [hasLoaded, fetchCategoryAnalytics]);

    const t = {
        title: language === 'ko' ? '카테고리 분석' : 'Category Analytics',
        subtitle: language === 'ko' ? '카테고리 & 키워드 인사이트' : 'Category & keyword insights',
        refresh: language === 'ko' ? '새로고침' : 'Refresh',
        topCategories: language === 'ko' ? 'TOP 카테고리' : 'Top Categories',
        topKeywords: language === 'ko' ? '인기 키워드' : 'Popular Keywords',
        totalCategories: language === 'ko' ? '전체 카테고리' : 'Total Categories',
        avgPerUser: language === 'ko' ? '유저당 평균' : 'Avg per User',
        loading: language === 'ko' ? '로딩 중...' : 'Loading...',
        noData: language === 'ko' ? '데이터 없음' : 'No data',
        clips: language === 'ko' ? '클립' : 'clips'
    };

    const chartColors = ['#21DBA4', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981', '#6366F1', '#EC4899', '#14B8A6', '#F97316'];

    const handleRefresh = async () => {
        setLoading(true);
        try { await fetchCategoryAnalytics(); }
        catch (error) { console.error('Failed to refresh:', error); }
        finally { setLoading(false); }
    };

    if (loading || !categoryAnalytics) {
        return (
            <div className={cn("rounded-2xl border p-16 text-center", card, cardBorder)}>
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin mx-auto mb-4" />
                <p className={textMuted}>{t.loading}</p>
            </div>
        );
    }

    const topCategoriesData = categoryAnalytics.topCategories.slice(0, 10);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className={cn("text-2xl font-bold tracking-tight mb-1", text)}>{t.title}</h2>
                    <p className={cn("text-sm", textSub)}>{t.subtitle}</p>
                </div>
                <button onClick={handleRefresh} disabled={loading}
                    className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                        isDark ? "bg-white/5 text-gray-400 hover:bg-white/10" : "bg-black/5 text-gray-500 hover:bg-black/10")}>
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    {t.refresh}
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className={cn("rounded-2xl border p-5", card, cardBorder)}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                            <Layers size={20} className="text-white" />
                        </div>
                        <div>
                            <p className={cn("text-sm font-medium mb-0.5", textSub)}>{t.totalCategories}</p>
                            <p className={cn("text-3xl font-bold tracking-tight tabular-nums", text)}>
                                {categoryAnalytics.totalCategories.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
                <div className={cn("rounded-2xl border p-5", card, cardBorder)}>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
                            <TrendingUp size={20} className="text-white" />
                        </div>
                        <div>
                            <p className={cn("text-sm font-medium mb-0.5", textSub)}>{t.avgPerUser}</p>
                            <p className={cn("text-3xl font-bold tracking-tight tabular-nums", text)}>
                                {categoryAnalytics.avgCategoriesPerUser}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Categories Chart */}
            <div className={cn("rounded-2xl border p-6", card, cardBorder)}>
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#21DBA4] to-[#1bc290] flex items-center justify-center">
                        <BarChart3 size={18} className="text-white" />
                    </div>
                    <span className={cn("font-semibold", text)}>{t.topCategories}</span>
                </div>
                {topCategoriesData.length > 0 ? (
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={topCategoriesData} layout="vertical" margin={{ top: 0, right: 24, left: 8, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#27272a' : '#e5e7eb'} horizontal={true} vertical={false} />
                                <XAxis type="number" stroke={isDark ? '#52525b' : '#9ca3af'} fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis type="category" dataKey="name" stroke={isDark ? '#52525b' : '#9ca3af'} fontSize={12} width={100}
                                    tickLine={false} axisLine={false} tickFormatter={(v: string) => v.length > 14 ? v.slice(0, 14) + '…' : v} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: isDark ? '#1f2937' : '#fff',
                                        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                                        borderRadius: '10px', fontSize: '12px', padding: '8px 12px'
                                    }}
                                    cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}
                                    formatter={(value: number) => [`${value} ${t.clips}`, '']}
                                />
                                <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={20}>
                                    {topCategoriesData.map((_, index) => <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />)}
                                </Bar>
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p className={cn("text-center py-12", textSub)}>{t.noData}</p>
                )}
            </div>

            {/* Keywords */}
            <div className={cn("rounded-2xl border p-6", card, cardBorder)}>
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                        <Hash size={18} className="text-white" />
                    </div>
                    <span className={cn("font-semibold", text)}>{t.topKeywords}</span>
                </div>
                {categoryAnalytics.topKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {categoryAnalytics.topKeywords.slice(0, 30).map((kw, index) => (
                            <span key={kw.keyword}
                                className={cn("px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105", itemBg, itemHover, text)}
                                style={{ opacity: Math.max(0.6, 1 - index * 0.015) }}>
                                #{kw.keyword}
                                <span className={cn("ml-1.5 text-xs", textSub)}>{kw.count}</span>
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className={cn("text-center py-12", textSub)}>{t.noData}</p>
                )}
            </div>
        </div>
    );
}
