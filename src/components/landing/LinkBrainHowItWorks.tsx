import React, { useState, useEffect } from 'react';
import { 
  Download, 
  ArrowRight,
  CheckCircle2,
  Search,
  Sparkles,
  Zap,
  Globe,
  Smartphone,
  MessageSquare,
  Twitter,
  Chrome,
  Layout,
  Youtube,
  FileText,
  Hash,
  Share2,
  BrainCircuit,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../Logo';

const TRANSLATIONS = {
  en: {
    title: "Your Knowledge",
    titleSuffix: "Automated",
    description: "LinkBrain turns your chaotic browsing history into an organized knowledge base without you lifting a finger.",
    step1Title: "Capture Anything, Anywhere",
    step1Desc: "Whether it's a YouTube video, a Twitter thread, or a PDF report. Just hit 'Save' extension or share from mobile. We handle the parsing.",
    step2Title: "AI-Powered Organization",
    step2Desc: "LinkBrain reads the content for you. It generates concise summaries, extracts key insights, and applies relevant tags automatically.",
    step3Title: "Chat with Your Second Brain",
    step3Desc: "Stop searching with keywords. Start talking. Ask complex questions about your saved content and get answers with citations.",
    integrationTitle: "Seamlessly Integrated With"
  },
  ko: {
    title: "지식 관리의",
    titleSuffix: "완전 자동화",
    description: "LinkBrain은 복잡한 브라우징 기록을 정리된 지식 베이스로 변환합니다. 당신은 그저 '저장'만 하세요.",
    step1Title: "무엇이든, 어디서든 수집",
    step1Desc: "유튜브 영상, 트위터 스레드, PDF 리포트까지. 브라우저 확장 프로그램이나 모바일 공유 버튼으로 저장하세요. 파싱은 저희가 합니다.",
    step2Title: "AI 기반 자동 정리",
    step2Desc: "LinkBrain이 당신 대신 콘텐츠를 읽습니다. 핵심 내용을 3줄로 요약하고, 문맥에 맞는 태그를 자동으로 생성하여 분류합니다.",
    step3Title: "세컨드 브레인과의 대화",
    step3Desc: "키워드로 검색하던 시대는 끝났습니다. 이제 저장된 지식에게 직접 물어보세요. 출처가 포함된 정확한 답변을 얻을 수 있습니다.",
    integrationTitle: "다양한 플랫폼과 완벽 연동"
  }
};

export const LinkBrainHowItWorks = ({ theme, language = 'en' }: { theme: 'light' | 'dark', language?: 'en' | 'ko' }) => {
  const t = TRANSLATIONS[language];
  const isDark = theme === 'dark';

  const steps = [
    {
      id: "01",
      title: t.step1Title,
      description: t.step1Desc,
      icon: <Download />,
      color: "from-blue-400 to-indigo-600",
      scene: <CaptureScene isDark={isDark} />
    },
    {
      id: "02",
      title: t.step2Title,
      description: t.step2Desc,
      icon: <BrainCircuit />,
      color: "from-[#21DBA4] to-emerald-600",
      scene: <ProcessScene isDark={isDark} />
    },
    {
      id: "03",
      title: t.step3Title,
      description: t.step3Desc,
      icon: <Bot />,
      color: "from-purple-400 to-violet-600",
      scene: <ChatScene isDark={isDark} language={language} />
    }
  ];

  return (
    <div className={`w-full min-h-full px-6 py-12 md:py-20 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20 md:mb-40">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="inline-block mb-4"
          >
             <span className="px-3 py-1 rounded-full border border-[#21DBA4]/30 bg-[#21DBA4]/10 text-[#21DBA4] text-[10px] font-bold uppercase tracking-widest">
                How It Works
             </span>
          </motion.div>
          <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight break-keep leading-tight"
          >
             {language === 'en' ? (
                <>
                {t.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#21DBA4] to-blue-500">{t.titleSuffix}</span>
                </>
             ) : (
                <>
                 {t.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#21DBA4] to-blue-500">{t.titleSuffix}</span>
                </>
             )}
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className={`text-sm md:text-lg max-w-xl mx-auto break-keep leading-relaxed font-medium px-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
          >
             {t.description}
          </motion.p>
        </div>

        {/* Steps Timeline */}
        <div className="relative pb-10 md:pb-20">
          <div className={`absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block ${isDark ? 'bg-gradient-to-b from-slate-800 via-[#21DBA4]/20 to-slate-800' : 'bg-gradient-to-b from-slate-200 via-[#21DBA4]/20 to-slate-200'}`}></div>

          <div className="space-y-16 md:space-y-32">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Center Node (Desktop) */}
                <div className={`absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-4 z-10 hidden md:flex items-center justify-center shadow-xl group ${isDark ? 'bg-[#1E293B] border-[#0B1120] shadow-black/50' : 'bg-white border-white shadow-slate-200'}`}>
                   <div className={`w-full h-full rounded-full bg-gradient-to-br ${step.color} opacity-20 group-hover:opacity-100 transition-opacity duration-500`}></div>
                   <div className={`absolute inset-0 flex items-center justify-center font-black text-xs ${isDark ? 'text-white' : 'text-slate-700'}`}>{step.id}</div>
                </div>

                {/* Text Content */}
                <div className="flex-1 text-center md:text-left px-4 md:px-0 mt-[60px] mr-[0px] mb-[0px] ml-[0px]">
                   <div className={`inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl text-white mb-4 shadow-2xl shadow-${step.color.split(' ')[1]}/30 bg-gradient-to-br ${step.color}`}>
                      {React.cloneElement(step.icon as React.ReactElement, { size: 20 })}
                   </div>
                   <h3 className={`text-xl md:text-3xl font-black mb-3 break-keep ${isDark ? 'text-white' : 'text-slate-900'}`}>{step.title}</h3>
                   <p className={`text-sm md:text-base leading-relaxed break-keep ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {step.description}
                   </p>
                </div>

                {/* Visual Content (Interactive Scene) */}
                <div className="flex-1 w-full px-4 md:px-0 perspective-1000">
                   <div className={`relative rounded-2xl border shadow-2xl backdrop-blur-sm overflow-hidden h-[240px] md:h-[320px] group transition-colors flex items-center justify-center ${
                       isDark 
                        ? 'bg-[#1E293B]/50 border-slate-700/50 hover:border-[#21DBA4]/30' 
                        : 'bg-white/50 border-slate-200 hover:border-[#21DBA4]/30'
                   }`}>
                      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(${isDark ? '#fff' : '#000'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? '#fff' : '#000'} 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
                      
                      {/* Scale content for mobile */}
                      <div className="transform scale-[0.6] sm:scale-75 md:scale-90 origin-center">
                         {step.scene}
                      </div>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Integration List */}
        <div className={`text-center py-12 md:py-20 mt-10 md:mt-20 border-t ${isDark ? 'border-slate-800/50' : 'border-slate-200'}`}>
           <h3 className={`text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-8 md:mb-10 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.integrationTitle}</h3>
           
           <div className="flex flex-wrap justify-center gap-3 md:gap-6 px-4">
              {[
                 { name: 'Chrome', icon: <Chrome size={16} className="md:w-5 md:h-5" /> },
                 { name: 'Safari', icon: <Globe size={16} className="md:w-5 md:h-5" /> },
                 { name: 'Slack', icon: <MessageSquare size={16} className="md:w-5 md:h-5" /> },
                 { name: 'Mobile', icon: <Smartphone size={16} className="md:w-5 md:h-5" /> },
                 { name: 'Twitter', icon: <Twitter size={16} className="md:w-5 md:h-5" /> },
                 { name: 'Youtube', icon: <Youtube size={16} className="md:w-5 md:h-5" /> }
              ].map((platform, i) => (
                 <motion.div 
                    key={platform.name}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-center gap-2 md:gap-3 border px-4 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl hover:border-[#21DBA4]/50 transition-all cursor-default group ${
                        isDark 
                        ? 'bg-[#1E293B] border-slate-700 hover:bg-[#1E293B]/80' 
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                 >
                    <span className={`transition-colors ${isDark ? 'text-slate-400 group-hover:text-[#21DBA4]' : 'text-slate-500 group-hover:text-[#21DBA4]'}`}>{platform.icon}</span>
                    <span className={`font-bold text-xs md:text-base transition-colors ${isDark ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'}`}>{platform.name}</span>
                 </motion.div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// Scene 1: Universal Capture
// ----------------------------------------------------------------------
const CaptureScene = ({ isDark }: { isDark: boolean }) => {
   const items = [
      { id: 1, type: 'web', icon: <Chrome size={14} />, color: 'bg-blue-500', label: 'Article', x: -80, y: -60, delay: 0 },
      { id: 2, type: 'video', icon: <Youtube size={14} />, color: 'bg-red-500', label: 'Video', x: 80, y: -40, delay: 1.5 },
      { id: 3, type: 'social', icon: <Twitter size={14} />, color: 'bg-sky-500', label: 'Thread', x: -60, y: 60, delay: 3 },
      { id: 4, type: 'pdf', icon: <FileText size={14} />, color: 'bg-orange-500', label: 'PDF', x: 70, y: 50, delay: 4.5 },
   ];

   return (
      <div className="relative w-64 h-64 flex items-center justify-center">
         {/* Central Hub */}
         <div className="relative z-10">
             <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl relative z-10 ${isDark ? 'bg-[#0B1120] border border-slate-700' : 'bg-white border border-slate-200'}`}>
                 <Logo className="w-10 h-10 rounded-lg" />
                 <div className="absolute -right-2 -top-2 w-6 h-6 bg-[#21DBA4] rounded-full flex items-center justify-center border-2 border-[#1E293B]">
                     <Download size={12} className="text-white" />
                 </div>
             </div>
             {/* Ripple Effect */}
             <motion.div 
                 animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="absolute inset-0 rounded-2xl bg-[#21DBA4]/20 -z-10"
             />
         </div>

         {/* Incoming Items */}
         {items.map((item) => (
            <FloatingItem key={item.id} {...item} isDark={isDark} />
         ))}
      </div>
   );
};

const FloatingItem = ({ type, icon, color, label, x, y, delay, isDark }: any) => {
    return (
        <motion.div
            animate={{ 
                x: [x, 0, x], 
                y: [y, 0, y],
                scale: [1, 0, 0],
                opacity: [1, 1, 0]
            }}
            transition={{ 
                duration: 3,
                repeat: Infinity,
                delay: delay,
                repeatDelay: 3
            }}
            className={`absolute flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg border ${
                isDark ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'
            }`}
        >
            <div className={`w-6 h-6 rounded flex items-center justify-center text-white ${color}`}>
                {icon}
            </div>
            <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{label}</span>
        </motion.div>
    );
};

// ----------------------------------------------------------------------
// Scene 2: AI Processing (Tagging & Summarization)
// ----------------------------------------------------------------------
const ProcessScene = ({ isDark }: { isDark: boolean }) => {
   return (
      <div className={`relative w-72 h-48 rounded-xl border flex overflow-hidden shadow-2xl ${
          isDark ? 'bg-[#0B1120] border-slate-700' : 'bg-white border-slate-200'
      }`}>
         {/* Sidebar */}
         <div className={`w-16 border-r flex flex-col items-center py-4 gap-4 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50'}`}>
             <div className="w-8 h-8 rounded-lg bg-slate-200/20"></div>
             <div className="w-8 h-8 rounded-lg bg-slate-200/20"></div>
             <div className="w-8 h-8 rounded-lg bg-slate-200/20"></div>
         </div>

         {/* Content Area */}
         <div className="flex-1 p-4 relative">
             {/* Text Lines */}
             <div className="space-y-3 mb-6 opacity-30">
                 <div className={`h-2 rounded w-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                 <div className={`h-2 rounded w-5/6 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                 <div className={`h-2 rounded w-4/6 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                 <div className={`h-2 rounded w-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
             </div>

             {/* Scanning Beam */}
             <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-[#21DBA4] shadow-[0_0_15px_rgba(33,219,164,0.5)] z-10 opacity-50"
             />

             {/* Generated Meta Cards */}
             <div className="absolute bottom-4 right-4 flex flex-col gap-2 items-end">
                 {/* Summary Card */}
                 <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1, repeat: Infinity, repeatDelay: 3 }}
                    className={`p-3 rounded-lg border shadow-lg max-w-[160px] ${isDark ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-200'}`}
                 >
                     <div className="flex items-center gap-2 mb-2">
                         <Sparkles size={12} className="text-[#21DBA4]" />
                         <span className={`text-[10px] font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Summary</span>
                     </div>
                     <div className={`space-y-1.5`}>
                         <div className={`h-1.5 rounded w-full ${isDark ? 'bg-slate-600' : 'bg-slate-200'}`}></div>
                         <div className={`h-1.5 rounded w-3/4 ${isDark ? 'bg-slate-600' : 'bg-slate-200'}`}></div>
                     </div>
                 </motion.div>

                 {/* Tags */}
                 <div className="flex gap-2">
                     <TagItem label="#Design" color="bg-pink-500" delay={1.5} />
                     <TagItem label="#Productivity" color="bg-purple-500" delay={1.7} />
                 </div>
             </div>
         </div>
      </div>
   );
};

const TagItem = ({ label, color, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: delay, repeat: Infinity, repeatDelay: 3.5 }}
        className={`px-2 py-1 rounded-full text-[10px] font-bold text-white ${color} shadow-md`}
    >
        {label}
    </motion.div>
);

// ----------------------------------------------------------------------
// Scene 3: Chat Interface
// ----------------------------------------------------------------------
const ChatScene = ({ isDark, language }: { isDark: boolean, language: string }) => {
    const question = language === 'en' ? "What are the key trends in 2025?" : "2025년 주요 디자인 트렌드는?";
    const answer = language === 'en' ? "Based on your saved articles, the key trends are: 1. AI-Driven Personalization 2. Neo-Brutalism in UI..." : "저장된 아티클을 분석한 결과: 1. AI 기반 개인화 2. UI에서의 네오 브루탈리즘...";

    return (
        <div className={`w-72 flex flex-col rounded-2xl border overflow-hidden shadow-2xl ${
            isDark ? 'bg-[#0B1120] border-slate-700' : 'bg-white border-slate-200'
        }`}>
            {/* Chat Header */}
            <div className={`p-3 border-b flex items-center gap-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#21DBA4] to-blue-500 p-0.5">
                    <div className={`w-full h-full rounded-full flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                        <Bot size={16} className="text-[#21DBA4]" />
                    </div>
                </div>
                <div>
                    <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>LinkBrain AI</div>
                    <div className="text-[10px] text-[#21DBA4] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#21DBA4]"></span> Online
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 p-4 space-y-4 min-h-[200px] ${isDark ? 'bg-[#0B1120]' : 'bg-white'}`}>
                {/* User Message */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-end"
                >
                    <div className="bg-[#21DBA4] text-white px-3 py-2 rounded-2xl rounded-tr-none text-xs font-medium max-w-[80%] shadow-md">
                        {question}
                    </div>
                </motion.div>

                {/* AI Response */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    className="flex justify-start"
                >
                    <div className={`px-3 py-2 rounded-2xl rounded-tl-none text-xs font-medium max-w-[90%] shadow-sm border ${
                        isDark ? 'bg-[#1E293B] border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>
                        <Typewriter text={answer} delay={1.5} />
                    </div>
                </motion.div>
                
                {/* Citation Mock */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 4 }}
                    className={`ml-2 flex items-center gap-2 p-2 rounded-lg border w-fit ${
                        isDark ? 'bg-[#1E293B]/50 border-slate-800' : 'bg-slate-50 border-slate-100'
                    }`}
                >
                    <FileText size={10} className="text-slate-400" />
                    <span className="text-[9px] text-slate-400">Source: Design Trends Report.pdf</span>
                </motion.div>
            </div>
        </div>
    );
};

const Typewriter = ({ text, delay }: { text: string, delay: number }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        const timeout = setTimeout(() => {
            let i = 0;
            const timer = setInterval(() => {
                setDisplayedText(text.substring(0, i));
                i++;
                if (i > text.length) clearInterval(timer);
            }, 50); // Typing speed
            return () => clearInterval(timer);
        }, delay * 1000);
        return () => clearTimeout(timeout);
    }, [text, delay]);

    return <span>{displayedText}</span>;
};

