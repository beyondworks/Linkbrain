import React from 'react';
import {
    DocumentTitle,
    PageContainer,
    SectionTitle,
    TokenTable,
    CodeBlock,
} from '../../components/storybookDocumentation';

/**
 * Spacing 디자인 토큰 문서
 *
 * Linkbrain의 8px 기반 스페이싱 시스템을 문서화합니다.
 */

export default {
    title: 'Style/Spacing',
    parameters: {
        layout: 'padded',
    },
};

export const Default = {
    render: () => (
        <>
            <DocumentTitle
                title="Spacing"
                status="Available"
                note="8-point grid spacing system"
                version="1.0"
            />
            <PageContainer>
                <p className="text-[var(--ai-text-secondary)] mb-8 leading-relaxed">
                    Linkbrain은 <strong>8px 기반</strong>의 스페이싱 시스템을 사용합니다.
                    모든 간격, 마진, 패딩은 4px 또는 8px의 배수로 설정합니다.
                </p>

                {/* Spacing Scale */}
                <SectionTitle
                    title="Spacing Scale"
                    description="스페이싱 토큰 시각화"
                />
                <div className="space-y-4 mb-8">
                    {[
                        { name: 'space-1', value: '4px', tailwind: 'gap-1, p-1, m-1' },
                        { name: 'space-2', value: '8px', tailwind: 'gap-2, p-2, m-2' },
                        { name: 'space-3', value: '12px', tailwind: 'gap-3, p-3, m-3' },
                        { name: 'space-4', value: '16px', tailwind: 'gap-4, p-4, m-4' },
                        { name: 'space-5', value: '20px', tailwind: 'gap-5, p-5, m-5' },
                        { name: 'space-6', value: '24px', tailwind: 'gap-6, p-6, m-6' },
                        { name: 'space-8', value: '32px', tailwind: 'gap-8, p-8, m-8' },
                        { name: 'space-10', value: '40px', tailwind: 'gap-10, p-10, m-10' },
                        { name: 'space-12', value: '48px', tailwind: 'gap-12, p-12, m-12' },
                        { name: 'space-16', value: '64px', tailwind: 'gap-16, p-16, m-16' },
                    ].map((item) => (
                        <div
                            key={item.name}
                            className="flex items-center gap-4 pb-3 border-b border-[var(--ai-border-default)]"
                        >
                            <code className="text-xs text-[var(--ai-brand)] w-24">{item.name}</code>
                            <div
                                className="bg-[var(--ai-brand)] h-4 rounded"
                                style={{ width: item.value }}
                            />
                            <span className="text-sm text-[var(--ai-text-primary)] w-16">{item.value}</span>
                            <code className="text-xs text-[var(--ai-text-tertiary)]">{item.tailwind}</code>
                        </div>
                    ))}
                </div>

                <TokenTable
                    columns={['Token', 'Value', 'Usage']}
                    rows={[
                        { token: '--ai-space-1', value: '4px', description: '아이콘-텍스트 간격' },
                        { token: '--ai-space-2', value: '8px', description: '요소 내부 간격' },
                        { token: '--ai-space-3', value: '12px', description: '컴포넌트 내부 간격' },
                        { token: '--ai-space-4', value: '16px', description: '카드 패딩' },
                        { token: '--ai-space-6', value: '24px', description: '섹션 내부 간격' },
                        { token: '--ai-space-8', value: '32px', description: '섹션 간 간격' },
                        { token: '--ai-space-12', value: '48px', description: '페이지 섹션 간격' },
                        { token: '--ai-space-16', value: '64px', description: '대형 섹션 간격' },
                    ]}
                />

                {/* Usage Guidelines */}
                <SectionTitle
                    title="사용 가이드라인"
                    description="스페이싱 적용 원칙"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="p-4 border border-[var(--ai-border-default)] rounded-lg bg-[var(--ai-surface-1)]">
                        <h4 className="font-semibold text-[var(--ai-text-primary)] mb-3">
                            ✅ 권장 사용
                        </h4>
                        <ul className="space-y-2 text-sm text-[var(--ai-text-secondary)]">
                            <li>• <code className="text-[var(--ai-brand)]">gap-1</code> (4px): 아이콘과 텍스트</li>
                            <li>• <code className="text-[var(--ai-brand)]">gap-2</code> (8px): 버튼 내부</li>
                            <li>• <code className="text-[var(--ai-brand)]">p-4</code> (16px): 카드 패딩</li>
                            <li>• <code className="text-[var(--ai-brand)]">gap-6</code> (24px): 폼 필드 간격</li>
                            <li>• <code className="text-[var(--ai-brand)]">my-8</code> (32px): 섹션 구분</li>
                        </ul>
                    </div>
                    <div className="p-4 border border-[var(--ai-border-default)] rounded-lg bg-[var(--ai-surface-1)]">
                        <h4 className="font-semibold text-[var(--ai-text-primary)] mb-3">
                            ❌ 금지 사용
                        </h4>
                        <ul className="space-y-2 text-sm text-[var(--ai-text-secondary)]">
                            <li>• <code className="text-[#EF4444]">p-[13px]</code> - 임의 값 금지</li>
                            <li>• <code className="text-[#EF4444]">gap-[19px]</code> - 4/8 배수 아님</li>
                            <li>• <code className="text-[#EF4444]">m-7</code> - 28px는 스케일에 없음</li>
                            <li>• 간격 불일치로 인한 시각적 혼란 방지</li>
                        </ul>
                    </div>
                </div>

                {/* Usage Example */}
                <SectionTitle
                    title="사용 예시"
                />
                <CodeBlock
                    title="Tailwind 스페이싱 클래스"
                    code={`/* 카드 레이아웃 */
<div className="p-4 gap-4">
  <CardHeader className="pb-4" />
  <CardContent className="space-y-2" />
  <CardFooter className="pt-4" />
</div>

/* 폼 레이아웃 */
<form className="space-y-6">
  <div className="space-y-2">
    <Label />
    <Input />
  </div>
  <Button className="mt-4" />
</form>

/* 버튼 내부 */
<Button className="gap-2">
  <Icon size={16} />
  버튼
</Button>`}
                />

                {/* Vibe Coding Prompt */}
                <SectionTitle
                    title="Vibe Coding Prompt"
                />
                <CodeBlock
                    theme="dark"
                    code={`/* 스페이싱 활용 프롬프트 */

"8px 그리드 시스템을 기반으로 카드 컴포넌트를 만들어줘.
패딩은 p-4 (16px), 내부 요소 간격은 gap-4를 사용해줘."

"폼 필드 간격으로 space-y-6 (24px)을 사용해서
입력 그룹을 구성해줘."

"아이콘과 텍스트 사이는 gap-2 (8px)로 설정해줘."`}
                />
            </PageContainer>
        </>
    ),
};
