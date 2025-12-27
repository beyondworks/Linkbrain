import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import { GNB } from './GNB';

/**
 * AppShell 컴포넌트
 *
 * 반응형 레이아웃 쉘. GNB(헤더)와 메인 영역으로 구성.
 * - 데스크탑: 헤더에 메뉴 직접 표시
 * - 모바일: 햄버거 메뉴 → Drawer로 전환
 *
 * 동작 방식:
 * 1. 상단에 GNB 표시 (로고 + 메뉴 또는 햄버거)
 * 2. 모바일에서 햄버거 클릭 시 Drawer 열림
 * 3. 메인 콘텐츠 영역에 children 렌더링
 *
 * Props:
 * @param {string} logo - 로고 텍스트 [Optional, 기본값: "Logo"]
 * @param {array} menuItems - 메뉴 항목 배열 [Optional, 기본값: ["Menu 1", "Menu 2", "Menu 3"]]
 * @param {function} onMenuClick - 메뉴 클릭 핸들러 (menuItem, index) => void [Optional]
 * @param {number} activeIndex - 활성 메뉴 인덱스 [Optional]
 * @param {string} breakpoint - 반응형 전환 브레이크포인트 [Optional, 기본값: "md"]
 * @param {node} children - 메인 콘텐츠 영역 [Required]
 * @param {number} headerHeight - 헤더 높이 (px) [Optional, 기본값: 64]
 * @param {boolean} hasHeaderBorder - 헤더 하단 보더 [Optional, 기본값: true]
 * @param {boolean} isHeaderSticky - 헤더 고정 [Optional, 기본값: true]
 * @param {boolean} isHeaderTransparent - 헤더 투명 배경 [Optional, 기본값: false]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <AppShell
 *   logo="MyBrand"
 *   menuItems={["Home", "About", "Contact"]}
 *   onMenuClick={(item, idx) => navigate(item)}
 *   breakpoint="md"
 * >
 *   <MainContent />
 * </AppShell>
 */
const AppShell = forwardRef(function AppShell({
  logo,
  menuItems,
  onMenuClick,
  activeIndex,
  breakpoint = 'md',
  children,
  headerHeight = 64,
  hasHeaderBorder = true,
  isHeaderSticky = true,
  isHeaderTransparent = false,
  sx,
  ...props
}, ref) {
  return (
    <Box
      ref={ref}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        ...sx,
      }}
      {...props}
    >
      {/* GNB */}
      <GNB
        logo={logo}
        menuItems={menuItems}
        onMenuClick={onMenuClick}
        activeIndex={activeIndex}
        breakpoint={breakpoint}
        height={headerHeight}
        hasBorder={hasHeaderBorder}
        isSticky={isHeaderSticky}
        isTransparent={isHeaderTransparent}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>
    </Box>
  );
});

export { AppShell };
