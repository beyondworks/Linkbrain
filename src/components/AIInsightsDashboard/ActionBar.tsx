import React from 'react';

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

    const actions = [
        {
            id: 'trend' as const,
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                </svg>
            ),
            label: language === 'ko' ? '트렌드 분석' : 'Trend Analysis',
        },
        {
            id: 'summary' as const,
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
            ),
            label: language === 'ko' ? '핵심 요약' : 'Key Summary',
        },
        {
            id: 'draft' as const,
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19l7-7 3 3-7 7-3-3z" />
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                    <path d="M2 2l7.586 7.586" />
                </svg>
            ),
            label: language === 'ko' ? '기획서 초안' : 'Draft Planning',
        },
        {
            id: 'ideas' as const,
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
            ),
            label: language === 'ko' ? '아이디어 제안' : 'Idea Suggestions',
        },
    ];

    return (
        <div className={`rounded-xl p-4 md:p-5 border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#21DBA4]">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                </div>
                <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {language === 'ko' ? '클립 액션' : 'Clip Actions'}
                </h3>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2">
                {actions.map(action => (
                    <button
                        key={action.id}
                        onClick={() => onAction(action.id)}
                        className={`flex items-center gap-2 p-3 rounded-lg transition-all hover:scale-[1.01] ${isDark
                                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                            }`}
                    >
                        <span className="text-[#21DBA4]">{action.icon}</span>
                        <span className="text-xs font-medium">{action.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
