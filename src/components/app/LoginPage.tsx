import React, { useState } from 'react';
import { Logo } from '../Logo';
import { motion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';

export const LoginPage = ({ onLogin, theme = 'light', language = 'ko', setLanguage }: { onLogin: () => void, theme?: 'light' | 'dark', language?: 'en' | 'ko', setLanguage?: (lang: 'en' | 'ko') => void }) => {
  const [isLoading, setIsLoading] = useState(false);

  const translations = {
    en: {
      welcomeBack: "Welcome back",
      signInDesc: "Sign in to access your knowledge base",
      signInGoogle: "Sign in with Google",
      orContinue: "Or continue with email",
      email: "Email",
      continue: "Continue",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      agreement: "By clicking continue, you agree to our",
      and: "and",
      secondBrain: "Your Second Brain",
      poweredBy: "Powered by AI",
      heroDesc: "Stop bookmarking and forgetting. LinkBrain transforms your saved content into actionable insights.",
      features: ["AI-powered summaries", "Smart auto-categorization", "Natural language search"]
    },
    ko: {
      welcomeBack: "환영합니다",
      signInDesc: "나만의 지식 베이스에 접속하세요",
      signInGoogle: "Google로 계속하기",
      orContinue: "또는 이메일로 계속하기",
      email: "이메일",
      continue: "계속하기",
      terms: "이용약관",
      privacy: "개인정보처리방침",
      agreement: "계속 진행 시 다음 내용에 동의하게 됩니다:",
      and: "및",
      secondBrain: "당신의 두 번째 뇌",
      poweredBy: "AI로 완성되다",
      heroDesc: "저장하고 잊어버리는 습관은 이제 그만. LinkBrain이 저장된 콘텐츠를 살아있는 인사이트로 바꿉니다.",
      features: ["AI 기반 자동 요약", "스마트 자동 분류", "자연어 검색"]
    }
  };

  const t = translations[language];

  const handleGoogleLogin = () => {
     setIsLoading(true);
     // Simulate login delay
     setTimeout(() => {
        setIsLoading(false);
        onLogin();
     }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC]">
       {/* Language Toggle */}
       <div className="absolute top-6 right-6 z-50 flex gap-2">
          <button 
            onClick={() => setLanguage?.('en')} 
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${language === 'en' ? 'bg-[#21DBA4] text-white' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
          >
            ENG
          </button>
          <button 
            onClick={() => setLanguage?.('ko')} 
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${language === 'ko' ? 'bg-[#21DBA4] text-white' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
          >
            KOR
          </button>
       </div>

       {/* Left Side - Branding */}
       <div className="w-full md:w-1/2 bg-[#21DBA4]/5 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
             <div className="flex items-center gap-2 mb-12">
                <div className="w-8 h-8 rounded-lg bg-[#21DBA4] flex items-center justify-center cursor-pointer">
                   <Logo className="w-full h-full text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-900">LinkBrain</span>
             </div>
             
             <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6"
             >
                {t.secondBrain}<br/>
                <span className="text-[#21DBA4]">{t.poweredBy}</span>
             </motion.h1>
             <p className="text-lg text-slate-600 max-w-md leading-relaxed break-keep">
                {t.heroDesc}
             </p>
          </div>

          <div className="relative z-10 mt-12 space-y-4">
             {t.features.map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  key={i} 
                  className="flex items-center gap-3 text-slate-700 font-medium"
                >
                   <div className="w-6 h-6 rounded-full bg-[#21DBA4]/20 flex items-center justify-center text-[#21DBA4]">
                      <Check size={14} strokeWidth={3} />
                   </div>
                   {item}
                </motion.div>
             ))}
          </div>

          {/* Abstract Background Elements */}
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#21DBA4]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>
       </div>

       {/* Right Side - Login Form */}
       <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8 relative">
          <div className="w-full max-w-md space-y-8 z-10">
             <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-slate-900">{t.welcomeBack}</h2>
                <p className="text-slate-500 mt-2">{t.signInDesc}</p>
             </div>

             <div className="space-y-4">
                <button 
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full h-12 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-3 font-bold text-slate-700 relative overflow-hidden group"
                >
                   {isLoading ? (
                      <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                   ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                           <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                           <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                           <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                           <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        <span>{t.signInGoogle}</span>
                      </>
                   )}
                </button>

                <div className="relative">
                   <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                   <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">{t.orContinue}</span></div>
                </div>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleGoogleLogin(); }}>
                   <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 ml-1">{t.email}</label>
                      <input type="email" placeholder="name@example.com" className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#21DBA4] focus:ring-2 focus:ring-[#21DBA4]/20 transition-all" />
                   </div>
                   <button type="submit" className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                      {t.continue} <ArrowRight size={18} />
                   </button>
                </form>
             </div>

             <div className="text-center pt-4">
               <p className="text-xs text-slate-400 leading-relaxed px-4">
                  {t.agreement} <a href="#" className="underline hover:text-slate-600">{t.terms}</a> {t.and} <a href="#" className="underline hover:text-slate-600">{t.privacy}</a>.
               </p>
             </div>
          </div>
       </div>
    </div>
  );
};
