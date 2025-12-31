import React, { useState } from 'react';
import { getCategoryColor } from '../constants';
import { LinkItem } from '../types';

interface ManagementModalProps {
    title: string;
    initialData?: { id: string; name: string; color: string } | null;
    type: 'category' | 'collection';
    onClose: () => void;
    onSave: (data: { id?: string; name: string; color: string }) => void;
    onDelete?: (id: string) => void;
    links?: LinkItem[];
    theme: 'light' | 'dark';
    t: (key: string) => string;
}

export const ManagementModal = ({ title, initialData, type, onClose, onSave, onDelete, links, theme, t }: ManagementModalProps) => {
    // New 10-color indexed palette
    const categoryColors = [
        'color-0', 'color-1', 'color-2', 'color-3', 'color-4',
        'color-5', 'color-6', 'color-7', 'color-8', 'color-9'
    ];
    const collectionColors = ['bg-indigo-500', 'bg-teal-500', 'bg-rose-500', 'bg-amber-500', 'bg-slate-800'];

    const colors = type === 'category' ? categoryColors : collectionColors;

    // 랜덤 컬러 생성 함수
    const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

    const [name, setName] = useState(initialData?.name || '');
    const [color, setColor] = useState(initialData?.color || getRandomColor());

    // For collections: count clips that belong to this collection
    const clipCount = type === 'collection' && initialData && links
        ? links.filter((l) => l.collectionIds?.includes(initialData.id)).length
        : 0;

    // Manage body scroll lock
    React.useEffect(() => {
        // Store original overflow style
        const originalStyle = window.getComputedStyle(document.body).overflow;
        // Lock scroll
        document.body.style.overflow = 'hidden';

        return () => {
            // Restore original style on unmount
            document.body.style.overflow = originalStyle;
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
            <div
                className={`rounded-xl w-[90vw] max-w-[320px] max-h-[85vh] overflow-y-auto p-5 shadow-2xl relative ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}
                onClick={e => e.stopPropagation()}
            >
                <h3 className="font-bold text-base mb-3">{title}</h3>
                <div className="space-y-3">
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{t('name')}</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className={`w-full border rounded-lg px-3 py-2 text-base md:text-sm mt-1 focus:ring-2 focus:ring-[#21DBA4]/20 outline-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`}
                            autoFocus
                        />
                    </div>
                    {/* Color picker - only show for categories */}
                    {type === 'category' && (
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{t('colorStyle')}</label>
                            <div className="flex gap-1 mt-2">
                                {colors.map(c => {
                                    const bgStyle = getCategoryColor(c, theme === 'dark');

                                    return (
                                        <button
                                            key={c}
                                            onClick={() => setColor(c)}
                                            className={`w-5 h-5 rounded-full border transition-all ${color === c ? 'ring-2 ring-[#21DBA4] ring-offset-1 scale-110' : 'hover:scale-105'}`}
                                            style={{ backgroundColor: bgStyle }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                        {/* Delete button - only show for existing items */}
                        {initialData && onDelete && (
                            <button
                                onClick={() => onDelete(initialData.id)}
                                disabled={type === 'collection' && clipCount > 0}
                                title={clipCount > 0 ? "Cannot delete non-empty collection" : "Delete"}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${type === 'collection' && clipCount > 0
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : theme === 'dark'
                                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                        : 'bg-red-50 text-red-500 hover:bg-red-100'
                                    }`}
                            >
                                {t('delete') || 'Delete'}
                            </button>
                        )}
                        <button
                            onClick={() => onSave({ id: initialData?.id, name, color })}
                            disabled={!name}
                            className="flex-1 bg-[#21DBA4] text-white py-2 rounded-lg text-xs font-bold hover:bg-[#1bc290] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {t('save')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
