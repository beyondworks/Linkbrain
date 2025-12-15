/**
 * CreditDisplay Component
 * 
 * 사이드바 또는 헤더에 표시되는 크레딧 잔여량 표시 컴포넌트
 * 기존 디자인 시스템 (슬레이트 컬러, 라운드, 크레딧 아이콘) 준수
 */

import React from 'react';
import { Coins, Zap, AlertTriangle } from 'lucide-react';
import { useCreditContext } from '../../context/CreditContext';
import { CREDIT_WARNING_THRESHOLD } from '../../config/credits';

interface CreditDisplayProps {
    theme: 'light' | 'dark';
    variant?: 'compact' | 'full';
    onClick?: () => void;
}

export const CreditDisplay = ({ theme, variant = 'compact', onClick }: CreditDisplayProps) => {
    const { credits, tier, loading, creditsResetDate } = useCreditContext();
    const isDark = theme === 'dark';
    const isLow = credits <= CREDIT_WARNING_THRESHOLD;

    if (loading) {
        return (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl animate-pulse ${isDark ? 'bg-slate-800' : 'bg-slate-100'
                }`}>
                <div className="w-4 h-4 rounded-full bg-slate-300" />
                <div className="w-12 h-4 rounded bg-slate-300" />
            </div>
        );
    }

    if (variant === 'compact') {
        return (
            <button
                onClick={onClick}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all hover:scale-105 ${isLow
                        ? isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'
                        : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                    }`}
            >
                {isLow ? (
                    <AlertTriangle size={14} className="text-amber-500" />
                ) : (
                    <Coins size={14} className={isDark ? 'text-amber-400' : 'text-amber-500'} />
                )}
                <span className="text-sm font-bold">{credits.toLocaleString()}</span>
                <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>cr</span>
            </button>
        );
    }

    // Full variant with more details
    return (
        <div
            onClick={onClick}
            className={`w-full p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] ${isLow
                    ? isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'
                    : isDark ? 'bg-slate-800 border border-slate-700' : 'bg-slate-100 border border-slate-200'
                }`}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Coins size={16} className={isDark ? 'text-amber-400' : 'text-amber-500'} />
                    <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {tier === 'pro' ? 'Pro Brain' : 'Starter'}
                    </span>
                </div>
                {tier === 'pro' && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#21DBA4]/10 text-[#21DBA4]">
                        <Zap size={10} />
                        <span className="text-[10px] font-bold">PRO</span>
                    </div>
                )}
            </div>

            <div className="flex items-end gap-1 mb-2">
                <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {credits.toLocaleString()}
                </span>
                <span className={`text-sm mb-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    cr
                </span>
            </div>

            {creditsResetDate && (
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    다음 충전: {creditsResetDate.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                </p>
            )}

            {isLow && (
                <div className="mt-3 flex items-center gap-2 text-xs text-amber-500">
                    <AlertTriangle size={12} />
                    <span>크레딧이 부족합니다</span>
                </div>
            )}
        </div>
    );
};

export default CreditDisplay;
