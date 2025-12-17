/**
 * SubscriptionContext
 * 
 * 앱 전역에서 구독 상태에 접근할 수 있도록 하는 Context
 */

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useSubscription, SubscriptionState as BaseSubscriptionState } from '../hooks/useSubscription';

// Extended return type with computed properties
export interface SubscriptionContextValue extends BaseSubscriptionState {
    isPro: boolean;
    isTrial: boolean;
    isExpired: boolean;
    isActive: boolean;
    // Legacy support
    subscription: BaseSubscriptionState | null;
    inviteCodes: any[];
    usedCodesCount: number;
    initializeSubscription: () => Promise<void>;
    upgradeToPro: () => Promise<void>;
    markInviteCodeUsed: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
    const subscriptionState = useSubscription();

    // Compute derived values
    const contextValue = useMemo<SubscriptionContextValue>(() => {
        // isPro is true for 'pro' OR 'master' tier
        const isPro = subscriptionState.tier === 'pro' || subscriptionState.tier === 'master' || subscriptionState.isMaster;
        const isTrial = subscriptionState.status === 'trial';
        const isExpired = subscriptionState.status === 'expired';
        const isActive = subscriptionState.status === 'active' || (!isExpired && isTrial);

        return {
            ...subscriptionState,
            isPro,
            isTrial,
            isExpired,
            isActive,
            // Legacy support
            subscription: subscriptionState,
            inviteCodes: [],
            usedCodesCount: 0,
            initializeSubscription: async () => { },
            upgradeToPro: async () => { },
            markInviteCodeUsed: async () => { },
        };
    }, [subscriptionState]);

    return (
        <SubscriptionContext.Provider value={contextValue}>
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscriptionContext = (): SubscriptionContextValue => {
    const context = useContext(SubscriptionContext);
    if (!context) {
        // Return a safe fallback for when provider is not wrapped
        return {
            status: 'trial',
            tier: 'free',
            trialStartDate: null,
            remainingDays: 0,
            isReadOnly: false,
            canCreate: true,
            canEdit: true,
            canUseAI: true,
            loading: true,
            isMaster: false,
            // Computed
            isPro: false,
            isTrial: true,
            isExpired: false,
            isActive: true,
            // Legacy
            subscription: null,
            inviteCodes: [],
            usedCodesCount: 0,
            initializeSubscription: async () => { },
            upgradeToPro: async () => { },
            markInviteCodeUsed: async () => { },
        };
    }
    return context;
};

export default SubscriptionContext;
