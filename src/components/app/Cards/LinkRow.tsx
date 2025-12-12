import React from 'react';
import { motion } from 'motion/react';
import { CheckSquare, Square, Star } from 'lucide-react';
import { getSourceInfo } from './helpers';

interface LinkRowProps {
    data: any;
    onClick: () => void;
    onToggleFavorite: (e: React.MouseEvent) => void;
    categories: any[];
    selected: boolean;
    selectionMode: boolean;
    onToggleSelect?: () => void;
    theme: 'light' | 'dark';
    showThumbnails: boolean;
}

export const LinkRow = ({ data, onClick, onToggleFavorite, categories, selected, selectionMode, onToggleSelect, theme, showThumbnails }: LinkRowProps) => {
    const source = getSourceInfo(data.url);
    const categoryName = categories?.find((c: any) => c.id === data.categoryId)?.name || data.categoryId;

    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onClick}
            className={`flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer group relative
            ${selected ? 'border-[#21DBA4] ring-2 ring-[#21DBA4]/20' : theme === 'dark' ? 'bg-slate-900 border-slate-800 hover:shadow-md hover:bg-slate-800' : 'bg-white border-slate-100 hover:shadow-md'}
         `}
        >
            {(selectionMode || selected) && (
                <div
                    className="shrink-0"
                    onClick={(e) => { e.stopPropagation(); onToggleSelect?.(); }}
                >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${selected ? 'bg-[#21DBA4] text-white' : 'bg-slate-100 text-slate-300 hover:bg-slate-200'}`}>
                        {selected ? <CheckSquare size={14} /> : <Square size={14} />}
                    </div>
                </div>
            )}

            {showThumbnails && (
                <div className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <img src={data.image} className="w-full h-full object-cover" />
                </div>
            )}

            <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-sm truncate group-hover:text-[#21DBA4] transition-colors ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{data.title}</h3>
                <p className="text-xs text-slate-400 truncate mt-1">{data.summary}</p>
                <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white ${source.color}`}>{source.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${theme === 'dark' ? 'text-slate-400 bg-slate-800' : 'text-slate-500 bg-slate-100'}`}>{categoryName}</span>
                    <span className="text-[10px] text-slate-300">{data.date}</span>
                </div>
            </div>
            <button onClick={onToggleFavorite} className={`p-2 ${data.isFavorite ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-400'}`}>
                <Star size={16} fill={data.isFavorite ? "currentColor" : "none"} />
            </button>
        </motion.div>
    );
};
