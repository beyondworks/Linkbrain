import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';

/**
 * Tabs 컴포넌트
 *
 * 콘텐츠를 탭으로 구분하는 네비게이션 컴포넌트입니다.
 *
 * Example usage:
 * <Tabs defaultValue="tab1">
 *   <TabsList>
 *     <TabsTrigger value="tab1">탭 1</TabsTrigger>
 *     <TabsTrigger value="tab2">탭 2</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">내용 1</TabsContent>
 *   <TabsContent value="tab2">내용 2</TabsContent>
 * </Tabs>
 */

export default {
    title: 'Custom Component/Tabs',
    component: Tabs,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
## Tabs

콘텐츠를 탭으로 구분하는 네비게이션 컴포넌트입니다.

### 구성 요소
- \`Tabs\`: 컨테이너 (defaultValue 필수)
- \`TabsList\`: 탭 버튼 그룹
- \`TabsTrigger\`: 탭 버튼
- \`TabsContent\`: 탭 콘텐츠

### 용도
- 관련 콘텐츠 그룹화
- 설정 페이지
- 상세 정보 구분
        `,
            },
        },
    },
};

// 기본 탭
export const Default = {
    render: () => (
        <Tabs defaultValue="overview" className="w-[400px]">
            <TabsList>
                <TabsTrigger value="overview">개요</TabsTrigger>
                <TabsTrigger value="analytics">분석</TabsTrigger>
                <TabsTrigger value="settings">설정</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="p-4">
                <h3 className="font-semibold mb-2">개요</h3>
                <p className="text-sm text-muted-foreground">
                    프로젝트의 전체적인 정보를 확인하세요.
                </p>
            </TabsContent>
            <TabsContent value="analytics" className="p-4">
                <h3 className="font-semibold mb-2">분석</h3>
                <p className="text-sm text-muted-foreground">
                    상세 분석 데이터를 확인하세요.
                </p>
            </TabsContent>
            <TabsContent value="settings" className="p-4">
                <h3 className="font-semibold mb-2">설정</h3>
                <p className="text-sm text-muted-foreground">
                    프로젝트 설정을 관리하세요.
                </p>
            </TabsContent>
        </Tabs>
    ),
};

// 카드 안의 탭
export const InCard = {
    render: () => (
        <div className="w-[450px] border rounded-xl p-6 bg-card">
            <Tabs defaultValue="account">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="account">계정</TabsTrigger>
                    <TabsTrigger value="password">비밀번호</TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="mt-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">이름</label>
                        <input
                            className="w-full h-9 px-3 rounded-md border bg-background"
                            placeholder="이름을 입력하세요"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">이메일</label>
                        <input
                            className="w-full h-9 px-3 rounded-md border bg-background"
                            placeholder="email@example.com"
                        />
                    </div>
                </TabsContent>
                <TabsContent value="password" className="mt-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">현재 비밀번호</label>
                        <input
                            type="password"
                            className="w-full h-9 px-3 rounded-md border bg-background"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">새 비밀번호</label>
                        <input
                            type="password"
                            className="w-full h-9 px-3 rounded-md border bg-background"
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '카드 내에서 탭을 사용하는 예시입니다. 설정 UI에 적합합니다.',
            },
        },
    },
};
