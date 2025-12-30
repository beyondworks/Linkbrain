import React from 'react';
import { motion } from 'motion/react';
import { X, Edit2, Trash2 } from 'lucide-react';
import { CATEGORY_COLORS } from '../constants';
import { LinkItem, Category } from '../types';

interface CategoryManagerModalProps {
    categories: Category[];
    links: LinkItem[];
    onClose: () => void;
    onEdit: (cat: Category) => void;
    onDelete: (catId: string) => void;
    theme: 'light' | 'dark';
    t: (key: string) => string;
}

export const CategoryManagerModal = ({ categories, links, onClose, onEdit, onDelete, theme, t }: CategoryManagerModalProps) => {
    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col ${theme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}
                style={{ maxHeight: 'min(70vh, 500px)' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header - Fixed */}
                <div className={`p-4 border-b flex items-center justify-between shrink-0 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                    <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('smartFolders')}</h3>
                    <button onClick={onClose} className={`p-1.5 rounded-full ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div
                    className="flex-1 overflow-y-auto overscroll-contain p-2 space-y-1"
                    style={{
                        WebkitOverflowScrolling: 'touch',
                        scrollbarWidth: theme === 'dark' ? 'none' : 'thin',
                        scrollbarColor: theme === 'dark' ? 'transparent transparent' : '#cbd5e1 #f1f5f9'
                    }}
                >
                    {categories.map((cat: Category) => {
                        const count = links.filter((l: LinkItem) => l.categoryId === cat.id && !l.isArchived).length;
                        const isEmpty = count === 0;

                        return (
                            <div
                                key={cat.id}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
                            >
                                {/* Color Dot */}
                                <div
                                    className="w-4 h-4 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: CATEGORY_COLORS[cat.color] || '#f1f5f9' }}
                                />

                                {/* Name & Count */}
                                <div className="flex-1 min-w-0">
                                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>{cat.name}</span>
                                    <span className="text-xs text-slate-400 ml-2">({count})</span>
                                </div>

                                {/* Edit Button */}
                                <button
                                    onClick={() => onEdit(cat)}
                                    className={`p-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                                >
                                    <Edit2 size={16} />
                                </button>

                                {/* Delete Button */}
                                <div className="relative group">
                                    <button
                                        onClick={() => isEmpty && onDelete(cat.id)}
                                        disabled={!isEmpty}
                                        className={`p-1.5 rounded-lg transition-colors ${isEmpty
                                            ? (theme === 'dark' ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-500')
                                            : 'text-slate-300 cursor-not-allowed'
                                            }`}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {categories.length === 0 && (
                        <div className="py-8 text-center text-slate-400 text-sm italic">
                            No categories found.
                        </div>
                    )}
                </div>

                {/* Footer - Fixed (shows category count) */}
                <div className={`px-4 py-3 border-t shrink-0 ${theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'}`}>
                    <p className={`text-xs text-center ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                        {categories.length} {categories.length === 1 ? 'category' : 'categories'}
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
