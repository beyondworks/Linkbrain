import React, { useEffect } from 'react';

declare global {
  interface Window {
    UnicornStudio: any;
  }
}

export const UnicornStudioWrapper = () => {
  useEffect(() => {
    // 스크립트가 이미 존재하는지 확인
    const existingScript = document.querySelector('script[src*="unicornStudio.umd.js"]');
    
    const initUnicorn = () => {
      if (window.UnicornStudio) {
        window.UnicornStudio.init();
      }
    };

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.5.3/dist/unicornStudio.umd.js";
      script.async = true;
      script.onload = initUnicorn;
      document.body.appendChild(script);
    } else {
      // 이미 스크립트가 로드되어 있다면 초기화만 시도
      initUnicorn();
    }

    // Cleanup은 Unicorn Studio API에 따라 다를 수 있으나,
    // 페이지 이동 시 재초기화가 필요할 수 있음
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#0B1120]">
      {/* 
        Unicorn Studio Project Container
        style을 100%로 설정하여 화면 전체를 커버하도록 변경
        
        Color Adjustment:
        원본의 Blue/Purple(240~270deg) 색상을 Teal/Green(#21DBA4) 계열로 변경하기 위해
        hue-rotate(-90deg) 필터를 적용합니다. 
      */}
      <div 
        data-us-project="Szpm9FB6lKzO313Hh2BD" 
        style={{ 
          width: '100%', 
          height: '100%',
          opacity: 0.3,
          filter: 'hue-rotate(-90deg) brightness(1.2) saturate(1.2)' 
        }}
      ></div>

      {/* Brand Color Tint Overlay (색상을 더 정확하게 잡기 위한 레이어) */}
      <div className="absolute inset-0 bg-[#21DBA4] mix-blend-color opacity-20 pointer-events-none"></div>
      
      {/* 
        Overlay Gradient 
        배경이 너무 튀지 않고 콘텐츠 가독성을 해치지 않도록 
        부드러운 그라데이션 오버레이 추가 
      */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/30 via-[#0B1120]/60 to-[#0B1120] pointer-events-none"></div>
    </div>
  );
};
