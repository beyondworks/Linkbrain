import * as React from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { RefreshCw } from 'lucide-react';
import { cn } from '../ui/utils';
import { StatCard } from '../shared/StatCard';
import { SectionHeader } from '../shared/SectionHeader';

interface ServiceStatsPanelProps {
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    admin: ReturnType<typeof useAdmin>;
}

/**
 * ServiceStatsPanel
 * 
 * Storybook AdminDashboard.stories.tsx ServiceStatsPanel 스토리 100% 반영:
 * - DAU/WAU/MAU 통계
 * - 플랫폼별 사용량 프로그레스 바
 */
export function ServiceStatsPanel({ theme, language, admin }: ServiceStatsPanelProps) {
    const { analytics, fetchAnalytics } = admin;
    const isDark = theme === 'dark';

    const t = {
        title: language === 'ko' ? '서비스 통계' : 'Service Stats',
        subtitle: language === 'ko' ? '실시간 서비스 현황' : 'Real-time metrics',
        refresh: language === 'ko' ? '새로고침' : 'Refresh',
        platformUsage: language === 'ko' ? '플랫폼별 사용량' : 'Platform Usage',
        thisWeek: language === 'ko' ? '이번 주' : 'this week',
        loading: language === 'ko' ? '데이터 로딩 중...' : 'Loading...'
    };

    if (!analytics) {
        return (
            <div className={cn(
                "p-6 rounded-3xl border text-center",
                isDark ? "bg-[#111113] border-gray-800 text-gray-500" : "bg-white border-slate-100 text-slate-400"
            )}>
                {t.loading}
            </div>
        );
    }

    const platformData = [
        { platform: 'YouTube', count: analytics.platformStats?.youtube || 0, color: '#FF0000' },
        { platform: 'Instagram', count: analytics.platformStats?.instagram || 0, color: '#E4405F' },
        { platform: 'Threads', count: analytics.platformStats?.threads || 0, color: isDark ? '#FFFFFF' : '#000000' },
        { platform: 'Web', count: analytics.platformStats?.web || 0, color: '#21DBA4' }
    ];

    const maxCount = Math.max(...platformData.map(p => p.count), 1);

    return (
        <div className={cn(
            "p-6 rounded-3xl border max-w-4xl",
            isDark ? "bg-[#111113] border-gray-800" : "bg-white border-slate-100"
        )}>
            <SectionHeader
                title={t.title}
                subtitle={t.subtitle}
                isDark={isDark}
                action={
                    <button
                        onClick={() => fetchAnalytics()}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-colors",
                            isDark
                                ? "text-gray-400 bg-gray-800 hover:bg-gray-700"
                                : "text-slate-500 bg-slate-50 hover:bg-slate-100"
                        )}
                    >
                        <RefreshCw size={14} />
                        {t.refresh}
                    </button>
                }
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="DAU" value={analytics.dau || 0} trend="+12%" trendUp={true} isDark={isDark} />
                <StatCard label="WAU" value={analytics.wau || 0} trend="+8%" trendUp={true} isDark={isDark} />
                <StatCard label="MAU" value={analytics.mau || 0} trend="+15%" trendUp={true} isDark={isDark} />
                <StatCard label="Retention" value="68%" trend="-2%" trendUp={false} isDark={isDark} />
            </div>

            {/* Platform Usage - Storybook Exact Pattern */}
            <div className={cn(
                "p-4 rounded-xl",
                isDark ? "bg-gray-900/50" : "bg-slate-50"
            )}>
                <h4 className={cn("font-medium mb-3", isDark ? "text-slate-200" : "text-slate-700")}>
                    {t.platformUsage}
                </h4>
                <div className="space-y-2">
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
