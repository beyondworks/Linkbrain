import React from 'react';
import { motion } from 'motion/react';
import {
    CheckSquare,
    Square,
    Hash,
    ExternalLink,
    Sparkles,
    Star
} from 'lucide-react';
import { getSourceInfo, GlobeIcon } from './helpers';

interface LinkCardProps {
    data: any;
    onClick: () => void;
    onToggleFavorite: (e: React.MouseEvent) => void;
    onToggleReadLater?: (e: React.MouseEvent) => void;
    selected: boolean;
    selectionMode: boolean;
    onToggleSelect?: () => void;
    categories: any[];
    theme: 'light' | 'dark';
    showThumbnails: boolean;
    t: (key: string) => string;
}

export const LinkCard = ({ data, onClick, onToggleFavorite, onToggleReadLater, selected, selectionMode, onToggleSelect, categories, theme, showThumbnails, t }: LinkCardProps) => {
    const source = getSourceInfo(data.url);
    const categoryId = data.categoryId;
    const categoryName = categories?.find((c: any) => c.id === categoryId)?.name || categoryId;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={onClick}
            className={`rounded-2xl border transition-all duration-300 group overflow-hidden flex flex-col h-auto cursor-pointer relative
         ${selected ? 'border-[#21DBA4] ring-2 ring-[#21DBA4]/20 shadow-lg' : theme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-sm hover:shadow-xl hover:shadow-slate-900/50' : 'bg-white border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:shadow-slate-200/50'}
      `}
        >
            <div
                className={`absolute top-3 left-3 z-[1] transition-opacity duration-200 ${selectionMode || selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                onClick={(e) => { e.stopPropagation(); onToggleSelect?.(); }}
            >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shadow-sm ${selected ? 'bg-[#21DBA4] text-white' : 'bg-white/90 text-slate-300 hover:text-slate-500 hover:bg-white'}`}>
                    {selected ? <CheckSquare size={16} /> : <Square size={16} />}
                </div>
            </div>

            {showThumbnails && (
                <div className={`relative h-48 overflow-hidden ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <img src={data.image} alt={data.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                    <div className={`absolute top-3 left-3 flex flex-wrap gap-1.5 z-[1] transition-all ${selectionMode || selected ? 'translate-x-8' : 'group-hover:translate-x-8'}`}>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-white text-[10px] font-bold backdrop-blur-md shadow-sm ${source.color}`}>
                            {source.icon} {source.name}
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full text-white text-[10px] font-bold bg-black/40 backdrop-blur-md border border-white/10 shadow-sm">
                            <Hash size={10} className="opacity-70" /> {categoryName}
                        </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                const url = data.url.startsWith('http') ? data.url : `https://${data.url}`;
                                window.open(url, '_blank');
                            }}
                            className="w-10 h-10 bg-white text-slate-900 rounded-lg flex items-center justify-center hover:bg-[#21DBA4] hover:text-white transition-colors shadow-lg"
                        >
                            <ExternalLink size={16} />
                        </button>
                    </div>
                </div>
            )}

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                    <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'} p-1 rounded-md`}>
                        <GlobeIcon url={data.url} />
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 truncate max-w-[100px]">{data.url}</span>
                    <span className="text-[10px] text-slate-300 ml-auto">{data.date}</span>
                </div>

                <h3 className={`font-bold text-[15px] leading-snug mb-3 h-[42px] group-hover:text-[#21DBA4] transition-colors line-clamp-2 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
                    {data.title}
                </h3>

                <div className={`rounded-xl p-3 mb-4 border transition-colors ${theme === 'dark' ? 'bg-slate-800 border-slate-700 group-hover:border-[#21DBA4]/20' : 'bg-[#F8FAFC] border-slate-100 group-hover:border-[#21DBA4]/20'}`}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <Sparkles size={12} className="text-[#21DBA4]" />
                        <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>AI Summary</span>
                    </div>
                    <p className={`text-[11px] leading-relaxed line-clamp-3 h-[54px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                        {data.summary}
                    </p>
                </div>

                {!showThumbnails && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-white text-[10px] font-bold ${source.color}`}>
                            {source.icon} {source.name}
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border ${theme === 'dark' ? 'text-slate-400 border-slate-700 bg-slate-800' : 'text-slate-500 border-slate-200 bg-slate-50'}`}>
                            <Hash size={10} className="opacity-70" /> {categoryName}
                        </div>
                    </div>
                )}

                <div className={`mt-auto pt-2 flex items-center justify-between border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-50'}`}>
                    <div className="flex gap-1.5 items-center overflow-hidden">
                        {data.tags.slice(0, 3).map((tag: string) => (
                            <span key={tag} className={`text-[10px] font-medium px-2 py-0.5 rounded transition-colors cursor-pointer whitespace-nowrap ${theme === 'dark' ? 'text-slate-400 bg-slate-800 hover:bg-slate-700' : 'text-slate-400 bg-slate-50 hover:bg-slate-100'}`}>
                                #{tag}
                            </span>
                        ))}
                        {data.tags.length > 3 && (
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded whitespace-nowrap ${theme === 'dark' ? 'text-slate-500 bg-slate-800' : 'text-slate-400 bg-slate-100'}`}>
                                +{data.tags.length - 3}
                            </span>
                        )}
                    </div>
                    <button onClick={onToggleFavorite} className={`transition-colors ${data.isFavorite ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-400'}`}>
                        <Star size={16} fill={data.isFavorite ? "currentColor" : "none"} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
