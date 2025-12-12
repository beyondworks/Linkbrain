import React, { useState } from 'react';
import { 
  Heart, 
  Bookmark, 
  Clock, 
  ArrowRight, 
  Zap,
  TrendingUp,
  Monitor,
  Cpu,
  Globe,
  Layout,
  MessageSquare,
  Share2
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

// --- Types ---
interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  likes: number;
  savedCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

// --- Mock Data ---
const FEATURED_ARTICLE = {
  id: 0,
  title: "The Rise of 'Vibe Coding': How AI Changes Design Systems",
  excerpt: "Analyzing 24 saved clips about MCP, Gemini 2.0, and No-code tools. Explore how the role of designers is shifting from 'Pixel Perfect' to 'Logic Architect'.",
  readTime: "5 min read",
  tags: ["AI Trends"],
  image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2400&auto=format&fit=crop",
  curators: [
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", 
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100"
  ]
};

const ARTICLES: Article[] = [
  {
    id: 1,
    title: "2026 UI Trends: Beyond Glassmorphism",
    excerpt: "Deep dive into the next wave of interface design. Based on recent Dribbble and Behance saves.",
    category: "Design",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    author: {
      name: "Sarah K.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
    },
    date: "2 hrs ago",
    likes: 342,
    savedCount: 12
  },
  {
    id: 2,
    title: "Understanding the 40B Asset Recovery Process",
    excerpt: "A comprehensive synthesis of news articles regarding the recent exchange hack and recovery.",
    category: "Crypto",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80",
    author: {
      name: "CryptoDaily",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100"
    },
    date: "5 hrs ago",
    likes: 128,
    savedCount: 8
  },
  {
    id: 3,
    title: "React vs Vue in 2025: A Performance Review",
    excerpt: "Comparing rendering speeds and developer experience based on 15 tech blog posts.",
    category: "Development",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    author: {
      name: "DevCommunity",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
    },
    date: "1 day ago",
    likes: 890,
    savedCount: 15
  },
  {
    id: 4,
    title: "The 'Second Brain' Methodology Guide",
    excerpt: "How to organize your digital life. Summarized from Notion templates and YouTube tutorials.",
    category: "Productivity",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
    author: {
      name: "LinkBrain Official",
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100"
    },
    date: "2 days ago",
    likes: 1205,
    savedCount: 22
  },
  {
    id: 5,
    title: "Y Combinator W25 Batch Analysis",
    excerpt: "Common themes and pivot strategies found in the latest batch of YC startups.",
    category: "Startup",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
    author: {
      name: "VentureScout",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100"
    },
    date: "3 days ago",
    likes: 45,
    savedCount: 6
  },
  {
    id: 6,
    title: "Short-form Video Algorithms Decoded",
    excerpt: "What makes a Reel go viral? Insights gathered from 30 marketing case studies.",
    category: "Marketing",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
    author: {
      name: "ViralLab",
      avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100"
    },
    date: "4 days ago",
    likes: 677,
    savedCount: 30
  }
];

const CATEGORIES = ["All", "Design", "Development", "Crypto", "Startup", "Marketing", "Productivity"];

export const LinkBrainArticle = ({ theme }: { theme: 'light' | 'dark' }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [articles, setArticles] = useState<Article[]>(ARTICLES);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const filteredArticles = activeCategory === "All" 
    ? articles 
    : articles.filter(a => a.category === activeCategory);

  const isDark = theme === 'dark';

  const handleToggleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setArticles(prev => {
        const next = prev.map(a => 
          a.id === id ? { ...a, isLiked: !a.isLiked, likes: a.isLiked ? a.likes - 1 : a.likes + 1 } : a
        );
        // Sync selectedArticle if it matches
        if (selectedArticle && selectedArticle.id === id) {
             const updated = next.find(a => a.id === id);
             if (updated) setSelectedArticle(updated);
        }
        return next;
    });
  };

  const handleToggleSave = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setArticles(prev => {
        const next = prev.map(a => 
          a.id === id ? { ...a, isSaved: !a.isSaved, savedCount: a.isSaved ? a.savedCount - 1 : a.savedCount + 1 } : a
        );
        // Sync selectedArticle if it matches
        if (selectedArticle && selectedArticle.id === id) {
             const updated = next.find(a => a.id === id);
             if (updated) setSelectedArticle(updated);
        }
        return next;
    });
  };

  const handleShare = () => {
     const url = window.location.href;
     
     // Fallback for environments where clipboard API is blocked
     const copyToClipboard = (text: string) => {
       if (navigator.clipboard && window.isSecureContext) {
         return navigator.clipboard.writeText(text);
       } else {
         // Fallback using legacy execCommand
         const textArea = document.createElement("textarea");
         textArea.value = text;
         
         // Ensure textarea is not visible but part of DOM
         textArea.style.position = "fixed";
         textArea.style.left = "-9999px";
         textArea.style.top = "0";
         document.body.appendChild(textArea);
         
         textArea.focus();
         textArea.select();
         
         return new Promise<void>((resolve, reject) => {
           try {
             const successful = document.execCommand('copy');
             document.body.removeChild(textArea);
             if (successful) {
               resolve();
             } else {
               reject(new Error("Copy command failed"));
             }
           } catch (err) {
             document.body.removeChild(textArea);
             reject(err);
           }
         });
       }
     };

     copyToClipboard(url)
       .then(() => {
         toast.success("Link copied to clipboard!", {
            description: "You can now share this article with your friends.",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
         });
       })
       .catch(() => {
         toast.error("Failed to copy link");
       });
  };

  return (
    <div className={`w-full min-h-full p-4 md:p-8 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-8">
          <Zap className="text-[#21DBA4]" size={24} fill="currentColor" />
          <h1 className="text-2xl font-black tracking-tight">Weekly Top Pick</h1>
        </div>

        {/* Featured Banner */}
        <div onClick={() => setSelectedArticle({ ...articles[0], ...FEATURED_ARTICLE } as any)} className="relative w-full h-[500px] md:h-[400px] rounded-3xl overflow-hidden mb-12 group cursor-pointer shadow-2xl shadow-[#21DBA4]/10">
          <img 
            src={FEATURED_ARTICLE.image} 
            alt="Featured" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
             <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[#21DBA4] text-white text-xs font-bold rounded-full shadow-lg shadow-[#21DBA4]/20">
                   {FEATURED_ARTICLE.tags[0]}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-white/80 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                   <Clock size={12} /> {FEATURED_ARTICLE.readTime}
                </span>
             </div>

             <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight max-w-4xl drop-shadow-sm">
                {FEATURED_ARTICLE.title}
             </h2>
             
             <p className="text-white/80 text-sm md:text-lg mb-8 max-w-2xl leading-relaxed">
                {FEATURED_ARTICLE.excerpt}
             </p>

             <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                   <div className="flex -space-x-3">
                      {FEATURED_ARTICLE.curators.map((src, i) => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-slate-800 overflow-hidden">
                           <img src={src} className="w-full h-full object-cover" />
                        </div>
                      ))}
                   </div>
                   <span className="text-xs font-medium text-white/80">
                      Curated by <span className="text-white font-bold">LinkBrain</span> + 12 others
                   </span>
                </div>

                <button className="w-full md:w-auto px-6 py-3 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-black rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 group/btn border border-white/30">
                   Read Article <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
             </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-nowrap md:flex-wrap overflow-x-auto md:overflow-visible items-center gap-2 mb-8 sticky top-0 z-20 py-4 -mx-4 px-4 bg-inherit backdrop-blur-sm no-scrollbar">
           {CATEGORIES.map(cat => (
             <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeCategory === cat 
                    ? 'bg-[#21DBA4] text-white shadow-lg shadow-[#21DBA4]/20 scale-105' 
                    : isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50 shadow-sm'
                }`}
             >
                {cat}
             </button>
           ))}
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
           {filteredArticles.map(article => (
             <motion.div 
               key={article.id}
               layoutId={`article-${article.id}`}
               onClick={() => setSelectedArticle(article)}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className={`rounded-3xl overflow-hidden group cursor-pointer border transition-all hover:-translate-y-1 hover:shadow-xl relative flex flex-col ${
                 isDark ? 'bg-slate-900 border-slate-800 shadow-slate-900/50' : 'bg-white border-slate-100 shadow-sm hover:shadow-slate-200/50'
               }`}
             >
                <div className="relative h-56 overflow-hidden">
                   <img src={article.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute top-4 left-4">
                      <span className="px-2.5 py-1 bg-white/90 backdrop-blur text-slate-900 text-[10px] font-bold rounded-md shadow-sm">
                         {article.category}
                      </span>
                   </div>
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <button className="bg-white text-slate-900 px-5 py-2 rounded-full font-bold text-xs transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
                         Read Now <ArrowRight size={12} />
                      </button>
                   </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                   <div className="flex items-center gap-2 mb-3 text-[#21DBA4] text-[10px] font-bold">
                      <Zap size={12} fill="currentColor" />
                      <span>Based on {article.savedCount} saved clips</span>
                   </div>

                   <h3 className={`font-bold text-lg leading-tight mb-2 group-hover:text-[#21DBA4] transition-colors ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                      {article.title}
                   </h3>
                   <p className={`text-xs line-clamp-2 mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {article.excerpt}
                   </p>

                   <div className="mt-auto flex items-center justify-between pt-4 border-t border-dashed border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                         <img src={article.author.avatar} className="w-6 h-6 rounded-full" />
                         <div className="flex flex-col">
                            <span className={`text-[10px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{article.author.name}</span>
                            <span className="text-[9px] text-slate-400">{article.date}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <Heart size={12} fill={article.isLiked ? "currentColor" : "none"} className={article.isLiked ? "text-red-500" : ""} /> {article.likes}
                         </div>
                         <button onClick={(e) => handleToggleSave(e, article.id)} className={`hover:text-[#21DBA4] transition-colors ${article.isSaved ? 'text-[#21DBA4]' : 'text-slate-400'}`}>
                            <Bookmark size={14} fill={article.isSaved ? "currentColor" : "none"} />
                         </button>
                         <button onClick={(e) => handleToggleLike(e, article.id)} className={`hover:text-red-500 transition-colors ${article.isLiked ? 'text-red-500' : 'text-slate-400'}`}>
                            <Heart size={14} fill={article.isLiked ? "currentColor" : "none"} />
                         </button>
                      </div>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Article Detail Overlay */}
        {selectedArticle && (
            <div className="fixed inset-0 z-[60] flex justify-end">
              <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                  onClick={() => setSelectedArticle(null)}
              />
              <motion.div 
                  initial={{ x: "100%" }} 
                  animate={{ x: 0 }} 
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className={`w-full max-w-2xl h-full shadow-2xl relative flex flex-col overflow-hidden ${isDark ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-900'}`}
              >
                  {/* Header */}
                  <div className={`h-16 border-b flex items-center justify-between px-6 shrink-0 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSelectedArticle(null)} className={`p-2 -ml-2 rounded-full ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                          <ArrowRight size={20} className="rotate-180" />
                        </button>
                        <div className={`h-4 w-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Article View</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={(e) => selectedArticle && handleToggleSave(e, selectedArticle.id)} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} ${selectedArticle.isSaved ? 'text-[#21DBA4]' : 'text-slate-400'}`}>
                          <Bookmark size={18} fill={selectedArticle.isSaved ? "currentColor" : "none"} />
                        </button>
                        <button onClick={(e) => selectedArticle && handleToggleLike(e, selectedArticle.id)} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} ${selectedArticle.isLiked ? 'text-red-500' : 'text-slate-400'}`}>
                          <Heart size={18} fill={selectedArticle.isLiked ? "currentColor" : "none"} />
                        </button>
                        <button onClick={handleShare} className={`p-2 rounded-full text-slate-400 ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
                          <Share2 size={18} />
                        </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-0">
                      <div className="relative h-64 md:h-80 w-full">
                        <img src={selectedArticle.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <span className="px-3 py-1 bg-[#21DBA4] text-white text-xs font-bold rounded-full shadow-lg mb-3 inline-block">
                              {selectedArticle.category}
                            </span>
                            <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2">
                              {selectedArticle.title}
                            </h1>
                            <div className="flex items-center gap-3 text-white/80 text-xs">
                              <span>{selectedArticle.author.name}</span>
                              <span>•</span>
                              <span>{selectedArticle.readTime}</span>
                              <span>•</span>
                              <span>{selectedArticle.date}</span>
                            </div>
                        </div>
                      </div>

                      <div className="p-8 max-w-xl mx-auto">
                          <p className={`text-lg leading-relaxed font-medium mb-8 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            {selectedArticle.excerpt}
                          </p>
                          
                          <div className={`p-6 rounded-2xl mb-8 border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                              <h3 className="font-bold mb-4 flex items-center gap-2">
                                <Zap size={18} className="text-[#21DBA4]" /> AI Summary
                              </h3>
                              <div className="space-y-3 text-sm">
                                <p>This article discusses the emerging trends in {selectedArticle.category}, highlighting key shifts in technology and user behavior.</p>
                                <ul className="space-y-2 list-disc pl-4 opacity-80">
                                  <li>Key insight about {selectedArticle.title}</li>
                                  <li>Impact on modern workflows</li>
                                  <li>Future predictions for 2026</li>
                                </ul>
                              </div>
                          </div>

                          <div className={`prose ${isDark ? 'prose-invert' : ''} max-w-none`}>
                              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                              <h3>The Shift in Perspective</h3>
                              <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                          </div>
                      </div>
                      
                      <div className="h-32"></div>
                  </div>
              </motion.div>
            </div>
        )}

      </div>
    </div>
  );
};
