import React from 'react';
import { Hash, ChevronDown, FileText, PenTool, Sparkles } from 'lucide-react';
import { cn } from '../ui/utils';

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

    // --- Plus X Design Tokens ---
    const bgCard = isDark ? 'bg-[#111113]' : 'bg-white';
    const border = isDark ? 'border-white/[0.06]' : 'border-black/[0.05]';
    const textPrimary = isDark ? 'text-[#FAFAFA]' : 'text-[#111111]';
    const textSecondary = isDark ? 'text-[#A1A1AA]' : 'text-[#525252]';
    const textTertiary = isDark ? 'text-[#71717A]' : 'text-[#A3A3A3]';
    const hoverEffect = "transition-all duration-200 hover:bg-black/[0.015] dark:hover:bg-white/[0.02]";

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
        <div className={cn("rounded-2xl border p-6 flex flex-col", bgCard, border)}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", isDark ? "bg-white/[0.04]" : "bg-black/[0.03]")}>
                        <Hash size={16} className={textSecondary} />
                    </div>
                    <h3 className={cn("text-sm font-semibold", textPrimary)}>
                        {language === 'ko' ? '이번 주 키워드' : "This Week's Keywords"}
                    </h3>
                </div>
                {keywordData.length > 0 && (
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500")}>
                        {keywordData.length} active
                    </span>
                )}
            </div>

            {/* Keywords List */}
            <div className="space-y-1 flex-1">
                {keywordData.length > 0 ? (
                    keywordData.map(({ tag, count, related }) => {
                        const isSelected = selectedKeyword === tag;
                        return (
                            <div key={tag} className="group">
                                <button
                                    onClick={() => {
                                        setSelectedKeyword(isSelected ? null : tag);
                                        onKeywordClick?.(tag);
                                    }}
                                    className={cn(
                                        "w-full flex items-center justify-between p-2.5 rounded-lg transition-all border border-transparent",
                                        isSelected
                                            ? "bg-[#21DBA4]/[0.05] border-[#21DBA4]/20"
                                            : hoverEffect
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={cn(
                                            "text-xs font-medium px-1.5 py-0.5 rounded text-opacity-80 transition-colors",
                                            isSelected
                                                ? "bg-[#21DBA4]/20 text-[#21DBA4]"
                                                : isDark ? "bg-white/5 text-slate-400 group-hover:text-slate-300" : "bg-black/5 text-slate-500 group-hover:text-slate-700"
                                        )}>
                                            {count}
                                        </span>
                                        <span className={cn(
                                            "text-sm font-medium transition-colors",
                                            isSelected ? "text-[#21DBA4]" : textPrimary
                                        )}>
                                            {tag}
                                        </span>
                                    </div>
                                    <ChevronDown
                                        size={14}
                                        className={cn(
                                            "transition-transform duration-200",
                                            isSelected ? "rotate-180 text-[#21DBA4]" : textTertiary
                                        )}
                                    />
                                </button>

                                {/* Expanded content */}
                                {isSelected && (
                                    <div className={cn(
                                        "mt-2 mb-3 ml-3 p-3 rounded-lg border",
                                        isDark ? "bg-black/20 border-white/5" : "bg-slate-50 border-black/5"
                                    )}>
                                        {related.length > 0 && (
                                            <div className="mb-3">
                                                <div className="flex items-center gap-1.5 mb-2">
                                                    <Sparkles size={10} className={textTertiary} />
                                                    <span className={cn("text-[10px] uppercase tracking-wider font-semibold", textTertiary)}>
                                                        {language === 'ko' ? '연관 주제' : 'RELATED TOPICS'}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {related.map(r => (
                                                        <span key={r} className={cn(
                                                            "text-[11px] px-2 py-0.5 rounded-full border transition-colors",
                                                            isDark
                                                                ? "bg-white/5 border-white/5 text-slate-300 hover:border-white/20"
                                                                : "bg-white border-black/5 text-slate-600 hover:border-black/20"
                                                        )}>
                                                            {r}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onGenerateAction?.('report', tag);
                                                }}
                                                className={cn(
                                                    "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-[11px] font-medium transition-all",
                                                    isDark
                                                        ? "bg-[#21DBA4]/10 hover:bg-[#21DBA4]/20 text-[#21DBA4]"
                                                        : "bg-[#21DBA4]/5 hover:bg-[#21DBA4]/10 text-[#1fa57e]"
                                                )}
                                            >
                                                <FileText size={12} />
                                                {language === 'ko' ? '리포트 생성' : 'Generate Report'}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onGenerateAction?.('article', tag);
                                                }}
                                                className={cn(
                                                    "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-[11px] font-medium transition-all",
                                                    isDark
                                                        ? "bg-white/5 hover:bg-white/10 text-slate-300"
                                                        : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-600"
                                                )}
                                            >
                                                <PenTool size={12} />
                                                {language === 'ko' ? '글쓰기' : 'Write Article'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center h-[200px] text-center">
                        <div className={cn("p-3 rounded-full mb-3", isDark ? "bg-white/5" : "bg-black/5")}>
                            <Hash size={20} className={textTertiary} opacity={0.5} />
                        </div>
                        <p className={cn("text-xs font-medium", textSecondary)}>
                            {language === 'ko' ? '이번 주 키워드가 없습니다' : 'No keywords found this week'}
                        </p>
                        <p className={cn("text-[10px] mt-1", textTertiary)}>
                            {language === 'ko' ? '새로운 링크를 저장해보세요' : 'Save links to see keywords'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
