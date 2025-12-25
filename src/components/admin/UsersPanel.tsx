import * as React from 'react';
import { useEffect, useState } from 'react';
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
    X,
    ArrowUpDown
} from 'lucide-react';
import { cn } from '../ui/utils';

interface UsersPanelProps {
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    admin: ReturnType<typeof useAdmin>;
}

type SortField = 'email' | 'clipCount' | 'createdAt' | 'lastLoginAt';
type SortOrder = 'asc' | 'desc';

export function UsersPanel({ theme, language, admin }: UsersPanelProps) {
    const { users, usersLoading, fetchUserList, updateUserSubscription } = admin;
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<SortField>('clipCount');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [expandedUser, setExpandedUser] = useState<string | null>(null);
    const [updatingUser, setUpdatingUser] = useState<string | null>(null);
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
        grantPro: language === 'ko' ? 'Pro 부여' : 'Grant Pro',
        revokePro: language === 'ko' ? 'Pro 해제' : 'Revoke Pro',
        loading: language === 'ko' ? '로딩 중...' : 'Loading...',
        noUsers: language === 'ko' ? '유저가 없습니다' : 'No users found',
        totalUsers: language === 'ko' ? '전체 유저' : 'Total Users'
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) { setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }
        else { setSortField(field); setSortOrder('desc'); }
    };

    const handleUpdateSubscription = async (userId: string, tier: 'free' | 'pro') => {
        setUpdatingUser(userId);
        try { await updateUserSubscription(userId, tier); }
        catch (error) { console.error('Failed:', error); }
        finally { setUpdatingUser(null); }
    };

    const filteredUsers = users
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
        });

    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    };

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
                        <p className="text-xl font-bold text-[#21DBA4] tabular-nums">{users.filter(u => u.subscriptionTier === 'pro').length}</p>
                        <p className={cn("text-xs", textSub)}>Pro</p>
                    </div>
                    <div className="text-center">
                        <p className={cn("text-xl font-bold tabular-nums", textMuted)}>{users.filter(u => u.subscriptionTier !== 'pro').length}</p>
                        <p className={cn("text-xs", textSub)}>Free</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className={cn("rounded-2xl border overflow-hidden", card, cardBorder)}>
                {/* Using HTML table for proper alignment */}
                <table className="w-full">
                    <thead className={tableBg}>
                        <tr className={cn("text-xs font-semibold uppercase tracking-wider", textSub)}>
                            <th className="text-left px-5 py-4 w-[35%]">
                                <button onClick={() => handleSort('email')} className="flex items-center gap-1.5 hover:text-[#21DBA4] transition-colors">
                                    {t.email} <ArrowUpDown size={12} />
                                </button>
                            </th>
                            <th className="text-left px-4 py-4 w-[12%]">
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
                            <th className="text-right px-5 py-4 w-[20%]">{t.lastLogin}</th>
                        </tr>
                    </thead>
                    <tbody className={cn("divide-y", divider)}>
                        {filteredUsers.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-12"><p className={textSub}>{t.noUsers}</p></td></tr>
                        ) : (
                            filteredUsers.map(user => (
                                <React.Fragment key={user.id}>
                                    <tr className={cn("cursor-pointer transition-colors", rowHover)} onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
                                                    user.subscriptionTier === 'pro'
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
                                            {user.subscriptionTier === 'pro' ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold bg-amber-500/15 text-amber-500">
                                                    <Crown size={10} /> Pro
                                                </span>
                                            ) : (
                                                <span className={cn("text-xs font-medium", textSub)}>Free</span>
                                            )}
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
                                            <td colSpan={5} className="px-5 py-5">
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
                                                    <div className="flex items-center">
                                                        {user.subscriptionTier === 'pro' ? (
                                                            <button onClick={(e) => { e.stopPropagation(); handleUpdateSubscription(user.id, 'free'); }}
                                                                disabled={updatingUser === user.id}
                                                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all">
                                                                {updatingUser === user.id ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                                                                {t.revokePro}
                                                            </button>
                                                        ) : (
                                                            <button onClick={(e) => { e.stopPropagation(); handleUpdateSubscription(user.id, 'pro'); }}
                                                                disabled={updatingUser === user.id}
                                                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#21DBA4]/10 text-[#21DBA4] hover:bg-[#21DBA4]/20 transition-all">
                                                                {updatingUser === user.id ? <Loader2 size={14} className="animate-spin" /> : <Crown size={14} />}
                                                                {t.grantPro}
                                                            </button>
                                                        )}
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
