import React from 'react';

/**
 * ColorSwatch 컴포넌트
 *
 * 색상 미리보기
 */
export function ColorSwatch({ color, name, size = 'md' }) {
    const sizes = {
        sm: { width: '24px', height: '24px' },
        md: { width: '40px', height: '40px' },
        lg: { width: '64px', height: '64px' },
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
                style={{
                    ...sizes[size],
                    borderRadius: '8px',
                    border: '1px solid var(--ai-border-default, #E2E8F0)',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    backgroundColor: color,
                }}
            />
            {name && (
                <span style={{ fontSize: '14px', color: 'var(--ai-text-secondary, #475569)' }}>
                    {name}
                </span>
            )}
        </div>
    );
}
