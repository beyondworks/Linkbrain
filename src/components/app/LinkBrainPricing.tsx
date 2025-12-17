import React, { useState } from 'react';
import {
  Check,
  X,
  Zap,
  Crown,
  Building2,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { useClips } from '../../hooks/useClips';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const TRANSLATIONS = {
  en: {
    title: "Invest in your",
    titleSuffix: "Knowledge",
    description: "Simple, transparent pricing. No hidden fees.",
    monthly: "Monthly",
    yearly: "Yearly",
    save20: "SAVE 20%",
    mostPopular: "MOST POPULAR",
    faq: "Have more questions?",
    helpCenter: "Visit our Help Center",
    plans: {
      free: {
        name: "Free Trial",
        desc: "Experience the full power of LinkBrain for 15 days.",
        cta: "Start Free Trial",
        features: [
          "15 Days Full Access",
          "Unlimited Links (During Trial)",
          "Unlimited AI Summaries (During Trial)",
          "Read-Only Access after 15 days",
          "Mobile App Access"
        ],
        notIncluded: [
          "Permanent Creating/Editing (after trial)",
          "Permanent AI Features (after trial)"
        ]
      },
      pro: {
        name: "Pro Brain",
        desc: "For knowledge workers who need clarity.",
        cta: "Upgrade Now",
        features: [
          "Everything in Free Trial",
          "Unlimited AI Summaries",
          "Unlimited AI Chat",
          "Smart Auto-Tagging",
          "Full-text Search",
          "10 GB Storage",
          "Priority Support"
        ],
        notIncluded: []
      }
    }
  },
  ko: {
    title: "당신의",
    titleSuffix: "지식에 투자하세요",
    description: "단순하고 투명한 요금제. 숨겨진 비용은 없습니다.",
    monthly: "월간",
    yearly: "연간",
    save20: "20% 할인",
    mostPopular: "가장 인기",
    faq: "더 궁금한 점이 있으신가요?",
    helpCenter: "고객센터 방문하기",
    plans: {
      free: {
        name: "무료 체험",
        desc: "15일 동안 LinkBrain의 모든 기능을 체험해보세요.",
        cta: "무료로 시작하기",
        features: [
          "15일간 모든 기능 무제한",
          "무제한 링크 저장 (체험 기간)",
          "무제한 AI 요약 (체험 기간)",
          "15일 후 읽기 전용으로 전환",
          "모바일 앱 접근"
        ],
        notIncluded: [
          "체험 종료 후 링크 추가/편집 불가",
          "체험 종료 후 AI 기능 제한"
        ]
      },
      pro: {
        name: "프로 플랜",
        desc: "명확함이 필요한 지식 근로자를 위해.",
        cta: "지금 업그레이드",
        features: [
          "무료 체험의 모든 기능 포함",
          "무제한 AI 요약",
          "무제한 AI 채팅",
          "스마트 자동 태깅",
          "전체 텍스트 검색",
          "10GB 저장 공간",
          "우선 지원"
        ],
        notIncluded: []
      }
    }
  }
};

interface LinkBrainPricingProps {
  theme: 'light' | 'dark';
  language: 'en' | 'ko';
  onEnterApp?: () => void;
}

export const LinkBrainPricing = ({ theme, language = 'ko', onEnterApp }: LinkBrainPricingProps) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const { user } = useClips();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  const t = TRANSLATIONS[language];

  const plans = [
    {
      id: 'free',
      name: t.plans.free.name,
      description: t.plans.free.desc,
      price: 0,
      features: t.plans.free.features,
      notIncluded: t.plans.free.notIncluded,
      cta: t.plans.free.cta,
      highlight: false
    },
    {
      id: 'pro',
      name: t.plans.pro.name,
      description: t.plans.pro.desc,
      price: billingCycle === 'yearly' ? 9 : 12,
      features: t.plans.pro.features,
      notIncluded: t.plans.pro.notIncluded,
      cta: t.plans.pro.cta,
      highlight: true
    }
  ];

  const handlePlanSelect = async (plan: typeof plans[0]) => {
    console.log("handlePlanSelect clicked:", plan);

    // If user is not logged in, redirect to login
    if (!user) {
      console.log("User not logged in, redirecting...");
      toast.info(language === 'ko' ? "로그인이 필요합니다." : "Please login first.");
      if (onEnterApp) {
        onEnterApp();
      } else {
        navigate('/');
      }
      return;
    }

    // Free plan -> Go to dashboard
    if (plan.price === 0) {
      navigate('/');
      return;
    }

    // Paid plan -> Stripe Checkout
    try {
      setIsPaymentModalOpen(true); // Show loading state

      const priceId = billingCycle === 'yearly'
        ? import.meta.env.VITE_STRIPE_PRICE_ID_YEARLY
        : import.meta.env.VITE_STRIPE_PRICE_ID_MONTHLY;

      if (!priceId) {
        toast.error(language === 'ko' ? '결제 설정이 완료되지 않았습니다.' : 'Payment not configured');
        setIsPaymentModalOpen(false);
        return;
      }

      const response = await fetch('/api/payment/stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/pricing`,
          customerEmail: user.email,
          userId: user.uid,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Stripe checkout error:', error);
      toast.error(error.message || (language === 'ko' ? '결제 오류가 발생했습니다.' : 'Payment error'));
      setIsPaymentModalOpen(false);
    }
  };

  return (
    <div className={`w-full min-h-full p-4 md:p-8 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight break-keep">
            {language === 'en' ? (
              <>
                {t.title} <span className="text-[#21DBA4]">{t.titleSuffix}</span>
              </>
            ) : (
              <>
                <span className="text-[#21DBA4]">{t.titleSuffix}</span>
              </>
            )}
          </h1>
          <p className={`text-base md:text-lg mb-8 ${isDark ? 'text-slate-400' : 'text-slate-600'} break-keep`}>
            {t.description}
          </p>

          {/* Toggle */}
          <div className={`inline-flex items-center p-1 rounded-full border ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === 'monthly' ? (isDark ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900') : 'text-slate-500'}`}
            >
              {t.monthly}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-[#21DBA4] text-white shadow-md' : 'text-slate-500'}`}
            >
              {t.yearly} <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded">{t.save20}</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pb-20">
          {plans.map((plan, idx) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 border flex flex-col ${plan.highlight
                ? `border-[#21DBA4] shadow-2xl shadow-[#21DBA4]/10 scale-105 ${isDark ? 'bg-slate-900' : 'bg-white'}`
                : `${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`
                }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#21DBA4] text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                  <Crown size={12} fill="currentColor" /> {t.mostPopular}
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                <p className={`text-sm min-h-[40px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{plan.description}</p>
              </div>

              <div className="mb-8 flex items-end gap-1">
                <span className={`text-5xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>${plan.price}</span>
                <span className={`text-sm font-medium mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>/ mo</span>
              </div>

              <button
                onClick={() => handlePlanSelect(plan)}
                className={`w-full py-3 rounded-xl font-bold text-sm mb-8 transition-all ${plan.highlight
                  ? 'bg-[#21DBA4] hover:bg-[#1ec493] text-white shadow-lg shadow-[#21DBA4]/20'
                  : isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }`}>
                {plan.cta}
              </button>

              <div className="space-y-4 flex-1">
                {plan.features.map(feature => (
                  <div key={feature} className="flex items-start gap-3 text-sm">
                    <div className="mt-0.5 w-4 h-4 rounded-full bg-[#E0FBF4] flex items-center justify-center shrink-0">
                      <Check size={10} className="text-[#21DBA4]" strokeWidth={3} />
                    </div>
                    <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map(feature => (
                  <div key={feature} className="flex items-start gap-3 text-sm opacity-50">
                    <X size={16} className="text-slate-400 shrink-0" />
                    <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Teaser */}
        <div className="text-center pb-20">
          <p className={`text-sm flex items-center justify-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <HelpCircle size={16} /> {t.faq} <a href="#" className="text-[#21DBA4] hover:underline">{t.helpCenter}</a>
          </p>
        </div>

        {/* Loading Overlay for Stripe Redirect */}
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
              <Loader2 className="w-10 h-10 text-[#21DBA4] animate-spin" />
              <p className="text-slate-700 font-medium">
                {language === 'ko' ? '결제 페이지로 이동 중...' : 'Redirecting to checkout...'}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
