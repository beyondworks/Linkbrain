import React from 'react';
import { motion } from 'motion/react';
import { Logo } from '../Logo';

import { 
  Sparkles, 
  Youtube,
  Globe,
  List,
  GitGraph,
  Plus,
  Settings,
  LayoutGrid,
  Tag
} from 'lucide-react';

export const HeroInterfaceDemo = () => {
  const LOOP_DURATION = 10;

  return (
    <div className="w-full max-w-5xl mx-auto perspective-1000 md:px-0">
      <div 
        className="relative bg-[#0F172A] rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto min-h-[600px] md:h-[640px]"
        style={{ willChange: 'transform' }}
      >
        {/* Sidebar (Hidden on Mobile) */}
        <div className="hidden md:flex w-64 border-r border-slate-800 bg-[#0B1120] flex-col p-5 z-10 shrink-0">
           <div className="flex items-center gap-3 mb-10">
              <Logo className="w-8 h-8 rounded-xl shadow-lg shadow-[#21DBA4]/10 overflow-hidden" />
              <span className="font-bold text-white text-lg tracking-tight">LinkBrain</span>
           </div>
           
           
           <div className="space-y-2">
              <SidebarItem icon={<LayoutGrid size={18} />} label="All Knowledge" active />
              <SidebarItem icon={<Sparkles size={18} />} label="AI Insights" hasNotification />
              <SidebarItem icon={<GitGraph size={18} />} label="Graph View" />
              <SidebarItem icon={<Tag size={18} />} label="Tags" />
           </div>

           <div className="mt-auto pt-6 border-t border-slate-800">
               <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 mb-4">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-[10px] text-slate-400 font-bold uppercase">Storage</span>
                     <span className="text-[10px] text-[#21DBA4] font-bold">82%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                     <div className="h-full bg-[#21DBA4] w-[82%]" />
                  </div>
               </div>
              <SidebarItem icon={<Settings size={18} />} label="Settings" />
           </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative bg-[#0F172A]">
           {/* Header */}
           <div className="h-16 md:h-20 border-b border-slate-800 flex items-center justify-between px-4 md:px-8 bg-[#0F172A] z-20 shrink-0">
              <div>
                 <h2 className="text-white font-bold text-base md:text-lg">Knowledge Base</h2>
                 <p className="text-[10px] md:text-xs text-slate-500 font-medium">Updated just now</p>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                 <button className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#21DBA4] flex items-center justify-center text-black hover:bg-[#1BC290] transition-colors">
                    <Plus size={18} />
                 </button>
              </div>
           </div>

           {/* Dashboard Content */}
           <div className="p-4 md:p-8 relative overflow-hidden flex-1 flex flex-col">
              
              {/* Drop Zone */}
              <div className="mb-4 md:mb-8 relative z-20 shrink-0">
                 <motion.div 
                    animate={{ 
                       borderColor: ['#334155', '#21DBA4', '#21DBA4', '#334155', '#334155'],
                       backgroundColor: ['rgba(30, 41, 59, 1)', 'rgba(33, 219, 164, 0.1)', 'rgba(33, 219, 164, 0.1)', 'rgba(30, 41, 59, 1)', 'rgba(30, 41, 59, 1)'],
                       scale: [1, 0.98, 0.98, 1, 1]
                    }}
                    transition={{ 
                        duration: LOOP_DURATION, 
                        times: [0, 0.2, 0.3, 0.4, 1],
                        repeat: Infinity 
                    }}
                    className="w-full h-20 md:h-24 rounded-2xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center gap-2 overflow-hidden"
                 >
                    <div className="flex flex-col items-center gap-1 md:gap-2">
                        <Plus size={16} className="text-slate-400 md:w-5 md:h-5" />
                        <p className="text-slate-500 text-xs md:text-sm font-medium">Drop links here</p>
                    </div>
                    
                    {/* Scanning Beam */}
                    <motion.div 
                        animate={{ left: ['-100%', '200%'] }}
                        transition={{ 
                            duration: 1.5, 
                            ease: "linear", 
                            delay: 2.5, 
                            repeat: Infinity,
                            repeatDelay: 8.5 
                        }}
                        className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-[#21DBA4]/20 to-transparent skew-x-12"
                    />
                 </motion.div>
              </div>

              {/* Grid Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 relative flex-1">
                 
                 {/* Connection Line (Neural Link) - Responsive SVG */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                    {/* Desktop Curve */}
                    <motion.path
                       className="hidden md:block"
                       d="M 200 120 C 200 120, 200 250, 450 250" 
                       fill="none"
                       stroke="#21DBA4"
                       strokeWidth="2"
                       strokeDasharray="6 4"
                       initial={{ pathLength: 0, opacity: 0 }}
                       animate={{ 
                          pathLength: [0, 0, 1, 1, 0, 0], 
                          opacity: [0, 0, 1, 1, 0, 0] 
                       }}
                       transition={{ 
                           duration: LOOP_DURATION, 
                           times: [0, 0.6, 0.7, 0.9, 0.95, 1],
                           repeat: Infinity 
                       }}
                    />
                     {/* Mobile Line (Vertical) */}
                     <motion.path
                       className="md:hidden"
                       d="M 150 100 L 150 220" 
                       fill="none"
                       stroke="#21DBA4"
                       strokeWidth="2"
                       strokeDasharray="6 4"
                       initial={{ pathLength: 0, opacity: 0 }}
                       animate={{ 
                          pathLength: [0, 0, 1, 1, 0, 0], 
                          opacity: [0, 0, 1, 1, 0, 0] 
                       }}
                       transition={{ 
                           duration: LOOP_DURATION, 
                           times: [0, 0.6, 0.7, 0.9, 0.95, 1],
                           repeat: Infinity 
                       }}
                    />

                    {/* Animated Circle (Desktop) */}
                    <motion.circle 
                        className="hidden md:block"
                        cx="450" cy="250" r="4" fill="#21DBA4"
                        animate={{ scale: [0, 0, 1, 1, 0, 0] }}
                        transition={{ 
                           duration: LOOP_DURATION, 
                           times: [0, 0.7, 0.75, 0.9, 0.95, 1], 
                           repeat: Infinity 
                        }}
                    />
                 </svg>

                 {/* The New Item (AI Constructed) */}
                 <motion.div
                    animate={{ 
                        opacity: [0, 0, 1, 1, 0, 0], 
                        y: [20, 20, 0, 0, 20, 20],
                        scale: [0.9, 0.9, 1, 1, 0.9, 0.9]
                    }}
                    transition={{ 
                        duration: LOOP_DURATION, 
                        times: [0, 0.35, 0.4, 0.9, 0.95, 1],
                        repeat: Infinity 
                    }}
                    className="col-span-1 md:col-span-2 bg-[#1E293B] rounded-2xl border border-slate-700/50 p-4 md:p-5 relative group shadow-xl z-20 min-h-[140px] md:min-h-0"
                 >
                    <div className="absolute -top-3 left-4 md:left-6 bg-[#21DBA4] text-black text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles size={10} fill="black" /> AI Processed
                    </div>

                    <div className="flex gap-3 md:gap-5 h-full">
                        <div className="w-24 h-24 md:w-32 md:h-28 rounded-xl bg-slate-800 flex-shrink-0 relative overflow-hidden flex items-center justify-center border border-slate-700">
                            <Youtube size={24} className="text-red-500 opacity-80 md:w-8 md:h-8" />
                        </div>

                        <div className="flex-1 min-w-0 py-0.5 md:py-1 flex flex-col justify-center">
                            <motion.h3 
                                animate={{ opacity: [0, 0, 1, 1, 0, 0], x: [-10, -10, 0, 0, 10, 10] }}
                                transition={{ duration: LOOP_DURATION, times: [0, 0.4, 0.45, 0.9, 0.95, 1], repeat: Infinity }}
                                className="text-white font-bold text-sm md:text-xl truncate mb-1 md:mb-2"
                            >
                                2025 Design Trends: AI & UI
                            </motion.h3>

                            <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-2 md:mb-4">
                                {['Design', 'Trends', 'AI Tools'].map((tag, i) => (
                                    <motion.span 
                                        key={tag}
                                        animate={{ opacity: [0, 0, 1, 1, 0, 0], scale: [0, 0, 1, 1, 0, 0] }}
                                        transition={{ 
                                           duration: LOOP_DURATION, 
                                           times: [0, 0.45 + (i*0.05), 0.5 + (i*0.05), 0.9, 0.95, 1], 
                                           repeat: Infinity 
                                        }}
                                        className="px-1.5 py-0.5 rounded text-[9px] md:text-[10px] font-bold border border-slate-700 bg-slate-800 text-slate-300"
                                    >
                                        #{tag}
                                    </motion.span>
                                ))}
                            </div>

                            <motion.div 
                                animate={{ opacity: [0, 0, 1, 1, 0, 0] }}
                                transition={{ duration: LOOP_DURATION, times: [0, 0.55, 0.6, 0.9, 0.95, 1], repeat: Infinity }}
                                className="bg-slate-800/30 rounded-lg md:rounded-xl p-2 md:p-3 border border-slate-700/50"
                            >
                                <p className="text-slate-400 text-[10px] md:text-xs leading-relaxed line-clamp-2">
                                    Generative UI will replace manual layouting. The boundary between designers and developers is blurring.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                 </motion.div>

                 {/* Existing Connected Item */}
                 <div className="relative z-10 md:h-auto h-24">
                    <motion.div 
                        animate={{ scale: [0, 0, 1, 1, 0, 0] }}
                        transition={{ duration: LOOP_DURATION, times: [0, 0.7, 0.75, 0.9, 0.95, 1], repeat: Infinity }}
                        className="absolute -top-3 right-1/2 translate-x-1/2 md:right-auto md:left-1/2 md:-translate-x-1/2 z-20 bg-[#1E293B] border border-[#21DBA4] text-[#21DBA4] text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap"
                    >
                        <GitGraph size={10} /> Related
                    </motion.div>
                    
                    <SavedCard 
                       title="Design Systems Guide" 
                       source="smashingmagazine.com" 
                       icon={<Globe size={16} className="text-blue-400" />} 
                       tags={['Design', 'System']}
                       color="blue"
                    />
                 </div>

                 {/* Static Items - Hidden on mobile to save space or shown in grid */}
                 <div className="hidden md:block">
                     <SavedCard 
                        title="React Server Components" 
                        source="react.dev" 
                        icon={<Globe size={16} className="text-sky-400" />} 
                        tags={['Dev', 'React']}
                        color="sky"
                     />
                 </div>
                 <div className="hidden md:block">
                     <SavedCard 
                        title="Q1 2025 Goals" 
                        source="Notion" 
                        icon={<List size={16} className="text-orange-400" />} 
                        tags={['Personal']}
                        color="orange"
                     />
                 </div>
              </div>

              {/* Cursor Interaction (The Actor) */}
              <Cursor loopDuration={LOOP_DURATION} />
              
              {/* Floating Link (During Drag) */}
              <motion.div
                  animate={{ 
                      x: ['100%', '100%', '50%', '50%', '100%', '100%'],
                      y: ['100%', '100%', '20%', '20%', '100%', '100%'],
                      opacity: [0, 0, 1, 0, 0, 0],
                      scale: [0.5, 0.5, 1, 0, 0, 0.5]
                  }}
                  transition={{ 
                      duration: LOOP_DURATION, 
                      times: [0, 0.1, 0.2, 0.3, 0.35, 1],
                      repeat: Infinity,
                      ease: "circOut"
                  }}
                  className="absolute z-50 bg-white text-black px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-2xl font-bold text-[10px] md:text-xs flex items-center gap-2 pointer-events-none border-2 border-[#21DBA4]"
                  style={{ top: 0, left: 0 }} 
              >
                  <Youtube size={12} className="text-red-600 md:w-3.5 md:h-3.5" />
                  <span className="max-w-[80px] md:max-w-none truncate">youtu.be/trends...</span>
              </motion.div>

           </div>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, active = false, hasNotification = false }: any) => (
  <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${active ? 'bg-slate-800 text-[#21DBA4]' : 'text-slate-400'}`}>
     <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-medium">{label}</span>
     </div>
     {hasNotification && (
        <span className="w-2 h-2 rounded-full bg-[#21DBA4]"></span>
     )}
  </div>
);

const SavedCard = ({ title, source, icon, tags, color }: any) => {
   const colorClasses: any = {
      blue: 'text-blue-400 border-blue-400/20',
      orange: 'text-orange-400 border-orange-400/20',
      sky: 'text-sky-400 border-sky-400/20',
      green: 'text-green-400 border-green-400/20',
   };

   return (
      <div className={`bg-[#1E293B] rounded-xl md:rounded-2xl border border-slate-700/50 p-4 md:p-5 h-full flex flex-col justify-center md:justify-start`}>
         <div className="flex justify-between items-start mb-2 md:mb-4">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700/50">
               {icon}
            </div>
            <div className="flex gap-1">
               {tags.map((t: string) => (
                   <span key={t} className={`px-1.5 py-0.5 md:px-2 md:py-0.5 rounded text-[9px] md:text-[10px] font-bold border ${colorClasses[color]} bg-slate-800`}>
                     {t}
                   </span>
               ))}
            </div>
         </div>
         <h4 className="text-slate-200 font-bold text-xs md:text-sm mb-1 leading-snug truncate">{title}</h4>
         <span className="text-slate-500 text-[10px] md:text-xs flex items-center gap-1 mt-auto md:pt-2">
            {source}
         </span>
      </div>
   )
}

const Cursor = ({ loopDuration }: { loopDuration: number }) => {
   return (
      <motion.div
         animate={{ 
            x: ['100%', '100%', '85%', '52%', '52%', '80%', '100%', '100%'],
            y: ['100%', '100%', '85%', '22%', '22%', '50%', '100%', '100%'],
            scale: [1, 1, 1, 0.9, 1.2, 1, 1, 1],
            opacity: [0, 0, 1, 1, 1, 1, 0, 0]
         }}
         transition={{ 
            duration: loopDuration, 
            times: [0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.95, 1],
            repeat: Infinity,
            ease: "easeInOut"
         }}
         className="absolute top-0 left-0 z-[60] pointer-events-none"
      >
         <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg md:w-8 md:h-8">
            <path d="M8.5 28L6.5 4L26.5 14L16 16.5L23 26.5L19.5 29L12.5 19L8.5 28Z" fill="#21DBA4" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
         </svg>
      </motion.div>
   )
}