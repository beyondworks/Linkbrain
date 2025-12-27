import React from 'react';

/**
 * DocumentTitle 컴포넌트
 *
 * 스토리북 문서 상단에 표시되는 타이틀 바 (Tailwind 버전)
 *
 * Props:
 * @param {string} title - 문서 제목 [Required]
 * @param {string} status - 상태 (Available, In Progress, Deprecated) [Optional, 기본값: 'Available']
 * @param {string} note - 문서 노트 [Optional]
 * @param {string} brandName - 브랜드명 [Optional, 기본값: 'Linkbrain']
 * @param {string} systemName - 시스템명 [Optional, 기본값: 'UI Kit']
 * @param {string} version - 버전 [Optional, 기본값: '1.0']
 */
export function DocumentTitle({
  title,
  status = 'Available',
  note = '',
  brandName = 'Linkbrain',
  systemName = 'UI Kit',
  version = '1.0',
}) {
  const statusColors = {
    Available: 'bg-[rgba(33,219,164,0.1)] text-[#21DBA4]',
    'In Progress': 'bg-[rgba(245,158,11,0.1)] text-[#F59E0B]',
    Deprecated: 'bg-[rgba(239,68,68,0.1)] text-[#EF4444]',
  };

  return (
    <div
      style={{
        borderBottom: '1px solid var(--ai-border-default, #E2E8F0)',
        paddingBottom: '24px',
        marginBottom: '32px',
      }}
    >
      {/* Brand & System Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: '12px', color: 'var(--ai-text-tertiary, #94A3B8)', fontWeight: 500 }}>
          {brandName}
        </span>
        <span style={{ fontSize: '12px', color: 'var(--ai-text-disabled, #CBD5E1)' }}>•</span>
        <span style={{ fontSize: '12px', color: 'var(--ai-text-tertiary, #94A3B8)' }}>
          {systemName}
        </span>
        {version && (
          <>
            <span style={{ fontSize: '12px', color: 'var(--ai-text-disabled, #CBD5E1)' }}>•</span>
            <span style={{ fontSize: '12px', color: '#21DBA4', fontWeight: 500 }}>
              v{version}
            </span>
          </>
        )}
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: '30px',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: 'var(--ai-text-primary, #0F172A)',
          margin: 0,
          fontFamily: '"Pretendard Variable", Pretendard, sans-serif',
        }}
      >
        {title}
      </h1>

      {/* Status Badge & Note */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
        <span
          className={statusColors[status] || statusColors.Available}
          style={{
            padding: '4px 10px',
            fontSize: '12px',
            fontWeight: 500,
            borderRadius: '9999px',
          }}
        >
          {status}
        </span>
        {note && (
          <span style={{ fontSize: '14px', color: 'var(--ai-text-secondary, #475569)' }}>
            {note}
          </span>
        )}
      </div>
    </div>
  );
}
