import React, { useState, useEffect } from 'react';
import { 
  FolderOpen, 
  FileText, 
  Database, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Zap,
  Shield,
  Layout
} from 'lucide-react';

const features = [
  {
    id: 0,
    title: "카테고리 자동 분류",
    subtitle: "Category Auto-classification",
    desc: "매번 폴더를 만들 필요 없습니다. AI가 내용을 분석해 최적의 카테고리로 자동 정리합니다.",
    color: "#21DBA4",
    icon: <FolderOpen size={20} />
  },
  {
    id: 1,
    title: "내용 요약",
    subtitle: "Content Summary",
    desc: "바쁜 당신을 위해 핵심 내용만 3줄로 요약해 드립니다. 영상은 타임라인별 중요 포인트까지.",
    color: "#3B82F6",
    icon: <FileText size={20} />
  },
  {
    id: 2,
    title: "영구 저장",
    subtitle: "Permanent Storage",
    desc: "원본 링크가 사라져도 걱정 마세요. LinkBrain 아카이브에 안전하게 영구 저장됩니다.",
    color: "#8B5CF6",
    icon: <Database size={20} />
  }
];

export const FeatureSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleManualChange = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Browser Frame */}
      <div className="relative bg-white rounded-[2rem] border border-slate-200/60 shadow-2xl shadow-slate-200/50 overflow-hidden backdrop-blur-sm">
        
        {/* Browser Header */}
        <div className="h-12 border-b border-slate-100 flex items-center justify-between px-5 bg-slate-50/50 backdrop-blur sticky top-0 z-20">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 bg-white border border-slate-100 px-3 py-1 rounded-full shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#21DBA4]"></span>
            linkbrain.ai/features
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-col md:flex-row h-[500px] md:h-[400px]">
          
          {/* Left: Navigation & Info */}
          <div className="w-full md:w-2/5 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 bg-white relative z-10">
             <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-6">
                   {features[currentSlide].subtitle}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight transition-all duration-300">
                  {features[currentSlide].title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {features[currentSlide].desc}
                </p>
             </div>

             {/* Slide Indicators */}
             <div className="flex gap-2 mt-8 md:mt-0">
               {features.map((feature, idx) => (
                 <button 
                    key={feature.id}
                    onClick={() => handleManualChange(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-8 bg-[#21DBA4]' : 'w-2 bg-slate-200 hover:bg-slate-300'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                 />
               ))}
             </div>
          </div>

          {/* Right: Visualization */}
          <div className="w-full md:w-3/5 bg-slate-50/50 relative overflow-hidden flex items-center justify-center p-8">
             {/* Background Grid */}
             <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>
             
             {/* Animated Scenes */}
             <div className="relative w-full h-full max-w-sm mx-auto flex items-center justify-center">
                
                {currentSlide === 0 && <ClassificationScene isActive={currentSlide === 0} />}
                {currentSlide === 1 && <SummaryScene isActive={currentSlide === 1} />}
                {currentSlide === 2 && <StorageScene isActive={currentSlide === 2} />}

             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// Animation Scenes
// ----------------------------------------------------------------------

const ClassificationScene = ({ isActive }: { isActive: boolean }) => {
  return (
     <div className={`relative w-64 h-48 transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        {/* Folders */}
        <div className="absolute bottom-0 left-0 w-24 h-20 bg-blue-50 border-2 border-blue-100 rounded-xl flex items-center justify-center z-10">
           <span className="text-[10px] font-bold text-blue-300 mt-8">Dev</span>
           <div className="absolute top-[-10px] left-0 w-10 h-4 bg-blue-100 rounded-t-lg"></div>
        </div>
        <div className="absolute bottom-0 right-0 w-24 h-20 bg-teal-50 border-2 border-[#21DBA4]/20 rounded-xl flex items-center justify-center z-10 shadow-lg shadow-[#21DBA4]/5">
           <span className="text-[10px] font-bold text-[#21DBA4] mt-8">Design</span>
           <div className="absolute top-[-10px] right-0 w-10 h-4 bg-[#21DBA4]/20 rounded-t-lg"></div>
        </div>
        
        {/* Incoming Link Card */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-10 bg-white rounded-lg shadow-md border border-slate-100 flex items-center gap-2 px-3 animate-slide-in-drop">
           <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-400">
             <Layout size={12} />
           </div>
           <div className="flex-1">
             <div className="h-1.5 w-16 bg-slate-100 rounded-full mb-1"></div>
             <div className="h-1 w-10 bg-slate-50 rounded-full"></div>
           </div>
        </div>
        
        {/* AI Processing Badge */}
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 bg-[#21DBA4] text-white px-2 py-1 rounded-full text-[9px] font-bold flex items-center gap-1 shadow-lg animate-pulse-scale">
           <Sparkles size={10} /> AI Analyzing
        </div>
     </div>
  )
}

const SummaryScene = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className={`relative w-56 h-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
       {/* Header */}
       <div className="flex items-center gap-3 mb-4 border-b border-slate-50 pb-3">
          <div className="w-8 h-8 rounded-full bg-slate-100"></div>
          <div className="space-y-1.5">
             <div className="h-2 w-24 bg-slate-100 rounded-full"></div>
             <div className="h-1.5 w-16 bg-slate-50 rounded-full"></div>
          </div>
       </div>
       
       {/* Content Transformation */}
       <div className="space-y-2 relative">
          <div className="h-1.5 w-full bg-slate-100 rounded-full opacity-30"></div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full opacity-30"></div>
          <div className="h-1.5 w-3/4 bg-slate-100 rounded-full opacity-30"></div>
          
          {/* Summary Box Overlay */}
          <div className="absolute top-0 left-0 right-0 bg-blue-50/90 backdrop-blur-sm rounded-xl p-3 border border-blue-100 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
             <div className="flex items-center gap-1.5 mb-2">
               <Zap size={12} className="text-blue-500" fill="currentColor" />
               <span className="text-[9px] font-bold text-blue-600">AI Summary</span>
             </div>
             <div className="space-y-2">
                <div className="flex gap-2 items-start">
                   <div className="w-1 h-1 rounded-full bg-blue-400 mt-1"></div>
                   <div className="h-1.5 w-full bg-blue-200/50 rounded-full"></div>
                </div>
                <div className="flex gap-2 items-start">
                   <div className="w-1 h-1 rounded-full bg-blue-400 mt-1"></div>
                   <div className="h-1.5 w-4/5 bg-blue-200/50 rounded-full"></div>
                </div>
                <div className="flex gap-2 items-start">
                   <div className="w-1 h-1 rounded-full bg-blue-400 mt-1"></div>
                   <div className="h-1.5 w-5/6 bg-blue-200/50 rounded-full"></div>
                </div>
             </div>
          </div>
       </div>
    </div>
  )
}

const StorageScene = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className={`relative w-40 h-40 transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
       
       {/* Safe/Vault Icon Background */}
       <div className="absolute inset-0 bg-[#F5F3FF] rounded-full flex items-center justify-center animate-pulse-slow">
          <div className="absolute inset-4 border-2 border-dashed border-[#8B5CF6]/20 rounded-full animate-spin-slow"></div>
       </div>

       {/* Central Item */}
       <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-20 bg-white rounded-lg border border-[#8B5CF6]/30 shadow-lg shadow-[#8B5CF6]/20 flex flex-col items-center justify-center gap-2 relative z-10">
             <div className="w-8 h-8 rounded bg-[#F5F3FF] flex items-center justify-center text-[#8B5CF6]">
                <FileText size={16} />
             </div>
             <div className="w-10 h-1 bg-slate-100 rounded-full"></div>
             
             {/* Shield Overlay */}
             <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#8B5CF6] rounded-full flex items-center justify-center text-white border-2 border-white shadow-md animate-bounce-small">
               <Shield size={10} fill="currentColor" />
             </div>
          </div>
       </div>
       
       {/* Checkmark Notification */}
       <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white border border-[#8B5CF6]/20 text-[#8B5CF6] px-3 py-1 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1.5 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <CheckCircle2 size={12} /> Permanently Saved
       </div>
    </div>
  )
}
