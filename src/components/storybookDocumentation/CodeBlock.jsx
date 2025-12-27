import React from 'react';

/**
 * CodeBlock 컴포넌트
 *
 * 코드 예제 블록
 */
export function CodeBlock({ code, title, theme = 'light' }) {
    const isDark = theme === 'dark';

    return (
        <div style={{ marginBottom: '24px' }}>
            {title && (
                <div
                    style={{
                        fontSize: '12px',
                        fontWeight: 500,
                        padding: '8px 16px',
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius: '8px',
                        color: 'var(--ai-text-secondary, #475569)',
                        background: 'var(--ai-surface-2, #F5F5F5)',
                        border: '1px solid var(--ai-border-default, #E2E8F0)',
                        borderBottom: 'none',
                    }}
                >
                    {title}
                </div>
            )}
            <pre
                style={{
                    padding: '16px',
                    overflowX: 'auto',
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    border: '1px solid var(--ai-border-default, #E2E8F0)',
                    borderRadius: title ? '0 0 8px 8px' : '8px',
                    backgroundColor: isDark ? '#0A0A0B' : 'var(--ai-surface-1, #FAFAFA)',
                    color: isDark ? '#FAFAFA' : 'var(--ai-text-primary, #0F172A)',
                    margin: 0,
                }}
            >
                <code>{code}</code>
            </pre>
        </div>
    );
}
