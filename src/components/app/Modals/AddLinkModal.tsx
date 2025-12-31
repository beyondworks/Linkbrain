import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Plus, ChevronDown, Check } from 'lucide-react';
import { getCategoryColor, CATEGORY_COLOR_PALETTE } from '../constants';

// Use indexed color keys for new categories
const COLOR_KEYS = [
    'color-0', 'color-1', 'color-2', 'color-3', 'color-4',
    'color-5', 'color-6', 'color-7', 'color-8', 'color-9'
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

    // Dropdown states
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isCollectionDropdownOpen, setIsCollectionDropdownOpen] = useState(false);

    // New category creation
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryColor, setNewCategoryColor] = useState(COLOR_KEYS[0]);

    // New collection creation
    const [isCreatingCollection, setIsCreatingCollection] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');

    // Loading states
    const [isCreatingCategoryLoading, setIsCreatingCategoryLoading] = useState(false);
    const [isCreatingCollectionLoading, setIsCreatingCollectionLoading] = useState(false);

    // Refs for click outside
    const categoryDropdownRef = useRef<HTMLDivElement>(null);
    const collectionDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target as Node)) {
                setIsCategoryDropdownOpen(false);
                setIsCreatingCategory(false);
            }
            if (collectionDropdownRef.current && !collectionDropdownRef.current.contains(e.target as Node)) {
                setIsCollectionDropdownOpen(false);
                setIsCreatingCollection(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
            setIsCategoryDropdownOpen(false);
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
            setIsCollectionDropdownOpen(false);
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

    const selectedCategory = categories.find(c => c.id === selectedCategoryId);
    const selectedCollections = collections.filter(c => selectedCollectionIds.includes(c.id));

    return (
        <div className="fixed inset-0 z-[70] flex items-start md:items-center justify-center p-4 pt-20 md:pt-4 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: -20 }}
                className={`rounded-3xl w-full max-w-lg shadow-2xl relative z-10 my-auto ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}
            >
                <div className="p-6 md:p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('addLink')}</h2>
                        <button onClick={onClose} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}><X size={18} /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
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

                        {/* 2 Column Grid: Category + Collection */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Category Dropdown */}
                            <div className="relative" ref={categoryDropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => { setIsCategoryDropdownOpen(!isCategoryDropdownOpen); setIsCollectionDropdownOpen(false); }}
                                    className={`w-full h-12 rounded-xl px-3 flex items-center justify-between border transition-all text-sm ${theme === 'dark'
                                        ? 'bg-slate-800 border-slate-700 text-white hover:border-slate-600'
                                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                                        }`}
                                >
                                    <span className={`truncate ${selectedCategory ? '' : 'text-slate-400'}`}>
                                        {selectedCategory ? selectedCategory.name : (language === 'ko' ? '카테고리 선택' : 'Category')}
                                    </span>
                                    <ChevronDown size={16} className={`shrink-0 ml-1 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isCategoryDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-lg border z-50 flex flex-col ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
                                            style={{ maxHeight: '320px', overflow: 'hidden' }}
                                        >
                                            {/* AI Auto + New Category at TOP */}
                                            <div className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-100'}`}>
                                                {/* AI Auto-classify */}
                                                <button
                                                    type="button"
                                                    onClick={() => { setSelectedCategoryId(null); setIsCategoryDropdownOpen(false); }}
                                                    className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors ${theme === 'dark' ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-50 text-slate-500'
                                                        }`}
                                                >
                                                    {language === 'ko' ? 'AI 자동 분류' : 'AI Auto'}
                                                    {!selectedCategoryId && <Check size={14} className="text-[#21DBA4]" />}
                                                </button>

                                                {/* New Category button/form */}
                                                {isCreatingCategory ? (
                                                    <div className="px-3 py-2 space-y-2">
                                                        <input
                                                            type="text"
                                                            value={newCategoryName}
                                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                                            placeholder={language === 'ko' ? '이름' : 'Name'}
                                                            className={`w-full h-8 rounded-lg px-2 text-sm focus:outline-none border ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'}`}
                                                            autoFocus
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                        <div className="flex gap-1">
                                                            {COLOR_KEYS.slice(0, 6).map((colorKey, idx) => (
                                                                <button
                                                                    key={colorKey}
                                                                    type="button"
                                                                    onClick={(e) => { e.stopPropagation(); setNewCategoryColor(colorKey); }}
                                                                    className={`w-5 h-5 rounded-full ${newCategoryColor === colorKey ? 'ring-2 ring-[#21DBA4] ring-offset-1' : ''}`}
                                                                    style={{ backgroundColor: getCategoryColor(colorKey, theme === 'dark') }}
                                                                />
                                                            ))}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.stopPropagation(); handleCreateCategory(); }}
                                                                disabled={!newCategoryName.trim() || isCreatingCategoryLoading}
                                                                className="flex-1 h-7 rounded-lg bg-[#21DBA4] text-white text-xs font-bold disabled:opacity-50"
                                                            >
                                                                {isCreatingCategoryLoading ? '...' : (language === 'ko' ? '생성' : 'Add')}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.stopPropagation(); setIsCreatingCategory(false); setNewCategoryName(''); }}
                                                                className={`px-2 h-7 rounded-lg text-xs ${theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-500'}`}
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); setIsCreatingCategory(true); }}
                                                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-1.5 transition-colors ${theme === 'dark' ? 'hover:bg-slate-700 text-[#21DBA4]' : 'hover:bg-slate-50 text-[#21DBA4]'
                                                            }`}
                                                    >
                                                        <Plus size={14} />
                                                        {language === 'ko' ? '새 카테고리' : 'New Category'}
                                                    </button>
                                                )}
                                            </div>

                                            {/* Category List - fills remaining space, scrolls if needed */}
                                            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'thin' }}>
                                                {categories.map(cat => (
                                                    <button
                                                        key={cat.id}
                                                        type="button"
                                                        onClick={() => { setSelectedCategoryId(cat.id); setIsCategoryDropdownOpen(false); }}
                                                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors ${theme === 'dark' ? 'hover:bg-slate-700 text-white' : 'hover:bg-slate-50 text-slate-700'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getCategoryColor(cat.color, theme === 'dark') }} />
                                                            <span className="truncate">{cat.name}</span>
                                                        </div>
                                                        {selectedCategoryId === cat.id && <Check size={14} className="text-[#21DBA4] shrink-0" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Collection Dropdown */}
                            <div className="relative" ref={collectionDropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => { setIsCollectionDropdownOpen(!isCollectionDropdownOpen); setIsCategoryDropdownOpen(false); }}
                                    className={`w-full h-12 rounded-xl px-3 flex items-center justify-between border transition-all text-sm ${theme === 'dark'
                                        ? 'bg-slate-800 border-slate-700 text-white hover:border-slate-600'
                                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                                        }`}
                                >
                                    <span className={`truncate ${selectedCollections.length > 0 ? '' : 'text-slate-400'}`}>
                                        {selectedCollections.length > 0
                                            ? (selectedCollections.length === 1 ? selectedCollections[0].name : `${selectedCollections.length}개 선택`)
                                            : (language === 'ko' ? '컬렉션' : 'Collection')}
                                    </span>
                                    <ChevronDown size={16} className={`shrink-0 ml-1 transition-transform ${isCollectionDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isCollectionDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-lg border overflow-hidden z-50 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                                                }`}
                                        >
                                            {/* New Collection at TOP */}
                                            <div className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-100'}`}>
                                                {isCreatingCollection ? (
                                                    <div className="px-3 py-2 space-y-2">
                                                        <input
                                                            type="text"
                                                            value={newCollectionName}
                                                            onChange={(e) => setNewCollectionName(e.target.value)}
                                                            placeholder={language === 'ko' ? '컬렉션 이름' : 'Name'}
                                                            className={`w-full h-8 rounded-lg px-2 text-sm focus:outline-none border ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'}`}
                                                            autoFocus
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.stopPropagation(); handleCreateCollection(); }}
                                                                disabled={!newCollectionName.trim() || isCreatingCollectionLoading}
                                                                className="flex-1 h-7 rounded-lg bg-[#21DBA4] text-white text-xs font-bold disabled:opacity-50"
                                                            >
                                                                {isCreatingCollectionLoading ? '...' : (language === 'ko' ? '생성' : 'Add')}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.stopPropagation(); setIsCreatingCollection(false); setNewCollectionName(''); }}
                                                                className={`px-2 h-7 rounded-lg text-xs ${theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-500'}`}
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); setIsCreatingCollection(true); }}
                                                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-1.5 transition-colors ${theme === 'dark' ? 'hover:bg-slate-700 text-[#21DBA4]' : 'hover:bg-slate-50 text-[#21DBA4]'
                                                            }`}
                                                    >
                                                        <Plus size={14} />
                                                        {language === 'ko' ? '새 컬렉션' : 'New Collection'}
                                                    </button>
                                                )}
                                            </div>

                                            {/* Collection List */}
                                            <div className="max-h-40 overflow-y-auto">
                                                {collections.length === 0 ? (
                                                    <div className={`px-4 py-3 text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                                                        {language === 'ko' ? '컬렉션이 없습니다' : 'No collections'}
                                                    </div>
                                                ) : (
                                                    collections.map(col => (
                                                        <button
                                                            key={col.id}
                                                            type="button"
                                                            onClick={() => toggleCollection(col.id)}
                                                            className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors ${theme === 'dark' ? 'hover:bg-slate-700 text-white' : 'hover:bg-slate-50 text-slate-700'
                                                                }`}
                                                        >
                                                            <span className="truncate">{col.name}</span>
                                                            {selectedCollectionIds.includes(col.id) && <Check size={14} className="text-[#21DBA4] shrink-0" />}
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!url}
                            className={`w-full h-14 bg-[#21DBA4] rounded-2xl font-bold text-lg hover:bg-[#1bc290] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 ${theme === 'dark' ? 'text-slate-900' : 'text-white'}`}
                        >
                            <Plus size={20} /> {t('addLink')}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};
