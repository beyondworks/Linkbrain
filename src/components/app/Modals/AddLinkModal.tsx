import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

    // Dropdown states
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isCollectionDropdownOpen, setIsCollectionDropdownOpen] = useState(false);

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

    // Refs for click outside
    const categoryDropdownRef = useRef<HTMLDivElement>(null);
    const collectionDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target as Node)) {
                setIsCategoryDropdownOpen(false);
            }
            if (collectionDropdownRef.current && !collectionDropdownRef.current.contains(e.target as Node)) {
                setIsCollectionDropdownOpen(false);
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
        <div className="fixed inset-0 z-[70] flex items-start md:items-center justify-center p-4 pt-20 md:pt-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: -20 }}
                className={`rounded-3xl w-full max-w-lg shadow-2xl relative overflow-visible z-10 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}
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

                        {/* Category Dropdown */}
                        <div className="relative" ref={categoryDropdownRef}>
                            <button
                                type="button"
                                onClick={() => { setIsCategoryDropdownOpen(!isCategoryDropdownOpen); setIsCollectionDropdownOpen(false); }}
                                className={`w-full h-12 rounded-xl px-4 flex items-center justify-between border transition-all ${theme === 'dark'
                                        ? 'bg-slate-800 border-slate-700 text-white hover:border-slate-600'
                                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                                    }`}
                            >
                                <span className={selectedCategory ? '' : 'text-slate-400'}>
                                    {selectedCategory ? selectedCategory.name : (language === 'ko' ? '카테고리 선택' : 'Select Category')}
                                </span>
                                <ChevronDown size={18} className={`transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isCategoryDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        className={`absolute top-full left-0 right-0 mt-2 rounded-xl shadow-lg border overflow-hidden z-50 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                                            }`}
                                    >
                                        <div className="max-h-48 overflow-y-auto">
                                            {/* None option */}
                                            <button
                                                type="button"
                                                onClick={() => { setSelectedCategoryId(null); setIsCategoryDropdownOpen(false); }}
                                                className={`w-full px-4 py-3 text-left text-sm flex items-center justify-between transition-colors ${theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-50 text-slate-400'
                                                    }`}
                                            >
                                                {language === 'ko' ? 'AI 자동 분류' : 'AI Auto-classify'}
                                                {!selectedCategoryId && <Check size={16} className="text-[#21DBA4]" />}
                                            </button>

                                            {categories.map(cat => (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => { setSelectedCategoryId(cat.id); setIsCategoryDropdownOpen(false); }}
                                                    className={`w-full px-4 py-3 text-left text-sm flex items-center justify-between transition-colors ${theme === 'dark' ? 'hover:bg-slate-700 text-white' : 'hover:bg-slate-50 text-slate-700'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-3 h-3 rounded-full ${cat.color.split(' ')[0]}`} />
                                                        {cat.name}
                                                    </div>
                                                    {selectedCategoryId === cat.id && <Check size={16} className="text-[#21DBA4]" />}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Create new category */}
                                        <div className={`border-t ${theme === 'dark' ? 'border-slate-700' : 'border-slate-100'}`}>
                                            {isCreatingCategory ? (
                                                <div className="p-3 space-y-2">
                                                    <input
                                                        type="text"
                                                        value={newCategoryName}
                                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                                        placeholder={language === 'ko' ? '카테고리 이름' : 'Category name'}
                                                        className={`w-full h-9 rounded-lg px-3 text-sm focus:outline-none border ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'}`}
                                                        autoFocus
                                                    />
                                                    <div className="flex gap-1.5">
                                                        {CATEGORY_COLORS.map(color => (
                                                            <button
                                                                key={color}
                                                                type="button"
                                                                onClick={() => setNewCategoryColor(color)}
                                                                className={`w-5 h-5 rounded-full ${color.split(' ')[0]} ${newCategoryColor === color ? 'ring-2 ring-[#21DBA4] ring-offset-1' : ''}`}
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
                                                <button
                                                    type="button"
                                                    onClick={() => setIsCreatingCategory(true)}
                                                    className={`w-full px-4 py-3 text-left text-sm flex items-center gap-2 transition-colors ${theme === 'dark' ? 'hover:bg-slate-700 text-[#21DBA4]' : 'hover:bg-slate-50 text-[#21DBA4]'
                                                        }`}
                                                >
                                                    <Plus size={16} />
                                                    {language === 'ko' ? '새 카테고리' : 'New Category'}
                                                </button>
                                            )}
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
                                className={`w-full h-12 rounded-xl px-4 flex items-center justify-between border transition-all ${theme === 'dark'
                                        ? 'bg-slate-800 border-slate-700 text-white hover:border-slate-600'
                                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                                    }`}
                            >
                                <span className={selectedCollections.length > 0 ? '' : 'text-slate-400'}>
                                    {selectedCollections.length > 0
                                        ? selectedCollections.map(c => c.name).join(', ')
                                        : (language === 'ko' ? '컬렉션이 없습니다.' : 'No Collection')}
                                </span>
                                <ChevronDown size={18} className={`transition-transform ${isCollectionDropdownOpen ? 'rotate-180' : ''}`} />
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
                                        <div className="max-h-48 overflow-y-auto">
                                            {collections.length === 0 && !isCreatingCollection && (
                                                <div className={`px-4 py-3 text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                                                    {language === 'ko' ? '컬렉션이 없습니다' : 'No collections yet'}
                                                </div>
                                            )}

                                            {collections.map(col => (
                                                <button
                                                    key={col.id}
                                                    type="button"
                                                    onClick={() => toggleCollection(col.id)}
                                                    className={`w-full px-4 py-3 text-left text-sm flex items-center justify-between transition-colors ${theme === 'dark' ? 'hover:bg-slate-700 text-white' : 'hover:bg-slate-50 text-slate-700'
                                                        }`}
                                                >
                                                    {col.name}
                                                    {selectedCollectionIds.includes(col.id) && <Check size={16} className="text-[#21DBA4]" />}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Create new collection */}
                                        <div className={`border-t ${theme === 'dark' ? 'border-slate-700' : 'border-slate-100'}`}>
                                            {isCreatingCollection ? (
                                                <div className="p-3 space-y-2">
                                                    <input
                                                        type="text"
                                                        value={newCollectionName}
                                                        onChange={(e) => setNewCollectionName(e.target.value)}
                                                        placeholder={language === 'ko' ? '컬렉션 이름' : 'Collection name'}
                                                        className={`w-full h-9 rounded-lg px-3 text-sm focus:outline-none border ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200'}`}
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
                                                <button
                                                    type="button"
                                                    onClick={() => setIsCreatingCollection(true)}
                                                    className={`w-full px-4 py-3 text-left text-sm flex items-center gap-2 transition-colors ${theme === 'dark' ? 'hover:bg-slate-700 text-[#21DBA4]' : 'hover:bg-slate-50 text-[#21DBA4]'
                                                        }`}
                                                >
                                                    <Plus size={16} />
                                                    {language === 'ko' ? '새 컬렉션' : 'New Collection'}
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

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
