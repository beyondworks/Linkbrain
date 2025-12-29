import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { Search, RefreshCw, Loader2 } from 'lucide-react';
import { cn } from '../ui/utils';
import { SectionHeader } from '../shared/SectionHeader';
import { Badge } from '../shared/Badge';
import { DataTable, Column } from '../shared/DataTable';

interface UsersPanelProps {
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    admin: ReturnType<typeof useAdmin>;
}

interface UserRow {
    email: string;
    plan: string;
    clips: number;
    date: string;
    status: string;
}

// Master emails for automatic recognition
const MASTER_EMAILS = ['beyondworks.br@gmail.com'];

/**
 * UsersPanel - AnalyticsPanel과 동일한 레이아웃 (space-y-6)
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

    // Transform users to table rows
    const userData: UserRow[] = useMemo(() => {
        return users
            .filter(u => !searchQuery || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(user => {
                // Determine plan
                let plan = 'Free';
                if (MASTER_EMAILS.includes(user.email)) {
                    plan = 'Master';
                } else if (user.subscriptionTier === 'pro') {
                    plan = 'Pro';
                }

                return {
                    email: user.email,
                    plan,
                    clips: user.clipCount || 0,
                    date: user.createdAt?.slice(0, 10) || '-',
                    status: t.active
                };
            });
    }, [users, searchQuery, t.active]);

    // Table columns
    const columns: Column<UserRow>[] = [
        { key: 'email', header: t.email },
        {
            key: 'plan',
            header: t.plan,
            render: (value) => {
                const variant = value === 'Master' ? 'pro' : value === 'Pro' ? 'pro' : 'free';
                return <Badge variant={variant} isDark={isDark}>{value}</Badge>;
            }
        },
        { key: 'clips', header: t.clips },
        { key: 'date', header: t.date },
        {
            key: 'status',
            header: t.status,
            render: (value) => (
                <Badge variant={value === t.active ? 'success' : 'error'} isDark={isDark}>{value}</Badge>
            )
        }
    ];

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
            {/* Header */}
            <SectionHeader
                title={t.title}
                subtitle={t.subtitle}
                isDark={isDark}
                action={
                    <div className="flex gap-2">
                        <div className={cn(
                            "flex items-center h-9 px-3 rounded-xl border",
                            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200"
                        )}>
                            <Search size={14} className="text-slate-400 mr-2" />
                            <input
                                type="search"
                                placeholder={t.search}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={cn(
                                    "bg-transparent border-none outline-none text-sm w-32",
                                    isDark ? "text-white placeholder:text-gray-500" : "text-slate-800 placeholder:text-slate-400"
                                )}
                            />
                        </div>
                        <button
                            onClick={() => fetchUserList()}
                            disabled={usersLoading}
                            className="h-9 px-4 bg-[#21DBA4] text-white text-sm font-medium rounded-xl hover:bg-[#1bc290] transition-colors disabled:opacity-50"
                        >
                            {usersLoading ? <RefreshCw size={14} className="animate-spin" /> : t.export}
                        </button>
                    </div>
                }
            />

            {/* DataTable Card */}
            <div className={cn(
                "p-6 rounded-3xl border",
                isDark ? "bg-[#111113] border-gray-800" : "bg-white border-slate-100"
            )}>
                <DataTable
                    data={userData}
                    columns={columns}
                    isDark={isDark}
                    emptyMessage={t.noUsers}
                />
            </div>
        </div>
    );
}
