import * as React from 'react';
import { cn } from '../ui/utils';

interface BadgeProps {
    /** 배지 내용 */
    children: React.ReactNode;
    /** 배지 타입 */
    variant?: 'default' | 'success' | 'warning' | 'error' | 'pro' | 'free';
    /** 다크 모드 여부 */
    isDark?: boolean;
    /** 추가 클래스명 */
    className?: string;
}

/**
 * Badge 컴포넌트
 * 
 * 스토리북 배지 패턴 100% 반영:
 * - rounded-full px-2 py-1 text-xs font-medium
 * 
 * @example
 * <Badge variant="success">활성</Badge>
 * <Badge variant="pro">Pro</Badge>
 */
export function Badge({
    children,
    variant = 'default',
    isDark = false,
    className,
}: BadgeProps) {
    const variantClasses = {
        default: isDark ? 'bg-gray-700 text-gray-300' : 'bg-slate-100 text-slate-500',
        success: isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-100 text-green-600',
        warning: isDark ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-100 text-yellow-600',
        error: isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-600',
        pro: 'bg-[#21DBA4]/10 text-[#21DBA4]',
        free: isDark ? 'bg-gray-700 text-gray-300' : 'bg-slate-100 text-slate-500',
    };

    return (
        <span className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
            variantClasses[variant],
            className
        )}>
            {children}
        </span>
    );
}

export default Badge;
