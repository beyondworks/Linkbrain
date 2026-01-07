import * as React from 'react';
import { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { AnalyticsPanel } from './AnalyticsPanel';
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
    Home,
    Menu // Added Menu icon
} from 'lucide-react';
import { cn } from '../ui/utils';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetDescription
} from '../ui/sheet'; // Added Sheet components
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'; // For accessibility

type AdminTab = 'analytics' | 'users' | 'subscriptions' | 'categories' | 'detailed' | 'announcements' | 'inquiries' | 'popups';

interface AdminDashboardProps {
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    onBack: () => void;
}

// Sidebar Content Component to be reused
const SidebarContent = ({
    t,
    navItems,
    activeTab,
    setActiveTab,
    onBack,
    admin,
    isDark,
    isMobile = false,
    onCloseSidebar
}: {
    t: any;
    navItems: any[];
    activeTab: AdminTab;
    setActiveTab: (tab: AdminTab) => void;
    onBack: () => void;
    admin: any;
    isDark: boolean;
    isMobile?: boolean;
    onCloseSidebar?: () => void;
}) => {
    return (
        <div className={cn("flex flex-col h-full", isMobile ? (isDark ? "bg-[#111113]" : "bg-white") : "")}>
            {/* Logo Area */}
            <div className="h-14 flex items-center px-4 border-b border-gray-100 dark:border-gray-800">
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
                        onClick={() => {
                            setActiveTab(item.id);
                            if (onCloseSidebar) onCloseSidebar();
                        }}
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
        </div>
    );
};

export function AdminDashboard({ theme, language, onBack }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile sidebar state
    const admin = useAdmin();
    // Admin Dashboard always uses light mode
    const isDark = false;

    const t = {
        title: 'Linkbrain Admin',
        home: language === 'ko' ? 'Home' : 'Home',
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
        back: language === 'ko' ? '돌아가기' : 'Go Back',
        menu: language === 'ko' ? '메뉴' : 'Menu'
    };

    const navItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
        { id: 'analytics', label: t.analytics, icon: <LayoutDashboard size={18} /> },
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

    const sidebarProps = { t, navItems, activeTab, setActiveTab, onBack, admin, isDark };

    return (
        <div className={cn("min-h-screen flex flex-col md:flex-row", isDark ? "bg-[#0A0A0B]" : "bg-[#F8F9FA]")}>

            {/* Mobile Header - Visible only on mobile */}
            <header className={cn(
                "md:hidden border-b flex items-center justify-between px-4 sticky top-0 z-50 transition-all",
                isDark ? "bg-[#111113] border-gray-800" : "bg-white border-gray-200",
                "h-[calc(3.5rem+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)]"
            )}>
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-[#21DBA4] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">L</span>
                    </div>
                    <span className={cn("font-bold text-sm", isDark ? "text-white" : "text-slate-800")}>
                        {t.title}
                    </span>
                </div>

                <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                    <SheetTrigger asChild>
                        <button className={cn("p-2 rounded-lg", isDark ? "text-gray-400 hover:bg-gray-800" : "text-slate-600 hover:bg-slate-100")}>
                            <Menu size={20} />
                        </button>
                    </SheetTrigger>
                    {/* SheetContent has default padding and cross icon. We remove padding to match sidebar style */}
                    <SheetContent side="left" className={cn("p-0 w-64 border-r-0 [&>button]:top-0 [&>button]:right-0 [&>button]:h-14 [&>button]:w-14 [&>button]:flex [&>button]:items-center [&>button]:justify-center", isDark ? "bg-[#111113]" : "bg-white")}>
                        <VisuallyHidden>
                            <SheetTitle>{t.title}</SheetTitle>
                            <SheetDescription>Navigation Menu</SheetDescription>
                        </VisuallyHidden>
                        <SidebarContent {...sidebarProps} isMobile={true} onCloseSidebar={() => setIsSidebarOpen(false)} />
                    </SheetContent>
                </Sheet>
            </header>

            {/* Desktop Sidebar - Hidden on mobile */}
            <aside className={cn(
                "hidden md:flex w-64 shrink-0 border-r flex-col h-screen sticky top-0",
                isDark ? "bg-[#111113] border-gray-800" : "bg-white border-gray-100"
            )}>
                <SidebarContent {...sidebarProps} />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="max-w-5xl mx-auto">
                    {activeTab === 'analytics' && <AnalyticsPanel theme="light" language={language} admin={admin} />}
                    {activeTab === 'users' && <UsersPanel theme="light" language={language} admin={admin} />}
                    {activeTab === 'subscriptions' && <SubscriptionsPanel theme="light" language={language} admin={admin} />}
                    {activeTab === 'categories' && <CategoryAnalyticsPanel theme="light" language={language} admin={admin} />}
                    {activeTab === 'detailed' && <DetailedAnalyticsPanel theme="light" language={language} admin={admin} />}
                    {activeTab === 'announcements' && <AnnouncementsPanel theme="light" language={language} admin={admin} />}
                    {activeTab === 'inquiries' && <InquiriesPanel theme="light" language={language} admin={admin} />}
                    {activeTab === 'popups' && <PopupsPanel theme="light" language={language} admin={admin} />}
                </div>
            </main>
        </div>
    );
}
