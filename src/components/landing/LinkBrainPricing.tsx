import React, { useState } from 'react';
import { 
  Check, 
  X,
  Zap,
  Crown,
  Building2,
  HelpCircle
} from 'lucide-react';
import { motion } from 'motion/react';

const TRANSLATIONS = {
  en: {
    title: "Invest in your",
    titleSuffix: "Knowledge",
    description: "The best investment to turn information into knowledge assets.",
    faq: "Have more questions?",
    helpCenter: "Visit our Help Center",
    billing: {
        monthly: "Monthly",
        yearly: "Yearly",
        save: "Save 20%"
    },
    plans: {
      trial: {
        name: "Free Trial",
        desc: "Experience all features of LinkBrain for 15 days.",
        cta: "Start for Free",
        price: "0",
        priceYearly: "0",
        currency: "$",
        period: "/ mo",
        periodYearly: "/ mo",
        features: [
            "All features unlimited for 15 days",
            "Unlimited Link Saving (during trial)",
            "Unlimited AI Summaries (during trial)",
            "Mobile App Access"
        ],
        notIncluded: [
            "Switches to Read-Only after 15 days",
            "Cannot add/edit links after trial",
            "AI features limited after trial"
        ]
      },
      pro: {
        name: "Pro Plan",
        desc: "Go beyond collecting. Create insights.",
        cta: "Upgrade Now",
        price: "5.5",
        priceYearly: "4.4",
        currency: "$",
        period: "/ mo",
        periodYearly: "/ mo",
        features: [
            "Includes all Free Trial features",
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
    description: "흩어진 정보를 지식 자산으로 바꾸는 가장 확실한 투자.",
    faq: "더 궁금한 점이 있으신가요?",
    helpCenter: "고객센터 방문하기",
    billing: {
        monthly: "월간",
        yearly: "연간",
        save: "20% 절약"
    },
    plans: {
      trial: {
        name: "무료 체험",
        desc: "15일 동안 LinkBrain의 모든 기능을 체험해보세요.",
        cta: "무료로 시작하기",
        price: "0",
        priceYearly: "0",
        currency: "",
        period: "원",
        periodYearly: "원",
        features: [
            "15일간 모든 기능 무제한",
            "무제한 링크 저장 (체험 기간)",
            "무제한 AI 요약 (체험 기간)",
            "모바일 앱 접근"
        ],
        notIncluded: [
            "15일 후 읽기 전용으로 전환",
            "체험 종료 후 링크 추가/편집 불가",
            "체험 종료 후 AI 기능 제한"
        ]
      },
      pro: {
        name: "프로 플랜",
        desc: "단순 수집을 넘어, 나만의 인사이트를 창출하는 분들을 위해.",
        cta: "지금 업그레이드",
        price: "7,900",
        priceYearly: "6,320",
        currency: "",
        period: "원 / 월",
        periodYearly: "원 / 월",
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

export const LinkBrainPricing = ({ theme, language = 'en' }: { theme: 'light' | 'dark', language?: 'en' | 'ko' }) => {
  const isDark = theme === 'dark';
  const t = TRANSLATIONS[language];
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      ...t.plans.trial,
      highlight: false,
      currentPrice: billingCycle === 'monthly' ? t.plans.trial.price : t.plans.trial.priceYearly,
      currentPeriod: billingCycle === 'monthly' ? t.plans.trial.period : t.plans.trial.periodYearly,
    },
    {
      ...t.plans.pro,
      highlight: true,
      currentPrice: billingCycle === 'monthly' ? t.plans.pro.price : t.plans.pro.priceYearly,
      currentPeriod: billingCycle === 'monthly' ? t.plans.pro.period : t.plans.pro.periodYearly,
    }
  ];

  return (
    <div className={`w-full min-h-full px-6 py-12 md:p-12 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 md:mb-40">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="inline-block mb-4"
          >
             <span className="px-3 py-1 rounded-full border border-[#21DBA4]/30 bg-[#21DBA4]/10 text-[#21DBA4] text-[10px] font-bold uppercase tracking-widest">
                Pricing
             </span>
          </motion.div>
          <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight break-keep leading-tight"
          >
             {language === 'en' ? (
                <>
                {t.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#21DBA4] to-blue-500">{t.titleSuffix}</span>
                </>
             ) : (
                <>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#21DBA4] to-blue-500">{t.titleSuffix}</span>
                </>
             )}
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className={`text-sm md:text-lg max-w-xl mx-auto mb-10 md:mb-16 break-keep leading-relaxed font-medium px-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
          >
            {t.description}
          </motion.p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <div 
              className={`relative p-1 rounded-full flex items-center cursor-pointer ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            >
                <motion.div 
                    className="absolute top-1 bottom-1 w-[50%] bg-[#21DBA4] rounded-full shadow-sm"
                    animate={{ x: billingCycle === 'monthly' ? 0 : '100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
                <button 
                    className={`relative z-10 px-5 py-1.5 rounded-full text-xs font-bold transition-colors w-[80px] ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}
                    onClick={(e) => { e.stopPropagation(); setBillingCycle('monthly'); }}
                >
                    {t.billing.monthly}
                </button>
                <button 
                    className={`relative z-10 px-5 py-1.5 rounded-full text-xs font-bold transition-colors w-[80px] ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}
                    onClick={(e) => { e.stopPropagation(); setBillingCycle('yearly'); }}
                >
                    {t.billing.yearly}
                </button>
            </div>
            {/* Save Badge */}
            <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden md:flex items-center justify-center px-2 py-1 rounded-full bg-[#21DBA4]/10 border border-[#21DBA4]/30 text-[#21DBA4] text-[10px] font-bold"
            >
                {t.billing.save}
            </motion.div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl pb-20 mx-auto">
           {plans.map((plan, idx) => (
             <motion.div 
               key={plan.name}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               viewport={{ once: true }}
               className={`relative rounded-3xl p-6 border flex flex-col ${
                  plan.highlight 
                    ? `border-[#21DBA4] shadow-2xl shadow-[#21DBA4]/10 scale-105 z-10 ${isDark ? 'bg-slate-900' : 'bg-white'}`
                    : `${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`
               }`}
             >
                {plan.highlight && (
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#21DBA4] text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1">
                      <Crown size={10} fill="currentColor" /> {language === 'en' ? 'RECOMMENDED' : '추천 플랜'}
                   </div>
                )}

                <div className="mb-6">
                   <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                   <p className={`text-xs min-h-[32px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{plan.desc}</p>
                </div>

                <div className="mb-6 flex items-end gap-1 min-h-[48px]">
                   <span className={`text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {plan.currency}{plan.currentPrice}
                   </span>
                   <span className={`text-xs font-medium mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {plan.currentPeriod}
                   </span>
                   {billingCycle === 'yearly' && plan.price !== "0" && (
                       <span className="ml-2 text-[10px] text-[#21DBA4] font-bold mb-2 bg-[#21DBA4]/10 px-2 py-0.5 rounded-full">
                           -20%
                       </span>
                   )}
                </div>

                <button className={`w-full py-2.5 rounded-xl font-bold text-xs mb-6 transition-all ${
                   plan.highlight 
                     ? 'bg-[#21DBA4] hover:bg-[#1ec493] text-white shadow-lg shadow-[#21DBA4]/20' 
                     : isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                }`}>
                   {plan.cta}
                </button>

                <div className="space-y-3 flex-1">
                   {plan.features.map(feature => (
                      <div key={feature} className="flex items-start gap-2 text-xs">
                         <div className="mt-0.5 w-3.5 h-3.5 rounded-full bg-[#E0FBF4] flex items-center justify-center shrink-0">
                            <Check size={8} className="text-[#21DBA4]" strokeWidth={3} />
                         </div>
                         <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{feature}</span>
                      </div>
                   ))}
                   {plan.notIncluded.map(feature => (
                      <div key={feature} className="flex items-start gap-2 text-xs opacity-50">
                         <X size={14} className="text-slate-400 shrink-0" />
                         <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>{feature}</span>
                      </div>
                   ))}
                </div>
             </motion.div>
           ))}
        </div>

        {/* FAQ Teaser */}
        <div className="text-center pb-20">
           <p className={`text-sm flex items-center justify-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <HelpCircle size={16} /> {t.faq} <a href="#" className="text-[#21DBA4] hover:underline">{t.helpCenter}</a>
           </p>
        </div>

      </div>
    </div>
  );
};
