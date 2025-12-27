import React from 'react';

/**
 * Layout Patterns 스토리
 *
 * Linkbrain에서 2회 이상 사용되는 레이아웃 패턴입니다.
 */

export default {
    title: 'Style/Layout Patterns',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
## Layout Patterns

Linkbrain UI에서 반복 사용되는 레이아웃 패턴입니다.
컴포넌트화하여 일관성을 유지합니다.

### 발견된 주요 패턴
- **SectionHeader**: flex items-center justify-between (50+ 사용)
- **CardGrid**: 1-3 컬럼 반응형 그리드 (20+ 사용)
- **StatGrid**: 2-4 컬럼 통계 그리드 (10+ 사용)
- **ListItem**: flex items-center gap-3 (40+ 사용)
        `,
            },
        },
    },
};

// ============================================================
// 1. SectionHeader - 섹션 헤더 (제목 + 액션)
// ============================================================
interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}

const SectionHeader = ({ title, subtitle, action }: SectionHeaderProps) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px'
    }}>
        <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', margin: 0 }}>{title}</h3>
            {subtitle && <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
    </div>
);

export const SectionHeaderPattern = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '600px' }}>
            <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                <SectionHeader title="최근 저장" />
                <p style={{ fontSize: '14px', color: '#64748b' }}>콘텐츠 영역...</p>
            </div>

            <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                <SectionHeader
                    title="카테고리별 분석"
                    subtitle="지난 30일 기준"
                    action={
                        <button style={{
                            fontSize: '12px',
                            color: '#21DBA4',
                            fontWeight: 600,
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                        }}>
                            전체보기
                        </button>
                    }
                />
                <p style={{ fontSize: '14px', color: '#64748b' }}>콘텐츠 영역...</p>
            </div>

            <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                <SectionHeader
                    title="AI 인사이트"
                    action={
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button style={{
                                padding: '6px 12px',
                                fontSize: '12px',
                                backgroundColor: '#21DBA4',
                                color: 'white',
                                fontWeight: 600,
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}>
                                새로고침
                            </button>
                        </div>
                    }
                />
                <p style={{ fontSize: '14px', color: '#64748b' }}>콘텐츠 영역...</p>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: `
**사용 빈도**: 50+ 회

\`\`\`tsx
// 패턴
<div className="flex items-center justify-between mb-4">
  <h3>제목</h3>
  <button>액션</button>
</div>
\`\`\`
                `,
            },
        },
    },
};

// ============================================================
// 2. CardGrid - 반응형 카드 그리드
// ============================================================
const CardGridDemo = ({ cols = 3 }: { cols: 1 | 2 | 3 | 4 }) => {
    const items = Array.from({ length: 6 }, (_, i) => i + 1);

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(cols, 3)}, 1fr)`,
            gap: '16px'
        }}>
            {items.map(i => (
                <div key={i} style={{
                    padding: '16px',
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '100%',
                        height: '80px',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '8px',
                        marginBottom: '12px'
                    }} />
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>Card {i}</p>
                </div>
            ))}
        </div>
    );
};

export const CardGridPattern = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginBottom: '12px' }}>
                    3-Column Grid (기본)
                </h4>
                <CardGridDemo cols={3} />
            </div>
            <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginBottom: '12px' }}>
                    2-Column Grid
                </h4>
                <CardGridDemo cols={2} />
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: `
**사용 빈도**: 20+ 회

\`\`\`tsx
// 반응형 패턴
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => <Card key={item.id} />)}
</div>
\`\`\`
                `,
            },
        },
    },
};

// ============================================================
// 3. StatGrid - 통계 그리드
// ============================================================
const StatCard = ({ label, value, change, positive = true }: {
    label: string;
    value: string;
    change?: string;
    positive?: boolean;
}) => (
    <div style={{
        padding: '16px',
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '12px'
    }}>
        <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>{label}</p>
        <p style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b' }}>{value}</p>
        {change && (
            <p style={{
                fontSize: '12px',
                color: positive ? '#21DBA4' : '#ef4444',
                marginTop: '4px'
            }}>
                {positive ? '↑' : '↓'} {change}
            </p>
        )}
    </div>
);

export const StatGridPattern = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginBottom: '12px' }}>
                    4-Column Stats (대시보드)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    <StatCard label="총 클립" value="1,234" change="+12%" positive />
                    <StatCard label="이번 주" value="56" change="+8%" positive />
                    <StatCard label="컬렉션" value="12" />
                    <StatCard label="AI 분석" value="89" change="-5%" positive={false} />
                </div>
            </div>
            <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#64748b', marginBottom: '12px' }}>
                    2-Column Stats
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    <StatCard label="저장된 링크" value="245" />
                    <StatCard label="공유 횟수" value="18" />
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: `
**사용 빈도**: 10+ 회

\`\`\`tsx
// 4컬럼 통계
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  {stats.map(stat => <StatCard key={stat.label} />)}
</div>
\`\`\`
                `,
            },
        },
    },
};

// ============================================================
// 4. ListItem - 리스트 아이템
// ============================================================
const ListItem = ({ icon, title, subtitle, action }: {
    icon?: React.ReactNode;
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
    }}>
        {icon && (
            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b',
                flexShrink: 0
            }}>
                {icon}
            </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#1e293b',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }}>{title}</p>
            {subtitle && (
                <p style={{
                    fontSize: '12px',
                    color: '#94a3b8',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>{subtitle}</p>
            )}
        </div>
        {action}
    </div>
);

const IconFolder = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    </svg>
);

const IconChevron = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
        <path d="m9 18 6-6-6-6" />
    </svg>
);

export const ListItemPattern = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '400px' }}>
            <ListItem
                icon={<IconFolder />}
                title="개발 자료"
                subtitle="12개의 링크"
                action={<IconChevron />}
            />
            <ListItem
                icon={<IconFolder />}
                title="디자인 레퍼런스"
                subtitle="8개의 링크"
                action={<IconChevron />}
            />
            <ListItem
                icon={<IconFolder />}
                title="AI/ML 아티클"
                subtitle="23개의 링크"
                action={<IconChevron />}
            />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: `
**사용 빈도**: 40+ 회

\`\`\`tsx
// 리스트 아이템 패턴
<div className="flex items-center gap-3 p-3 rounded-xl border">
  <div className="w-10 h-10 rounded-lg bg-slate-100" />
  <div className="flex-1 min-w-0">
    <p className="font-medium truncate">Title</p>
    <p className="text-sm text-muted-foreground">Subtitle</p>
  </div>
  <ChevronRight />
</div>
\`\`\`
                `,
            },
        },
    },
};

// ============================================================
// 5. PageLayout - 페이지 레이아웃
// ============================================================
export const PageLayoutPattern = {
    render: () => (
        <div style={{
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            overflow: 'hidden',
            maxWidth: '800px'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderBottom: '1px solid #e2e8f0',
                backgroundColor: 'white'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#21DBA4'
                    }} />
                    <span style={{ fontWeight: 700, color: '#1e293b' }}>Linkbrain</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#f1f5f9'
                    }} />
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#21DBA4'
                    }} />
                </div>
            </div>

            {/* Content */}
            <div style={{
                display: 'flex',
                minHeight: '300px'
            }}>
                {/* Sidebar */}
                <div style={{
                    width: '200px',
                    padding: '16px',
                    borderRight: '1px solid #e2e8f0',
                    backgroundColor: '#fafafa'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                    }}>
                        {['홈', '클립', '컬렉션', '인사이트'].map((item, i) => (
                            <div key={item} style={{
                                padding: '8px 12px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: i === 0 ? 600 : 400,
                                color: i === 0 ? '#21DBA4' : '#64748b',
                                backgroundColor: i === 0 ? 'rgba(33, 219, 164, 0.1)' : 'transparent'
                            }}>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main */}
                <div style={{
                    flex: 1,
                    padding: '24px',
                    backgroundColor: 'white'
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: 700,
                        color: '#1e293b',
                        marginBottom: '24px'
                    }}>
                        페이지 제목
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '16px'
                    }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{
                                height: '120px',
                                backgroundColor: '#f8fafc',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0'
                            }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: `
**페이지 레이아웃 구조**

\`\`\`tsx
// 기본 페이지 구조
<div className="min-h-screen flex flex-col">
  <header className="h-16 flex items-center justify-between px-6 border-b" />
  <div className="flex flex-1">
    <aside className="w-64 border-r p-4" />
    <main className="flex-1 p-6" />
  </div>
</div>
\`\`\`
                `,
            },
        },
    },
};

// ============================================================
// 6. All Patterns Summary
// ============================================================
export const Summary = {
    render: () => (
        <div style={{ maxWidth: '600px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>
                레이아웃 패턴 요약
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ textAlign: 'left', padding: '12px 8px', color: '#64748b' }}>패턴</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px', color: '#64748b' }}>사용 빈도</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px', color: '#64748b' }}>클래스</th>
                    </tr>
                </thead>
                <tbody>
                    {[
                        { name: 'SectionHeader', count: '50+', classes: 'flex items-center justify-between' },
                        { name: 'ListItem', count: '40+', classes: 'flex items-center gap-3' },
                        { name: 'CardGrid', count: '20+', classes: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' },
                        { name: 'StatGrid', count: '10+', classes: 'grid grid-cols-2 lg:grid-cols-4' },
                        { name: 'PageLayout', count: '5+', classes: 'min-h-screen flex flex-col' },
                    ].map(pattern => (
                        <tr key={pattern.name} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '12px 8px', fontWeight: 600, color: '#1e293b' }}>
                                {pattern.name}
                            </td>
                            <td style={{ padding: '12px 8px', color: '#21DBA4', fontWeight: 600 }}>
                                {pattern.count}
                            </td>
                            <td style={{ padding: '12px 8px' }}>
                                <code style={{
                                    fontSize: '11px',
                                    backgroundColor: '#f1f5f9',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    color: '#64748b'
                                }}>
                                    {pattern.classes}
                                </code>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Linkbrain UI에서 발견된 모든 레이아웃 패턴 요약입니다.',
            },
        },
    },
};
