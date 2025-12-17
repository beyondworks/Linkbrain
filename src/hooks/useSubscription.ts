import { useState, useEffect } from 'react';
import { useClips } from './useClips';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Master accounts with full permissions regardless of subscription
const MASTER_ACCOUNTS = ['beyondworks.br@gmail.com'];

export interface SubscriptionState {
    status: 'trial' | 'active' | 'expired'; // active = paid pro
    tier: 'free' | 'pro' | 'master';
    trialStartDate: string | null; // ISO date
    proEndDate?: string | null; // Pro subscription end date
    remainingDays: number;
    isReadOnly: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canUseAI: boolean;
    loading: boolean;
    isMaster: boolean;
    referralCount?: number;
}

export type UseSubscriptionReturn = SubscriptionState;

export const useSubscription = () => {
    const { user } = useClips();
    const [subscription, setSubscription] = useState<SubscriptionState>({
        status: 'trial',
        tier: 'free',
        trialStartDate: null,
        remainingDays: 15,
        isReadOnly: false,
        canCreate: true,
        canEdit: true,
        canUseAI: true,
        loading: true,
        isMaster: false
    });

    useEffect(() => {
        if (!user) {
            setSubscription(prev => ({ ...prev, loading: false }));
            return;
        }

        // Check if user is a master account
        const isMaster = MASTER_ACCOUNTS.includes(user.email || '');

        if (isMaster) {
            // Master accounts have full permissions
            setSubscription({
                status: 'active',
                tier: 'master',
                trialStartDate: null,
                remainingDays: 999,
                isReadOnly: false,
                canCreate: true,
                canEdit: true,
                canUseAI: true,
                loading: false,
                isMaster: true
            });
            return;
        }

        const userRef = doc(db, 'users', user.uid);

        const unsubscribe = onSnapshot(userRef, async (docSnap) => {
            let data = docSnap.data();

            // Initialize user doc if missing (for existing or new users)
            if (!docSnap.exists() || !data?.trialStartDate) {
                const now = new Date().toISOString();
                // If it's a completely new doc, create it. 
                // If it exists but lacks trialStartDate, backfill it (start trial now for simplicity in MVP)
                await setDoc(userRef, {
                    email: user.email,
                    trialStartDate: now,
                    subscriptionStatus: 'trial',
                    tier: 'free'
                }, { merge: true });
                data = { ...data, trialStartDate: now, subscriptionStatus: 'trial', tier: 'free' };
            }

            const trialStartDate = new Date(data.trialStartDate);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - trialStartDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const remainingDays = Math.max(0, 15 - diffDays);

            const isPro = data.subscriptionTier === 'pro' || data.subscriptionStatus === 'active';
            const isTrialActive = remainingDays > 0;
            const isExpired = !isPro && !isTrialActive;

            setSubscription({
                status: isPro ? 'active' : (isExpired ? 'expired' : 'trial'),
                tier: isPro ? 'pro' : 'free',
                trialStartDate: data.trialStartDate,
                remainingDays: isPro ? 30 : remainingDays, // Arbitrary number for pro
                isReadOnly: isExpired,
                canCreate: isPro || !isExpired,
                canEdit: isPro || !isExpired,
                canUseAI: isPro || !isExpired,
                loading: false,
                isMaster: false
            });
        });

        return () => unsubscribe();
    }, [user]);

    return subscription;
};
