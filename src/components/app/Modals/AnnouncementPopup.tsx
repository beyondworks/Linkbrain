import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink } from 'lucide-react';
import { AppPopup } from '../../../hooks/useAnnouncements';

interface AnnouncementPopupProps {
    popup: AppPopup;
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    onClose: () => void; // 그냥 닫기 (새로고침 시 다시 표시)
    onDismissToday: () => void; // 오늘 하루 안보기
    onDismissForever: () => void; // 다시 보지 않기
}

export function AnnouncementPopup({
    popup,
    theme,
    language,
    onClose,
    onDismissToday,
    onDismissForever
}: AnnouncementPopupProps) {
    const t = {
        close: language === 'ko' ? '닫기' : 'Close',
        dontShowToday: language === 'ko' ? '오늘 하루 안보기' : "Don't show today",
        dontShowAgain: language === 'ko' ? '다시 보지 않기' : "Don't show again",
        learnMore: language === 'ko' ? '자세히 보기' : 'Learn More'
    };

    const hasImage = !!popup.imageUrl;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className={`w-full rounded-2xl shadow-2xl overflow-hidden ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'
                        } ${hasImage ? 'max-w-md' : 'max-w-sm'}`}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Image */}
                    {hasImage && (
                        <div className="relative aspect-video w-full">
                            <img
                                src={popup.imageUrl}
                                alt={popup.title}
                                className="w-full h-full object-cover"
                                onError={e => (e.currentTarget.style.display = 'none')}
                            />
                            <button
                                onClick={onClose}
                                className={`absolute top-3 right-3 p-1.5 rounded-full ${theme === 'dark' ? 'bg-black/50 text-white' : 'bg-white/80 text-slate-700'
                                    } backdrop-blur-sm hover:scale-110 transition-transform`}
                            >
                                <X size={18} />
                            </button>
                        </div>
                    )}

                    {/* Content */}
                    <div className={hasImage ? 'p-5' : 'p-6'}>
                        {!hasImage && (
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'
                                    }`}>
                                    {popup.title}
                                </h3>
                                <button
                                    onClick={onClose}
                                    className={`p-1.5 rounded-full ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                                        }`}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        )}

                        {hasImage && (
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

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${theme === 'dark'
                                        ? 'bg-slate-800 text-white hover:bg-slate-700'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                {t.close}
                            </button>

                            {/* Dismiss Options */}
                            <div className="flex items-center justify-between pt-2">
                                <button
                                    onClick={onDismissForever}
                                    className={`text-xs ${theme === 'dark' ? 'text-slate-500 hover:text-slate-400' : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    {t.dontShowAgain}
                                </button>
                                <button
                                    onClick={onDismissToday}
                                    className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                                        }`}
                                >
                                    {t.dontShowToday}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
