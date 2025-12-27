import React from 'react';

/**
 * SpacingBox 컴포넌트
 *
 * 스페이싱 시각화 헬퍼
 */
export function SpacingBox({ size, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div
        style={{
          width: size,
          height: '16px',
          backgroundColor: '#21DBA4',
          borderRadius: '4px',
        }}
      />
      {label && (
        <span style={{ fontSize: '14px', color: 'var(--ai-text-secondary, #475569)' }}>
          {label}
        </span>
      )}
    </div>
  );
}
