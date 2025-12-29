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
    email: string;
    plan: string;
    amount: string;
    startDate: string;
    status: string;
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
    const proUsers = users?.filter(u => u.subscriptionTier === 'pro') || [];
    const activeSubs = analytics?.subscriptionStats?.active || 0;

    // Sample data for demo
    const subscriptionData: SubscriptionRow[] = proUsers.slice(0, 10).map(user => ({
        email: user.email,
        plan: 'Pro Monthly',
        amount: '₩9,900',
        startDate: user.createdAt?.slice(0, 10) || '-',
        status: t.active
    }));

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
            key: 'status',
            header: t.status,
            render: (value) => <Badge variant={value === t.active ? 'success' : 'error'}>{value}</Badge>
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

            {/* DataTable Card */}
            <div className={cn(
                "p-6 rounded-3xl border",
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
