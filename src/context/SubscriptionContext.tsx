/**
 * SubscriptionContext
 * 
 * 앱 전역에서 구독 상태에 접근할 수 있도록 하는 Context
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useSubscription, UseSubscriptionReturn } from '../hooks/useSubscription';

const SubscriptionContext = createContext<UseSubscriptionReturn | null>(null);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
    const subscriptionHook = useSubscription();

    return (
        <SubscriptionContext.Provider value={subscriptionHook}>
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscriptionContext = (): UseSubscriptionReturn => {
    const context = useContext(SubscriptionContext);
    if (!context) {
        // Return a safe fallback for when provider is not wrapped
        return {
            subscription: null,
            loading: true,
            error: null,
            isActive: false,
            isPro: false,
            isTrial: false,
            isExpired: false,
            remainingDays: 0,
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
