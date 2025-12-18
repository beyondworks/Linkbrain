import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Search, FileWarning, Sparkles, Network } from "lucide-react";
import { ScatteredLinkAnimation } from "./ScatteredLinkAnimation";

export const ProblemSolution = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax effects
  const textY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [50, 0, -50],
  );
  const cardY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [100, 0, -100],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0],
  );

  return (
    <section
      ref={containerRef}
      className="relative py-32 md:py-48 overflow-hidden"
    >
      {/* Background Gradient Transition */}
      {/* Starts transparent (showing previous section) and fades into dark blue */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B1120] to-transparent -z-20"></div>

      {/* Background: Subtle Chaos */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen -z-10">
        <ScatteredLinkAnimation />
      </div>

      {/* Main Content */}
      <motion.div
        style={{ opacity }}
        className="max-w-5xl mx-auto px-6 relative z-10"
      >
        {/* 1. The Problem Statement */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center mb-64 md:items-center">
          <motion.div
            style={{ y: textY }}
            className="flex-1 text-center md:text-left"
          >
            <h2 className="md:text-5xl font-black text-white mb-[0px] leading-tight tracking-tighter mt-[20px] mr-[0px] ml-[30px] text-[48px] font-normal font-bold pt-[0px] pr-[0px] pb-[0px] pl-[50px]">
              "저장"은
              <br />
              <span className="text-slate-500">
                누구나 하지만,
              </span>
              <span className="block h-6 md:h-8"></span>
              "찾기"는
              <br />
              <span className="text-[#21DBA4]">
                아무나 못 합니다.
              </span>
            </h2>
          </motion.div>

          {/* The Stat Card */}
          <motion.div
            style={{ y: cardY }}
            className="relative flex-1 w-full max-w-xs md:max-w-sm"
          >
            <div className="absolute inset-0 bg-[#21DBA4]/10 blur-[80px] rounded-full"></div>
            <div className="relative bg-[#1E293B]/60 backdrop-blur-xl border border-slate-700 md:p-10 rounded-[2rem] text-center overflow-hidden group hover:border-[#21DBA4]/30 transition-colors duration-500 p-[40px] mt-[0px] mr-[30px] mb-[0px] ml-[0px]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#21DBA4]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="text-7xl md:text-8xl font-black text-white mb-2 tracking-tighter flex items-start justify-center">
                82
                <span className="text-[#21DBA4] text-4xl md:text-5xl mt-2">
                  %
                </span>
              </div>
              <div className="w-full h-px bg-slate-700 my-6"></div>
              <p className="text-slate-400 font-medium text-sm md:text-base tracking-tight">
                다시 열어보지 않는
                <br />
                <span className="text-[#21DBA4] font-bold">
                  죽은 링크(Dead Links)
                </span>
                의 비율
              </p>
            </div>
          </motion.div>
        </div>

        {/* 2. The Solution Bridge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto mb-32"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch mt-24 md:mt-32"
          >
              {/* Card: Hoarding */}
              <div className="bg-[#0F172A] border border-slate-800 rounded-3xl flex flex-col justify-between opacity-80 hover:opacity-100 transition-all duration-500 p-8 group/card">
                 <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-slate-500 font-bold text-xs uppercase tracking-wider">Past Problem</div>
                        <FileWarning className="text-slate-600" size={20} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-200 mb-3">단순 수집의 함정</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                       "나중에 봐야지"하고 저장한 링크들.<br/>
                       분류되지 않은 정보는 결국 <span className="text-slate-300 font-medium">디지털 쓰레기</span>가 되어 잊혀집니다.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900/50 p-2 rounded border border-slate-800 w-fit">
                        <span>Avg. Return Rate:</span>
                        <span className="text-red-400">&lt; 3.2%</span>
                    </div>
                 </div>
                 
                 {/* Hoarding Animation */}
                 <div className="relative h-40 bg-[#020617] rounded-2xl border border-slate-800 overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                    {/* Falling Files */}
                    {[...Array(6)].map((_, i) => (
                       <motion.div
                          key={i}
                          initial={{ y: -40, opacity: 0, rotate: 0 }}
                          animate={{ 
                              y: [20, 100 + Math.random() * 40], 
                              opacity: [0, 1, 0.4],
                              rotate: [Math.random() * -20, Math.random() * 20] 
                          }}
                          transition={{ 
                              duration: 3 + Math.random(), 
                              repeat: Infinity, 
                              delay: i * 0.8,
                              ease: "easeInOut"
                          }}
                          className="absolute left-0 right-0 mx-auto w-fit"
                          style={{ left: `${(i - 2.5) * 30}px` }}
                       >
                          <div className="w-12 h-16 bg-slate-800 border border-slate-700 rounded flex flex-col items-center justify-center shadow-lg">
                              <div className="w-8 h-1 bg-slate-600 mb-1 rounded-full opacity-50"></div>
                              <div className="w-6 h-1 bg-slate-600 rounded-full opacity-30"></div>
                          </div>
                       </motion.div>
                    ))}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#020617] to-transparent z-10 flex items-end justify-center pb-4">
                        <span className="text-xs text-slate-600 font-medium">Stacked & Forgotten</span>
                    </div>
                 </div>
              </div>

              {/* Card: Connecting */}
              <div className="bg-[#1E293B] border border-[#21DBA4]/30 p-8 rounded-3xl flex flex-col justify-between shadow-[0_0_50px_rgba(33,219,164,0.05)] relative overflow-hidden group/brain">
                 <div className="absolute inset-0 bg-[#21DBA4]/5 group-hover:bg-[#21DBA4]/10 transition-colors duration-500"></div>
                 
                 <div className="relative z-10 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-[#21DBA4] font-bold text-xs uppercase tracking-wider">Linkbrain Solution</div>
                        <Sparkles className="text-[#21DBA4]" size={20} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">지능적 연결과 확장</h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                       문맥을 이해하는 AI가 흩어진 정보들을 연결하여<br/>
                       <span className="text-[#21DBA4] font-bold">새로운 인사이트</span>로 확장시킵니다.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[#21DBA4]/80 bg-[#21DBA4]/10 p-2 rounded border border-[#21DBA4]/20 w-fit">
                        <Network size={12} />
                        <span>Insight Rate:</span>
                        <span className="font-bold">+ 300%</span>
                    </div>
                 </div>

                 {/* Connecting Animation */}
                 <div className="relative h-40 bg-[#0F172A] rounded-2xl border border-[#21DBA4]/20 overflow-hidden group-hover/brain:border-[#21DBA4]/40 transition-colors">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#21DBA4 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    
                    {/* Central Hub */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                       <motion.div 
                          animate={{ boxShadow: ['0 0 0px rgba(33,219,164,0)', '0 0 20px rgba(33,219,164,0.3)', '0 0 0px rgba(33,219,164,0)'] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-10 h-10 bg-[#21DBA4] rounded-full flex items-center justify-center shadow-lg text-slate-900"
                       >
                          <Search size={20} strokeWidth={3} />
                       </motion.div>
                    </div>

                    {/* Orbiting Nodes */}
                    {[...Array(4)].map((_, i) => (
                       <motion.div
                          key={i}
                          className="absolute top-1/2 left-1/2"
                          initial={{ rotate: i * 90 }}
                          animate={{ rotate: i * 90 + 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                       >
                          <motion.div
                             className="absolute"
                             style={{ top: -40, left: -6 }}
                             initial={{ scale: 0 }}
                             animate={{ scale: [0, 1, 1, 0] }}
                             transition={{ duration: 4, repeat: Infinity, delay: i * 1, times: [0, 0.2, 0.8, 1] }}
                          >
                             <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                             <motion.div 
                                className="absolute top-1.5 left-1.5 w-1 bg-[#21DBA4]/50 origin-top"
                                style={{ height: 40, transform: 'rotate(180deg)' }}
                             />
                          </motion.div>
                       </motion.div>
                    ))}

                    {/* Floating Tags */}
                    <motion.div 
                        animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute top-4 right-4 px-2 py-1 bg-[#21DBA4]/10 rounded border border-[#21DBA4]/20 text-[10px] text-[#21DBA4]"
                    >
                        #Design
                    </motion.div>
                    <motion.div 
                        animate={{ y: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                        className="absolute bottom-4 left-4 px-2 py-1 bg-[#21DBA4]/10 rounded border border-[#21DBA4]/20 text-[10px] text-[#21DBA4]"
                    >
                        #Marketing
                    </motion.div>
                 </div>
              </div>
          </motion.div>
        </motion.div>

        {/* 3. Final Statement */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-slate-500 max-w-2xl mx-auto text-[22px]">
            이제 '어디에 뒀더라?' 고민하지 마세요.
            <br />
            필요한 순간, Linkbrain이 당신의 생각 앞에
            대령합니다.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};