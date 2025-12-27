import React from 'react';
import {
    DocumentTitle,
    PageContainer,
    SectionTitle,
    TokenTable,
    CodeBlock,
} from '../../components/storybookDocumentation';

/**
 * Typography 디자인 토큰 문서
 *
 * Linkbrain의 타이포그래피 시스템을 문서화합니다.
 */

export default {
    title: 'Style/Typography',
    parameters: {
        layout: 'padded',
    },
};

export const Default = {
    render: () => (
        <>
            <DocumentTitle
                title="Typography"
                status="Available"
                note="Pretendard font system and text scales"
                version="1.0"
            />
            <PageContainer>
                <p className="text-[var(--ai-text-secondary)] mb-8 leading-relaxed">
                    Linkbrain은 <strong>Pretendard Variable</strong> 폰트를 사용합니다.
                    가변 폰트로 다양한 웨이트를 지원하며, 한글/영문 혼용에 최적화되어 있습니다.
                </p>

                {/* Font Family */}
                <SectionTitle
                    title="Font Family"
                    description="기본 폰트 패밀리"
                />
                <div className="p-6 border border-[var(--ai-border-default)] rounded-lg bg-[var(--ai-surface-1)] mb-8">
                    <p className="text-3xl font-medium text-[var(--ai-text-primary)] mb-4">
                        Pretendard Variable
                    </p>
                    <p className="text-lg text-[var(--ai-text-secondary)] mb-2">
                        가나다라마바사 ABCDEFG abcdefg 1234567890
                    </p>
                    <code className="text-xs text-[var(--ai-text-tertiary)]">
                        --font-sans: "Pretendard Variable", "Pretendard", -apple-system, ...
                    </code>
                </div>

                {/* Text Scale */}
                <SectionTitle
                    title="Text Scale"
                    description="타이포그래피 크기 스케일 (1.25 ratio)"
                />
                <div className="space-y-4 mb-8">
                    <div className="flex items-baseline gap-4 pb-3 border-b border-[var(--ai-border-default)]">
                        <code className="text-xs text-[var(--ai-brand)] w-24">text-xs</code>
                        <span className="text-xs text-[var(--ai-text-primary)]">12px - Caption 캡션</span>
                    </div>
                    <div className="flex items-baseline gap-4 pb-3 border-b border-[var(--ai-border-default)]">
                        <code className="text-xs text-[var(--ai-brand)] w-24">text-sm</code>
                        <span className="text-sm text-[var(--ai-text-primary)]">14px - Small 보조 텍스트</span>
                    </div>
                    <div className="flex items-baseline gap-4 pb-3 border-b border-[var(--ai-border-default)]">
                        <code className="text-xs text-[var(--ai-brand)] w-24">text-base</code>
                        <span className="text-base text-[var(--ai-text-primary)]">16px - Base 기본 본문</span>
                    </div>
                    <div className="flex items-baseline gap-4 pb-3 border-b border-[var(--ai-border-default)]">
                        <code className="text-xs text-[var(--ai-brand)] w-24">text-lg</code>
                        <span className="text-lg text-[var(--ai-text-primary)]">18px - Large 강조 텍스트</span>
                    </div>
                    <div className="flex items-baseline gap-4 pb-3 border-b border-[var(--ai-border-default)]">
                        <code className="text-xs text-[var(--ai-brand)] w-24">text-xl</code>
                        <span className="text-xl text-[var(--ai-text-primary)]">20px - XL 카드 제목</span>
                    </div>
                    <div className="flex items-baseline gap-4 pb-3 border-b border-[var(--ai-border-default)]">
                        <code className="text-xs text-[var(--ai-brand)] w-24">text-2xl</code>
                        <span className="text-2xl text-[var(--ai-text-primary)]">24px - 2XL 섹션 제목</span>
                    </div>
                    <div className="flex items-baseline gap-4 pb-3 border-b border-[var(--ai-border-default)]">
                        <code className="text-xs text-[var(--ai-brand)] w-24">text-3xl</code>
                        <span className="text-3xl text-[var(--ai-text-primary)]">30px - 3XL 페이지 제목</span>
                    </div>
                    <div className="flex items-baseline gap-4">
                        <code className="text-xs text-[var(--ai-brand)] w-24">text-4xl</code>
                        <span className="text-4xl text-[var(--ai-text-primary)]">36px - 4XL 히어로</span>
                    </div>
                </div>

                <TokenTable
                    columns={['Token', 'Value', 'Usage']}
                    rows={[
                        { token: '--ai-text-xs', value: '0.75rem (12px)', description: '캡션, 타임스탬프, 배지' },
                        { token: '--ai-text-sm', value: '0.875rem (14px)', description: '보조 본문, 설명' },
                        { token: '--ai-text-base', value: '1rem (16px)', description: '기본 본문' },
                        { token: '--ai-text-lg', value: '1.125rem (18px)', description: '카드 제목, 강조' },
                        { token: '--ai-text-xl', value: '1.25rem (20px)', description: '섹션 제목' },
                        { token: '--ai-text-2xl', value: '1.5rem (24px)', description: '페이지 제목' },
                        { token: '--ai-text-3xl', value: '1.875rem (30px)', description: '대형 제목' },
                        { token: '--ai-text-4xl', value: '2.25rem (36px)', description: '히어로 제목' },
                    ]}
                />

                {/* Font Weight */}
                <SectionTitle
                    title="Font Weight"
                    description="폰트 웨이트"
                />
                <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-4 pb-3 border-b border-[var(--ai-border-default)]">
                        <code className="text-xs text-[var(--ai-brand)] w-32">font-normal</code>
                        <span className="text-lg font-normal text-[var(--ai-text-primary)]">400 - Regular 본문</span>
                    </div>
                    <div className="flex items-center gap-4 pb-3 border-b border-[var(--ai-border-default)]">
                        <code className="text-xs text-[var(--ai-brand)] w-32">font-medium</code>
                        <span className="text-lg font-medium text-[var(--ai-text-primary)]">500 - Medium 라벨, 버튼</span>
                    </div>
                    <div className="flex items-center gap-4 pb-3 border-b border-[var(--ai-border-default)]">
                        <code className="text-xs text-[var(--ai-brand)] w-32">font-semibold</code>
                        <span className="text-lg font-semibold text-[var(--ai-text-primary)]">600 - Semibold 강조</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <code className="text-xs text-[var(--ai-brand)] w-32">font-bold</code>
                        <span className="text-lg font-bold text-[var(--ai-text-primary)]">700 - Bold 제목</span>
                    </div>
                </div>

                {/* Usage Example */}
                <SectionTitle
                    title="사용 예시"
                    description="Tailwind 클래스 활용"
                />
                <CodeBlock
                    title="타이포그래피 적용"
                    code={`/* 텍스트 크기 */
<h1 className="text-3xl font-bold">페이지 제목</h1>
<h2 className="text-xl font-semibold">섹션 제목</h2>
<p className="text-base font-normal">본문 텍스트</p>
<span className="text-sm text-muted-foreground">보조 텍스트</span>

/* 색상과 함께 */
<h1 className="text-2xl font-bold text-[var(--ai-text-primary)]">
  제목
</h1>
<p className="text-sm text-[var(--ai-text-secondary)]">
  설명 텍스트
</p>`}
                />

                {/* Vibe Coding Prompt */}
                <SectionTitle
                    title="Vibe Coding Prompt"
                />
                <CodeBlock
                    theme="dark"
                    code={`/* 타이포그래피 활용 프롬프트 */

"text-2xl font-bold를 사용해서 카드 제목을 만들어줘.
제목 아래에 text-sm text-muted-foreground로 설명을 추가해줘."

"Pretendard 폰트를 사용해서 한글과 영문이 자연스럽게
어울리는 히어로 섹션을 만들어줘."`}
                />
            </PageContainer>
        </>
    ),
};
