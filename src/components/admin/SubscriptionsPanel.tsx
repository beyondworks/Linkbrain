import * as React from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { cn } from '../ui/utils';
import { StatCard } from '../shared/StatCard';
import { SectionHeader } from '../shared/SectionHeader';
import { Badge } from '../shared/Badge';
import { DataTable, Column } from '../shared/DataTable';

interface SubscriptionsPanelProps {
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    admin: ReturnType<typeof useAdmin>;
}

interface SubscriptionRow {
    id: string; // userId
    email: string;
    plan: string;
    amount: string;
    startDate: string;
    status: string;
    remainingDays: number;
    trialEndDate?: string;
}

/**
 * SubscriptionsPanel - AnalyticsPanel과 동일한 레이아웃
 */
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
        status: language === 'ko' ? '상태' : 'Status',
        active: language === 'ko' ? '활성' : 'Active',
        expired: language === 'ko' ? '만료' : 'Expired',
        thisMonth: language === 'ko' ? '이번 달' : 'this month',
        thisYear: language === 'ko' ? '이번 해' : 'this year',
        noData: language === 'ko' ? '구독자 데이터가 없습니다' : 'No subscription data'
    };

    // Get pro users from users list
    const proUsers = users?.filter(u => u.subscriptionTier === 'pro' || u.subscriptionStatus === 'trial') || [];
    const activeSubs = analytics?.subscriptionStats?.active || 0;

    const handleExtendSubscription = async (userId: string, currentEndDate: string | undefined) => {
        const days = prompt(language === 'ko' ? '연장할 일수를 입력하세요 (예: 30)' : 'Enter days to extend (e.g., 30)');
        if (!days || isNaN(Number(days))) return;

        try {
            const baseDate = currentEndDate ? new Date(currentEndDate) : new Date();
            const newEndDate = new Date(baseDate.getTime() + Number(days) * 24 * 60 * 60 * 1000).toISOString();

            await admin.updateUserSubscription(userId, 'pro', { trialEndDate: newEndDate });
            alert(language === 'ko' ? '구독 기간이 연장되었습니다.' : 'Subscription extended.');
        } catch (error) {
            console.error('Failed to extend subscription', error);
            alert(language === 'ko' ? '오류가 발생했습니다.' : 'Error occurred.');
        }
    };

    const subscriptionData: SubscriptionRow[] = proUsers.map(user => {
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
            trialEndDate
        };
    });

    const columns: Column<SubscriptionRow>[] = [
        { key: 'email', header: t.email },
        {
            key: 'plan',
            header: t.plan,
            render: (value) => <Badge variant="pro">{value}</Badge>
        },
        { key: 'amount', header: t.amount },
        { key: 'startDate', header: t.startDate },
        {
            key: 'remainingDays',
            header: language === 'ko' ? '남은 기간' : 'Remaining',
            render: (value) => <span className={cn("font-medium", Number(value) < 3 ? "text-red-500" : "")}>{value} {language === 'ko' ? '일' : 'days'}</span>
        },
        {
            key: 'status',
            header: t.status,
            render: (value) => <Badge variant={value === t.active ? 'success' : 'error'}>{value}</Badge>
        },
        {
            key: 'id',
            header: language === 'ko' ? '관리' : 'Manage',
            render: (_, row) => (
                <button
                    onClick={() => handleExtendSubscription(row.id, row.trialEndDate)}
                    className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                    {language === 'ko' ? '+ 연장' : '+ Extend'}
                </button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <SectionHeader
                title={t.title}
                subtitle={t.subtitle}
                isDark={isDark}
                action={
                    <button className={cn(
                        "h-9 px-4 text-sm font-medium rounded-xl border transition-colors",
                        isDark
                            ? "bg-slate-50 text-slate-600 hover:bg-slate-100 border-gray-800"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200"
                    )}>
                        {t.csvExport}
                    </button>
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

            {/* DataTable - No outer box like UsersPanel */}
            <div className={cn(
                "rounded-3xl border overflow-hidden",
                isDark ? "bg-[#111113] border-gray-800" : "bg-white border-slate-100"
            )}>
                <DataTable
                    data={subscriptionData}
                    columns={columns}
                    isDark={isDark}
                    emptyMessage={t.noData}
                />
            </div>
        </div>
    );
}
