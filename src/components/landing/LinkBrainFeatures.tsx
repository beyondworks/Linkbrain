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

export const LinkBrainFeatures = ({ theme, language = 'en' }: { theme: 'light' | 'dark', language?: 'en' | 'ko' }) => {
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
    <div className={`w-full min-h-full px-6 py-12 md:p-12 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-24 md:mb-48">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="inline-block mb-4"
          >
             <span className="px-3 py-1 rounded-full border border-[#21DBA4]/30 bg-[#21DBA4]/10 text-[#21DBA4] text-[11px] font-bold uppercase tracking-widest">
                Features
             </span>
          </motion.div>
          <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 tracking-tight break-keep leading-tight"
          >
            {language === 'en' ? (
                <>
                {t.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#21DBA4] to-blue-500">{t.titleSuffix}</span>
                </>
            ) : (
                <>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#21DBA4] to-blue-500">{t.titleSuffix}</span>
                </>
            )}
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className={`text-base md:text-xl max-w-2xl mx-auto break-keep leading-relaxed font-medium px-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
          >
            Linkbrain은 단순한 북마크 관리자가 아닙니다.<br className="hidden md:block"/>
            더 빨리 배우고 더 많이 기억할 수 있도록 돕는 지능형 작업 공간입니다.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16 md:gap-y-32 max-w-5xl mx-auto pb-20 md:pb-32 px-4 md:px-0">
           {features.map((feature, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               viewport={{ once: true }}
               className="group flex flex-col items-center text-center md:items-start md:text-left"
             >
                <div className="text-[#21DBA4] mb-4 group-hover:scale-110 transition-transform duration-300 origin-center md:origin-left">
                   {React.isValidElement(feature.icon) ? React.cloneElement(feature.icon as React.ReactElement, { size: 28, strokeWidth: 1.5 }) : feature.icon}
                </div>
                <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'} break-keep`}>
                   {feature.title}
                </h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'} break-keep`}>
                   {feature.description}
                </p>
             </motion.div>
           ))}
        </div>

        {/* CTA Section */}
        <div className={`max-w-5xl mx-auto rounded-3xl py-12 px-6 text-center relative overflow-hidden ${isDark ? 'bg-gradient-to-b from-transparent to-slate-900/50 border border-slate-800' : 'bg-slate-50 border border-slate-100'}`}>
           <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.ctaTitle}</h2>
              <button className="px-8 py-3 bg-[#21DBA4] hover:bg-[#1ec493] text-white rounded-full font-bold text-sm transition-all hover:scale-105">
                 {t.ctaButton}
              </button>
           </div>
        </div>
        
        <div className="h-20"></div>
      </div>
    </div>
  );
};
