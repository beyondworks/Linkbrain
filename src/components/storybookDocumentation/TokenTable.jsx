import React from 'react';

/**
 * TokenTable 컴포넌트
 *
 * 디자인 토큰 테이블 (Tailwind 버전)
 */
export function TokenTable({ rows = [], columns = ['Token', 'Value', 'Description'] }) {
    return (
        <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
            <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--ai-border-default, #E2E8F0)' }}>
                        {columns.map((col) => (
                            <th
                                key={col}
                                style={{
                                    textAlign: 'left',
                                    padding: '12px 16px',
                                    fontWeight: 600,
                                    color: 'var(--ai-text-primary, #0F172A)',
                                    background: 'var(--ai-surface-1, #FAFAFA)',
                                }}
                            >
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr
                            key={row.token}
                            style={{
                                borderBottom: '1px solid var(--ai-border-default, #E2E8F0)',
                                background: index % 2 === 0 ? 'transparent' : 'var(--ai-surface-1, #FAFAFA)',
                            }}
                        >
                            <td style={{ padding: '12px 16px' }}>
                                <code
                                    style={{
                                        fontSize: '12px',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        background: 'var(--ai-surface-2, #F5F5F5)',
                                        color: '#21DBA4',
                                        fontFamily: 'monospace',
                                    }}
                                >
                                    {row.token}
                                </code>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {row.preview}
                                    <code style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--ai-text-secondary, #475569)' }}>
                                        {row.value}
                                    </code>
                                </div>
                            </td>
                            {row.description && (
                                <td style={{ padding: '12px 16px', color: 'var(--ai-text-secondary, #475569)' }}>
                                    {row.description}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
