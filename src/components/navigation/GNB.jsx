import { forwardRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Menu, X } from 'lucide-react';

/**
 * GNB 컴포넌트
 *
 * 반응형 GNB (Global Navigation Bar).
 * - 데스크탑: 좌측 로고, 우측 메뉴 항목들
 * - 모바일: 좌측 로고, 우측 햄버거 메뉴 → Drawer
 *
 * 동작 방식:
 * 1. 좌측에 로고 텍스트 표시
 * 2. 데스크탑: 우측에 메뉴 항목들 표시
 * 3. 모바일: 우측에 햄버거 아이콘 → 클릭 시 Drawer 열림
 * 4. 메뉴 클릭 시 onMenuClick(menuItem, index) 호출
 *
 * Props:
 * @param {string} logo - 로고 텍스트 [Optional, 기본값: "Logo"]
 * @param {array} menuItems - 메뉴 항목 배열 [Optional, 기본값: ["Menu 1", "Menu 2", "Menu 3"]]
 * @param {function} onMenuClick - 메뉴 클릭 핸들러 (menuItem, index) => void [Optional]
 * @param {number} activeIndex - 활성 메뉴 인덱스 [Optional]
 * @param {string} breakpoint - 반응형 전환 브레이크포인트 [Optional, 기본값: "md"]
 * @param {number} height - 헤더 높이 (px) [Optional, 기본값: 64]
 * @param {boolean} hasBorder - 헤더 하단 보더 [Optional, 기본값: true]
 * @param {boolean} isSticky - 헤더 고정 [Optional, 기본값: true]
 * @param {boolean} isTransparent - 헤더 투명 배경 [Optional, 기본값: false]
 * @param {object} sx - 추가 스타일 [Optional]
 *
 * Example usage:
 * <GNB
 *   logo="MyBrand"
 *   menuItems={["Home", "About", "Contact"]}
 *   onMenuClick={(item, idx) => console.log(item, idx)}
 *   breakpoint="md"
 * />
 */
const GNB = forwardRef(function GNB({
  logo = 'Logo',
  menuItems = ['Menu 1', 'Menu 2', 'Menu 3'],
  onMenuClick,
  activeIndex,
  breakpoint = 'md',
  height = 64,
  hasBorder = true,
  isSticky = true,
  isTransparent = false,
  sx,
  ...props
}, ref) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(breakpoint));
  const [drawerOpen, setDrawerOpen] = useState(false);

  /**
   * Drawer 열기/닫기
   */
  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  /**
   * 메뉴 클릭 핸들러 (Drawer 닫기 포함)
   */
  const handleMenuClick = (item, index) => {
    onMenuClick?.(item, index);
    setDrawerOpen(false);
  };

  /**
   * 헤더 스타일
   */
  const headerStyles = {
    position: isSticky ? 'sticky' : 'relative',
    top: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.appBar,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height,
    px: { xs: 2, sm: 3, md: 4 },
    backgroundColor: isTransparent ? 'transparent' : 'background.paper',
    borderBottom: hasBorder ? '1px solid' : 'none',
    borderColor: 'divider',
    backdropFilter: isTransparent ? 'blur(12px)' : 'none',
    ...sx,
  };

  /**
   * Drawer 내부 콘텐츠
   */
  const drawerContent = (
    <Box sx={{ width: 280 }}>
      {/* Drawer Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height,
          px: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          {logo}
        </Typography>
        <IconButton onClick={handleDrawerToggle} size="small">
          <X size={20} />
        </IconButton>
      </Box>

      {/* Menu List */}
      <List sx={{ pt: 1 }}>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              onClick={() => handleMenuClick(item, index)}
              selected={activeIndex === index}
              sx={{
                py: 1.5,
                px: 3,
                '&.Mui-selected': {
                  backgroundColor: 'action.selected',
                  '&:hover': {
                    backgroundColor: 'action.selected',
                  },
                },
              }}
            >
              <ListItemText
                primary={item}
                primaryTypographyProps={{
                  fontWeight: activeIndex === index ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 1 }} />
    </Box>
  );

  return (
    <>
      <Box ref={ref} component="header" sx={headerStyles} {...props}>
        {/* Left: Logo */}
        <Typography variant="h6" fontWeight={700}>
          {logo}
        </Typography>

        {/* Right: Desktop Menu or Mobile Hamburger */}
        {isMobile ? (
          <IconButton
            onClick={handleDrawerToggle}
            size="medium"
            aria-label="메뉴 열기"
          >
            <Menu size={24} />
          </IconButton>
        ) : (
          <Stack direction="row" spacing={1}>
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant="text"
                color={activeIndex === index ? 'primary' : 'inherit'}
                onClick={() => handleMenuClick(item, index)}
                sx={{
                  fontWeight: activeIndex === index ? 600 : 400,
                  textTransform: 'none',
                }}
              >
                {item}
              </Button>
            ))}
          </Stack>
        )}
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // 모바일 성능 최적화
        }}
        sx={{
          display: { xs: 'block', [breakpoint]: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
});

export { GNB };
