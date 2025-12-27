import React from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';

/**
 * Card 컴포넌트
 *
 * 관련 콘텐츠를 그룹화하는 컨테이너 컴포넌트입니다.
 *
 * Example usage:
 * <Card>
 *   <CardHeader>
 *     <CardTitle>제목</CardTitle>
 *     <CardDescription>설명</CardDescription>
 *   </CardHeader>
 *   <CardContent>내용</CardContent>
 *   <CardFooter>푸터</CardFooter>
 * </Card>
 */

export default {
    title: 'Custom Component/Card',
    component: Card,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
## Card

콘텐츠를 그룹화하는 카드 컴포넌트입니다.

### 구성 요소
- \`Card\`: 컨테이너
- \`CardHeader\`: 헤더 영역
- \`CardTitle\`: 제목
- \`CardDescription\`: 설명
- \`CardContent\`: 본문
- \`CardFooter\`: 푸터

### 용도
- 정보 그룹화
- 리스트 아이템
- 대시보드 위젯
        `,
            },
        },
    },
    argTypes: {
        className: {
            control: 'text',
            description: '추가 클래스명',
        },
    },
};

// 기본 카드
export const Default = {
    render: () => (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>카드 제목</CardTitle>
                <CardDescription>카드에 대한 설명입니다.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    카드 본문 내용이 여기에 들어갑니다.
                    다양한 콘텐츠를 포함할 수 있습니다.
                </p>
            </CardContent>
            <CardFooter>
                <Button variant="brand" className="w-full">액션 버튼</Button>
            </CardFooter>
        </Card>
    ),
};

// 간단한 카드
export const Simple = {
    render: () => (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>간단한 카드</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    헤더와 콘텐츠만 있는 간단한 카드입니다.
                </p>
            </CardContent>
        </Card>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Footer 없이 간단하게 사용할 수 있습니다.',
            },
        },
    },
};

// 통계 카드
export const StatCard = {
    render: () => (
        <Card className="w-[200px]">
            <CardHeader className="pb-2">
                <CardDescription>총 클립</CardDescription>
                <CardTitle className="text-3xl font-bold">1,234</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-muted-foreground">
                    <span className="text-[#21DBA4]">+12%</span> 지난 주 대비
                </p>
            </CardContent>
        </Card>
    ),
    parameters: {
        docs: {
            description: {
                story: '대시보드 통계 표시용 카드입니다.',
            },
        },
    },
};

// 카드 그리드
export const CardGrid = {
    render: () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
                <Card key={i}>
                    <CardHeader>
                        <CardTitle>카드 {i}</CardTitle>
                        <CardDescription>카드 설명</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            카드 내용입니다.
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    ),
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                story: '그리드 레이아웃에서 카드를 배치하는 예시입니다.',
            },
        },
    },
};
