import React from 'react';
import {
    DocumentTitle,
    PageContainer,
    SectionTitle,
    TokenTable,
    CodeBlock,
} from '../../components/storybookDocumentation';

/**
 * Shadows & Radius 디자인 토큰 문서
 */

export default {
    title: 'Style/Shadows',
    parameters: {
        layout: 'padded',
    },
};

export const Default = {
    render: () => (
        <>
            <DocumentTitle
                title="Shadows & Radius"
                status="Available"
                note="Elevation and border-radius tokens"
                version="1.0"
            />
            <PageContainer>
                <p className="text-[var(--ai-text-secondary)] mb-8 leading-relaxed">
                    Stripe와 Linear에서 영감을 받은 미묘한 그림자 시스템입니다.
                    과한 elevation 대신 섬세한 깊이감을 제공합니다.
                </p>

                {/* Shadow Scale */}
                <SectionTitle
                    title="Shadow Scale"
                    description="그림자 크기 스케일"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { name: 'shadow-sm', desc: '미묘한 깊이', css: '--ai-shadow-sm' },
                        { name: 'shadow-md', desc: '카드 기본', css: '--ai-shadow-md' },
                        { name: 'shadow-lg', desc: '호버/드롭다운', css: '--ai-shadow-lg' },
                        { name: 'shadow-xl', desc: '모달', css: '--ai-shadow-xl' },
                    ].map((item) => (
                        <div
                            key={item.name}
                            className="p-6 bg-[var(--ai-surface-0)] border border-[var(--ai-border-default)] rounded-xl"
                            style={{ boxShadow: `var(${item.css})` }}
                        >
                            <p className="font-semibold text-[var(--ai-text-primary)]">{item.name}</p>
                            <p className="text-sm text-[var(--ai-text-secondary)]">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Glow Effect */}
                <SectionTitle
                    title="Brand Glow"
                    description="브랜드 강조 글로우 효과"
                />
                <div className="flex gap-4 mb-8">
                    <div
                        className="p-6 bg-[var(--ai-surface-0)] border border-[var(--ai-border-default)] rounded-xl"
                        style={{ boxShadow: 'var(--ai-shadow-glow)' }}
                    >
                        <p className="font-semibold text-[var(--ai-text-primary)]">shadow-glow</p>
                        <p className="text-sm text-[var(--ai-text-secondary)]">브랜드 강조</p>
                    </div>
                    <div
                        className="p-6 rounded-xl"
                        style={{
                            backgroundColor: '#21DBA4',
                            boxShadow: '0 0 30px rgba(33, 219, 164, 0.4)',
                        }}
                    >
                        <p className="font-semibold text-black">Brand Button</p>
                        <p className="text-sm text-black/70">호버 상태</p>
                    </div>
                </div>

                <TokenTable
                    columns={['Token', 'Value', 'Usage']}
                    rows={[
                        {
                            token: '--ai-shadow-sm',
                            value: '0 1px 2px rgba(0,0,0,0.03)',
                            description: '입력 필드, 작은 요소',
                        },
                        {
                            token: '--ai-shadow-md',
                            value: '0 4px 6px -1px rgba(0,0,0,0.05)',
                            description: '카드, 호버 상태',
                        },
                        {
                            token: '--ai-shadow-lg',
                            value: '0 10px 15px -3px rgba(0,0,0,0.05)',
                            description: '드롭다운, 팝오버',
                        },
                        {
                            token: '--ai-shadow-xl',
                            value: '0 20px 25px -5px rgba(0,0,0,0.05)',
                            description: '모달, 다이얼로그',
                        },
                        {
                            token: '--ai-shadow-glow',
                            value: '0 0 20px rgba(33,219,164,0.15)',
                            description: '브랜드 강조 효과',
                        },
                    ]}
                />

                {/* Border Radius */}
                <SectionTitle
                    title="Border Radius"
                    description="라운드 코너 스케일"
                />
                <div className="flex flex-wrap gap-6 mb-8">
                    {[
                        { name: 'radius-sm', value: '6px', class: 'rounded-sm' },
                        { name: 'radius-md', value: '8px', class: 'rounded-md' },
                        { name: 'radius-lg', value: '12px', class: 'rounded-lg' },
                        { name: 'radius-xl', value: '16px', class: 'rounded-xl' },
                        { name: 'radius-2xl', value: '20px', class: 'rounded-2xl' },
                        { name: 'radius-full', value: '9999px', class: 'rounded-full' },
                    ].map((item) => (
                        <div key={item.name} className="text-center">
                            <div
                                className="w-20 h-20 bg-[var(--ai-brand)] mb-2"
                                style={{ borderRadius: item.value }}
                            />
                            <p className="text-xs font-medium text-[var(--ai-text-primary)]">{item.name}</p>
                            <code className="text-xs text-[var(--ai-text-tertiary)]">{item.value}</code>
                        </div>
                    ))}
                </div>

                <TokenTable
                    columns={['Token', 'Value', 'Usage']}
                    rows={[
                        { token: '--ai-radius-sm', value: '6px', description: '작은 버튼, 태그' },
                        { token: '--ai-radius-md', value: '8px', description: '기본 버튼, 입력' },
                        { token: '--ai-radius-lg', value: '12px', description: '카드' },
                        { token: '--ai-radius-xl', value: '16px', description: '대형 카드' },
                        { token: '--ai-radius-2xl', value: '20px', description: '모달' },
                        { token: '--ai-radius-full', value: '9999px', description: '배지, 아바타' },
                    ]}
                />

                {/* Usage Example */}
                <SectionTitle
                    title="사용 예시"
                />
                <CodeBlock
                    title="그림자와 라운드 적용"
                    code={`/* 카드 */
<div className="rounded-xl shadow-md hover:shadow-lg transition-shadow">
  카드 콘텐츠
</div>

/* 브랜드 버튼 */
<button
  className="rounded-md"
  style={{ boxShadow: 'var(--ai-shadow-glow)' }}
>
  CTA 버튼
</button>

/* 모달 */
<div className="rounded-2xl shadow-xl">
  모달 콘텐츠
</div>

/* 아바타 */
<div className="rounded-full">
  <img src="..." />
</div>`}
                />

                {/* Vibe Coding Prompt */}
                <SectionTitle
                    title="Vibe Coding Prompt"
                />
                <CodeBlock
                    theme="dark"
                    code={`/* 그림자 & 라운드 활용 프롬프트 */

"rounded-xl과 shadow-md를 사용해서 
호버 시 shadow-lg로 변경되는 카드를 만들어줘."

"--ai-shadow-glow를 사용해서 브랜드 버튼에
호버 시 글로우 효과를 추가해줘."

"모달은 rounded-2xl shadow-xl로 만들어줘."`}
                />
            </PageContainer>
        </>
    ),
};
