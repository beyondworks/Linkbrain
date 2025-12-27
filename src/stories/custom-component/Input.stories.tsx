import React from 'react';
import { Input } from '../../components/ui/input';

/**
 * Input 컴포넌트
 *
 * 텍스트 입력 필드 컴포넌트입니다.
 *
 * Props:
 * @param {string} type - 입력 타입 [Optional, 기본값: 'text']
 * @param {string} placeholder - 플레이스홀더 [Optional]
 * @param {boolean} disabled - 비활성화 [Optional]
 *
 * Example usage:
 * <Input type="email" placeholder="이메일" />
 */

export default {
    title: 'Custom Component/Input',
    component: Input,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
## Input

텍스트 입력 필드 컴포넌트입니다.

### 용도
- 텍스트 입력
- 이메일, 비밀번호 입력
- 검색 필드
- 폼 요소
        `,
            },
        },
    },
    argTypes: {
        type: {
            control: 'select',
            options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
            description: '입력 타입',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'text' },
            },
        },
        placeholder: {
            control: 'text',
            description: '플레이스홀더 텍스트',
        },
        disabled: {
            control: 'boolean',
            description: '비활성화 상태',
        },
    },
};

// 기본 입력
export const Default = {
    args: {
        type: 'text',
        placeholder: '텍스트를 입력하세요',
    },
};

// 이메일 입력
export const Email = {
    args: {
        type: 'email',
        placeholder: 'email@example.com',
    },
};

// 비밀번호 입력
export const Password = {
    args: {
        type: 'password',
        placeholder: '비밀번호',
    },
};

// 비활성화
export const Disabled = {
    args: {
        placeholder: '비활성화된 입력',
        disabled: true,
    },
};

// 폼 예시
export const WithLabel = {
    render: () => (
        <div className="w-[300px] space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                이메일
            </label>
            <Input type="email" placeholder="email@example.com" />
            <p className="text-sm text-muted-foreground">
                계정에 사용할 이메일을 입력하세요.
            </p>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '라벨과 도움말 텍스트와 함께 사용하는 예시입니다.',
            },
        },
    },
};

// 검색 입력
export const Search = {
    render: () => (
        <div className="relative w-[300px]">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
            </svg>
            <Input type="search" placeholder="검색..." className="pl-9" />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '아이콘과 함께 사용하는 검색 입력 필드입니다.',
            },
        },
    },
};
