import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, ExternalLink, Plus, ChevronDown, Check, Folder, Tag } from 'lucide-react';

// Color options for new categories
const CATEGORY_COLORS = [
    'bg-pink-100 text-pink-600',
    'bg-blue-100 text-blue-600',
    'bg-emerald-100 text-emerald-600',
    'bg-orange-100 text-orange-600',
    'bg-purple-100 text-purple-600',
    'bg-amber-100 text-amber-600',
    'bg-cyan-100 text-cyan-600',
    'bg-rose-100 text-rose-600',
];

interface Category {
    id: string;
    name: string;
    color: string;
}

interface Collection {
    id: string;
    name: string;
    color?: string;
}

interface AddLinkModalProps {
    onClose: () => void;
    onAdd: (url: string, categoryId?: string, collectionIds?: string[]) => void;
    theme: 'light' | 'dark';
    t: (key: string) => string;
    language: 'en' | 'ko';
    categories: Category[];
    collections: Collection[];
    onCreateCategory: (name: string, color: string) => Promise<any>;
    onCreateCollection: (name: string) => Promise<any>;
}

export const AddLinkModal = ({
    onClose,
    onAdd,
    theme,
    t,
    language,
    categories,
    collections,
    onCreateCategory,
    onCreateCollection
}: AddLinkModalProps) => {
    const [url, setUrl] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>([]);

    // New category creation
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryColor, setNewCategoryColor] = useState(CATEGORY_COLORS[0]);

    // New collection creation
    const [isCreatingCollection, setIsCreatingCollection] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');

    // Loading states
    const [isCreatingCategoryLoading, setIsCreatingCategoryLoading] = useState(false);
    const [isCreatingCollectionLoading, setIsCreatingCollectionLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;
        onAdd(url, selectedCategoryId || undefined, selectedCollectionIds.length > 0 ? selectedCollectionIds : undefined);
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        setIsCreatingCategoryLoading(true);
        try {
            const result = await onCreateCategory(newCategoryName.trim(), newCategoryColor);
            setSelectedCategoryId(result.id);
            setIsCreatingCategory(false);
            setNewCategoryName('');
        } catch (error) {
            console.error('Failed to create category:', error);
        } finally {
            setIsCreatingCategoryLoading(false);
        }
    };

    const handleCreateCollection = async () => {
        if (!newCollectionName.trim()) return;
        setIsCreatingCollectionLoading(true);
        try {
            const result = await onCreateCollection(newCollectionName.trim());
            setSelectedCollectionIds([...selectedCollectionIds, result.id]);
            setIsCreatingCollection(false);
            setNewCollectionName('');
        } catch (error) {
            console.error('Failed to create collection:', error);
        } finally {
            setIsCreatingCollectionLoading(false);
        }
    };

    const toggleCollection = (id: string) => {
        setSelectedCollectionIds(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-start md:items-center justify-center p-4 pt-20 md:pt-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: -20 }}
                className={`rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden z-10 max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}
            >
                <div className="p-6 md:p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('addLink')}</h2>
                        <button onClick={onClose} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}><X size={18} /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* URL Input */}
                        <div className="space-y-2">
                            <label className={`text-sm font-bold ml-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>URL</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400"><ExternalLink size={18} /></div>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="Paste any link here..."
                                    className={`w-full h-14 rounded-2xl pl-12 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-[#21DBA4]/20 border transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white focus:bg-slate-700' : 'bg-slate-50 border-slate-200 focus:bg-white'}`}
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Category & Collection Section - 2 Column Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Category Section */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Tag size={14} className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} />
                                    <label className={`text-sm font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                                        {language === 'ko' ? '카테고리' : 'Category'}
                                    </label>
                                </div>

                                {isCreatingCategory ? (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            placeholder={language === 'ko' ? '카테고리 이름' : 'Category name'}
                                            className={`w-full h-10 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#21DBA4]/20 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                            autoFocus
                                        />
                                        {/* Color Picker */}
                                        <div className="flex flex-wrap gap-1.5">
                                            {CATEGORY_COLORS.map(color => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => setNewCategoryColor(color)}
                                                    className={`w-6 h-6 rounded-full ${color.split(' ')[0]} ${newCategoryColor === color ? 'ring-2 ring-[#21DBA4] ring-offset-2' : ''}`}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={handleCreateCategory}
                                                disabled={!newCategoryName.trim() || isCreatingCategoryLoading}
                                                className="flex-1 h-8 rounded-lg bg-[#21DBA4] text-white text-xs font-bold disabled:opacity-50"
                                            >
                                                {isCreatingCategoryLoading ? '...' : (language === 'ko' ? '생성' : 'Create')}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setIsCreatingCategory(false); setNewCategoryName(''); }}
                                                className={`px-3 h-8 rounded-lg text-xs font-bold ${theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
                                            >
                                                {language === 'ko' ? '취소' : 'Cancel'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {/* Existing Categories */}
                                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                                            {categories.map(cat => (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => setSelectedCategoryId(selectedCategoryId === cat.id ? null : cat.id)}
                                                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${cat.color} ${selectedCategoryId === cat.id ? 'ring-2 ring-[#21DBA4] ring-offset-1' : 'opacity-70 hover:opacity-100'}`}
                                                >
                                                    {cat.name}
                                                </button>
                                            ))}
                                        </div>
                                        {/* New Category Button */}
                                        <button
                                            type="button"
                                            onClick={() => setIsCreatingCategory(true)}
                                            className={`w-full h-8 rounded-xl border-2 border-dashed flex items-center justify-center gap-1 text-xs font-bold transition-colors ${theme === 'dark' ? 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300' : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-500'}`}
                                        >
                                            <Plus size={12} />
                                            {language === 'ko' ? '새 카테고리' : 'New Category'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Collection Section */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Folder size={14} className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} />
                                    <label className={`text-sm font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                                        {language === 'ko' ? '컬렉션' : 'Collection'}
                                    </label>
                                </div>

                                {isCreatingCollection ? (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={newCollectionName}
                                            onChange={(e) => setNewCollectionName(e.target.value)}
                                            placeholder={language === 'ko' ? '컬렉션 이름' : 'Collection name'}
                                            className={`w-full h-10 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#21DBA4]/20 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'}`}
                                            autoFocus
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={handleCreateCollection}
                                                disabled={!newCollectionName.trim() || isCreatingCollectionLoading}
                                                className="flex-1 h-8 rounded-lg bg-[#21DBA4] text-white text-xs font-bold disabled:opacity-50"
                                            >
                                                {isCreatingCollectionLoading ? '...' : (language === 'ko' ? '생성' : 'Create')}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setIsCreatingCollection(false); setNewCollectionName(''); }}
                                                className={`px-3 h-8 rounded-lg text-xs font-bold ${theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
                                            >
                                                {language === 'ko' ? '취소' : 'Cancel'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {/* Existing Collections */}
                                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                                            {collections.map(col => (
                                                <button
                                                    key={col.id}
                                                    type="button"
                                                    onClick={() => toggleCollection(col.id)}
                                                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${selectedCollectionIds.includes(col.id)
                                                            ? 'bg-[#21DBA4] text-white'
                                                            : theme === 'dark' ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                        }`}
                                                >
                                                    {selectedCollectionIds.includes(col.id) && <Check size={10} />}
                                                    {col.name}
                                                </button>
                                            ))}
                                        </div>
                                        {/* New Collection Button */}
                                        <button
                                            type="button"
                                            onClick={() => setIsCreatingCollection(true)}
                                            className={`w-full h-8 rounded-xl border-2 border-dashed flex items-center justify-center gap-1 text-xs font-bold transition-colors ${theme === 'dark' ? 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300' : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-500'}`}
                                        >
                                            <Plus size={12} />
                                            {language === 'ko' ? '새 컬렉션' : 'New Collection'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Helper Text */}
                        <p className={`text-xs text-center ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                            {language === 'ko' ? '미선택 시 AI가 자동으로 분류합니다' : 'If not selected, AI will auto-categorize'}
                        </p>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!url}
                            className={`w-full h-14 bg-[#21DBA4] rounded-2xl font-bold text-lg shadow-lg shadow-[#21DBA4]/30 hover:bg-[#1bc290] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 ${theme === 'dark' ? 'text-slate-900' : 'text-white'}`}
                        >
                            <Plus size={20} /> {t('addLink')}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};
