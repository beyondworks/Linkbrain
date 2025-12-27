import React from 'react';

/**
 * GridContent 컴포넌트
 *
 * 그리드 레이아웃 헬퍼
 */
export function GridContent({ children, columns = 3, gap = 16 }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
        marginBottom: '24px',
      }}
    >
      {children}
    </div>
  );
}
