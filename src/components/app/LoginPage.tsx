import React, { useState, useEffect } from 'react';
import { Logo } from '../Logo';
import { motion } from 'motion/react';
import { ArrowRight, Check, AlertCircle } from 'lucide-react';
import { auth } from '../../lib/firebase';
import {
   signInWithEmailAndPassword,
   createUserWithEmailAndPassword,
   signInWithPopup,
   signInWithRedirect,
   getRedirectResult,
   GoogleAuthProvider
} from 'firebase/auth';
import { toast } from 'sonner';

const googleProvider = new GoogleAuthProvider();

export const LoginPage = ({ onLogin, theme = 'light', language = 'ko', setLanguage }: { onLogin: () => void, theme?: 'light' | 'dark', language?: 'en' | 'ko', setLanguage?: (lang: 'en' | 'ko') => void }) => {
   const [isLoading, setIsLoading] = useState(false);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [inviteCode, setInviteCode] = useState('');
   const [inviteCodeValid, setInviteCodeValid] = useState<boolean | null>(null);
   const [inviteCodeChecking, setInviteCodeChecking] = useState(false);
   const [error, setError] = useState('');
   const [isSignUp, setIsSignUp] = useState(false);

   const translations = {
      en: {
         welcomeBack: "Welcome back",
         createAccount: "Create account",
         signInDesc: "Sign in to access your knowledge base",
         signUpDesc: "Start building your second brain",
         signInGoogle: "Sign in with Google",
         signUpGoogle: "Sign up with Google",
         orContinue: "Or continue with email",
         email: "Email",
         password: "Password",
         continue: "Continue",
         signIn: "Sign in",
         signUp: "Sign up",
         noAccount: "Don't have an account?",
         hasAccount: "Already have an account?",
         terms: "Terms of Service",
         privacy: "Privacy Policy",
         agreement: "By clicking continue, you agree to our",
         and: "and",
         secondBrain: "Your Second Brain",
         poweredBy: "Powered by AI",
         heroDesc: "Stop bookmarking and forgetting. LinkBrain transforms your saved content into actionable insights.",
         features: ["AI-powered summaries", "Smart auto-categorization", "Natural language search"],
         errorInvalidEmail: "Invalid email address",
         errorWrongPassword: "Incorrect password",
         errorUserNotFound: "Account not found. Please sign up.",
         errorEmailInUse: "Email already in use. Please sign in.",
         errorWeakPassword: "Password must be at least 6 characters",
         errorGeneric: "An error occurred. Please try again.",
         inviteCode: "Invite Code",
         inviteCodePlaceholder: "LB-XXXXXX",
         inviteCodeRequired: "Invite code is required to sign up",
         inviteCodeInvalid: "Invalid or already used invite code",
         inviteCodeValid: "Valid invite code!",
         inviteCodeChecking: "Checking...",
         inviteCodeHint: "Don't have a code? Ask a friend using LinkBrain!"
      },
      ko: {
         welcomeBack: "환영합니다",
         createAccount: "계정 만들기",
         signInDesc: "나만의 지식 베이스에 접속하세요",
         signUpDesc: "두 번째 뇌를 만들어 보세요",
         signInGoogle: "Google로 로그인",
         signUpGoogle: "Google로 가입하기",
         orContinue: "또는 이메일로 계속하기",
         email: "이메일",
         password: "비밀번호",
         continue: "계속하기",
         signIn: "로그인",
         signUp: "가입하기",
         noAccount: "계정이 없으신가요?",
         hasAccount: "이미 계정이 있으신가요?",
         terms: "이용약관",
         privacy: "개인정보처리방침",
         agreement: "계속 진행 시 다음 내용에 동의하게 됩니다:",
         and: "및",
         secondBrain: "당신의 두 번째 뇌",
         poweredBy: "AI로 완성되다",
         heroDesc: "저장하고 잊어버리는 습관은 이제 그만. LinkBrain이 저장된 콘텐츠를 살아있는 인사이트로 바꿉니다.",
         features: ["AI 기반 자동 요약", "스마트 자동 분류", "자연어 검색"],
         errorInvalidEmail: "유효하지 않은 이메일 주소입니다",
         errorWrongPassword: "비밀번호가 올바르지 않습니다",
         errorUserNotFound: "계정을 찾을 수 없습니다. 회원가입해주세요.",
         errorEmailInUse: "이미 사용 중인 이메일입니다. 로그인해주세요.",
         errorWeakPassword: "비밀번호는 6자 이상이어야 합니다",
         errorGeneric: "오류가 발생했습니다. 다시 시도해주세요.",
         inviteCode: "초대 코드",
         inviteCodePlaceholder: "LB-XXXXXX",
         inviteCodeRequired: "가입하려면 초대 코드가 필요합니다",
         inviteCodeInvalid: "유효하지 않거나 이미 사용된 초대 코드입니다",
         inviteCodeValid: "유효한 초대 코드입니다!",
         inviteCodeChecking: "확인 중...",
         inviteCodeHint: "초대 코드가 없으신가요? LinkBrain을 사용하는 친구에게 요청하세요!"
      }
   };

   const t = translations[language];

   const getErrorMessage = (code: string) => {
      switch (code) {
         case 'auth/invalid-email':
            return t.errorInvalidEmail;
         case 'auth/wrong-password':
         case 'auth/invalid-credential':
            return t.errorWrongPassword;
         case 'auth/user-not-found':
            return t.errorUserNotFound;
         case 'auth/email-already-in-use':
            return t.errorEmailInUse;
         case 'auth/weak-password':
            return t.errorWeakPassword;
         case 'auth/popup-blocked':
            return language === 'ko' ? '팝업이 차단되었습니다. 다시 시도합니다...' : 'Popup blocked. Retrying...';
         case 'auth/popup-closed-by-user':
            return language === 'ko' ? '로그인 창이 닫혔습니다.' : 'Login window was closed.';
         case 'auth/network-request-failed':
            return language === 'ko' ? '네트워크 오류입니다. 인터넷 연결을 확인해주세요.' : 'Network error. Please check your connection.';
         case 'auth/cancelled-popup-request':
            return language === 'ko' ? '이전 로그인 요청이 취소되었습니다.' : 'Previous login request was cancelled.';
         case 'auth/internal-error':
            return language === 'ko' ? '내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' : 'Internal error. Please try again later.';
         default:
            console.log('[Auth Error] Unknown error code:', code);
            return t.errorGeneric;
      }
   };

   // Handle redirect result on component mount (for browsers that used redirect)
   useEffect(() => {
      getRedirectResult(auth)
         .then((result) => {
            if (result?.user) {
               toast.success(language === 'ko' ? '로그인 성공!' : 'Login successful!');
            }
         })
         .catch((err) => {
            if (err.code && err.code !== 'auth/popup-closed-by-user') {
               console.error('[Firebase Auth] Redirect result error:', err);
               setError(getErrorMessage(err.code));
            }
         });
   }, []);

   const handleGoogleLogin = async () => {
      setIsLoading(true);
      setError('');
      try {
         await signInWithPopup(auth, googleProvider);
         toast.success(language === 'ko' ? '로그인 성공!' : 'Login successful!');
      } catch (err: any) {
         console.error('[Firebase Auth] Google login error:', err);

         // If popup was blocked or closed, try redirect method
         if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
            toast.info(language === 'ko' ? '팝업이 차단되어 다른 방식으로 로그인합니다...' : 'Popup blocked, trying alternative login...');
            try {
               await signInWithRedirect(auth, googleProvider);
               // Will redirect, so no need to handle success here
               return;
            } catch (redirectErr: any) {
               console.error('[Firebase Auth] Redirect fallback error:', redirectErr);
               setError(getErrorMessage(redirectErr.code));
               toast.error(getErrorMessage(redirectErr.code));
            }
         } else {
            setError(getErrorMessage(err.code));
            toast.error(getErrorMessage(err.code));
         }
      } finally {
         setIsLoading(false);
      }
   };

   // Validate invite code as user types
   const validateInviteCode = async (code: string) => {
      if (!code || code.length < 9) {
         setInviteCodeValid(null);
         return;
      }

      setInviteCodeChecking(true);
      try {
         const response = await fetch('/api/invite?action=validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: code.toUpperCase() }),
         });
         const data = await response.json();
         setInviteCodeValid(data.valid);
      } catch (err) {
         setInviteCodeValid(false);
      } finally {
         setInviteCodeChecking(false);
      }
   };

   const handleEmailAuth = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      if (!email || !password) {
         setError(language === 'ko' ? '이메일과 비밀번호를 입력해주세요' : 'Please enter email and password');
         setIsLoading(false);
         return;
      }

      // For sign up, require valid invite code
      if (isSignUp) {
         if (!inviteCode) {
            setError(t.inviteCodeRequired);
            setIsLoading(false);
            return;
         }
         if (!inviteCodeValid) {
            setError(t.inviteCodeInvalid);
            setIsLoading(false);
            return;
         }
      }

      try {
         if (isSignUp) {
            // Create account first
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Redeem invite code to set up subscription
            try {
               await fetch('/api/invite?action=redeem', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                     code: inviteCode.toUpperCase(),
                     newUserUid: userCredential.user.uid
                  }),
               });
            } catch (inviteErr) {
               console.error('[Invite] Redeem error:', inviteErr);
            }

            toast.success(language === 'ko' ? '회원가입 성공! 15일 체험이 시작됩니다.' : 'Account created! Your 15-day trial starts now.');
         } else {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success(language === 'ko' ? '로그인 성공!' : 'Login successful!');
         }
      } catch (err: any) {
         console.error('[Firebase Auth] Email auth error:', err);
         setError(getErrorMessage(err.code));
         toast.error(getErrorMessage(err.code));
      } finally {
         setIsLoading(false);
      }
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
                  {t.secondBrain}<br />
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
                  <h2 className="text-2xl font-bold text-slate-900">
                     {isSignUp ? t.createAccount : t.welcomeBack}
                  </h2>
                  <p className="text-slate-500 mt-2">
                     {isSignUp ? t.signUpDesc : t.signInDesc}
                  </p>
               </div>

               {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                     <AlertCircle size={16} />
                     {error}
                  </div>
               )}

               <div className="space-y-4">
                  <button
                     onClick={handleGoogleLogin}
                     disabled={isLoading}
                     className="w-full h-12 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-3 font-bold text-slate-700 relative overflow-hidden group disabled:opacity-50"
                  >
                     {isLoading ? (
                        <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                     ) : (
                        <>
                           <svg className="w-5 h-5" viewBox="0 0 24 24">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                           </svg>
                           <span>{isSignUp ? t.signUpGoogle : t.signInGoogle}</span>
                        </>
                     )}
                  </button>

                  <div className="relative">
                     <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                     <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">{t.orContinue}</span></div>
                  </div>

                  <form className="space-y-4" onSubmit={handleEmailAuth}>
                     <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 ml-1">{t.email}</label>
                        <input
                           type="email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           placeholder="name@example.com"
                           className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#21DBA4] focus:ring-2 focus:ring-[#21DBA4]/20 transition-all"
                        />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 ml-1">{t.password}</label>
                        <input
                           type="password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           placeholder="••••••••"
                           className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#21DBA4] focus:ring-2 focus:ring-[#21DBA4]/20 transition-all"
                        />
                     </div>

                     {/* Invite Code Field - Only for Sign Up */}
                     {isSignUp && (
                        <div className="space-y-1.5">
                           <label className="text-xs font-bold text-slate-500 ml-1 flex items-center gap-2">
                              {t.inviteCode}
                              {inviteCodeChecking && (
                                 <span className="text-slate-400 font-normal">{t.inviteCodeChecking}</span>
                              )}
                              {inviteCodeValid === true && (
                                 <span className="text-green-500 font-normal flex items-center gap-1">
                                    <Check size={12} /> {t.inviteCodeValid}
                                 </span>
                              )}
                              {inviteCodeValid === false && (
                                 <span className="text-red-500 font-normal">{t.inviteCodeInvalid}</span>
                              )}
                           </label>
                           <input
                              type="text"
                              value={inviteCode}
                              onChange={(e) => {
                                 const val = e.target.value.toUpperCase();
                                 setInviteCode(val);
                                 validateInviteCode(val);
                              }}
                              placeholder={t.inviteCodePlaceholder}
                              className={`w-full h-11 rounded-xl border px-4 text-sm outline-none transition-all font-mono tracking-wider ${inviteCodeValid === true
                                 ? 'border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                                 : inviteCodeValid === false
                                    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                                    : 'border-slate-200 focus:border-[#21DBA4] focus:ring-2 focus:ring-[#21DBA4]/20'
                                 }`}
                           />
                           <p className="text-xs text-slate-400 ml-1">{t.inviteCodeHint}</p>
                        </div>
                     )}
                     <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                     >
                        {isLoading ? (
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                           <>
                              {isSignUp ? t.signUp : t.signIn} <ArrowRight size={18} />
                           </>
                        )}
                     </button>
                  </form>

                  <div className="text-center">
                     <button
                        onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                        className="text-sm text-slate-500 hover:text-[#21DBA4] transition-colors"
                     >
                        {isSignUp ? t.hasAccount : t.noAccount}{' '}
                        <span className="font-bold underline">{isSignUp ? t.signIn : t.signUp}</span>
                     </button>
                  </div>
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
