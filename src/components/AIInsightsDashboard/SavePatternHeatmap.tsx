import React from 'react';

interface SavePatternHeatmapProps {
    links: any[];
    theme: 'light' | 'dark';
    language: 'ko' | 'en';
}

export const SavePatternHeatmap: React.FC<SavePatternHeatmapProps> = ({
    links,
    theme,
    language,
}) => {
    const isDark = theme === 'dark';

    // Analyze save patterns by day and hour
    const patternData = React.useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const daysKo = ['일', '월', '화', '수', '목', '금', '토'];
        const hours = Array.from({ length: 24 }, (_, i) => i);

        // Initialize grid
        const grid: number[][] = days.map(() => hours.map(() => 0));

        // Count saves by day/hour
        links.forEach(link => {
            if (link.createdAt) {
                let date: Date | null = null;

                // Handle Firestore Timestamp
                if (link.createdAt?.seconds) {
                    date = new Date(link.createdAt.seconds * 1000);
                } else if (link.createdAt?.toDate) {
                    date = link.createdAt.toDate();
                } else if (typeof link.createdAt === 'string' || typeof link.createdAt === 'number') {
                    date = new Date(link.createdAt);
                }

                if (date && !isNaN(date.getTime())) {
                    const day = date.getDay();
                    const hour = date.getHours();
                    if (day >= 0 && day < 7 && hour >= 0 && hour < 24) {
                        grid[day][hour]++;
                    }
                }
            }
        });

        // Find max for normalization
        const maxCount = Math.max(...grid.flat(), 1);

        // Peak analysis
        let peakDay = 0, peakHour = 0, peakCount = 0;
        const dayTotals = days.map(() => 0);
        const hourTotals = hours.map(() => 0);

        grid.forEach((row, d) => {
            row.forEach((count, h) => {
                dayTotals[d] += count;
                hourTotals[h] += count;
                if (count > peakCount) {
                    peakCount = count;
                    peakDay = d;
                    peakHour = h;
                }
            });
        });

        // Find busiest day and hour range
        const busiestDay = dayTotals.indexOf(Math.max(...dayTotals));
        const eveningTotal = hourTotals.slice(18, 24).reduce((a, b) => a + b, 0);
        const morningTotal = hourTotals.slice(6, 12).reduce((a, b) => a + b, 0);
        const afternoonTotal = hourTotals.slice(12, 18).reduce((a, b) => a + b, 0);

        const timeOfDay = eveningTotal > morningTotal && eveningTotal > afternoonTotal
            ? 'evening'
            : morningTotal > afternoonTotal
                ? 'morning'
                : 'afternoon';

        return {
            grid,
            maxCount,
            days: language === 'ko' ? daysKo : days,
            hours,
            busiestDay: language === 'ko' ? daysKo[busiestDay] : days[busiestDay],
            timeOfDay,
            peakHour,
        };
    }, [links, language]);

    // Generate AI comment
    const aiComment = React.useMemo(() => {
        const { busiestDay, timeOfDay, peakHour } = patternData;
        const timeLabels: Record<string, Record<'morning' | 'afternoon' | 'evening', string>> = {
            ko: { morning: '오전', afternoon: '오후', evening: '저녁' },
            en: { morning: 'morning', afternoon: 'afternoon', evening: 'evening' },
        };
        const hourRange = peakHour >= 21 ? '21~23' : peakHour >= 18 ? '18~20' : peakHour >= 15 ? '15~17' : peakHour >= 12 ? '12~14' : peakHour >= 9 ? '9~11' : '6~8';
        const timeLabel = timeLabels[language][timeOfDay as 'morning' | 'afternoon' | 'evening'];

        if (language === 'ko') {
            return `주로 ${busiestDay}요일 ${timeLabel} ${hourRange}시에 집중적으로 저장합니다. 업무 중 탐색 후 정리하는 패턴입니다.`;
        }
        return `You primarily save on ${busiestDay}s during ${timeLabel} hours (${hourRange}). Exploration during work, organizing after.`;
    }, [patternData, language]);

    // Get cell color based on intensity
    const getCellColor = (count: number) => {
        if (count === 0) return isDark ? 'bg-slate-800' : 'bg-slate-100';
        const intensity = count / patternData.maxCount;
        if (intensity > 0.7) return 'bg-[#21DBA4]';
        if (intensity > 0.4) return isDark ? 'bg-[#21DBA4]/60' : 'bg-[#21DBA4]/50';
        if (intensity > 0.1) return isDark ? 'bg-[#21DBA4]/30' : 'bg-[#21DBA4]/25';
        return isDark ? 'bg-slate-700' : 'bg-slate-200';
    };

    // Hour labels (show every 4 hours)
    const hourLabels = [0, 4, 8, 12, 16, 20];

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
                    {language === 'ko' ? '저장 패턴' : 'Save Pattern'}
                </h3>
            </div>

            {/* Heatmap */}
            <div className="overflow-x-auto">
                <div className="min-w-[280px]">
                    {/* Hour labels */}
                    <div className="flex mb-1 pl-8">
                        {hourLabels.map(h => (
                            <div key={h} className={`text-[9px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`} style={{ width: `${100 / 6}%` }}>
                                {h}
                            </div>
                        ))}
                    </div>

                    {/* Grid rows */}
                    {patternData.days.map((day, dayIdx) => (
                        <div key={day} className="flex items-center gap-1 mb-0.5">
                            <span className={`w-7 text-[10px] shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                {day}
                            </span>
                            <div className="flex-1 flex gap-px">
                                {patternData.grid[dayIdx].map((count, hourIdx) => (
                                    <div
                                        key={hourIdx}
                                        className={`h-3 flex-1 rounded-sm transition-colors ${getCellColor(count)}`}
                                        title={`${day} ${hourIdx}:00 - ${count} ${language === 'ko' ? '개' : 'clips'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-1 mt-2">
                <span className={`text-[9px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {language === 'ko' ? '적음' : 'Less'}
                </span>
                <div className={`w-3 h-3 rounded-sm ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`} />
                <div className={`w-3 h-3 rounded-sm ${isDark ? 'bg-[#21DBA4]/30' : 'bg-[#21DBA4]/25'}`} />
                <div className={`w-3 h-3 rounded-sm ${isDark ? 'bg-[#21DBA4]/60' : 'bg-[#21DBA4]/50'}`} />
                <div className="w-3 h-3 rounded-sm bg-[#21DBA4]" />
                <span className={`text-[9px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {language === 'ko' ? '많음' : 'More'}
                </span>
            </div>

            {/* AI Comment */}
            <div className={`mt-4 p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#21DBA4] flex items-center justify-center shrink-0 mt-0.5">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {aiComment}
                    </p>
                </div>
            </div>
        </div>
    );
};
