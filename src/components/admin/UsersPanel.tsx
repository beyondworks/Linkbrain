import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import {
    Search,
    ChevronDown,
    ChevronUp,
    ArrowUp,
    ArrowDown,
    Mail,
    User,
    Calendar,
    Clock,
    Loader2
} from 'lucide-react';
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

type PlanFilter = 'all' | 'Master' | 'Pro' | 'Free';
type SortField = 'email' | 'plan' | 'clips' | 'date' | 'status';
type SortOrder = 'asc' | 'desc';

/**
 * UsersPanel - 필터 + 상세정보 드롭다운 추가
 * 
 * 레이아웃 유지:
 * - SectionHeader with 검색 + 내보내기 버튼
 * - 필터 탭 (전체/Master/Pro/Free)
 * - HTML table 구조 유지
 * - 행 클릭 시 상세정보 확장
 */
export function UsersPanel({ theme, language, admin }: UsersPanelProps) {
    const { users, usersLoading, fetchUserList } = admin;
    const [searchQuery, setSearchQuery] = useState('');
    const [planFilter, setPlanFilter] = useState<PlanFilter>('all');
    const [sortField, setSortField] = useState<SortField>('clips');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
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
        noUsers: language === 'ko' ? '사용자가 없습니다' : 'No users found',
        all: language === 'ko' ? '전체' : 'All',
        basicInfo: language === 'ko' ? '기본 정보' : 'Basic Info',
        platformClips: language === 'ko' ? '플랫폼별 클립' : 'Platform Clips',
        subscriptionMgmt: language === 'ko' ? '구독 관리' : 'Subscription',
        userId: language === 'ko' ? '유저 ID' : 'User ID',
        joinDate: language === 'ko' ? '가입일' : 'Joined',
        lastAccess: language === 'ko' ? '마지막 접속' : 'Last Access',
        changePlan: language === 'ko' ? '플랜 변경' : 'Change Plan',
        sortBy: language === 'ko' ? '정렬' : 'Sort by',
        sortEmail: language === 'ko' ? '이메일순' : 'Email',
        sortClips: language === 'ko' ? '클립순' : 'Clips',
        sortDate: language === 'ko' ? '날짜순' : 'Date',
        sortStatus: language === 'ko' ? '상태순' : 'Status',
        asc: language === 'ko' ? '오름차순' : 'Ascending',
        desc: language === 'ko' ? '내림차순' : 'Descending'
    };

    // Fetch users on mount
    useEffect(() => {
        if (!hasLoaded) {
            fetchUserList();
            setHasLoaded(true);
        }
    }, [hasLoaded, fetchUserList]);

    // Process users with plan info
    const processedUsers = useMemo(() => {
        return users.map(user => {
            let plan: 'Master' | 'Pro' | 'Free' = 'Free';
            if (MASTER_EMAILS.includes(user.email)) {
                plan = 'Master';
            } else if (user.subscriptionTier === 'pro') {
                plan = 'Pro';
            }
            return { ...user, plan };
        });
    }, [users]);

    // Filter and sort users
    const filteredUsers = useMemo(() => {
        let result = processedUsers.filter(user => {
            if (planFilter !== 'all' && user.plan !== planFilter) return false;
            if (searchQuery && !user.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            return true;
        });

        // Sort
        result.sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case 'email':
                    comparison = a.email.localeCompare(b.email);
                    break;
                case 'plan':
                    const planOrder = { 'Master': 0, 'Pro': 1, 'Free': 2 };
                    comparison = planOrder[a.plan] - planOrder[b.plan];
                    break;
                case 'clips':
                    comparison = (a.clipCount || 0) - (b.clipCount || 0);
                    break;
                case 'date':
                    comparison = (a.createdAt || '').localeCompare(b.createdAt || '');
                    break;
                case 'status':
                    comparison = 0; // All active for now
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [processedUsers, planFilter, searchQuery, sortField, sortOrder]);

    // Plan counts
    const planCounts = useMemo(() => ({
        all: processedUsers.length,
        Master: processedUsers.filter(u => u.plan === 'Master').length,
        Pro: processedUsers.filter(u => u.plan === 'Pro').length,
        Free: processedUsers.filter(u => u.plan === 'Free').length
    }), [processedUsers]);

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

            {/* Filter Tabs */}
            <div className="flex gap-2">
                {(['all', 'Master', 'Pro', 'Free'] as PlanFilter[]).map(filter => (
                    <button
                        key={filter}
                        onClick={() => setPlanFilter(filter)}
                        className={cn(
                            "h-8 px-4 text-sm font-medium rounded-full transition-colors",
                            planFilter === filter
                                ? "bg-[#21DBA4] text-white"
                                : isDark
                                    ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        )}
                    >
                        {filter === 'all' ? t.all : filter} ({planCounts[filter]})
                    </button>
                ))}
            </div>

            {/* Table Card */}
            <div className={cn(
                "rounded-3xl border overflow-hidden",
                isDark ? "bg-[#111113] border-gray-800" : "bg-white border-slate-100"
            )}>
                <table className="w-full">
                    <thead>
                        <tr className={cn(
                            "border-b",
                            isDark ? "bg-gray-800 border-gray-700" : "bg-slate-100 border-slate-200"
                        )}>
                            {/* Email - Sortable */}
                            <th
                                onClick={() => { setSortField('email'); setSortOrder(sortField === 'email' && sortOrder === 'asc' ? 'desc' : 'asc'); }}
                                className={cn("px-6 py-4 text-left text-xs font-semibold cursor-pointer select-none hover:bg-black/5", isDark ? "text-gray-400" : "text-slate-500")}
                            >
                                <div className="flex items-center gap-1">
                                    {t.email}
                                    {sortField === 'email' && (
                                        sortOrder === 'asc' ? <ArrowUp size={12} className="text-[#21DBA4]" /> : <ArrowDown size={12} className="text-[#21DBA4]" />
                                    )}
                                </div>
                            </th>
                            {/* Plan - Sortable */}
                            <th
                                onClick={() => { setSortField('plan'); setSortOrder(sortField === 'plan' && sortOrder === 'asc' ? 'desc' : 'asc'); }}
                                className={cn("px-6 py-4 text-center text-xs font-semibold cursor-pointer select-none hover:bg-black/5", isDark ? "text-gray-400" : "text-slate-500")}
                            >
                                <div className="flex items-center justify-center gap-1">
                                    {t.plan}
                                    {sortField === 'plan' && (
                                        sortOrder === 'asc' ? <ArrowUp size={12} className="text-[#21DBA4]" /> : <ArrowDown size={12} className="text-[#21DBA4]" />
                                    )}
                                </div>
                            </th>
                            {/* Clips - Sortable */}
                            <th
                                onClick={() => { setSortField('clips'); setSortOrder(sortField === 'clips' && sortOrder === 'asc' ? 'desc' : 'asc'); }}
                                className={cn("px-6 py-4 text-center text-xs font-semibold cursor-pointer select-none hover:bg-black/5", isDark ? "text-gray-400" : "text-slate-500")}
                            >
                                <div className="flex items-center justify-center gap-1">
                                    {t.clips}
                                    {sortField === 'clips' && (
                                        sortOrder === 'asc' ? <ArrowUp size={12} className="text-[#21DBA4]" /> : <ArrowDown size={12} className="text-[#21DBA4]" />
                                    )}
                                </div>
                            </th>
                            {/* Date - Sortable */}
                            <th
                                onClick={() => { setSortField('date'); setSortOrder(sortField === 'date' && sortOrder === 'asc' ? 'desc' : 'asc'); }}
                                className={cn("px-6 py-4 text-center text-xs font-semibold cursor-pointer select-none hover:bg-black/5", isDark ? "text-gray-400" : "text-slate-500")}
                            >
                                <div className="flex items-center justify-center gap-1">
                                    {t.date}
                                    {sortField === 'date' && (
                                        sortOrder === 'asc' ? <ArrowUp size={12} className="text-[#21DBA4]" /> : <ArrowDown size={12} className="text-[#21DBA4]" />
                                    )}
                                </div>
                            </th>
                            <th className={cn("px-6 py-4 text-center text-xs font-semibold", isDark ? "text-gray-400" : "text-slate-500")}>{t.status}</th>
                            <th className="w-12"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-slate-400">{t.noUsers}</td>
                            </tr>
                        ) : (
                            filteredUsers.map(user => (
                                <React.Fragment key={user.id}>
                                    {/* Main Row */}
                                    <tr
                                        onClick={() => setExpandedUserId(expandedUserId === user.id ? null : user.id)}
                                        className={cn(
                                            "border-b cursor-pointer transition-colors",
                                            isDark ? "border-gray-800 hover:bg-gray-800/50" : "border-slate-100 hover:bg-slate-50",
                                            expandedUserId === user.id && (isDark ? "bg-gray-800/50" : "bg-slate-50")
                                        )}
                                    >
                                        <td className="px-6 py-4">
                                            <span className={cn("text-sm", isDark ? "text-white" : "text-slate-800")}>{user.email}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant={user.plan === 'Master' || user.plan === 'Pro' ? 'pro' : 'free'} isDark={isDark}>{user.plan}</Badge>
                                        </td>
                                        <td className={cn("px-6 py-4 text-center text-sm", isDark ? "text-gray-400" : "text-slate-600")}>{user.clipCount || 0}</td>
                                        <td className={cn("px-6 py-4 text-center text-sm", isDark ? "text-gray-400" : "text-slate-600")}>
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant="success" isDark={isDark}>{t.active}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {expandedUserId === user.id ? (
                                                <ChevronUp size={16} className="text-slate-400 mx-auto" />
                                            ) : (
                                                <ChevronDown size={16} className="text-slate-400 mx-auto" />
                                            )}
                                        </td>
                                    </tr>

                                    {/* Expanded Details Row */}
                                    {expandedUserId === user.id && (
                                        <tr className={isDark ? "bg-gray-900/20" : "bg-slate-50/30"}>
                                            <td colSpan={6} className="px-6 py-6">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {/* Basic Info */}
                                                    <div className={cn("p-4 rounded-2xl", isDark ? "bg-gray-800/50" : "bg-white border border-slate-100")}>
                                                        <h4 className={cn("text-sm font-semibold mb-4", isDark ? "text-gray-300" : "text-slate-700")}>{t.basicInfo}</h4>
                                                        <div className="space-y-3">
                                                            <div className="flex items-start gap-2">
                                                                <Mail size={14} className="text-slate-400 mt-0.5" />
                                                                <div>
                                                                    <p className={cn("text-xs", isDark ? "text-gray-500" : "text-slate-500")}>{t.email}</p>
                                                                    <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-800")}>{user.email}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start gap-2">
                                                                <User size={14} className="text-slate-400 mt-0.5" />
                                                                <div>
                                                                    <p className={cn("text-xs", isDark ? "text-gray-500" : "text-slate-500")}>{t.userId}</p>
                                                                    <p className={cn("text-xs font-mono", isDark ? "text-gray-400" : "text-slate-600")}>{user.id}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start gap-2">
                                                                <Calendar size={14} className="text-slate-400 mt-0.5" />
                                                                <div>
                                                                    <p className={cn("text-xs", isDark ? "text-gray-500" : "text-slate-500")}>{t.joinDate}</p>
                                                                    <p className={cn("text-sm", isDark ? "text-white" : "text-slate-800")}>
                                                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start gap-2">
                                                                <Clock size={14} className="text-slate-400 mt-0.5" />
                                                                <div>
                                                                    <p className={cn("text-xs", isDark ? "text-gray-500" : "text-slate-500")}>{t.lastAccess}</p>
                                                                    <p className={cn("text-sm", isDark ? "text-white" : "text-slate-800")}>
                                                                        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : '-'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Platform Clips */}
                                                    <div className={cn("p-4 rounded-2xl", isDark ? "bg-gray-800/50" : "bg-white border border-slate-100")}>
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h4 className={cn("text-sm font-semibold", isDark ? "text-gray-300" : "text-slate-700")}>{t.platformClips}</h4>
                                                            <span className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-800")}>{user.clipCount || 0}</span>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            {[
                                                                { name: 'YouTube', count: user.platforms?.youtube || 0, color: '#FF0000' },
                                                                { name: 'Instagram', count: user.platforms?.instagram || 0, color: '#E4405F' },
                                                                { name: 'Threads', count: user.platforms?.threads || 0, color: isDark ? '#FFFFFF' : '#000000' },
                                                                { name: 'Web', count: user.platforms?.web || 0, color: '#21DBA4' }
                                                            ].map(p => (
                                                                <div key={p.name} className={cn("p-3 rounded-xl", isDark ? "bg-gray-900/50" : "bg-slate-50")}>
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                                                                        <span className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-800")}>{p.count}</span>
                                                                    </div>
                                                                    <span className={cn("text-xs", isDark ? "text-gray-500" : "text-slate-500")}>{p.name}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Subscription Management */}
                                                    <div className={cn("p-4 rounded-2xl", isDark ? "bg-gray-800/50" : "bg-white border border-slate-100")}>
                                                        <h4 className={cn("text-sm font-semibold mb-4", isDark ? "text-gray-300" : "text-slate-700")}>{t.subscriptionMgmt}</h4>
                                                        <p className={cn("text-xs mb-2", isDark ? "text-gray-500" : "text-slate-500")}>{t.changePlan}</p>
                                                        <div className="relative">
                                                            <select
                                                                defaultValue={user.plan}
                                                                className={cn(
                                                                    "w-full h-10 px-3 pr-10 rounded-xl border text-sm font-medium appearance-none cursor-pointer",
                                                                    isDark ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-slate-200 text-slate-800"
                                                                )}
                                                            >
                                                                <option value="Master">Master</option>
                                                                <option value="Pro">Pro</option>
                                                                <option value="Free">Free</option>
                                                            </select>
                                                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
