import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
    Keyboard
} from 'lucide-react';
import { toast } from 'sonner';
import { LinkBrainLogo } from '../LinkBrainLogo';

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
    t: (key: string) => string;
    user?: { displayName: string | null; email: string | null; photoURL: string | null } | null;
}

export const SettingsModal = ({ onClose, settings, setSettings, onLogout, t, user }: SettingsModalProps) => {
    const [activeTab, setActiveTab] = useState('general');
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
                    <div className={`p-4 border-t mt-auto ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
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
                                            <span className="text-xl md:text-2xl">🇺🇸</span>
                                            <span className="text-xs md:text-sm font-bold text-slate-600">{t('english')}</span>
                                        </button>
                                        <button onClick={() => setLanguage('ko')} className={`p-3 md:p-4 rounded-xl border-2 flex flex-col items-center gap-2 md:gap-3 transition-all ${language === 'ko' ? 'border-[#21DBA4] bg-[#E0FBF4]/30' : 'border-slate-200 opacity-60'}`}>
                                            <span className="text-xl md:text-2xl">🇰🇷</span>
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
                        {activeTab === 'ai' && <AISettings theme={theme} t={t} />}
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
const AccountSettings = ({ theme, t, user }: { theme: string; t: (key: string) => string; user?: { displayName: string | null; email: string | null; photoURL: string | null } | null }) => {
    // Parse display name into first/last name
    const displayName = user?.displayName || 'User';
    const nameParts = displayName.split(' ');
    const initialFirstName = nameParts[0] || '';
    const initialLastName = nameParts.slice(1).join(' ') || '';
    const email = user?.email || '';
    const photoURL = user?.photoURL;

    // State for editable fields
    const [firstNameInput, setFirstNameInput] = useState(initialFirstName);
    const [lastNameInput, setLastNameInput] = useState(initialLastName);
    const [isSaving, setIsSaving] = useState(false);

    // Check if there are unsaved changes
    const hasChanges = firstNameInput !== initialFirstName || lastNameInput !== initialLastName;

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

            <div className="p-4 md:p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-white relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">PRO PLAN</span>
                        <CreditCard className="text-white/50" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-1">LinkBrain Pro</h3>
                    <p className="text-slate-400 text-xs md:text-sm mb-4 md:mb-6">Renews on Oct 24, 2025</p>
                    <div className="flex gap-2 md:gap-3">
                        <button onClick={() => toast.info("Redirecting to billing portal...")} className="bg-white text-slate-900 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-bold hover:bg-slate-100 whitespace-nowrap">{t('manageBilling')}</button>
                        <button onClick={() => toast.info("Please contact support to cancel")} className="text-white/70 hover:text-white px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-bold whitespace-nowrap">{t('cancelPlan')}</button>
                    </div>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
                    <LinkBrainLogo variant="white" size={150} />
                </div>
            </div>
        </div>
    );
};

// Integrations Settings
const IntegrationsSettings = ({ theme, t }: { theme: string; t: (key: string) => string }) => (
    <div className="max-w-xl space-y-4 md:space-y-6">
        <div className="p-3 md:p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 text-blue-700 mb-4 md:mb-6">
            <Zap size={20} className="shrink-0 mt-0.5" />
            <div className="text-xs md:text-sm">
                <p className="font-bold mb-0.5">Supercharge your Brain</p>
                <p className="opacity-80 leading-relaxed">Connect your favorite tools to automatically import content and sync your knowledge base.</p>
            </div>
        </div>

        <div className="space-y-3 md:space-y-4">
            <IntegrationCard name="Notion" icon="N" description="Sync your saved links to a Notion database" comingSoon t={t} theme={theme} />
            <IntegrationCard name="YouTube" icon="Y" description="Import liked videos and playlists automatically" comingSoon t={t} theme={theme} />
            <IntegrationCard name="Readwise" icon="R" description="Sync highlights from articles and books" comingSoon t={t} theme={theme} />
            <IntegrationCard name="Slack" icon="S" description="Save links directly from Slack conversations" comingSoon t={t} theme={theme} />
        </div>
    </div>
);

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

// AI Settings Component
const AI_MODELS = {
    openai: [
        { id: 'gpt-4o', name: 'GPT-4o (Recommended)' },
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
        { id: 'gpt-4.1', name: 'GPT-4.1' },
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
        { id: 'o3', name: 'o3' },
        { id: 'o4-mini', name: 'o4-mini' },
        { id: 'gpt-5.1-instant', name: 'GPT-5.1 Instant' },
        { id: 'gpt-5.1-thinking', name: 'GPT-5.1 Thinking' },
        { id: 'gpt-5-instant', name: 'GPT-5 Instant' },
        { id: 'gpt-5-thinking-mini', name: 'GPT-5 Thinking Mini' },
        { id: 'gpt-5-thinking', name: 'GPT-5 Thinking' },
    ],
    gemini: [
        { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash' },
        { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
        { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro (Recommended)' },
        { id: 'gemini-3.0-flash', name: 'Gemini 3.0 Flash' },
        { id: 'gemini-3.0-pro', name: 'Gemini 3.0 Pro' },
        { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
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

const AISettings = ({ theme, t }: { theme: 'light' | 'dark', t: (key: string) => string }) => {
    const [provider, setProvider] = useState<'openai' | 'gemini'>(() => {
        return (localStorage.getItem('ai_provider') as 'openai' | 'gemini') || 'gemini';
    });
    const [apiKey, setApiKey] = useState(() => localStorage.getItem('ai_api_key') || '');
    const [model, setModel] = useState(() => localStorage.getItem('ai_model') || '');
    const [showKey, setShowKey] = useState(false);

    const saveSettings = () => {
        localStorage.setItem('ai_provider', provider);
        localStorage.setItem('ai_api_key', apiKey);
        localStorage.setItem('ai_model', model);
        toast.success(t('aiSettingsSaved') || 'AI settings saved!');
    };

    const clearSettings = () => {
        localStorage.removeItem('ai_provider');
        localStorage.removeItem('ai_api_key');
        localStorage.removeItem('ai_model');
        setApiKey('');
        setModel('');
        toast.success(t('aiSettingsCleared') || 'AI settings cleared');
    };

    const isConfigured = apiKey.length > 10;

    return (
        <div className="max-w-xl space-y-6 md:space-y-8">
            {/* Status Banner */}
            <div className={`p-4 rounded-xl flex items-center gap-3 ${isConfigured ? 'bg-[#21DBA4]/10 border border-[#21DBA4]/30' : theme === 'dark' ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isConfigured ? 'bg-[#21DBA4] text-white' : 'bg-amber-500 text-white'}`}>
                    <Brain size={20} />
                </div>
                <div className="flex-1">
                    <h5 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {isConfigured ? (t('aiEnabled') || 'AI Features Enabled') : (t('aiDisabled') || 'AI Features Disabled')}
                    </h5>
                    <p className="text-xs text-slate-400">
                        {isConfigured
                            ? (t('aiEnabledDesc') || 'Insights, Articles, and AI Chat are available')
                            : (t('aiDisabledDesc') || 'Enter your API key to enable AI features')}
                    </p>
                </div>
            </div>

            {/* Provider Selection */}
            <div className="space-y-3 md:space-y-4">
                <h4 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider">{t('aiProvider') || 'AI Provider'}</h4>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <button
                        onClick={() => { setProvider('openai'); setModel(''); }}
                        className={`p-3 md:p-4 rounded-xl border-2 flex flex-col items-center gap-2 md:gap-3 transition-all ${provider === 'openai' ? 'border-[#21DBA4] bg-[#E0FBF4]/30' : 'border-slate-200 opacity-60'}`}
                    >
                        <span className="text-xl md:text-2xl">🤖</span>
                        <span className={`text-xs md:text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-600'}`}>OpenAI</span>
                    </button>
                    <button
                        onClick={() => { setProvider('gemini'); setModel(''); }}
                        className={`p-3 md:p-4 rounded-xl border-2 flex flex-col items-center gap-2 md:gap-3 transition-all ${provider === 'gemini' ? 'border-[#21DBA4] bg-[#E0FBF4]/30' : 'border-slate-200 opacity-60'}`}
                    >
                        <span className="text-xl md:text-2xl">✨</span>
                        <span className={`text-xs md:text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-600'}`}>Google Gemini</span>
                    </button>
                </div>
            </div>

            {/* API Key Input */}
            <div className="space-y-3 md:space-y-4">
                <h4 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider">{t('apiKey') || 'API Key'}</h4>
                <div className="relative">
                    <input
                        type={showKey ? 'text' : 'password'}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder={provider === 'openai' ? 'sk-...' : 'AIza...'}
                        className={`w-full h-12 rounded-xl px-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-[#21DBA4]/20 transition-all ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'} border`}
                    />
                    <button
                        onClick={() => setShowKey(!showKey)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg ${theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                    >
                        {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {/* API Key Link and Instructions */}
                <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                    <a
                        href={API_LINKS[provider].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#21DBA4] hover:underline mb-2"
                    >
                        🔗 {API_LINKS[provider].name}에서 API 키 발급받기
                    </a>
                    <div className="text-xs text-slate-400 space-y-1">
                        {provider === 'openai' ? (
                            <>
                                <p>1. OpenAI 계정 로그인 또는 가입</p>
                                <p>2. API keys 메뉴에서 "Create new secret key" 클릭</p>
                                <p>3. 생성된 키(sk-...)를 복사하여 위에 붙여넣기</p>
                            </>
                        ) : (
                            <>
                                <p>1. Google 계정으로 AI Studio 로그인</p>
                                <p>2. "Create API key" 버튼 클릭</p>
                                <p>3. 생성된 키(AIza...)를 복사하여 위에 붙여넣기</p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Model Selection */}
            <div className="space-y-3 md:space-y-4">
                <h4 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider">{t('model') || 'Model'}</h4>
                <select
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className={`w-full h-12 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#21DBA4]/20 transition-all cursor-pointer ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'} border`}
                >
                    <option value="">{t('selectModel') || 'Select a model'}</option>
                    {AI_MODELS[provider].map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
                <button
                    onClick={saveSettings}
                    disabled={!apiKey || !model}
                    className="flex-1 h-12 rounded-xl font-bold text-sm bg-[#21DBA4] text-white hover:bg-[#1bc290] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#21DBA4]/20"
                >
                    {t('save') || 'Save Settings'}
                </button>
                {isConfigured && (
                    <button
                        onClick={clearSettings}
                        className={`px-6 h-12 rounded-xl font-bold text-sm transition-all ${theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        {t('clear') || 'Clear'}
                    </button>
                )}
            </div>

            {/* Info */}
            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <h5 className={`font-bold text-sm mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {t('aiFeatures') || 'AI Features'}
                </h5>
                <ul className="text-xs text-slate-400 space-y-1">
                    <li>• {t('aiInsightsReport') || 'AI Insights Report - Summarize your saved content'}</li>
                    <li>• {t('aiArticle') || 'AI Article - Generate original articles from your clips'}</li>
                    <li>• {t('aiChat') || 'AI Chat - Ask questions about your content'}</li>
                </ul>
            </div>
        </div>
    );
};
