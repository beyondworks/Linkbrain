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
    Sparkles,
    Shield
} from 'lucide-react';
import { cn } from '../ui/utils';
import { toast } from 'sonner';

interface UsersPanelProps {
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    admin: ReturnType<typeof useAdmin>;
}

type SortField = 'email' | 'clipCount' | 'createdAt' | 'lastLoginAt';
type SortOrder = 'asc' | 'desc';

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
        selectAll: language === 'ko' ? '전체 선택' : 'Select All',
        deselectAll: language === 'ko' ? '전체 해제' : 'Deselect All',
        selected: language === 'ko' ? '명 선택됨' : ' selected',
        bulkAdjust: language === 'ko' ? '일괄 기간 조정' : 'Bulk Adjust Period',
        days: language === 'ko' ? '일' : 'days',
        apply: language === 'ko' ? '적용' : 'Apply',
        changePlan: language === 'ko' ? '플랜 변경' : 'Change Plan'
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

    const toggleSelectAll = () => {
        if (selectedUsers.size === filteredUsers.length) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
        }
    };

    const filteredUsers = useMemo(() => users
        .filter(user => user.email.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            let cmp = 0;
            switch (sortField) {
                case 'email': cmp = a.email.localeCompare(b.email); break;
                case 'clipCount': cmp = a.clipCount - b.clipCount; break;
                case 'createdAt': cmp = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime(); break;
                case 'lastLoginAt': cmp = new Date(a.lastLoginAt || 0).getTime() - new Date(b.lastLoginAt || 0).getTime(); break;
            }
            return sortOrder === 'asc' ? cmp : -cmp;
        }), [users, searchQuery, sortField, sortOrder]);

    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const getTrialDaysRemaining = (trialEndDate: string | undefined): number | null => {
        if (!trialEndDate) return null;
        const endDate = new Date(trialEndDate);
        const now = new Date();
        const diff = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const getPlanBadge = (user: typeof users[0]) => {
        if (user.subscriptionTier === 'master') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold bg-purple-500/15 text-purple-500">
                    <Shield size={10} /> Master
                </span>
            );
        }
        if (user.subscriptionTier === 'pro') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold bg-amber-500/15 text-amber-500">
                    <Crown size={10} /> Pro
                </span>
            );
        }
        // Free tier - show trial days
        const daysLeft = getTrialDaysRemaining(user.trialEndDate);
        if (daysLeft !== null && daysLeft > 0) {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold bg-blue-500/15 text-blue-500">
                    <Clock size={10} /> {daysLeft}{t.daysLeft}
                </span>
            );
        }
        if (daysLeft !== null && daysLeft <= 0) {
            return (
                <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold",
                    isDark ? "bg-red-500/15 text-red-400" : "bg-red-100 text-red-600")}>
                    <Clock size={10} /> {t.expired}
                </span>
            );
        }
        return <span className={cn("text-xs font-medium", textSub)}>Free</span>;
    };

    // Stats
    const stats = useMemo(() => ({
        master: users.filter(u => u.subscriptionTier === 'master').length,
        pro: users.filter(u => u.subscriptionTier === 'pro').length,
        free: users.filter(u => u.subscriptionTier !== 'pro' && u.subscriptionTier !== 'master').length
    }), [users]);

    if (usersLoading && users.length === 0) {
        return (
            <div className={cn("rounded-2xl border p-16 text-center", card, cardBorder)}>
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

            {/* Stats */}
            <div className={cn("rounded-2xl border p-5 flex flex-wrap items-center justify-between gap-4", card, cardBorder)}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <User size={20} className="text-white" />
                    </div>
                    <div>
                        <p className={cn("text-3xl font-bold tabular-nums", text)}>{users.length}</p>
                        <p className={cn("text-xs", textSub)}>{t.totalUsers}</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <p className="text-xl font-bold text-purple-500 tabular-nums">{stats.master}</p>
                        <p className={cn("text-xs", textSub)}>Master</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-bold text-[#21DBA4] tabular-nums">{stats.pro}</p>
                        <p className={cn("text-xs", textSub)}>Pro</p>
                    </div>
                    <div className="text-center">
                        <p className={cn("text-xl font-bold tabular-nums", textMuted)}>{stats.free}</p>
                        <p className={cn("text-xs", textSub)}>Free</p>
                    </div>
                </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedUsers.size > 0 && (
                <div className={cn("rounded-2xl border p-4 flex flex-wrap items-center justify-between gap-4", card, cardBorder)}>
                    <div className="flex items-center gap-3">
                        <span className={cn("text-sm font-medium", text)}>
                            {selectedUsers.size}{t.selected}
                        </span>
                        <button onClick={() => setSelectedUsers(new Set())}
                            className={cn("text-xs px-3 py-1.5 rounded-lg transition-all", isDark ? "bg-white/5 hover:bg-white/10" : "bg-black/5 hover:bg-black/10", textMuted)}>
                            {t.deselectAll}
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={cn("text-xs", textSub)}>{t.bulkAdjust}:</span>
                        <input
                            type="number"
                            value={bulkDays}
                            onChange={(e) => setBulkDays(e.target.value)}
                            className={cn("w-16 px-2 py-1.5 rounded-lg border text-sm text-center",
                                isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200", text)}
                            min="0"
                        />
                        <span className={cn("text-xs", textSub)}>{t.days}</span>
                        <button
                            onClick={handleBulkTrialUpdate}
                            disabled={isBulkUpdating}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium bg-[#21DBA4] text-white hover:bg-[#1BC290] transition-all disabled:opacity-50">
                            {isBulkUpdating ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                            {t.apply}
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className={cn("rounded-2xl border overflow-hidden", card, cardBorder)}>
                <table className="w-full">
                    <thead className={tableBg}>
                        <tr className={cn("text-xs font-semibold uppercase tracking-wider", textSub)}>
                            <th className="w-10 px-4 py-4">
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
                            <th className="text-left px-4 py-4 w-[30%]">
                                <button onClick={() => handleSort('email')} className="flex items-center gap-1.5 hover:text-[#21DBA4] transition-colors">
                                    {t.email} <ArrowUpDown size={12} />
                                </button>
                            </th>
                            <th className="text-left px-4 py-4 w-[10%]">
                                <button onClick={() => handleSort('clipCount')} className="flex items-center gap-1.5 hover:text-[#21DBA4] transition-colors">
                                    {t.clips} <ArrowUpDown size={12} />
                                </button>
                            </th>
                            <th className="text-left px-4 py-4 w-[15%]">{t.plan}</th>
                            <th className="text-left px-4 py-4 w-[18%]">
                                <button onClick={() => handleSort('createdAt')} className="flex items-center gap-1.5 hover:text-[#21DBA4] transition-colors">
                                    {t.joined} <ArrowUpDown size={12} />
                                </button>
                            </th>
                            <th className="text-right px-5 py-4 w-[17%]">{t.lastLogin}</th>
                        </tr>
                    </thead>
                    <tbody className={cn("divide-y", divider)}>
                        {filteredUsers.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-12"><p className={textSub}>{t.noUsers}</p></td></tr>
                        ) : (
                            filteredUsers.map(user => (
                                <React.Fragment key={user.id}>
                                    <tr className={cn("cursor-pointer transition-colors", rowHover, selectedUsers.has(user.id) && (isDark ? "bg-[#21DBA4]/10" : "bg-[#21DBA4]/5"))}
                                        onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}>
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
                                                    "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
                                                    user.subscriptionTier === 'master'
                                                        ? "bg-gradient-to-br from-purple-400 to-purple-600 text-white"
                                                        : user.subscriptionTier === 'pro'
                                                            ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white"
                                                            : isDark ? "bg-white/10 text-gray-400" : "bg-gray-100 text-gray-500"
                                                )}>
                                                    {user.email.charAt(0).toUpperCase()}
                                                </div>
                                                <span className={cn("text-sm font-medium truncate max-w-[200px]", text)}>{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={cn("text-sm font-bold tabular-nums", text)}>{user.clipCount}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            {getPlanBadge(user)}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={cn("text-sm", textMuted)}>{formatDate(user.createdAt)}</span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <span className={cn("text-sm", textMuted)}>{formatDate(user.lastLoginAt)}</span>
                                                {expandedUser === user.id ? <ChevronUp size={14} className={textSub} /> : <ChevronDown size={14} className={textSub} />}
                                            </div>
                                        </td>
                                    </tr>
                                    {expandedUser === user.id && (
                                        <tr className={isDark ? 'bg-gray-900/30' : 'bg-gray-50/50'}>
                                            <td colSpan={6} className="px-5 py-5">
                                                <div className="flex flex-col sm:flex-row gap-6">
                                                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                        <div>
                                                            <p className={cn("text-xs mb-1 flex items-center gap-1", textSub)}><Mail size={10} /> {t.email}</p>
                                                            <p className={cn("text-sm font-medium", text)}>{user.email}</p>
                                                        </div>
                                                        <div>
                                                            <p className={cn("text-xs mb-1 flex items-center gap-1", textSub)}><FileText size={10} /> {t.clips}</p>
                                                            <p className={cn("text-sm font-bold tabular-nums", text)}>{user.clipCount}</p>
                                                        </div>
                                                        <div>
                                                            <p className={cn("text-xs mb-1 flex items-center gap-1", textSub)}><Calendar size={10} /> {t.joined}</p>
                                                            <p className={cn("text-sm", text)}>{formatDate(user.createdAt)}</p>
                                                        </div>
                                                        <div>
                                                            <p className={cn("text-xs mb-1 flex items-center gap-1", textSub)}><Calendar size={10} /> {t.lastLogin}</p>
                                                            <p className={cn("text-sm", text)}>{formatDate(user.lastLoginAt)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn("text-xs", textSub)}>{t.changePlan}:</span>
                                                        <select
                                                            value={user.subscriptionTier || 'free'}
                                                            onChange={(e) => handleUpdateSubscription(user.id, e.target.value as 'free' | 'pro' | 'master')}
                                                            disabled={updatingUser === user.id}
                                                            className={cn(
                                                                "px-3 py-2 rounded-lg border text-sm font-medium transition-all cursor-pointer",
                                                                isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
                                                                text
                                                            )}>
                                                            <option value="free">Free</option>
                                                            <option value="pro">Pro</option>
                                                            <option value="master">Master</option>
                                                        </select>
                                                        {updatingUser === user.id && <Loader2 size={14} className="animate-spin text-[#21DBA4]" />}
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
