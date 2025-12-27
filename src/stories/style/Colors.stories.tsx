import React from 'react';
import {
    DocumentTitle,
    PageContainer,
    SectionTitle,
    TokenTable,
    ColorSwatch,
    CodeBlock,
} from '../../components/storybookDocumentation';

/**
 * Colors 디자인 토큰 문서
 *
 * Linkbrain의 색상 시스템을 문서화합니다.
 */

export default {
    title: 'Style/Colors',
    parameters: {
        layout: 'padded',
    },
};

export const Default = {
    render: () => (
        <>
            <DocumentTitle
                title="Colors"
                status="Available"
                note="Linkbrain color system and semantic tokens"
                version="1.0"
            />
            <PageContainer>
                <p className="text-[var(--ai-text-secondary)] mb-8 leading-relaxed">
                    Linkbrain은 CSS 변수 기반의 색상 시스템을 사용합니다.
                    브랜드 컬러 <strong>#21DBA4</strong>를 중심으로 일관된 시각적
                    계층을 구현합니다.
                </p>

                {/* Brand Colors */}
                <SectionTitle
                    title="Brand Colors"
                    description="Linkbrain 브랜드 색상"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 border border-[var(--ai-border-default)] rounded-lg">
                        <div
                            className="w-full h-20 rounded-lg mb-3"
                            style={{ backgroundColor: '#21DBA4' }}
                        />
                        <p className="font-semibold text-[var(--ai-text-primary)]">Brand</p>
                        <code className="text-xs text-[var(--ai-text-secondary)]">#21DBA4</code>
                    </div>
                    <div className="p-4 border border-[var(--ai-border-default)] rounded-lg">
                        <div
                            className="w-full h-20 rounded-lg mb-3"
                            style={{ backgroundColor: '#1BC290' }}
                        />
                        <p className="font-semibold text-[var(--ai-text-primary)]">Brand Hover</p>
                        <code className="text-xs text-[var(--ai-text-secondary)]">#1BC290</code>
                    </div>
                    <div className="p-4 border border-[var(--ai-border-default)] rounded-lg">
                        <div
                            className="w-full h-20 rounded-lg mb-3 border border-[var(--ai-border-default)]"
                            style={{ backgroundColor: 'rgba(33, 219, 164, 0.1)' }}
                        />
                        <p className="font-semibold text-[var(--ai-text-primary)]">Brand Muted</p>
                        <code className="text-xs text-[var(--ai-text-secondary)]">rgba(33, 219, 164, 0.1)</code>
                    </div>
                </div>

                <TokenTable
                    columns={['Token', 'Value', 'Description']}
                    rows={[
                        {
                            token: '--ai-brand',
                            value: '#21DBA4',
                            description: '기본 브랜드 색상',
                            preview: <ColorSwatch color="#21DBA4" size="sm" />,
                        },
                        {
                            token: '--ai-brand-hover',
                            value: '#1BC290',
                            description: '호버/활성 상태',
                            preview: <ColorSwatch color="#1BC290" size="sm" />,
                        },
                        {
                            token: '--ai-brand-muted',
                            value: 'rgba(33, 219, 164, 0.1)',
                            description: '배지, 배경 강조',
                            preview: (
                                <div
                                    className="w-6 h-6 rounded border border-[var(--ai-border-default)]"
                                    style={{ backgroundColor: 'rgba(33, 219, 164, 0.1)' }}
                                />
                            ),
                        },
                    ]}
                />

                {/* Semantic Colors */}
                <SectionTitle
                    title="Semantic Colors"
                    description="상태를 나타내는 시멘틱 색상"
                />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 border border-[var(--ai-border-default)] rounded-lg text-center">
                        <div
                            className="w-12 h-12 rounded-full mx-auto mb-3"
                            style={{ backgroundColor: '#22C55E' }}
                        />
                        <p className="font-medium text-[var(--ai-text-primary)]">Success</p>
                        <code className="text-xs text-[var(--ai-text-secondary)]">#22C55E</code>
                    </div>
                    <div className="p-4 border border-[var(--ai-border-default)] rounded-lg text-center">
                        <div
                            className="w-12 h-12 rounded-full mx-auto mb-3"
                            style={{ backgroundColor: '#F59E0B' }}
                        />
                        <p className="font-medium text-[var(--ai-text-primary)]">Warning</p>
                        <code className="text-xs text-[var(--ai-text-secondary)]">#F59E0B</code>
                    </div>
                    <div className="p-4 border border-[var(--ai-border-default)] rounded-lg text-center">
                        <div
                            className="w-12 h-12 rounded-full mx-auto mb-3"
                            style={{ backgroundColor: '#EF4444' }}
                        />
                        <p className="font-medium text-[var(--ai-text-primary)]">Error</p>
                        <code className="text-xs text-[var(--ai-text-secondary)]">#EF4444</code>
                    </div>
                    <div className="p-4 border border-[var(--ai-border-default)] rounded-lg text-center">
                        <div
                            className="w-12 h-12 rounded-full mx-auto mb-3"
                            style={{ backgroundColor: '#3B82F6' }}
                        />
                        <p className="font-medium text-[var(--ai-text-primary)]">Info</p>
                        <code className="text-xs text-[var(--ai-text-secondary)]">#3B82F6</code>
                    </div>
                </div>

                {/* Surface Colors */}
                <SectionTitle
                    title="Surface Colors"
                    description="배경 및 표면 색상 (라이트 모드)"
                />
                <TokenTable
                    rows={[
                        {
                            token: '--ai-surface-0',
                            value: '#FFFFFF',
                            description: '기본 배경',
                            preview: (
                                <div
                                    className="w-6 h-6 rounded border border-[var(--ai-border-default)]"
                                    style={{ backgroundColor: '#FFFFFF' }}
                                />
                            ),
                        },
                        {
                            token: '--ai-surface-1',
                            value: '#FAFAFA',
                            description: '카드 배경',
                            preview: <ColorSwatch color="#FAFAFA" size="sm" />,
                        },
                        {
                            token: '--ai-surface-2',
                            value: '#F5F5F5',
                            description: '입력 배경',
                            preview: <ColorSwatch color="#F5F5F5" size="sm" />,
                        },
                        {
                            token: '--ai-surface-3',
                            value: '#EEEEEE',
                            description: '호버 배경',
                            preview: <ColorSwatch color="#EEEEEE" size="sm" />,
                        },
                    ]}
                />

                {/* Text Colors */}
                <SectionTitle
                    title="Text Colors"
                    description="텍스트 색상 계층"
                />
                <TokenTable
                    rows={[
                        {
                            token: '--ai-text-primary',
                            value: '#0F172A',
                            description: '주요 텍스트',
                            preview: <ColorSwatch color="#0F172A" size="sm" />,
                        },
                        {
                            token: '--ai-text-secondary',
                            value: '#475569',
                            description: '보조 텍스트',
                            preview: <ColorSwatch color="#475569" size="sm" />,
                        },
                        {
                            token: '--ai-text-tertiary',
                            value: '#94A3B8',
                            description: '플레이스홀더, 힌트',
                            preview: <ColorSwatch color="#94A3B8" size="sm" />,
                        },
                        {
                            token: '--ai-text-disabled',
                            value: '#CBD5E1',
                            description: '비활성 텍스트',
                            preview: <ColorSwatch color="#CBD5E1" size="sm" />,
                        },
                    ]}
                />

                {/* Usage Example */}
                <SectionTitle
                    title="사용 예시"
                    description="CSS 변수 활용법"
                />
                <CodeBlock
                    title="Tailwind 클래스에서 CSS 변수 사용"
                    code={`/* 브랜드 배경 */
<button className="bg-[var(--ai-brand)] text-black">
  버튼
</button>

/* 표면 색상 */
<div className="bg-[var(--ai-surface-1)] border-[var(--ai-border-default)]">
  카드
</div>

/* 텍스트 계층 */
<h1 className="text-[var(--ai-text-primary)]">제목</h1>
<p className="text-[var(--ai-text-secondary)]">설명</p>`}
                />

                {/* Vibe Coding Prompt */}
                <SectionTitle
                    title="Vibe Coding Prompt"
                    description="AI 코딩 도구 활용 프롬프트"
                />
                <CodeBlock
                    theme="dark"
                    code={`/* 색상 토큰 활용 프롬프트 */

"--ai-brand (#21DBA4)를 사용해서 CTA 버튼을 만들어줘.
hover 시 --ai-brand-hover (#1BC290)로 변경되어야 해."

"--ai-text-primary와 --ai-text-secondary를 사용해서
카드 제목과 설명의 색상을 구분해줘."

"--ai-surface-1 배경에 --ai-border-default 보더를 가진
선택된 상태의 카드를 만들어줘."`}
                />
            </PageContainer>
        </>
    ),
};
