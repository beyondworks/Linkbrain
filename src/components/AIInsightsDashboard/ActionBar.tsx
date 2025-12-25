import React from 'react';
import { TrendingUp, FileText, PenTool, Lightbulb, Zap } from 'lucide-react';
import { cn } from '../ui/utils';

interface ActionBarProps {
    theme: 'light' | 'dark';
    language: 'ko' | 'en';
    onAction: (type: 'trend' | 'summary' | 'draft' | 'ideas') => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
    theme,
    language,
    onAction,
}) => {
    const isDark = theme === 'dark';

    // --- Plus X Design Tokens ---
    const bgCard = isDark ? 'bg-[#111113]' : 'bg-white';
    const border = isDark ? 'border-white/[0.06]' : 'border-black/[0.05]';
    const textPrimary = isDark ? 'text-[#FAFAFA]' : 'text-[#111111]';
    const textSecondary = isDark ? 'text-[#A1A1AA]' : 'text-[#525252]';
    const textTertiary = isDark ? 'text-[#71717A]' : 'text-[#A3A3A3]';

    const actions = [
        {
            id: 'trend' as const,
            icon: TrendingUp,
            label: language === 'ko' ? '트렌드 분석' : 'Trend Analysis',
            desc: language === 'ko' ? '키워드 추이 확인' : 'View keyword trends'
        },
        {
            id: 'summary' as const,
            icon: FileText,
            label: language === 'ko' ? '핵심 요약' : 'Key Summary',
            desc: language === 'ko' ? '주요 내용 정리' : 'Summarize key points'
        },
        {
            id: 'draft' as const,
            icon: PenTool,
            label: language === 'ko' ? '기획서 초안' : 'Draft Planning',
            desc: language === 'ko' ? '구조화된 초안' : 'Structured draft'
        },
        {
            id: 'ideas' as const,
            icon: Lightbulb,
            label: language === 'ko' ? '아이디어 제안' : 'Idea Suggestions',
            desc: language === 'ko' ? '새로운 관점 발견' : 'Discover new angles'
        },
    ];

    return (
        <div className={cn("rounded-2xl border p-6", bgCard, border)}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", isDark ? "bg-white/[0.04]" : "bg-black/[0.03]")}>
                    <Zap size={16} className={textSecondary} />
                </div>
                <h3 className={cn("text-sm font-semibold", textPrimary)}>
                    {language === 'ko' ? '클립 액션' : 'Clip Actions'}
                </h3>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3">
                {actions.map(action => (
                    <button
                        key={action.id}
                        onClick={() => onAction(action.id)}
                        className={cn(
                            "flex flex-col items-start p-3 rounded-xl border border-transparent transition-all text-left group",
                            isDark
                                ? "bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.08]"
                                : "bg-black/[0.03] hover:bg-black/[0.05] hover:border-black/[0.08]"
                        )}
                    >
                        <div className="flex items-center justify-between w-full mb-2">
                            <action.icon size={16} className="text-[#21DBA4]" />
                            <div className={cn("w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-[#21DBA4]")} />
                        </div>
                        <span className={cn("text-[13px] font-semibold mb-0.5", textPrimary)}>{action.label}</span>
                        <span className={cn("text-[11px]", textTertiary)}>{action.desc}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
