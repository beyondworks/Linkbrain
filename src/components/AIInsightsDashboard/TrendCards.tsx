import React from 'react';
import { cn } from '../ui/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendCardsProps {
    links: any[];
    theme: 'light' | 'dark';
    language: 'ko' | 'en';
    onKeywordClick?: (keyword: string) => void;
}

export const TrendCards: React.FC<TrendCardsProps> = ({
    links,
    theme,
    language,
    onKeywordClick,
}) => {
    const isDark = theme === 'dark';

    // --- Plus X Design Tokens ---
    const bgCard = isDark ? 'bg-[#111113]' : 'bg-white';
    const border = isDark ? 'border-white/[0.06]' : 'border-black/[0.05]';
    const textPrimary = isDark ? 'text-[#FAFAFA]' : 'text-[#111111]';
    const textSecondary = isDark ? 'text-[#A1A1AA]' : 'text-[#525252]';
    const textTertiary = isDark ? 'text-[#71717A]' : 'text-[#A3A3A3]';
    const hoverEffect = "transition-all duration-200 hover:border-black/[0.10] dark:hover:border-white/[0.10] hover:bg-black/[0.01] dark:hover:bg-white/[0.015]";

    // Analyze trends from tags over time
    const trendData = React.useMemo(() => {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        const recentTags: Record<string, number> = {};
        const olderTags: Record<string, number> = {};

        links.forEach(link => {
            let date: Date | null = null;
            if (link.createdAt?.seconds) {
                date = new Date(link.createdAt.seconds * 1000);
            } else if (link.createdAt?.toDate) {
                date = link.createdAt.toDate();
            } else if (link.createdAt) {
                date = new Date(link.createdAt);
            }

            if (date && isNaN(date.getTime())) date = null;
            const tags = link.tags || [];

            tags.forEach((tag: string) => {
                if (date && date >= weekAgo) {
                    recentTags[tag] = (recentTags[tag] || 0) + 1;
                } else if (date && date >= twoWeeksAgo) {
                    olderTags[tag] = (olderTags[tag] || 0) + 1;
                }
            });
        });

        // Calculate trend changes
        const allTags = new Set([...Object.keys(recentTags), ...Object.keys(olderTags)]);
        const trends: Array<{ tag: string; recent: number; older: number; change: number }> = [];

        allTags.forEach(tag => {
            const recent = recentTags[tag] || 0;
            const older = olderTags[tag] || 0;
            const change = older > 0 ? Math.round(((recent - older) / older) * 100) : (recent > 0 ? 100 : 0);
            trends.push({ tag, recent, older, change });
        });

        // Sort and split into rising/declining
        const rising = trends
            .filter(t => t.change > 0 && t.recent > 0)
            .sort((a, b) => b.change - a.change)
            .slice(0, 4);

        const declining = trends
            .filter(t => t.change < 0)
            .sort((a, b) => a.change - b.change)
            .slice(0, 4);

        return { rising, declining };
    }, [links]);

    const TrendItem = ({ tag, change, isRising }: { tag: string; change: number; isRising: boolean }) => (
        <button
            onClick={() => onKeywordClick?.(tag)}
            className={cn(
                "flex items-center justify-between w-full p-2.5 rounded-lg group",
                hoverEffect
            )}
        >
            <div className="flex items-center gap-2">
                <span className={cn(
                    "text-xs font-semibold px-1.5 py-0.5 rounded text-opacity-80",
                    isDark ? "bg-white/5 text-white" : "bg-black/5 text-black"
                )}>
                    #
                </span>
                <span className={cn("text-sm font-medium", textSecondary, "group-hover:text-primary transition-colors")}>
                    {tag}
                </span>
            </div>

            <div className="flex items-center gap-1">
                <span className={cn("text-xs font-bold tabular-nums", isRising ? "text-emerald-500" : "text-rose-500")}>
                    {isRising ? '+' : ''}{change}%
                </span>
                {isRising ? (
                    <TrendingUp size={12} className="text-emerald-500" />
                ) : (
                    <TrendingDown size={12} className="text-rose-500" />
                )}
            </div>
        </button>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rising Trends */}
            <div className={cn("rounded-2xl border p-6 flex flex-col h-full", bgCard, border)}>
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-md bg-emerald-500/10">
                        <TrendingUp size={16} className="text-emerald-500" />
                    </div>
                    <h3 className={cn("font-semibold text-sm", textPrimary)}>
                        {language === 'ko' ? '상승 트렌드' : 'Rising Trends'}
                    </h3>
                </div>

                <div className="flex-1 space-y-1">
                    {trendData.rising.length > 0 ? (
                        trendData.rising.map(item => (
                            <TrendItem key={item.tag} tag={item.tag} change={item.change} isRising={true} />
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                            <Minus className={cn("mb-2 opacity-50", textSecondary)} size={16} />
                            <p className={cn("text-xs", textSecondary)}>
                                {language === 'ko' ? '데이터 부족' : 'Not enough data'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Declining Trends */}
            <div className={cn("rounded-2xl border p-6 flex flex-col h-full", bgCard, border)}>
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-md bg-rose-500/10">
                        <TrendingDown size={16} className="text-rose-500" />
                    </div>
                    <h3 className={cn("font-semibold text-sm", textPrimary)}>
                        {language === 'ko' ? '하락 트렌드' : 'Declining Trends'}
                    </h3>
                </div>

                <div className="flex-1 space-y-1">
                    {trendData.declining.length > 0 ? (
                        trendData.declining.map(item => (
                            <TrendItem key={item.tag} tag={item.tag} change={item.change} isRising={false} />
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                            <Minus className={cn("mb-2 opacity-50", textSecondary)} size={16} />
                            <p className={cn("text-xs", textSecondary)}>
                                {language === 'ko' ? '데이터 부족' : 'Not enough data'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

