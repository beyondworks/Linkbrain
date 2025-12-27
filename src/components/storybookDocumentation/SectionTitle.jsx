import React from 'react';

/**
 * SectionTitle 컴포넌트
 *
 * 섹션 구분 제목 (Tailwind 버전)
 *
 * Props:
 * @param {string} title - 섹션 제목 [Required]
 * @param {string} description - 섹션 설명 [Optional]
 */
export function SectionTitle({ title, description }) {
  return (
    <div
      style={{
        marginTop: '40px',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid var(--ai-border-default, #E2E8F0)',
      }}
    >
      <h2
        style={{
          fontSize: '20px',
          fontWeight: 600,
          color: 'var(--ai-text-primary, #0F172A)',
          margin: 0,
          fontFamily: '"Pretendard Variable", Pretendard, sans-serif',
        }}
      >
        {title}
      </h2>
      {description && (
        <p
          style={{
            fontSize: '14px',
            color: 'var(--ai-text-secondary, #475569)',
            marginTop: '4px',
            margin: 0,
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
