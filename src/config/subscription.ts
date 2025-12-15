/**
 * Subscription Configuration
 * 
 * 구독 시스템 상수 및 설정
 */

// 플랜 타입
export type PlanType = 'trial' | 'pro';

// 구독 상수
export const SUBSCRIPTION_CONFIG = {
    // 체험판 설정
    TRIAL: {
        DURATION_DAYS: 15,           // 기본 체험 기간
        INVITE_CODES_COUNT: 5,       // 발급되는 초대 코드 수
        EXTENSION_DAYS_PER_INVITE: 2, // 초대 성공 시 연장 일수
    },

    // Pro 플랜 설정
    PRO: {
        MONTHLY_PRICE_KRW: 7900,     // 월 구독료 (원)
        MONTHLY_PRICE_USD: 6,        // 월 구독료 (달러)
        YEARLY_PRICE_KRW: 79000,     // 연 구독료 (원) - 2개월 무료
        YEARLY_PRICE_USD: 60,        // 연 구독료 (달러)
    },

    // 초대 코드 설정
    INVITE_CODE: {
        PREFIX: 'LB',                // 코드 접두사
        LENGTH: 6,                   // 코드 길이 (접두사 제외)
        CHARSET: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', // 혼동 없는 문자셋
    },
};

// 초대 코드 인터페이스
export interface InviteCode {
    code: string;
    usedBy: string | null;
    usedAt: string | null;
    createdAt: string;
}

// 구독 정보 인터페이스
export interface SubscriptionData {
    plan: PlanType;
    trialStartDate: string;
    trialEndDate: string;
    referredBy: string | null;
    inviteCodes: InviteCode[];
    referralCount: number;
    proStartDate: string | null;
    proEndDate: string | null;
}

// 초대 코드 생성 함수
export const generateInviteCode = (): string => {
    const { PREFIX, LENGTH, CHARSET } = SUBSCRIPTION_CONFIG.INVITE_CODE;
    let code = '';
    for (let i = 0; i < LENGTH; i++) {
        code += CHARSET.charAt(Math.floor(Math.random() * CHARSET.length));
    }
    return `${PREFIX}-${code}`;
};

// 초기 구독 데이터 생성 (신규 가입 시)
export const createInitialSubscription = (referredBy: string | null = null): SubscriptionData => {
    const now = new Date();
    const trialEnd = new Date(now);
    trialEnd.setDate(trialEnd.getDate() + SUBSCRIPTION_CONFIG.TRIAL.DURATION_DAYS);

    // 초대 코드 5개 생성
    const inviteCodes: InviteCode[] = [];
    for (let i = 0; i < SUBSCRIPTION_CONFIG.TRIAL.INVITE_CODES_COUNT; i++) {
        inviteCodes.push({
            code: generateInviteCode(),
            usedBy: null,
            usedAt: null,
            createdAt: now.toISOString(),
        });
    }

    return {
        plan: 'trial',
        trialStartDate: now.toISOString(),
        trialEndDate: trialEnd.toISOString(),
        referredBy,
        inviteCodes,
        referralCount: 0,
        proStartDate: null,
        proEndDate: null,
    };
};

// 체험 기간 연장 (초대 성공 시)
export const extendTrialPeriod = (currentEndDate: string): string => {
    const endDate = new Date(currentEndDate);
    endDate.setDate(endDate.getDate() + SUBSCRIPTION_CONFIG.TRIAL.EXTENSION_DAYS_PER_INVITE);
    return endDate.toISOString();
};

// 체험 만료 여부 확인
export const isTrialExpired = (trialEndDate: string): boolean => {
    return new Date() > new Date(trialEndDate);
};

// 남은 체험 일수 계산
export const getRemainingTrialDays = (trialEndDate: string): number => {
    const now = new Date();
    const end = new Date(trialEndDate);
    const diff = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};
