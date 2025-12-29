import * as React from 'react';
import { useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { RefreshCw, Loader2 } from 'lucide-react';
import { cn } from '../ui/utils';
import { SectionHeader } from '../shared/SectionHeader';

interface CategoryAnalyticsPanelProps {
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    admin: ReturnType<typeof useAdmin>;
}

/**
 * CategoryAnalyticsPanel - Storybook Style (스크린샷 3번 참조)
 * 
 * 구성:
 * 1. 상단 2열 Stat 카드 (트렌드 표시)
 * 2. Top 10 카테고리 - 랭킹 넘버 + 바 게이지 + 클립 수
 * 3. 인기 키워드 - #태그 pill 스타일
 */
export function CategoryAnalyticsPanel({ theme, language, admin }: CategoryAnalyticsPanelProps) {
    const { categoryAnalytics, fetchCategoryAnalytics } = admin;
    const [loading, setLoading] = React.useState(true);
    const [hasLoaded, setHasLoaded] = React.useState(false);
    const isDark = theme === 'dark';

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
        subtitle: language === 'ko' ? '사용자 카테고리 통계' : 'User category statistics',
        refresh: language === 'ko' ? '새로고침' : 'Refresh',
        topCategories: language === 'ko' ? 'TOP 10 카테고리' : 'TOP 10 Categories',
        topKeywords: language === 'ko' ? '인기 키워드' : 'Popular Keywords',
        totalCategories: language === 'ko' ? '총 카테고리' : 'Total Categories',
        avgPerUser: language === 'ko' ? '유저당 평균' : 'Avg per User',
        loading: language === 'ko' ? '로딩 중...' : 'Loading...',
        noData: language === 'ko' ? '데이터 없음' : 'No data',
        thisWeek: language === 'ko' ? '이번 주' : 'this week'
    };

    const handleRefresh = async () => {
        setLoading(true);
        try { await fetchCategoryAnalytics(); }
        catch (error) { console.error('Failed to refresh:', error); }
        finally { setLoading(false); }
    };

    if (loading || !categoryAnalytics) {
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

    const topCategoriesData = categoryAnalytics.topCategories.slice(0, 10);
    const maxCount = topCategoriesData.length > 0 ? Math.max(...topCategoriesData.map(c => c.count)) : 1;

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

            {/* Stats Row - Storybook Style with Trend */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Total Categories */}
                <div className={cn(
                    "rounded-3xl border p-6",
                    isDark ? "bg-[#111113] border-gray-800" : "bg-white border-slate-100"
                )}>
                    <p className={cn("text-sm mb-2", isDark ? "text-gray-500" : "text-slate-500")}>{t.totalCategories}</p>
                    <p className={cn("text-4xl font-bold mb-1", isDark ? "text-white" : "text-slate-900")}>
                        {categoryAnalytics.totalCategories.toLocaleString()}
                    </p>
                    <p className="text-sm text-[#21DBA4]">+8% {t.thisWeek}</p>
                </div>

                {/* Avg per User */}
                <div className={cn(
                    "rounded-3xl border p-6",
                    isDark ? "bg-[#111113] border-gray-800" : "bg-white border-slate-100"
                )}>
                    <p className={cn("text-sm mb-2", isDark ? "text-gray-500" : "text-slate-500")}>{t.avgPerUser}</p>
                    <p className={cn("text-4xl font-bold mb-1", isDark ? "text-white" : "text-slate-900")}>
                        {categoryAnalytics.avgCategoriesPerUser}
                    </p>
                    <p className="text-sm text-[#21DBA4]">+3% {t.thisWeek}</p>
                </div>
            </div>

            {/* Top 10 Categories - Storybook Bar Gauge Style */}
            <div className={cn(
                "rounded-3xl border p-6",
                isDark ? "bg-[#111113] border-gray-800" : "bg-white border-slate-100"
            )}>
                <h3 className={cn("text-base font-bold mb-6", isDark ? "text-white" : "text-slate-900")}>
                    {t.topCategories}
                </h3>
                {topCategoriesData.length > 0 ? (
                    <div className="space-y-4">
                        {topCategoriesData.map((cat, index) => (
                            <div key={cat.name} className="flex items-center gap-4">
                                {/* Rank Number */}
                                <span className={cn(
                                    "w-6 text-sm font-medium",
                                    isDark ? "text-gray-500" : "text-slate-500"
                                )}>
                                    #{index + 1}
                                </span>

                                {/* Category Name */}
                                <span className={cn(
                                    "w-24 text-sm font-medium truncate",
                                    isDark ? "text-white" : "text-slate-800"
                                )}>
                                    {cat.name}
                                </span>

                                {/* Bar Gauge */}
                                <div className="flex-1 h-3 bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#21DBA4] rounded-full transition-all duration-500"
                                        style={{ width: `${(cat.count / maxCount) * 100}%` }}
                                    />
                                </div>

                                {/* Count */}
                                <span className={cn(
                                    "w-16 text-sm font-semibold text-right tabular-nums",
                                    isDark ? "text-white" : "text-slate-800"
                                )}>
                                    {cat.count.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={cn("text-center py-12", isDark ? "text-gray-500" : "text-slate-400")}>{t.noData}</p>
                )}
            </div>

            {/* Popular Keywords - Storybook Pill Style */}
            <div className={cn(
                "rounded-3xl border p-6",
                isDark ? "bg-[#111113] border-gray-800" : "bg-white border-slate-100"
            )}>
                <h3 className={cn("text-base font-bold mb-6", isDark ? "text-white" : "text-slate-900")}>
                    {t.topKeywords}
                </h3>
                {categoryAnalytics.topKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {categoryAnalytics.topKeywords.slice(0, 20).map((kw) => (
                            <span
                                key={kw.keyword}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                                    isDark
                                        ? "bg-gray-800/50 border-gray-700 text-white hover:bg-gray-800"
                                        : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50"
                                )}
                            >
                                #{kw.keyword}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className={cn("text-center py-12", isDark ? "text-gray-500" : "text-slate-400")}>{t.noData}</p>
                )}
            </div>
        </div>
    );
}
