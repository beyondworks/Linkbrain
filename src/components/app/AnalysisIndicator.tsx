import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export type AnalysisStatus = 'pending' | 'analyzing' | 'complete' | 'error';

export interface AnalysisItem {
    id: string;
    url: string;
    status: AnalysisStatus;
}

interface AnalysisIndicatorProps {
    items: AnalysisItem[];
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
}

const statusConfig = {
    pending: {
        color: 'bg-slate-400',
        textColor: 'text-slate-500',
        icon: Clock,
        labelEn: 'Pending',
        labelKo: '대기 중'
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

export const AnalysisIndicator: React.FC<AnalysisIndicatorProps> = ({ items, theme, language }) => {
    if (items.length === 0) return null;

    const isDark = theme === 'dark';

    // Priority: analyzing > pending > error > complete
    const analyzingItems = items.filter(i => i.status === 'analyzing');
    const pendingItems = items.filter(i => i.status === 'pending');
    const errorItems = items.filter(i => i.status === 'error');
    const completeItems = items.filter(i => i.status === 'complete');

    // Determine primary status to show
    let primaryStatus: AnalysisStatus = 'complete';
    let activeCount = 0;

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

    const config = statusConfig[primaryStatus];
    const Icon = config.icon;
    const label = language === 'ko' ? config.labelKo : config.labelEn;

    // Auto-hide complete status after 3 seconds
    const shouldShow = primaryStatus !== 'complete' || items.some(i => i.status !== 'complete');

    return (
        <AnimatePresence>
            {shouldShow && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: 20 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                  ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200 shadow-sm'}`}
                >
                    {/* Status Dot with Animation */}
                    <div className="relative">
                        {primaryStatus === 'analyzing' ? (
                            <>
                                {/* Pulsing ring */}
                                <motion.div
                                    className={`absolute inset-0 rounded-full ${config.color} opacity-40`}
                                    animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                />
                                {/* Solid dot */}
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

                    {/* Label */}
                    <span className={config.textColor}>{label}</span>

                    {/* Count Badge (only show if more than 1) */}
                    {activeCount > 1 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center
                        ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
                        >
                            {activeCount}
                        </motion.span>
                    )}

                    {/* Spinning icon for analyzing */}
                    {primaryStatus === 'analyzing' && (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                            <Icon size={14} className={config.textColor} />
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AnalysisIndicator;
