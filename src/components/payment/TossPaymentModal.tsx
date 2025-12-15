import React, { useEffect, useRef, useState } from 'react';
import { loadPaymentWidget, PaymentWidgetInstance } from '@tosspayments/payment-widget-sdk';
import { X, Check } from 'lucide-react';
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

    useEffect(() => {
        const fetchPaymentWidget = async () => {
            try {
                const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;
                const loadedWidget = await loadPaymentWidget(clientKey, customerKey);
                setPaymentWidget(loadedWidget);
            } catch (error) {
                console.error("Error loading payment widget:", error);
                toast.error("결제 위젯을 불러오는데 실패했습니다.");
            }
        };

        fetchPaymentWidget();
    }, [customerKey]);

    useEffect(() => {
        if (paymentWidget) {
            const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
                '#payment-widget',
                { value: amount },
                { variantKey: 'DEFAULT' }
            );

            // Render agreement
            paymentWidget.renderAgreement('#agreement', { variantKey: 'AGREEMENT' });

            paymentMethodsWidgetRef.current = paymentMethodsWidget;
            setIsWidgetLoaded(true);
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
        } catch (error) {
            console.error("Payment request failed:", error);
            toast.error("결제 요청에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header with Order Summary */}
                <div className="bg-[#21DBA4]/10 p-6 border-b border-[#21DBA4]/20 flex items-start justify-between">
                    <div>
                        <h3 className="font-bold text-xl text-slate-800 mb-1">결제하기</h3>
                        <p className="text-sm text-slate-500">안전하고 간편하게 결제하세요.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full text-slate-500 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Order Details */}
                <div className="px-6 py-4 bg-slate-100 border-b border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-700">{orderName}</span>
                    <span className="font-black text-xl text-[#21DBA4]">
                        {amount.toLocaleString()}원
                    </span>
                </div>

                {/* Toss Widget Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-white">
                    <div id="payment-widget" className="w-full min-h-[380px]" />
                    {/* Agreement wrapper with darker text for visibility */}
                    <div id="agreement" className="w-full mt-4 text-slate-700 text-sm" />
                </div>

                {/* Footer Action */}
                <div className="p-6 border-t border-slate-100 bg-white">
                    <button
                        onClick={handlePayment}
                        disabled={!isWidgetLoaded}
                        className="w-full bg-[#0064FF] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#0052CC] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 duration-200 flex items-center justify-center gap-2"
                    >
                        {isWidgetLoaded ? (
                            <>
                                <Check size={20} strokeWidth={3} />
                                {amount.toLocaleString()}원 결제하기
                            </>
                        ) : (
                            <span className="opacity-70">결제 모듈 로딩중...</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
