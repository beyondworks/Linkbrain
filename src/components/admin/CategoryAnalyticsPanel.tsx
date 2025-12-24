import * as React from 'react';
import { useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import {
    Tag,
    Hash,
    RefreshCw,
    TrendingUp,
    Loader2
} from 'lucide-react';

interface CategoryAnalyticsPanelProps {
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    admin: ReturnType<typeof useAdmin>;
}

export function CategoryAnalyticsPanel({ theme, language, admin }: CategoryAnalyticsPanelProps) {
    const { categoryAnalytics, fetchCategoryAnalytics } = admin;
    const [loading, setLoading] = React.useState(true);
    const [hasLoaded, setHasLoaded] = React.useState(false);

    useEffect(() => {
        if (hasLoaded) return;
        const loadData = async () => {
            try {
                await fetchCategoryAnalytics();
            } catch (error) {
                console.error('Failed to load category analytics:', error);
            } finally {
                setLoading(false);
                setHasLoaded(true);
            }
        };
        loadData();
    }, [hasLoaded, fetchCategoryAnalytics]);

    const t = {
        title: language === 'ko' ? '카테고리 분석' : 'Category Analytics',
        refresh: language === 'ko' ? '새로고침' : 'Refresh',
        topCategories: language === 'ko' ? '인기 카테고리 TOP 10' : 'Top 10 Categories',
        topKeywords: language === 'ko' ? '인기 키워드' : 'Top Keywords',
        totalCategories: language === 'ko' ? '전체 카테고리' : 'Total Categories',
        avgPerUser: language === 'ko' ? '유저당 평균' : 'Avg per User',
        loading: language === 'ko' ? '데이터 로딩 중...' : 'Loading data...',
        noData: language === 'ko' ? '데이터가 없습니다' : 'No data available',
        clips: language === 'ko' ? '클립' : 'clips'
    };

    const cardBg = theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
    const textPrimary = theme === 'dark' ? 'text-white' : 'text-slate-900';
    const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

    const chartColors = [
        '#21DBA4', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444',
        '#10B981', '#6366F1', '#EC4899', '#14B8A6', '#F97316'
    ];

    const handleRefresh = async () => {
        setLoading(true);
        try {
            await fetchCategoryAnalytics();
        } catch (error) {
            console.error('Failed to refresh category analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !categoryAnalytics) {
        return (
            <div className={`rounded-xl border p-12 text-center ${cardBg}`}>
                <Loader2 className="w-8 h-8 animate-spin text-[#21DBA4] mx-auto mb-3" />
                <p className={textSecondary}>{t.loading}</p>
            </div>
        );
    }

    const topCategoriesData = categoryAnalytics.topCategories.slice(0, 10);

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

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className={`rounded-xl border p-5 ${cardBg}`}>
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'} text-purple-500`}>
                            <Tag size={20} />
                        </div>
                        <span className={`text-sm font-medium ${textSecondary}`}>{t.totalCategories}</span>
                    </div>
                    <p className={`text-3xl font-bold ${textPrimary}`}>
                        {categoryAnalytics.totalCategories.toLocaleString()}
                    </p>
                </div>
                <div className={`rounded-xl border p-5 ${cardBg}`}>
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'} text-blue-500`}>
                            <TrendingUp size={20} />
                        </div>
                        <span className={`text-sm font-medium ${textSecondary}`}>{t.avgPerUser}</span>
                    </div>
                    <p className={`text-3xl font-bold ${textPrimary}`}>
                        {categoryAnalytics.avgCategoriesPerUser}
                    </p>
                </div>
            </div>

            {/* Top Categories Chart */}
            <div className={`rounded-xl border p-5 ${cardBg}`}>
                <h3 className={`text-sm font-bold mb-4 ${textSecondary}`}>{t.topCategories}</h3>
                {topCategoriesData.length > 0 ? (
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={topCategoriesData}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                                <XAxis type="number" stroke={theme === 'dark' ? '#94a3b8' : '#64748b'} fontSize={12} />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    stroke={theme === 'dark' ? '#94a3b8' : '#64748b'}
                                    fontSize={12}
                                    width={75}
                                    tickFormatter={(value: string) => value.length > 10 ? value.slice(0, 10) + '...' : value}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                                        border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
                                        borderRadius: '8px',
                                        color: theme === 'dark' ? '#fff' : '#1e293b'
                                    }}
                                    formatter={(value: number) => [`${value} ${t.clips}`, '']}
                                />
                                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                    {topCategoriesData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p className={`text-center py-8 ${textSecondary}`}>{t.noData}</p>
                )}
            </div>

            {/* Top Keywords */}
            <div className={`rounded-xl border p-5 ${cardBg}`}>
                <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${textSecondary}`}>
                    <Hash size={16} />
                    {t.topKeywords}
                </h3>
                {categoryAnalytics.topKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {categoryAnalytics.topKeywords.map((kw, index) => (
                            <span
                                key={kw.keyword}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'
                                    } ${textPrimary}`}
                                style={{
                                    opacity: 1 - (index * 0.02),
                                    fontSize: `${Math.max(12, 16 - index * 0.3)}px`
                                }}
                            >
                                #{kw.keyword}
                                <span className={`ml-1.5 text-xs ${textSecondary}`}>{kw.count}</span>
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className={`text-center py-8 ${textSecondary}`}>{t.noData}</p>
                )}
            </div>
        </div>
    );
}
