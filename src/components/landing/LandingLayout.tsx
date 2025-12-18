import React, { useEffect, useState } from "react";
import { Menu, X, Download, Smartphone, Globe } from "lucide-react";
import { Logo } from "../Logo";
import { UnicornStudioWrapper } from "./UnicornStudioWrapper";
import { PrivacyPolicyModal, TermsOfServiceModal, ContactModal } from "./FooterModals";

interface LandingLayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: any) => void;
  onEnterApp: () => void;
  language: "en" | "ko";
  setLanguage: (lang: "en" | "ko") => void;
}

const TRANSLATIONS = {
  en: {
    nav: {
      features: "FEATURES",
      howItWorks: "HOW IT WORKS",
      pricing: "PRICING",
      login: "LOG IN",
      installApp: "Install App"
    },
    mobileMenu: {
      home: "HOME",
      makeBrain: "Make Second Brain"
    },
    footer: {
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      contact: "Contact Us",
      rights: "All rights reserved."
    }
  },
  ko: {
    nav: {
      features: "기능 소개",
      howItWorks: "동작 원리",
      pricing: "가격 정책",
      login: "로그인",
      installApp: "App 설치"
    },
    mobileMenu: {
      home: "홈",
      makeBrain: "내 두 번째 뇌 만들기"
    },
    footer: {
      privacy: "개인정보처리방침",
      terms: "이용약관",
      contact: "문의하기",
      rights: "All rights reserved."
    }
  }
};

export const LandingLayout = ({
  children,
  currentView,
  onNavigate,
  onEnterApp,
  language,
  setLanguage
}: LandingLayoutProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'contact' | null>(null);
  
  const t = TRANSLATIONS[language];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = [
    { id: 'features', label: t.nav.features },
    { id: 'how-it-works', label: t.nav.howItWorks },
    { id: 'pricing', label: t.nav.pricing },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ko' : 'en');
  };

  return (
    <div className="min-h-screen bg-[#0B1120] font-sans text-slate-100 selection:bg-[#21DBA4] selection:text-white overflow-x-hidden relative flex flex-col group">
      {/* Dynamic Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <UnicornStudioWrapper />
      </div>

      {/* Modals */}
      <PrivacyPolicyModal 
        isOpen={activeModal === 'privacy'} 
        onClose={() => setActiveModal(null)} 
        language={language}
      />
      <TermsOfServiceModal 
        isOpen={activeModal === 'terms'} 
        onClose={() => setActiveModal(null)} 
        language={language}
      />
      <ContactModal 
        isOpen={activeModal === 'contact'} 
        onClose={() => setActiveModal(null)} 
        language={language}
      />

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#0F172A] flex flex-col animate-fade-in-up md:hidden text-white">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-2">
              <Logo className="w-6 h-6 rounded-lg" />
              <span className="font-bold text-lg tracking-tight text-[#21DBA4]">
                Linkbrain
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 -mr-2 text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 px-6 pt-8 flex flex-col">
            <div className="flex flex-col gap-6 mb-8">
                <button 
                    onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
                    className={`text-xl font-bold ${currentView === 'home' ? 'text-[#21DBA4]' : 'text-white'}`}
                >
                    {t.mobileMenu.home}
                </button>
                {navItems.map(item => (
                    <button 
                        key={item.id}
                        onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                        className={`text-xl font-bold ${currentView === item.id ? 'text-[#21DBA4]' : 'text-slate-400'}`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="mt-auto flex flex-col gap-4 mb-8">
              {/* Language Toggle Mobile */}
              <div className="flex justify-center mb-4">
                 <div className="flex bg-slate-800 p-1 rounded-full">
                    <button 
                       onClick={() => setLanguage('ko')}
                       className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${language === 'ko' ? 'bg-[#21DBA4] text-white shadow-md' : 'text-slate-400'}`}
                    >
                       한국어
                    </button>
                    <button 
                       onClick={() => setLanguage('en')}
                       className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${language === 'en' ? 'bg-[#21DBA4] text-white shadow-md' : 'text-slate-400'}`}
                    >
                       English
                    </button>
                 </div>
              </div>

              <div className="pt-8 border-t border-slate-800 flex flex-col gap-4">
                <button
                  onClick={() => {
                    onEnterApp();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-[12px] rounded-xl border-2 border-[#21DBA4] text-[#21DBA4] font-bold text-base transition-transform active:scale-95 bg-transparent px-[0px]"
                >
                  {t.nav.login}
                </button>
                <button
                  onClick={() => {
                    onEnterApp();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3.5 rounded-xl bg-[#21DBA4] text-white font-bold text-base shadow-lg shadow-[#21DBA4]/20 active:scale-95 transition-transform hover:bg-[#1BC290]"
                >
                  {t.mobileMenu.makeBrain}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || currentView !== "home" ? "bg-[#0B1120]/80 backdrop-blur-xl border-b border-slate-800/50 py-4 shadow-sm" : "bg-transparent py-4 md:py-8"}`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between relative">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <Logo className="w-8 h-8 rounded-lg" />
            <span className="font-extrabold text-[20px] md:text-[22px] tracking-tight text-[#21DBA4]">
              Linkbrain
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navItems.map(item => (
                <button 
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`text-sm font-medium transition-colors ${currentView === item.id ? 'text-[#21DBA4]' : 'text-slate-400 hover:text-[#21DBA4]'}`}
                >
                    {item.label}
                </button>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
             {/* Language Toggle Desktop */}
            <button
               onClick={toggleLanguage}
               className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/50 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all border border-slate-700"
            >
               <Globe size={14} />
               {language === 'en' ? 'EN' : 'KO'}
            </button>

            <button
              onClick={onEnterApp}
              className="text-[13px] font-bold text-slate-400 hover:text-white hidden sm:block transition-colors uppercase tracking-wide mr-2"
            >
              {t.nav.login}
            </button>
            <button
              onClick={onEnterApp}
              className="px-4 md:px-6 py-2 md:py-2.5 rounded-full bg-[#21DBA4] text-white text-[13px] font-bold hover:bg-[#1BC290] hover:shadow-lg hover:shadow-[#21DBA4]/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 active:scale-95 duration-200 shadow-md shadow-[#21DBA4]/20"
            >
              <Download size={16} strokeWidth={2.5} className="md:w-[18px] md:h-[18px]" />
              <span>{t.nav.installApp}</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 text-slate-400 hover:text-[#21DBA4] transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 pt-24 animate-fade-in-up">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#0B1120] border-t border-slate-800 py-[50px] relative z-10 mt-auto px-[0px]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 relative">
          <div className="flex items-center gap-2">
            <Logo className="w-7 h-7 rounded-lg opacity-80" />
            <span className="font-bold text-[#21DBA4] text-sm text-[18px]">
              Linkbrain
            </span>
          </div>
          <div className="flex gap-8 text-[12px] font-medium text-slate-500 md:absolute md:left-1/2 md:-translate-x-1/2">
            <button onClick={() => setActiveModal('privacy')} className="hover:text-[#21DBA4] transition-colors text-left">{t.footer.privacy}</button>
            <button onClick={() => setActiveModal('terms')} className="hover:text-[#21DBA4] transition-colors text-left">{t.footer.terms}</button>
            <button onClick={() => setActiveModal('contact')} className="hover:text-[#21DBA4] transition-colors text-left">{t.footer.contact}</button>
          </div>
          <div className="text-[12px] text-slate-600">
            © 2025 Linkbrain Inc. {t.footer.rights}
          </div>
        </div>
      </footer>
    </div>
  );
};
