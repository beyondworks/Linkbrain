import React from 'react';
import {
  Brain,
  Hash,
  Search,
  Smartphone,
  Shield,
  Zap,
  Globe,
  Layers,
  Command
} from 'lucide-react';
import { motion } from 'motion/react';

const TRANSLATIONS = {
  en: {
    features: "Features",
    title: "Supercharge Your",
    titleSuffix: "Second Brain",
    description: "LinkBrain isn't just a bookmark manager. It's an intelligent workspace that helps you learn faster and remember more.",
    autoSummarization: "AI Auto-Summarization",
    autoSummarizationDesc: "Stop drowning in long articles. LinkBrain reads for you and extracts key takeaways instantly.",
    smartTagging: "Smart Tagging",
    smartTaggingDesc: "No more manual organization. AI understands the context and applies relevant tags automatically.",
    semanticSearch: "Semantic Search",
    semanticSearchDesc: "Don't just search for keywords. Ask questions like 'What did I read about React performance?'",
    knowledgeGraph: "Knowledge Graph",
    knowledgeGraphDesc: "Visualize how your saved links connect. Discover hidden relationships between different topics.",
    crossPlatform: "Cross-Platform",
    crossPlatformDesc: "Save from Chrome, read on iOS, and organize on Mac. Your second brain is everywhere you are.",
    privacyFirst: "Privacy First",
    privacyFirstDesc: "Your data is yours. We use local-first architecture where possible to keep your thoughts private.",
    ctaTitle: "Ready to upgrade your mind?",
    ctaButton: "Get Started for Free"
  },
  ko: {
    features: "주요 기능",
    title: "당신의",
    titleSuffix: "세컨드 브레인을 강화하세요",
    description: "Linkbrain은 단순한 북마크 관리자가 아닙니다. 더 빨리 배우고 더 많이 기억할 수 있도록 돕는 지능형 작업 공간입니다.",
    autoSummarization: "AI 자동 요약",
    autoSummarizationDesc: "긴 글을 읽느라 시간을 낭비하지 마세요. LinkBrain이 대신 읽고 핵심 내용을 즉시 추출해 줍니다.",
    smartTagging: "스마트 태깅",
    smartTaggingDesc: "수동으로 정리할 필요가 없습니다. AI가 문맥을 이해하고 관련 태그를 자동으로 적용합니다.",
    semanticSearch: "의미 기반 검색",
    semanticSearchDesc: "단순 키워드 검색이 아닙니다. 'React 성능에 대해 읽은 내용이 뭐였지?'처럼 질문해 보세요.",
    knowledgeGraph: "지식 그래프",
    knowledgeGraphDesc: "저장된 링크들이 어떻게 연결되는지 시각화하세요. 주제 간의 숨겨진 관계를 발견할 수 있습니다.",
    crossPlatform: "크로스 플랫폼",
    crossPlatformDesc: "Chrome에서 저장하고, iOS에서 읽고, Mac에서 정리하세요. 당신의 세컨드 브레인은 어디에나 있습니다.",
    privacyFirst: "프라이버시 우선",
    privacyFirstDesc: "당신의 데이터는 당신의 것입니다. 로컬 우선 아키텍처를 사용하여 생각을 안전하게 비공개로 유지합니다.",
    ctaTitle: "당신의 두뇌를 업그레이드할 준비가 되셨나요?",
    ctaButton: "무료로 시작하기"
  }
};

export const LinkBrainFeatures = ({ theme, language = 'en', onEnterApp }: { theme: 'light' | 'dark', language?: 'en' | 'ko', onEnterApp?: () => void }) => {
  const isDark = theme === 'dark';
  const t = TRANSLATIONS[language];

  const features = [
    {
      icon: <Brain size={32} />,
      title: t.autoSummarization,
      description: t.autoSummarizationDesc
    },
    {
      icon: <Hash size={32} />,
      title: t.smartTagging,
      description: t.smartTaggingDesc
    },
    {
      icon: <Search size={32} />,
      title: t.semanticSearch,
      description: t.semanticSearchDesc
    },
    {
      icon: <Layers size={32} />,
      title: t.knowledgeGraph,
      description: t.knowledgeGraphDesc
    },
    {
      icon: <Smartphone size={32} />,
      title: t.crossPlatform,
      description: t.crossPlatformDesc
    },
    {
      icon: <Shield size={32} />,
      title: t.privacyFirst,
      description: t.privacyFirstDesc
    }
  ];

  return (
    <div className={`w-full min-h-full p-4 md:p-8 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#21DBA4]/10 text-[#21DBA4] text-xs font-bold mb-4">
            <Zap size={14} fill="currentColor" /> {t.features}
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight break-keep">
            {language === 'en' ? (
              <>
                {t.title} <span className="text-[#21DBA4]">{t.titleSuffix}</span>
              </>
            ) : (
              <>
                <span className="text-[#21DBA4]">{t.titleSuffix}</span>
              </>
            )}
          </h1>
          <p className={`text-base md:text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'} break-keep`}>
            {t.description}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-20">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`p-6 md:p-8 rounded-3xl border transition-all hover:-translate-y-2 hover:shadow-xl group ${isDark ? 'bg-slate-900 border-slate-800 hover:border-[#21DBA4]/30' : 'bg-white border-slate-100 hover:border-[#21DBA4]/30 hover:shadow-slate-200/50'
                }`}
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#21DBA4]/10 flex items-center justify-center text-[#21DBA4] mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className={`text-lg md:text-xl font-bold mb-2 md:mb-3 ${isDark ? 'text-white' : 'text-slate-900'} break-keep`}>
                {feature.title}
              </h3>
              <p className={`text-sm md:text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'} break-keep`}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <div className={`rounded-3xl p-12 text-center relative overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-900'}`}>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 text-[30px]">{t.ctaTitle}</h2>
            <button
              onClick={onEnterApp}
              className="px-8 py-2 bg-[#21DBA4] hover:bg-[#1ec493] text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-[#21DBA4]/30 hover:shadow-[#21DBA4]/50 hover:scale-105 text-[14px]"
            >
              {t.ctaButton}
            </button>
          </div>

          {/* Background Decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <Brain size={400} className="absolute -right-20 -bottom-20 text-white" />
            <Command size={300} className="absolute -left-20 -top-20 text-white" />
          </div>
        </div>

        <div className="h-20"></div>
      </div>
    </div>
  );
};
