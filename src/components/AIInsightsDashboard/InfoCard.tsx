import { cn } from '../ui/utils';

// ═══════════════════════════════════════════════════
// InfoCard - 정보 카드 래퍼 (rounded-3xl, 테마 적용)
// Storybook 패턴: CardGrid 레이아웃용
// ═══════════════════════════════════════════════════

interface InfoCardProps {
    children: React.ReactNode;
    theme: {
        card: string;
        cardBorder: string;
        cardHover?: string;
    };
    className?: string;
    colSpan?: '4' | '6' | '8' | '12' | 'auto';
    onClick?: () => void;
}

export const InfoCard = ({
    children,
    theme,
    className,
    colSpan = 'auto',
    onClick,
}: InfoCardProps) => {
    const colSpanClass = colSpan !== 'auto' ? `col-span-12 lg:col-span-${colSpan}` : '';

    return (
        <div
            onClick={onClick}
            className={cn(
                "border rounded-3xl p-6 transition-colors",
                theme.card,
                theme.cardBorder,
                theme.cardHover,
                onClick && "cursor-pointer hover:border-[#21DBA4]/50",
                colSpanClass,
                className
            )}
        >
            {children}
        </div>
    );
};

// Compact variant for smaller padding
export const InfoCardCompact = ({
    children,
    theme,
    className,
    onClick,
}: Omit<InfoCardProps, 'colSpan'>) => (
    <div
        onClick={onClick}
        className={cn(
            "border rounded-2xl p-4 transition-colors",
            theme.card,
            theme.cardBorder,
            onClick && "cursor-pointer hover:border-[#21DBA4]/50",
            className
        )}
    >
        {children}
    </div>
);
