import React from 'react';

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
            className={`flex items-center justify-between p-2 rounded-lg transition-all hover:scale-[1.01] ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'
                }`}
        >
            <span className={`text-xs font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                {tag}
            </span>
            <span className={`text-xs font-bold ${isRising ? 'text-[#21DBA4]' : 'text-rose-500'}`}>
                {isRising ? '+' : ''}{change}%
            </span>
        </button>
    );

    return (
        <div className={`rounded-xl p-4 md:p-5 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#21DBA4]">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                        <polyline points="17 6 23 6 23 12" />
                    </svg>
                </div>
                <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {language === 'ko' ? '관심사 트렌드' : 'Interest Trends'}
                </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {/* Rising */}
                <div>
                    <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-4 h-4 rounded-full bg-[#21DBA4]/20 flex items-center justify-center">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#21DBA4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="18 15 12 9 6 15" />
                            </svg>
                        </div>
                        <span className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {language === 'ko' ? '상승' : 'Rising'}
                        </span>
                    </div>
                    <div className="space-y-1">
                        {trendData.rising.length > 0 ? (
                            trendData.rising.map(item => (
                                <TrendItem key={item.tag} tag={item.tag} change={item.change} isRising={true} />
                            ))
                        ) : (
                            <p className={`text-[10px] p-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {language === 'ko' ? '데이터 부족' : 'Not enough data'}
                            </p>
                        )}
                    </div>
                </div>

                {/* Declining */}
                <div>
                    <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-4 h-4 rounded-full bg-rose-500/20 flex items-center justify-center">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </div>
                        <span className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {language === 'ko' ? '감소' : 'Declining'}
                        </span>
                    </div>
                    <div className="space-y-1">
                        {trendData.declining.length > 0 ? (
                            trendData.declining.map(item => (
                                <TrendItem key={item.tag} tag={item.tag} change={item.change} isRising={false} />
                            ))
                        ) : (
                            <p className={`text-[10px] p-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {language === 'ko' ? '데이터 부족' : 'Not enough data'}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
