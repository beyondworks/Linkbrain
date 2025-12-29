import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { Search, RefreshCw, Loader2 } from 'lucide-react';
import { cn } from '../ui/utils';
import { SectionHeader } from '../shared/SectionHeader';
import { Badge } from '../shared/Badge';

interface UsersPanelProps {
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    admin: ReturnType<typeof useAdmin>;
}

// Master emails for automatic recognition
const MASTER_EMAILS = ['beyondworks.br@gmail.com'];

/**
 * UsersPanel - Storybook 4번 스크린샷 100% 반영
 * 
 * 핵심 레이아웃:
 * - SectionHeader with 검색 + 내보내기 버튼
 * - 테이블: 이메일 | 플랜 | 클립 수 | 가입일 | 상태
 * - 깔끔한 수평 정렬
 */
export function UsersPanel({ theme, language, admin }: UsersPanelProps) {
    const { users, usersLoading, fetchUserList } = admin;
    const [searchQuery, setSearchQuery] = useState('');
    const [hasLoaded, setHasLoaded] = useState(false);
    const isDark = theme === 'dark';

    const t = {
        title: language === 'ko' ? '사용자 관리' : 'User Management',
        subtitle: language === 'ko' ? '전체 사용자 목록' : 'All users list',
        search: language === 'ko' ? '검색...' : 'Search...',
        export: language === 'ko' ? '내보내기' : 'Export',
        email: language === 'ko' ? '이메일' : 'Email',
        plan: language === 'ko' ? '플랜' : 'Plan',
        clips: language === 'ko' ? '클립 수' : 'Clips',
        date: language === 'ko' ? '가입일' : 'Joined',
        status: language === 'ko' ? '상태' : 'Status',
        active: language === 'ko' ? '활성' : 'Active',
        inactive: language === 'ko' ? '비활성' : 'Inactive',
        loading: language === 'ko' ? '로딩 중...' : 'Loading...',
        noUsers: language === 'ko' ? '사용자가 없습니다' : 'No users found'
    };

    // Fetch users on mount
    useEffect(() => {
        if (!hasLoaded) {
            fetchUserList();
            setHasLoaded(true);
        }
    }, [hasLoaded, fetchUserList]);

    // Process and filter users
    const filteredUsers = useMemo(() => {
        return users
            .filter(u => !searchQuery || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(user => {
                let plan: 'Master' | 'Pro' | 'Free' = 'Free';
                if (MASTER_EMAILS.includes(user.email)) {
                    plan = 'Master';
                } else if (user.subscriptionTier === 'pro') {
                    plan = 'Pro';
                }
                return { ...user, plan };
            });
    }, [users, searchQuery]);

    // Loading state
    if (usersLoading && users.length === 0) {
        return (
            <div className={cn(
                "p-6 rounded-3xl border text-center",
                isDark ? "bg-[#111113] border-gray-800" : "bg-white border-slate-100"
            )}>
                <Loader2 className="w-8 h-8 text-[#21DBA4] animate-spin mx-auto mb-4" />
                <p className="text-slate-500">{t.loading}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header - Storybook Exact Pattern */}
            <SectionHeader
                title={t.title}
                subtitle={t.subtitle}
                isDark={isDark}
                action={
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "flex items-center h-10 px-4 rounded-xl border",
                            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200"
                        )}>
                            <Search size={16} className="text-slate-400 mr-2" />
                            <input
                                type="search"
                                placeholder={t.search}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={cn(
                                    "bg-transparent border-none outline-none text-sm w-24",
                                    isDark ? "text-white placeholder:text-gray-500" : "text-slate-800 placeholder:text-slate-400"
                                )}
                            />
                        </div>
                        <button
                            onClick={() => fetchUserList()}
                            disabled={usersLoading}
                            className="h-10 px-5 bg-[#21DBA4] text-white text-sm font-medium rounded-xl hover:bg-[#1bc290] transition-colors disabled:opacity-50"
                        >
                            {t.export}
                        </button>
                    </div>
                }
            />

            {/* Table Card - Storybook Style */}
            <div className={cn(
                "rounded-3xl border overflow-hidden",
                isDark ? "bg-[#111113] border-gray-800" : "bg-white border-slate-100"
            )}>
                {/* Table */}
                <table className="w-full">
                    {/* Table Header */}
                    <thead>
                        <tr className={cn(
                            "border-b",
                            isDark ? "bg-gray-900/50 border-gray-800" : "bg-slate-50 border-slate-100"
                        )}>
                            <th className={cn(
                                "px-6 py-4 text-left text-xs font-semibold",
                                isDark ? "text-gray-400" : "text-slate-500"
                            )}>{t.email}</th>
                            <th className={cn(
                                "px-6 py-4 text-center text-xs font-semibold",
                                isDark ? "text-gray-400" : "text-slate-500"
                            )}>{t.plan}</th>
                            <th className={cn(
                                "px-6 py-4 text-center text-xs font-semibold",
                                isDark ? "text-gray-400" : "text-slate-500"
                            )}>{t.clips}</th>
                            <th className={cn(
                                "px-6 py-4 text-center text-xs font-semibold",
                                isDark ? "text-gray-400" : "text-slate-500"
                            )}>{t.date}</th>
                            <th className={cn(
                                "px-6 py-4 text-center text-xs font-semibold",
                                isDark ? "text-gray-400" : "text-slate-500"
                            )}>{t.status}</th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-slate-400">
                                    {t.noUsers}
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr
                                    key={user.id}
                                    className={cn(
                                        "border-b last:border-b-0 transition-colors",
                                        isDark ? "border-gray-800 hover:bg-gray-900/30" : "border-slate-50 hover:bg-slate-50/50"
                                    )}
                                >
                                    {/* Email */}
                                    <td className="px-6 py-4">
                                        <span className={cn("text-sm", isDark ? "text-white" : "text-slate-800")}>
                                            {user.email}
                                        </span>
                                    </td>

                                    {/* Plan */}
                                    <td className="px-6 py-4 text-center">
                                        <Badge
                                            variant={user.plan === 'Master' || user.plan === 'Pro' ? 'pro' : 'free'}
                                            isDark={isDark}
                                        >
                                            {user.plan}
                                        </Badge>
                                    </td>

                                    {/* Clips */}
                                    <td className={cn(
                                        "px-6 py-4 text-center text-sm",
                                        isDark ? "text-gray-400" : "text-slate-600"
                                    )}>
                                        {user.clipCount || 0}
                                    </td>

                                    {/* Join Date */}
                                    <td className={cn(
                                        "px-6 py-4 text-center text-sm",
                                        isDark ? "text-gray-400" : "text-slate-600"
                                    )}>
                                        {user.createdAt?.slice(0, 10) || '-'}
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4 text-center">
                                        <Badge variant="success" isDark={isDark}>
                                            {t.active}
                                        </Badge>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
