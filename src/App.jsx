import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';
import { AppShell } from './components/navigation/AppShell';
import { Page1, Page2, Page3 } from './pages';

/**
 * 메인 앱 레이아웃 (GNB 포함)
 *
 * 동작 방식:
 * 1. 상단에 GNB 표시 (로고 + 메뉴)
 * 2. 메뉴 클릭 시 해당 페이지로 이동
 */
function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = ['Home', 'About', 'Contact'];
  const paths = ['/', '/about', '/contact'];

  // 현재 경로에 맞는 activeIndex 계산
  const activeIndex = paths.findIndex((path) => path === location.pathname);

  /**
   * 메뉴 클릭 핸들러
   */
  const handleMenuClick = useCallback((item, index) => {
    navigate(paths[index]);
  }, [navigate]);

  return (
    <AppShell
      logo="Logo"
      menuItems={menuItems}
      activeIndex={activeIndex >= 0 ? activeIndex : 0}
      onMenuClick={handleMenuClick}
    >
      <Routes>
        <Route path="/" element={<Page1 />} />
        <Route path="/about" element={<Page2 />} />
        <Route path="/contact" element={<Page3 />} />
        <Route path="*" element={<Page1 />} />
      </Routes>
    </AppShell>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
