import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, MotionValue, AnimatePresence } from 'motion/react';
import { AlertCircle, FileX, Database, Share2, Sparkles } from 'lucide-react';

// Parallax Text Item Component
const ParallaxItem = ({ 
  topText, 
  highlightText, 
}: { 
  topText: string, 
  highlightText: string, 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Animation values based on scroll position
  // Adjusted: Element only scales UP, never scales down when scrolling past (stays at 1.4)
  const scale = useTransform(scrollYProgress, [0.3, 0.5, 0.8], [0.8, 1.4, 1.4]);
  // Opacity: Stays fully visible (1) longer, fades very slightly (0.8) at top
  const opacity = useTransform(scrollYProgress, [0.2, 0.5, 0.9], [0.2, 1, 0.8]);
  // Blur: Completely sharp at the top
  const blurVal = useTransform(scrollYProgress, [0.3, 0.5, 0.9], [10, 0, 0]);
  const blur = useTransform(blurVal, (v) => `blur(${v}px)`);
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <motion.div 
      ref={ref}
      style={{ scale, opacity, filter: blur, y }}
      className="py-[20vh] flex flex-col items-center justify-center text-center"
    >
       <p className="text-2xl md:text-3xl text-slate-400 font-bold mb-3 tracking-tight">
         {topText}
       </p>
       <h3 className="text-3xl md:text-5xl font-black text-[#21DBA4] leading-tight tracking-tighter drop-shadow-2xl">
         {highlightText}
       </h3>
    </motion.div>
  );
};

// Scroll Driven Character Component
const ScrollChar = ({ 
  children, 
  progress, 
  range, 
  type = "default" 
}: { 
  children: string, 
  progress: MotionValue<number>, 
  range: [number, number],
  type?: "default" | "scale" | "rotate"
}) => {
  const opacity = useTransform(progress, [range[0], range[1]], [0, 1]);
  
  // Custom transforms based on type
  const y = useTransform(progress, [range[0], range[1]], [50, 0]);
  const scale = useTransform(progress, [range[0], range[1]], type === "scale" ? [2, 1] : [1, 1]);
  const rotate = useTransform(progress, [range[0], range[1]], type === "rotate" ? [-20, 0] : [0, 0]);
  const blurVal = useTransform(progress, [range[0], range[1]], [10, 0]);
  const filter = useTransform(blurVal, (v) => `blur(${v}px)`);
  const x = useTransform(progress, [range[0], range[1]], type === "rotate" ? [-50, 0] : [0, 0]);

  return (
    <motion.span 
      style={{ opacity, y, scale, rotate, filter, x }}
      className="inline-block"
    >
      {children === " " ? "\u00A0" : children}
    </motion.span>
  );
};

// Visual Components for Slider
const VisualPreserve = () => (
  <div className="relative w-full max-w-[320px] aspect-[4/3] bg-[#1E293B] rounded-xl border border-slate-700 shadow-xl overflow-hidden flex flex-col">
     <div className="h-6 bg-slate-800 border-b border-slate-700 flex items-center px-2 gap-1.5">
        <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
        <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
     </div>
     {/* 404 Page Content */}
     <div className="flex-1 flex flex-col items-center justify-center p-6 opacity-50 grayscale transition-all duration-1000">
        <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mb-4">
           <FileX size={32} className="text-slate-500" />
        </div>
        <div className="w-3/4 h-3 bg-slate-700 rounded mb-2"></div>
        <div className="w-1/2 h-3 bg-slate-700 rounded text-xs text-center text-slate-500 flex items-center justify-center">404 Not Found</div>
     </div>

     {/* Overlay: Saved Content */}
     <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute inset-4 bg-[#0F172A] rounded-lg border border-[#21DBA4]/30 shadow-2xl flex flex-col overflow-hidden"
     >
        <div className="h-8 bg-[#21DBA4]/10 border-b border-[#21DBA4]/20 flex items-center px-3 justify-between">
           <div className="flex items-center gap-2">
              <Database size={12} className="text-[#21DBA4]" />
              <span className="text-[10px] font-bold text-[#21DBA4]">Saved locally</span>
           </div>
           <div className="w-1.5 h-1.5 rounded-full bg-[#21DBA4] animate-pulse"></div>
        </div>
        <div className="flex-1 p-4">
           <div className="w-10 h-10 rounded bg-slate-700/50 mb-3 animate-pulse"></div>
           <div className="w-full h-3 bg-slate-700/50 rounded mb-2"></div>
           <div className="w-5/6 h-3 bg-slate-700/50 rounded mb-2"></div>
           <div className="w-4/6 h-3 bg-slate-700/50 rounded"></div>
        </div>
     </motion.div>
  </div>
);

const VisualConnect = () => (
  <div className="relative w-full max-w-[320px] aspect-[4/3] flex items-center justify-center">
     {[0, 1, 2, 3].map((i) => (
        <motion.div
           key={i}
           className="absolute w-3 h-3 rounded-full bg-[#21DBA4] shadow-[0_0_15px_#21DBA4]"
           initial={{ x: 0, y: 0 }}
           animate={{ 
              x: [0, (i === 0 ? -60 : i === 1 ? 60 : i === 2 ? -40 : 40)], 
              y: [0, (i === 0 ? -40 : i === 1 ? -40 : i === 2 ? 50 : 50)] 
           }}
           transition={{ duration: 1, delay: 0.2 }}
        />
     ))}
     <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.path 
           d="M160 140 L100 100 M160 140 L220 100 M160 140 L120 190 M160 140 L200 190"
           fill="none"
           stroke="#21DBA4"
           strokeWidth="2"
           strokeOpacity="0.5"
           initial={{ pathLength: 0 }}
           animate={{ pathLength: 1 }}
           transition={{ duration: 1.5, delay: 0.8 }}
        />
     </svg>
     <motion.div 
        className="absolute z-10 bg-[#0F172A] border border-[#21DBA4] px-4 py-2 rounded-full text-xs font-bold text-white shadow-xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
     >
        Insight Found
     </motion.div>
  </div>
);

const VisualExpand = () => (
   <div className="relative w-full max-w-[320px] aspect-[4/3] flex items-center justify-center">
      <motion.div
         animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
         transition={{ duration: 2, repeat: Infinity }}
         className="absolute w-20 h-20 rounded-full border border-[#21DBA4] bg-[#21DBA4]/10"
      />
      <motion.div
         animate={{ scale: [1, 2], opacity: [0.3, 0] }}
         transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
         className="absolute w-20 h-20 rounded-full border border-[#21DBA4] bg-[#21DBA4]/5"
      />
      <div className="relative z-10 w-16 h-16 bg-gradient-to-tr from-[#21DBA4] to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-[#21DBA4]/30">
         <Sparkles size={32} className="text-white" />
      </div>
      
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
         <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-50"
            animate={{ 
               y: -80,
               x: (i % 2 === 0 ? 1 : -1) * 20 * (i + 1),
               opacity: 0
            }}
            transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
         />
      ))}
   </div>
);

// Core Value Slider Component
const CoreValuesSlider = ({ language }: { language: 'en' | 'ko' }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const slides = language === 'en' ? [
    {
      id: 0,
      tag: "Never Forget",
      title: "Preserve",
      engTitle: "",
      description: "Links disappear, but thoughts shouldn't. Permanently archive original content so your data stays safe even if platforms change.",
      visual: <VisualPreserve />
    },
    {
      id: 1,
      tag: "Understand Context",
      title: "Context",
      engTitle: "",
      description: "Fragments become knowledge. AI understands context and automatically connects scattered thoughts.",
      visual: <VisualConnect />
    },
    {
      id: 2,
      tag: "Become Knowledge",
      title: "Expand",
      engTitle: "",
      description: "Add AI insights to your thoughts. Go beyond collection to generate new ideas and inspiration.",
      visual: <VisualExpand />
    }
  ] : [
    {
      id: 0,
      tag: "생각을 잊지 않게",
      title: "보존",
      engTitle: "Preserve",
      description: "링크는 사라져도 생각은 사라지면 안 됩니다. 원본 콘텐츠를 영구 보존하여 플랫폼이 변해도 당신의 데이터는 안전하게 남습니다.",
      visual: <VisualPreserve />
    },
    {
      id: 1,
      tag: "맥락을 이해하도록",
      title: "연결",
      engTitle: "Context",
      description: "단편적인 정보들이 모여 거대한 지식이 됩니다. AI가 문맥을 파악하여 흩어진 생각들을 자동으로 연결해줍니다.",
      visual: <VisualConnect />
    },
    {
      id: 2,
      tag: "지식이 되도록",
      title: "확장",
      engTitle: "Expand",
      description: "당신의 생각에 AI의 통찰력을 더하세요. 단순한 수집을 넘어 새로운 아이디어와 영감으로 발전시킵니다.",
      visual: <VisualExpand />
    }
  ];

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="w-full max-w-5xl mx-auto mt-20 px-4 md:px-0 perspective-1000">
      {/* Browser Window Frame */}
      <div className="relative rounded-2xl md:rounded-3xl border border-slate-700 bg-[#0F172A] shadow-2xl overflow-hidden min-h-[500px] md:min-h-[560px] flex flex-col">
        {/* Browser Header */}
        <div className="h-10 md:h-12 border-b border-slate-700/50 bg-[#1E293B] flex items-center px-4 justify-between shrink-0">
           <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-600"></div>
              <div className="w-3 h-3 rounded-full bg-slate-600"></div>
              <div className="w-3 h-3 rounded-full bg-slate-600"></div>
           </div>
           <div className="px-3 py-1 rounded-full bg-slate-900/50 border border-slate-700 text-[10px] md:text-xs text-slate-500 font-mono flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#21DBA4]"></div>
              linkbrain.ai/core-values
           </div>
           <div className="w-16"></div> {/* Spacer for balance */}
        </div>

        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col md:flex-row relative z-10">
          
          {/* Left: Text Content */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 md:space-y-8"
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-[#21DBA4] text-xs md:text-sm font-bold">
                  {slides[activeSlide].tag}
                </span>
                
                <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  {slides[activeSlide].title} <span className="text-2xl md:text-3xl font-medium text-slate-500 ml-2">{slides[activeSlide].engTitle}</span>
                </h3>

                <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-md break-keep">
                  {slides[activeSlide].description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Indicators */}
            <div className="flex gap-3 mt-12 md:mt-20">
               {slides.map((_, idx) => (
                 <button 
                   key={idx}
                   onClick={() => setActiveSlide(idx)}
                   className={`h-1.5 rounded-full transition-all duration-300 ${activeSlide === idx ? 'w-12 bg-[#21DBA4]' : 'w-2 bg-slate-700 hover:bg-slate-600'}`}
                 />
               ))}
            </div>
          </div>

          {/* Right: Visual Area */}
          <div className="flex-1 bg-slate-900/30 border-t md:border-t-0 md:border-l border-slate-700/50 relative overflow-hidden flex items-center justify-center p-8 md:p-12">
             <AnimatePresence mode="wait">
                <motion.div
                   key={activeSlide}
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 1.1 }}
                   transition={{ duration: 0.5 }}
                   className="w-full h-full flex items-center justify-center"
                >
                   {slides[activeSlide].visual}
                </motion.div>
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StorytellingSection = ({ language = 'ko' }: { language?: 'en' | 'ko' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTextRef = useRef<HTMLDivElement>(null);

  const t = {
    en: {
        scene1: [
            { top: "3 months ago,", highlight: "That YouTube video." },
            { top: '"Must watch later"', highlight: "Instagram post." },
            { top: "Saved on Twitter,", highlight: "That insightful thread." }
        ],
        scene2: {
            line1: "Need it now,",
            line2: "Where did I save it?",
            line3: "Do you remember?"
        },
        scene3: {
            line1: "Our brains are",
            line2: "Not designed to",
            line3: "Remember everything."
        },
        scene4: {
            mobile: {
                desc: <>Among dozens of links<br/>that moved you,</>,
                title: <>That is<br/>your 'Thought'.</>
            },
            desktop: {
                desc: "Among dozens of links you meet daily, the ones that moved you,",
                title: "That is exactly your 'Thought'."
            }
        }
    },
    ko: {
        scene1: [
            { top: "3개월 전,", highlight: "유튜브에서 본 그 영상." },
            { top: `"나중에 꼭 봐야지" 했던`, highlight: "인스타 게시물." },
            { top: "트위터에 저장했던", highlight: "그 통찰력 있는 스레드." }
        ],
        scene2: {
            line1: "지금 필요한데,",
            line2: "어디에 저장했는지",
            line3: "기억나시나요?"
        },
        scene3: {
            line1: "우리의 뇌는",
            line2: "모든 것을 기억하도록",
            line3: "설계되지 않았습니다."
        },
        scene4: {
            mobile: {
                desc: <>매일 만나는 수십 개의 링크 중<br/>마음을 움직인 것들,</>,
                title: <>그것이 바로<br/>당신의 '생각'입니다.</>
            },
            desktop: {
                desc: "매일 만나는 수십 개의 링크 중 마음을 움직인 것들,",
                title: "그것이 바로 당신의 '생각'입니다."
            }
        }
    }
  }[language];

  // Fade up animation for Scene 2
  const fadeInUp = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: "easeOut" } }
  };

  // Scroll progress for the text section
  const { scrollYProgress: textProgress } = useScroll({
    target: scrollTextRef,
    offset: ["start 0.9", "center 0.5"] // Trigger earlier
  });

  return (
    <section ref={containerRef} className="relative py-20 px-6 max-w-5xl mx-auto overflow-visible">
      
      {/* Background Ambient Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg bg-gradient-to-b from-transparent via-slate-800/20 to-transparent blur-[100px] -z-10 pointer-events-none"></div>

      {/* Scene 1: Parallax Scrolling Text */}
      <div className="flex flex-col w-full mb-[128px] relative z-10 mt-[0px] mr-[0px] ml-[0px] p-[0px]">
         {t.scene1.map((item, idx) => (
             <ParallaxItem 
                key={idx}
                topText={item.top}
                highlightText={item.highlight}
             />
         ))}
      </div>

      <div className="flex flex-col gap-32 md:gap-48 w-full max-w-4xl mx-auto">
        
        {/* Scene 2: The Void (Problem Climax) */}
        <div className="text-center relative py-12 md:py-32">
          {/* Ambient Background */}
          <motion.div 
             animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[#21DBA4]/5 blur-[100px] rounded-full -z-10 pointer-events-none"
          />

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            className="flex flex-col items-center justify-center"
          >
            {/* Line 1: Urgent */}
            <motion.h3 
              variants={{
                hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)" }
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-4"
            >
              {t.scene2.line1}
            </motion.h3>

            {/* Line 2: The Void / Forgotten - Thin & Fading */}
            <motion.p
              variants={{
                hidden: { opacity: 0, filter: "blur(10px)" },
                visible: { opacity: 1, filter: "blur(2px)" } // Stays slightly blurred to represent memory loss
              }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              className="text-3xl md:text-6xl font-thin text-slate-700 tracking-tighter mb-6 select-none"
            >
              {t.scene2.line2}
            </motion.p>
             
            {/* Line 3: The Question - Bold & Point Color */}
            <motion.h3 
              variants={{
                hidden: { opacity: 0, scale: 0.95, filter: "blur(10px)" },
                visible: { opacity: 1, scale: 1, filter: "blur(0px)" }
              }}
              transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
              className="text-4xl md:text-7xl font-black text-[#21DBA4] tracking-tighter drop-shadow-[0_0_40px_rgba(33,219,164,0.4)]"
            >
              {t.scene2.line3}
            </motion.h3>
          </motion.div>
        </div>

        {/* Scene 3: The Solution (Scroll Driven) */}
        <div ref={scrollTextRef} className="text-center relative pb-32 md:pb-48 min-h-[50vh] flex flex-col justify-center">
          {/* Beam Connector */}
          <motion.div 
            style={{ opacity: textProgress, scaleY: textProgress }}
            className="absolute left-1/2 -top-24 -translate-x-1/2 w-[1px] h-[120px] bg-gradient-to-b from-transparent via-[#21DBA4] to-[#21DBA4] shadow-[0_0_15px_#21DBA4] origin-top"
          ></motion.div>
          
          <div className="relative z-10 pt-20">
             {/* Line 1 */}
             <div className="text-xl md:text-3xl font-bold text-slate-500 mb-3 tracking-tight">
                {Array.from(t.scene3.line1).map((char, i) => (
                   <ScrollChar 
                      key={i} 
                      progress={textProgress}
                      range={[0, 0.15]} // Starts early
                   >{char}</ScrollChar>
                ))}
             </div>

             {/* Line 2 */}
             <div className="text-3xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter mb-4">
                {Array.from(t.scene3.line2).map((char, i) => (
                   <ScrollChar 
                      key={i}
                      progress={textProgress}
                      range={[0.15 + (i * 0.03), 0.45 + (i * 0.03)]} // Staggered scale effect
                      type="scale"
                   >{char}</ScrollChar>
                ))}
             </div>

             {/* Line 3 */}
             <div className="text-2xl md:text-5xl font-black text-[#21DBA4] leading-tight tracking-tighter">
                {Array.from(t.scene3.line3).map((char, i) => (
                   <ScrollChar 
                      key={i}
                      progress={textProgress}
                      range={[0.4 + (i * 0.03), 0.7 + (i * 0.03)]} // Staggered rotate effect
                      type="rotate"
                   >{char}</ScrollChar>
                ))}
             </div>
          </div>
        </div>

        {/* Scene 4: The Realization & Core Values Slider */}
        <div className="relative py-12 md:py-24 text-center px-4">
           {/* Mobile View (md:hidden) */}
           <motion.div
             initial={{ opacity: 0, y: 40 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-20%" }}
             transition={{ duration: 0.8 }}
             className="mb-12 md:hidden"
           >
             <p className="text-lg text-slate-400 font-medium mb-4 tracking-tight">
               {t.scene4.mobile.desc}
             </p>
             <h3 className="text-[32px] font-black text-[#21DBA4] leading-[1.2] tracking-tighter break-keep drop-shadow-2xl">
               {t.scene4.mobile.title}
             </h3>
           </motion.div>

           {/* Desktop View (hidden md:block) */}
           <motion.div
             initial={{ opacity: 0, y: 40 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-20%" }}
             transition={{ duration: 0.8 }}
             className="mb-12 hidden md:block"
           >
             <p className="text-2xl text-slate-400 font-medium mb-6 tracking-tight">
               {t.scene4.desktop.desc}
             </p>
             <h3 className="lg:text-6xl font-black text-[#21DBA4] leading-[1.2] tracking-tighter break-keep drop-shadow-2xl text-[48px]">
               {t.scene4.desktop.title}
             </h3>
           </motion.div>
           
           {/* Interactive Slider */}
           <CoreValuesSlider language={language} />
        </div>

      </div>
    </section>
  );
};