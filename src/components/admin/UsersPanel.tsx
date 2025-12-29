import * as React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import {
    Search,
    RefreshCw,
    Loader2,
    ChevronDown,
    ChevronUp,
    Mail,
    User,
    Calendar,
    Clock,
    Filter
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

/**
 * UsersPanel - 상세정보 + 필터 기능 추가
 * 
 * Features:
 * - 플랜별 필터링
 * - 검색 기능
 * - 클릭 시 상세정보 확장
 * - 플랫폼별 클립 통계
 * - 구독 관리 옵션
 */
export function UsersPanel({ theme, language, admin }: UsersPanelProps) {
    const { users, usersLoading, fetchUserList } = admin;
    const [searchQuery, setSearchQuery] = useState('');
    const [planFilter, setPlanFilter] = useState<PlanFilter>('all');
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
        lastAccess: language === 'ko' ? '마지막 접속' : 'Last Access',
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
        changePlan: language === 'ko' ? '플랜 변경' : 'Change Plan'
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

    // Filter users
    const filteredUsers = useMemo(() => {
        return processedUsers.filter(user => {
            // Plan filter
            if (planFilter !== 'all' && user.plan !== planFilter) return false;
            // Search filter
            if (searchQuery && !user.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            return true;
        });
    }, [processedUsers, planFilter, searchQuery]);

    // Plan counts
    const planCounts = useMemo(() => {
        return {
            all: processedUsers.length,
            Master: processedUsers.filter(u => u.plan === 'Master').length,
            Pro: processedUsers.filter(u => u.plan === 'Pro').length,
            Free: processedUsers.filter(u => u.plan === 'Free').length
        };
    }, [processedUsers]);

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

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
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

            {/* User Table */}
            <div className={cn(
                "rounded-3xl border overflow-hidden",
                isDark ? "bg-[#111113] border-gray-800" : "bg-white border-slate-100"
            )}>
                {/* Table Header */}
                <div className={cn(
                    "grid grid-cols-[1fr,80px,100px,100px,80px,40px] gap-4 px-6 py-3 text-xs font-semibold border-b",
                    isDark ? "bg-gray-900/50 text-gray-400 border-gray-800" : "bg-slate-50 text-slate-500 border-slate-100"
                )}>
                    <div className="flex items-center gap-1">{t.email} <ChevronDown size={12} /></div>
                    <div className="text-center">{t.clips}</div>
                    <div className="text-center">{t.plan}</div>
                    <div className="text-center">{t.date}</div>
                    <div className="text-center">{t.status}</div>
                    <div></div>
                </div>

                {/* Table Body */}
                {filteredUsers.length === 0 ? (
                    <div className="py-12 text-center text-slate-400">{t.noUsers}</div>
                ) : (
                    filteredUsers.map(user => (
                        <UserRow
                            key={user.uid}
                            user={user}
                            isExpanded={expandedUserId === user.uid}
                            onToggle={() => setExpandedUserId(expandedUserId === user.uid ? null : user.uid)}
                            isDark={isDark}
                            t={t}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

// UserRow Component
interface UserRowProps {
    user: {
        uid: string;
        email: string;
        plan: 'Master' | 'Pro' | 'Free';
        clipCount?: number;
        createdAt?: string;
        platformClips?: { youtube?: number; instagram?: number; threads?: number; web?: number };
    };
    isExpanded: boolean;
    onToggle: () => void;
    isDark: boolean;
    t: Record<string, string>;
}

function UserRow({ user, isExpanded, onToggle, isDark, t }: UserRowProps) {
    const badgeVariant = user.plan === 'Master' ? 'pro' : user.plan === 'Pro' ? 'pro' : 'free';

    return (
        <div className={cn(
            "border-b last:border-b-0 transition-colors",
            isDark ? "border-gray-800 hover:bg-gray-900/30" : "border-slate-50 hover:bg-slate-50/50",
            isExpanded && (isDark ? "bg-gray-900/30" : "bg-slate-50/50")
        )}>
            {/* Main Row */}
            <div
                className="grid grid-cols-[1fr,80px,100px,100px,80px,40px] gap-4 px-6 py-4 cursor-pointer items-center"
                onClick={onToggle}
            >
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                        user.plan === 'Master' ? "bg-purple-100 text-purple-600" :
                            user.plan === 'Pro' ? "bg-[#21DBA4]/10 text-[#21DBA4]" :
                                isDark ? "bg-gray-800 text-gray-400" : "bg-slate-200 text-slate-600"
                    )}>
                        {user.email.charAt(0).toUpperCase()}
                    </div>
                    <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-800")}>
                        {user.email}
                    </span>
                </div>
                <div className={cn("text-center text-sm", isDark ? "text-gray-400" : "text-slate-600")}>
                    {user.clipCount || 0}
                </div>
                <div className="text-center">
                    <Badge variant={badgeVariant} isDark={isDark}>{user.plan}</Badge>
                </div>
                <div className={cn("text-center text-sm", isDark ? "text-gray-400" : "text-slate-600")}>
                    {user.createdAt?.slice(0, 10) || '-'}
                </div>
                <div className="text-center">
                    <Badge variant="success" isDark={isDark}>{t.active}</Badge>
                </div>
                <div className="text-center">
                    {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className={cn(
                    "px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-4",
                    isDark ? "border-t border-gray-800" : "border-t border-slate-100"
                )}>
                    {/* Basic Info */}
                    <div className={cn(
                        "p-4 rounded-2xl",
                        isDark ? "bg-gray-900/50" : "bg-slate-50"
                    )}>
                        <h4 className={cn("text-sm font-semibold mb-3", isDark ? "text-gray-300" : "text-slate-700")}>
                            {t.basicInfo}
                        </h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Mail size={14} className="text-slate-400" />
                                <span className={isDark ? "text-gray-400" : "text-slate-600"}>{t.email}</span>
                            </div>
                            <p className={cn("text-sm font-medium ml-5", isDark ? "text-white" : "text-slate-800")}>
                                {user.email}
                            </p>
                            <div className="flex items-center gap-2 text-sm mt-3">
                                <User size={14} className="text-slate-400" />
                                <span className={isDark ? "text-gray-400" : "text-slate-600"}>{t.userId}</span>
                            </div>
                            <p className={cn("text-xs font-mono ml-5", isDark ? "text-gray-500" : "text-slate-500")}>
                                {user.uid}
                            </p>
                            <div className="flex items-center gap-2 text-sm mt-3">
                                <Calendar size={14} className="text-slate-400" />
                                <span className={isDark ? "text-gray-400" : "text-slate-600"}>{t.joinDate}</span>
                            </div>
                            <p className={cn("text-sm ml-5", isDark ? "text-white" : "text-slate-700")}>
                                {user.createdAt?.slice(0, 10) || '-'}
                            </p>
                            <div className="flex items-center gap-2 text-sm mt-3">
                                <Clock size={14} className="text-slate-400" />
                                <span className={isDark ? "text-gray-400" : "text-slate-600"}>{t.lastAccess}</span>
                            </div>
                            <p className={cn("text-sm ml-5", isDark ? "text-white" : "text-slate-700")}>-</p>
                        </div>
                    </div>

                    {/* Platform Clips */}
                    <div className={cn(
                        "p-4 rounded-2xl",
                        isDark ? "bg-gray-900/50" : "bg-slate-50"
                    )}>
                        <h4 className={cn("text-sm font-semibold mb-3", isDark ? "text-gray-300" : "text-slate-700")}>
                            {t.platformClips}
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            <PlatformClipCard platform="YouTube" count={user.platformClips?.youtube || 0} color="#FF0000" isDark={isDark} />
                            <PlatformClipCard platform="Instagram" count={user.platformClips?.instagram || 0} color="#E4405F" isDark={isDark} />
                            <PlatformClipCard platform="Threads" count={user.platformClips?.threads || 0} color={isDark ? "#FFFFFF" : "#000000"} isDark={isDark} />
                            <PlatformClipCard platform="Web" count={user.platformClips?.web || 0} color="#21DBA4" isDark={isDark} />
                        </div>
                        <div className={cn(
                            "mt-3 pt-3 border-t flex justify-between",
                            isDark ? "border-gray-800" : "border-slate-200"
                        )}>
                            <span className={isDark ? "text-gray-400" : "text-slate-600"}>Total</span>
                            <span className={cn("font-semibold", isDark ? "text-white" : "text-slate-800")}>
                                {user.clipCount || 0}
                            </span>
                        </div>
                    </div>

                    {/* Subscription Management */}
                    <div className={cn(
                        "p-4 rounded-2xl",
                        isDark ? "bg-gray-900/50" : "bg-slate-50"
                    )}>
                        <h4 className={cn("text-sm font-semibold mb-3", isDark ? "text-gray-300" : "text-slate-700")}>
                            {t.subscriptionMgmt}
                        </h4>
                        <p className={cn("text-sm mb-2", isDark ? "text-gray-400" : "text-slate-600")}>{t.changePlan}</p>
                        <select
                            defaultValue={user.plan}
                            className={cn(
                                "w-full h-10 px-3 rounded-xl border text-sm font-medium",
                                isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-slate-200 text-slate-800"
                            )}
                        >
                            <option value="Master">👑 Master</option>
                            <option value="Pro">⚡ Pro</option>
                            <option value="Free">Free</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
}

// Platform Clip Card
function PlatformClipCard({ platform, count, color, isDark }: { platform: string; count: number; color: string; isDark: boolean }) {
    return (
        <div className={cn(
            "p-3 rounded-xl",
            isDark ? "bg-gray-800" : "bg-white border border-slate-100"
        )}>
            <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-800")}>{count}</span>
            </div>
            <span className={cn("text-xs", isDark ? "text-gray-500" : "text-slate-500")}>{platform}</span>
        </div>
    );
}
