import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Check, Loader2, Home } from 'lucide-react';
import { useClips } from '../../hooks/useClips';
import { motion } from 'motion/react';

export const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [verifying, setVerifying] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useClips();

    useEffect(() => {
        const verify = async () => {
            const paymentKey = searchParams.get('paymentKey');
            const orderId = searchParams.get('orderId');
            const amount = searchParams.get('amount');
            const sessionId = searchParams.get('session_id'); // Stripe

            // Case 1: Toss Payments
            if (paymentKey && orderId && amount) {
                try {
                    const response = await fetch('/api/payment/toss-confirm', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            paymentKey,
                            orderId,
                            amount: Number(amount),
                            userId: user?.uid
                        }),
                    });

                    if (!response.ok) {
                        const json = await response.json();
                        throw new Error(json.error || '결제 확인에 실패했습니다.');
                    }

                    setVerifying(false);
                } catch (err: any) {
                    console.error("Verification error:", err);
                    setError(err.message);
                    setVerifying(false);
                }
            }
            // Case 2: Stripe
            else if (sessionId) {
                setVerifying(false);
            } else {
                setError("결제 정보를 찾을 수 없습니다.");
                setVerifying(false);
            }
        };

        if (user) verify();
    }, [searchParams, user]);

    if (verifying) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <Loader2 className="w-12 h-12 text-[#21DBA4] animate-spin mb-4" />
                <h2 className="text-xl font-bold text-slate-800">결제 정보를 확인하고 있습니다...</h2>
                <p className="text-slate-500">창을 닫지 마세요.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <span className="text-3xl font-bold">!</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">결제 승인 실패</h1>
                <p className="text-slate-500 mb-8 max-w-md">{error}</p>
                <Link to="/" className="text-[#21DBA4] font-bold hover:underline">
                    홈으로 돌아가기
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 bg-[#21DBA4] text-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-[#21DBA4]/30"
            >
                <Check size={40} strokeWidth={3} />
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                환영합니다!
            </h1>
            <p className="text-slate-600 text-lg mb-8 max-w-md leading-relaxed break-keep">
                구독이 성공적으로 활성화되었습니다.<br />이제 무제한 AI 요약과 고급 검색 기능을 경험해보세요.
            </p>

            <Link
                to="/"
                className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-transform active:scale-95 flex items-center gap-2"
            >
                <Home size={18} />
                LinkBrain 시작하기
            </Link>
        </div>
    );
};

