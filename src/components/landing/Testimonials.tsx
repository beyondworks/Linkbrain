import React from 'react';
import { motion } from 'motion/react';
import { PenTool, BarChart3, GraduationCap, Quote } from 'lucide-react';
import { ScatteredLinkAnimation } from './ScatteredLinkAnimation';

const TRANSLATIONS = {
  en: {
    sectionTitle: "Real Stories",
    mainTitle: (
      <>
        Experience Changed by<br/>
        <span className="text-slate-500">Linkbrain</span>
      </>
    ),
    testimonials: [
        {
          role: "Brand Designer",
          name: "Kim OO",
          quote: "AI organizes everything just by saving.",
          desc: "Every time I save a new reference, tags are automatically added and categorized, so I can focus on brainstorming ideas instead of organizing.",
          icon: <PenTool size={20} className="text-purple-400" />
        },
        {
          role: "Content Marketer",
          name: "Lee OO",
          quote: "Saved links become the backbone of planning.",
          desc: "It analyzes the links I save every day and shows me what topics I'm interested in as a report, making content planning so much easier.",
          icon: <BarChart3 size={20} className="text-blue-400" />
        },
        {
          role: "Graduate Student",
          name: "Park OO",
          quote: "Knowledge expands with every new paper.",
          desc: "When I save a resource I just found, it automatically connects with related studies I saved before, turning fragmented information into a vast knowledge map.",
          icon: <GraduationCap size={20} className="text-emerald-400" />
        }
    ]
  },
  ko: {
    sectionTitle: "Real Stories",
    mainTitle: (
      <>
        Linkbrain이 바꾼<br/>
        <span className="text-slate-500">지식의 경험들</span>
      </>
    ),
    testimonials: [
        {
          role: "Brand Designer",
          name: "Kim OO",
          quote: "저장만 하면 AI가 알아서 정리해요.",
          desc: "새로운 레퍼런스를 저장할 때마다 자동으로 태그가 달리고 분류되니, 더 이상 정리에 시간을 쏟지 않고 아이디어 구상에만 집중해요.",
          icon: <PenTool size={20} className="text-purple-400" />
        },
        {
          role: "Content Marketer",
          name: "Lee OO",
          quote: "이번 주 수집한 링크들이 기획의 뼈대가 됩니다.",
          desc: "매일 저장하는 링크들을 분석해서 제가 어떤 주제에 관심을 갖고 있는지 리포트로 보여주니, 콘텐츠 기획 방향 잡기가 정말 쉬워졌어요.",
          icon: <BarChart3 size={20} className="text-blue-400" />
        },
        {
          role: "Graduate Student",
          name: "Park OO",
          quote: "새로운 논문을 저장할 때마다 지식이 확장돼요.",
          desc: "방금 찾은 자료를 저장하면 이전에 저장해둔 관련 연구들과 자동으로 연결해줘서, 단편적인 정보들이 거대한 지식 지도로 완성됩니다.",
          icon: <GraduationCap size={20} className="text-emerald-400" />
        }
    ]
  }
};

export const Testimonials = ({ language = 'ko' }: { language?: 'en' | 'ko' }) => {
  const t = TRANSLATIONS[language];

  return (
    <section className="py-24 md:py-32 bg-transparent relative overflow-hidden">
      
      {/* Background: Subtle Chaos (Continuity from ProblemSolution) */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen">
         <ScatteredLinkAnimation />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <span className="text-[#21DBA4] font-bold text-xs uppercase tracking-[0.2em] mb-4 block">{t.sectionTitle}</span>
          <h2 className="text-3xl md:text-5xl font-black text-white font-[Pretendard] font-normal font-bold tracking-wide">
            {t.mainTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {t.testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="bg-[#1E293B] rounded-2xl p-8 border border-slate-700/50 hover:border-[#21DBA4]/30 transition-colors relative group"
            >
              <div className="absolute top-6 right-6 text-slate-700 group-hover:text-slate-600 transition-colors">
                <Quote size={40} fill="currentColor" className="opacity-20" />
              </div>
              
              <div className={`w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-6 border border-slate-700`}>
                {item.icon}
              </div>
              
              <h3 className="font-bold text-white mb-2 leading-snug text-[18px] pt-[0px] pr-[36px] pb-[0px] pl-[0px]">"{item.quote}"</h3>
              
              <p className="text-slate-400 text-sm leading-relaxed mb-6 min-h-[80px]">
                {item.desc}
              </p>
              
              <div className="flex items-center gap-3 border-t border-slate-800 pt-4 mt-auto">
                 <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xs font-bold text-slate-400`}>
                    {item.name[0]}
                 </div>
                 <div>
                    <div className="text-sm font-bold text-white">{item.name}</div>
                    <div className="text-xs text-slate-500">{item.role}</div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
