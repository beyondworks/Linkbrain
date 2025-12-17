import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { loadPaymentWidget, PaymentWidgetInstance } from '@tosspayments/payment-widget-sdk';
import { X, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface TossPaymentModalProps {
    amount: number;
    orderId: string;
    orderName: string;
    customerKey: string;
    customerEmail: string;
    successUrl: string;
    failUrl: string;
    onClose: () => void;
}

export const TossPaymentModal = ({
    amount,
    orderId,
    orderName,
    customerKey,
    customerEmail,
    successUrl,
    failUrl,
    onClose
}: TossPaymentModalProps) => {
    const [paymentWidget, setPaymentWidget] = useState<PaymentWidgetInstance | null>(null);
    const paymentMethodsWidgetRef = useRef<ReturnType<PaymentWidgetInstance['renderPaymentMethods']> | null>(null);
    const [isWidgetLoaded, setIsWidgetLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPaymentWidget = async () => {
            try {
                const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;
                console.log("[Toss] Loading widget with key:", clientKey ? `${clientKey.substring(0, 10)}...` : 'MISSING');

                if (!clientKey) {
                    setError("결제 연동 키가 설정되지 않았습니다.");
                    setIsLoading(false);
                    return;
                }

                const loadedWidget = await loadPaymentWidget(clientKey, customerKey);
                console.log("[Toss] Widget loaded successfully");
                setPaymentWidget(loadedWidget);
            } catch (err: any) {
                console.error("[Toss] Error loading widget:", err);
                setError(`결제 위젯 로드 실패: ${err.message}`);
                setIsLoading(false);
            }
        };

        fetchPaymentWidget();
    }, [customerKey]);

    useEffect(() => {
        if (paymentWidget) {
            try {
                console.log("[Toss] Rendering payment methods, amount:", amount);
                const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
                    '#payment-widget',
                    { value: amount },
                    { variantKey: 'DEFAULT' }
                );

                paymentWidget.renderAgreement('#agreement', { variantKey: 'AGREEMENT' });

                paymentMethodsWidgetRef.current = paymentMethodsWidget;
                setIsWidgetLoaded(true);
                setIsLoading(false);
                console.log("[Toss] Payment methods rendered successfully");
            } catch (err: any) {
                console.error("[Toss] Error rendering payment methods:", err);
                setError(`결제 수단 로드 실패: ${err.message}`);
                setIsLoading(false);
            }
        }
    }, [paymentWidget, amount]);

    const handlePayment = async () => {
        if (!paymentWidget) return;

        try {
            await paymentWidget.requestPayment({
                orderId,
                orderName,
                customerEmail,
                successUrl,
                failUrl,
            });
        } catch (err: any) {
            console.error("[Toss] Payment request failed:", err);
            if (err.code === 'USER_CANCEL') {
                toast.info("결제가 취소되었습니다.");
            } else {
                toast.error(`결제 요청 실패: ${err.message}`);
            }
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div>
                        <h3 className="font-bold text-lg text-slate-900">{orderName}</h3>
                        <p className="text-2xl font-black text-[#0064FF]">{amount.toLocaleString()}원</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Toss Widget Area - Full width, no padding to avoid conflicts */}
                <div className="flex-1 overflow-y-auto bg-white">
                    {isLoading && (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-[#0064FF] animate-spin" />
                            <span className="ml-3 text-slate-500">결제 수단 로딩중...</span>
                        </div>
                    )}
                    {error && (
                        <div className="p-6 text-center">
                            <p className="text-red-500 font-medium">{error}</p>
                            <button
                                onClick={onClose}
                                className="mt-4 px-4 py-2 bg-slate-100 rounded-lg text-slate-700"
                            >
                                닫기
                            </button>
                        </div>
                    )}
                    {/* Toss Payment Widget Container */}
                    <div id="payment-widget" style={{ minHeight: 300 }} />
                    <div id="agreement" className="px-4" />
                </div>

                {/* Footer - Pay Button */}
                {isWidgetLoaded && !error && (
                    <div className="p-4 border-t border-slate-100 bg-white">
                        <button
                            onClick={handlePayment}
                            className="w-full bg-[#0064FF] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#0052CC] transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            <Check size={20} strokeWidth={3} />
                            {amount.toLocaleString()}원 결제하기
                        </button>
                    </div>
                )}
            </div>
        </div>,
        document.getElementById('modal-root') || document.body
    );
};
