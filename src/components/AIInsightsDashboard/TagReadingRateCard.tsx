import React from 'react';
import { Zap } from 'lucide-react';
import { cn } from '../ui/utils';
import { SectionHeaderCompact } from './SectionHeader';

// ═══════════════════════════════════════════════════
// TagReadingRateCard - Bar Gauge Style (Storybook Pattern)
// Pattern: Custom Component > AI Insights > TagReadingRate
// ═══════════════════════════════════════════════════

interface TagReadingRateCardProps {
    tagData: Array<{ tag: string; rate: number; total: number }>;
    isDark: boolean;
    theme: {
        card: string;
        cardBorder: string;
        cardBorderStyle?: React.CSSProperties;
        cardHover: string;
        text: string;
        textSub: string;
    };
    language: 'en' | 'ko';
}

// Bar Gauge Component (Storybook Pattern)
const BarGauge = ({
    label,
    percentage,
    isDark,
    theme
}: {
    label: string;
    percentage: number;
    isDark: boolean;
    theme: { text: string };
}) => {
    const intensity = 0.3 + (percentage / 100) * 0.7;

    return (
        <div className="flex items-center gap-4">
            <span className={cn(
                "text-sm font-semibold w-20 shrink-0",
                theme.text
            )}>
                {label}
            </span>
            <div className="flex-1 flex items-center gap-3">
                <div className={cn(
                    "flex-1 h-3 rounded-full overflow-hidden",
                    isDark ? "bg-gray-700" : "bg-gray-200"
                )}>
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${Math.max(percentage, 3)}%`,
                            backgroundColor: `rgba(33, 219, 164, ${intensity})`
                        }}
                    />
                </div>
                <span className={cn(
                    "text-sm font-bold tabular-nums shrink-0 w-10 text-right",
                    theme.text
                )}>
                    {Math.round(percentage)}%
                </span>
            </div>
        </div>
    );
};

export const TagReadingRateCard = ({
    tagData,
    isDark,
    theme,
    language,
}: TagReadingRateCardProps) => (
    <div
        className={cn(
            "col-span-12 md:col-span-4 border rounded-3xl p-6 transition-colors",
            theme.card, theme.cardBorder, theme.cardHover
        )}
        style={theme.cardBorderStyle}
    >
        {/* Header - Using SectionHeaderCompact pattern */}
        <SectionHeaderCompact
            icon={<Zap size={20} className="text-orange-400 shrink-0" />}
            title={language === 'ko' ? '태그별 열람율' : 'Tag Reading Rate'}
            theme={theme}
        />

        {/* Bar Gauges */}
        <div className="space-y-4">
            {tagData.length > 0 ? (
                tagData.map((item, idx) => (
                    <BarGauge
                        key={idx}
                        label={item.tag}
                        percentage={item.rate}
                        isDark={isDark}
                        theme={theme}
                    />
                ))
            ) : (
                <div className={cn("text-sm text-center py-6", theme.textSub)}>
                    {language === 'ko' ? '클립을 읽어보세요!' : 'Start reading clips!'}
                </div>
            )}
        </div>
    </div>
);
