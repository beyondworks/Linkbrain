import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn - 클래스명 병합 유틸리티
 *
 * Tailwind CSS 클래스를 안전하게 병합합니다.
 * 중복되는 유틸리티 클래스를 자동으로 해결합니다.
 *
 * @param inputs - 병합할 클래스명들
 * @returns 병합된 클래스명 문자열
 *
 * Example usage:
 * cn('p-4 bg-red-500', condition && 'bg-blue-500')
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
