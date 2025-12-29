import * as React from 'react';
import { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { AnalyticsPanel } from './AnalyticsPanel';
import { ServiceStatsPanel } from './ServiceStatsPanel';
import { SubscriptionsPanel } from './SubscriptionsPanel';
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
    Users,
    Layers,
    Activity,
    CreditCard,
    TrendingUp,
    Home
} from 'lucide-react';
import { cn } from '../ui/utils';

type AdminTab = 'analytics' | 'serviceStats' | 'users' | 'subscriptions' | 'categories' | 'detailed' | 'announcements' | 'inquiries' | 'popups';

interface AdminDashboardProps {
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    onBack: () => void;
}

/**
 * AdminDashboard - Storybook 100% 반영
 * 
 * 핵심 레이아웃:
 * - 전체 max-w-7xl mx-auto 컨테이너
 * - 사이드바 w-60 항상 표시
 * - 헤더 포함 모든 요소가 컨테이너 내부
 */
export function AdminDashboard({ theme, language, onBack }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
    const admin = useAdmin();
    const isDark = theme === 'dark';

    const t = {
        title: 'Linkbrain Admin',
        home: language === 'ko' ? '홈으로' : 'Back to Home',
        analytics: 'Overview',
        serviceStats: 'Service Stats',
        users: 'Users',
        subscriptions: 'Subscriptions',
        categories: 'Categories',
        detailed: 'Analytics',
        announcements: 'Announcements',
        inquiries: 'Inquiries',
        popups: 'Popups',
        loading: language === 'ko' ? '로딩 중...' : 'Loading...',
        accessDenied: language === 'ko' ? '접근 불가' : 'Access Denied',
        accessDeniedDesc: language === 'ko' ? '관리자 권한이 필요합니다.' : 'Administrator access required.',
        back: language === 'ko' ? '돌아가기' : 'Go Back'
    };

    const navItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
        { id: 'analytics', label: t.analytics, icon: <LayoutDashboard size={16} /> },
        { id: 'serviceStats', label: t.serviceStats, icon: <TrendingUp size={16} /> },
        { id: 'users', label: t.users, icon: <Users size={16} /> },
        { id: 'subscriptions', label: t.subscriptions, icon: <CreditCard size={16} /> },
        { id: 'categories', label: t.categories, icon: <Layers size={16} /> },
        { id: 'detailed', label: t.detailed, icon: <Activity size={16} /> },
        { id: 'announcements', label: t.announcements, icon: <Bell size={16} /> },
        { id: 'inquiries', label: t.inquiries, icon: <MessageSquare size={16} /> },
        { id: 'popups', label: t.popups, icon: <Megaphone size={16} /> }
    ];

    // Loading State
    if (admin.loading) {
        return (
            <div className={cn("min-h-screen flex items-center justify-center", isDark ? "bg-[#0A0A0B]" : "bg-slate-50")}>
                <Loader2 className="w-8 h-8 animate-spin text-[#21DBA4]" />
            </div>
        );
    }

    // Access Denied
    if (!admin.isAdmin) {
        return (
            <div className={cn("min-h-screen flex items-center justify-center", isDark ? "bg-[#0A0A0B]" : "bg-slate-50")}>
                <div className="flex flex-col items-center gap-6 text-center px-8">
                    <ShieldAlert className="w-16 h-16 text-red-500" />
                    <div>
                        <h1 className={cn("text-2xl font-bold mb-2", isDark ? "text-white" : "text-slate-800")}>{t.accessDenied}</h1>
                        <p className="text-slate-500">{t.accessDeniedDesc}</p>
                    </div>
                    <button onClick={onBack} className="px-6 py-3 bg-[#21DBA4] text-white rounded-xl font-medium hover:bg-[#1bc290]">
                        {t.back}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("min-h-screen", isDark ? "bg-[#0A0A0B]" : "bg-slate-50")}>
            {/* Container - 모든 요소를 max-w-7xl 내에 배치 */}
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className={cn(
                    "h-16 border-b flex items-center justify-between px-6",
                    isDark ? "bg-[#111113] border-gray-800" : "bg-white border-slate-200"
                )}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#21DBA4] rounded-lg" />
                        <span className={cn("font-bold", isDark ? "text-white" : "text-slate-800")}>{t.title}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-500 hidden sm:block">{admin.user?.email}</span>
                        <div className="w-8 h-8 bg-slate-200 rounded-full" />
                    </div>
                </header>

                <div className="flex">
                    {/* Sidebar - 항상 표시 (w-60) */}
                    <aside className={cn(
                        "w-60 shrink-0 border-r min-h-[calc(100vh-64px)] p-4",
                        isDark ? "bg-[#111113] border-gray-800" : "bg-white border-slate-200"
                    )}>
                        {/* Home Button */}
                        <button
                            onClick={onBack}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-4",
                                isDark ? "text-gray-400 hover:bg-gray-800" : "text-slate-500 hover:bg-slate-100"
                            )}
                        >
                            <Home size={16} />
                            <span>{t.home}</span>
                        </button>

                        <div className={cn("h-px mb-4", isDark ? "bg-gray-800" : "bg-slate-200")} />

                        {/* Nav Items */}
                        <nav className="space-y-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                                        activeTab === item.id
                                            ? "bg-[#21DBA4]/10 text-[#21DBA4]"
                                            : isDark
                                                ? "text-gray-400 hover:bg-gray-800"
                                                : "text-slate-500 hover:bg-slate-100"
                                    )}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 p-6 min-h-[calc(100vh-64px)]">
                        {activeTab === 'analytics' && <AnalyticsPanel theme={theme} language={language} admin={admin} />}
                        {activeTab === 'serviceStats' && <ServiceStatsPanel theme={theme} language={language} admin={admin} />}
                        {activeTab === 'users' && <UsersPanel theme={theme} language={language} admin={admin} />}
                        {activeTab === 'subscriptions' && <SubscriptionsPanel theme={theme} language={language} admin={admin} />}
                        {activeTab === 'categories' && <CategoryAnalyticsPanel theme={theme} language={language} admin={admin} />}
                        {activeTab === 'detailed' && <DetailedAnalyticsPanel theme={theme} language={language} admin={admin} />}
                        {activeTab === 'announcements' && <AnnouncementsPanel theme={theme} language={language} admin={admin} />}
                        {activeTab === 'inquiries' && <InquiriesPanel theme={theme} language={language} admin={admin} />}
                        {activeTab === 'popups' && <PopupsPanel theme={theme} language={language} admin={admin} />}
                    </main>
                </div>
            </div>
        </div>
    );
}
