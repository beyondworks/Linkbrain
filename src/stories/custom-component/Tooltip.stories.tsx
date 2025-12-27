import React from 'react';

/**
 * Tooltip 스토리
 *
 * 툴팁 컴포넌트입니다.
 */

export default {
    title: 'Custom Component/Tooltip',
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
## Tooltip

호버 시 추가 정보를 표시하는 툴팁입니다.

### 사용법
\`\`\`tsx
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

<Tooltip>
  <TooltipTrigger>호버하세요</TooltipTrigger>
  <TooltipContent>추가 정보</TooltipContent>
</Tooltip>
\`\`\`
        `,
            },
        },
    },
};

// SVG Icons
const StarIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const LinkIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
);

const ShareIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
);

const TrashIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

const CheckIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#21DBA4" strokeWidth="3">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export const Positions = {
    render: () => (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', padding: '48px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    padding: '6px 12px',
                    backgroundColor: '#1e293b',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 500,
                    borderRadius: '8px',
                    whiteSpace: 'nowrap'
                }}>
                    위쪽 툴팁
                </div>
                <button style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}>
                    Hover me
                </button>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>top (기본)</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <button style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}>
                    Hover me
                </button>
                <div style={{
                    padding: '6px 12px',
                    backgroundColor: '#1e293b',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 500,
                    borderRadius: '8px',
                    whiteSpace: 'nowrap'
                }}>
                    아래쪽 툴팁
                </div>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>bottom</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    padding: '6px 12px',
                    backgroundColor: '#1e293b',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 500,
                    borderRadius: '8px',
                    whiteSpace: 'nowrap'
                }}>
                    왼쪽
                </div>
                <button style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}>
                    Hover
                </button>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>left</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}>
                    Hover
                </button>
                <div style={{
                    padding: '6px 12px',
                    backgroundColor: '#1e293b',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 500,
                    borderRadius: '8px',
                    whiteSpace: 'nowrap'
                }}>
                    오른쪽
                </div>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>right</span>
            </div>
        </div>
    ),
};

export const IconTooltips = {
    render: () => (
        <div style={{ display: 'flex', gap: '32px', padding: '48px' }}>
            {[
                { icon: <StarIcon />, tip: '즐겨찾기' },
                { icon: <LinkIcon />, tip: '링크 복사' },
                { icon: <ShareIcon />, tip: '공유하기' },
                { icon: <TrashIcon />, tip: '삭제' },
            ].map((item, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    {/* Tooltip */}
                    <div style={{
                        padding: '6px 12px',
                        backgroundColor: '#1e293b',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 500,
                        borderRadius: '8px',
                        whiteSpace: 'nowrap'
                    }}>
                        {item.tip}
                    </div>
                    {/* Button */}
                    <button style={{
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '8px',
                        color: '#64748b',
                        border: 'none',
                        cursor: 'pointer'
                    }}>
                        {item.icon}
                    </button>
                </div>
            ))}
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '아이콘 버튼에 사용하는 툴팁입니다.',
            },
        },
    },
};

export const RichTooltip = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '32px' }}>
            <button style={{
                padding: '8px 16px',
                backgroundColor: '#21DBA4',
                color: 'white',
                fontWeight: 500,
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer'
            }}>
                Pro 플랜
            </button>
            <div style={{
                minWidth: '200px',
                padding: '16px',
                backgroundColor: '#1e293b',
                color: 'white',
                borderRadius: '12px'
            }}>
                <p style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', whiteSpace: 'nowrap' }}>
                    Pro 플랜 혜택
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckIcon />
                        <span style={{ fontSize: '12px', color: '#cbd5e1', whiteSpace: 'nowrap' }}>무제한 클립 저장</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckIcon />
                        <span style={{ fontSize: '12px', color: '#cbd5e1', whiteSpace: 'nowrap' }}>AI 분석 무제한</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckIcon />
                        <span style={{ fontSize: '12px', color: '#cbd5e1', whiteSpace: 'nowrap' }}>우선 지원</span>
                    </div>
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '복잡한 내용이 있는 리치 툴팁입니다.',
            },
        },
    },
};

export const SimpleTooltip = {
    render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{
                    padding: '6px 12px',
                    backgroundColor: '#1e293b',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 500,
                    borderRadius: '8px'
                }}>
                    저장
                </div>
                <button style={{
                    padding: '8px 16px',
                    backgroundColor: '#21DBA4',
                    color: 'white',
                    fontWeight: 500,
                    borderRadius: '8px',
                    border: 'none'
                }}>
                    Save
                </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{
                    padding: '6px 12px',
                    backgroundColor: '#1e293b',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 500,
                    borderRadius: '8px'
                }}>
                    취소
                </div>
                <button style={{
                    padding: '8px 16px',
                    backgroundColor: '#f1f5f9',
                    color: '#64748b',
                    fontWeight: 500,
                    borderRadius: '8px',
                    border: 'none'
                }}>
                    Cancel
                </button>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '간단한 텍스트 툴팁입니다.',
            },
        },
    },
};
