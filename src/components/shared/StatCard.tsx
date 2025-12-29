import * as React from 'react';
import { cn } from '../ui/utils';

interface StatCardProps {
    /** 카드 라벨 (상단) */
    label: string;
    /** 메인 값 (중간) */
    value: string | number;
    /** 트렌드 텍스트 (하단, optional) */
    trend?: string;
    /** 트렌드가 긍정적인지 */
    trendUp?: boolean;
    /** 다크 모드 여부 */
    isDark?: boolean;
    /** 추가 클래스명 */
    className?: string;
}

/**
 * StatCard 컴포넌트
 * 
 * 스토리북 StatGrid 패턴 100% 반영:
 * - rounded-3xl border
 * - text-xs label (상단)
 * - text-2xl font-bold value (중간)
 * - text-xs trend (하단)
 * 
 * @example
 * <StatCard
 *   label="총 사용자"
 *   value="1,234"
 *   trend="+12% 이번 주"
 *   trendUp={true}
 * />
 */
export function StatCard({
    label,
    value,
    trend,
    trendUp = true,
    isDark = false,
    className,
}: StatCardProps) {
    return (
        <div
            className={cn(
                "p-4 rounded-3xl border transition-colors",
                isDark
                    ? "bg-[#111113] border-white/[0.06] hover:border-[#21DBA4]/30"
                    : "bg-white border-slate-100 hover:border-[#21DBA4]/30",
                className
            )}
        >
            {/* Label - 상단 */}
            <p className={cn(
                "text-xs font-medium mb-1",
                isDark ? "text-[#71717A]" : "text-slate-400"
            )}>
                {label}
            </p>

            {/* Value - 중간 */}
            <p className={cn(
                "text-2xl font-bold tabular-nums",
                isDark ? "text-[#FAFAFA]" : "text-slate-800"
            )}>
                {typeof value === 'number' ? value.toLocaleString() : value}
            </p>

            {/* Trend - 하단 */}
            {trend && (
                <p className={cn(
                    "text-xs font-medium mt-1",
                    trendUp ? "text-[#21DBA4]" : "text-red-500"
                )}>
                    {trend}
                </p>
            )}
        </div>
    );
}

export default StatCard;
