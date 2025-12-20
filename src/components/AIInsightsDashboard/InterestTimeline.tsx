import React from 'react';

interface InterestTimelineProps {
    links: any[];
    theme: 'light' | 'dark';
    language: 'ko' | 'en';
    onPeriodClick?: (period: string, clips: any[]) => void;
}

export const InterestTimeline: React.FC<InterestTimelineProps> = ({
    links,
    theme,
    language,
    onPeriodClick,
}) => {
    const isDark = theme === 'dark';

    // Analyze interest evolution over 4 weeks
    const evolutionData = React.useMemo(() => {
        const now = new Date();
        const periods = [
            { label: language === 'ko' ? '4주 전' : '4 weeks ago', start: 28, end: 21 },
            { label: language === 'ko' ? '2주 전' : '2 weeks ago', start: 14, end: 7 },
            { label: language === 'ko' ? '현재' : 'Now', start: 7, end: 0 },
        ];

        return periods.map(period => {
            const startDate = new Date(now.getTime() - period.start * 24 * 60 * 60 * 1000);
            const endDate = new Date(now.getTime() - period.end * 24 * 60 * 60 * 1000);

            const periodClips = links.filter(link => {
                let date: Date | null = null;
                if (link.createdAt?.seconds) {
                    date = new Date(link.createdAt.seconds * 1000);
                } else if (link.createdAt?.toDate) {
                    date = link.createdAt.toDate();
                } else if (link.createdAt) {
                    date = new Date(link.createdAt);
                }
                if (date && isNaN(date.getTime())) date = null;
                return date && date >= startDate && date < endDate;
            });

            // Get top tags for this period
            const tagCounts: Record<string, number> = {};
            periodClips.forEach(clip => {
                (clip.tags || []).forEach((tag: string) => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            });

            const topTags = Object.entries(tagCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([tag]) => tag);

            return {
                ...period,
                clips: periodClips,
                topTags,
                count: periodClips.length,
            };
        });
    }, [links, language]);

    // Generate AI insight
    const aiInsight = React.useMemo(() => {
        const current = evolutionData[2]?.topTags || [];
        const past = evolutionData[0]?.topTags || [];

        if (current.length === 0) {
            return language === 'ko'
                ? '최근 데이터가 충분하지 않습니다.'
                : 'Not enough recent data.';
        }

        const newTopics = current.filter(t => !past.includes(t));
        if (newTopics.length > 0) {
            return language === 'ko'
                ? `관심사가 '${past[0] || '탐색'}' 에서 '${current[0]}' 으로 이동했습니다.`
                : `Interest shifted from '${past[0] || 'exploration'}' to '${current[0]}'.`;
        }

        return language === 'ko'
            ? `'${current[0]}' 주제에 꾸준한 관심을 유지하고 있습니다.`
            : `Maintaining steady interest in '${current[0]}'.`;
    }, [evolutionData, language]);

    return (
        <div className={`rounded-xl p-4 md:p-5 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#21DBA4]">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                </div>
                <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {language === 'ko' ? '관심사 변화' : 'Interest Evolution'}
                </h3>
            </div>

            {/* Timeline */}
            <div className="relative">
                {/* Vertical line */}
                <div className={`absolute left-3 top-3 bottom-3 w-0.5 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />

                <div className="space-y-4">
                    {evolutionData.map((period, idx) => (
                        <button
                            key={idx}
                            onClick={() => onPeriodClick?.(period.label, period.clips)}
                            className={`relative flex items-start gap-3 w-full text-left p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'
                                }`}
                        >
                            {/* Dot */}
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${idx === evolutionData.length - 1
                                ? 'bg-[#21DBA4]'
                                : isDark ? 'bg-slate-700' : 'bg-slate-200'
                                }`}>
                                <div className={`w-2 h-2 rounded-full ${idx === evolutionData.length - 1 ? 'bg-white' : 'bg-[#21DBA4]'
                                    }`} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                        {period.label}
                                    </span>
                                    <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {period.count} {language === 'ko' ? '개' : 'clips'}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {period.topTags.length > 0 ? (
                                        period.topTags.map(tag => (
                                            <span
                                                key={tag}
                                                className={`text-[10px] px-1.5 py-0.5 rounded ${idx === evolutionData.length - 1
                                                    ? 'bg-[#21DBA4]/10 text-[#21DBA4]'
                                                    : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
                                                    }`}
                                            >
                                                {tag}
                                            </span>
                                        ))
                                    ) : (
                                        <span className={`text-[10px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                                            {language === 'ko' ? '데이터 없음' : 'No data'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* AI Insight */}
            <div className={`mt-4 p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {aiInsight}
                </p>
            </div>
        </div>
    );
};
