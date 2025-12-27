import React from 'react';

/**
 * TreeNode 컴포넌트
 *
 * 트리 구조 시각화 (Tailwind 버전)
 */
export function TreeNode({ name, children, level = 0 }) {
  const indent = level * 24;

  return (
    <div>
      <div
        style={{
          paddingLeft: `${indent}px`,
          paddingTop: '4px',
          paddingBottom: '4px',
          fontFamily: 'monospace',
          fontSize: '14px',
          color: 'var(--ai-text-primary, #0F172A)',
        }}
      >
        {level > 0 && (
          <span style={{ color: 'var(--ai-text-tertiary, #94A3B8)', marginRight: '8px' }}>
            └─
          </span>
        )}
        <span style={{ color: children ? '#21DBA4' : 'inherit' }}>
          {name}
        </span>
      </div>
      {children && React.Children.map(children, (child) =>
        React.cloneElement(child, { level: level + 1 })
      )}
    </div>
  );
}
