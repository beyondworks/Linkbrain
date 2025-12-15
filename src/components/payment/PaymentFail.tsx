import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { XCircle, Home } from 'lucide-react';
import { motion } from 'motion/react';

export const PaymentFail = () => {
    const [searchParams] = useSearchParams();
    const message = searchParams.get('message') || '결제가 취소되었거나 승인되지 않았습니다.';
    const code = searchParams.get('code');

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-red-500/10"
            >
                <XCircle size={40} strokeWidth={2} />
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                결제 실패
            </h1>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 max-w-md w-full">
                <p className="text-slate-600 font-medium mb-2">오류 내용</p>
                <p className="text-red-500 font-bold break-keep">{message}</p>
                {code && <p className="text-xs text-slate-400 mt-2">Code: {code}</p>}
            </div>

            <p className="text-slate-500 mb-8 max-w-md">
                문제가 지속되면 고객센터로 문의해주세요.
            </p>

            <Link
                to="/"
                className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-transform active:scale-95 flex items-center gap-2"
            >
                <Home size={18} />
                홈으로 돌아가기
            </Link>
        </div>
    );
};
