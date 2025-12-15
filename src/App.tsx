import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Sparkles,
  Zap,
  BarChart3,
  CheckCircle2,
  Play,
  Brain,
  MessageCircle,
  Youtube,
  Instagram,
  Download,
  Smartphone,
  Loader2,
  Link as LinkIcon,
  Globe,
  Menu,
  X
} from 'lucide-react';

import { FeatureSlider } from './components/landing/FeatureSlider';
import { Logo } from './components/Logo';
import { LinkBrainApp } from './components/app/LinkBrainApp';
import { useUserPreferences } from './hooks/useUserPreferences';
import { LinkBrainFeatures } from './components/app/LinkBrainFeatures';
import { LinkBrainHowItWorks } from './components/app/LinkBrainHowItWorks';
import { LinkBrainPricing } from './components/app/LinkBrainPricing';
import { ScatteredLinkAnimation } from './components/landing/ScatteredLinkAnimation';
import { LoginPage } from './components/app/LoginPage';
import { Toaster } from './components/ui/sonner';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { toast } from 'sonner';
import { SubscriptionProvider } from './context/SubscriptionContext';

// Brand Color Constants
const PRIMARY_COLOR = "#21DBA4";

type ViewType = 'landing' | 'features' | 'how-it-works' | 'pricing' | 'app';

const App = () => {
  // Initialize from localStorage or URL hash
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    const hash = window.location.hash.replace('#', '');
    if (['landing', 'features', 'how-it-works', 'pricing', 'app'].includes(hash)) {
      return hash as ViewType;
    }
    const saved = localStorage.getItem('linkbrain_view');
    if (saved && ['landing', 'features', 'how-it-works', 'pricing', 'app'].includes(saved)) {
      return saved as ViewType;
    }
    return 'landing';
  });
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  // --- User Preferences (Hybrid Sync) ---
  const { preferences, updatePreference } = useUserPreferences(user);

  // Destructure for easier usage
  const { theme: themePreference, language } = preferences;

  // System Theme Listener (Keep this here to resolve 'system' preference)
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const theme = themePreference === 'system' ? systemTheme : themePreference;

  // Handlers adapted to match old signature or direct usage
  const handleSetTheme = (newTheme: 'light' | 'dark' | 'system') => {
    updatePreference('theme', newTheme);
  };

  const handleSetLanguage = (newLang: 'en' | 'ko') => {
    updatePreference('language', newLang);
  };

  // PWA Install Prompt
  const deferredPromptRef = React.useRef<any>(null);

  // Handle beforeinstallprompt event for PWA install
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = () => {
    // Download the app zip file
    const link = document.createElement('a');
    link.href = '/LinkBrain.app.zip';
    link.download = 'LinkBrain.app.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(language === 'ko' ? '다운로드가 시작됩니다!' : 'Download started!');
  };

  // Save view to localStorage on change
  useEffect(() => {
    localStorage.setItem('linkbrain_view', currentView);
    // Update URL hash without triggering navigation
    if (window.location.hash !== `#${currentView}`) {
      window.history.replaceState({ view: currentView }, '', `#${currentView}`);
    }
  }, [currentView]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const view = e.state?.view || window.location.hash.replace('#', '') || 'landing';
      if (['landing', 'features', 'how-it-works', 'pricing', 'app'].includes(view)) {
        setCurrentView(view as ViewType);
      }
    };
    window.addEventListener('popstate', handlePopState);

    // Set initial state
    if (!window.history.state?.view) {
      window.history.replaceState({ view: currentView }, '', `#${currentView}`);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Mobile/PWA Swipe Back Navigation
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      // Calculate swipe distance and direction
      const swipeDistanceX = touchEndX - touchStartX;
      const swipeDistanceY = Math.abs(touchEndY - touchStartY);

      // Only trigger if:
      // 1. Started from left edge (within 30px from left)
      // 2. Swiped right more than 80px
      // 3. Vertical movement less than 100px (mostly horizontal)
      if (touchStartX < 30 && swipeDistanceX > 80 && swipeDistanceY < 100) {
        // Go back in history
        if (window.history.length > 1) {
          window.history.back();
        }
      }
    };

    // Only add listeners on mobile/touch devices
    if ('ontouchstart' in window) {
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      console.log('[Firebase Auth] User state changed:', currentUser?.email || 'Not logged in');

      // Auto-redirect to app if logged in and on landing page
      if (currentUser && currentView === 'landing') {
        setCurrentView('app');
        window.history.pushState({ view: 'app' }, '', '#app');
      }
    });
    return () => unsubscribe();
  }, [currentView]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentView('landing');
      window.history.pushState({ view: 'landing' }, '', '#landing');
      localStorage.removeItem('linkbrain_view');
      console.log('[Firebase Auth] User logged out');
    } catch (error) {
      console.error('[Firebase Auth] Logout error:', error);
    }
  };

  const handleNavigate = (view: string) => {
    // If view matches one of our defined views, switch to it.
    if (['landing', 'features', 'how-it-works', 'pricing', 'app'].includes(view)) {
      window.history.pushState({ view }, '', `#${view}`);
      setCurrentView(view as ViewType);
      window.scrollTo(0, 0);
    }
  };

  if (currentView === 'app') {
    // Show loading state while checking authentication
    if (authLoading) {
      return (
        <div className={`min-h-screen flex flex-col items-center justify-center gap-4 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
          <Loader2 className={`w-10 h-10 animate-spin ${theme === 'dark' ? 'text-[#21DBA4]' : 'text-[#21DBA4]'}`} />
          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Loading...</p>
        </div>
      );
    }

    if (!user) {
      return (
        <>
          <LoginPage
            onLogin={() => { }} // Firebase handles auth state automatically
            language={language}
            setLanguage={handleSetLanguage}
          />
          <Toaster />
        </>
      );
    }
    return (
      <>
        <SubscriptionProvider>
          <LinkBrainApp
            onBack={() => setCurrentView('landing')}
            onLogout={handleLogout}
            language={language}
            setLanguage={handleSetLanguage}
            theme={theme}
            themePreference={themePreference}
            setTheme={handleSetTheme}
            preferences={preferences}
            updatePreference={updatePreference}
          />
        </SubscriptionProvider>
        <Toaster />
      </>
    );
  }

  return (
    <>
      <LandingPageContent
        currentView={currentView}
        onEnterApp={() => handleNavigate('app')}
        onNavigate={handleNavigate}
        onInstallApp={handleInstallApp}
      />
      <Toaster />
    </>
  );
};

interface LandingPageProps {
  currentView: ViewType;
  onEnterApp: () => void;
  onNavigate: (view: string) => void;
  onInstallApp: () => void;
}

const LandingPageContent = ({ currentView, onEnterApp, onNavigate, onInstallApp }: LandingPageProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-[#21DBA4] selection:text-white overflow-x-hidden relative flex flex-col">

      {/* Dynamic Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Use the new ScatteredLinkAnimation as the main background interaction */}
        <ScatteredLinkAnimation />
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-fade-in-up md:hidden">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-2">
              <Logo className="w-6 h-6 rounded-lg" />
              <span className="font-bold text-lg tracking-tight text-[#21DBA4]">Linkbrain</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 -mr-2 text-slate-400 hover:text-slate-900"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 px-6 pt-8 flex flex-col">
            <div className="flex flex-col gap-6">
              {['FEATURES', 'HOW IT WORKS', 'PRICING'].map((item) => {
                const viewName = item.toLowerCase().replace(/\s/g, '-');
                const isActive = currentView === viewName;
                return (
                  <button
                    key={item}
                    onClick={() => {
                      onNavigate(viewName);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-lg font-bold text-left tracking-tight transition-colors ${isActive ? 'text-[#21DBA4]' : 'text-slate-900 hover:text-[#21DBA4]'}`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50 flex flex-col gap-4">
              <button
                onClick={() => { onEnterApp(); setMobileMenuOpen(false); }}
                className="w-full py-3 rounded-lg border border-[#21DBA4] text-[#21DBA4] font-bold text-base transition-transform active:scale-95 bg-white"
              >
                Log in
              </button>
              <button
                onClick={() => { onInstallApp(); setMobileMenuOpen(false); }}
                className="w-full py-3 rounded-lg bg-[#21DBA4] text-white font-bold text-base shadow-md shadow-[#21DBA4]/20 active:scale-95 transition-transform hover:bg-[#1BC290]"
              >
                App 설치하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || currentView !== 'landing' ? 'bg-white/90 backdrop-blur-xl border-b border-gray-200/50 py-4 shadow-sm' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <Logo className="w-8 h-8" />
            <span className="font-extrabold text-[22px] tracking-tight text-[#21DBA4]">Linkbrain</span>
          </button>

          <div className="hidden md:flex items-center gap-10 font-bold text-[13px] uppercase tracking-wider text-slate-400">
            {['FEATURES', 'HOW IT WORKS', 'PRICING'].map((item) => {
              const viewName = item.toLowerCase().replace(/\s/g, '-');
              const isActive = currentView === viewName;

              return (
                <button
                  key={item}
                  onClick={() => onNavigate(viewName)}
                  className={`transition-colors relative group ${isActive ? 'text-[#21DBA4]' : 'hover:text-[#21DBA4]'}`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={onEnterApp}
              className="text-[13px] font-bold text-slate-500 hover:text-slate-900 hidden sm:block transition-colors uppercase tracking-wide mr-2"
            >
              Log in
            </button>
            <button
              onClick={onInstallApp}
              className="px-6 py-2.5 rounded-full bg-[#21DBA4] text-white text-[13px] font-bold hover:bg-[#1BC290] hover:shadow-lg hover:shadow-[#21DBA4]/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 active:scale-95 duration-200 shadow-md shadow-[#21DBA4]/20"
            >
              <Download size={14} /> <span className="hidden sm:inline">App 설치</span><span className="sm:hidden">App</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 text-slate-600 hover:text-[#21DBA4] transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 pt-24">
        {currentView === 'landing' && (
          <>
            {/* Hero Section */}
            <section className="relative pt-[80px] pb-[60px] md:pt-[120px] md:pb-[140px] px-6 overflow-visible z-10">
              <div className="max-w-7xl mx-auto flex flex-col items-center text-center">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-100 shadow-sm mb-12 animate-fade-in-up hover:scale-105 transition-transform cursor-default">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#21DBA4]"></span>
                  <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">Linkbrain is here</span>
                </div>

                {/* Headline */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] mb-8 animate-fade-in-up delay-100 max-w-4xl text-[rgb(26,26,26)] drop-shadow-sm">
                  흩어진 링크들을 모아<br />
                  <span className="text-[#21DBA4]">두 번째 뇌를 만드세요</span>
                </h1>

                <p className="text-base md:text-lg text-slate-500 mb-14 max-w-xl leading-relaxed animate-fade-in-up delay-200 font-medium tracking-tight">
                  저장만 해두고 잊어버리셨나요?<br />
                  LinkBrain AI가 당신의 링크를 분석해<br className="md:hidden" />
                  <span className="text-slate-900 font-bold underline decoration-[#21DBA4]/40 decoration-2 underline-offset-4">살아있는 인사이트</span>로 바꿉니다.
                </p>

                {/* CTA Group */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-28 animate-fade-in-up delay-300">
                  <button
                    onClick={onInstallApp}
                    className="group relative px-10 py-4 bg-[#21DBA4] text-white rounded-full font-bold text-base flex items-center gap-2 hover:bg-[#1BC290] hover:shadow-2xl hover:shadow-[#21DBA4]/25 transition-all overflow-hidden shadow-xl shadow-[#21DBA4]/15 active:scale-95 duration-200"
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                    앱 무료 설치하기 <Download size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Hero Animation Mockup */}
                <div className="relative w-full max-w-5xl mx-auto h-[400px] md:h-[600px] animate-fade-in-up delay-500 perspective-1000 group">
                  {/* Glow Effect */}
                  <div className="absolute -inset-10 bg-[#21DBA4]/10 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none"></div>

                  <div className="absolute left-0 top-0 w-full h-full bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-[0_50px_100px_-20px_rgba(33,219,164,0.15)] overflow-hidden z-10 backdrop-blur-sm bg-white/90">
                    {/* Browser Header */}
                    <div className="h-14 border-b border-slate-50 flex items-center justify-between px-6 bg-white/80 backdrop-blur sticky top-0 z-20">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-100"></div>
                        <div className="w-3 h-3 rounded-full bg-slate-100"></div>
                        <div className="w-3 h-3 rounded-full bg-slate-100"></div>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 bg-slate-50/50 px-4 py-1.5 rounded-full border border-slate-50">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#21DBA4]"></span>
                        linkbrain.ai
                      </div>
                      <div className="w-16"></div>
                    </div>

                    {/* Animation Container */}
                    <div className="relative h-full bg-slate-50/30 p-8 md:p-12 flex items-center justify-center overflow-hidden">
                      {/* Mock Content */}
                      <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center bg-white/40">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-[#E0FBF4] text-[#21DBA4] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Sparkles size={32} />
                          </div>
                          <h3 className="text-2xl font-black text-slate-900 mb-2">AI Analyzing...</h3>
                          <p className="text-slate-400 font-medium">Your second brain is being constructed.</p>
                        </div>
                      </div>

                      {/* Floating Badges inside mock */}
                      <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-20 left-12 md:left-24 bg-white px-4 py-2.5 rounded-xl shadow-xl shadow-slate-200/50 flex items-center gap-3 border border-slate-100"
                      >
                        <div className="p-1.5 bg-blue-50 text-blue-500 rounded-lg"><LinkIcon size={14} /></div>
                        <div className="flex flex-col text-left">
                          <span className="text-[10px] text-slate-400 font-bold">Source Added</span>
                          <span className="text-xs font-bold text-slate-800">UX Trends 2025</span>
                        </div>
                      </motion.div>

                      <motion.div
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-32 right-12 md:right-32 bg-white px-4 py-2.5 rounded-xl shadow-xl shadow-slate-200/50 flex items-center gap-3 border border-slate-100"
                      >
                        <div className="p-1.5 bg-purple-50 text-purple-500 rounded-lg"><Brain size={14} /></div>
                        <div className="flex flex-col text-left">
                          <span className="text-[10px] text-slate-400 font-bold">Insight Generated</span>
                          <span className="text-xs font-bold text-slate-800">Design System Patterns</span>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Floating Elements (Outside Decorations) */}
                  <FloatingBadge icon={<Zap size={14} />} text="Zero-Click" top="25%" left="-4%" delay="1s" className="hidden md:flex" />
                  <FloatingBadge icon={<Brain size={14} />} text="Deep Insight" top="40%" right="-4%" delay="2s" className="hidden md:flex" />
                </div>
              </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="relative z-10 md:pt-[100px] md:pb-[120px] px-0 pt-[60px] pr-[0px] pb-[50px] pl-[0px]">
              <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-28">
                  <span className="text-[#21DBA4] font-bold text-[12px] uppercase tracking-[0.2em] mb-4 block">Core Features</span>
                  <h2 className="text-3xl md:text-4xl font-black text-[rgb(26,26,26)] leading-tight font-bold">
                    링크를 복사하세요,<br />
                    <span className="relative inline-block">
                      나머지는 AI가 합니다
                      <span className="absolute bottom-1 left-0 w-full h-3 bg-[#21DBA4]/20 -z-10 rounded-sm"></span>
                    </span>
                  </h2>
                </div>

                <div className="mt-16">
                  <FeatureSlider />
                </div>
              </div>
            </section>

            {/* Curation Magazine Section */}
            <section className="relative z-10 md:pt-[120px] md:pb-[150px] px-0 pt-[50px] pr-[0px] pb-[100px] pl-[0px]">
              <div className="max-w-5xl mx-auto px-6">
                {/* Section Background Card */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-16 shadow-[0_40px_100px_-20px_rgba(33,219,164,0.1)] border border-[#21DBA4]/10 relative overflow-hidden">

                  {/* Decor */}
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#E0FBF4] to-transparent rounded-bl-[100%] opacity-60 pointer-events-none"></div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
                    <div className="mt-[0px] mr-[-16px] mb-[0px] ml-[0px]">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="inline-block px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-bold text-[9px] uppercase tracking-wider shadow-md">
                          Coming Soon
                        </div>
                        <span className="text-[10px] font-bold text-[#21DBA4] animate-pulse flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#21DBA4]"></div> 준비중인 기능
                        </span>
                      </div>

                      <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 leading-tight">
                        나만의 인사이트 매거진<br />
                        <span className="text-[#21DBA4]">자동 발행</span>
                      </h2>
                      <p className="md:text-base text-slate-500 mb-10 leading-relaxed text-[16px]">
                        "이거 나중에 봐야지" 하고 저장한 링크들, 다시 찾기 힘드셨죠?<br />
                        LinkBrain은 흩어진 조각들을 모아 <span className="text-slate-900 font-bold bg-[#E0FBF4] px-1">하나의 완성된 아티클</span>로 엮어냅니다.
                        매주 발행되는 나만의 지식 매거진을 받아보세요.
                      </p>

                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#21DBA4]/30 transition-colors group cursor-default">
                          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#21DBA4] group-hover:scale-110 transition-transform">
                            <Zap size={18} fill="currentColor" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-slate-800">Smart Digest</h4>
                            <p className="text-xs text-slate-400 mt-0.5">저장된 콘텐츠를 요약하고 재구성합니다.</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#21DBA4]/30 transition-colors group cursor-default">
                          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#21DBA4] group-hover:scale-110 transition-transform">
                            <MessageCircle size={18} />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-slate-800">Knowledge Network</h4>
                            <p className="text-xs text-slate-400 mt-0.5">관련된 주제끼리 자동으로 연결하여 지식망을 형성합니다.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Magazine Card Mockup */}
                    <div className="relative group cursor-pointer max-w-sm mx-auto lg:mr-0 lg:ml-auto perspective-1000">
                      {/* Card Shine */}
                      <div className="absolute -inset-4 bg-gradient-to-r from-[#21DBA4] to-blue-400 rounded-[2rem] opacity-20 group-hover:opacity-40 blur-xl transition duration-700"></div>

                      <div className="relative bg-white rounded-[2rem] p-3 shadow-2xl transform transition duration-500 group-hover:-translate-y-2 group-hover:rotate-1">
                        <div className="h-60 rounded-[1.5rem] bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                          <div className="absolute bottom-6 left-6 right-6 text-white">
                            <span className="bg-[#21DBA4] text-white px-2.5 py-1 rounded-lg text-[9px] font-bold mb-3 inline-block shadow-lg">AI Trends</span>
                            <h3 className="text-lg font-bold leading-snug mb-2">The Rise of 'Vibe Coding'</h3>
                            <p className="text-[10px] text-white/80 line-clamp-2">디자이너와 개발자의 경계가 허물어지는 시대, 우리는 무엇을 준비해야 하는가?</p>
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Sparkles size={14} className="text-[#21DBA4]" />
                              <span className="text-[10px] font-bold text-slate-500">Based on 12 clips</span>
                            </div>
                            <span className="text-[9px] text-slate-300">Updated 2h ago</span>
                          </div>
                          <div className="space-y-2">
                            <div className="h-1.5 bg-slate-100 rounded-full w-full"></div>
                            <div className="h-1.5 bg-slate-100 rounded-full w-4/5"></div>
                            <div className="h-1.5 bg-slate-100 rounded-full w-5/6"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 pt-[80px] pb-[120px] md:pt-[120px] md:pb-[192px] px-0">
              <div className="max-w-3xl mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight">
                  당신의 <span className="text-[#21DBA4]">Second Brain</span>을<br />
                  지금 바로 구축하세요.
                </h2>
                <p className="text-base text-slate-500 mb-14">
                  앱 설치 한 번으로, 흩어진 정보들이 지식이 됩니다.<br />
                  지금 무료로 시작하고, 한 달 뒤 달라진 인사이트를 경험하세요.
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <button
                    onClick={onEnterApp}
                    className="px-[36px] py-[15px] bg-[#21DBA4] text-white rounded-full font-bold text-base shadow-2xl shadow-[#21DBA4]/40 hover:bg-[#1BC290] hover:scale-105 transition-all w-full sm:w-auto flex items-center justify-center gap-2 active:scale-95 duration-200 text-[15px]"
                  >
                    <Download size={18} /> 앱 무료 설치하기
                  </button>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-4 sm:mt-0 bg-white p-[16px] rounded-full border border-slate-100 shadow-sm px-[16px] py-[17px]">
                    <Smartphone size={14} />
                    <span>iOS / Android PWA 지원</span>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {currentView === 'features' && (
          <div className="py-20 animate-fade-in-up">
            <LinkBrainFeatures theme="light" language="ko" onEnterApp={onEnterApp} />
          </div>
        )}

        {currentView === 'how-it-works' && (
          <div className="py-20 animate-fade-in-up">
            <LinkBrainHowItWorks theme="light" language="ko" />
          </div>
        )}

        {currentView === 'pricing' && (
          <div className="py-20 animate-fade-in-up">
            <LinkBrainPricing theme="light" language="ko" onEnterApp={onEnterApp} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-[50px] relative z-10 mt-auto px-[0px]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Logo className="w-7 h-7 rounded-lg opacity-80" />
            <span className="font-bold text-[#21DBA4] text-sm text-[18px]">Linkbrain</span>
          </div>
          <div className="flex gap-8 text-[12px] font-medium text-slate-500">
            <a href="#" className="hover:text-[#21DBA4] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#21DBA4] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#21DBA4] transition-colors">Contact</a>
          </div>
          <div className="text-[12px] text-slate-300">
            © 2025 Linkbrain Inc. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Global Styles for Animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes slideInDrop {
          0% { transform: translate(-50%, 0) scale(0.9); opacity: 0; }
          40% { transform: translate(-50%, 20px) scale(1); opacity: 1; }
          80% { transform: translate(-50%, 20px) scale(1); opacity: 1; }
          100% { transform: translate(50px, 150px) scale(0.5); opacity: 0; }
        }
        @keyframes pulseScale {
          0%, 100% { transform: translate(-50%, 0) scale(1); }
          50% { transform: translate(-50%, 0) scale(1.1); }
        }
        @keyframes bounceSmall {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-gradient {
          animation: gradient 6s ease infinite;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          opacity: 0;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-slide-in-drop {
          animation: slideInDrop 3s infinite;
        }
        .animate-pulse-scale {
          animation: pulseScale 2s infinite;
        }
        .animate-pulse-slow {
           animation: pulse 3s infinite;
        }
        .animate-spin-slow {
           animation: spin 8s linear infinite;
        }
        .animate-bounce-small {
           animation: bounceSmall 2s infinite;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-500 { animation-delay: 0.5s; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>

    </div >
  );
};

// ----------------------------------------------------------------------
// Hero Animation Component (Paste -> Analyze -> Generate)
// ----------------------------------------------------------------------
const HeroAnimation = () => {
  const [step, setStep] = useState(0);
  const url = "https://youtube.com/watch?v=design_system_ai";

  useEffect(() => {
    const loop = async () => {
      setStep(0);
      await wait(1000);
      setStep(1);
      await wait(1500);
      setStep(2);
      await wait(2000);
      setStep(3);
      await wait(4000);
      loop();
    };
    loop();
  }, []);

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div className="p-8 h-full flex flex-col items-center justify-center">

      {/* Input Bar */}
      <div className={`w-full max-w-md bg-white rounded-2xl shadow-sm border transition-all duration-500 flex items-center px-4 h-14 mb-10 z-20
        ${step >= 2 ? 'border-[#21DBA4] shadow-xl shadow-[#21DBA4]/10 ring-4 ring-[#21DBA4]/5' : 'border-slate-200'}
      `}>
        <div className="mr-3 text-slate-400">
          {step === 2 ? <Loader2 size={18} className="animate-spin text-[#21DBA4]" /> : <LinkIcon size={18} />}
        </div>
        <div className="flex-1 text-sm text-slate-700 font-medium overflow-hidden whitespace-nowrap">
          {step === 0 && <span className="text-slate-300">URL을 여기에 붙여넣으세요...</span>}
          {step >= 1 && (
            <span className="animate-typewriter">{url}</span>
          )}
        </div>
        <button className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${step >= 1 ? 'bg-[#21DBA4] text-white scale-100 shadow-lg shadow-[#21DBA4]/20' : 'bg-slate-100 text-slate-300 scale-90'}`}>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Result Area */}
      <div className="w-full max-w-md relative h-40">

        {/* State: Processing (Skeleton) */}
        <div className={`absolute inset-0 transition-all duration-500 ${step === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-lg space-y-4">
            <div className="flex gap-4">
              <div className="w-20 h-16 bg-slate-100 rounded-xl animate-pulse"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                <div className="h-2 bg-slate-50 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-slate-50 rounded-full animate-pulse"></div>
              <div className="h-6 w-12 bg-slate-50 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#21DBA4] font-bold">
            <Sparkles size={14} className="animate-spin-slow" /> AI 분석중...
          </div>
        </div>

        {/* State: Done (Card) */}
        <div className={`absolute inset-0 transition-all duration-700 ease-out z-30 ${step === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
          <div className="bg-white rounded-3xl p-4 border border-[#21DBA4]/20 shadow-2xl shadow-[#21DBA4]/10 relative group cursor-pointer hover:-translate-y-1 transition-transform">

            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#21DBA4] rounded-l-3xl"></div>

            <div className="flex gap-4 pl-2">
              {/* Minimal Thumbnail */}
              <div className="w-24 h-20 bg-slate-100 rounded-2xl shrink-0 overflow-hidden relative shadow-inner">
                <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200" alt="Minimal Thumbnail" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-1.5 right-1.5 bg-black/60 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 rounded font-medium">12:30</div>
              </div>
              <div className="flex-1 min-w-0 py-1">
                <div className="flex gap-2 mb-2">
                  <span className="text-[9px] font-bold px-2 py-1 bg-[#E0FBF4] text-[#21DBA4] rounded-full">Design</span>
                  <span className="text-[9px] font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-full">AI Trend</span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-1.5 line-clamp-1 group-hover:text-[#21DBA4] transition-colors text-left">AI가 바꾸는 2025 디자인 시스템</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed text-left">
                  Vibe Coding과 MCP가 가져올 변화, 디자이너는 이제 로직을 설계해야 합니다.
                </p>
              </div>
            </div>

            <div className="absolute top-3 right-3 w-7 h-7 bg-[#21DBA4] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#21DBA4]/30 animate-bounce-short">
              <CheckCircle2 size={14} strokeWidth={3} />
            </div>
          </div>
          <div className="mt-4 text-center text-[10px] text-slate-400 font-medium">
            자동으로 분류되어 저장되었습니다.
          </div>
        </div>

      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// Sub Components
// ----------------------------------------------------------------------

interface FloatingBadgeProps {
  icon: React.ReactNode;
  text: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  delay?: string;
  className?: string;
}

const FloatingBadge = ({ icon, text, top, left, right, bottom, delay, className = '' }: FloatingBadgeProps) => (
  <div
    className="absolute bg-white/80 backdrop-blur-md border border-white/50 px-3 py-2 rounded-full shadow-[0_8px_20px_-5px_rgba(0,0,0,0.1)] flex items-center gap-2 animate-bounce hidden lg:flex z-20 hover:scale-110 transition-transform cursor-pointer"
    style={{ top, left, right, bottom, animationDuration: '4s', animationDelay: delay }}
  >
    <div className="text-[#21DBA4]">{icon}</div>
    <span className="text-[11px] font-bold text-slate-600">{text}</span>
  </div>
);

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const FeatureCard = ({ icon, title, desc }: FeatureCardProps) => (
  <div className="bg-white/60 backdrop-blur-sm border border-white/50 p-6 rounded-[2rem] hover:bg-white hover:border-[#21DBA4]/20 hover:shadow-[0_20px_40px_-10px_rgba(33,219,164,0.1)] transition-all duration-300 group cursor-default">
    <div className="mb-6 bg-[#E0FBF4] w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-[#21DBA4] shadow-sm">
      {icon}
    </div>
    <h3 className="text-base font-bold mb-3 text-slate-800">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-xs">
      {desc}
    </p>
  </div>
);

export default App;