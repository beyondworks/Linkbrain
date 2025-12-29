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
    Activity,
    CreditCard,
    TrendingUp,
    Menu,
    X
} from 'lucide-react';
import { cn } from '../ui/utils';

type AdminTab = 'analytics' | 'users' | 'categories' | 'detailed' | 'announcements' | 'inquiries' | 'popups';

interface AdminDashboardProps {
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    onBack: () => void;
}

// ═══════════════════════════════════════════════════
// Theme System (Storybook MUI Style)
// ═══════════════════════════════════════════════════
const useTheme = (isDark: boolean) => ({
    // Layout backgrounds
    bg: isDark ? 'bg-[#0A0A0B]' : 'bg-slate-50',
    sidebarBg: isDark ? 'bg-[#111113] border-gray-800' : 'bg-white border-slate-200',
    headerBg: isDark ? 'bg-[#111113]/95 border-gray-800' : 'bg-white/95 border-slate-200',
    // Text
    text: isDark ? 'text-[#FAFAFA]' : 'text-slate-800',
    textMuted: isDark ? 'text-[#71717A]' : 'text-slate-500',
    // Nav item
    navActive: 'bg-[#21DBA4]/10 text-[#21DBA4]',
    navInactive: isDark ? 'text-gray-400 hover:bg-gray-800' : 'text-slate-500 hover:bg-slate-50',
});

// NavItem Component (matching Storybook)
function NavItem({
    icon,
    label,
    active,
    onClick,
    isDark
}: {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    onClick: () => void;
    isDark: boolean;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                active
                    ? 'bg-[#21DBA4]/10 text-[#21DBA4]'
                    : isDark
                        ? 'text-gray-400 hover:bg-gray-800'
                        : 'text-slate-500 hover:bg-slate-50'
            )}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

export function AdminDashboard({ theme, language, onBack }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const admin = useAdmin();
    const isDark = theme === 'dark';
    const t$ = useTheme(isDark);

    const t = {
        title: language === 'ko' ? 'Linkbrain Admin' : 'Linkbrain Admin',
        analytics: language === 'ko' ? '개요' : 'Overview',
        serviceStats: language === 'ko' ? '서비스 통계' : 'Service Stats',
        users: language === 'ko' ? '사용자' : 'Users',
        subscriptions: language === 'ko' ? '구독' : 'Subscriptions',
        categories: language === 'ko' ? '카테고리' : 'Categories',
        detailed: language === 'ko' ? '분석' : 'Analytics',
        announcements: language === 'ko' ? '공지사항' : 'Announcements',
        inquiries: language === 'ko' ? '문의' : 'Inquiries',
        popups: language === 'ko' ? '팝업' : 'Popups',
        loading: language === 'ko' ? '로딩 중...' : 'Loading...',
        accessDenied: language === 'ko' ? '접근 불가' : 'Access Denied',
        accessDeniedDesc: language === 'ko' ? '관리자 권한이 필요합니다.' : 'Administrator access required.',
        back: language === 'ko' ? '돌아가기' : 'Go Back'
    };

    const navItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
        { id: 'analytics', label: t.analytics, icon: <LayoutDashboard size={16} /> },
        { id: 'users', label: t.users, icon: <Users size={16} /> },
        { id: 'categories', label: t.categories, icon: <Layers size={16} /> },
        { id: 'detailed', label: t.detailed, icon: <Activity size={16} /> },
        { id: 'announcements', label: t.announcements, icon: <Bell size={16} /> },
        { id: 'inquiries', label: t.inquiries, icon: <MessageSquare size={16} /> },
        { id: 'popups', label: t.popups, icon: <Megaphone size={16} /> }
    ];

    // Loading State
    if (admin.loading) {
        return (
            <div className={cn("min-h-screen flex items-center justify-center", t$.bg)}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-[#21DBA4] to-[#1bc290] flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-white" />
                    </div>
                    <p className={t$.textMuted}>{t.loading}</p>
                </div>
            </div>
        );
    }

    // Access Denied
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
                        className="px-8 py-3 bg-gradient-to-r from-[#21DBA4] to-[#1bc290] text-white rounded-3xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-[#21DBA4]/20"
                    >
                        {t.back}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("min-h-screen", t$.bg)}>
            {/* Header - Storybook Style */}
            <header className={cn("h-16 border-b flex items-center px-6", t$.headerBg)}>
                <div className="flex items-center gap-3">
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={cn(
                            "lg:hidden w-10 h-10 rounded-lg flex items-center justify-center",
                            isDark ? "bg-gray-800 text-gray-300" : "bg-slate-100 text-slate-600"
                        )}
                    >
                        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>

                    {/* Back Button */}
                    <button
                        onClick={onBack}
                        className={cn(
                            "hidden lg:flex w-8 h-8 rounded-lg items-center justify-center",
                            isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-400" : "bg-slate-100 hover:bg-slate-200 text-slate-500"
                        )}
                    >
                        <ArrowLeft size={16} />
                    </button>

                    {/* Logo + Title */}
                    <div className="w-8 h-8 bg-[#21DBA4] rounded-lg" />
                    <span className={cn("font-bold", t$.text)}>{t.title}</span>
                </div>

                {/* Email Badge */}
                <div className="ml-auto flex items-center gap-4">
                    <span className={cn("text-sm hidden sm:block", t$.textMuted)}>{admin.user?.email}</span>
                    <div className="w-8 h-8 bg-slate-200 rounded-full" />
                </div>
            </header>

            <div className="flex">
                {/* Sidebar - Storybook Style */}
                <aside className={cn(
                    "fixed inset-y-0 left-0 z-40 w-60 pt-16 transform transition-transform duration-200 lg:relative lg:translate-x-0 lg:pt-0",
                    "border-r min-h-[calc(100vh-64px)] p-4",
                    t$.sidebarBg,
                    sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}>
                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <NavItem
                                key={item.id}
                                icon={item.icon}
                                label={item.label}
                                active={activeTab === item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setSidebarOpen(false);
                                }}
                                isDark={isDark}
                            />
                        ))}
                    </nav>
                </aside>

                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 p-6 lg:p-8 min-h-[calc(100vh-64px)]">
                    {activeTab === 'analytics' && <AnalyticsPanel theme={theme} language={language} admin={admin} />}
                    {activeTab === 'users' && <UsersPanel theme={theme} language={language} admin={admin} />}
                    {activeTab === 'categories' && <CategoryAnalyticsPanel theme={theme} language={language} admin={admin} />}
                    {activeTab === 'detailed' && <DetailedAnalyticsPanel theme={theme} language={language} admin={admin} />}
                    {activeTab === 'announcements' && <AnnouncementsPanel theme={theme} language={language} admin={admin} />}
                    {activeTab === 'inquiries' && <InquiriesPanel theme={theme} language={language} admin={admin} />}
                    {activeTab === 'popups' && <PopupsPanel theme={theme} language={language} admin={admin} />}
                </main>
            </div>
        </div>
    );
}
