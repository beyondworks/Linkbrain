import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { LinkBrainApp } from './components/app/LinkBrainApp';
import { useUserPreferences } from './hooks/useUserPreferences';
import { LoginPage } from './components/app/LoginPage';
import { Toaster } from './components/ui/sonner';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { toast } from 'sonner';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { InstallInstructionModal } from './components/common/InstallInstructionModal';
import { LandingLanguage } from './constants/landingTranslations';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ShareTarget } from './components/app/ShareTarget';

// New Landing Page Components
import { LandingLayout } from './components/landing/LandingLayout';
import { HomePage } from './components/landing/HomePage';
import { LinkBrainFeatures } from './components/landing/LinkBrainFeatures';
import { LinkBrainHowItWorks } from './components/landing/LinkBrainHowItWorks';
import { LinkBrainPricing } from './components/landing/LinkBrainPricing';

type ViewType = 'home' | 'landing' | 'features' | 'how-it-works' | 'pricing' | 'app' | 'admin';

const App = () => {
  // Share Target Route Handling
  const isShareTarget = window.location.pathname === '/share-target';

  // Initialize from localStorage or URL hash
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    if (isShareTarget) return 'app'; // Dummy value, won't be used if isShareTarget is true

    const hash = window.location.hash.replace('#', '');
    if (['home', 'landing', 'features', 'how-it-works', 'pricing', 'app', 'admin'].includes(hash)) {
      return hash as ViewType;
    }
    const saved = localStorage.getItem('linkbrain_view');
    if (saved && ['home', 'landing', 'features', 'how-it-works', 'pricing', 'app', 'admin'].includes(saved)) {
      return saved as ViewType;
    }
    return 'home';
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



  // Save view to localStorage on change
  useEffect(() => {
    localStorage.setItem('linkbrain_view', currentView);
    // Update URL hash without triggering navigation
    if (window.location.hash !== `#${currentView}`) {
      window.history.replaceState({ view: currentView }, '', `#${currentView}`);
    }
  }, [currentView]);

  // For install instruction modal (iOS / Fallback)
  const [showInstallModal, setShowInstallModal] = useState(false);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const view = e.state?.view || window.location.hash.replace('#', '') || 'home';
      if (['home', 'landing', 'features', 'how-it-works', 'pricing', 'app', 'admin'].includes(view)) {
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
      if (currentUser && (currentView === 'landing' || currentView === 'home')) {
        setCurrentView('app');
        window.history.pushState({ view: 'app' }, '', '#app');
      }
    });
    return () => unsubscribe();
  }, [currentView]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentView('home');
      window.history.pushState({ view: 'home' }, '', '#home');
      localStorage.removeItem('linkbrain_view');
      console.log('[Firebase Auth] User logged out');
    } catch (error) {
      console.error('[Firebase Auth] Logout error:', error);
    }
  };

  const handleNavigate = (view: string) => {
    // If view matches one of our defined views, switch to it.
    if (['home', 'landing', 'features', 'how-it-works', 'pricing', 'app', 'admin'].includes(view)) {
      window.history.pushState({ view }, '', `#${view}`);
      setCurrentView(view as ViewType);
      window.scrollTo(0, 0);
    }
  };

  // Detect if user is on mobile device
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
  };

  const handleInstallApp = async () => {
    // 1. Try native PWA install prompt (Chrome/Edge Desktop & Android)
    if (deferredPromptRef.current) {
      deferredPromptRef.current.prompt();
      const { outcome } = await deferredPromptRef.current.userChoice;
      if (outcome === 'accepted') {
        toast.success(language === 'ko' ? '앱이 설치되었습니다!' : 'App installed successfully!');
      }
      deferredPromptRef.current = null;
    } else {
      // 2. If prompt not available (iOS, Safari, Firefox, or Already Installed)
      // Show instructions modal instead of confusing zip download
      setShowInstallModal(true);
    }
  };

  // Share Target View
  if (isShareTarget) {
    return (
      <SubscriptionProvider>
        <ShareTarget />
        <Toaster />
      </SubscriptionProvider>
    );
  }

  // Admin view - requires authentication
  if (currentView === 'admin') {
    if (authLoading) {
      return (
        <div className={`min-h-screen flex flex-col items-center justify-center gap-4 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
          <Loader2 className={`w-10 h-10 animate-spin text-[#21DBA4]`} />
          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Loading...</p>
        </div>
      );
    }

    if (!user) {
      return (
        <>
          <LoginPage
            onLogin={() => { }}
            language={language}
            setLanguage={handleSetLanguage}
          />
          <Toaster />
        </>
      );
    }

    return (
      <>
        <AdminDashboard
          theme={theme}
          language={language}
          onBack={() => handleNavigate('app')}
        />
        <Toaster />
      </>
    );
  }

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
            onBack={() => setCurrentView('home')}
            onLogout={handleLogout}
            onAdmin={() => handleNavigate('admin')}
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
      <LandingLayout
        currentView={currentView}
        onNavigate={handleNavigate}
        onEnterApp={() => handleNavigate('app')}
        language={language}
        setLanguage={handleSetLanguage}
      >
        {(currentView === 'home' || currentView === 'landing') && (
          <HomePage onEnterApp={() => handleNavigate('app')} language={language} />
        )}
        {currentView === 'features' && (
          <div className="py-[50px] animate-fade-in-up px-[0px]">
            <LinkBrainFeatures theme="dark" language={language} />
          </div>
        )}
        {currentView === 'how-it-works' && (
          <div className="py-[50px] animate-fade-in-up px-[0px]">
            <LinkBrainHowItWorks theme="dark" language={language} />
          </div>
        )}
        {currentView === 'pricing' && (
          <div className="py-[50px] animate-fade-in-up px-[0px]">
            <LinkBrainPricing theme="dark" language={language} />
          </div>
        )}
      </LandingLayout>
      <InstallInstructionModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        theme={theme}
      />
      <Toaster />

      {/* Global Styles for Animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          opacity: 0;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-500 { animation-delay: 0.5s; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </>
  );
};

export default App;