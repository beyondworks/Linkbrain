import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Globe, MapPin, Building2, Shield, FileText } from 'lucide-react';

interface LegalModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: LegalModalProps) => (
    <AnimatePresence>
        {isOpen && (
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="fixed inset-0 flex items-center justify-center p-4 z-[99999] pointer-events-none"
                >
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col pointer-events-auto border border-slate-200 dark:border-slate-800">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                {title === 'Privacy Policy' && <Shield className="text-[#21DBA4]" size={24} />}
                                {title === 'Terms of Service' && <FileText className="text-[#21DBA4]" size={24} />}
                                {title === 'Contact Us' && <Mail className="text-[#21DBA4]" size={24} />}
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

export const PrivacyContent = () => (
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

export const TermsContent = () => (
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

export const ContactContent = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                    <Mail size={16} className="text-[#21DBA4]" /> Email Support
                </h4>
                <p className="text-sm">support@linkbrain.cloud</p>
                <div className="mt-4">
                    <a href="mailto:support@linkbrain.cloud" className="text-sm font-bold text-[#21DBA4] hover:underline">Send Email &rarr;</a>
                </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                    <Building2 size={16} className="text-[#21DBA4]" /> Company
                </h4>
                <p className="text-sm">BeyondWorks Inc.</p>
                <p className="text-xs text-slate-500 mt-1">Seoul, South Korea</p>
            </div>
        </div>
        <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-500">We typically respond within 24 hours on business days.</p>
        </div>
    </div>
);

export const LegalModals = {
    Modal,
    PrivacyContent,
    TermsContent,
    ContactContent
};
