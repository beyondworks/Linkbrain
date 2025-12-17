import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Globe, MapPin, Building2, Shield, FileText } from 'lucide-react';

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: LegalModalProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999]"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center p-4 z-[999999] pointer-events-none"
                    >
                        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col pointer-events-auto border border-slate-200 dark:border-slate-800 relative">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    {(title === 'Privacy Policy' || title === '개인정보처리방침') && <Shield className="text-[#21DBA4]" size={24} />}
                                    {(title === 'Terms of Service' || title === '이용약관') && <FileText className="text-[#21DBA4]" size={24} />}
                                    {(title === 'Contact Us' || title === '문의하기') && <Mail className="text-[#21DBA4]" size={24} />}
                                    {title}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto leading-relaxed text-slate-600 dark:text-slate-300 space-y-4">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );

    if (!mounted) return null;

    const modalRoot = document.getElementById('modal-root') || document.body;
    return createPortal(modalContent, modalRoot);
};

export const PrivacyContent = ({ language = 'en' }: { language?: 'en' | 'ko' }) => {
    if (language === 'ko') {
        return (
            <div className="space-y-6">
                <section>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. 개인정보 수집</h3>
                    <p>서비스 제공에 필요한 최소한의 정보만 수집합니다. 여기에는 이메일 주소와 인증 제공자의 기본 프로필 정보가 포함됩니다. 또한 LinkBrain에 명시적으로 저장한 링크와 콘텐츠를 저장합니다.</p>
                </section>
                <section>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. 개인정보 이용</h3>
                    <p>수집된 데이터는 저장된 링크를 정리하고 분석하는 목적으로만 사용됩니다. AI 처리를 통해 요약 및 태그를 생성하지만, 귀하의 데이터는 다른 목적으로 AI 모델 학습에 사용되지 않습니다.</p>
                </section>
                <section>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. 개인정보 보안</h3>
                    <p>귀하의 정보를 보호하기 위해 업계 표준 보안 조치를 시행합니다. Firebase 보안 인프라를 사용하여 전송 중 및 저장 시 데이터를 암호화합니다.</p>
                </section>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Data Collection</h3>
                <p>We collect minimal information necessary to provide our service, including your email address and basic profile information from your authentication provider. We also store the links and content you explicitly save to LinkBrain.</p>
            </section>
            <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. Data Usage</h3>
                <p>Your data is used solely for the purpose of organizing and analyzing your saved links. We use AI processing to generate summaries and tags, but your data is not used to train our AI models for other purposes.</p>
            </section>
            <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. Data Security</h3>
                <p>We implement industry-standard security measures to protect your information. Your data is encrypted in transit and at rest using Firebase security infrastructure.</p>
            </section>
        </div>
    );
};

export const TermsContent = ({ language = 'en' }: { language?: 'en' | 'ko' }) => {
    if (language === 'ko') {
        return (
            <div className="space-y-6">
                <section>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. 약관 동의</h3>
                    <p>LinkBrain에 접속하고 사용함으로써 본 이용약관에 동의하게 됩니다. 동의하지 않는 경우 서비스에 접속하거나 사용하지 마시기 바랍니다.</p>
                </section>
                <section>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. 구독 및 결제</h3>
                    <p>무료 체험판과 유료 구독 플랜을 제공합니다. 결제는 Stripe를 통해 안전하게 처리됩니다. 언제든지 구독을 취소할 수 있습니다.</p>
                </section>
                <section>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. 사용자 책임</h3>
                    <p>계정 자격 증명의 보안을 유지하고 계정에서 발생하는 모든 활동에 대해 책임을 집니다.</p>
                </section>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Acceptance of Terms</h3>
                <p>By accessing and using LinkBrain, you accept and agree to be bound by these Terms of Service. If you do not agree, you should not access or use the service.</p>
            </section>
            <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. Subscription & Payments</h3>
                <p>We offer a free trial and paid subscription plans. Payments are processed securely via Stripe. You may cancel your subscription at any time.</p>
            </section>
            <section>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. User Responsibilities</h3>
                <p>You are responsible for maintaining the security of your account credentials and for all activities that occur under your account.</p>
            </section>
        </div>
    );
};

export const ContactContent = ({ language = 'en' }: { language?: 'en' | 'ko' }) => {
    const isKo = language === 'ko';

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                        <Mail size={16} className="text-[#21DBA4]" /> {isKo ? '이메일 문의' : 'Email Support'}
                    </h4>
                    <p className="text-sm">support@linkbrain.cloud</p>
                    <div className="mt-4">
                        <a href="mailto:support@linkbrain.cloud" className="text-sm font-bold text-[#21DBA4] hover:underline">
                            {isKo ? '이메일 보내기 →' : 'Send Email →'}
                        </a>
                    </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                        <Building2 size={16} className="text-[#21DBA4]" /> {isKo ? '회사 정보' : 'Company'}
                    </h4>
                    <p className="text-sm">BeyondWorks Inc.</p>
                    <p className="text-xs text-slate-500 mt-1">{isKo ? '대한민국 서울' : 'Seoul, South Korea'}</p>
                </div>
            </div>
            <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-500">
                    {isKo ? '영업일 기준 24시간 이내에 답변드립니다.' : 'We typically respond within 24 hours on business days.'}
                </p>
            </div>
        </div>
    );
};

export const LegalModals = {
    Modal,
    PrivacyContent,
    TermsContent,
    ContactContent
};
