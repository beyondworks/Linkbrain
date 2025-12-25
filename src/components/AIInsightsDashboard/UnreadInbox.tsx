import React from 'react';
import { Inbox, ChevronDown, Eye, PlusCircle, X } from 'lucide-react';
import { cn } from '../ui/utils';

interface UnreadInboxProps {
    links: any[];
    theme: 'light' | 'dark';
    language: 'ko' | 'en';
    onQuickRead?: (clip: any) => void;
    onDismiss?: (clipId: string) => void;
    onAddToInterests?: (clip: any) => void;
}

export const UnreadInbox: React.FC<UnreadInboxProps> = ({
    links,
    theme,
    language,
    onQuickRead,
    onDismiss,
    onAddToInterests,
}) => {
    const isDark = theme === 'dark';

    // --- Plus X Design Tokens ---
    const bgCard = isDark ? 'bg-[#111113]' : 'bg-white';
    const border = isDark ? 'border-white/[0.06]' : 'border-black/[0.05]';
    const textPrimary = isDark ? 'text-[#FAFAFA]' : 'text-[#111111]';
    const textSecondary = isDark ? 'text-[#A1A1AA]' : 'text-[#525252]';
    const textTertiary = isDark ? 'text-[#71717A]' : 'text-[#A3A3A3]';
    const hoverEffect = "transition-all duration-200 hover:bg-black/[0.015] dark:hover:bg-white/[0.02]";

    // Get unread clips (clips without summary or notes viewed)
    const unreadClips = React.useMemo(() => {
        return links
            .filter(link => !link.isArchived && !link.isReadLater)
            .filter(link => {
                // Consider unread if no notes and not favorited
                return !link.notes && !link.isFavorite;
            })
            .slice(0, 5);
    }, [links]);

    const [expandedId, setExpandedId] = React.useState<string | null>(null);

    return (
        <div className={cn("rounded-2xl border p-6 flex flex-col h-full", bgCard, border)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", isDark ? "bg-white/[0.04]" : "bg-black/[0.03]")}>
                        <Inbox size={16} className={textSecondary} />
                    </div>
                    <h3 className={cn("text-sm font-semibold", textPrimary)}>
                        {language === 'ko' ? '읽지 않은 클립' : 'Unread Inbox'}
                    </h3>
                </div>
                {unreadClips.length > 0 && (
                    <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold",
                        isDark ? "bg-white/10 text-white" : "bg-black/10 text-black"
                    )}>
                        {unreadClips.length}
                    </span>
                )}
            </div>

            {/* Clips list */}
            <div className="space-y-1 flex-1">
                {unreadClips.length > 0 ? (
                    unreadClips.map(clip => (
                        <div key={clip.id} className="group">
                            <button
                                onClick={() => setExpandedId(expandedId === clip.id ? null : clip.id)}
                                className={cn(
                                    "w-full text-left p-3 rounded-lg transition-all border border-transparent",
                                    expandedId === clip.id
                                        ? "bg-[#21DBA4]/[0.05] border-[#21DBA4]/20"
                                        : hoverEffect
                                )}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <h4 className={cn("text-xs font-medium line-clamp-1 mb-0.5", textPrimary)}>
                                            {clip.title || 'Untitled'}
                                        </h4>
                                        <p className={cn("text-[10px] line-clamp-1", textTertiary)}>
                                            {clip.summary?.slice(0, 60) || clip.url}
                                        </p>
                                    </div>
                                    <ChevronDown
                                        size={14}
                                        className={cn(
                                            "shrink-0 transition-transform duration-200",
                                            expandedId === clip.id ? "rotate-180 text-[#21DBA4]" : textTertiary
                                        )}
                                    />
                                </div>
                            </button>

                            {/* Expanded actions */}
                            {expandedId === clip.id && (
                                <div className={cn(
                                    "mt-2 mb-3 ml-3 p-3 rounded-lg border",
                                    isDark ? "bg-black/20 border-white/5" : "bg-slate-50 border-black/5"
                                )}>
                                    {clip.summary && (
                                        <p className={cn("text-[11px] leading-relaxed mb-3", textSecondary)}>
                                            {clip.summary.slice(0, 150)}...
                                        </p>
                                    )}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onQuickRead?.(clip)}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-[11px] font-medium bg-[#21DBA4] text-white hover:bg-[#1bc290] transition-colors shadow-sm"
                                        >
                                            <Eye size={12} />
                                            {language === 'ko' ? '30초 요약' : 'Quick Read'}
                                        </button>
                                        <button
                                            onClick={() => onAddToInterests?.(clip)}
                                            className={cn(
                                                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-[11px] font-medium transition-colors border",
                                                isDark
                                                    ? "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"
                                                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                            )}
                                        >
                                            <PlusCircle size={12} />
                                            {language === 'ko' ? '관심사' : 'Save Interest'}
                                        </button>
                                        <button
                                            onClick={() => onDismiss?.(clip.id)}
                                            className={cn(
                                                "w-8 flex items-center justify-center rounded-md border transition-colors",
                                                isDark
                                                    ? "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                                                    : "bg-white border-slate-200 text-slate-400 hover:text-red-500"
                                            )}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-[200px] text-center">
                        <div className={cn("p-3 rounded-full mb-3", isDark ? "bg-white/5" : "bg-black/5")}>
                            <Inbox size={20} className={textTertiary} opacity={0.5} />
                        </div>
                        <p className={cn("text-xs font-medium", textSecondary)}>
                            {language === 'ko' ? '모든 클립을 확인했습니다' : 'All caught up!'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
