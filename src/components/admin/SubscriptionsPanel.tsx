import * as React from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { cn } from '../ui/utils';
import { StatCard } from '../shared/StatCard';
import { SectionHeader } from '../shared/SectionHeader';
import { Badge } from '../shared/Badge';
import { ArrowUp, ArrowDown, ChevronDown, Check, X } from 'lucide-react';
import { DataTable } from '../shared/DataTable'; // Keep import but we will implement custom table

interface SubscriptionsPanelProps {
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    admin: ReturnType<typeof useAdmin>;
}

interface SubscriptionRow {
    id: string;
    email: string;
    plan: string;
    amount: string;
    startDate: string;
    status: string;
    remainingDays: number;
    trialEndDate?: string;
    createdAt?: string; // for sorting
}

type SortField = 'email' | 'plan' | 'amount' | 'startDate' | 'remainingDays' | 'status';
type SortOrder = 'asc' | 'desc';

export function SubscriptionsPanel({ theme, language, admin }: SubscriptionsPanelProps) {
    const { analytics, users } = admin;
    const isDark = theme === 'dark';

    const t = {
        title: language === 'ko' ? '구독 관리' : 'Subscriptions',
        subtitle: language === 'ko' ? 'Pro 구독자 현황' : 'Pro subscriber status',
        totalSubs: language === 'ko' ? '총 구독자' : 'Total Subs',
        monthlyMRR: language === 'ko' ? '월간 MRR' : 'Monthly MRR',
        yearlyARR: language === 'ko' ? '연간 ARR' : 'Annual ARR',
        csvExport: language === 'ko' ? 'CSV 내보내기' : 'CSV Export',
        email: language === 'ko' ? '이메일' : 'Email',
        plan: language === 'ko' ? '플랜' : 'Plan',
        amount: language === 'ko' ? '금액' : 'Amount',
        startDate: language === 'ko' ? '시작일' : 'Start Date',
        remaining: language === 'ko' ? '남은 기간' : 'Remaining',
        status: language === 'ko' ? '상태' : 'Status',
        manage: language === 'ko' ? '관리' : 'Manage',
        active: language === 'ko' ? '활성' : 'Active',
        expired: language === 'ko' ? '만료' : 'Expired',
        thisMonth: language === 'ko' ? '이번 달' : 'this month',
        thisYear: language === 'ko' ? '이번 해' : 'this year',
        noData: language === 'ko' ? '구독자 데이터가 없습니다' : 'No subscription data',
        selected: language === 'ko' ? '명 선택됨' : 'selected',
        extendBulk: language === 'ko' ? '일괄 연장' : 'Bulk Extend',
        extendValues: [7, 14, 30] // Days options
    };

    // State
    const [sortField, setSortField] = React.useState<SortField>('remainingDays');
    const [sortOrder, setSortOrder] = React.useState<SortOrder>('asc'); // Default to expire soonest
    const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
    const [isBulkExtending, setIsBulkExtending] = React.useState(false);

    // Filter Pro Users
    const proUsers = React.useMemo(() => {
        return users?.filter(u => u.subscriptionTier === 'pro' || u.subscriptionStatus === 'trial') || [];
    }, [users]);

    // Map to Row Data
    const rowData = React.useMemo(() => {
        return proUsers.map(user => {
            const trialEndDate = user.trialEndDate;
            let remainingDays = 0;

            if (trialEndDate) {
                const end = new Date(trialEndDate);
                const now = new Date();
                const diffTime = end.getTime() - now.getTime();
                remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            }

            return {
                id: user.id,
                email: user.email,
                plan: user.subscriptionTier === 'pro' ? 'Pro' : 'Trial',
                amount: user.subscriptionTier === 'pro' ? '₩9,900' : '₩0',
                startDate: user.trialStartDate ? new Date(user.trialStartDate).toLocaleDateString() : '-',
                status: remainingDays > 0 ? t.active : t.expired,
                remainingDays,
                trialEndDate,
                createdAt: user.createdAt
            };
        });
    }, [proUsers, t.active, t.expired]);

    // Sorting
    const sortedData = React.useMemo(() => {
        return [...rowData].sort((a, b) => {
            let valA: any = a[sortField];
            let valB: any = b[sortField];

            // Specific handling
            if (sortField === 'amount') {
                valA = parseInt(valA.replace(/[^0-9]/g, '')) || 0;
                valB = parseInt(valB.replace(/[^0-9]/g, '')) || 0;
            } else if (sortField === 'status') {
                valA = valA === t.active ? 1 : 0;
                valB = valB === t.active ? 1 : 0;
            }

            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }, [rowData, sortField, sortOrder, t.active]);

    // Handlers
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc'); // Default new sort to asc
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(new Set(rowData.map(r => r.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectRow = (id: string, checked: boolean) => {
        const newSet = new Set(selectedIds);
        if (checked) {
            newSet.add(id);
        } else {
            newSet.delete(id);
        }
        setSelectedIds(newSet);
    };

    const handleExtendSubscription = async (userId: string, currentEndDate: string | undefined) => {
        const daysStr = prompt(language === 'ko' ? '연장할 일수를 입력하세요 (예: 30)' : 'Enter days to extend (e.g., 30)');
        if (!daysStr) return;

        const days = parseInt(daysStr);
        if (isNaN(days)) return;

        try {
            const baseDate = currentEndDate ? new Date(currentEndDate) : new Date();
            // If expired, start from now
            const effectiveBaseDate = baseDate < new Date() ? new Date() : baseDate;
            const newEndDate = new Date(effectiveBaseDate.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

            await admin.updateUserSubscription(userId, 'pro', { trialEndDate: newEndDate });
            alert(language === 'ko' ? '구독 기간이 연장되었습니다.' : 'Subscription extended.');
        } catch (error) {
            console.error('Failed to extend subscription', error);
            alert(language === 'ko' ? '오류가 발생했습니다.' : 'Error occurred.');
        }
    };

    const handleBulkExtend = async () => {
        const daysStr = prompt(language === 'ko' ? `선택된 ${selectedIds.size}명의 구독을 며칠 연장하시겠습니까?` : `Extend ${selectedIds.size} users by how many days?`);
        if (!daysStr) return;

        const days = parseInt(daysStr);
        if (isNaN(days)) return;

        setIsBulkExtending(true);
        try {
            await admin.bulkUpdateTrialPeriod(Array.from(selectedIds), days);
            alert(language === 'ko' ? '일괄 연장이 완료되었습니다.' : 'Bulk extension complete.');
            setSelectedIds(new Set()); // Clear selection
        } catch (error) {
            console.error('Bulk extend failed', error);
            alert(language === 'ko' ? '일괄 연장 중 오류가 발생했습니다.' : 'Error during bulk extension.');
        } finally {
            setIsBulkExtending(false);
        }
    };

    // Render Helpers
    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <div className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-30" ><ArrowUp size={14} /></div>;
        return sortOrder === 'asc' ? <ArrowUp size={14} className="ml-1 text-primary" /> : <ArrowDown size={14} className="ml-1 text-primary" />;
    };

    const activeSubs = analytics?.subscriptionStats?.active || 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <SectionHeader
                title={t.title}
                subtitle={t.subtitle}
                isDark={isDark}
                action={
                    <div className="flex items-center gap-2">
                        {selectedIds.size > 0 && (
                            <button
                                onClick={handleBulkExtend}
                                disabled={isBulkExtending}
                                className={cn(
                                    "h-9 px-4 text-sm font-medium rounded-xl border transition-colors flex items-center gap-2",
                                    isDark
                                        ? "bg-primary/20 text-primary border-primary/50 hover:bg-primary/30"
                                        : "bg-primary/10 text-primary-700 border-primary/20 hover:bg-primary/20"
                                )}
                            >
                                {isBulkExtending ? '...' : (language === 'ko' ? `${selectedIds.size}명 일괄 연장` : `Extend ${selectedIds.size}`)}
                            </button>
                        )}
                        <button className={cn(
                            "h-9 px-4 text-sm font-medium rounded-xl border transition-colors",
                            isDark
                                ? "bg-slate-50 text-slate-600 hover:bg-slate-100 border-gray-800"
                                : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200"
                        )}>
                            {t.csvExport}
                        </button>
                    </div>
                }
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    label={t.totalSubs}
                    value={activeSubs}
                    trend={`+5% ${t.thisMonth}`}
                    trendUp={true}
                    isDark={isDark}
                />
                <StatCard
                    label={t.monthlyMRR}
                    value="₩1.2M"
                    trend={`+12% ${t.thisMonth}`}
                    trendUp={true}
                    isDark={isDark}
                />
                <StatCard
                    label={t.yearlyARR}
                    value="₩14.4M"
                    trend={`+15% ${t.thisYear}`}
                    trendUp={true}
                    isDark={isDark}
                />
            </div>

            {/* Custom Table */}
            <div className={cn(
                "rounded-3xl border overflow-hidden",
                isDark ? "bg-[#111113] border-gray-800" : "bg-white border-slate-100"
            )}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={cn(
                                "border-b",
                                isDark ? "border-gray-800 bg-gray-900/50" : "border-slate-100 bg-slate-50/80"
                            )}>
                                <th className="px-6 py-4 w-12 whitespace-nowrap">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300"
                                        checked={rowData.length > 0 && selectedIds.size === rowData.length}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                    />
                                </th>
                                {[
                                    { key: 'email', label: t.email },
                                    { key: 'plan', label: t.plan },
                                    { key: 'amount', label: t.amount },
                                    { key: 'startDate', label: t.startDate },
                                    { key: 'remainingDays', label: t.remaining },
                                    { key: 'status', label: t.status },
                                ].map((col) => (
                                    <th
                                        key={col.key}
                                        className={cn(
                                            "px-6 py-4 text-xs font-semibold uppercase tracking-wider cursor-pointer group select-none whitespace-nowrap",
                                            isDark ? "text-gray-400" : "text-slate-500"
                                        )}
                                        onClick={() => handleSort(col.key as SortField)}
                                    >
                                        <div className="flex items-center">
                                            {col.label}
                                            <SortIcon field={col.key as SortField} />
                                        </div>
                                    </th>
                                ))}
                                <th className={cn(
                                    "px-6 py-4 text-xs font-semibold uppercase tracking-wider text-center whitespace-nowrap",
                                    isDark ? "text-gray-400" : "text-slate-500"
                                )}>
                                    {t.manage}
                                </th>
                            </tr>
                        </thead>
                        <tbody className={cn("divide-y", isDark ? "divide-gray-800" : "divide-slate-100")}>
                            {sortedData.length > 0 ? (
                                sortedData.map((row) => (
                                    <tr
                                        key={row.id}
                                        className={cn(
                                            "transition-colors",
                                            isDark ? "hover:bg-gray-800/50" : "hover:bg-slate-50",
                                            selectedIds.has(row.id) && (isDark ? "bg-primary/10" : "bg-primary/5")
                                        )}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300"
                                                checked={selectedIds.has(row.id)}
                                                onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={cn("text-sm", isDark ? "text-white" : "text-slate-800")}>{row.email}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant="pro">{row.plan}</Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={cn("text-sm", isDark ? "text-gray-300" : "text-slate-600")}>{row.amount}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={cn("text-sm", isDark ? "text-gray-300" : "text-slate-600")}>{row.startDate}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={cn(
                                                "text-sm font-medium",
                                                Number(row.remainingDays) < 3 ? "text-red-500" : (isDark ? "text-white" : "text-slate-800")
                                            )}>
                                                {row.remainingDays} {language === 'ko' ? '일' : 'days'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant={row.status === t.active ? 'success' : 'error'}>{row.status}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <button
                                                onClick={() => handleExtendSubscription(row.id, row.trialEndDate)}
                                                className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors inline-flex items-center gap-1"
                                            >
                                                {language === 'ko' ? '+ 연장' : '+ Extend'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center">
                                        <p className={cn("text-sm", isDark ? "text-gray-500" : "text-slate-400")}>{t.noData}</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
