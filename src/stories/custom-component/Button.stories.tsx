import React from 'react';
import { Button } from '../../components/ui/button';

/**
 * Button 컴포넌트
 *
 * CVA 기반의 다양한 variant와 size를 지원하는 버튼 컴포넌트입니다.
 *
 * Props:
 * @param {'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'brand'} variant - 버튼 스타일 [Optional, 기본값: 'default']
 * @param {'default' | 'sm' | 'lg' | 'icon'} size - 버튼 크기 [Optional, 기본값: 'default']
 * @param {boolean} disabled - 비활성화 여부 [Optional, 기본값: false]
 *
 * Example usage:
 * <Button variant="brand">저장하기</Button>
 */

export default {
    title: 'Custom Component/Button',
    component: Button,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
## Button

CVA(class-variance-authority) 기반의 버튼 컴포넌트입니다.

### 용도
- 사용자 액션 트리거
- 폼 제출
- 네비게이션
        `,
            },
        },
    },
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'brand'],
            description: '버튼 스타일 변형',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'default' },
            },
        },
        size: {
            control: 'select',
            options: ['default', 'sm', 'lg', 'icon'],
            description: '버튼 크기',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'default' },
            },
        },
        disabled: {
            control: 'boolean',
            description: '비활성화 상태',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
            },
        },
        children: {
            control: 'text',
            description: '버튼 텍스트',
        },
    },
};

// 기본 스토리
export const Default = {
    args: {
        children: '버튼',
        variant: 'default',
        size: 'default',
        disabled: false,
    },
};

// Brand 버튼 (Linkbrain 브랜드 컬러)
export const Brand = {
    args: {
        children: '저장하기',
        variant: 'brand',
        size: 'default',
    },
    parameters: {
        docs: {
            description: {
                story: 'Linkbrain 브랜드 컬러(#21DBA4)를 사용하는 CTA 버튼입니다.',
            },
        },
    },
};

// 모든 Variants
export const Variants = {
    render: () => (
        <div className="flex flex-wrap gap-4">
            <Button variant="default">Default</Button>
            <Button variant="brand">Brand</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '모든 버튼 variant를 한눈에 비교할 수 있습니다.',
            },
        },
    },
};

// 모든 Sizes
export const Sizes = {
    render: () => (
        <div className="flex items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
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
                >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                </svg>
            </Button>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '버튼 크기 옵션입니다. icon 사이즈는 정사각형 버튼에 사용합니다.',
            },
        },
    },
};

// 비활성화 상태
export const Disabled = {
    args: {
        children: '비활성화',
        disabled: true,
    },
};
