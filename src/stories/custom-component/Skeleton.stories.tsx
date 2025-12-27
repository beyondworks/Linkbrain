import React from 'react';

/**
 * Skeleton 스토리
 *
 * 로딩 상태를 나타내는 스켈레톤 컴포넌트입니다.
 */

export default {
    title: 'Custom Component/Skeleton',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
## Skeleton

콘텐츠 로딩 중 표시하는 플레이스홀더입니다.

### 사용법
\`\`\`tsx
import { Skeleton } from '@/components/ui/skeleton';

<Skeleton className="w-[200px] h-[20px]" />
\`\`\`
        `,
            },
        },
    },
};

export const Basic = {
    render: () => (
        <div className="space-y-4 w-[300px]">
            <div className="h-4 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2" />
        </div>
    ),
};

export const CardSkeleton = {
    render: () => (
        <div className="w-[320px] rounded-2xl border border-slate-100 bg-white overflow-hidden">
            {/* Thumbnail */}
            <div className="h-48 bg-slate-200 animate-pulse" />

            {/* Content */}
            <div className="p-5 space-y-3">
                {/* Title */}
                <div className="h-5 bg-slate-200 rounded animate-pulse" />
                <div className="h-5 bg-slate-200 rounded animate-pulse w-2/3" />

                {/* Summary */}
                <div className="space-y-2 pt-2">
                    <div className="h-3 bg-slate-100 rounded animate-pulse" />
                    <div className="h-3 bg-slate-100 rounded animate-pulse" />
                    <div className="h-3 bg-slate-100 rounded animate-pulse w-4/5" />
                </div>

                {/* Tags */}
                <div className="flex gap-2 pt-2">
                    <div className="h-6 w-16 bg-slate-100 rounded animate-pulse" />
                    <div className="h-6 w-20 bg-slate-100 rounded animate-pulse" />
                    <div className="h-6 w-14 bg-slate-100 rounded animate-pulse" />
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'LinkCard 컴포넌트의 스켈레톤입니다.',
            },
        },
    },
};

export const ListSkeleton = {
    render: () => (
        <div className="space-y-2 max-w-3xl">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 bg-white">
                    <div className="w-16 h-16 rounded-lg bg-slate-200 animate-pulse shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
                        <div className="h-3 bg-slate-100 rounded animate-pulse w-full" />
                        <div className="flex gap-2">
                            <div className="h-5 w-12 bg-slate-100 rounded animate-pulse" />
                            <div className="h-5 w-16 bg-slate-100 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'LinkRow 리스트의 스켈레톤입니다.',
            },
        },
    },
};

export const ProfileSkeleton = {
    render: () => (
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse" />
            <div className="space-y-2">
                <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '프로필 영역 스켈레톤입니다.',
            },
        },
    },
};

export const StatsSkeleton = {
    render: () => (
        <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-100 bg-white">
                    <div className="h-3 w-16 bg-slate-100 rounded animate-pulse mb-2" />
                    <div className="h-8 w-20 bg-slate-200 rounded animate-pulse" />
                </div>
            ))}
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '통계 카드 스켈레톤입니다.',
            },
        },
    },
};
