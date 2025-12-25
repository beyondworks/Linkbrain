import * as React from 'react';
import { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { AnalyticsPanel } from './AnalyticsPanel';
import { AnnouncementsPanel } from './AnnouncementsPanel';
import { InquiriesPanel } from './InquiriesPanel';
import { PopupsPanel } from './PopupsPanel';
import { UsersPanel } from './UsersPanel';
import { CategoryAnalyticsPanel } from './CategoryAnalyticsPanel';
import { DetailedAnalyticsPanel } from './DetailedAnalyticsPanel';
import {
    LayoutDashboard,
    Bell,
    MessageSquare,
    Megaphone,
    Loader2,
    ShieldAlert,
    ArrowLeft,
    Users,
    Layers,
    Activity
} from 'lucide-react';
import { cn } from '../ui/utils';

type AdminTab = 'analytics' | 'announcements' | 'inquiries' | 'popups' | 'users' | 'categories' | 'detailed';

interface AdminDashboardProps {
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    onBack: () => void;
}

// ═══════════════════════════════════════════════════
// Theme System (Reference Design)
// ═══════════════════════════════════════════════════

const useTheme = (isDark: boolean) => ({
    bg: isDark ? 'bg-[#0F1115]' : 'bg-[#F9FAFB]',
    text: isDark ? 'text-white' : 'text-gray-900',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-500',
    textSub: isDark ? 'text-gray-500' : 'text-gray-400',
    card: isDark ? 'bg-[#161B22]' : 'bg-white',
    cardBorder: isDark ? 'border-gray-800' : 'border-gray-200',
    cardHover: isDark ? 'hover:border-gray-600' : 'hover:border-gray-300',
    itemBg: isDark ? 'bg-gray-900/50' : 'bg-gray-50',
    itemHover: isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
    border: isDark ? 'border-gray-800' : 'border-gray-200',
    headerBg: isDark ? 'bg-[#0F1115]/90' : 'bg-[#F9FAFB]/90',
});

export function AdminDashboard({ theme, language, onBack }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
    const admin = useAdmin();
    const isDark = theme === 'dark';
    const t$ = useTheme(isDark);

    const t = {
        title: language === 'ko' ? '관리자' : 'Admin',
        analytics: language === 'ko' ? '개요' : 'Overview',
        users: language === 'ko' ? '유저' : 'Users',
        categories: language === 'ko' ? '카테고리' : 'Categories',
        detailed: language === 'ko' ? '상세' : 'Detailed',
        announcements: language === 'ko' ? '공지' : 'Notice',
        inquiries: language === 'ko' ? '문의' : 'Inquiries',
        popups: language === 'ko' ? '팝업' : 'Popups',
        loading: language === 'ko' ? '로딩 중...' : 'Loading...',
        accessDenied: language === 'ko' ? '접근 불가' : 'Access Denied',
        accessDeniedDesc: language === 'ko' ? '관리자 권한이 필요합니다.' : 'Administrator access required.',
        back: language === 'ko' ? '돌아가기' : 'Go Back'
    };

    const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
        { id: 'analytics', label: t.analytics, icon: <LayoutDashboard size={16} /> },
        { id: 'users', label: t.users, icon: <Users size={16} /> },
        { id: 'categories', label: t.categories, icon: <Layers size={16} /> },
        { id: 'detailed', label: t.detailed, icon: <Activity size={16} /> },
        { id: 'announcements', label: t.announcements, icon: <Bell size={16} /> },
        { id: 'inquiries', label: t.inquiries, icon: <MessageSquare size={16} /> },
        { id: 'popups', label: t.popups, icon: <Megaphone size={16} /> }
    ];

    // Loading
    if (admin.loading) {
        return (
            <div className={cn("min-h-screen flex items-center justify-center", t$.bg)}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#21DBA4] to-[#1bc290] flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-white" />
                    </div>
                    <p className={t$.textMuted}>{t.loading}</p>
                </div>
            </div>
        );
    }

    // Access denied
    if (!admin.isAdmin) {
        return (
            <div className={cn("min-h-screen flex items-center justify-center", t$.bg)}>
                <div className="flex flex-col items-center gap-6 text-center px-8">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center">
                        <ShieldAlert className="w-10 h-10 text-red-500" />
                    </div>
                    <div className="space-y-2">
                        <h1 className={cn("text-2xl font-bold tracking-tight", t$.text)}>{t.accessDenied}</h1>
                        <p className={cn("text-sm max-w-xs", t$.textMuted)}>{t.accessDeniedDesc}</p>
                    </div>
                    <button
                        onClick={onBack}
                        className="px-8 py-3 bg-gradient-to-r from-[#21DBA4] to-[#1bc290] text-white rounded-2xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-[#21DBA4]/20"
                    >
                        {t.back}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("min-h-screen transition-colors duration-300", t$.bg)}>
            {/* Header */}
            <header className={cn("sticky top-0 z-50 backdrop-blur-2xl", t$.headerBg)}>
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="flex items-center justify-between h-20">
                        {/* Left: Back + Title */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onBack}
                                className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                    isDark ? "bg-white/5 hover:bg-white/10 text-gray-400" : "bg-black/5 hover:bg-black/10 text-gray-500"
                                )}
                            >
                                <ArrowLeft size={18} />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#21DBA4] to-[#1bc290] flex items-center justify-center shadow-lg shadow-[#21DBA4]/20">
                                    <LayoutDashboard size={18} className="text-white" />
                                </div>
                                <span className={cn("text-xl font-bold tracking-tight", t$.text)}>{t.title}</span>
                            </div>
                        </div>

                        {/* Right: Email Badge */}
                        <div className={cn(
                            "hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium",
                            isDark ? "bg-white/5 text-gray-400" : "bg-black/5 text-gray-500"
                        )}>
                            <div className="w-2 h-2 rounded-full bg-[#21DBA4]" />
                            {admin.user?.email}
                        </div>
                    </div>
                </div>
            </header>

            {/* Tab Navigation */}
            <div className={cn("sticky top-20 z-40 backdrop-blur-2xl border-b", t$.headerBg, t$.border)}>
                <div className="max-w-7xl mx-auto px-6 lg:px-10">
                    <div className="flex gap-1.5 py-4 overflow-x-auto scrollbar-hide">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shrink-0",
                                    activeTab === tab.id
                                        ? "bg-[#21DBA4] text-black shadow-lg shadow-[#21DBA4]/20"
                                        : cn(t$.textMuted, t$.itemHover)
                                )}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
                {activeTab === 'analytics' && <AnalyticsPanel theme={theme} language={language} admin={admin} />}
                {activeTab === 'users' && <UsersPanel theme={theme} language={language} admin={admin} />}
                {activeTab === 'categories' && <CategoryAnalyticsPanel theme={theme} language={language} admin={admin} />}
                {activeTab === 'detailed' && <DetailedAnalyticsPanel theme={theme} language={language} admin={admin} />}
                {activeTab === 'announcements' && <AnnouncementsPanel theme={theme} language={language} admin={admin} />}
                {activeTab === 'inquiries' && <InquiriesPanel theme={theme} language={language} admin={admin} />}
                {activeTab === 'popups' && <PopupsPanel theme={theme} language={language} admin={admin} />}
            </main>
        </div>
    );
}
