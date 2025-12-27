import React from 'react';

/**
 * DarkMode 스토리
 *
 * Linkbrain의 다크모드 시스템을 문서화합니다.
 */

export default {
    title: 'Style/Dark Mode',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
## Dark Mode

Linkbrain은 라이트/다크 테마를 지원합니다.

### 사용 방법
컴포넌트는 \`theme\` prop으로 현재 테마를 전달받습니다:
\`\`\`tsx
<LinkCard theme="dark" {...props} />
\`\`\`

### CSS 변수
다크모드는 CSS 변수로 자동 전환됩니다:
- \`.dark\` 클래스가 \`<html>\`에 적용되면 다크모드 활성화
        `,
            },
        },
    },
};

// 색상 비교 컴포넌트
const ColorCompare = ({ label, lightValue, darkValue, lightColor, darkColor }: {
    label: string;
    lightValue: string;
    darkValue: string;
    lightColor: string;
    darkColor: string;
}) => (
    <div className="flex items-center gap-4 py-2">
        <span className="text-sm font-medium text-slate-600 w-32">{label}</span>
        <div className="flex gap-2 items-center">
            <div className="w-8 h-8 rounded-lg border" style={{ backgroundColor: lightColor }} />
            <code className="text-xs text-slate-500">{lightValue}</code>
        </div>
        <span className="text-slate-300">→</span>
        <div className="flex gap-2 items-center">
            <div className="w-8 h-8 rounded-lg border border-slate-600" style={{ backgroundColor: darkColor }} />
            <code className="text-xs text-slate-500">{darkValue}</code>
        </div>
    </div>
);

export const ColorTokens = {
    render: () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold mb-4">배경색 (Background)</h3>
                <div className="space-y-1">
                    <ColorCompare label="--background" lightValue="#FAFAFA" darkValue="#0A0A0B" lightColor="#FAFAFA" darkColor="#0A0A0B" />
                    <ColorCompare label="--card" lightValue="#FFFFFF" darkValue="#121214" lightColor="#FFFFFF" darkColor="#121214" />
                    <ColorCompare label="--muted" lightValue="#F4F4F5" darkValue="#1A1A1D" lightColor="#F4F4F5" darkColor="#1A1A1D" />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold mb-4">텍스트색 (Text)</h3>
                <div className="space-y-1">
                    <ColorCompare label="--foreground" lightValue="#0F172A" darkValue="#FAFAFA" lightColor="#0F172A" darkColor="#FAFAFA" />
                    <ColorCompare label="--muted-foreground" lightValue="#64748B" darkValue="#A1A1AA" lightColor="#64748B" darkColor="#A1A1AA" />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold mb-4">테두리색 (Border)</h3>
                <div className="space-y-1">
                    <ColorCompare label="--border" lightValue="#E2E8F0" darkValue="#27272A" lightColor="#E2E8F0" darkColor="#27272A" />
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '라이트 ↔ 다크 모드에서 변경되는 색상 토큰입니다.',
            },
        },
    },
};

export const ComponentComparison = {
    render: () => (
        <div className="grid grid-cols-2 gap-8">
            {/* Light Mode */}
            <div className="p-6 bg-white rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-400 mb-4">LIGHT MODE</h4>
                <div className="space-y-3">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <h3 className="font-bold text-slate-800">카드 제목</h3>
                        <p className="text-sm text-slate-500">설명 텍스트입니다.</p>
                    </div>
                    <button className="w-full py-2 bg-[#21DBA4] text-white font-medium rounded-lg">
                        버튼
                    </button>
                    <div className="flex gap-2">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">태그</span>
                        <span className="px-2 py-1 bg-[#21DBA4]/10 text-[#21DBA4] text-xs rounded">브랜드</span>
                    </div>
                </div>
            </div>

            {/* Dark Mode */}
            <div className="p-6 bg-[#0A0A0B] rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-slate-500 mb-4">DARK MODE</h4>
                <div className="space-y-3">
                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                        <h3 className="font-bold text-slate-100">카드 제목</h3>
                        <p className="text-sm text-slate-400">설명 텍스트입니다.</p>
                    </div>
                    <button className="w-full py-2 bg-[#21DBA4] text-black font-medium rounded-lg">
                        버튼
                    </button>
                    <div className="flex gap-2">
                        <span className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded">태그</span>
                        <span className="px-2 py-1 bg-[#21DBA4]/20 text-[#21DBA4] text-xs rounded">브랜드</span>
                    </div>
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '동일한 컴포넌트의 라이트/다크 모드 비교입니다.',
            },
        },
    },
};

export const UsagePattern = {
    render: () => (
        <div className="max-w-2xl space-y-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-sm font-bold text-slate-700 mb-2">컴포넌트 내부 패턴</h4>
                <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                    {`// theme prop을 받아서 조건부 스타일 적용
const Card = ({ theme = 'light' }) => (
  <div className={\`
    rounded-xl border
    \${theme === 'dark' 
      ? 'bg-slate-900 border-slate-800 text-slate-100' 
      : 'bg-white border-slate-100 text-slate-800'
    }
  \`}>
    ...
  </div>
);`}
                </pre>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-sm font-bold text-slate-700 mb-2">CSS 변수 사용 (권장)</h4>
                <pre className="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                    {`// Tailwind 유틸리티 클래스 사용
<div className="bg-background text-foreground border-border">
  // 자동으로 다크모드 대응
</div>`}
                </pre>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '다크모드 구현 패턴입니다.',
            },
        },
    },
};
