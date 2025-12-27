import React from 'react';
import { Badge } from '../../components/ui/badge';

/**
 * Badge 컴포넌트
 *
 * 상태나 카테고리를 표시하는 작은 라벨 컴포넌트입니다.
 *
 * Props:
 * @param {'default' | 'secondary' | 'destructive' | 'outline' | 'brand' | 'success' | 'warning' | 'error'} variant - 배지 스타일 [Optional]
 *
 * Example usage:
 * <Badge variant="brand">NEW</Badge>
 */

export default {
    title: 'Custom Component/Badge',
    component: Badge,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
## Badge

상태, 카테고리, 라벨을 표시하는 컴포넌트입니다.

### 용도
- 상태 표시 (성공, 경고, 에러)
- 카테고리 태그
- 새로운 기능 표시
- 카운트 배지
        `,
            },
        },
    },
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'secondary', 'destructive', 'outline', 'brand', 'success', 'warning', 'error'],
            description: '배지 스타일',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'default' },
            },
        },
        children: {
            control: 'text',
            description: '배지 텍스트',
        },
    },
};

// 기본 배지
export const Default = {
    args: {
        children: 'Badge',
        variant: 'default',
    },
};

// 브랜드 배지
export const Brand = {
    args: {
        children: 'NEW',
        variant: 'brand',
    },
    parameters: {
        docs: {
            description: {
                story: 'Linkbrain 브랜드 컬러를 사용하는 배지입니다.',
            },
        },
    },
};

// 모든 Variants
export const Variants = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="brand">Brand</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '모든 배지 variant입니다. brand, success, warning, error는 시멘틱 색상을 사용합니다.',
            },
        },
    },
};

// 상태 표시
export const StatusBadges = {
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <Badge variant="success">완료</Badge>
                <span className="text-sm text-muted-foreground">작업이 성공적으로 완료되었습니다.</span>
            </div>
            <div className="flex items-center gap-2">
                <Badge variant="warning">진행 중</Badge>
                <span className="text-sm text-muted-foreground">분석이 진행 중입니다.</span>
            </div>
            <div className="flex items-center gap-2">
                <Badge variant="error">실패</Badge>
                <span className="text-sm text-muted-foreground">작업이 실패했습니다.</span>
            </div>
            <div className="flex items-center gap-2">
                <Badge variant="brand">NEW</Badge>
                <span className="text-sm text-muted-foreground">새로운 기능입니다.</span>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '상태를 나타내는 시멘틱 배지 사용 예시입니다.',
            },
        },
    },
};
