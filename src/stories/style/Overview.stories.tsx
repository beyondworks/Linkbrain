import React from 'react';
import {
    DocumentTitle,
    PageContainer,
    SectionTitle,
    CodeBlock,
} from '../../components/storybookDocumentation';

/**
 * Linkbrain Design System Overview
 *
 * 디자인 시스템의 전체적인 구조와 사용법을 설명합니다.
 */

export default {
    title: 'Style/Overview',
    parameters: {
        layout: 'padded',
    },
};

export const Default = {
    render: () => (
        <>
            <DocumentTitle
                title="Linkbrain Design System"
                status="Available"
                note="Complete design token documentation"
                brandName="Linkbrain"
                systemName="UI Kit"
                version="1.0"
            />
            <PageContainer>
                {/* 개요 */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[var(--ai-text-primary)] mb-4">
                        Linkbrain UI Kit
                    </h2>
                    <p className="text-[var(--ai-text-secondary)] leading-relaxed mb-4">
                        Linkbrain UI Kit은 <strong>Tailwind CSS v4</strong>와{' '}
                        <strong>Radix UI</strong>, <strong>shadcn/ui</strong> 패턴을
                        기반으로 구축된 디자인 시스템입니다. 일관된 사용자 경험과 빠른 개발
                        속도를 제공합니다.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 text-sm rounded-full bg-[rgba(33,219,164,0.1)] text-[#21DBA4] font-medium">
                            Tailwind CSS v4
                        </span>
                        <span className="px-3 py-1 text-sm rounded-full bg-[rgba(33,219,164,0.1)] text-[#21DBA4] font-medium">
                            Radix UI
                        </span>
                        <span className="px-3 py-1 text-sm rounded-full bg-[rgba(33,219,164,0.1)] text-[#21DBA4] font-medium">
                            CVA (class-variance-authority)
                        </span>
                        <span className="px-3 py-1 text-sm rounded-full bg-[rgba(33,219,164,0.1)] text-[#21DBA4] font-medium">
                            TypeScript
                        </span>
                    </div>
                </div>

                <SectionTitle
                    title="디자인 토큰 구조"
                    description="CSS 변수 기반의 디자인 토큰 계층"
                />
                <div className="p-4 border border-[var(--ai-border-default)] rounded-lg bg-[var(--ai-surface-1)] mb-6">
                    <pre className="text-sm font-mono text-[var(--ai-text-secondary)]">
                        {`:root
├── Brand Colors
│   ├── --ai-brand: #21DBA4
│   ├── --ai-brand-hover: #1BC290
│   └── --ai-brand-muted: rgba(33, 219, 164, 0.1)
│
├── Surface Colors
│   ├── --ai-surface-0 ~ --ai-surface-3
│   └── --background, --card, --muted
│
├── Text Colors
│   ├── --ai-text-primary
│   ├── --ai-text-secondary
│   └── --foreground, --muted-foreground
│
├── Spacing (8px base)
│   └── --ai-space-1 (4px) ~ --ai-space-16 (64px)
│
├── Typography
│   └── --ai-text-xs (12px) ~ --ai-text-4xl (36px)
│
└── Effects
    ├── --ai-shadow-sm ~ --ai-shadow-xl
    └── --ai-radius-sm ~ --ai-radius-full`}
                    </pre>
                </div>

                <SectionTitle
                    title="사용 예시"
                    description="CSS 변수와 Tailwind 클래스 활용"
                />
                <CodeBlock
                    title="CSS 변수 사용"
                    code={`/* 브랜드 컬러 적용 */
.button-primary {
  background: var(--ai-brand);
  color: #000;
}

.button-primary:hover {
  background: var(--ai-brand-hover);
}

/* Tailwind 클래스와 함께 사용 */
<div className="bg-[var(--ai-surface-1)] text-[var(--ai-text-primary)]">
  콘텐츠
</div>`}
                />

                <SectionTitle
                    title="Vibe Coding Prompt"
                    description="AI 코딩 도구에서 활용할 수 있는 프롬프트 예시"
                />
                <CodeBlock
                    theme="dark"
                    code={`/* Linkbrain 디자인 시스템 프롬프트 */

"--ai-brand (#21DBA4)를 사용해서 CTA 버튼을 만들어줘.
hover 시 --ai-brand-hover로 변경되도록 해줘."

"--ai-surface-1 배경에 --ai-border-default 보더를 가진
카드 컴포넌트를 만들어줘."

"Button 컴포넌트의 'brand' variant를 사용해서
주요 액션 버튼을 구현해줘."`}
                />

                <SectionTitle
                    title="컴포넌트 패턴"
                    description="CVA 기반 컴포넌트 구조"
                />
                <CodeBlock
                    title="Button 컴포넌트 예시"
                    code={`import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-all',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        brand: 'bg-[#21DBA4] text-black hover:bg-[#1BC290]',
        outline: 'border bg-background hover:bg-accent',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3',
        lg: 'h-10 px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);`}
                />
            </PageContainer>
        </>
    ),
};
