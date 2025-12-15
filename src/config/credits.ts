/**
 * LinkBrain Credit System Configuration
 * 
 * 크레딧 소모량 및 플랜별 제공량 정의
 */

// 액션별 크레딧 소모량
export const CREDIT_COSTS = {
    SAVE_LINK: 10,      // 링크 저장
    AI_SUMMARY: 5,      // AI 요약 생성
    AI_CHAT: 2,         // AI 채팅 메시지 1회
    AI_REPORT: 50,      // 주간/월간 리포트 생성
    AI_ARTICLE: 100,    // 아티클 발행
} as const;

// 플랜별 월간 크레딧 제공량
export const PLAN_CREDITS = {
    free: 300,
    pro: 7000,
} as const;

// 플랜별 초대 보너스
export const REFERRAL_BONUS = {
    free: 100,   // 스타터 유저가 친구 초대 시 받는 크레딧
    pro: 200,    // 프로 유저가 친구 초대 시 받는 크레딧
    welcome: 50, // 초대받은 사람이 받는 웰컴 크레딧
} as const;

// 플랜별 초대 코드 개수 제한
export const REFERRAL_LIMITS = {
    free: 5,        // 스타터는 5명까지
    pro: Infinity,  // 프로는 무제한
} as const;

// 플랜별 가격 (KRW)
export const PLAN_PRICES = {
    free: 0,
    pro: 6900,
    proYearly: 59000, // 연간 (월 4,917원 상당)
} as const;

// 크레딧 경고 임계값
export const CREDIT_WARNING_THRESHOLD = 50;

// 레이트 리밋 (분당)
export const RATE_LIMITS = {
    AI_SUMMARY: 5,    // 분당 5회
    AI_CHAT: 10,      // 분당 10회
    AI_REPORT: 1,     // 5분당 1회
    AI_ARTICLE: 1,    // 10분당 1회
} as const;

export type PlanTier = 'free' | 'pro';
export type CreditAction = keyof typeof CREDIT_COSTS;
