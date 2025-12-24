import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import {
    Search,
    RefreshCw,
    Crown,
    UserX,
    Youtube,
    Instagram,
    Globe,
    ChevronDown,
    ChevronUp,
    Loader2,
    Filter
} from 'lucide-react';

interface UsersPanelProps {
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    admin: ReturnType<typeof useAdmin>;
}

export function UsersPanel({ theme, language, admin }: UsersPanelProps) {
    const { users, usersLoading, fetchUserList, updateUserSubscription } = admin;
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'trial' | 'expired' | 'free'>('all');
    const [sortBy, setSortBy] = useState<'clips' | 'date' | 'email'>('clips');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [expandedUser, setExpandedUser] = useState<string | null>(null);
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        fetchUserList();
    }, [fetchUserList]);

    const t = {
        title: language === 'ko' ? '유저 관리' : 'User Management',
        search: language === 'ko' ? '이메일 검색...' : 'Search by email...',
        refresh: language === 'ko' ? '새로고침' : 'Refresh',
        totalUsers: language === 'ko' ? '전체 유저' : 'Total Users',
        loading: language === 'ko' ? '유저 목록 로딩 중...' : 'Loading users...',
        noUsers: language === 'ko' ? '유저가 없습니다' : 'No users found',
        email: language === 'ko' ? '이메일' : 'Email',
        clips: language === 'ko' ? '클립' : 'Clips',
        status: language === 'ko' ? '상태' : 'Status',
        joined: language === 'ko' ? '가입일' : 'Joined',
        lastLogin: language === 'ko' ? '마지막 로그인' : 'Last Login',
        platforms: language === 'ko' ? '플랫폼별 클립' : 'Clips by Platform',
        grantPro: language === 'ko' ? 'Pro 부여' : 'Grant Pro',
        revokePro: language === 'ko' ? 'Pro 해제' : 'Revoke Pro',
        all: language === 'ko' ? '전체' : 'All',
        active: language === 'ko' ? '활성' : 'Active',
        trial: language === 'ko' ? '체험판' : 'Trial',
        expired: language === 'ko' ? '만료' : 'Expired',
        free: language === 'ko' ? '무료' : 'Free'
    };

    const cardBg = theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
    const textPrimary = theme === 'dark' ? 'text-white' : 'text-slate-900';
    const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';
    const inputBg = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200';

    // Filter and sort users
    const filteredUsers = users
        .filter(user => {
            if (searchQuery && !user.email.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            if (statusFilter !== 'all' && user.subscriptionStatus !== statusFilter) {
                return false;
            }
            return true;
        })
        .sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'clips':
                    comparison = a.clipCount - b.clipCount;
                    break;
                case 'date':
                    comparison = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
                    break;
                case 'email':
                    comparison = a.email.localeCompare(b.email);
                    break;
            }
            return sortOrder === 'desc' ? -comparison : comparison;
        });

    const handleToggleSubscription = async (userId: string, currentTier: 'free' | 'pro' | undefined) => {
        setUpdating(userId);
        try {
            await updateUserSubscription(userId, currentTier === 'pro' ? 'free' : 'pro');
        } catch (error) {
            console.error('Failed to update subscription:', error);
        } finally {
            setUpdating(null);
        }
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            active: 'bg-[#21DBA4]/10 text-[#21DBA4]',
            trial: 'bg-yellow-500/10 text-yellow-500',
            expired: 'bg-red-500/10 text-red-500',
            free: theme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
        };
        const labels: Record<string, string> = {
            active: t.active,
            trial: t.trial,
            expired: t.expired,
            free: t.free
        };
        return (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors.free}`}>
                {labels[status] || status}
            </span>
        );
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString(language === 'ko' ? 'ko-KR' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className={`text-xl font-bold ${textPrimary}`}>{t.title}</h2>
                    <p className={`text-sm ${textSecondary}`}>
                        {t.totalUsers}: {users.length}
                    </p>
                </div>
                <button
                    onClick={() => fetchUserList()}
                    disabled={usersLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${theme === 'dark'
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        } disabled:opacity-50`}
                >
                    <RefreshCw size={14} className={usersLoading ? 'animate-spin' : ''} />
                    {t.refresh}
                </button>
            </div>

            {/* Filters */}
            <div className={`rounded-xl border p-4 ${cardBg}`}>
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textSecondary}`} />
                        <input
                            type="text"
                            placeholder={t.search}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm ${inputBg} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-[#21DBA4]/50`}
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <Filter size={14} className={textSecondary} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                            className={`px-3 py-2 rounded-lg border text-sm ${inputBg} ${textPrimary} focus:outline-none focus:ring-2 focus:ring-[#21DBA4]/50`}
                        >
                            <option value="all">{t.all}</option>
                            <option value="active">{t.active}</option>
                            <option value="trial">{t.trial}</option>
                            <option value="expired">{t.expired}</option>
                            <option value="free">{t.free}</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* User List */}
            {usersLoading ? (
                <div className={`rounded-xl border p-12 text-center ${cardBg}`}>
                    <Loader2 className="w-8 h-8 animate-spin text-[#21DBA4] mx-auto mb-3" />
                    <p className={textSecondary}>{t.loading}</p>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className={`rounded-xl border p-12 text-center ${cardBg}`}>
                    <p className={textSecondary}>{t.noUsers}</p>
                </div>
            ) : (
                <div className={`rounded-xl border overflow-hidden ${cardBg}`}>
                    {/* Table Header */}
                    <div className={`grid grid-cols-12 gap-4 px-4 py-3 text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                        <div className="col-span-5">{t.email}</div>
                        <div className="col-span-2 text-center cursor-pointer hover:text-[#21DBA4]" onClick={() => { setSortBy('clips'); setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc'); }}>
                            {t.clips} {sortBy === 'clips' && (sortOrder === 'desc' ? <ChevronDown size={12} className="inline" /> : <ChevronUp size={12} className="inline" />)}
                        </div>
                        <div className="col-span-2 text-center">{t.status}</div>
                        <div className="col-span-3 text-right cursor-pointer hover:text-[#21DBA4]" onClick={() => { setSortBy('date'); setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc'); }}>
                            {t.joined} {sortBy === 'date' && (sortOrder === 'desc' ? <ChevronDown size={12} className="inline" /> : <ChevronUp size={12} className="inline" />)}
                        </div>
                    </div>

                    {/* User Rows */}
                    <div className="divide-y divide-slate-200 dark:divide-slate-800">
                        {filteredUsers.map(user => (
                            <div key={user.id}>
                                {/* Main Row */}
                                <div
                                    className={`grid grid-cols-12 gap-4 px-4 py-3 items-center cursor-pointer transition-colors ${theme === 'dark' ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
                                        } ${expandedUser === user.id ? (theme === 'dark' ? 'bg-slate-800/30' : 'bg-slate-50') : ''}`}
                                    onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                                >
                                    <div className="col-span-5 flex items-center gap-3 min-w-0">
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full shrink-0" />
                                        ) : (
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                                <span className={`text-sm font-medium ${textSecondary}`}>
                                                    {user.email.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <p className={`text-sm font-medium truncate ${textPrimary}`}>
                                                {user.displayName || user.email.split('@')[0]}
                                            </p>
                                            <p className={`text-xs truncate ${textSecondary}`}>{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-center">
                                        <span className={`text-sm font-semibold ${textPrimary}`}>{user.clipCount}</span>
                                    </div>
                                    <div className="col-span-2 text-center">
                                        {getStatusBadge(user.subscriptionStatus)}
                                    </div>
                                    <div className="col-span-3 text-right">
                                        <span className={`text-sm ${textSecondary}`}>{formatDate(user.createdAt)}</span>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedUser === user.id && (
                                    <div className={`px-4 py-4 ${theme === 'dark' ? 'bg-slate-800/20' : 'bg-slate-50/50'}`}>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {/* Platform Stats */}
                                            <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
                                                <h4 className={`text-xs font-semibold mb-2 ${textSecondary}`}>{t.platforms}</h4>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Youtube size={14} className="text-red-500" />
                                                            <span className={`text-xs ${textSecondary}`}>YouTube</span>
                                                        </div>
                                                        <span className={`text-sm font-medium ${textPrimary}`}>{user.platforms.youtube}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Instagram size={14} className="text-pink-500" />
                                                            <span className={`text-xs ${textSecondary}`}>Instagram</span>
                                                        </div>
                                                        <span className={`text-sm font-medium ${textPrimary}`}>{user.platforms.instagram}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm">🧵</span>
                                                            <span className={`text-xs ${textSecondary}`}>Threads</span>
                                                        </div>
                                                        <span className={`text-sm font-medium ${textPrimary}`}>{user.platforms.threads}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Globe size={14} className="text-blue-500" />
                                                            <span className={`text-xs ${textSecondary}`}>Web</span>
                                                        </div>
                                                        <span className={`text-sm font-medium ${textPrimary}`}>{user.platforms.web}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Activity Info */}
                                            <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
                                                <h4 className={`text-xs font-semibold mb-2 ${textSecondary}`}>{t.lastLogin}</h4>
                                                <p className={`text-sm ${textPrimary}`}>{formatDate(user.lastLoginAt)}</p>
                                            </div>

                                            {/* Actions */}
                                            <div className={`rounded-lg p-3 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
                                                <h4 className={`text-xs font-semibold mb-2 ${textSecondary}`}>Actions</h4>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleToggleSubscription(user.id, user.subscriptionTier);
                                                        }}
                                                        disabled={updating === user.id}
                                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${user.subscriptionTier === 'pro'
                                                                ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                                                                : 'bg-[#21DBA4]/10 text-[#21DBA4] hover:bg-[#21DBA4]/20'
                                                            } disabled:opacity-50`}
                                                    >
                                                        {updating === user.id ? (
                                                            <Loader2 size={12} className="animate-spin" />
                                                        ) : user.subscriptionTier === 'pro' ? (
                                                            <>
                                                                <UserX size={12} />
                                                                {t.revokePro}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Crown size={12} />
                                                                {t.grantPro}
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
