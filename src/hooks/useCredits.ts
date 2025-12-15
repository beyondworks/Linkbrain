/**
 * useCredits Hook
 * 
 * 사용자 크레딧 관리를 위한 훅
 * - 크레딧 조회, 소모, 추가
 * - Firestore 실시간 동기화
 * - 크레딧 부족 시 에러 처리
 */

import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, increment } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { CREDIT_COSTS, PLAN_CREDITS, REFERRAL_BONUS, PlanTier, CreditAction } from '../config/credits';

export interface UserCredits {
    credits: number;
    tier: PlanTier;
    creditsResetDate: string; // ISO string
    totalCreditsUsed: number;
    referralCode: string;
    referredBy?: string;
    referralCount: number;
    createdAt: string;
}

interface UseCreditsReturn {
    credits: number;
    tier: PlanTier;
    loading: boolean;
    error: string | null;
    referralCode: string;
    referralCount: number;
    creditsResetDate: Date | null;

    // Actions
    consumeCredits: (action: CreditAction) => Promise<{ success: boolean; error?: string }>;
    checkCredits: (action: CreditAction) => boolean;
    addCredits: (amount: number, reason: string) => Promise<void>;
    getCreditCost: (action: CreditAction) => number;

    // Helpers
    canPerformAction: (action: CreditAction) => boolean;
    getCreditsNeeded: (action: CreditAction) => number;
}

// 고유 초대 코드 생성
const generateReferralCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'LB-';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

// 다음 월 1일 계산
const getNextResetDate = (): Date => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth;
};

export const useCredits = (): UseCreditsReturn => {
    const [credits, setCredits] = useState<number>(0);
    const [tier, setTier] = useState<PlanTier>('free');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [referralCode, setReferralCode] = useState<string>('');
    const [referralCount, setReferralCount] = useState<number>(0);
    const [creditsResetDate, setCreditsResetDate] = useState<Date | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    // 인증 상태 감지
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
                setCredits(0);
                setTier('free');
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    // 크레딧 문서 실시간 리스너
    useEffect(() => {
        if (!userId) return;

        const creditsRef = doc(db, 'users', userId, 'settings', 'credits');

        const unsubscribe = onSnapshot(creditsRef, async (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data() as UserCredits;

                // 리셋 날짜 확인 및 자동 리셋
                const resetDate = new Date(data.creditsResetDate);
                if (new Date() >= resetDate) {
                    // 크레딧 리셋 필요
                    await resetCredits(userId, data.tier);
                } else {
                    setCredits(data.credits);
                    setTier(data.tier);
                    setReferralCode(data.referralCode);
                    setReferralCount(data.referralCount);
                    setCreditsResetDate(resetDate);
                }
            } else {
                // 새 유저 - 크레딧 문서 초기화
                await initializeCredits(userId);
            }
            setLoading(false);
        }, (err) => {
            console.error('[useCredits] Error:', err);
            setError(err.message);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    // 새 유저 크레딧 초기화
    const initializeCredits = async (uid: string) => {
        const creditsRef = doc(db, 'users', uid, 'settings', 'credits');
        const initialCredits: UserCredits = {
            credits: PLAN_CREDITS.free,
            tier: 'free',
            creditsResetDate: getNextResetDate().toISOString(),
            totalCreditsUsed: 0,
            referralCode: generateReferralCode(),
            referralCount: 0,
            createdAt: new Date().toISOString(),
        };

        await setDoc(creditsRef, initialCredits);
        setCredits(initialCredits.credits);
        setTier(initialCredits.tier);
        setReferralCode(initialCredits.referralCode);
        setCreditsResetDate(new Date(initialCredits.creditsResetDate));
    };

    // 월간 크레딧 리셋
    const resetCredits = async (uid: string, currentTier: PlanTier) => {
        const creditsRef = doc(db, 'users', uid, 'settings', 'credits');
        const newCredits = PLAN_CREDITS[currentTier];
        const nextReset = getNextResetDate();

        await updateDoc(creditsRef, {
            credits: newCredits,
            creditsResetDate: nextReset.toISOString(),
        });

        setCredits(newCredits);
        setCreditsResetDate(nextReset);
    };

    // 크레딧 소모
    const consumeCredits = useCallback(async (action: CreditAction): Promise<{ success: boolean; error?: string }> => {
        if (!userId) {
            return { success: false, error: '로그인이 필요합니다.' };
        }

        const cost = CREDIT_COSTS[action];

        if (credits < cost) {
            return {
                success: false,
                error: `크레딧이 부족합니다. (필요: ${cost}cr, 보유: ${credits}cr)`
            };
        }

        try {
            const creditsRef = doc(db, 'users', userId, 'settings', 'credits');
            await updateDoc(creditsRef, {
                credits: increment(-cost),
                totalCreditsUsed: increment(cost),
            });

            // 로컬 상태 즉시 업데이트 (옵티미스틱)
            setCredits(prev => prev - cost);

            return { success: true };
        } catch (err: any) {
            console.error('[useCredits] Consume error:', err);
            return { success: false, error: err.message };
        }
    }, [userId, credits]);

    // 크레딧 잔액 확인
    const checkCredits = useCallback((action: CreditAction): boolean => {
        return credits >= CREDIT_COSTS[action];
    }, [credits]);

    // 크레딧 추가 (레퍼럴 보너스 등)
    const addCredits = useCallback(async (amount: number, reason: string) => {
        if (!userId) return;

        try {
            const creditsRef = doc(db, 'users', userId, 'settings', 'credits');
            await updateDoc(creditsRef, {
                credits: increment(amount),
            });

            console.log(`[useCredits] Added ${amount}cr for: ${reason}`);
        } catch (err: any) {
            console.error('[useCredits] Add credits error:', err);
        }
    }, [userId]);

    // 액션별 크레딧 비용 조회
    const getCreditCost = useCallback((action: CreditAction): number => {
        return CREDIT_COSTS[action];
    }, []);

    // 액션 수행 가능 여부
    const canPerformAction = useCallback((action: CreditAction): boolean => {
        return credits >= CREDIT_COSTS[action];
    }, [credits]);

    // 액션에 필요한 추가 크레딧
    const getCreditsNeeded = useCallback((action: CreditAction): number => {
        const cost = CREDIT_COSTS[action];
        return Math.max(0, cost - credits);
    }, [credits]);

    return {
        credits,
        tier,
        loading,
        error,
        referralCode,
        referralCount,
        creditsResetDate,
        consumeCredits,
        checkCredits,
        addCredits,
        getCreditCost,
        canPerformAction,
        getCreditsNeeded,
    };
};

export default useCredits;
