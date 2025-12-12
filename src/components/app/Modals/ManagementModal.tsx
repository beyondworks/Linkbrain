import React, { useState } from 'react';
import { CATEGORY_COLORS } from '../constants';
import { LinkItem } from '../types';

interface ManagementModalProps {
    title: string;
    initialData?: { id: string; name: string; color: string } | null;
    type: 'category' | 'collection';
    onClose: () => void;
    onSave: (data: { id: string; name: string; color: string }) => void;
    onDelete?: (id: string) => void;
    links?: LinkItem[];
    theme: 'light' | 'dark';
    t: (key: string) => string;
}

export const ManagementModal = ({ title, initialData, type, onClose, onSave, onDelete, links, theme, t }: ManagementModalProps) => {
    const [name, setName] = useState(initialData?.name || '');
    const [id, setId] = useState(initialData?.id || '');
    const [color, setColor] = useState(initialData?.color || (type === 'category' ? 'bg-blue-100 text-blue-600' : 'bg-slate-500'));

    // For collections: count clips that belong to this collection
    const clipCount = type === 'collection' && initialData && links
        ? links.filter((l) => l.collectionIds?.includes(initialData.id)).length
        : 0;

    const colors = type === 'category'
        ? [
            'bg-pink-100 text-pink-600',
            'bg-blue-100 text-blue-600',
            'bg-emerald-100 text-emerald-600',
            'bg-orange-100 text-orange-600',
            'bg-purple-100 text-purple-600',
            'bg-green-200 text-green-700',
            'bg-indigo-200 text-indigo-700',
            'bg-red-200 text-red-700'
        ]
        : ['bg-indigo-500', 'bg-teal-500', 'bg-rose-500', 'bg-amber-500', 'bg-slate-800'];

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <div className={`rounded-2xl w-full max-w-sm p-6 shadow-2xl ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`} onClick={e => e.stopPropagation()}>
                <h3 className="font-bold text-lg mb-4">{title}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500">{t('name')}</label>
                        <input type="text" value={name} onChange={e => { setName(e.target.value); if (!initialData) setId(e.target.value.toLowerCase().replace(/\s+/g, '-')); }} className={`w-full border rounded-lg p-2 text-sm mt-1 focus:ring-2 focus:ring-[#21DBA4]/20 outline-none ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}`} autoFocus />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500">ID (Unique)</label>
                        <input type="text" value={id} onChange={e => setId(e.target.value)} disabled={!!initialData} className={`w-full border rounded-lg p-2 text-sm mt-1 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200'}`} />
                    </div>
                    {/* Color picker - only show for categories */}
                    {type === 'category' && (
                        <div>
                            <label className="text-xs font-bold text-slate-500">{t('colorStyle')}</label>
                            <div className="flex gap-2 mt-2 flex-wrap">
                                {colors.map(c => {
                                    const bgStyle = CATEGORY_COLORS[c] || '#f1f5f9';

                                    return (
                                        <button
                                            key={c}
                                            onClick={() => setColor(c)}
                                            className={`w-8 h-8 rounded-full border transition-all ${color === c ? 'ring-2 ring-black ring-offset-2 scale-110' : 'hover:scale-105'}`}
                                            style={{ backgroundColor: bgStyle }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    <button onClick={() => onSave({ id, name, color })} disabled={!name || !id} className="w-full bg-[#21DBA4] text-white py-3 rounded-xl font-bold mt-4 shadow-lg shadow-[#21DBA4]/20 hover:bg-[#1bc290] disabled:opacity-50 disabled:cursor-not-allowed">{t('save')}</button>

                    {/* Delete button - only show for existing collections */}
                    {type === 'collection' && initialData && onDelete && (
                        <button
                            onClick={() => onDelete(initialData.id)}
                            disabled={clipCount > 0}
                            title={clipCount > 0 ? "Cannot delete non-empty collection" : "Delete collection"}
                            className={`w-full py-2.5 rounded-xl font-bold transition-colors ${clipCount > 0
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-red-50 text-red-500 hover:bg-red-100'}`}
                        >
                            {t('delete') || 'Delete'} {clipCount > 0 && `(${clipCount} clips)`}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
