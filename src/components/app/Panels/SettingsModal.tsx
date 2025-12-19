import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import {
    Settings,
    X,
    User,
    Smartphone,
    Zap,
    Bell,
    Shield,
    ChevronRight,
    ChevronLeft,
    LogOut,
    Sun,
    Moon,
    Monitor,
    CreditCard,
    Download,
    Upload,
    Edit2,
    Brain,
    Image as ImageIcon,
    Lock,
    Eye,
    EyeOff,
    Keyboard,
    Key,
    ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { LinkBrainLogo } from '../LinkBrainLogo';
import { useSubscriptionContext } from '../../../context/SubscriptionContext';
import { Copy, Gift, Check as CheckIcon, Clock, Loader2 } from 'lucide-react';

interface SettingsModalProps {
    onClose: () => void;
    settings: {
        theme: 'light' | 'dark';
        themePreference: 'light' | 'dark' | 'system';
        language: 'en' | 'ko';
        showThumbnails: boolean;
        notifications: any;
    };
    setSettings: {
        setTheme: (theme: 'light' | 'dark' | 'system') => void;
        setLanguage: (lang: 'en' | 'ko') => void;
        setShowThumbnails: (show: boolean) => void;
        setNotifications: (notif: any) => void;
    };
    onLogout: () => void;
    onAdmin?: () => void;
    isAdmin?: boolean;
    t: (key: string) => string;
    user?: { uid?: string; displayName: string | null; email: string | null; photoURL: string | null } | null;
    initialTab?: string;
}

// Invite Codes Section Component
const InviteCodesSection = ({ theme, t }: { theme: string; t: (key: string) => string }) => {
    const { subscription, inviteCodes, usedCodesCount, remainingDays, isTrial, isPro } = useSubscriptionContext();
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        toast.success(t('language') === '언어' ? '코드가 복사되었습니다!' : 'Code copied!');
        setTimeout(() => setCopiedCode(null), 2000);
    };

    if (!subscription) return null;

    const extensionDays = (subscription.referralCount || 0) * 2;

    return (
        <div className={`p-4 md:p-5 rounded-2xl border ${theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Gift size={18} className="text-[#21DBA4]" />
                    <h4 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {t('language') === '언어' ? '내 초대 코드' : 'My Invite Codes'}
                    </h4>
                </div>
                {isTrial && (
                    <div className="flex items-center gap-1.5 text-xs">
                        <Clock size={12} className="text-amber-500" />
                        <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
                            {t('language') === '언어' ? `${remainingDays}일 남음` : `${remainingDays} days left`}
                            {extensionDays > 0 && (
                                <span className="text-[#21DBA4] ml-1">(+{extensionDays}일)</span>
                            )}
                        </span>
                    </div>
                )}
            </div>

            <p className={`text-xs mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {t('language') === '언어'
                    ? '친구를 초대하면 체험 기간이 2일 연장됩니다!'
                    : 'Invite friends to extend your trial by 2 days each!'}
            </p>

            <div className="space-y-2">
                {inviteCodes.map((invite: { code: string; usedBy: string | null }) => {
                    const isUsed = invite.usedBy !== null;
                    const isCopied = copiedCode === invite.code;

                    return (
                        <div
                            key={invite.code}
                            className={`flex items-center justify-between p-3 rounded-xl transition-all ${isUsed
                                ? theme === 'dark'
                                    ? 'bg-slate-700/50 opacity-60'
                                    : 'bg-slate-100 opacity-60'
                                : theme === 'dark'
                                    ? 'bg-slate-700'
                                    : 'bg-white border border-slate-200'
                                }`}
                        >
                            <code className={`font-mono text-sm font-bold tracking-wider ${isUsed
                                ? 'text-slate-400 line-through'
                                : theme === 'dark' ? 'text-white' : 'text-slate-900'
                                }`}>
                                {invite.code}
                            </code>

                            <div className="flex items-center gap-2">
                                {isUsed ? (
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${theme === 'dark' ? 'bg-slate-600 text-slate-300' : 'bg-slate-200 text-slate-500'
                                        }`}>
                                        {t('language') === '언어' ? '사용완료' : 'Used'}
                                    </span>
                                ) : (
                                    <>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${theme === 'dark' ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'
                                            }`}>
                                            {t('language') === '언어' ? '대기중' : 'Available'}
                                        </span>
                                        <button
                                            onClick={() => handleCopyCode(invite.code)}
                                            className={`p-2 rounded-lg transition-all ${isCopied
                                                ? 'bg-[#21DBA4] text-white'
                                                : theme === 'dark'
                                                    ? 'bg-slate-600 text-slate-300 hover:bg-[#21DBA4] hover:text-white'
                                                    : 'bg-slate-100 text-slate-500 hover:bg-[#21DBA4] hover:text-white'
                                                }`}
                                        >
                                            {isCopied ? <CheckIcon size={14} /> : <Copy size={14} />}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={`mt-4 pt-4 border-t flex items-center justify-between text-xs ${theme === 'dark' ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-500'
                }`}>
                <span>{t('language') === '언어' ? '초대 현황' : 'Invite Status'}</span>
                <span className="font-bold">
                    {usedCodesCount}/{inviteCodes.length} {t('language') === '언어' ? '사용됨' : 'used'}
                    {extensionDays > 0 && (
                        <span className="text-[#21DBA4] ml-2">(+{extensionDays} {t('language') === '언어' ? '일 연장' : 'days extended'})</span>
                    )}
                </span>
            </div>
        </div>
    );
};

export const SettingsModal = ({ onClose, settings, setSettings, onLogout, onAdmin, isAdmin, t, user, initialTab }: SettingsModalProps) => {
    const [activeTab, setActiveTab] = useState(initialTab || 'general');
    const { theme, language, showThumbnails, notifications } = settings;
    const { setTheme, setLanguage, setShowThumbnails, setNotifications } = setSettings;

    // Mobile View State
    const [mobileView, setMobileView] = useState<'menu' | 'content'>('menu');

    // Logout Confirmation State
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogoutConfirm = () => {
        setShowLogoutConfirm(false);
        toast.success(t('loggedOut'));
        onLogout();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center md:p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className={`w-full md:max-w-5xl h-full md:h-[80vh] md:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}
                onClick={e => e.stopPropagation()}
            >
                {/* Sidebar */}
                <div className={`w-full md:w-64 border-r flex flex-col ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'} ${mobileView === 'menu' ? 'flex h-full' : 'hidden md:flex'}`}>
                    <div className="p-6 flex items-center justify-between">
                        <h2 className={`text-xl font-black tracking-tight flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            <Settings className="text-[#21DBA4]" size={20} /> {t('settings')}
                        </h2>
                        <button onClick={onClose} className="md:hidden p-2 -mr-2 text-slate-400">
                            <X size={24} />
                        </button>
                    </div>
                    <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                        {[
                            { id: 'account', label: t('myAccount'), icon: User },
                            { id: 'security', label: t('security'), icon: Lock },
                            { id: 'general', label: t('general'), icon: Smartphone },
                            { id: 'ai', label: t('aiSettings') || 'AI Settings', icon: Brain },
                            { id: 'integrations', label: t('integrations'), icon: Zap },
                            { id: 'notifications', label: t('notifications'), icon: Bell },
                            { id: 'data', label: t('dataStorage'), icon: Shield },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => { setActiveTab(item.id); setMobileView('content'); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === item.id ? 'bg-[#21DBA4] text-white shadow-sm' : theme === 'dark' ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
                            >
                                <item.icon size={18} />
                                {item.label}
                                <ChevronRight size={16} className="ml-auto opacity-50 md:hidden" />
                            </button>
                        ))}
                    </nav>
                    <div className={`p-4 border-t mt-auto space-y-2 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                        {isAdmin && onAdmin && (
                            <button
                                onClick={() => { onClose(); onAdmin(); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${theme === 'dark' ? 'text-[#21DBA4] hover:bg-[#21DBA4]/10' : 'text-[#21DBA4] hover:bg-[#E0FBF4]'}`}
                            >
                                <ShieldCheck size={18} /> {t('language') === '언어' ? '관리자 대시보드' : 'Admin Dashboard'}
                            </button>
                        )}
                        <button onClick={() => setShowLogoutConfirm(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 hover:bg-opacity-10 transition-colors">
                            <LogOut size={18} /> {t('signOut')}
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className={`flex-1 flex flex-col h-full ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'} ${mobileView === 'content' ? 'flex' : 'hidden md:flex'}`}>
                    <div className={`h-16 border-b flex items-center justify-between px-4 md:px-8 shrink-0 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-50'}`}>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setMobileView('menu')} className="md:hidden p-1 -ml-2 text-slate-400 hover:text-slate-600">
                                <ChevronLeft size={24} />
                            </button>
                            <h3 className={`font-bold text-lg capitalize ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t(activeTab === 'data' ? 'dataStorage' : activeTab === 'account' ? 'myAccount' : activeTab)}</h3>
                        </div>
                        <button onClick={onClose} className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-50 text-slate-400'}`}>
                            <X size={20} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 md:p-8">
                        {activeTab === 'general' && (
                            <div className="max-w-xl space-y-6 md:space-y-8">
                                <div className="space-y-3 md:space-y-4">
                                    <h4 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider">{t('appearance')}</h4>
                                    <div className="grid grid-cols-3 gap-2 md:gap-3">
                                        <button onClick={() => setTheme('light')} className={`p-3 md:p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${settings.themePreference === 'light' ? 'border-[#21DBA4] bg-[#E0FBF4]/30' : 'border-slate-200 opacity-60'}`}>
                                            <Sun size={18} className={settings.themePreference === 'light' ? 'text-[#21DBA4]' : 'text-slate-400'} />
                                            <span className="text-xs font-bold text-slate-600">Light</span>
                                        </button>
                                        <button onClick={() => setTheme('dark')} className={`p-3 md:p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${settings.themePreference === 'dark' ? 'border-[#21DBA4] bg-slate-800' : 'border-slate-200 opacity-60'}`}>
                                            <Moon size={18} className={settings.themePreference === 'dark' ? 'text-[#21DBA4]' : 'text-slate-400'} />
                                            <span className="text-xs font-bold text-slate-600">Dark</span>
                                        </button>
                                        <button onClick={() => setTheme('system')} className={`p-3 md:p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${settings.themePreference === 'system' ? 'border-[#21DBA4] bg-[#E0FBF4]/30' : 'border-slate-200 opacity-60'}`}>
                                            <Monitor size={18} className={settings.themePreference === 'system' ? 'text-[#21DBA4]' : 'text-slate-400'} />
                                            <span className="text-xs font-bold text-slate-600">{t('systemTheme')}</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3 md:space-y-4">
                                    <h4 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider">{t('language')}</h4>
                                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                                        <button onClick={() => setLanguage('en')} className={`p-3 md:p-4 rounded-xl border-2 flex flex-col items-center gap-2 md:gap-3 transition-all ${language === 'en' ? 'border-[#21DBA4] bg-[#E0FBF4]/30' : 'border-slate-200 opacity-60'}`}>
                                            <svg width="59" height="59" viewBox="0 0 59 59" fill="none" className="w-8 h-8 rounded-full shadow-sm">
                                                <path d="M45.2333 4.52333C40.6117 1.67166 35.3017 0 29.5 0V4.52333H45.2333Z" fill="#ED4C5C" />
                                                <path d="M29.5 9.04664H50.74C49.0683 7.37498 47.2 5.80165 45.2333 4.52332H29.5V9.04664Z" fill="white" />
                                                <path d="M29.5 13.57H54.3783C53.2966 11.8983 52.1166 10.4233 50.8383 9.04663H29.5V13.57Z" fill="#ED4C5C" />
                                                <path d="M29.5 18.0934H56.7383C56.05 16.52 55.2633 14.9467 54.3783 13.57H29.5V18.0934Z" fill="white" />
                                                <path d="M29.5 22.6167H58.2133C57.82 21.0434 57.3283 19.5684 56.7383 18.0934H29.5V22.6167Z" fill="#ED4C5C" />
                                                <path d="M29.5 27.2383H58.9016C58.8033 25.665 58.5083 24.19 58.2133 22.715H29.5V27.2383Z" fill="white" />
                                                <path d="M58.9016 27.2383H29.5V29.4999H0C0 30.2866 -9.52432e-08 30.9749 0.0983331 31.7616H58.9016C58.9999 30.9749 58.9999 30.2866 58.9999 29.4999C58.9999 28.7133 58.9999 27.9266 58.9016 27.2383Z" fill="#ED4C5C" />
                                                <path d="M0.786843 36.285H58.2135C58.6068 34.81 58.8035 33.335 58.9018 31.7617H0.0985107C0.196844 33.2367 0.39351 34.81 0.786843 36.285Z" fill="white" />
                                                <path d="M2.2615 40.8083H56.7381C57.3281 39.3333 57.8198 37.8583 58.2131 36.285H0.786499C1.17983 37.8583 1.6715 39.3333 2.2615 40.8083Z" fill="#ED4C5C" />
                                                <path d="M4.62147 45.3316H54.3781C55.2631 43.8566 56.0498 42.3816 56.7381 40.8083H2.26147C2.94981 42.3816 3.73647 43.8566 4.62147 45.3316Z" fill="white" />
                                                <path d="M8.16195 49.8549H50.8386C52.1169 48.4783 53.3952 46.9049 54.3786 45.3316H4.62195C5.60528 47.0033 6.88361 48.4783 8.16195 49.8549Z" fill="#ED4C5C" />
                                                <path d="M13.6682 54.3782H45.3315C47.3965 53.0999 49.1665 51.5266 50.8381 49.8549H8.1615C9.83316 51.6249 11.7015 53.0999 13.6682 54.3782Z" fill="white" />
                                                <path d="M29.4999 59C35.3015 59 40.7098 57.3283 45.3315 54.3783H13.6682C18.2899 57.3283 23.6982 59 29.4999 59Z" fill="#ED4C5C" />
                                                <path d="M13.7667 4.52333C11.7017 5.80166 9.83332 7.37499 8.16166 9.04666C6.78499 10.4233 5.60499 11.9967 4.62166 13.57C3.73666 15.045 2.85166 16.52 2.26166 18.0933C1.67167 19.5683 1.18 21.0433 0.786666 22.6166C0.393333 24.0916 0.196666 25.5666 0.0983331 27.14C-9.52432e-08 27.9266 0 28.7133 0 29.5H29.5V0C23.6983 0 18.3883 1.67166 13.7667 4.52333Z" fill="#428BC1" />
                                                <path d="M22.6166 0.983337L23.1082 2.45834H24.5832L23.4032 3.44167L23.7966 4.91667L22.6166 4.03167L21.4366 4.91667L21.8299 3.44167L20.6499 2.45834H22.1249L22.6166 0.983337ZM26.5499 6.88333L27.0416 8.35833H28.5166L27.3366 9.34166L27.7299 10.8167L26.5499 9.93166L25.3699 10.8167L25.7632 9.34166L24.5832 8.35833H26.0582L26.5499 6.88333ZM18.6832 6.88333L19.1749 8.35833H20.6499L19.4699 9.34166L19.8632 10.8167L18.6832 9.93166L17.5032 10.8167L17.8966 9.34166L16.7166 8.35833H18.1916L18.6832 6.88333ZM22.6166 12.7833L23.1082 14.2583H24.5832L23.4032 15.2417L23.7966 16.7167L22.6166 15.8317L21.4366 16.7167L21.8299 15.2417L20.6499 14.2583H22.1249L22.6166 12.7833ZM14.7499 12.7833L15.2416 14.2583H16.7166L15.5366 15.2417L15.9299 16.7167L14.7499 15.8317L13.5699 16.7167L13.9632 15.2417L12.7832 14.2583H14.2582L14.7499 12.7833ZM6.88325 12.7833L7.37491 14.2583H8.84991L7.66991 15.2417L8.06325 16.7167L6.88325 15.8317L5.70325 16.7167L6.09658 15.2417L4.91658 14.2583H6.39158L6.88325 12.7833ZM26.5499 18.6833L27.0416 20.1583H28.5166L27.3366 21.1416L27.7299 22.6166L26.5499 21.7316L25.3699 22.6166L25.7632 21.1416L24.5832 20.1583H26.0582L26.5499 18.6833ZM18.6832 18.6833L19.1749 20.1583H20.6499L19.4699 21.1416L19.8632 22.6166L18.6832 21.7316L17.5032 22.6166L17.8966 21.1416L16.7166 20.1583H18.1916L18.6832 18.6833ZM10.8166 18.6833L11.3082 20.1583H12.7832L11.6032 21.1416L11.9966 22.6166L10.8166 21.7316L9.63658 22.6166L10.0299 21.1416L8.84991 20.1583H10.3249L10.8166 18.6833ZM22.6166 24.5833L23.1082 26.0583H24.5832L23.4032 27.0416L23.7966 28.5166L22.6166 27.6316L21.4366 28.5166L21.8299 27.0416L20.6499 26.0583H22.1249L22.6166 24.5833ZM14.7499 24.5833L15.2416 26.0583H16.7166L15.5366 27.0416L15.9299 28.5166L14.7499 27.6316L13.5699 28.5166L13.9632 27.0416L12.7832 26.0583H14.2582L14.7499 24.5833ZM6.88325 24.5833L7.37491 26.0583H8.84991L7.66991 27.0416L8.06325 28.5166L6.88325 27.6316L5.70325 28.5166L6.09658 27.0416L4.91658 26.0583H6.39158L6.88325 24.5833ZM9.63658 10.8167L10.8166 9.93166L11.9966 10.8167L11.5049 9.34166L12.6849 8.35833H11.2099L10.8166 6.88333L10.3249 8.35833H8.94825L10.1282 9.24333L9.63658 10.8167ZM1.76992 22.6166L2.94992 21.7316L4.12992 22.6166L3.63825 21.1416L4.81825 20.1583H3.44158L2.94992 18.6833L2.45825 20.1583H1.47492C1.47492 20.2567 1.37659 20.355 1.37659 20.4533L2.16325 21.0433L1.76992 22.6166Z" fill="white" />
                                            </svg>
                                            <span className="text-xs md:text-sm font-bold text-slate-600">{t('english')}</span>
                                        </button>
                                        <button onClick={() => setLanguage('ko')} className={`p-3 md:p-4 rounded-xl border-2 flex flex-col items-center gap-2 md:gap-3 transition-all ${language === 'ko' ? 'border-[#21DBA4] bg-[#E0FBF4]/30' : 'border-slate-200 opacity-60'}`}>
                                            <svg width="59" height="59" viewBox="0 0 59 59" fill="none" className="w-8 h-8 rounded-full shadow-sm">
                                                <path d="M29.5 58.9999C45.7924 58.9999 58.9999 45.7924 58.9999 29.5C58.9999 13.2076 45.7924 0 29.5 0C13.2076 0 0 13.2076 0 29.5C0 45.7924 13.2076 58.9999 29.5 58.9999Z" fill="#F5F5F5" />
                                                <path d="M21.0436 31.1717C23.7969 33.04 27.6319 32.2533 29.5002 29.5C31.3686 26.7467 35.1052 25.96 37.9569 27.8283C40.6119 29.5983 41.3986 33.04 39.9236 35.695C43.1686 30.1883 41.6936 23.01 36.1869 19.3717C30.5819 15.635 23.0102 17.11 19.2736 22.715C19.1753 22.9117 19.0769 23.1084 18.9786 23.2067C17.6019 26.0583 18.4869 29.4017 21.0436 31.1717Z" fill="#ED4C5C" />
                                                <path d="M37.9567 27.8283C35.2033 25.9599 31.3683 26.7466 29.5 29.4999C27.6317 32.2533 23.895 33.0399 21.0433 31.1716C18.3883 29.4016 17.6017 25.9599 19.0767 23.3049C15.7333 28.8116 17.3067 35.9899 22.8133 39.6282C28.4183 43.3649 35.99 41.8899 39.7267 36.2849C39.825 36.0883 39.9233 35.8916 40.0217 35.7933C41.3983 32.9416 40.5133 29.5983 37.9567 27.8283Z" fill="#428BC1" />
                                                <path d="M5.7032 20.945L12.4882 10.8166L11.7999 10.325L11.1115 9.93164L4.32654 20.06L5.01487 20.4533L5.7032 20.945ZM7.57153 22.2233L8.25987 22.6166L14.9465 12.4883L14.3565 12.095L13.6682 11.6033L6.8832 21.7316L7.57153 22.2233ZM16.1265 13.275L9.43987 23.4033L10.1282 23.895L10.8165 24.2883L17.5032 14.16L16.8149 13.7666L16.1265 13.275ZM45.7248 39.8249L46.4132 40.3166L49.5598 35.5966L48.8715 35.1049L48.1832 34.7116L45.0365 39.4316L45.7248 39.8249ZM53.2965 38.0549L50.1498 42.7749L50.8382 43.2666L51.5265 43.6599L54.6731 38.9399L53.9848 38.5466L53.2965 38.0549ZM48.9698 41.9883L52.1165 37.2683L51.4282 36.7766L50.7398 36.3833L47.5932 41.1033L48.2815 41.4966L48.9698 41.9883ZM45.3315 40.5133L44.6432 40.1199L41.4965 44.8399L42.1848 45.2333L42.8732 45.7249L46.0198 41.0049L45.3315 40.5133ZM47.7898 42.1849L47.1998 41.7916L44.0532 46.5116L44.6432 46.9049L45.3315 47.3966L48.4782 42.6766L47.7898 42.1849ZM49.6582 43.4633L46.5115 48.1833L47.1998 48.6749L47.8882 49.0683L51.0348 44.3483L50.3465 43.8566L49.6582 43.4633ZM5.01487 38.5466L4.32654 38.9399L11.1115 49.0683L11.7999 48.6749L12.4882 48.1833L5.7032 38.0549L5.01487 38.5466ZM11.2099 42.1849L10.5215 42.6766L13.6682 47.3966L14.3565 46.9049L14.9465 46.5116L11.7999 41.7916L11.2099 42.1849ZM10.1282 35.1049L9.43987 35.5966L16.1265 45.7249L16.8149 45.2333L17.5032 44.8399L10.8165 34.7116L10.1282 35.1049ZM6.8832 37.2683L10.0299 41.9883L10.7182 41.4966L11.4065 41.1033L8.25987 36.3833L7.57153 36.7766L6.8832 37.2683ZM50.3465 15.1433L51.0348 14.6516L47.8882 9.93164L47.1998 10.325L46.5115 10.8166L49.6582 15.5366L50.3465 15.1433ZM45.3315 18.4866L46.0198 17.995L42.8732 13.275L42.1848 13.7666L41.4965 14.16L44.6432 18.88L45.3315 18.4866ZM50.1498 16.225L53.2965 20.945L53.9848 20.4533L54.6731 20.06L51.5265 15.34L50.8382 15.7333L50.1498 16.225ZM51.4282 22.2233L52.1165 21.7316L45.3315 11.6033L44.6432 12.095L44.0532 12.4883L50.7398 22.6166L51.4282 22.2233ZM48.8715 23.895L49.5598 23.4033L46.4132 18.6833L45.7248 19.175L45.0365 19.5683L48.1832 24.2883L48.8715 23.895Z" fill="#3E4347" />
                                            </svg>
                                            <span className="text-xs md:text-sm font-bold text-slate-600">{t('korean')}</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3 md:space-y-4">
                                    <h4 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider">{t('preferences')}</h4>
                                    <div className="space-y-2 md:space-y-3">
                                        <div onClick={() => setShowThumbnails(!showThumbnails)} className={`flex items-center justify-between p-3 md:p-4 rounded-xl border cursor-pointer ${showThumbnails ? 'border-[#21DBA4]/30 bg-[#E0FBF4]/10' : theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-white'}`}>
                                            <div className="flex items-center gap-3">
                                                <ImageIcon size={18} className="text-slate-400" />
                                                <h5 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t('thumbnails')}</h5>
                                            </div>
                                            <div className={`w-9 h-5 md:w-11 md:h-6 rounded-full relative transition-colors ${showThumbnails ? 'bg-[#21DBA4]' : 'bg-slate-200'}`}>
                                                <div className={`absolute top-1 left-1 w-3 h-3 md:w-4 md:h-4 rounded-full bg-white shadow-sm transition-transform ${showThumbnails ? 'translate-x-4 md:translate-x-5' : ''}`} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Keyboard Shortcuts Section */}
                                <div className="space-y-3 md:space-y-4">
                                    <h4 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <Keyboard size={14} /> {t('keyboardShortcuts')}
                                    </h4>
                                    <div className={`space-y-2 rounded-xl border p-4 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{t('themeToggleShortcut')}</span>
                                            <kbd className={`px-2 py-1 text-xs rounded font-mono ${theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-500 border border-slate-200'}`}>⌘/Ctrl + '</kbd>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{t('thumbnailToggleShortcut')}</span>
                                            <kbd className={`px-2 py-1 text-xs rounded font-mono ${theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-500 border border-slate-200'}`}>⌘/Ctrl + /</kbd>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{t('languageToggleShortcut')}</span>
                                            <kbd className={`px-2 py-1 text-xs rounded font-mono ${theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-500 border border-slate-200'}`}>⌘/Ctrl + .</kbd>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'account' && <AccountSettings theme={theme} t={t} user={user} />}
                        {activeTab === 'security' && <SecuritySettings theme={theme} t={t} />}
                        {activeTab === 'ai' && <AISettings theme={theme} t={t} user={user} />}
                        {activeTab === 'integrations' && <IntegrationsSettings theme={theme} t={t} />}
                        {activeTab === 'notifications' && <NotificationsSettings theme={theme} t={t} notifications={notifications} setNotifications={setNotifications} />}
                        {activeTab === 'data' && <DataSettings theme={theme} t={t} />}
                    </div>
                </div>
            </motion.div>

            {/* Logout Confirmation Dialog */}
            <AnimatePresence>
                {
                    showLogoutConfirm && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50"
                            onClick={() => setShowLogoutConfirm(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className={`w-full max-w-sm p-6 rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}
                                onClick={e => e.stopPropagation()}
                            >
                                <h3 className="text-lg font-bold mb-2">{t('logoutConfirmTitle')}</h3>
                                <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{t('logoutConfirmMessage')}</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowLogoutConfirm(false)}
                                        className={`flex-1 py-2.5 rounded-xl font-bold text-sm ${theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                    >
                                        {t('cancel')}
                                    </button>
                                    <button
                                        onClick={handleLogoutConfirm}
                                        className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-red-500 text-white hover:bg-red-600"
                                    >
                                        {t('confirm')}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )
                }
            </AnimatePresence >
        </div >
    );
};

// Account Settings
const AccountSettings = ({ theme, t, user }: { theme: string; t: (key: string) => string; user?: { uid?: string; displayName: string | null; email: string | null; photoURL: string | null } | null }) => {
    // Parse display name into first/last name
    const displayName = user?.displayName || 'User';
    const nameParts = displayName.split(' ');
    const initialFirstName = nameParts[0] || '';
    const initialLastName = nameParts.slice(1).join(' ') || '';
    const email = user?.email || '';
    const photoURL = user?.photoURL;

    // Subscription data
    const { subscription, isPro, isTrial, remainingDays } = useSubscriptionContext();

    // State for editable fields
    const [firstNameInput, setFirstNameInput] = useState(initialFirstName);
    const [lastNameInput, setLastNameInput] = useState(initialLastName);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingPortal, setIsLoadingPortal] = useState(false);

    // Check if there are unsaved changes
    const hasChanges = firstNameInput !== initialFirstName || lastNameInput !== initialLastName;

    // Open Stripe Customer Portal
    const handleBillingPortal = async () => {
        if (!user?.uid) {
            toast.error('로그인이 필요합니다.');
            return;
        }
        setIsLoadingPortal(true);
        try {
            const response = await fetch('/api/payment/stripe-portal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.uid,
                    returnUrl: window.location.href,
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to open billing portal');
            if (data.url) window.location.href = data.url;
        } catch (error: any) {
            console.error('Billing portal error:', error);
            toast.error(error.message || '결제 포털을 열 수 없습니다.');
        } finally {
            setIsLoadingPortal(false);
        }
    };

    // Navigate to pricing page for upgrade
    const handleUpgrade = () => {
        window.location.href = '/#pricing';
    };

    // Format renewal date
    const formatRenewalDate = () => {
        if (subscription?.proEndDate) {
            const date = new Date(subscription.proEndDate);
            return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
        }
        return '';
    };

    const handleSaveProfile = async () => {
        if (!hasChanges) return;
        setIsSaving(true);
        try {
            const newDisplayName = `${firstNameInput} ${lastNameInput}`.trim();
            // Firebase updateProfile would go here:
            // await updateProfile(auth.currentUser, { displayName: newDisplayName });
            toast.success(t('profileUpdated'));
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-xl space-y-6 md:space-y-8">
            <div className="flex items-center gap-4 md:gap-6">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-slate-100 relative group cursor-pointer overflow-hidden border-4 border-white shadow-lg shrink-0">
                    {photoURL ? (
                        <img src={photoURL} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-500'}`}>
                            {firstNameInput.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div onClick={() => toast.info("Avatar change disabled")} className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit2 className="text-white" size={24} />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{displayName}</h4>
                    <p className="text-slate-400 text-sm truncate">{email}</p>
                    <button onClick={() => toast.info("Avatar change disabled")} className="mt-2 md:mt-3 text-xs font-bold text-[#21DBA4] border border-[#21DBA4]/30 px-3 py-1.5 rounded-full hover:bg-[#21DBA4] hover:text-white transition-all">
                        {t('changeAvatar')}
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div className="space-y-1.5 md:space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">{t('firstName')}</label>
                        <input
                            type="text"
                            value={firstNameInput}
                            onChange={(e) => setFirstNameInput(e.target.value)}
                            className={`w-full p-2.5 md:p-3 rounded-xl border outline-none transition-all font-bold text-sm ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white focus:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700 focus:bg-white focus:border-[#21DBA4]'}`}
                        />
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">{t('lastName')}</label>
                        <input
                            type="text"
                            value={lastNameInput}
                            onChange={(e) => setLastNameInput(e.target.value)}
                            className={`w-full p-2.5 md:p-3 rounded-xl border outline-none transition-all font-bold text-sm ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white focus:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-700 focus:bg-white focus:border-[#21DBA4]'}`}
                        />
                    </div>
                </div>
                <div className="space-y-1.5 md:space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">{t('email')}</label>
                    <input type="email" defaultValue={email} disabled className={`w-full p-2.5 md:p-3 rounded-xl border outline-none transition-all font-bold text-sm opacity-60 cursor-not-allowed ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`} />
                </div>

                {/* Save Button - Only visible when there are changes */}
                {hasChanges && (
                    <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="w-full py-3 bg-[#21DBA4] text-white rounded-xl font-bold text-sm hover:bg-[#1bc290] transition-colors disabled:opacity-50"
                    >
                        {isSaving ? '...' : t('saveProfile')}
                    </button>
                )}
            </div>

            {/* Invite Codes Section */}
            <InviteCodesSection theme={theme} t={t} />

            {/* Subscription Card */}
            <div className={`p-4 md:p-6 rounded-2xl relative overflow-hidden ${isPro
                ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white'
                : 'bg-gradient-to-br from-[#21DBA4] to-[#1bc290] text-white'}`}>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                            {isPro
                                ? (subscription?.isMaster ? 'MASTER' : 'PRO PLAN')
                                : (t('language') === '언어' ? '무료 체험' : 'FREE TRIAL')}
                        </span>
                        <CreditCard className="text-white/50" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-1">
                        {isPro
                            ? (subscription?.isMaster ? 'LinkBrain Master' : 'LinkBrain Pro')
                            : (t('language') === '언어' ? 'LinkBrain 무료 체험' : 'LinkBrain Free Trial')}
                    </h3>
                    <p className="text-white/70 text-xs md:text-sm mb-4 md:mb-6">
                        {isPro
                            ? (subscription?.isMaster
                                ? (t('language') === '언어' ? '모든 기능 무제한 이용' : 'Unlimited access to all features')
                                : (formatRenewalDate()
                                    ? (t('language') === '언어' ? `${formatRenewalDate()}에 갱신 예정` : `Renews on ${formatRenewalDate()}`)
                                    : (t('language') === '언어' ? '프로 플랜 이용 중' : 'Pro plan active')))
                            : (t('language') === '언어' ? `${remainingDays}일 남음` : `${remainingDays} days left`)}
                    </p>
                    {!subscription?.isMaster && (
                        <button
                            onClick={isPro ? handleBillingPortal : handleUpgrade}
                            disabled={isPro && isLoadingPortal}
                            className="bg-white text-slate-900 px-4 md:px-5 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-bold hover:bg-slate-100 whitespace-nowrap disabled:opacity-70 min-w-[100px] flex items-center justify-center gap-2"
                        >
                            {isLoadingPortal ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                isPro ? t('manageBilling') : (t('language') === '언어' ? '업그레이드' : 'Upgrade')
                            )}
                        </button>
                    )}
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
                    <LinkBrainLogo variant="white" size={150} />
                </div>
            </div>
        </div>
    );
};

// Integrations Settings - with API Key Management
const IntegrationsSettings = ({ theme, t }: { theme: string; t: (key: string) => string }) => {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [keyPrefix, setKeyPrefix] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showKey, setShowKey] = useState(false);

    // Load API key status on mount
    useEffect(() => {
        const loadKeyStatus = async () => {
            try {
                const { auth } = await import('../../../lib/firebase');
                const user = auth.currentUser;
                if (!user) return;

                const token = await user.getIdToken();
                const response = await fetch('/api/keys', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.hasKey) {
                    setKeyPrefix(data.keyPrefix);
                }
            } catch (err) {
                console.error('Failed to load API key status:', err);
            }
        };
        loadKeyStatus();
    }, []);

    const handleGenerateKey = async () => {
        setIsLoading(true);
        try {
            const { auth } = await import('../../../lib/firebase');
            const user = auth.currentUser;
            if (!user) {
                toast.error(t('loginRequired'));
                return;
            }

            const token = await user.getIdToken();
            const response = await fetch('/api/keys', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();

            if (data.success) {
                setApiKey(data.key);
                setKeyPrefix(data.keyPrefix);
                setShowKey(true);
                toast.success(t('apiKeyGenerated'));
            } else {
                toast.error(data.error || 'Failed to generate key');
            }
        } catch (err) {
            console.error('Generate key error:', err);
            toast.error(t('apiKeyGenerateFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleRevokeKey = async () => {
        setIsLoading(true);
        try {
            const { auth } = await import('../../../lib/firebase');
            const user = auth.currentUser;
            if (!user) return;

            const token = await user.getIdToken();
            const response = await fetch('/api/keys?action=revoke', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.success) {
                setApiKey(null);
                setKeyPrefix(null);
                setShowKey(false);
                toast.success(t('apiKeyRevoked'));
            }
        } catch (err) {
            toast.error(t('apiKeyGenerateFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyKey = () => {
        if (apiKey) {
            navigator.clipboard.writeText(apiKey);
            setCopied(true);
            toast.success(t('copied'));
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="max-w-xl space-y-4 md:space-y-6">
            {/* API Key Section */}
            <div className="space-y-3 md:space-y-4">
                <h4 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Key size={14} />
                    {t('apiKey')}
                </h4>

                <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    {keyPrefix || apiKey ? (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {t('currentKey')}
                                </span>
                                <span className="text-xs text-[#21DBA4] font-medium">Active</span>
                            </div>

                            <div className={`flex items-center gap-2 p-3 rounded-lg font-mono text-sm ${theme === 'dark' ? 'bg-slate-900' : 'bg-white border border-slate-200'}`}>
                                <code className={`flex-1 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                                    {apiKey && showKey ? apiKey : keyPrefix || 'lb_****...'}
                                </code>
                                {apiKey && (
                                    <>
                                        <button
                                            onClick={() => setShowKey(!showKey)}
                                            className="p-1.5 text-slate-400 hover:text-slate-600"
                                        >
                                            {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                        <button
                                            onClick={handleCopyKey}
                                            className={`p-1.5 rounded transition-colors ${copied ? 'text-[#21DBA4]' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            {copied ? <CheckIcon size={14} /> : <Copy size={14} />}
                                        </button>
                                    </>
                                )}
                            </div>

                            {apiKey && (
                                <div className={`p-3 rounded-lg text-xs ${theme === 'dark' ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-700'}`}>
                                    <strong>⚠️ Important:</strong> {t('apiKeyImportant')}
                                </div>
                            )}

                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={handleGenerateKey}
                                    disabled={isLoading}
                                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-colors ${theme === 'dark' ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                                >
                                    {t('regenerateKey')}
                                </button>
                                <button
                                    onClick={handleRevokeKey}
                                    disabled={isLoading}
                                    className="py-2 px-3 rounded-lg text-xs font-bold text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
                                >
                                    {t('revokeKey')}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                {t('apiKeyDescription')}
                            </p>
                            <button
                                onClick={handleGenerateKey}
                                disabled={isLoading}
                                className="px-6 py-2.5 bg-[#21DBA4] text-white rounded-xl text-sm font-bold hover:bg-[#1bc290] transition-colors disabled:opacity-50"
                            >
                                {isLoading ? '...' : t('generateApiKey')}
                            </button>
                        </div>
                    )}
                </div>

                {/* Usage Instructions */}
                <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <h5 className={`text-sm font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                        📱 {t('iphoneShortcuts')}
                    </h5>
                    <ol className={`text-xs space-y-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        <li>1. {t('language') === '언어' ? 'API 키를 생성하고 복사하세요' : 'Generate and copy your API key'}</li>
                        <li>2. {t('language') === '언어' ? '단축어 앱에서 새 단축어를 만드세요' : 'Create a new shortcut in the Shortcuts app'}</li>
                        <li>3. {t('language') === '언어' ? '"URL 콘텐츠 가져오기" 액션을 추가하세요' : 'Add "Get Contents of URL" action'}</li>
                        <li>4. URL: https://linkbrain.cloud/api/analyze, {t('language') === '언어' ? '방식: POST' : 'Method: POST'}</li>
                        <li>5. {t('language') === '언어' ? '헤더에 X-API-Key: [복사한 키] 추가' : 'Add header X-API-Key: [your key]'}</li>
                    </ol>
                </div>
            </div>

            {/* Existing Integrations */}
            <div className="p-3 md:p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 text-blue-700">
                <Zap size={20} className="shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm">
                    <p className="font-bold mb-0.5">{t('language') === '언어' ? '더 강력한 브레인 만들기' : 'Supercharge your Brain'}</p>
                    <p className="opacity-80 leading-relaxed">{t('language') === '언어' ? '자주 사용하는 도구를 연결하여 콘텐츠를 자동으로 가져오고 지식 베이스를 동기화하세요.' : 'Connect your favorite tools to automatically import content and sync your knowledge base.'}</p>
                </div>
            </div>

            <div className="space-y-3 md:space-y-4">
                <IntegrationCard name="Notion" icon="N" description={t('language') === '언어' ? 'Notion 데이터베이스와 저장된 링크 동기화' : 'Sync your saved links to a Notion database'} comingSoon t={t} theme={theme} />
                <IntegrationCard name="YouTube" icon="Y" description={t('language') === '언어' ? '좋아요한 동영상과 재생목록 자동 가져오기' : 'Import liked videos and playlists automatically'} comingSoon t={t} theme={theme} />
                <IntegrationCard name="Readwise" icon="R" description={t('language') === '언어' ? '글과 책에서 하이라이트 동기화' : 'Sync highlights from articles and books'} comingSoon t={t} theme={theme} />
                <IntegrationCard name="Slack" icon="S" description={t('language') === '언어' ? 'Slack 대화에서 바로 링크 저장' : 'Save links directly from Slack conversations'} comingSoon t={t} theme={theme} />
            </div>
        </div>
    );
};

// Security Settings
const SecuritySettings = ({ theme, t }: { theme: string; t: (key: string) => string }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    const handleChangePassword = () => {
        if (newPassword !== confirmPassword) {
            toast.error(t('passwordMismatch'));
            return;
        }
        if (newPassword.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }
        // Firebase password update would go here
        toast.success(t('passwordChanged'));
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="max-w-xl space-y-6 md:space-y-8">
            {/* Password Change */}
            <div className="space-y-3 md:space-y-4">
                <h4 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider">{t('changePassword')}</h4>
                <div className="space-y-3">
                    <div className="relative">
                        <input
                            type={showCurrent ? 'text' : 'password'}
                            placeholder={t('currentPassword')}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className={`w-full p-3 md:p-4 rounded-xl border outline-none text-sm font-medium pr-12 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                        />
                        <button
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            type={showNew ? 'text' : 'password'}
                            placeholder={t('newPassword')}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={`w-full p-3 md:p-4 rounded-xl border outline-none text-sm font-medium pr-12 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                        />
                        <button
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <input
                        type="password"
                        placeholder={t('confirmPassword')}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full p-3 md:p-4 rounded-xl border outline-none text-sm font-medium ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                    />
                    <button
                        onClick={handleChangePassword}
                        disabled={!currentPassword || !newPassword || !confirmPassword}
                        className="w-full py-3 md:py-4 bg-[#21DBA4] text-white rounded-xl font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1bc290] transition-colors"
                    >
                        {t('changePassword')}
                    </button>
                </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="space-y-3 md:space-y-4">
                <h4 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider">{t('twoFactorAuth')}</h4>
                <div
                    onClick={() => {
                        setTwoFactorEnabled(!twoFactorEnabled);
                        toast.info(twoFactorEnabled ? '2FA disabled' : '2FA enabled - Additional setup required');
                    }}
                    className={`flex items-center justify-between p-3 md:p-4 rounded-xl border cursor-pointer ${twoFactorEnabled ? 'border-[#21DBA4]/30 bg-[#E0FBF4]/10' : theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-white'}`}
                >
                    <div className="flex items-center gap-3">
                        <Lock size={18} className="text-slate-400" />
                        <div>
                            <h5 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t('enable2FA')}</h5>
                            <p className="text-xs text-slate-400">Add extra security to your account</p>
                        </div>
                    </div>
                    <div className={`w-9 h-5 md:w-11 md:h-6 rounded-full relative transition-colors ${twoFactorEnabled ? 'bg-[#21DBA4]' : 'bg-slate-200'}`}>
                        <div className={`absolute top-1 left-1 w-3 h-3 md:w-4 md:h-4 rounded-full bg-white shadow-sm transition-transform ${twoFactorEnabled ? 'translate-x-4 md:translate-x-5' : ''}`} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Notifications Settings
const NotificationsSettings = ({ theme, t, notifications, setNotifications }: { theme: string; t: (key: string) => string; notifications: any; setNotifications: (n: any) => void }) => (
    <div className="max-w-xl space-y-6 md:space-y-8">
        <div className="space-y-3 md:space-y-4">
            <h4 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider">{t('notifications')}</h4>
            <div className="space-y-2 md:space-y-3">
                <ToggleOption
                    label={t('weeklyDigest')}
                    description="A summary of your top saved content every Monday"
                    checked={notifications?.weeklyDigest}
                    onToggle={() => setNotifications({ ...notifications, weeklyDigest: !notifications.weeklyDigest })}
                    theme={theme}
                />
                <ToggleOption
                    label={t('productUpdates')}
                    description="News about new features and improvements"
                    checked={notifications?.productUpdates}
                    onToggle={() => setNotifications({ ...notifications, productUpdates: !notifications.productUpdates })}
                    theme={theme}
                />
                <ToggleOption label={t('securityAlerts')} description="Important alerts about your account security" checked disabled theme={theme} />
            </div>
        </div>
    </div>
);

// Data Settings
const DataSettings = ({ theme, t }: { theme: string; t: (key: string) => string }) => (
    <div className="max-w-xl space-y-6 md:space-y-8">
        <div className="space-y-3 md:space-y-4">
            <h4 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider">Export & Import</h4>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
                <button onClick={() => toast.success("Export started...")} className={`p-4 md:p-6 rounded-2xl border transition-all flex flex-col items-center text-center gap-2 md:gap-3 group ${theme === 'dark' ? 'border-slate-700 hover:border-[#21DBA4] hover:bg-[#21DBA4]/10' : 'border-slate-200 hover:border-[#21DBA4] hover:bg-[#E0FBF4]/10'}`}>
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-slate-800 text-slate-400 group-hover:bg-[#21DBA4] group-hover:text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-[#21DBA4] group-hover:text-white'}`}>
                        <Download size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div>
                        <h5 className={`font-bold text-sm md:text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('exportData')}</h5>
                        <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">JSON / CSV</p>
                    </div>
                </button>
                <button onClick={() => toast.info("Import feature coming soon")} className={`p-4 md:p-6 rounded-2xl border transition-all flex flex-col items-center text-center gap-2 md:gap-3 group ${theme === 'dark' ? 'border-slate-700 hover:border-[#21DBA4] hover:bg-[#21DBA4]/10' : 'border-slate-200 hover:border-[#21DBA4] hover:bg-[#E0FBF4]/10'}`}>
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-slate-800 text-slate-400 group-hover:bg-[#21DBA4] group-hover:text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-[#21DBA4] group-hover:text-white'}`}>
                        <Upload size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div>
                        <h5 className={`font-bold text-sm md:text-base ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('importData')}</h5>
                        <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">Bookmarks</p>
                    </div>
                </button>
            </div>
        </div>

        <div className={`pt-6 md:pt-8 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
            <h4 className={`text-xs md:text-sm font-bold uppercase tracking-wider mb-3 md:mb-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}>{t('dangerZone')}</h4>
            <button onClick={() => toast.error("Account deletion is disabled in demo")} className={`w-full p-3 md:p-4 rounded-xl font-bold flex items-center justify-between transition-colors text-sm md:text-base ${theme === 'dark' ? 'bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10' : 'border border-red-200 bg-red-50 text-red-600 hover:bg-red-100'}`}>
                <span>{t('deleteAccount')}</span>
                <ChevronRight size={16} />
            </button>
        </div>
    </div>
);

// Toggle Option Component
const ToggleOption = ({ label, description, checked, disabled, onToggle, theme }: any) => (
    <div onClick={() => !disabled && (onToggle ? onToggle() : toast.success("Setting updated"))} className={`flex items-center justify-between p-3 md:p-4 rounded-xl border cursor-pointer ${checked ? 'border-[#21DBA4]/30 bg-[#E0FBF4]/10' : theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-white'} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex-1 mr-4">
            <h5 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{label}</h5>
            {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
        </div>
        <div className={`w-9 h-5 md:w-11 md:h-6 rounded-full relative transition-colors flex-shrink-0 ${checked ? 'bg-[#21DBA4]' : 'bg-slate-200'}`}>
            <div className={`absolute top-1 left-1 w-3 h-3 md:w-4 md:h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-4 md:translate-x-5' : ''}`} />
        </div>
    </div>
);

// Integration Card Component
const IntegrationCard = ({ name, icon, description, connected, comingSoon, t, theme }: any) => (
    <div className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl border transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700 hover:bg-slate-750' : 'bg-white border-slate-100 hover:shadow-md'}`}>
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm md:text-lg flex-shrink-0">
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <h5 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{name}</h5>
            <p className="text-xs text-slate-400 truncate md:whitespace-normal">{description}</p>
        </div>
        <button
            onClick={() => !comingSoon && toast.success(connected ? "Disconnected" : "Connected!")}
            disabled={comingSoon}
            className={`px-3 md:px-4 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${comingSoon
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : connected
                    ? 'bg-slate-100 text-slate-600'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
        >
            {comingSoon ? t('comingSoon') : (connected ? t('connected') : t('connect'))}
        </button>
    </div>
);

// AI Settings Component - Using REAL OpenAI API model names
const AI_MODELS = {
    openai: [
        // GPT-5 시리즈 (정확한 API 모델명)
        { id: 'gpt-5.2-pro', name: 'GPT-5.2 Pro (최상위 지능)' },
        { id: 'gpt-5.2-chat-latest', name: 'GPT-5.2 Chat Latest (최신)' },
        { id: 'gpt-5.2', name: 'GPT-5.2 (기본)' },
        // GPT-4 시리즈
        { id: 'gpt-4o', name: 'GPT-4o (멀티모달 통합)' },
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini (범용)' },
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
        { id: 'gpt-4', name: 'GPT-4' },
        // 레거시
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo (빠름)' },
    ],
    gemini: [
        // Gemini 2.5 시리즈
        { id: 'gemini-2.5-pro-preview-05-06', name: 'Gemini 2.5 Pro Preview' },
        { id: 'gemini-2.5-flash-preview-05-20', name: 'Gemini 2.5 Flash Preview' },
        // Gemini 2.0 시리즈
        { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
        { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash Exp' },
        // Gemini 1.5 시리즈
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (안정적)' },
        { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (빠름)' },
    ]
};

const API_LINKS = {
    openai: {
        url: 'https://platform.openai.com/api-keys',
        name: 'OpenAI Platform'
    },
    gemini: {
        url: 'https://aistudio.google.com/app/apikey',
        name: 'Google AI Studio'
    }
};

const AISettings = ({ theme, t, user }: { theme: 'light' | 'dark', t: (key: string) => string, user?: any }) => {
    // Separate state for each provider
    const [openaiApiKey, setOpenaiApiKey] = useState(() => localStorage.getItem('openai_api_key') || '');
    const [openaiModel, setOpenaiModel] = useState(() => localStorage.getItem('openai_model') || 'gpt-4o');
    const [showOpenaiKey, setShowOpenaiKey] = useState(false);
    const [openaiStatus, setOpenaiStatus] = useState<'idle' | 'validating' | 'active' | 'inactive'>(() => {
        return localStorage.getItem('openai_status') as any || 'idle';
    });

    const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
    const [geminiModel, setGeminiModel] = useState(() => localStorage.getItem('gemini_model') || 'gemini-1.5-pro');
    const [showGeminiKey, setShowGeminiKey] = useState(false);
    const [geminiStatus, setGeminiStatus] = useState<'idle' | 'validating' | 'active' | 'inactive'>(() => {
        return localStorage.getItem('gemini_status') as any || 'idle';
    });

    const [activeProvider, setActiveProvider] = useState<'openai' | 'gemini'>(() => {
        return (localStorage.getItem('ai_provider') as 'openai' | 'gemini') || 'gemini';
    });

    // Load from Firestore
    useEffect(() => {
        if (!user) return;
        const loadSettings = async () => {
            try {
                const docRef = doc(db, 'users', user.uid, 'settings', 'ai');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();

                    if (data.openaiApiKey) {
                        setOpenaiApiKey(data.openaiApiKey);
                        localStorage.setItem('openai_api_key', data.openaiApiKey);
                    }
                    if (data.openaiModel) {
                        setOpenaiModel(data.openaiModel);
                        localStorage.setItem('openai_model', data.openaiModel);
                    }

                    if (data.geminiApiKey) {
                        setGeminiApiKey(data.geminiApiKey);
                        localStorage.setItem('gemini_api_key', data.geminiApiKey);
                    }
                    if (data.geminiModel) {
                        setGeminiModel(data.geminiModel);
                        localStorage.setItem('gemini_model', data.geminiModel);
                    }

                    if (data.activeProvider) {
                        setActiveProvider(data.activeProvider as any);
                        localStorage.setItem('ai_provider', data.activeProvider);
                    }

                    // Restore active status checks if keys exist
                    if (data.openaiApiKey && data.openaiStatus === 'active') {
                        setOpenaiStatus('active');
                        localStorage.setItem('openai_status', 'active');
                    }
                    if (data.geminiApiKey && data.geminiStatus === 'active') {
                        setGeminiStatus('active');
                        localStorage.setItem('gemini_status', 'active');
                    }
                }
            } catch (err) {
                console.error("Error loading AI settings:", err);
            }
        };
        loadSettings();
    }, [user]);

    // Import validation function dynamically
    const validateAndSaveOpenai = async () => {
        if (!openaiApiKey || openaiApiKey.length < 10) {
            toast.error('API 키가 올바르지 않습니다.');
            return;
        }

        setOpenaiStatus('validating');

        try {
            // Dynamic import to avoid circular dependencies
            const { validateApiKey } = await import('../../../lib/aiService');
            const result = await validateApiKey('openai', openaiApiKey, openaiModel);

            if (result.success) {
                localStorage.setItem('openai_api_key', openaiApiKey);
                localStorage.setItem('openai_model', openaiModel);
                localStorage.setItem('openai_status', 'active');
                localStorage.setItem('ai_provider', 'openai');
                localStorage.setItem('ai_api_key', openaiApiKey);
                localStorage.setItem('ai_model', openaiModel);
                setOpenaiStatus('active');
                setActiveProvider('openai');

                if (user) {
                    await setDoc(doc(db, 'users', user.uid, 'settings', 'ai'), {
                        openaiApiKey,
                        openaiModel,
                        openaiStatus: 'active',
                        activeProvider: 'openai',
                        updatedAt: new Date().toISOString()
                    }, { merge: true });
                }

                toast.success('✅ OpenAI API 연결 성공!');
            } else {
                localStorage.setItem('openai_status', 'inactive');
                setOpenaiStatus('inactive');
                toast.error(`❌ OpenAI 연결 실패: ${result.error || 'API 키를 확인해주세요'}`);
            }
        } catch (error: any) {
            localStorage.setItem('openai_status', 'inactive');
            setOpenaiStatus('inactive');
            toast.error(`❌ 연결 오류: ${error.message}`);
        }
    };

    const validateAndSaveGemini = async () => {
        if (!geminiApiKey || geminiApiKey.length < 10) {
            toast.error('API 키가 올바르지 않습니다.');
            return;
        }

        setGeminiStatus('validating');

        try {
            const { validateApiKey } = await import('../../../lib/aiService');
            const result = await validateApiKey('gemini', geminiApiKey, geminiModel);

            if (result.success) {
                localStorage.setItem('gemini_api_key', geminiApiKey);
                localStorage.setItem('gemini_model', geminiModel);
                localStorage.setItem('gemini_status', 'active');
                localStorage.setItem('ai_provider', 'gemini');
                localStorage.setItem('ai_api_key', geminiApiKey);
                localStorage.setItem('ai_model', geminiModel);
                setGeminiStatus('active');
                setActiveProvider('gemini');

                if (user) {
                    await setDoc(doc(db, 'users', user.uid, 'settings', 'ai'), {
                        geminiApiKey,
                        geminiModel,
                        geminiStatus: 'active',
                        activeProvider: 'gemini',
                        updatedAt: new Date().toISOString()
                    }, { merge: true });
                }

                toast.success('✅ Gemini API 연결 성공!');
            } else {
                localStorage.setItem('gemini_status', 'inactive');
                setGeminiStatus('inactive');
                toast.error(`❌ Gemini 연결 실패: ${result.error || 'API 키를 확인해주세요'}`);
            }
        } catch (error: any) {
            localStorage.setItem('gemini_status', 'inactive');
            setGeminiStatus('inactive');
            toast.error(`❌ 연결 오류: ${error.message}`);
        }
    };

    const clearOpenai = async () => {
        localStorage.removeItem('openai_api_key');
        localStorage.removeItem('openai_model');
        localStorage.removeItem('openai_status');
        setOpenaiApiKey('');
        setOpenaiModel('gpt-5.2');
        setOpenaiStatus('idle');
        if (activeProvider === 'openai') {
            localStorage.removeItem('ai_api_key');
            localStorage.removeItem('ai_model');
        }

        if (user) {
            try {
                await setDoc(doc(db, 'users', user.uid, 'settings', 'ai'), {
                    openaiApiKey: '',
                    openaiStatus: 'idle'
                }, { merge: true });
            } catch (e) {
                console.error("Error clearing Firestore settings", e);
            }
        }

        toast.success('OpenAI 설정이 초기화되었습니다.');
    };

    const clearGemini = async () => {
        localStorage.removeItem('gemini_api_key');
        localStorage.removeItem('gemini_model');
        localStorage.removeItem('gemini_status');
        setGeminiApiKey('');
        setGeminiModel('gemini-3-pro');
        setGeminiStatus('idle');
        if (activeProvider === 'gemini') {
            localStorage.removeItem('ai_api_key');
            localStorage.removeItem('ai_model');
        }

        if (user) {
            try {
                await setDoc(doc(db, 'users', user.uid, 'settings', 'ai'), {
                    geminiApiKey: '',
                    geminiStatus: 'idle'
                }, { merge: true });
            } catch (e) {
                console.error("Error clearing Firestore settings", e);
            }
        }

        toast.success('Gemini 설정이 초기화되었습니다.');
    };

    const isOpenaiConfigured = openaiApiKey.length > 10;
    const isGeminiConfigured = geminiApiKey.length > 10;
    const isAnyActive = openaiStatus === 'active' || geminiStatus === 'active';

    const getStatusBadge = (status: string, isActive: boolean) => {
        if (status === 'validating') {
            return <span className="ml-auto px-2 py-1 text-xs font-bold bg-amber-500 text-white rounded-full animate-pulse">검증 중...</span>;
        }
        if (status === 'active' && isActive) {
            return <span className="ml-auto px-2 py-1 text-xs font-bold bg-[#21DBA4] text-white rounded-full">Active</span>;
        }
        if (status === 'inactive') {
            return <span className="ml-auto px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full">Inactive</span>;
        }
        return null;
    };

    return (
        <div className="max-w-xl space-y-6 md:space-y-8">
            {/* Status Banner */}
            <div className={`p-4 rounded-xl flex items-center gap-3 ${isAnyActive ? 'bg-[#21DBA4]/10 border border-[#21DBA4]/30' : theme === 'dark' ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAnyActive ? 'bg-[#21DBA4] text-white' : 'bg-amber-500 text-white'}`}>
                    <Brain size={20} />
                </div>
                <div className="flex-1">
                    <h5 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {isAnyActive ? 'AI 기능 활성화됨' : 'AI 기능 비활성화'}
                    </h5>
                    <p className="text-xs text-slate-400">
                        {isAnyActive
                            ? `현재 활성화된 제공자: ${activeProvider === 'openai' ? 'OpenAI' : 'Google Gemini'}`
                            : 'API 키를 입력하고 연결을 확인하세요'}
                    </p>
                </div>
            </div>

            {/* OpenAI Section */}
            <div className={`p-4 rounded-2xl border-2 transition-all ${openaiStatus === 'active' && activeProvider === 'openai' ? 'border-[#21DBA4] bg-[#E0FBF4]/10' : openaiStatus === 'inactive' ? 'border-red-500/50 bg-red-50/10' : theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white border text-slate-900'}`}>
                        <svg role="img" viewBox="0 0 64 65" fill="none" className="w-5 h-5">
                            <path d="M59.7961 26.5503C60.5214 24.3656 60.7723 22.0513 60.5319 19.7619C60.2915 17.4726 59.5654 15.2609 58.4021 13.2745C54.863 7.11428 47.75 3.94553 40.8033 5.43453C38.8799 3.295 36.4273 1.69923 33.692 0.807495C30.9566 -0.0842431 28.0348 -0.24056 25.22 0.354245C22.4051 0.94905 19.7963 2.27403 17.6556 4.19613C15.5148 6.11823 13.9175 8.56976 13.0241 11.3045C10.7685 11.7671 8.63766 12.7058 6.77391 14.0578C4.91016 15.4098 3.35643 17.144 2.21655 19.1445C-1.36095 25.295 -0.548699 33.053 4.2248 38.3295C3.49674 40.5131 3.24334 42.827 3.48154 45.1165C3.71974 47.4059 4.44406 49.6181 5.60605 51.605C9.14955 57.7675 16.2671 60.936 23.2176 59.445C24.7457 61.1658 26.6234 62.5408 28.7252 63.4782C30.8271 64.4156 33.1047 64.8939 35.406 64.881C42.5263 64.8873 48.8345 60.2908 51.0095 53.5108C53.2648 53.0474 55.3952 52.1084 57.2588 50.7565C59.1224 49.4046 60.6763 47.6708 61.8168 45.6708C65.351 39.5313 64.5356 31.8153 59.7961 26.5503ZM35.406 60.6345C32.564 60.639 29.811 59.6428 27.6298 57.8208L28.0136 57.6033L40.931 50.147C41.2525 49.9584 41.5193 49.6894 41.7055 49.3666C41.8916 49.0437 41.9906 48.678 41.9928 48.3053V30.0928L47.454 33.2518C47.5085 33.2795 47.5466 33.3318 47.5563 33.3925V48.4843C47.5423 55.1888 42.1105 60.6205 35.406 60.6345ZM9.28955 49.482C7.86433 47.0209 7.35258 44.136 7.8443 41.3348L8.2278 41.565L21.1583 49.0215C21.4782 49.2092 21.8425 49.3082 22.2134 49.3082C22.5844 49.3082 22.9486 49.2092 23.2686 49.0215L39.0638 39.9153V46.2205C39.0623 46.2532 39.0535 46.2851 39.038 46.3139C39.0225 46.3427 39.0008 46.3676 38.9743 46.3868L25.8906 53.9328C20.0763 57.2823 12.6481 55.2905 9.28955 49.482ZM5.8873 21.3445C7.32254 18.8676 9.58788 16.9784 12.2823 16.0113V31.3588C12.2775 31.7296 12.3723 32.0949 12.5567 32.4166C12.7412 32.7383 13.0086 33.0046 13.3311 33.1878L29.0496 42.2558L23.5883 45.4148C23.5588 45.4304 23.5258 45.4386 23.4924 45.4386C23.459 45.4386 23.4261 45.4304 23.3966 45.4148L10.3383 37.882C4.53555 34.5185 2.54555 27.096 5.8873 21.2808V21.3445ZM50.7538 31.7683L34.9838 22.6108L40.4325 19.4645C40.4621 19.4489 40.4951 19.4407 40.5285 19.4407C40.562 19.4407 40.595 19.4489 40.6245 19.4645L53.6828 27.0105C55.6794 28.1626 57.3071 29.8588 58.3758 31.9013C59.4445 33.9437 59.9102 36.248 59.7184 38.5451C59.5267 40.8423 58.6854 43.0375 57.2928 44.8744C55.9002 46.7113 54.0138 48.1142 51.8538 48.9193V33.5715C51.8426 33.2014 51.7353 32.8405 51.5424 32.5243C51.3496 32.2082 51.0778 31.9476 50.7538 31.7683ZM56.1893 23.5958L55.8055 23.3653L42.9008 15.845C42.5789 15.6562 42.2125 15.5566 41.8393 15.5566C41.4661 15.5566 41.0997 15.6562 40.7778 15.845L24.9951 24.9515V18.6463C24.9918 18.6142 24.9972 18.5819 25.0107 18.5527C25.0242 18.5234 25.0453 18.4983 25.0718 18.48L38.1301 10.9468C40.1314 9.79385 42.4196 9.23458 44.7271 9.3344C47.0347 9.43422 49.2661 10.189 51.1604 11.5104C53.0547 12.8319 54.5336 14.6654 55.4241 16.7965C56.3146 18.9276 56.5799 21.2682 56.189 23.5445L56.1893 23.5958ZM22.0153 34.7738L16.5541 31.6275C16.5268 31.611 16.5034 31.5887 16.4857 31.5622C16.468 31.5357 16.4563 31.5056 16.4516 31.474V16.4208C16.4546 14.1115 17.115 11.8508 18.3555 9.90299C19.596 7.95519 21.3653 6.40078 23.4567 5.4215C25.5481 4.44223 27.875 4.07856 30.1654 4.37301C32.4559 4.66746 34.6151 5.60787 36.3908 7.08428L36.007 7.30178L23.0896 14.758C22.7682 14.9467 22.5013 15.2157 22.3153 15.5385C22.1292 15.8614 22.0302 16.2271 22.0281 16.5998L22.0153 34.7738ZM24.9823 28.3788L32.0168 24.3245L39.0638 28.379V36.4875L32.0423 40.542L24.9953 36.4875L24.9823 28.3788Z" fill="currentColor" />
                        </svg>
                    </div>
                    <div>
                        <h4 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>OpenAI</h4>
                        <p className="text-xs text-slate-400">GPT-5.2, GPT-4o 모델 지원</p>
                    </div>
                    {getStatusBadge(openaiStatus, activeProvider === 'openai')}
                </div>

                {/* OpenAI API Key */}
                <div className="space-y-2 mb-3">
                    <label className="text-xs font-medium text-slate-400">API Key</label>
                    <div className="relative">
                        <input
                            type={showOpenaiKey ? 'text' : 'password'}
                            value={openaiApiKey}
                            onChange={(e) => { setOpenaiApiKey(e.target.value); setOpenaiStatus('idle'); }}
                            placeholder="sk-..."
                            className={`w-full h-11 rounded-xl px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#21DBA4]/30 ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-900'} border`}
                        />
                        <button onClick={() => setShowOpenaiKey(!showOpenaiKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            {showOpenaiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    <a href={API_LINKS.openai.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-[#21DBA4] hover:underline font-bold">
                        <Key size={12} />
                        OpenAI Platform에서 API 키 발급받기
                    </a>
                </div>

                {/* OpenAI Model */}
                <div className="space-y-2 mb-4">
                    <label className="text-xs font-medium text-slate-400">Model</label>
                    <select
                        value={openaiModel}
                        onChange={(e) => setOpenaiModel(e.target.value)}
                        className={`w-full h-11 rounded-xl px-4 text-sm cursor-pointer ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-900'} border`}
                    >
                        {AI_MODELS.openai.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                </div>

                {/* OpenAI Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={validateAndSaveOpenai}
                        disabled={!openaiApiKey || openaiStatus === 'validating'}
                        className={`flex-1 h-10 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${openaiStatus === 'validating' ? 'bg-amber-500 text-white' : 'bg-[#21DBA4] text-white hover:bg-[#1bc290]'}`}
                    >
                        {openaiStatus === 'validating' ? '연결 확인 중...' : openaiStatus === 'active' ? '연결됨 ✓' : '연결 및 저장'}
                    </button>
                    {isOpenaiConfigured && (
                        <button onClick={clearOpenai} className={`px-4 h-10 rounded-xl font-bold text-sm ${theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
                            초기화
                        </button>
                    )}
                </div>
            </div>

            {/* Gemini Section */}
            <div className={`p-4 rounded-2xl border-2 transition-all ${geminiStatus === 'active' && activeProvider === 'gemini' ? 'border-[#21DBA4] bg-[#E0FBF4]/10' : geminiStatus === 'inactive' ? 'border-red-500/50 bg-red-50/10' : theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                        <svg role="img" viewBox="0 0 64 70" fill="none" className="w-5 h-5">
                            <path d="M32 0C34.4768 0 35.0368 2.2752 35.7536 4.1344C36.2336 5.3728 36.928 7.0848 37.7984 8.9664C39.5872 12.8384 41.9392 17.0496 44.4448 19.5584C46.9504 22.0608 51.1648 24.416 55.0304 26.2016C56.9152 27.072 58.6272 27.7696 59.8656 28.2496C61.68 28.9472 64 29.6256 64 32C64 34.4768 61.7248 35.0368 59.8656 35.7536C58.6272 36.2336 56.9152 36.928 55.0336 37.7984C51.1616 39.5872 46.9504 41.9392 44.4416 44.4448C41.9392 46.9504 39.5872 51.1648 37.7984 55.0304C37.0669 56.621 36.3839 58.2335 35.7504 59.8656C35.04 61.7152 34.4608 64 32 64C29.5648 64 28.9568 61.7024 28.2464 59.8656C27.6158 58.2338 26.9338 56.6224 26.2016 55.0336C24.416 51.1616 22.0608 46.9504 19.5552 44.4416C17.0496 41.9392 12.8352 39.5872 8.9696 37.7984C7.37982 37.065 5.76728 36.382 4.1344 35.7504C2.2784 35.04 0 34.4768 0 32C0 29.5232 2.2752 28.9632 4.1344 28.2464C5.3728 27.7664 7.0848 27.072 8.9664 26.2016C12.8384 24.416 17.0496 22.0608 19.5584 19.5552C22.0608 17.0496 24.416 12.8352 26.2016 8.9696C27.072 7.0848 27.7696 5.3728 28.2496 4.1344C28.9504 2.3008 29.552 0 32 0Z" fill="currentColor" />
                        </svg>
                    </div>
                    <div>
                        <h4 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Google Gemini</h4>
                        <p className="text-xs text-slate-400">Gemini 3 Pro, 2.5 Pro 모델 지원</p>
                    </div>
                    {getStatusBadge(geminiStatus, activeProvider === 'gemini')}
                </div>

                {/* Gemini API Key */}
                <div className="space-y-2 mb-3">
                    <label className="text-xs font-medium text-slate-400">API Key</label>
                    <div className="relative">
                        <input
                            type={showGeminiKey ? 'text' : 'password'}
                            value={geminiApiKey}
                            onChange={(e) => { setGeminiApiKey(e.target.value); setGeminiStatus('idle'); }}
                            placeholder="AIza..."
                            className={`w-full h-11 rounded-xl px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#21DBA4]/30 ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-900'} border`}
                        />
                        <button onClick={() => setShowGeminiKey(!showGeminiKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            {showGeminiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    <a href={API_LINKS.gemini.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-[#21DBA4] hover:underline font-bold">
                        <Key size={12} />
                        Google AI Studio에서 API 키 발급받기
                    </a>
                </div>

                {/* Gemini Model */}
                <div className="space-y-2 mb-4">
                    <label className="text-xs font-medium text-slate-400">Model</label>
                    <select
                        value={geminiModel}
                        onChange={(e) => setGeminiModel(e.target.value)}
                        className={`w-full h-11 rounded-xl px-4 text-sm cursor-pointer ${theme === 'dark' ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-200 text-slate-900'} border`}
                    >
                        {AI_MODELS.gemini.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                </div>

                {/* Gemini Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={validateAndSaveGemini}
                        disabled={!geminiApiKey || geminiStatus === 'validating'}
                        className={`flex-1 h-10 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${geminiStatus === 'validating' ? 'bg-amber-500 text-white' : 'bg-[#21DBA4] text-white hover:bg-[#1bc290]'}`}
                    >
                        {geminiStatus === 'validating' ? '연결 확인 중...' : geminiStatus === 'active' ? '연결됨 ✓' : '연결 및 저장'}
                    </button>
                    {isGeminiConfigured && (
                        <button onClick={clearGemini} className={`px-4 h-10 rounded-xl font-bold text-sm ${theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
                            초기화
                        </button>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <h5 className={`font-bold text-sm mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {t('aiFeatures') || 'AI Features'}
                </h5>
                <ul className="text-xs text-slate-400 space-y-1">
                    <li>• AI 인사이트 리포트 - 저장된 콘텐츠 요약 분석</li>
                    <li>• AI 아티클 - 오리지널 콘텐츠 자동 생성</li>
                    <li>• AI 채팅 - 저장된 콘텐츠에 대해 질문하기</li>
                </ul>
            </div>
        </div>
    );
};
