import * as React from 'react';
import { cn } from '../ui/utils';

interface NavItemProps {
    /** 아이콘 */
    icon: React.ReactNode;
    /** 라벨 */
    label: string;
    /** 활성 상태 */
    active?: boolean;
    /** 다크 모드 여부 */
    isDark?: boolean;
    /** 클릭 핸들러 */
    onClick?: () => void;
    /** 추가 클래스명 */
    className?: string;
}

/**
 * NavItem 컴포넌트
 * 
 * 사이드바 네비게이션 아이템 (스토리북 패턴 100% 반영):
 * - rounded-lg
 * - active: bg-[#21DBA4]/10 text-[#21DBA4]
 * - hover: bg-slate-50
 * 
 * @example
 * <NavItem
 *   icon={<ChartIcon />}
 *   label="Overview"
 *   active={true}
 *   onClick={() => setActiveTab('overview')}
 * />
 */
export function NavItem({
    icon,
    label,
    active = false,
    isDark = false,
    onClick,
    className,
}: NavItemProps) {
    return (
        <div
            className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
                active
                    ? "bg-[#21DBA4]/10 text-[#21DBA4]"
                    : isDark
                        ? "text-gray-400 hover:bg-gray-800"
                        : "text-slate-500 hover:bg-slate-50",
                className
            )}
            onClick={onClick}
            role="button"
            tabIndex={0}
        >
            {icon}
            <span className="text-sm font-medium">{label}</span>
        </div>
    );
}

export default NavItem;
