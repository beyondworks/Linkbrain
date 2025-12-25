import React from 'react';
import { Clock, Activity } from 'lucide-react';
import { cn } from '../ui/utils';

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

    // --- Plus X Design Tokens ---
    const bgCard = isDark ? 'bg-[#111113]' : 'bg-white';
    const border = isDark ? 'border-white/[0.06]' : 'border-black/[0.05]';
    const textPrimary = isDark ? 'text-[#FAFAFA]' : 'text-[#111111]';
    const textSecondary = isDark ? 'text-[#A1A1AA]' : 'text-[#525252]';
    const textTertiary = isDark ? 'text-[#71717A]' : 'text-[#A3A3A3]';

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
        if (count === 0) return isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]';
        const intensity = count / patternData.maxCount;
        if (intensity > 0.7) return 'bg-[#21DBA4]';
        if (intensity > 0.4) return isDark ? 'bg-[#21DBA4]/60' : 'bg-[#21DBA4]/50';
        if (intensity > 0.1) return isDark ? 'bg-[#21DBA4]/30' : 'bg-[#21DBA4]/25';
        return isDark ? 'bg-white/10' : 'bg-black/10';
    };

    // Hour labels (show every 4 hours)
    const hourLabels = [0, 4, 8, 12, 16, 20];

    return (
        <div className={cn("rounded-2xl border p-6 flex flex-col h-full", bgCard, border)}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", isDark ? "bg-white/[0.04]" : "bg-black/[0.03]")}>
                    <Clock size={16} className={textSecondary} />
                </div>
                <h3 className={cn("text-sm font-semibold", textPrimary)}>
                    {language === 'ko' ? '저장 패턴' : 'Save Pattern'}
                </h3>
            </div>

            {/* Heatmap */}
            <div className="overflow-x-auto flex-1 flex flex-col justify-center">
                <div className="min-w-[280px]">
                    {/* Hour labels */}
                    <div className="flex mb-2 pl-8">
                        {hourLabels.map(h => (
                            <div key={h} className={cn("text-[9px]", textTertiary)} style={{ width: `${100 / 6}%` }}>
                                {h}
                            </div>
                        ))}
                    </div>

                    {/* Grid rows */}
                    {patternData.days.map((day, dayIdx) => (
                        <div key={day} className="flex items-center gap-1.5 mb-1">
                            <span className={cn("w-7 text-[10px] shrink-0", textSecondary)}>
                                {day}
                            </span>
                            <div className="flex-1 flex gap-[2px]">
                                {patternData.grid[dayIdx].map((count, hourIdx) => (
                                    <div
                                        key={hourIdx}
                                        className={cn(
                                            "h-3 flex-1 rounded-[2px] transition-colors",
                                            getCellColor(count)
                                        )}
                                        title={`${day} ${hourIdx}:00 - ${count} ${language === 'ko' ? '개' : 'clips'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-1 mt-3 mb-2">
                <span className={cn("text-[9px]", textTertiary)}>
                    {language === 'ko' ? '적음' : 'Less'}
                </span>
                <div className={cn("w-2.5 h-2.5 rounded-[2px]", isDark ? "bg-white/[0.03]" : "bg-black/[0.03]")} />
                <div className={cn("w-2.5 h-2.5 rounded-[2px]", isDark ? "bg-[#21DBA4]/30" : "bg-[#21DBA4]/25")} />
                <div className={cn("w-2.5 h-2.5 rounded-[2px]", isDark ? "bg-[#21DBA4]/60" : "bg-[#21DBA4]/50")} />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-[#21DBA4]" />
                <span className={cn("text-[9px]", textTertiary)}>
                    {language === 'ko' ? '많음' : 'More'}
                </span>
            </div>

            {/* AI Comment */}
            <div className={cn(
                "mt-2 p-3 rounded-lg border flex items-start gap-3",
                isDark ? "bg-emerald-500/[0.03] border-emerald-500/10" : "bg-emerald-500/[0.03] border-emerald-500/10"
            )}>
                <Activity size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <p className={cn("text-xs leading-relaxed", textSecondary)}>
                    {aiComment}
                </p>
            </div>
        </div>
    );
};
