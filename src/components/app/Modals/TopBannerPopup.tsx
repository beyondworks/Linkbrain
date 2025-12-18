import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink } from 'lucide-react';
import { AppPopup } from '../../../hooks/useAnnouncements';

interface TopBannerPopupProps {
    popup: AppPopup;
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    onClose: () => void;
    onDismissToday: () => void;
}

export function TopBannerPopup({
    popup,
    theme,
    language,
    onClose,
    onDismissToday
}: TopBannerPopupProps) {
    const t = {
        dontShowToday: language === 'ko' ? '오늘 하루 안보기' : "Don't show today"
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full bg-gradient-to-r from-[#21DBA4] to-[#1bc290] text-white"
            >
                <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
                    {/* Left: Image (optional) + Content */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        {popup.imageUrl && (
                            <img
                                src={popup.imageUrl}
                                alt=""
                                className="w-8 h-8 rounded-lg object-cover shrink-0"
                                onError={e => (e.currentTarget.style.display = 'none')}
                            />
                        )}
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="font-medium text-sm truncate">
                                {popup.title}
                            </span>
                            {popup.content && (
                                <span className="text-sm text-white/80 truncate hidden sm:inline">
                                    {popup.content}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3 shrink-0">
                        {popup.linkUrl && (
                            <a
                                href={popup.linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-colors"
                            >
                                {language === 'ko' ? '자세히' : 'Learn More'}
                                <ExternalLink size={12} />
                            </a>
                        )}
                        <button
                            onClick={onDismissToday}
                            className="text-xs text-white/70 hover:text-white transition-colors whitespace-nowrap"
                        >
                            {t.dontShowToday}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
