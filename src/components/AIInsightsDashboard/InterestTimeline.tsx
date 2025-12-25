import React from 'react';
import { Clock, ChevronRight, TrendingUp } from 'lucide-react';
import { cn } from '../ui/utils';

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

    // --- Plus X Design Tokens ---
    const bgCard = isDark ? 'bg-[#111113]' : 'bg-white';
    const border = isDark ? 'border-white/[0.06]' : 'border-black/[0.05]';
    const textPrimary = isDark ? 'text-[#FAFAFA]' : 'text-[#111111]';
    const textSecondary = isDark ? 'text-[#A1A1AA]' : 'text-[#525252]';
    const textTertiary = isDark ? 'text-[#71717A]' : 'text-[#A3A3A3]';
    const hoverEffect = "transition-all duration-200 hover:bg-black/[0.015] dark:hover:bg-white/[0.02]";

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
        <div className={cn("rounded-2xl border p-6 flex flex-col h-full", bgCard, border)}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", isDark ? "bg-white/[0.04]" : "bg-black/[0.03]")}>
                    <Clock size={16} className={textSecondary} />
                </div>
                <h3 className={cn("text-sm font-semibold", textPrimary)}>
                    {language === 'ko' ? '관심사 변화' : 'Interest Evolution'}
                </h3>
            </div>

            {/* Timeline */}
            <div className="relative flex-1 pl-2">
                {/* Vertical line */}
                <div className={cn("absolute left-5 top-4 bottom-8 w-px", isDark ? "bg-white/[0.06]" : "bg-black/[0.06]")} />

                <div className="space-y-6">
                    {evolutionData.map((period, idx) => {
                        const isLast = idx === evolutionData.length - 1;
                        return (
                            <button
                                key={idx}
                                onClick={() => onPeriodClick?.(period.label, period.clips)}
                                className={cn(
                                    "relative flex items-start gap-4 w-full text-left p-2 -ml-2 rounded-lg transition-all group",
                                    hoverEffect
                                )}
                            >
                                {/* Dot */}
                                <div className={cn(
                                    "w-4 h-4 rounded-full flex items-center justify-center shrink-0 z-10 my-0.5 ring-4",
                                    isDark ? "ring-[#121214]" : "ring-white",
                                    isLast
                                        ? "bg-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.2)]"
                                        : isDark ? "bg-white/10" : "bg-black/10"
                                )}>
                                    {isLast && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={cn(
                                            "text-xs font-semibold",
                                            isLast ? textPrimary : textSecondary
                                        )}>
                                            {period.label}
                                        </span>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className={cn("text-[10px]", textTertiary)}>{period.count} items</span>
                                            <ChevronRight size={12} className={textTertiary} />
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {period.topTags.length > 0 ? (
                                            period.topTags.map(tag => (
                                                <span
                                                    key={tag}
                                                    className={cn(
                                                        "text-[10px] px-2 py-0.5 rounded-full border transition-colors",
                                                        isLast
                                                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                                            : isDark ? "bg-white/5 border-white/5 text-slate-400" : "bg-white border-black/5 text-slate-500"
                                                    )}
                                                >
                                                    {tag}
                                                </span>
                                            ))
                                        ) : (
                                            <span className={cn("text-[10px] italic", textTertiary)}>
                                                {language === 'ko' ? '데이터 없음' : 'No data'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* AI Insight */}
            <div className={cn(
                "mt-4 p-3 rounded-lg border flex items-start gap-3",
                isDark ? "bg-emerald-500/[0.03] border-emerald-500/10" : "bg-emerald-500/[0.03] border-emerald-500/10"
            )}>
                <TrendingUp size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <p className={cn("text-xs leading-relaxed", textSecondary)}>
                    {aiInsight}
                </p>
            </div>
        </div>
    );
};
