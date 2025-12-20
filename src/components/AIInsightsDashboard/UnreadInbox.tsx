import React from 'react';

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
        <div className={`rounded-xl p-4 md:p-5 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#21DBA4]">
                            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                        </svg>
                    </div>
                    <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {language === 'ko' ? '읽지 않은 클립' : 'Unread Clips'}
                    </h3>
                </div>
                {unreadClips.length > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
                        {unreadClips.length}
                    </span>
                )}
            </div>

            {/* Clips list */}
            <div className="space-y-2">
                {unreadClips.length > 0 ? (
                    unreadClips.map(clip => (
                        <div key={clip.id}>
                            <button
                                onClick={() => setExpandedId(expandedId === clip.id ? null : clip.id)}
                                className={`w-full text-left p-3 rounded-lg transition-colors ${expandedId === clip.id
                                        ? 'bg-[#21DBA4]/10 border border-[#21DBA4]/30'
                                        : isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-xs font-medium line-clamp-1 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                                            {clip.title || 'Untitled'}
                                        </h4>
                                        <p className={`text-[10px] mt-0.5 line-clamp-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                            {clip.summary?.slice(0, 60) || clip.url}
                                        </p>
                                    </div>
                                    <svg
                                        width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                        className={`shrink-0 transition-transform ${expandedId === clip.id ? 'rotate-180' : ''} ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                            </button>

                            {/* Expanded actions */}
                            {expandedId === clip.id && (
                                <div className={`mt-1 p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                    {clip.summary && (
                                        <p className={`text-[11px] leading-relaxed mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {clip.summary.slice(0, 150)}...
                                        </p>
                                    )}
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => onQuickRead?.(clip)}
                                            className="flex-1 py-1.5 text-[10px] font-medium rounded bg-[#21DBA4] text-white hover:bg-[#1bc290] transition-colors"
                                        >
                                            {language === 'ko' ? '30초 요약' : 'Quick Read'}
                                        </button>
                                        <button
                                            onClick={() => onAddToInterests?.(clip)}
                                            className={`flex-1 py-1.5 text-[10px] font-medium rounded transition-colors ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                                }`}
                                        >
                                            {language === 'ko' ? '관심사 반영' : 'Add to Interests'}
                                        </button>
                                        <button
                                            onClick={() => onDismiss?.(clip.id)}
                                            className={`px-2 py-1.5 text-[10px] font-medium rounded transition-colors ${isDark ? 'bg-slate-700/50 text-slate-500 hover:bg-slate-700' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                                }`}
                                        >
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className={`text-center py-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-2 opacity-50">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <p className="text-xs">
                            {language === 'ko' ? '모든 클립을 확인했습니다' : 'All caught up!'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
