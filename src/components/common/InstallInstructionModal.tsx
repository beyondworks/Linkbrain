import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Share, MoreVertical, PlusSquare, Smartphone, Download } from 'lucide-react';
import { useUserPreferences } from '../../hooks/useUserPreferences'; // Assuming we can use this or just theme prop if passed

interface InstallInstructionModalProps {
    isOpen: boolean;
    onClose: () => void;
    theme?: 'light' | 'dark';
}

export const InstallInstructionModal = ({ isOpen, onClose, theme: propTheme }: InstallInstructionModalProps) => {
    // Determine theme if not provided (simple fallback)
    const theme = propTheme || 'light';

    // OS Detection
    const [activeTab, setActiveTab] = useState<'ios' | 'android'>('android');

    useEffect(() => {
        if (isOpen) {
            const userAgent = window.navigator.userAgent.toLowerCase();
            if (/iphone|ipad|ipod/.test(userAgent)) {
                setActiveTab('ios');
            } else {
                setActiveTab('android');
            }
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className={`relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${theme === 'dark' ? 'bg-slate-900 text-white border border-slate-800' : 'bg-white text-slate-900'}`}
            >
                {/* Header */}
                <div className={`p-6 pb-2 flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-[#21DBA4]/20 text-[#21DBA4]' : 'bg-[#E0FBF4] text-[#21DBA4]'}`}>
                            <Download size={20} />
                        </div>
                        <h2 className="text-xl font-bold">Linkbrain 설치하기</h2>
                    </div>
                    <button onClick={onClose} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex p-4 gap-2">
                    <button
                        onClick={() => setActiveTab('ios')}
                        className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'ios'
                            ? (theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900')
                            : (theme === 'dark' ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700')}`}
                    >
                        iOS (Safari)
                    </button>
                    <button
                        onClick={() => setActiveTab('android')}
                        className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'android'
                            ? (theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900')
                            : (theme === 'dark' ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700')}`}
                    >
                        Android / Chrome
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 pt-2 pb-10">
                    {activeTab === 'ios' ? (
                        <div className="space-y-5">
                            <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${theme === 'dark' ? 'bg-slate-800 text-[#21DBA4]' : 'bg-slate-100 text-[#21DBA4]'}`}>1</div>
                                <div>
                                    <p className={`font-medium mb-1 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>공유 버튼을 탭하세요</p>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>브라우저 하단에 있습니다.</p>
                                    <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm ${theme === 'dark' ? 'border-slate-700 bg-slate-800 text-blue-400' : 'border-slate-200 bg-slate-50 text-blue-500'}`}>
                                        <Share size={16} /> 공유
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${theme === 'dark' ? 'bg-slate-800 text-[#21DBA4]' : 'bg-slate-100 text-[#21DBA4]'}`}>2</div>
                                <div>
                                    <p className={`font-medium mb-1 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>'홈 화면에 추가'를 선택하세요</p>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>스크롤하여 해당 옵션을 찾으세요.</p>
                                    <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm ${theme === 'dark' ? 'border-slate-700 bg-slate-800 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                                        <PlusSquare size={16} /> 홈 화면에 추가
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${theme === 'dark' ? 'bg-slate-800 text-[#21DBA4]' : 'bg-slate-100 text-[#21DBA4]'}`}>1</div>
                                <div>
                                    <p className={`font-medium mb-1 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>메뉴 버튼을 탭하세요</p>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>보통 우측 상단의 점 세 개 아이콘입니다.</p>
                                    <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm ${theme === 'dark' ? 'border-slate-700 bg-slate-800 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                                        <MoreVertical size={16} /> 메뉴
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${theme === 'dark' ? 'bg-slate-800 text-[#21DBA4]' : 'bg-slate-100 text-[#21DBA4]'}`}>2</div>
                                <div>
                                    <p className={`font-medium mb-1 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>'앱 설치' 또는 '홈 화면에 추가'를 탭하세요</p>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>브라우저에 따라 문구가 다를 수 있습니다.</p>
                                    <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm ${theme === 'dark' ? 'border-slate-700 bg-slate-800 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                                        <Smartphone size={16} /> 앱 설치
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>,
        document.body
    );
};
