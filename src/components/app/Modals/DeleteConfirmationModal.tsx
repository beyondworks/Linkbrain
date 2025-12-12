import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
    count: number;
    onCancel: () => void;
    onConfirm: () => void;
    theme: 'light' | 'dark';
    t: (key: string) => string;
}

export const DeleteConfirmationModal = ({ count, onCancel, onConfirm, theme, t }: DeleteConfirmationModalProps) => {
    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onCancel}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`rounded-2xl w-full max-w-sm p-6 shadow-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4 mx-auto">
                    <AlertTriangle size={24} />
                </div>
                <h3 className={`font-bold text-lg text-center mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('deleteConfirmTitle').replace('{count}', String(count))}</h3>
                <p className="text-sm text-slate-500 text-center mb-6">
                    {t('deleteConfirmDesc')}
                </p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className={`flex-1 py-2.5 rounded-xl font-bold transition-colors ${theme === 'dark' ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}>{t('cancel')}</button>
                    <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">{t('delete')}</button>
                </div>
            </motion.div>
        </div>
    );
};
