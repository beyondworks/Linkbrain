/**
 * UpgradePrompt Component
 * 
 * 크레딧 부족 또는 프로 전용 기능 접근 시 표시되는 업그레이드 유도 모달
 * 기존 디자인 시스템 (슬레이트 컬러, 라운드, 그림자) 준수
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, X, Sparkles, CreditCard } from 'lucide-react';
import { CREDIT_COSTS, CreditAction } from '../../config/credits';

interface UpgradePromptProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: () => void;
    theme: 'light' | 'dark';
    type: 'credits' | 'pro-feature';
    currentCredits?: number;
    requiredCredits?: number;
    action?: CreditAction;
    featureName?: string;
    t: (key: string) => string;
}

const TRANSLATIONS = {
    en: {
        creditsTitle: 'Not Enough Credits',
        creditsDesc: 'You need more credits to perform this action.',
        currentCredits: 'Current Credits',
        requiredCredits: 'Required',
        proTitle: 'Pro Feature',
        proDesc: 'Upgrade to Pro to unlock this feature.',
        upgradeCta: 'Upgrade to Pro',
        buyCredits: 'Get More Credits',
        close: 'Maybe Later',
    },
    ko: {
        creditsTitle: '크레딧이 부족해요',
        creditsDesc: '이 기능을 사용하려면 더 많은 크레딧이 필요합니다.',
        currentCredits: '보유 크레딧',
        requiredCredits: '필요 크레딧',
        proTitle: '프로 전용 기능',
        proDesc: '이 기능을 사용하려면 프로로 업그레이드하세요.',
        upgradeCta: '프로로 업그레이드',
        buyCredits: '크레딧 충전하기',
        close: '나중에',
    },
};

export const UpgradePrompt = ({
    isOpen,
    onClose,
    onUpgrade,
    theme,
    type,
    currentCredits = 0,
    requiredCredits,
    action,
    featureName,
    t: parentT,
}: UpgradePromptProps) => {
    const isDark = theme === 'dark';
    const lang = parentT('home') === '홈' ? 'ko' : 'en';
    const lt = TRANSLATIONS[lang];

    const required = requiredCredits ?? (action ? CREDIT_COSTS[action] : 0);
    const deficit = Math.max(0, required - currentCredits);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className={`relative rounded-2xl p-6 w-full max-w-sm shadow-2xl ${isDark
                            ? 'bg-slate-900 border border-slate-700'
                            : 'bg-white border border-slate-100'
                        }`}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors ${isDark
                                ? 'hover:bg-slate-800 text-slate-400'
                                : 'hover:bg-slate-100 text-slate-500'
                            }`}
                    >
                        <X size={18} />
                    </button>

                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 ${type === 'credits'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-[#21DBA4]/10 text-[#21DBA4]'
                        }`}>
                        {type === 'credits' ? <CreditCard size={28} /> : <Sparkles size={28} />}
                    </div>

                    {/* Title */}
                    <h3 className={`text-xl font-bold text-center mb-2 ${isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                        {type === 'credits' ? lt.creditsTitle : lt.proTitle}
                    </h3>

                    {/* Description */}
                    <p className={`text-center text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                        {type === 'credits'
                            ? lt.creditsDesc
                            : featureName
                                ? `"${featureName}" ${lt.proDesc.split('이')[1] || 'is a Pro feature.'}`
                                : lt.proDesc
                        }
                    </p>

                    {/* Credit Info (only for credits type) */}
                    {type === 'credits' && (
                        <div className={`rounded-xl p-4 mb-6 ${isDark ? 'bg-slate-800' : 'bg-slate-50'
                            }`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {lt.currentCredits}
                                </span>
                                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {currentCredits} cr
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {lt.requiredCredits}
                                </span>
                                <span className="font-bold text-amber-500">
                                    {required} cr
                                </span>
                            </div>
                            {deficit > 0 && (
                                <div className={`mt-3 pt-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                                    <div className="flex justify-between items-center">
                                        <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                            {lang === 'ko' ? '부족' : 'Deficit'}
                                        </span>
                                        <span className="font-bold text-red-500">
                                            -{deficit} cr
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* CTA Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={onUpgrade}
                            className="w-full py-3 rounded-xl font-bold text-sm bg-[#21DBA4] text-white hover:bg-[#1bc290] shadow-lg shadow-[#21DBA4]/20 transition-all flex items-center justify-center gap-2"
                        >
                            <Zap size={16} />
                            {lt.upgradeCta}
                        </button>
                        <button
                            onClick={onClose}
                            className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${isDark
                                    ? 'text-slate-400 hover:bg-slate-800'
                                    : 'text-slate-500 hover:bg-slate-100'
                                }`}
                        >
                            {lt.close}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default UpgradePrompt;
