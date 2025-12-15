/**
 * CreditContext
 * 
 * 앱 전역에서 크레딧 상태와 함수에 접근할 수 있도록 하는 Context
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useCredits, UserCredits } from '../hooks/useCredits';
import { CreditAction, PlanTier } from '../config/credits';

interface CreditContextValue {
    credits: number;
    tier: PlanTier;
    loading: boolean;
    error: string | null;
    referralCode: string;
    referralCount: number;
    creditsResetDate: Date | null;

    consumeCredits: (action: CreditAction) => Promise<{ success: boolean; error?: string }>;
    checkCredits: (action: CreditAction) => boolean;
    addCredits: (amount: number, reason: string) => Promise<void>;
    getCreditCost: (action: CreditAction) => number;
    canPerformAction: (action: CreditAction) => boolean;
    getCreditsNeeded: (action: CreditAction) => number;
}

const CreditContext = createContext<CreditContextValue | null>(null);

export const CreditProvider = ({ children }: { children: ReactNode }) => {
    const creditsHook = useCredits();

    return (
        <CreditContext.Provider value={creditsHook}>
            {children}
        </CreditContext.Provider>
    );
};

export const useCreditContext = (): CreditContextValue => {
    const context = useContext(CreditContext);
    if (!context) {
        // Return a safe fallback instead of throwing
        // This allows the app to work even if CreditProvider is not wrapped
        return {
            credits: 0,
            tier: 'free',
            loading: true,
            error: null,
            referralCode: '',
            referralCount: 0,
            creditsResetDate: null,
            consumeCredits: async () => ({ success: true }),
            checkCredits: () => true,
            addCredits: async () => { },
            getCreditCost: () => 0,
            canPerformAction: () => true,
            getCreditsNeeded: () => 0,
        };
    }
    return context;
};

export default CreditContext;
