import React from 'react';
import {
   Download,
   Cpu,
   Lightbulb,
   ArrowRight,
   CheckCircle2,
   Share,
   Search,
   Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

const TRANSLATIONS = {
   en: {
      title: "From Chaos to",
      titleSuffix: "Clarity",
      description: "LinkBrain automates the tedious parts of knowledge management so you can focus on connecting the dots.",
      step1Title: "Capture Everything",
      step1Desc: "Save articles, videos, and threads with a single click using our browser extension or mobile share sheet.",
      step2Title: "AI Processing",
      step2Desc: "Our AI automatically reads content, extracts key points, summarizes, and tags it for you.",
      step3Title: "Instant Recall",
      step3Desc: "Ask questions to your brain or browse by auto-generated topics. Never lose a good idea again.",
      integrationTitle: "Works where you work"
   },
   ko: {
      title: "혼돈에서",
      titleSuffix: "명확함으로",
      description: "LinkBrain은 지식 관리의 지루한 부분을 자동화하여, 당신이 지식을 연결하고 통찰을 얻는 데 집중할 수 있게 합니다.",
      step1Title: "모든 것을 수집하세요",
      step1Desc: "브라우저 확장 프로그램이나 모바일 공유 시트를 사용해 클릭 한 번으로 기사, 영상, 스레드를 저장하세요.",
      step2Title: "AI 자동 처리",
      step2Desc: "AI가 콘텐츠를 자동으로 읽고, 핵심 내용을 추출하고, 요약하고, 태그를 붙여줍니다.",
      step3Title: "즉각적인 회상",
      step3Desc: "내 세컨드 브레인에 질문하거나 자동 생성된 주제별로 탐색하세요. 다시는 좋은 아이디어를 잃어버리지 마세요.",
      integrationTitle: "어디서나 함께합니다"
   }
};

export const LinkBrainHowItWorks = ({ theme, language = 'en' }: { theme: 'light' | 'dark', language?: 'en' | 'ko' }) => {
   const isDark = theme === 'dark';
   const t = TRANSLATIONS[language];

   const steps = [
      {
         id: "01",
         title: t.step1Title,
         description: t.step1Desc,
         icon: <Download size={24} />,
         color: "bg-blue-500"
      },
      {
         id: "02",
         title: t.step2Title,
         description: t.step2Desc,
         icon: <Cpu size={24} />,
         color: "bg-purple-500"
      },
      {
         id: "03",
         title: t.step3Title,
         description: t.step3Desc,
         icon: <Lightbulb size={24} />,
         color: "bg-amber-500"
      }
   ];

   return (
      <div className={`w-full min-h-full p-4 md:p-8 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
         <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="text-center mb-16 md:mb-20">
               <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight break-keep">
                  {language === 'en' ? (
                     <>
                        {t.title} <span className="text-[#21DBA4]">{t.titleSuffix}</span>
                     </>
                  ) : (
                     <>
                        {t.title} <span className="text-[#21DBA4]">{t.titleSuffix}</span>
                     </>
                  )}
               </h1>
               <p className={`text-base md:text-lg max-w-2xl mx-auto break-keep ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {t.description}
               </p>
            </div>

            {/* Steps Timeline */}
            <div className="relative pb-20">
               {/* Vertical Line for Desktop */}
               <div className={`absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>

               <div className="space-y-12 md:space-y-24">
                  {steps.map((step, idx) => (
                     <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                     >
                        {/* Center Node */}
                        <div className={`absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-4 z-10 hidden md:flex items-center justify-center font-black text-sm ${isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-500'}`}>
                           {step.id}
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 text-center md:text-left">
                           <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl text-white mb-4 shadow-lg ${step.color}`}>
                              {step.icon}
                           </div>
                           <h3 className={`text-xl md:text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'} break-keep`}>{step.title}</h3>
                           <p className={`text-sm md:text-lg leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'} break-keep`}>
                              {step.description}
                           </p>
                        </div>

                        {/* Visual Content (Mockup) */}
                        <div className="flex-1 w-full">
                           <div className={`aspect-video rounded-3xl border shadow-2xl overflow-hidden relative group ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                              {/* Abstract UI representation for each step */}
                              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-800 dark:to-slate-900">
                                 {idx === 0 && (
                                    <div className="flex flex-col gap-3 items-center opacity-80">
                                       <div className="w-48 h-12 bg-white dark:bg-slate-700 rounded-lg shadow-sm flex items-center px-4 gap-3 animate-pulse">
                                          <div className="w-6 h-6 rounded bg-blue-500/20"></div>
                                          <div className="h-2 w-24 bg-slate-200 dark:bg-slate-600 rounded"></div>
                                       </div>
                                       <div className="w-12 h-12 bg-[#21DBA4] rounded-full flex items-center justify-center text-white shadow-lg scale-110">
                                          <Share size={20} />
                                       </div>
                                    </div>
                                 )}
                                 {idx === 1 && (
                                    <div className="flex items-center gap-4">
                                       <div className="w-16 h-20 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                                       <ArrowRight className="text-[#21DBA4]" />
                                       <div className="w-16 h-20 bg-[#21DBA4]/20 border-2 border-[#21DBA4] rounded-lg flex flex-col items-center justify-center gap-1">
                                          <Sparkles size={16} className="text-[#21DBA4]" />
                                          <div className="w-8 h-1 bg-[#21DBA4] rounded-full"></div>
                                       </div>
                                    </div>
                                 )}
                                 {idx === 2 && (
                                    <div className="w-full max-w-[200px] bg-white dark:bg-slate-700 p-4 rounded-xl shadow-lg">
                                       <div className="flex items-center gap-2 mb-3 border-b pb-2 dark:border-slate-600">
                                          <Search size={14} className="text-[#21DBA4]" />
                                          <div className="h-2 w-full bg-slate-100 dark:bg-slate-600 rounded"></div>
                                       </div>
                                       <div className="space-y-2">
                                          <div className="h-2 w-3/4 bg-slate-100 dark:bg-slate-600 rounded"></div>
                                          <div className="h-2 w-1/2 bg-slate-100 dark:bg-slate-600 rounded"></div>
                                       </div>
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </div>
            </div>

            {/* Integration List */}
            <div className="text-center py-12 border-t border-dashed border-slate-200 dark:border-slate-800">
               <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-8">{t.integrationTitle}</h3>
               <div className={`flex flex-wrap justify-center gap-4 md:gap-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {['Chrome', 'Safari', 'iOS', 'Android', 'Slack', 'Notion', 'Twitter/X'].map(platform => (
                     <span key={platform} className="text-lg font-bold flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-[#21DBA4]" /> {platform}
                     </span>
                  ))}
               </div>
            </div>

         </div>
      </div>
   );
};
