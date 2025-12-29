import * as React from 'react';
import { cn } from '../ui/utils';

interface SectionHeaderProps {
    /** 섹션 제목 */
    title: string;
    /** 부제목 (optional) */
    subtitle?: string;
    /** 우측 액션 영역 */
    action?: React.ReactNode;
    /** 다크 모드 여부 */
    isDark?: boolean;
    /** 추가 클래스명 */
    className?: string;
}

/**
 * SectionHeader 컴포넌트
 * 
 * 스토리북 SectionHeader 패턴 100% 반영:
 * - flex items-center justify-between mb-4
 * - title: text-base font-bold
 * - subtitle: text-xs text-muted
 * - action slot (우측)
 * 
 * @example
 * <SectionHeader
 *   title="서비스 통계"
 *   subtitle="실시간 서비스 현황"
 *   action={<Button>새로고침</Button>}
 * />
 */
export function SectionHeader({
    title,
    subtitle,
    action,
    isDark = false,
    className,
}: SectionHeaderProps) {
    return (
        <div className={cn(
            "flex items-center justify-between mb-4",
            className
        )}>
            <div>
                <h3 className={cn(
                    "text-base font-bold",
                    isDark ? "text-[#FAFAFA]" : "text-slate-800"
                )}>
                    {title}
                </h3>
                {subtitle && (
                    <p className={cn(
                        "text-xs mt-0.5",
                        isDark ? "text-[#71717A]" : "text-slate-400"
                    )}>
                        {subtitle}
                    </p>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

export default SectionHeader;
