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
    BarChart3,
    Bell,
    MessageSquare,
    Megaphone,
    Loader2,
    ShieldAlert,
    ArrowLeft,
    Users,
    Tag,
    TrendingUp
} from 'lucide-react';

type AdminTab = 'analytics' | 'announcements' | 'inquiries' | 'popups' | 'users' | 'categories' | 'detailed';

interface AdminDashboardProps {
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    onBack: () => void;
}

export function AdminDashboard({ theme, language, onBack }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
    const admin = useAdmin();

    const t = {
        title: language === 'ko' ? '관리자 대시보드' : 'Admin Dashboard',
        analytics: language === 'ko' ? '개요' : 'Overview',
        users: language === 'ko' ? '유저 관리' : 'Users',
        categories: language === 'ko' ? '카테고리' : 'Categories',
        detailed: language === 'ko' ? '상세 분석' : 'Detailed',
        announcements: language === 'ko' ? '공지사항' : 'Announcements',
        inquiries: language === 'ko' ? '고객문의' : 'Inquiries',
        popups: language === 'ko' ? '팝업 관리' : 'Popups',
        loading: language === 'ko' ? '로딩 중...' : 'Loading...',
        accessDenied: language === 'ko' ? '접근 권한이 없습니다' : 'Access Denied',
        accessDeniedDesc: language === 'ko'
            ? '이 페이지는 관리자만 접근할 수 있습니다.'
            : 'This page is only accessible to administrators.',
        back: language === 'ko' ? '돌아가기' : 'Go Back'
    };

    const tabs: { id: AdminTab; label: string; icon: React.ReactNode; group?: string }[] = [
        { id: 'analytics', label: t.analytics, icon: <BarChart3 size={18} />, group: 'analytics' },
        { id: 'users', label: t.users, icon: <Users size={18} />, group: 'analytics' },
        { id: 'categories', label: t.categories, icon: <Tag size={18} />, group: 'analytics' },
        { id: 'detailed', label: t.detailed, icon: <TrendingUp size={18} />, group: 'analytics' },
        { id: 'announcements', label: t.announcements, icon: <Bell size={18} />, group: 'manage' },
        { id: 'inquiries', label: t.inquiries, icon: <MessageSquare size={18} />, group: 'manage' },
        { id: 'popups', label: t.popups, icon: <Megaphone size={18} />, group: 'manage' }
    ];

    // Loading state
    if (admin.loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[#21DBA4]" />
                    <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {t.loading}
                    </p>
                </div>
            </div>
        );
    }

    // Access denied
    if (!admin.isAdmin) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
                <div className="flex flex-col items-center gap-4 text-center px-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-red-500/10' : 'bg-red-50'}`}>
                        <ShieldAlert className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {t.accessDenied}
                    </h1>
                    <p className={`text-sm max-w-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {t.accessDeniedDesc}
                    </p>
                    <button
                        onClick={onBack}
                        className="mt-4 px-6 py-2.5 bg-[#21DBA4] text-white rounded-full font-medium text-sm hover:bg-[#1bc290] transition-colors"
                    >
                        {t.back}
                    </button>
                </div>
            </div>
        );
    }

    const analyticsTabs = tabs.filter(t => t.group === 'analytics');
    const manageTabs = tabs.filter(t => t.group === 'manage');

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
            {/* Header */}
            <header className={`sticky top-0 z-40 border-b ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'} backdrop-blur-xl`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={onBack}
                                className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <h1 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                                {t.title}
                            </h1>
                        </div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            {admin.user?.email}
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Navigation */}
                    <nav className={`lg:w-56 shrink-0 ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'} rounded-xl p-2 lg:sticky lg:top-24 h-fit border ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                        <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
                            {/* Analytics Section */}
                            <div className={`hidden lg:block px-3 py-2 text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                                {language === 'ko' ? '분석' : 'Analytics'}
                            </div>
                            {analyticsTabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-[#21DBA4]/10 text-[#21DBA4]'
                                        : theme === 'dark'
                                            ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </button>
                            ))}

                            {/* Management Section */}
                            <div className={`hidden lg:block px-3 py-2 mt-4 text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                                {language === 'ko' ? '관리' : 'Management'}
                            </div>
                            {manageTabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-[#21DBA4]/10 text-[#21DBA4]'
                                        : theme === 'dark'
                                            ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </nav>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        {activeTab === 'analytics' && (
                            <AnalyticsPanel theme={theme} language={language} admin={admin} />
                        )}
                        {activeTab === 'users' && (
                            <UsersPanel theme={theme} language={language} admin={admin} />
                        )}
                        {activeTab === 'categories' && (
                            <CategoryAnalyticsPanel theme={theme} language={language} admin={admin} />
                        )}
                        {activeTab === 'detailed' && (
                            <DetailedAnalyticsPanel theme={theme} language={language} admin={admin} />
                        )}
                        {activeTab === 'announcements' && (
                            <AnnouncementsPanel theme={theme} language={language} admin={admin} />
                        )}
                        {activeTab === 'inquiries' && (
                            <InquiriesPanel theme={theme} language={language} admin={admin} />
                        )}
                        {activeTab === 'popups' && (
                            <PopupsPanel theme={theme} language={language} admin={admin} />
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

