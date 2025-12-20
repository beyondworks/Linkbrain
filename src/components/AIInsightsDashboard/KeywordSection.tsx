import React from 'react';

interface KeywordSectionProps {
    links: any[];
    theme: 'light' | 'dark';
    language: 'ko' | 'en';
    onKeywordClick?: (keyword: string) => void;
    onGenerateAction?: (type: 'report' | 'article' | 'draft', keyword: string) => void;
}

export const KeywordSection: React.FC<KeywordSectionProps> = ({
    links,
    theme,
    language,
    onKeywordClick,
    onGenerateAction,
}) => {
    const isDark = theme === 'dark';

    // Analyze keywords with context
    const keywordData = React.useMemo(() => {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Count tag co-occurrences
        const tagCounts: Record<string, number> = {};
        const tagCoOccurrences: Record<string, Record<string, number>> = {};

        links.forEach(link => {
            let date: Date | null = null;
            if (link.createdAt?.seconds) {
                date = new Date(link.createdAt.seconds * 1000);
            } else if (link.createdAt?.toDate) {
                date = link.createdAt.toDate();
            } else if (link.createdAt) {
                date = new Date(link.createdAt);
            }
            if (date && isNaN(date.getTime())) date = null;
            if (!date || date < weekAgo) return;

            const tags = link.tags || [];
            tags.forEach((tag: string) => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;

                if (!tagCoOccurrences[tag]) tagCoOccurrences[tag] = {};
                tags.forEach((otherTag: string) => {
                    if (tag !== otherTag) {
                        tagCoOccurrences[tag][otherTag] = (tagCoOccurrences[tag][otherTag] || 0) + 1;
                    }
                });
            });
        });

        // Get top keywords with their context
        const keywords = Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([tag, count]) => {
                const related = Object.entries(tagCoOccurrences[tag] || {})
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(([t]) => t);
                return { tag, count, related };
            });

        return keywords;
    }, [links]);

    const [selectedKeyword, setSelectedKeyword] = React.useState<string | null>(null);

    return (
        <div className={`rounded-xl p-4 md:p-5 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#21DBA4]">
                        <line x1="4" y1="9" x2="20" y2="9" />
                        <line x1="4" y1="15" x2="20" y2="15" />
                        <line x1="10" y1="3" x2="8" y2="21" />
                        <line x1="16" y1="3" x2="14" y2="21" />
                    </svg>
                </div>
                <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {language === 'ko' ? '이번 주 키워드' : 'This Week\'s Keywords'}
                </h3>
            </div>

            {/* Keywords */}
            <div className="space-y-2">
                {keywordData.length > 0 ? (
                    keywordData.map(({ tag, count, related }) => (
                        <div key={tag}>
                            <button
                                onClick={() => {
                                    setSelectedKeyword(selectedKeyword === tag ? null : tag);
                                    onKeywordClick?.(tag);
                                }}
                                className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all ${selectedKeyword === tag
                                    ? 'bg-[#21DBA4]/10 border border-[#21DBA4]/30'
                                    : isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                        {tag}
                                    </span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'}`}>
                                        {count}
                                    </span>
                                </div>
                                <svg
                                    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                    className={`transition-transform ${selectedKeyword === tag ? 'rotate-180' : ''} ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>

                            {/* Expanded content */}
                            {selectedKeyword === tag && (
                                <div className={`mt-1 ml-3 p-2 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                    {related.length > 0 && (
                                        <div className="mb-2">
                                            <span className={`text-[9px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                {language === 'ko' ? '함께 등장:' : 'Also appears with:'}
                                            </span>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {related.map(r => (
                                                    <span key={r} className={`text-[10px] px-1.5 py-0.5 rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
                                                        {r}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex gap-1 mt-2">
                                        <button
                                            onClick={() => onGenerateAction?.('report', tag)}
                                            className="flex-1 py-1.5 text-[10px] font-medium rounded bg-[#21DBA4]/10 text-[#21DBA4] hover:bg-[#21DBA4]/20 transition-colors"
                                        >
                                            {language === 'ko' ? '리포트' : 'Report'}
                                        </button>
                                        <button
                                            onClick={() => onGenerateAction?.('article', tag)}
                                            className="flex-1 py-1.5 text-[10px] font-medium rounded bg-[#21DBA4]/10 text-[#21DBA4] hover:bg-[#21DBA4]/20 transition-colors"
                                        >
                                            {language === 'ko' ? '아티클' : 'Article'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className={`text-xs text-center py-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {language === 'ko' ? '이번 주 저장된 클립이 없습니다' : 'No clips saved this week'}
                    </p>
                )}
            </div>
        </div>
    );
};
