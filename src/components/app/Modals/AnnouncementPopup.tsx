import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink } from 'lucide-react';
import { AppPopup } from '../../../hooks/useAnnouncements';

interface AnnouncementPopupProps {
    popup: AppPopup;
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    onDismiss: () => void;
    onDismissForever: () => void;
}

export function AnnouncementPopup({
    popup,
    theme,
    language,
    onDismiss,
    onDismissForever
}: AnnouncementPopupProps) {
    const t = {
        close: language === 'ko' ? '닫기' : 'Close',
        dontShowToday: language === 'ko' ? '오늘 하루 안보기' : "Don't show today",
        dontShowAgain: language === 'ko' ? '다시 보지 않기' : "Don't show again",
        learnMore: language === 'ko' ? '자세히 보기' : 'Learn More'
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={onDismiss}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'
                        }`}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Image */}
                    {popup.imageUrl && (
                        <div className="relative aspect-video w-full">
                            <img
                                src={popup.imageUrl}
                                alt={popup.title}
                                className="w-full h-full object-cover"
                                onError={e => (e.currentTarget.style.display = 'none')}
                            />
                            <button
                                onClick={onDismiss}
                                className={`absolute top-3 right-3 p-1.5 rounded-full ${theme === 'dark' ? 'bg-black/50 text-white' : 'bg-white/80 text-slate-700'
                                    } backdrop-blur-sm`}
                            >
                                <X size={18} />
                            </button>
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-5">
                        {!popup.imageUrl && (
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                                    }`}>
                                    {popup.title}
                                </h3>
                                <button
                                    onClick={onDismiss}
                                    className={`p-1.5 rounded-full ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                                        }`}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        )}

                        {popup.imageUrl && (
                            <h3 className={`text-lg font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                                }`}>
                                {popup.title}
                            </h3>
                        )}

                        <p className={`text-sm mb-5 leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                            }`}>
                            {popup.content}
                        </p>

                        {/* Link Button */}
                        {popup.linkUrl && (
                            <a
                                href={popup.linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-3 bg-[#21DBA4] text-white rounded-xl font-medium text-sm hover:bg-[#1bc290] transition-colors mb-4"
                            >
                                {t.learnMore}
                                <ExternalLink size={14} />
                            </a>
                        )}

                        {/* Dismiss Options */}
                        <div className="flex items-center justify-between">
                            <button
                                onClick={onDismissForever}
                                className={`text-xs ${theme === 'dark' ? 'text-slate-500 hover:text-slate-400' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {t.dontShowAgain}
                            </button>
                            <button
                                onClick={onDismiss}
                                className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                {t.dontShowToday}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
