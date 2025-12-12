import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Brain, ExternalLink, Plus } from 'lucide-react';

interface AddLinkModalProps {
    onClose: () => void;
    onAdd: (url: string) => void;
    theme: 'light' | 'dark';
    t: (key: string) => string;
}

export const AddLinkModal = ({ onClose, onAdd, theme, t }: AddLinkModalProps) => {
    const [url, setUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;
        setIsAnalyzing(true);
        await new Promise(r => setTimeout(r, 1500));
        onAdd(url);
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden z-10 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
                <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('addLink')}</h2>
                        <button onClick={onClose} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}><X size={18} /></button>
                    </div>
                    {isAnalyzing ? (
                        <div className="flex flex-col items-center justify-center py-10 space-y-6">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full border-4 border-[#E0FBF4] border-t-[#21DBA4] animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center"><Brain size={24} className="text-[#21DBA4]" /></div>
                            </div>
                            <div className="text-center space-y-2"><h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Analyzing Content...</h3><p className="text-slate-500 text-sm">Generating summary and extracting tags</p></div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className={`text-sm font-bold ml-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>URL</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400"><ExternalLink size={18} /></div>
                                    <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste any link here..." className={`w-full h-14 rounded-2xl pl-12 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-[#21DBA4]/20 border transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white focus:bg-slate-700' : 'bg-slate-50 border-slate-200 focus:bg-white'}`} autoFocus />
                                </div>
                            </div>
                            <button type="submit" disabled={!url} className={`w-full h-14 bg-[#21DBA4] rounded-2xl font-bold text-lg shadow-lg shadow-[#21DBA4]/30 hover:bg-[#1bc290] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 ${theme === 'dark' ? 'text-slate-900' : 'text-white'}`}><Plus size={20} /> {t('addLink')}</button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
