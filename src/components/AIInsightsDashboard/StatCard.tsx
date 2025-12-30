import { ChevronRight } from 'lucide-react';
import { cn } from '../ui/utils';

// ═══════════════════════════════════════════════════
// StatCard - 통계 카드 (rounded-3xl)
// Storybook 패턴: StatGrid용
// ═══════════════════════════════════════════════════

interface StatCardProps {
    label: string;
    value: string;
    unit: string;
    trend?: string;
    sub?: string;
    icon: React.ReactNode;
    isDark: boolean;
    theme: {
        card: string;
        cardBorder: string;
        cardBorderStyle?: React.CSSProperties;
        cardHover: string;
        text: string;
        textMuted: string;
        textSub: string;
    };
    onClick?: () => void;
}

export const StatCard = ({
    label,
    value,
    unit,
    trend,
    sub,
    icon,
    isDark,
    theme,
    onClick,
}: StatCardProps) => {
    // Hide trend if it's just "+0" (no change in period)
    const showTrend = trend && trend !== '+0' && trend !== '0';

    return (
        <div
            onClick={onClick}
            className={cn(
                "border rounded-3xl p-6 transition-colors group",
                theme.card,
                theme.cardBorder,
                theme.cardHover,
                onClick && "cursor-pointer hover:border-[#21DBA4]/50"
            )}
            style={theme.cardBorderStyle}
        >
            {/* Header row: icon + label */}
            <div className="flex items-center gap-3 mb-4">
                {icon}
                <span className={cn("text-sm font-bold", theme.text)}>{label}</span>
                <div className="flex-1" />
                {showTrend && (
                    <span className="text-xs font-bold text-[#21DBA4] bg-[#21DBA4]/10 px-2 py-0.5 rounded-full">
                        {trend}
                    </span>
                )}
            </div>

            {/* Main value - large and prominent */}
            <div className="flex items-baseline gap-2">
                <span className={cn("text-4xl font-bold tracking-tight tabular-nums", theme.text)}>
                    {value}
                </span>
                <span className={cn("text-lg", theme.textMuted)}>{unit}</span>
            </div>

            {/* Sub text */}
            {sub && (
                <div className={cn("mt-2 flex items-center gap-1", onClick && "text-[#21DBA4] group-hover:text-[#1bc490]")}>
                    <span className={cn("text-xs", onClick ? "" : theme.textSub)}>{sub}</span>
                    {onClick && <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />}
                </div>
            )}
        </div>
    );
};
