import React from 'react';

/**
 * PageContainer 컴포넌트
 *
 * 스토리북 문서 콘텐츠 컨테이너 (Tailwind 버전)
 *
 * Props:
 * @param {ReactNode} children - 콘텐츠 [Required]
 */
export function PageContainer({ children }) {
  return (
    <div
      style={{
        maxWidth: '896px',
        margin: '0 auto',
      }}
    >
      {children}
    </div>
  );
}
