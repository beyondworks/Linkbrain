import React from 'react';

/**
 * AI Insights Components 스토리
 *
 * AI 인사이트 페이지에서 사용되는 컴포넌트들입니다.
 */

export default {
    title: 'Custom Component/AI Insights',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
## AI Insights Components

AI 인사이트 페이지에서 사용되는 컴포넌트 모음입니다.

- **BarGauge**: 태그별 열람율 표시
- **ContentStudioSearch**: 콘텐츠 생성 스튜디오 검색 컨테이너
- **OutputTypeSelector**: 출력 형태 선택 버튼
        `,
            },
        },
    },
};

// SVG Icons
const ZapIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);

const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    </svg>
);

const FilterIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
);

const FileTextIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const FileBarChartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="8" y2="18" />
        <line x1="12" y1="11" x2="12" y2="18" />
        <line x1="16" y1="15" x2="16" y2="18" />
    </svg>
);

const SparklesIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" />
        <path d="M19 17v4" />
        <path d="M3 5h4" />
        <path d="M17 19h4" />
    </svg>
);

const PenToolIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m12 19 7-7 3 3-7 7-3-3z" />
        <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="m2 2 7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
    </svg>
);

// ============================================================
// 1. BarGauge - 태그별 열람율 바 게이지
// ============================================================
interface BarGaugeProps {
    label: string;
    value: number;
    maxValue?: number;
    showPercent?: boolean;
}

const BarGauge = ({ label, value, maxValue = 100, showPercent = true }: BarGaugeProps) => {
    const percentage = Math.min((value / maxValue) * 100, 100);
    const intensity = 0.3 + (percentage / 100) * 0.7;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{
                width: '80px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#1e293b',
                flexShrink: 0
            }}>
                {label}
            </span>
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <div style={{
                    flex: 1,
                    height: '12px',
                    backgroundColor: '#e2e8f0',
                    borderRadius: '6px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        height: '100%',
                        width: `${Math.max(percentage, 3)}%`,
                        backgroundColor: `rgba(33, 219, 164, ${intensity})`,
                        borderRadius: '6px',
                        transition: 'width 0.5s ease'
                    }} />
                </div>
                {showPercent && (
                    <span style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#1e293b',
                        width: '40px',
                        textAlign: 'right'
                    }}>
                        {Math.round(percentage)}%
                    </span>
                )}
            </div>
        </div>
    );
};

export const TagReadingRate = {
    render: () => (
        <div style={{
            maxWidth: '500px',
            padding: '24px',
            backgroundColor: 'white',
            borderRadius: '24px',
            border: '1px solid #e2e8f0'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <ZapIcon />
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
                    태그별 열람율
                </span>
            </div>

            {/* Bar Gauges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <BarGauge label="개발" value={85} />
                <BarGauge label="디자인" value={72} />
                <BarGauge label="AI/ML" value={65} />
                <BarGauge label="비즈니스" value={45} />
                <BarGauge label="기타" value={28} />
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: `
**태그별 열람율 바 게이지**

각 태그의 열람율을 시각적으로 표시합니다.
열람율이 높을수록 바의 색상이 진해집니다.
                `,
            },
        },
    },
};

// ============================================================
// 2. ContentStudioSearch - 콘텐츠 생성 스튜디오 검색 컨테이너
// ============================================================
export const ContentStudioSearch = {
    render: () => (
        <div style={{
            maxWidth: '600px',
            padding: '32px',
            background: 'linear-gradient(to bottom, #f8fafc, white)',
            borderRadius: '24px',
            border: '1px solid #e2e8f0'
        }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                }}>
                    <PenToolIcon />
                    콘텐츠 생성 스튜디오
                </h3>
                <p style={{ fontSize: '14px', color: '#64748b' }}>
                    저장된 클립들을 조합하여 새로운 문서를 작성합니다.
                </p>
            </div>

            {/* Search Input */}
            <div style={{
                position: 'relative',
                marginBottom: '16px'
            }}>
                <div style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8'
                }}>
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    placeholder="키워드로 클립 검색..."
                    style={{
                        width: '100%',
                        padding: '12px 16px 12px 44px',
                        fontSize: '14px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        outline: 'none',
                        backgroundColor: 'white'
                    }}
                />
            </div>

            {/* Filter Row */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap'
            }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {['오늘', '이번 주', '이번 달'].map((period, i) => (
                        <button
                            key={period}
                            style={{
                                padding: '8px 16px',
                                fontSize: '12px',
                                fontWeight: 600,
                                borderRadius: '12px',
                                border: 'none',
                                cursor: 'pointer',
                                backgroundColor: i === 1 ? '#21DBA4' : '#f1f5f9',
                                color: i === 1 ? 'white' : '#64748b'
                            }}
                        >
                            {period}
                        </button>
                    ))}
                </div>
                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#64748b',
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    cursor: 'pointer'
                }}>
                    <FilterIcon />
                    필터
                </button>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: `
**콘텐츠 생성 스튜디오 검색 컨테이너**

클립을 검색하고 필터링하여 콘텐츠를 생성할 수 있는 인터페이스입니다.
                `,
            },
        },
    },
};

// ============================================================
// 3. OutputTypeSelector - 출력 형태 선택 버튼
// ============================================================
interface OutputTypeButtonProps {
    icon: React.ReactNode;
    label: string;
    description: string;
    isSelected?: boolean;
}

const OutputTypeButton = ({ icon, label, description, isSelected }: OutputTypeButtonProps) => (
    <button style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        padding: '20px 16px',
        borderRadius: '16px',
        border: isSelected ? '2px solid #21DBA4' : '1px solid #e2e8f0',
        backgroundColor: isSelected ? 'rgba(33, 219, 164, 0.05)' : 'white',
        cursor: 'pointer',
        transition: 'all 0.2s'
    }}>
        <div style={{
            color: isSelected ? '#21DBA4' : '#64748b',
            transition: 'color 0.2s'
        }}>
            {icon}
        </div>
        <span style={{
            fontSize: '14px',
            fontWeight: 600,
            color: isSelected ? '#21DBA4' : '#1e293b'
        }}>
            {label}
        </span>
        <span style={{
            fontSize: '11px',
            color: '#94a3b8',
            textAlign: 'center'
        }}>
            {description}
        </span>
    </button>
);

export const OutputTypeSelector = {
    render: () => (
        <div style={{
            maxWidth: '600px',
            padding: '24px',
            backgroundColor: 'white',
            borderRadius: '24px',
            border: '1px solid #e2e8f0'
        }}>
            <h4 style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#94a3b8',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            }}>
                출력 형태
            </h4>
            <div style={{ display: 'flex', gap: '12px' }}>
                <OutputTypeButton
                    icon={<FileBarChartIcon />}
                    label="리포트"
                    description="분석 중심"
                    isSelected={false}
                />
                <OutputTypeButton
                    icon={<FileTextIcon />}
                    label="아티클"
                    description="스토리텔링"
                    isSelected={true}
                />
                <OutputTypeButton
                    icon={<SparklesIcon />}
                    label="트렌드"
                    description="핵심 요약"
                    isSelected={false}
                />
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: `
**출력 형태 선택 버튼**

생성할 콘텐츠의 형태를 선택합니다.
- 리포트: 분석 중심의 상세 보고서
- 아티클: 스토리텔링 형식의 글
- 트렌드: 핵심 요약 형태
                `,
            },
        },
    },
};

// ============================================================
// 4. Combined Example
// ============================================================
export const FullContentStudio = {
    render: () => (
        <div style={{
            maxWidth: '700px',
            padding: '32px',
            background: 'linear-gradient(to bottom, #1e232b, #161b22)',
            borderRadius: '24px',
            color: 'white'
        }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px'
                }}>
                    <span style={{ color: '#21DBA4' }}><PenToolIcon /></span>
                    콘텐츠 생성 스튜디오
                </h3>
                <p style={{ fontSize: '14px', color: '#94a3b8' }}>
                    저장된 클립들을 조합하여 새로운 문서를 작성합니다.
                </p>
            </div>

            {/* Search */}
            <div style={{
                position: 'relative',
                marginBottom: '16px'
            }}>
                <div style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b'
                }}>
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    placeholder="키워드로 클립 검색..."
                    style={{
                        width: '100%',
                        padding: '12px 16px 12px 44px',
                        fontSize: '14px',
                        border: '1px solid #374151',
                        borderRadius: '16px',
                        outline: 'none',
                        backgroundColor: 'rgba(55, 65, 81, 0.5)',
                        color: 'white'
                    }}
                />
            </div>

            {/* Period Filters */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '24px',
                flexWrap: 'wrap'
            }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', marginRight: '4px' }}>기간</span>
                {['오늘', '이번 주', '이번 달'].map((period, i) => (
                    <button
                        key={period}
                        style={{
                            padding: '8px 16px',
                            fontSize: '12px',
                            fontWeight: 600,
                            borderRadius: '12px',
                            border: 'none',
                            cursor: 'pointer',
                            backgroundColor: i === 1 ? '#21DBA4' : 'rgba(55, 65, 81, 0.5)',
                            color: i === 1 ? 'black' : '#94a3b8'
                        }}
                    >
                        {period}
                    </button>
                ))}
            </div>

            {/* Output Types */}
            <div>
                <h4 style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#64748b',
                    marginBottom: '12px',
                    textTransform: 'uppercase'
                }}>
                    출력 형태
                </h4>
                <div style={{ display: 'flex', gap: '12px' }}>
                    {[
                        { icon: <FileBarChartIcon />, label: '리포트', desc: '분석 중심' },
                        { icon: <FileTextIcon />, label: '아티클', desc: '스토리텔링', selected: true },
                        { icon: <SparklesIcon />, label: '트렌드', desc: '핵심 요약' },
                    ].map((type, i) => (
                        <button
                            key={type.label}
                            style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '16px',
                                borderRadius: '16px',
                                border: type.selected ? '2px solid #21DBA4' : '1px solid #374151',
                                backgroundColor: type.selected ? 'rgba(33, 219, 164, 0.1)' : 'transparent',
                                cursor: 'pointer',
                                color: type.selected ? '#21DBA4' : '#94a3b8'
                            }}
                        >
                            {type.icon}
                            <span style={{ fontSize: '13px', fontWeight: 600 }}>{type.label}</span>
                            <span style={{ fontSize: '10px', color: '#64748b' }}>{type.desc}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '다크 모드에서의 전체 콘텐츠 스튜디오 UI입니다.',
            },
        },
    },
};
