import React from 'react';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    count?: number;
    active: boolean;
    onClick: () => void;
    iconClassName?: string;
    className?: string;
    theme: 'light' | 'dark';
}

export const NavItem = ({ icon, label, count, active, onClick, iconClassName, className, theme }: NavItemProps) => (
    <div
        onClick={onClick}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${className} ${active
            ? theme === 'dark'
                ? 'bg-[#21DBA4]/20 text-[#21DBA4]'
                : 'bg-[#E0FBF4] text-[#21DBA4]'
            : theme === 'dark'
                ? 'hover:bg-slate-800 text-slate-500 hover:text-slate-200'
                : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'}`}
    >
        <div className={`${active ? 'text-[#21DBA4]' : iconClassName || 'text-slate-400'}`}>{icon}</div>
        <span className="text-sm font-bold flex-1 truncate text-[14px]">
            {label.replace('[Beta]', '')}
            {label.includes('[Beta]') && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-[#21DBA4]/10 text-[#21DBA4] text-[9px] font-extrabold tracking-wide">
                    BETA
                </span>
            )}
        </span>
        {count !== undefined && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${active ? 'bg-[#21DBA4]/20 text-[#21DBA4]' : theme === 'dark' ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                {count}
            </span>
        )}
    </div>
);
