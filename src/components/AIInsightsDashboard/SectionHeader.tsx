import { cn } from '../ui/utils';

// ═══════════════════════════════════════════════════
// SectionHeader - 섹션 헤더 (아이콘 + 제목 + 뱃지/액션)
// Storybook 패턴: flex items-center justify-between
// ═══════════════════════════════════════════════════

interface SectionHeaderProps {
    icon: React.ReactNode;
    title: string;
    badge?: React.ReactNode;
    action?: React.ReactNode;
    theme: {
        text: string;
        textMuted?: string;
    };
    className?: string;
}

export const SectionHeader = ({
    icon,
    title,
    badge,
    action,
    theme,
    className,
}: SectionHeaderProps) => (
    <div className={cn("flex items-center justify-between mb-6", className)}>
        <h3 className={cn("text-base font-bold flex items-center gap-2", theme.text)}>
            {icon}
            {title}
        </h3>
        <div className="flex items-center gap-2">
            {badge}
            {action}
        </div>
    </div>
);

// Compact variant for smaller cards
export const SectionHeaderCompact = ({
    icon,
    title,
    badge,
    theme,
    className,
}: Omit<SectionHeaderProps, 'action'>) => (
    <div className={cn("flex items-center gap-3 mb-4", className)}>
        {icon}
        <span className={cn("text-sm font-bold", theme.text)}>{title}</span>
        <div className="flex-1" />
        {badge}
    </div>
);
