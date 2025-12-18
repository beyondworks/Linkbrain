import React, { useState, useEffect } from 'react';
import { 
  Archive, 
  Network, 
  History,
  FolderOpen, 
  FileText, 
  Database, 
  Layout,
  Zap,
  Shield,
  AlertCircle,
  RefreshCw,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../Logo';

const features = [
  {
    id: 0,
    title: "보존 Preserve",
    subtitle: "생각을 잊지 않게",
    desc: "링크는 사라져도 생각은 사라지면 안 됩니다. 원본 콘텐츠를 영구 보존하여 플랫폼이 변해도 당신의 데이터는 안전하게 남습니다.",
    icon: <Archive size={20} />,
    sceneComponent: "StorageScene"
  },
  {
    id: 1,
    title: "연결 Connect",
    subtitle: "생각은 혼자 있지 않습니다",
    desc: "AI가 당신의 생각들 사이의 보이지 않는 연결고리를 찾아냅니다. 자동 카테고리 분류와 연관 콘텐츠 추천으로 새로운 인사이트를 발견하세요.",
    icon: <Network size={20} />,
    sceneComponent: "ClassificationScene"
  },
  {
    id: 2,
    title: "재발견 Rediscover",
    subtitle: "과거의 나와 대화하기",
    desc: "6개월 전의 당신이 지금의 당신에게 보내는 메시지. 잊고 있던 관심사를 다시 수면 위로 끌어올려 새로운 영감을 줍니다.",
    icon: <History size={20} />,
    sceneComponent: "SummaryScene"
  }
];

export const CoreValues = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 6000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full max-w-5xl mx-auto md:px-0 py-20">
      <div className="mb-16 text-center px-6">
        <h2 className="md:text-4xl font-black text-white mb-6 leading-tight font-[Pretendard] font-normal text-[26px]">
          매일 만나는 수십 개의 링크 중<br/>
          <span className="text-slate-400 text-[26px]">마음을 움직인 것들,</span><br/>
          <span className="block h-6 md:h-8"></span>
          <span className="text-[#21DBA4] text-[36px] font-bold px-[0px] py-[20px]">그것이 바로 당신의 '생각'입니다.</span>
        </h2>
      </div>

      <div className="relative bg-[#1E293B] rounded-2xl md:rounded-[2rem] border border-slate-700 shadow-2xl overflow-hidden backdrop-blur-sm mx-4 md:mx-0">
        
        {/* Browser Header */}
        <div className="h-10 md:h-12 border-b border-slate-700 flex items-center justify-between px-3 md:px-5 bg-[#0F172A]/50 backdrop-blur sticky top-0 z-20">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-slate-600"></div>
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-slate-600"></div>
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-slate-600"></div>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-medium text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 md:px-3 md:py-1 rounded-full">
            <Logo className="w-2 h-2 md:w-3 md:h-3 rounded-[2px]" />
            linkbrain.ai/core-values
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col md:flex-row min-h-[500px] md:min-h-[450px] h-auto">
          
          {/* Left: Navigation & Info */}
          <div className="w-full md:w-2/5 p-6 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-700 bg-[#1E293B] relative z-10 order-2 md:order-1 flex-1">
             <div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                  >
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#21DBA4]/10 text-[#21DBA4] text-[10px] md:text-xs font-bold uppercase tracking-wider mb-4 md:mb-6 border border-[#21DBA4]/20">
                        {features[currentSlide].subtitle}
                     </div>
                     <h3 className="text-2xl md:text-3xl font-black text-white mb-4 md:mb-6 leading-tight">
                        {features[currentSlide].title.split(' ')[0]} <span className="text-slate-500 text-lg md:text-xl font-medium">{features[currentSlide].title.split(' ')[1]}</span>
                     </h3>
                     <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                        {features[currentSlide].desc}
                     </p>
                  </motion.div>
                </AnimatePresence>
             </div>

             {/* Slide Indicators */}
             <div className="flex gap-3 mt-6 md:mt-0">
               {features.map((feature, idx) => (
                 <button 
                    key={feature.id}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-12 bg-[#21DBA4]' : 'w-2 bg-slate-700 hover:bg-slate-600'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                 />
               ))}
             </div>
          </div>

          {/* Right: Visualization */}
          <div className="w-full md:w-3/5 bg-[#0F172A]/50 relative overflow-hidden flex items-center justify-center p-4 md:p-8 order-1 md:order-2 h-[300px] md:h-auto border-b border-slate-700 md:border-b-0">
             <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>
             
             {/* Scale container for mobile responsiveness */}
             <div className="relative w-full h-full max-w-sm mx-auto flex items-center justify-center transform scale-[0.65] xs:scale-75 sm:scale-90 md:scale-100 origin-center">
                <AnimatePresence mode="wait">
                  {features[currentSlide].sceneComponent === 'ClassificationScene' && <ClassificationScene key="scene1" />}
                  {features[currentSlide].sceneComponent === 'SummaryScene' && <SummaryScene key="scene2" />}
                  {features[currentSlide].sceneComponent === 'StorageScene' && <StorageScene key="scene0" />}
                </AnimatePresence>
             </div>
          </div>

        </div>
      </div>

      <div className="mt-16 text-center px-6">
        <p className="text-slate-500 max-w-2xl mx-auto text-[22px]">
          Linkbrain은 그 생각들을 잃어버리지 않도록 영구적으로 보존하고,<br className="hidden md:block"/>
          필요한 순간에 다시 떠올리게 합니다.
        </p>
      </div>
    </section>
  );
};

// ----------------------------------------------------------------------
// Scenes (Reused from previous FeatureSlider but can be tweaked)
// ----------------------------------------------------------------------

const ClassificationScene = () => {
  const DURATION = 4;
  
  return (
     <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="relative w-80 h-72 flex items-center justify-center"
     >
        <div className="relative w-64 h-48">
          {/* Folder: Dev (Wrong) */}
          <motion.div 
            animate={{ 
               x: [0, 0, -2, 2, -2, 2, 0, 0, 0], 
               borderColor: ['#334155', '#334155', '#EF4444', '#EF4444', '#EF4444', '#EF4444', '#334155', '#334155', '#334155']
            }}
            transition={{ duration: DURATION, times: [0, 0.3, 0.32, 0.34, 0.36, 0.38, 0.4, 0.9, 1], repeat: Infinity }}
            className="absolute bottom-0 left-0 w-24 h-20 bg-blue-900/10 border-2 rounded-xl flex items-center justify-center z-10 border-slate-700"
          >
             <span className="text-[10px] font-bold mt-8 text-blue-300">Dev</span>
             <div className="absolute top-[-10px] left-0 w-10 h-4 bg-blue-500/20 rounded-t-lg"></div>
          </motion.div>

          {/* Folder: Design (Right) */}
          <motion.div 
            animate={{ 
               scale: [1, 1, 1, 1.1, 1, 1], 
               borderColor: ['#334155', '#334155', '#334155', '#21DBA4', '#334155', '#334155'], 
               backgroundColor: ['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(33, 219, 164, 0.1)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)']
            }}
            transition={{ duration: DURATION, times: [0, 0.6, 0.7, 0.8, 0.9, 1], repeat: Infinity }}
            className="absolute bottom-0 right-0 w-24 h-20 bg-teal-900/10 border-2 rounded-xl flex items-center justify-center z-10 border-slate-700"
          >
             <span className="text-[10px] font-bold text-[#21DBA4] mt-8">Design</span>
             <div className="absolute top-[-10px] right-0 w-10 h-4 bg-[#21DBA4]/20 rounded-t-lg"></div>
          </motion.div>
          
          {/* Moving Item */}
          <motion.div
              animate={{ 
                 top: [0, 0, 10, 80, 80, 10, 80, 80, 80],
                 left: ['50%', '50%', '50%', '10%', '10%', '50%', 'auto', 'auto', 'auto'],
                 right: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', '4%', '4%', '4%'],
                 x: ['-50%', '-50%', '-50%', '0%', '0%', '-50%', '0%', '0%', '0%'],
                 scale: [0.8, 0.8, 1, 1, 0, 1, 1, 0, 0],
                 opacity: [0, 0, 1, 1, 0, 1, 1, 0, 0]
              }}
              transition={{ 
                  duration: DURATION, 
                  times: [0, 0.05, 0.1, 0.3, 0.4, 0.5, 0.7, 0.8, 1], 
                  repeat: Infinity 
              }}
              className="absolute w-28 h-10 bg-[#1E293B] rounded-lg shadow-xl border border-slate-600 flex items-center gap-2 px-3 z-50"
          >
              <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-slate-400">
                  <Layout size={12} />
              </div>
              <div className="flex-1">
                  <div className="h-1.5 w-14 bg-slate-700 rounded-full mb-1"></div>
                  <div className="h-1 w-8 bg-slate-800 rounded-full"></div>
              </div>
          </motion.div>
        </div>
     </motion.div>
  )
}

const SummaryScene = () => {
  const DURATION = 4;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="relative w-80 h-72 flex items-center justify-center"
    >
      {/* 1. Long Document View */}
      <motion.div 
         animate={{ 
            opacity: [1, 1, 1, 0, 0, 1, 1], 
            scale: [1, 1, 1, 0.9, 0.9, 1, 1],
            y: [0, 0, 0, -20, -20, 0, 0]
         }}
         transition={{ duration: DURATION, times: [0, 0.6, 0.7, 0.8, 0.9, 0.95, 1], repeat: Infinity }}
         className="absolute w-56 h-64 bg-[#1E293B] rounded-xl border border-slate-700 p-5 shadow-xl overflow-hidden"
      >
         <div className="h-3 w-1/3 bg-slate-600 rounded-full mb-4"></div>
         <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="relative">
                    <div className="h-2 w-full bg-slate-800 rounded-full"></div>
                    {/* Highlights */}
                    {(i === 2 || i === 4 || i === 6) && (
                        <motion.div 
                            animate={{ width: ['0%', '0%', '100%', '100%'] }}
                            transition={{ 
                                duration: DURATION, 
                                times: [0, 0.1 + (i*0.05), 0.3 + (i*0.05), 1], 
                                repeat: Infinity 
                            }}
                            className="absolute top-0 left-0 h-full bg-[#3B82F6]/30 rounded-full"
                        />
                    )}
                </div>
            ))}
         </div>
      </motion.div>

      {/* 2. Extracted Summary Cards -> Rediscover Cards */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        {[1, 2, 3].map((i) => {
           const startT = 0.7 + (i * 0.04); 
           const midT = startT + 0.05;
           const endT = midT + 0.08;
           
           return (
            <motion.div
                key={i}
                animate={{ 
                    opacity: [0, 0, 0, 1, 1, 0, 0], 
                    x: [-20, -20, -20, 0, 0, -20, -20],
                    scale: [0.8, 0.8, 0.8, 1, 1, 0.8, 0.8]
                }}
                transition={{ 
                    duration: DURATION, 
                    times: [0, startT, startT + 0.01, midT, endT, 0.99, 1],
                    repeat: Infinity 
                }}
                className="w-60 bg-[#0F172A] border border-blue-500/30 rounded-lg p-3 flex items-start gap-3 shadow-lg z-10"
            >
                <div className="mt-0.5 w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Search size={10} fill="currentColor" />
                </div>
                <div className="flex-1">
                    <div className="h-1.5 w-full bg-slate-700 rounded-full mb-1.5"></div>
                    <div className="h-1.5 w-3/4 bg-slate-700 rounded-full"></div>
                </div>
            </motion.div>
           )
        })}
      </div>
    </motion.div>
  )
}

const StorageScene = () => {
  const DURATION = 4;

  return (
    <motion.div 
       initial={{ opacity: 0 }} 
       animate={{ opacity: 1 }} 
       exit={{ opacity: 0 }}
       className="relative w-80 h-72 flex items-center justify-center"
    >
       {/* Browser Window */}
       <div className="w-64 h-56 bg-[#1E293B] rounded-xl border border-slate-700 overflow-hidden flex flex-col shadow-xl relative">
          
          {/* Header */}
          <motion.div 
             animate={{ backgroundColor: ['#1e293b', '#1e293b', '#450a0a', '#1e293b', '#1e293b'] }} 
             transition={{ duration: DURATION, times: [0, 0.2, 0.3, 0.7, 1], repeat: Infinity }}
             className="h-8 border-b border-slate-700 flex items-center px-3"
          >
             <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                <div className="w-2 h-2 rounded-full bg-slate-600"></div>
             </div>
             <motion.div 
                animate={{ 
                   backgroundColor: ['#0f172a', '#0f172a', '#fee2e2', '#0f172a', '#0f172a'],
                   color: ['#64748b', '#64748b', '#ef4444', '#64748b', '#64748b'] 
                }}
                transition={{ duration: DURATION, times: [0, 0.2, 0.3, 0.7, 1], repeat: Infinity }}
                className="ml-3 h-4 flex-1 rounded text-[8px] flex items-center px-2"
             >
                404 - Page Not Found
             </motion.div>
          </motion.div>

          {/* Content Body */}
          <div className="flex-1 p-4 relative">
             {/* Normal Content */}
             <motion.div 
                animate={{ 
                   opacity: [1, 1, 0.1, 1, 1], 
                   filter: ['grayscale(0%)', 'grayscale(0%)', 'grayscale(100%)', 'grayscale(0%)', 'grayscale(0%)'] 
                }}
                transition={{ duration: DURATION, times: [0, 0.2, 0.3, 0.7, 1], repeat: Infinity }}
                className="space-y-3"
             >
                <div className="h-24 w-full bg-slate-800 rounded-lg border border-slate-700"></div>
                <div className="h-2 w-full bg-slate-700 rounded-full"></div>
                <div className="h-2 w-2/3 bg-slate-700 rounded-full"></div>
             </motion.div>
             
             {/* 404 Overlay */}
             <motion.div 
                animate={{ opacity: [0, 0, 1, 0, 0], scale: [0.8, 0.8, 1, 0.8, 0.8] }}
                transition={{ duration: DURATION, times: [0, 0.2, 0.3, 0.6, 1], repeat: Infinity }}
                className="absolute inset-0 flex flex-col items-center justify-center text-red-500 gap-2 bg-[#1E293B]/90 backdrop-blur-sm pointer-events-none"
             >
                <AlertCircle size={32} />
                <span className="text-xs font-bold">Page Deleted</span>
             </motion.div>

             {/* Shield Restoration */}
             <motion.div 
                animate={{ opacity: [0, 0, 0, 1, 1, 0, 0] }}
                transition={{ duration: DURATION, times: [0, 0.5, 0.6, 0.7, 0.9, 0.95, 1], repeat: Infinity }}
                className="absolute inset-0 bg-[#21DBA4]/10 backdrop-blur-sm flex flex-col items-center justify-center z-10"
             >
                <Shield size={40} className="text-[#21DBA4] mb-2 animate-bounce" />
                <div className="bg-[#21DBA4] text-black px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1.5">
                   <RefreshCw size={12} /> Restored
                </div>
             </motion.div>
          </div>
       </div>
    </motion.div>
  )
}
