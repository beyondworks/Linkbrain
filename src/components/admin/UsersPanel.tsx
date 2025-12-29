import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import {
    Search,
    RefreshCw,
    Loader2,
    ChevronDown,
    ChevronUp,
    Crown,
    User,
    Mail,
    Calendar,
    FileText,
    ArrowUpDown,
    Check,
    Clock,
    Shield,
    Globe,
    Youtube,
    Instagram,
    Link2,
    AtSign,
    Filter,
    X
} from 'lucide-react';
import { cn } from '../ui/utils';
import { SectionHeader } from '../shared/SectionHeader';
import { toast } from 'sonner';

interface UsersPanelProps {
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    admin: ReturnType<typeof useAdmin>;
}

type SortField = 'email' | 'clipCount' | 'createdAt' | 'lastLoginAt';
type SortOrder = 'asc' | 'desc';
type PlanFilter = 'all' | 'master' | 'pro' | 'free';

// Master emails for automatic recognition
const MASTER_EMAILS = ['beyondworks.br@gmail.com'];

export function UsersPanel({ theme, language, admin }: UsersPanelProps) {
    const { users, usersLoading, fetchUserList, updateUserSubscription, bulkUpdateTrialPeriod } = admin;
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<SortField>('clipCount');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [expandedUser, setExpandedUser] = useState<string | null>(null);
    const [updatingUser, setUpdatingUser] = useState<string | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [bulkDays, setBulkDays] = useState<string>('15');
    const [isBulkUpdating, setIsBulkUpdating] = useState(false);
    const [planFilter, setPlanFilter] = useState<PlanFilter>('all');
    const isDark = theme === 'dark';

    // Theme
    const card = isDark ? 'bg-[#161B22]' : 'bg-white';
    const cardBorder = isDark ? 'border-gray-800' : 'border-gray-200';
    const text = isDark ? 'text-white' : 'text-gray-900';
    const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
    const textSub = isDark ? 'text-gray-500' : 'text-gray-400';
    const tableBg = isDark ? 'bg-gray-900/50' : 'bg-gray-50';
    const rowHover = isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50';
    const divider = isDark ? 'border-gray-800' : 'border-gray-200';

    useEffect(() => { fetchUserList(); }, [fetchUserList]);

    const t = {
        title: language === 'ko' ? '유저 관리' : 'User Management',
        subtitle: language === 'ko' ? '유저 목록 및 구독 관리' : 'Manage users & subscriptions',
        search: language === 'ko' ? '이메일 검색...' : 'Search by email...',
        email: language === 'ko' ? '이메일' : 'Email',
        clips: language === 'ko' ? '클립' : 'Clips',
        plan: language === 'ko' ? '플랜' : 'Plan',
        joined: language === 'ko' ? '가입일' : 'Joined',
        lastLogin: language === 'ko' ? '마지막 접속' : 'Last Login',
        loading: language === 'ko' ? '로딩 중...' : 'Loading...',
        noUsers: language === 'ko' ? '유저가 없습니다' : 'No users found',
        totalUsers: language === 'ko' ? '전체 유저' : 'Total Users',
        daysLeft: language === 'ko' ? '일 남음' : 'days left',
        expired: language === 'ko' ? '만료됨' : 'Expired',
        selected: language === 'ko' ? '명 선택됨' : ' selected',
        bulkAdjust: language === 'ko' ? '체험 기간' : 'Trial Period',
        days: language === 'ko' ? '일' : 'days',
        apply: language === 'ko' ? '적용' : 'Apply',
        changePlan: language === 'ko' ? '플랜 변경' : 'Change Plan',
        platforms: language === 'ko' ? '플랫폼별 클립' : 'Clips by Platform',
        trialEnd: language === 'ko' ? '체험 종료일' : 'Trial Ends',
        userId: language === 'ko' ? '유저 ID' : 'User ID',
        filteringBy: language === 'ko' ? '필터' : 'Filter',
        clearFilter: language === 'ko' ? '필터 해제' : 'Clear'
    };

    // Get effective tier (considering master emails)
    const getEffectiveTier = (user: typeof users[0]): 'free' | 'pro' | 'master' => {
        if (MASTER_EMAILS.includes(user.email)) return 'master';
        return user.subscriptionTier || 'free';
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) { setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }
        else { setSortField(field); setSortOrder('desc'); }
    };

    const handleUpdateSubscription = async (userId: string, tier: 'free' | 'pro' | 'master') => {
        setUpdatingUser(userId);
        try {
            await updateUserSubscription(userId, tier);
            toast.success(language === 'ko' ? '플랜이 변경되었습니다' : 'Plan updated');
        } catch (error) {
            console.error('Failed:', error);
            toast.error(language === 'ko' ? '변경 실패' : 'Update failed');
        } finally {
            setUpdatingUser(null);
        }
    };

    const handleBulkTrialUpdate = async () => {
        if (selectedUsers.size === 0) return;
        const days = parseInt(bulkDays);
        if (isNaN(days) || days < 0) {
            toast.error(language === 'ko' ? '올바른 일수를 입력하세요' : 'Enter valid days');
            return;
        }
        setIsBulkUpdating(true);
        try {
            await bulkUpdateTrialPeriod(Array.from(selectedUsers), days);
            toast.success(language === 'ko'
                ? `${selectedUsers.size}명의 체험 기간이 ${days}일로 설정되었습니다`
                : `Trial period set to ${days} days for ${selectedUsers.size} users`);
            setSelectedUsers(new Set());
        } catch (error) {
            toast.error(language === 'ko' ? '일괄 수정 실패' : 'Bulk update failed');
        } finally {
            setIsBulkUpdating(false);
        }
    };

    const toggleUserSelection = (userId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newSet = new Set(selectedUsers);
        if (newSet.has(userId)) {
            newSet.delete(userId);
        } else {
            newSet.add(userId);
        }
        setSelectedUsers(newSet);
    };

    // Users with effective tier applied
    const usersWithTier = useMemo(() => users.map(user => ({
        ...user,
        effectiveTier: getEffectiveTier(user)
    })), [users]);

    // Filter and sort
    const filteredUsers = useMemo(() => {
        let result = usersWithTier;

        // Plan filter
        if (planFilter !== 'all') {
            result = result.filter(user => user.effectiveTier === planFilter);
        }

        // Search filter
        if (searchQuery) {
            result = result.filter(user => user.email.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        // Sort
        result = [...result].sort((a, b) => {
            let cmp = 0;
            switch (sortField) {
                case 'email': cmp = a.email.localeCompare(b.email); break;
                case 'clipCount': cmp = a.clipCount - b.clipCount; break;
                case 'createdAt': cmp = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime(); break;
                case 'lastLoginAt': cmp = new Date(a.lastLoginAt || 0).getTime() - new Date(b.lastLoginAt || 0).getTime(); break;
            }
            return sortOrder === 'asc' ? cmp : -cmp;
        });

        return result;
    }, [usersWithTier, searchQuery, sortField, sortOrder, planFilter]);

    const toggleSelectAll = () => {
        if (selectedUsers.size === filteredUsers.length) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
        }
    };

    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const formatFullDate = (dateStr: string | undefined) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('ko-KR', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const getTrialDaysRemaining = (trialEndDate: string | undefined): number | null => {
        if (!trialEndDate) return null;
        const endDate = new Date(trialEndDate);
        const now = new Date();
        const diff = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const getPlanBadge = (user: typeof filteredUsers[0]) => {
        const tier = user.effectiveTier;
        if (tier === 'master') {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-500">
                    <Shield size={11} /> Master
                </span>
            );
        }
        if (tier === 'pro') {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-500">
                    <Crown size={11} /> Pro
                </span>
            );
        }
        // Free tier - show trial days
        const daysLeft = getTrialDaysRemaining(user.trialEndDate);
        if (daysLeft !== null && daysLeft > 0) {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-500">
                    <Clock size={11} /> {daysLeft}{t.daysLeft}
                </span>
            );
        }
        if (daysLeft !== null && daysLeft <= 0) {
            return (
                <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold",
                    isDark ? "bg-red-500/15 text-red-400" : "bg-red-100 text-red-600")}>
                    <Clock size={11} /> {t.expired}
                </span>
            );
        }
        return <span className={cn("text-xs font-medium px-2.5 py-1", textSub)}>Free</span>;
    };

    // Stats
    const stats = useMemo(() => ({
        master: usersWithTier.filter(u => u.effectiveTier === 'master').length,
        pro: usersWithTier.filter(u => u.effectiveTier === 'pro').length,
        free: usersWithTier.filter(u => u.effectiveTier === 'free').length
    }), [usersWithTier]);

    if (usersLoading && users.length === 0) {
        return (
            <div className={cn("rounded-3xl border p-16 text-center", card, cardBorder)}>
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
                <p className={textMuted}>{t.loading}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className={cn("text-2xl font-bold tracking-tight mb-1", text)}>{t.title}</h2>
                    <p className={cn("text-sm", textSub)}>{t.subtitle}</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl border", isDark ? 'bg-gray-800/50' : 'bg-white', cardBorder)}>
                        <Search size={14} className={textSub} />
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t.search} className={cn("bg-transparent border-none outline-none text-sm w-40", text)} />
                    </div>
                    <button onClick={() => fetchUserList()} disabled={usersLoading}
                        className={cn("p-2.5 rounded-xl transition-all", isDark ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10")}>
                        <RefreshCw size={16} className={cn(textMuted, usersLoading && 'animate-spin')} />
                    </button>
                </div>
            </div>

            {/* Stats with Clickable Filters */}
            <div className={cn("rounded-3xl border p-5", card, cardBorder)}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <User size={20} className="text-white" />
                        </div>
                        <div>
                            <p className={cn("text-3xl font-bold tabular-nums", text)}>{users.length}</p>
                            <p className={cn("text-xs", textSub)}>{t.totalUsers}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Master */}
                        <button
                            onClick={() => setPlanFilter(planFilter === 'master' ? 'all' : 'master')}
                            className={cn(
                                "flex flex-col items-center px-4 py-2 rounded-xl transition-all cursor-pointer border-2",
                                planFilter === 'master'
                                    ? "border-purple-500 bg-purple-500/10"
                                    : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
                            )}>
                            <p className="text-xl font-bold text-purple-500 tabular-nums">{stats.master}</p>
                            <p className={cn("text-xs", textSub)}>Master</p>
                        </button>
                        {/* Pro */}
                        <button
                            onClick={() => setPlanFilter(planFilter === 'pro' ? 'all' : 'pro')}
                            className={cn(
                                "flex flex-col items-center px-4 py-2 rounded-xl transition-all cursor-pointer border-2",
                                planFilter === 'pro'
                                    ? "border-[#21DBA4] bg-[#21DBA4]/10"
                                    : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
                            )}>
                            <p className="text-xl font-bold text-[#21DBA4] tabular-nums">{stats.pro}</p>
                            <p className={cn("text-xs", textSub)}>Pro</p>
                        </button>
                        {/* Free */}
                        <button
                            onClick={() => setPlanFilter(planFilter === 'free' ? 'all' : 'free')}
                            className={cn(
                                "flex flex-col items-center px-4 py-2 rounded-xl transition-all cursor-pointer border-2",
                                planFilter === 'free'
                                    ? "border-gray-400 bg-gray-400/10"
                                    : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
                            )}>
                            <p className={cn("text-xl font-bold tabular-nums", textMuted)}>{stats.free}</p>
                            <p className={cn("text-xs", textSub)}>Free</p>
                        </button>
                    </div>
                </div>

                {/* Active Filter Indicator */}
                {planFilter !== 'all' && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
                        <Filter size={14} className={textSub} />
                        <span className={cn("text-sm", textMuted)}>{t.filteringBy}:</span>
                        <span className={cn(
                            "px-2 py-0.5 rounded-full text-xs font-medium",
                            planFilter === 'master' ? "bg-purple-500/15 text-purple-500" :
                                planFilter === 'pro' ? "bg-[#21DBA4]/15 text-[#21DBA4]" :
                                    "bg-gray-500/15 text-gray-500"
                        )}>
                            {planFilter.charAt(0).toUpperCase() + planFilter.slice(1)} ({filteredUsers.length})
                        </span>
                        <button
                            onClick={() => setPlanFilter('all')}
                            className={cn("text-xs px-2 py-0.5 rounded-lg", isDark ? "hover:bg-white/10" : "hover:bg-black/5", textSub)}>
                            {t.clearFilter}
                        </button>
                    </div>
                )}
            </div>

            {/* Bulk Actions Bar */}
            {selectedUsers.size > 0 && (
                <div className={cn("rounded-3xl border p-4 flex flex-wrap items-center justify-between gap-4", card, cardBorder)}>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#21DBA4] flex items-center justify-center">
                                <Check size={12} className="text-white" />
                            </div>
                            <span className={cn("text-sm font-semibold", text)}>
                                {selectedUsers.size}{t.selected}
                            </span>
                        </div>
                        <button onClick={() => setSelectedUsers(new Set())}
                            className={cn("text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all",
                                isDark ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10", textMuted)}>
                            <X size={12} /> {language === 'ko' ? '선택 해제' : 'Clear'}
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={cn("text-xs font-medium", textSub)}>{t.bulkAdjust}:</span>
                        <div className="flex items-center gap-1">
                            <input
                                type="number"
                                value={bulkDays}
                                onChange={(e) => setBulkDays(e.target.value)}
                                className={cn("w-16 px-3 py-2 rounded-lg border text-sm text-center font-medium",
                                    isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200", text)}
                                min="0"
                            />
                            <span className={cn("text-sm", textSub)}>{t.days}</span>
                        </div>
                        <button
                            onClick={handleBulkTrialUpdate}
                            disabled={isBulkUpdating}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#21DBA4] text-white hover:bg-[#1BC290] transition-all disabled:opacity-50">
                            {isBulkUpdating ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                            {t.apply}
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className={cn("rounded-3xl border overflow-hidden", card, cardBorder)}>
                <table className="w-full">
                    <thead className={tableBg}>
                        <tr className={cn("text-xs font-semibold uppercase tracking-wider", textSub)}>
                            <th className="w-12 px-4 py-4">
                                <button
                                    onClick={toggleSelectAll}
                                    className={cn("w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                                        selectedUsers.size === filteredUsers.length && filteredUsers.length > 0
                                            ? "bg-[#21DBA4] border-[#21DBA4] text-white"
                                            : isDark ? "border-gray-600 hover:border-gray-400" : "border-gray-300 hover:border-gray-400"
                                    )}>
                                    {selectedUsers.size === filteredUsers.length && filteredUsers.length > 0 && <Check size={12} />}
                                </button>
                            </th>
                            <th className="text-left px-4 py-4">
                                <button onClick={() => handleSort('email')} className="flex items-center gap-1.5 hover:text-[#21DBA4] transition-colors">
                                    {t.email} <ArrowUpDown size={12} />
                                </button>
                            </th>
                            <th className="text-center px-4 py-4 w-20">
                                <button onClick={() => handleSort('clipCount')} className="flex items-center gap-1.5 hover:text-[#21DBA4] transition-colors mx-auto">
                                    {t.clips} <ArrowUpDown size={12} />
                                </button>
                            </th>
                            <th className="text-center px-4 py-4 w-28">{t.plan}</th>
                            <th className="text-center px-4 py-4 w-32">
                                <button onClick={() => handleSort('createdAt')} className="flex items-center gap-1.5 hover:text-[#21DBA4] transition-colors mx-auto">
                                    {t.joined} <ArrowUpDown size={12} />
                                </button>
                            </th>
                            <th className="text-center px-5 py-4 w-32">
                                <button onClick={() => handleSort('lastLoginAt')} className="flex items-center gap-1.5 hover:text-[#21DBA4] transition-colors mx-auto">
                                    {t.lastLogin} <ArrowUpDown size={12} />
                                </button>
                            </th>
                            <th className="w-10"></th>
                        </tr>
                    </thead>
                    <tbody className={cn("divide-y", divider)}>
                        {filteredUsers.length === 0 ? (
                            <tr><td colSpan={7} className="text-center py-12"><p className={textSub}>{t.noUsers}</p></td></tr>
                        ) : (
                            filteredUsers.map(user => (
                                <React.Fragment key={user.id}>
                                    <tr className={cn("transition-colors", rowHover,
                                        selectedUsers.has(user.id) && (isDark ? "bg-[#21DBA4]/10" : "bg-[#21DBA4]/5"),
                                        expandedUser === user.id && (isDark ? "bg-gray-800/50" : "bg-gray-50")
                                    )}>
                                        <td className="px-4 py-4">
                                            <button
                                                onClick={(e) => toggleUserSelection(user.id, e)}
                                                className={cn("w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                                                    selectedUsers.has(user.id)
                                                        ? "bg-[#21DBA4] border-[#21DBA4] text-white"
                                                        : isDark ? "border-gray-600 hover:border-gray-400" : "border-gray-300 hover:border-gray-400"
                                                )}>
                                                {selectedUsers.has(user.id) && <Check size={12} />}
                                            </button>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0",
                                                    user.effectiveTier === 'master'
                                                        ? "bg-gradient-to-br from-purple-400 to-purple-600 text-white"
                                                        : user.effectiveTier === 'pro'
                                                            ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white"
                                                            : isDark ? "bg-white/10 text-gray-400" : "bg-gray-100 text-gray-500"
                                                )}>
                                                    {user.email.charAt(0).toUpperCase()}
                                                </div>
                                                <span className={cn("text-sm font-medium", text)}>{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className={cn("text-sm font-bold tabular-nums", text)}>{user.clipCount}</span>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            {getPlanBadge(user)}
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className={cn("text-sm", textMuted)}>{formatDate(user.createdAt)}</span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className={cn("text-sm", textMuted)}>{formatDate(user.lastLoginAt)}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <button
                                                onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                                                className={cn("p-1.5 rounded-lg transition-all", isDark ? "hover:bg-white/10" : "hover:bg-black/5")}>
                                                {expandedUser === user.id ? <ChevronUp size={16} className={textSub} /> : <ChevronDown size={16} className={textSub} />}
                                            </button>
                                        </td>
                                    </tr>
                                    {/* Expanded Detail Row */}
                                    {expandedUser === user.id && (
                                        <tr className={isDark ? 'bg-gray-900/50' : 'bg-gray-50'}>
                                            <td colSpan={7} className="px-6 py-6">
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                    {/* Basic Info */}
                                                    <div className={cn("p-4 rounded-xl border", isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200")}>
                                                        <h4 className={cn("text-xs font-semibold uppercase tracking-wider mb-4", textSub)}>
                                                            {language === 'ko' ? '기본 정보' : 'Basic Info'}
                                                        </h4>
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-3">
                                                                <Mail size={14} className={textSub} />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className={cn("text-xs", textSub)}>{t.email}</p>
                                                                    <p className={cn("text-sm font-medium truncate", text)}>{user.email}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <User size={14} className={textSub} />
                                                                <div>
                                                                    <p className={cn("text-xs", textSub)}>{t.userId}</p>
                                                                    <p className={cn("text-xs font-mono", textMuted)}>{user.id}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <Calendar size={14} className={textSub} />
                                                                <div>
                                                                    <p className={cn("text-xs", textSub)}>{t.joined}</p>
                                                                    <p className={cn("text-sm", text)}>{formatFullDate(user.createdAt)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <Clock size={14} className={textSub} />
                                                                <div>
                                                                    <p className={cn("text-xs", textSub)}>{t.lastLogin}</p>
                                                                    <p className={cn("text-sm", text)}>{formatFullDate(user.lastLoginAt)}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Platform Stats */}
                                                    <div className={cn("p-4 rounded-xl border", isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200")}>
                                                        <h4 className={cn("text-xs font-semibold uppercase tracking-wider mb-4", textSub)}>
                                                            {t.platforms}
                                                        </h4>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className={cn("flex items-center gap-2 p-2 rounded-lg", isDark ? "bg-red-500/10" : "bg-red-50")}>
                                                                <Youtube size={16} className="text-red-500" />
                                                                <div>
                                                                    <p className="text-lg font-bold text-red-500 tabular-nums">{user.platforms.youtube}</p>
                                                                    <p className={cn("text-xs", textSub)}>YouTube</p>
                                                                </div>
                                                            </div>
                                                            <div className={cn("flex items-center gap-2 p-2 rounded-lg", isDark ? "bg-pink-500/10" : "bg-pink-50")}>
                                                                <Instagram size={16} className="text-pink-500" />
                                                                <div>
                                                                    <p className="text-lg font-bold text-pink-500 tabular-nums">{user.platforms.instagram}</p>
                                                                    <p className={cn("text-xs", textSub)}>Instagram</p>
                                                                </div>
                                                            </div>
                                                            <div className={cn("flex items-center gap-2 p-2 rounded-lg", isDark ? "bg-gray-500/10" : "bg-gray-50")}>
                                                                <AtSign size={16} className={textMuted} />
                                                                <div>
                                                                    <p className={cn("text-lg font-bold tabular-nums", textMuted)}>{user.platforms.threads}</p>
                                                                    <p className={cn("text-xs", textSub)}>Threads</p>
                                                                </div>
                                                            </div>
                                                            <div className={cn("flex items-center gap-2 p-2 rounded-lg", isDark ? "bg-blue-500/10" : "bg-blue-50")}>
                                                                <Globe size={16} className="text-blue-500" />
                                                                <div>
                                                                    <p className="text-lg font-bold text-blue-500 tabular-nums">{user.platforms.web}</p>
                                                                    <p className={cn("text-xs", textSub)}>Web</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                                            <div className="flex items-center justify-between">
                                                                <span className={cn("text-sm", textSub)}>Total</span>
                                                                <span className={cn("text-lg font-bold", text)}>{user.clipCount}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Subscription Management */}
                                                    <div className={cn("p-4 rounded-xl border", isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200")}>
                                                        <h4 className={cn("text-xs font-semibold uppercase tracking-wider mb-4", textSub)}>
                                                            {language === 'ko' ? '구독 관리' : 'Subscription'}
                                                        </h4>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <p className={cn("text-xs mb-2", textSub)}>{t.changePlan}</p>
                                                                <div className="flex items-center gap-2">
                                                                    <select
                                                                        value={user.effectiveTier}
                                                                        onChange={(e) => handleUpdateSubscription(user.id, e.target.value as 'free' | 'pro' | 'master')}
                                                                        disabled={updatingUser === user.id}
                                                                        className={cn(
                                                                            "flex-1 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all cursor-pointer",
                                                                            isDark ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200",
                                                                            text
                                                                        )}>
                                                                        <option value="free">🆓 Free</option>
                                                                        <option value="pro">👑 Pro</option>
                                                                        <option value="master">🛡️ Master</option>
                                                                    </select>
                                                                    {updatingUser === user.id && <Loader2 size={18} className="animate-spin text-[#21DBA4]" />}
                                                                </div>
                                                            </div>
                                                            {user.effectiveTier === 'free' && (
                                                                <div>
                                                                    <p className={cn("text-xs mb-2", textSub)}>{t.trialEnd}</p>
                                                                    <p className={cn("text-sm font-medium", text)}>
                                                                        {user.trialEndDate ? formatFullDate(user.trialEndDate) : '-'}
                                                                    </p>
                                                                    {user.trialEndDate && (
                                                                        <p className={cn("text-xs mt-1",
                                                                            getTrialDaysRemaining(user.trialEndDate)! > 0 ? "text-blue-500" : "text-red-500")}>
                                                                            {getTrialDaysRemaining(user.trialEndDate)! > 0
                                                                                ? `${getTrialDaysRemaining(user.trialEndDate)}${t.daysLeft}`
                                                                                : t.expired
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            )}
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
