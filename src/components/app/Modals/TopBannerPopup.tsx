import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
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
    language,
    onClose,
    onDismissToday
}: TopBannerPopupProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const t = {
        dontShowToday: language === 'ko' ? '오늘 하루 안보기' : "Don't show today"
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full bg-gradient-to-r from-[#21DBA4] to-[#1bc290] rounded-b-xl shadow-sm"
            >
                {/* Main Banner Row */}
                <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
                    {/* Left: Icon + Content (clickable on mobile) */}
                    <div
                        className="flex items-center gap-3 min-w-0 flex-1 sm:cursor-default cursor-pointer"
                        onClick={() => setIsExpanded(prev => !prev)}
                    >
                        {popup.imageUrl ? (
                            <img
                                src={popup.imageUrl}
                                alt=""
                                className="w-8 h-8 rounded-lg object-cover shrink-0"
                                onError={e => (e.currentTarget.style.display = 'none')}
                            />
                        ) : (
                            <div className="p-1.5 rounded-full shrink-0 bg-[#333333]/10">
                                <AlertCircle size={16} className="text-[#333333]" />
                            </div>
                        )}
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="font-bold text-sm text-[#333333]">
                                {popup.title}
                            </span>
                            {/* Desktop: show content inline */}
                            {popup.content && (
                                <span className="text-sm text-[#333333]/80 truncate hidden sm:inline">
                                    {popup.content}
                                </span>
                            )}
                            {/* Mobile: show expand indicator */}
                            {popup.content && (
                                <span className="sm:hidden text-[#333333]/60 ml-1">
                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
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
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#333333] text-white hover:bg-[#444444] rounded-lg text-xs font-medium transition-colors hidden sm:flex"
                            >
                                {language === 'ko' ? '자세히' : 'Learn More'}
                                <ExternalLink size={12} />
                            </a>
                        )}
                        <button
                            onClick={onDismissToday}
                            className="text-xs text-[#333333]/70 hover:text-[#333333] transition-colors whitespace-nowrap hidden sm:block"
                        >
                            {t.dontShowToday}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-[#333333]/10 rounded-full transition-colors text-[#333333]"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Mobile Expanded Content Dropdown */}
                <AnimatePresence>
                    {isExpanded && popup.content && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="sm:hidden overflow-hidden"
                        >
                            <div className="px-4 pb-3 pt-4 border-t border-[#333333]/10 rounded-b-xl">
                                {/* Content */}
                                <p className="text-sm text-[#333333]/90 mb-3 leading-relaxed">
                                    {popup.content}
                                </p>

                                {/* Mobile Action Buttons */}
                                <div className="flex items-center gap-3">
                                    {popup.linkUrl && (
                                        <a
                                            href={popup.linkUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#333333] text-white hover:bg-[#444444] rounded-lg text-xs font-medium transition-colors"
                                        >
                                            {language === 'ko' ? '자세히 보기' : 'Learn More'}
                                            <ExternalLink size={12} />
                                        </a>
                                    )}
                                    <button
                                        onClick={onDismissToday}
                                        className="text-xs text-[#333333]/70 hover:text-[#333333] transition-colors"
                                    >
                                        {t.dontShowToday}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
    );
}
