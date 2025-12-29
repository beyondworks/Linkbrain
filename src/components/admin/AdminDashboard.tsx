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
 * AdminDashboard - 홈 화면 스타일 적용
 * 
 * 레이아웃:
 * - 사이드바: 좌측 고정, 전체 높이
 * - 메인 콘텐츠: 자연스럽게 흐름
 * - 헤더 없이 사이드바에 로고 배치 (홈 화면과 동일)
 */
export function AdminDashboard({ theme, language, onBack }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
    const admin = useAdmin();
    const isDark = theme === 'dark';

    const t = {
        title: 'Linkbrain Admin',
        home: language === 'ko' ? '홈으로' : 'Home',
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
        { id: 'analytics', label: t.analytics, icon: <LayoutDashboard size={18} /> },
        { id: 'serviceStats', label: t.serviceStats, icon: <TrendingUp size={18} /> },
        { id: 'users', label: t.users, icon: <Users size={18} /> },
        { id: 'subscriptions', label: t.subscriptions, icon: <CreditCard size={18} /> },
        { id: 'categories', label: t.categories, icon: <Layers size={18} /> },
        { id: 'detailed', label: t.detailed, icon: <Activity size={18} /> },
        { id: 'announcements', label: t.announcements, icon: <Bell size={18} /> },
        { id: 'inquiries', label: t.inquiries, icon: <MessageSquare size={18} /> },
        { id: 'popups', label: t.popups, icon: <Megaphone size={18} /> }
    ];

    // Loading State
    if (admin.loading) {
        return (
            <div className={cn("min-h-screen flex items-center justify-center", isDark ? "bg-[#0A0A0B]" : "bg-white")}>
                <Loader2 className="w-8 h-8 animate-spin text-[#21DBA4]" />
            </div>
        );
    }

    // Access Denied
    if (!admin.isAdmin) {
        return (
            <div className={cn("min-h-screen flex items-center justify-center", isDark ? "bg-[#0A0A0B]" : "bg-white")}>
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
        <div className={cn("min-h-screen flex", isDark ? "bg-[#0A0A0B]" : "bg-[#F8F9FA]")}>
            {/* Sidebar - 넓은 사이드바 */}
            <aside className={cn(
                "w-64 shrink-0 border-r flex flex-col h-screen sticky top-0",
                isDark ? "bg-[#111113] border-gray-800" : "bg-white border-gray-100"
            )}>
                {/* Logo Area */}
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#21DBA4] rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">L</span>
                        </div>
                        <span className={cn("font-bold text-sm", isDark ? "text-white" : "text-slate-800")}>
                            {t.title}
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {/* Home Button */}
                    <button
                        onClick={onBack}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                            isDark ? "text-gray-400 hover:bg-gray-800" : "text-slate-500 hover:bg-slate-50"
                        )}
                    >
                        <Home size={18} />
                        <span>{t.home}</span>
                    </button>

                    <div className={cn("h-px my-2", isDark ? "bg-gray-800" : "bg-gray-100")} />

                    {/* Nav Items */}
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left",
                                activeTab === item.id
                                    ? isDark
                                        ? "bg-[#21DBA4]/10 text-[#21DBA4]"
                                        : "bg-[#21DBA4]/10 text-[#21DBA4]"
                                    : isDark
                                        ? "text-gray-400 hover:bg-gray-800"
                                        : "text-slate-600 hover:bg-slate-50"
                            )}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* User Info - 하단 */}
                <div className={cn("p-3 border-t", isDark ? "border-gray-800" : "border-gray-100")}>
                    <div className="flex items-center gap-2 px-2">
                        <div className="w-8 h-8 bg-[#21DBA4] rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {admin.user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={cn("text-xs font-medium truncate", isDark ? "text-white" : "text-slate-800")}>
                                {admin.user?.email?.split('@')[0]}
                            </p>
                            <p className="text-xs text-slate-500 truncate">Admin</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area - 중앙 정렬 */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-5xl mx-auto">
                    {activeTab === 'analytics' && <AnalyticsPanel theme={theme} language={language} admin={admin} />}
                    {activeTab === 'serviceStats' && <ServiceStatsPanel theme={theme} language={language} admin={admin} />}
                    {activeTab === 'users' && <UsersPanel theme={theme} language={language} admin={admin} />}
                    {activeTab === 'subscriptions' && <SubscriptionsPanel theme={theme} language={language} admin={admin} />}
                    {activeTab === 'categories' && <CategoryAnalyticsPanel theme={theme} language={language} admin={admin} />}
                    {activeTab === 'detailed' && <DetailedAnalyticsPanel theme={theme} language={language} admin={admin} />}
                    {activeTab === 'announcements' && <AnnouncementsPanel theme={theme} language={language} admin={admin} />}
                    {activeTab === 'inquiries' && <InquiriesPanel theme={theme} language={language} admin={admin} />}
                    {activeTab === 'popups' && <PopupsPanel theme={theme} language={language} admin={admin} />}
                </div>
            </main>
        </div>
    );
}
