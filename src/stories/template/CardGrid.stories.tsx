import React from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

/**
 * CardGrid 템플릿
 *
 * 반응형 카드 그리드 레이아웃 템플릿입니다.
 */

export default {
    title: 'Template/CardGrid',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
## CardGrid Template

대시보드, 갤러리 등에 사용할 수 있는 반응형 카드 그리드입니다.

### 용도
- 대시보드 통계
- 링크 카드 목록
- 컬렉션 그리드
        `,
            },
        },
    },
};

const sampleLinks = [
    {
        id: 1,
        title: 'Tailwind CSS v4.0 출시',
        description: 'Tailwind CSS의 새로운 버전이 출시되었습니다. 주요 변경사항을 확인해보세요.',
        url: 'tailwindcss.com',
        category: '개발',
        isNew: true,
    },
    {
        id: 2,
        title: 'React 19 업데이트',
        description: 'React 19의 새로운 기능과 개선사항을 살펴봅니다.',
        url: 'react.dev',
        category: '개발',
        isNew: false,
    },
    {
        id: 3,
        title: 'AI 프로덕트 디자인 트렌드',
        description: '2024년 AI 기반 프로덕트의 UX 디자인 트렌드를 분석합니다.',
        url: 'medium.com',
        category: '디자인',
        isNew: true,
    },
    {
        id: 4,
        title: 'Figma Dev Mode 활용법',
        description: '개발자를 위한 Figma Dev Mode 효율적 활용 가이드.',
        url: 'figma.com',
        category: '디자인',
        isNew: false,
    },
    {
        id: 5,
        title: 'Vercel AI SDK 시작하기',
        description: 'AI 앱 개발을 위한 Vercel AI SDK 퀵스타트 가이드.',
        url: 'vercel.com',
        category: 'AI',
        isNew: true,
    },
    {
        id: 6,
        title: 'TypeScript 5.4 새 기능',
        description: 'TypeScript 5.4에서 추가된 주요 기능들을 알아봅니다.',
        url: 'typescriptlang.org',
        category: '개발',
        isNew: false,
    },
];

const categoryColors: Record<string, string> = {
    '개발': 'brand',
    '디자인': 'secondary',
    'AI': 'success',
};

export const Default = {
    render: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleLinks.map((link) => (
                <Card key={link.id} className="hover:border-[#21DBA4] transition-colors cursor-pointer">
                    <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                                <Badge variant={categoryColors[link.category] as any}>
                                    {link.category}
                                </Badge>
                                {link.isNew && <Badge variant="brand">NEW</Badge>}
                            </div>
                        </div>
                        <CardTitle className="text-base mt-2">{link.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                            {link.description}
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="text-xs text-muted-foreground">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                        >
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                        {link.url}
                    </CardFooter>
                </Card>
            ))}
        </div>
    ),
};

export const StatGrid = {
    render: () => (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
                { label: '총 클립', value: '1,234', change: '+12%', positive: true },
                { label: '이번 주', value: '56', change: '+8%', positive: true },
                { label: '컬렉션', value: '12', change: '0%', positive: true },
                { label: '카테고리', value: '8', change: '-2', positive: false },
            ].map((stat) => (
                <Card key={stat.label}>
                    <CardHeader className="pb-2">
                        <CardDescription>{stat.label}</CardDescription>
                        <CardTitle className="text-3xl font-bold">{stat.value}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span
                            className={`text-xs font-medium ${stat.positive ? 'text-[#21DBA4]' : 'text-[#EF4444]'
                                }`}
                        >
                            {stat.change}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">지난 주 대비</span>
                    </CardContent>
                </Card>
            ))}
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '대시보드 통계 표시용 그리드입니다.',
            },
        },
    },
};

export const EmptyState = {
    render: () => (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">아직 클립이 없습니다</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                링크를 저장하면 이곳에 표시됩니다.
                브라우저 확장 프로그램을 사용하거나 직접 추가해보세요.
            </p>
            <Button variant="brand">
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
                    className="mr-2"
                >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                </svg>
                첫 클립 추가하기
            </Button>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '데이터가 없을 때 표시하는 빈 상태 화면입니다.',
            },
        },
    },
};
