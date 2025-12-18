import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Smartphone, Download } from 'lucide-react';
import { HeroInterfaceDemo } from './HeroInterfaceDemo';
import { StorytellingSection } from './StorytellingSection';
import { Testimonials } from './Testimonials';
import { TrustSignals } from './TrustSignals';

interface HomePageProps {
  onEnterApp: () => void;
  language: 'en' | 'ko';
}

const TRANSLATIONS = {
  en: {
    hero: {
      badge: "Second Brain for You",
      mobileTitle: (
        <>
          Where Lost<br/>
          Thoughts<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#21DBA4] to-[#3b82f6]">
            Return
          </span>
        </>
      ),
      mobileDesc: (
        <>
          Your second brain where<br/>
          every discovery becomes a memory
        </>
      ),
      desktopTitle: (
        <>
          Where Lost Thoughts<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#21DBA4] to-[#3b82f6]">
            Return
          </span>
        </>
      ),
      desktopDesc: "Your second brain where every discovery becomes a memory",
      cta: "Make Second Brain",
    },
    footerAbove: {
      title: (
        <>
          Memory is<br/>
          <span className="text-[#21DBA4]">
            the Start of Thinking
          </span>
        </>
      ),
      desc: (
        <>
          With Linkbrain,<br/>
          forget how to forget.
        </>
      ),
      cta: "Start for Free",
      subtext: "iOS / Android PWA Supported"
    }
  },
  ko: {
    hero: {
      badge: "Second Brain for You",
      mobileTitle: (
        <>
          잃어버린<br/>
          생각을<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#21DBA4] to-[#3b82f6]">
            다시 찾는 곳
          </span>
        </>
      ),
      mobileDesc: (
        <>
          당신의 모든 발견이<br/>
          기억으로 남는 두 번째 뇌
        </>
      ),
      desktopTitle: (
        <>
          잃어버린 생각을<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#21DBA4] to-[#3b82f6]">
            다시 찾는 곳
          </span>
        </>
      ),
      desktopDesc: "당신의 모든 발견이 기억으로 남는 두 번째 뇌",
      cta: "Make Second Brain",
    },
    footerAbove: {
      title: (
        <>
          기억은
          <br />
          <span className="text-[#21DBA4]">
            생각의 시작
          </span>
          입니다
        </>
      ),
      desc: (
        <>
          Linkbrain과 함께
          <br />
          잊는 방법을 잊어버리세요.
        </>
      ),
      cta: "무료로 시작하기",
      subtext: "iOS / Android PWA 지원"
    }
  }
};

export const HomePage = ({ onEnterApp, language }: HomePageProps) => {
  const t = TRANSLATIONS[language];

  return (
    <>
        {/* 1. Hero Section */}
        <section className="relative pt-[80px] pb-[60px] md:pt-[120px] md:pb-[140px] px-6 overflow-visible z-10">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 shadow-sm mb-8 md:mb-12 animate-fade-in-up hover:scale-105 transition-transform cursor-default backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#21DBA4] animate-pulse"></span>
              <span className="text-[11px] font-bold text-slate-300 tracking-wider uppercase">
                {t.hero.badge}
              </span>
            </div>

            {/* ==============================================
                MOBILE HERO CONTENT
                - 수정 시 데스크톱에 영향 없음
                ============================================== */}
            <div className="block md:hidden w-full">
              {/* Headline (Mobile) */}
              <h1 className="text-[52px] leading-[1.1] font-black tracking-tighter mb-[32px] animate-fade-in-up delay-100 text-white drop-shadow-2xl font-[Pretendard] mt-4">
                {t.hero.mobileTitle}
              </h1>

              {/* Description (Mobile) */}
              <p className="text-base text-slate-400 mb-[40px] leading-relaxed animate-fade-in-up delay-200 font-medium tracking-tight whitespace-pre-line font-[Pretendard] px-2">
                {t.hero.mobileDesc}
              </p>

              {/* CTA Buttons (Mobile) */}
              <div className="w-full flex flex-col items-center justify-center gap-4 mb-20 animate-fade-in-up delay-300">
                <button
                  onClick={onEnterApp}
                  className="w-full px-10 py-4 bg-[#21DBA4] text-white rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#1BC290] transition-all shadow-xl shadow-[#21DBA4]/15 active:scale-95 duration-200"
                >
                  {t.hero.cta}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            {/* ==============================================
                DESKTOP HERO CONTENT
                - 수정 시 모바일에 영향 없음
                ============================================== */}
            <div className="hidden md:block w-full mt-[0px] mr-[0px] mb-[60px] ml-[0px]">
              {/* Headline (Desktop) */}
              <h1 className="text-6xl lg:text-[80px] font-black tracking-tighter leading-[1.1] mb-[32px] animate-fade-in-up delay-100 max-w-4xl text-white drop-shadow-2xl font-[Pretendard] mt-4 mx-auto">
                {t.hero.desktopTitle}
              </h1>

              {/* Description (Desktop) */}
              <p className="text-lg text-slate-400 mb-[30px] max-w-xl mx-auto leading-relaxed animate-fade-in-up delay-200 font-medium tracking-tight whitespace-pre-line font-[Pretendard]">
                {t.hero.desktopDesc}
              </p>

              {/* CTA Buttons (Desktop) */}
              <div className="flex flex-row items-center justify-center gap-4 mb-28 animate-fade-in-up delay-300">
                <button
                  onClick={onEnterApp}
                  className="group relative px-10 py-4 bg-[#21DBA4] text-white rounded-full font-bold text-base flex items-center gap-2 hover:bg-[#1BC290] hover:shadow-2xl hover:shadow-[#21DBA4]/25 transition-all overflow-hidden shadow-xl shadow-[#21DBA4]/15 active:scale-95 duration-200"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                  {t.hero.cta}{" "}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>

            {/* Hero Animation Mockup */}
            <div className="relative w-full max-w-5xl mx-auto h-[480px] md:h-[600px] animate-fade-in-up delay-500 perspective-1000 group">
              <HeroInterfaceDemo />
            </div>
          </div>
        </section>

        {/* 2. Opening Statement (Storytelling) */}
        <StorytellingSection language={language} />

        {/* 5. Social Proof (Real Stories) */}
        <Testimonials language={language} />

        {/* 6. Trust Signals */}
        <TrustSignals language={language} />

        {/* 7. Footer Above - Final Message */}
        <section className="relative py-32 md:py-48 px-6 text-center bg-[#0B1120]">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight font-[Pretendard] font-normal text-[32px]">
                {t.footerAbove.title}
              </h2>
              <p className="md:text-xl text-slate-300 leading-relaxed font-medium pt-[0px] pr-[0px] pb-[20px] pl-[0px] px-[0px] py-[20px] text-[16px]">
                {t.footerAbove.desc}
              </p>
            </motion.div>

            <button
              onClick={onEnterApp}
              className="px-[36px] py-[15px] bg-[#21DBA4] text-white rounded-full font-bold text-base shadow-2xl shadow-[#21DBA4]/20 hover:bg-[#1BC290] hover:scale-105 transition-all inline-flex items-center gap-2 active:scale-95 duration-200"
            >
              <Download size={18} /> {t.footerAbove.cta}
            </button>

            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
              <Smartphone size={14} /> {t.footerAbove.subtext}
            </div>
          </div>
        </section>
    </>
  );
};
