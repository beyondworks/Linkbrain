import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, CheckCircle, AlertCircle, Clock, Sparkles, X } from 'lucide-react';

export type AnalysisStatus = 'idle' | 'pending' | 'analyzing' | 'complete' | 'error';

export interface AnalysisItem {
    id: string;
    url: string;
    status: AnalysisStatus;
    timestamp?: number;
}

export interface AnalysisLogItem {
    id: string;
    url: string;
    status: 'complete' | 'error';
    timestamp: number;
}

interface AnalysisIndicatorProps {
    items: AnalysisItem[];
    logs: AnalysisLogItem[];
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
}

const statusConfig = {
    idle: {
        color: 'bg-slate-300',
        textColor: 'text-slate-400',
        icon: Sparkles,
        labelEn: 'Ready',
        labelKo: '대기 중'
    },
    pending: {
        color: 'bg-amber-400',
        textColor: 'text-amber-500',
        icon: Clock,
        labelEn: 'Queued',
        labelKo: '대기열'
    },
    analyzing: {
        color: 'bg-[#21DBA4]',
        textColor: 'text-[#21DBA4]',
        icon: Loader2,
        labelEn: 'Analyzing',
        labelKo: '분석 중'
    },
    complete: {
        color: 'bg-blue-500',
        textColor: 'text-blue-500',
        icon: CheckCircle,
        labelEn: 'Complete',
        labelKo: '완료'
    },
    error: {
        color: 'bg-red-500',
        textColor: 'text-red-500',
        icon: AlertCircle,
        labelEn: 'Error',
        labelKo: '오류'
    }
};

// Helper to truncate URL
const truncateUrl = (url: string, maxLength: number = 30) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
};

// Helper to format time ago
const timeAgo = (timestamp: number, language: 'en' | 'ko') => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return language === 'ko' ? '방금 전' : 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return language === 'ko' ? `${minutes}분 전` : `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return language === 'ko' ? `${hours}시간 전` : `${hours}h ago`;
};

export const AnalysisIndicator: React.FC<AnalysisIndicatorProps> = ({ items, logs, theme, language }) => {
    const [showLogs, setShowLogs] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const isDark = theme === 'dark';

    // Close popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                setShowLogs(false);
            }
        };
        if (showLogs) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showLogs]);

    // Get recent 3 logs
    const recentLogs = logs.slice(0, 3);

    // Determine current status
    let primaryStatus: AnalysisStatus = 'idle';
    let activeCount = 0;

    if (items.length > 0) {
        const analyzingItems = items.filter(i => i.status === 'analyzing');
        const pendingItems = items.filter(i => i.status === 'pending');
        const errorItems = items.filter(i => i.status === 'error');
        const completeItems = items.filter(i => i.status === 'complete');

        if (analyzingItems.length > 0) {
            primaryStatus = 'analyzing';
            activeCount = analyzingItems.length + pendingItems.length;
        } else if (pendingItems.length > 0) {
            primaryStatus = 'pending';
            activeCount = pendingItems.length;
        } else if (errorItems.length > 0) {
            primaryStatus = 'error';
            activeCount = errorItems.length;
        } else if (completeItems.length > 0) {
            primaryStatus = 'complete';
            activeCount = completeItems.length;
        }
    }

    const config = statusConfig[primaryStatus];
    const Icon = config.icon;
    const label = language === 'ko' ? config.labelKo : config.labelEn;

    return (
        <div className="relative" ref={popupRef}>
            {/* Indicator Button */}
            <motion.button
                onClick={() => setShowLogs(!showLogs)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all whitespace-nowrap
                    ${isDark ? 'bg-slate-800 border border-slate-700 hover:bg-slate-700' : 'bg-white border border-slate-200 shadow-sm hover:bg-slate-50'}`}
            >
                {/* Status Dot */}
                <div className="relative">
                    {primaryStatus === 'analyzing' ? (
                        <>
                            <motion.div
                                className={`absolute inset-0 rounded-full ${config.color} opacity-40`}
                                animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            />
                            <motion.div
                                className={`w-2.5 h-2.5 rounded-full ${config.color}`}
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                            />
                        </>
                    ) : (
                        <div className={`w-2.5 h-2.5 rounded-full ${config.color}`} />
                    )}
                </div>

                {/* Label - always show when analyzing */}
                <span className={`${primaryStatus === 'analyzing' ? 'inline text-xs font-semibold' : 'hidden md:inline'} ${config.textColor}`}>
                    {language === 'ko'
                        ? (primaryStatus === 'analyzing' ? '분석중' : config.labelKo)
                        : (primaryStatus === 'analyzing' ? 'Analyzing...' : config.labelEn)}
                </span>

                {/* Count Badge - hidden on mobile */}
                {activeCount > 1 && (
                    <span className={`hidden md:flex min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold items-center justify-center
                        ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                        {activeCount}
                    </span>
                )}

                {/* Spinning icon for analyzing - hidden on mobile */}
                {primaryStatus === 'analyzing' && (
                    <motion.div
                        className="hidden md:block"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                        <Icon size={14} className={config.textColor} />
                    </motion.div>
                )}
            </motion.button>

            {/* Logs Popup */}
            <AnimatePresence>
                {showLogs && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className={`absolute top-full mt-2 w-64 md:w-72 rounded-xl overflow-hidden z-50
                            right-0 md:left-1/2 md:-translate-x-1/2
                            ${isDark ? 'bg-slate-800 border border-slate-700 shadow-xl' : 'bg-white border border-slate-200 shadow-lg'}`}
                    >
                        {/* Header */}
                        <div className={`flex items-center justify-between px-3 py-2 border-b
                            ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                            <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                {language === 'ko' ? '최근 분석 로그' : 'Recent Analysis'}
                            </span>
                            <button
                                onClick={() => setShowLogs(false)}
                                className={`p-1 rounded-md transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                            >
                                <X size={14} />
                            </button>
                        </div>

                        {/* Log List */}
                        <div className="max-h-48 overflow-y-auto">
                            {recentLogs.length === 0 ? (
                                <div className={`px-3 py-4 text-center text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {language === 'ko' ? '분석 기록이 없습니다' : 'No analysis history'}
                                </div>
                            ) : (
                                recentLogs.map((log) => (
                                    <div
                                        key={log.id}
                                        className={`px-3 py-2 border-b last:border-b-0 transition-colors
                                            ${isDark ? 'border-slate-700/50 hover:bg-slate-700/50' : 'border-slate-50 hover:bg-slate-50'}`}
                                    >
                                        <div className="flex items-start gap-2">
                                            {/* Status Icon */}
                                            <div className={`mt-0.5 ${log.status === 'complete' ? 'text-blue-500' : 'text-red-500'}`}>
                                                {log.status === 'complete' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                                            </div>
                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-xs font-medium truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                                                    {truncateUrl(log.url)}
                                                </p>
                                                <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                    {timeAgo(log.timestamp, language)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AnalysisIndicator;
