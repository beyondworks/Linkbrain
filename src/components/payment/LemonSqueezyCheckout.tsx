/**
 * LemonSqueezyCheckout Component
 * 
 * Checkout 버튼 및 결제 플로우 컴포넌트
 */

import React, { useEffect } from 'react';
import { createCheckoutUrl, initLemonSqueezy } from '../../lib/lemonsqueezy';
import { CreditCard, Sparkles, ExternalLink } from 'lucide-react';

interface LemonSqueezyCheckoutProps {
    userId: string;
    userEmail: string;
    variantId?: string;
    buttonText?: string;
    className?: string;
    mode?: 'popup' | 'redirect' | 'overlay';
    theme?: 'light' | 'dark';
    onCheckoutOpen?: () => void;
}

export const LemonSqueezyCheckout: React.FC<LemonSqueezyCheckoutProps> = ({
    userId,
    userEmail,
    variantId,
    buttonText = 'Pro 구독하기',
    className = '',
    mode = 'redirect',
    theme = 'dark',
    onCheckoutOpen,
}) => {
    // Initialize Lemon Squeezy overlay if using overlay mode
    useEffect(() => {
        if (mode === 'overlay') {
            // Load lemon.js script
            const script = document.createElement('script');
            script.src = 'https://app.lemonsqueezy.com/js/lemon.js';
            script.defer = true;
            script.onload = () => {
                initLemonSqueezy();
            };
            document.head.appendChild(script);

            return () => {
                document.head.removeChild(script);
            };
        }
    }, [mode]);

    const handleCheckout = () => {
        onCheckoutOpen?.();

        const checkoutUrl = createCheckoutUrl({
            userId,
            userEmail,
            variantId,
        });

        if (mode === 'popup') {
            // Open in popup window
            const width = 500;
            const height = 700;
            const left = window.screenX + (window.outerWidth - width) / 2;
            const top = window.screenY + (window.outerHeight - height) / 2;

            window.open(
                checkoutUrl,
                'LemonSqueezyCheckout',
                `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
            );
        } else if (mode === 'overlay') {
            // Use Lemon Squeezy overlay
            // The overlay requires the lemonsqueezy-button class
            // We'll redirect as fallback if overlay doesn't work
            window.location.href = checkoutUrl;
        } else {
            // Redirect to checkout
            window.location.href = checkoutUrl;
        }
    };

    const isDark = theme === 'dark';

    return (
        <button
            onClick={handleCheckout}
            className={`
        flex items-center justify-center gap-2 px-6 py-3 
        rounded-xl font-bold text-sm transition-all
        bg-[#21DBA4] text-black hover:bg-[#1bc490] 
        shadow-lg shadow-[#21DBA4]/20 hover:shadow-xl hover:shadow-[#21DBA4]/30
        hover:scale-[1.02] active:scale-[0.98]
        ${className}
      `}
        >
            <Sparkles size={18} fill="black" />
            {buttonText}
            <ExternalLink size={14} className="opacity-70" />
        </button>
    );
};

/**
 * Compact version for settings/profile
 */
export const LemonSqueezyUpgradeButton: React.FC<LemonSqueezyCheckoutProps> = (props) => {
    return (
        <LemonSqueezyCheckout
            {...props}
            className={`w-full ${props.className || ''}`}
        />
    );
};

/**
 * Manage Subscription Button
 * Redirects to Lemon Squeezy customer portal
 */
export const LemonSqueezyManageButton: React.FC<{
    className?: string;
    theme?: 'light' | 'dark';
}> = ({ className = '', theme = 'dark' }) => {
    const isDark = theme === 'dark';

    const handleManage = () => {
        window.open('https://app.lemonsqueezy.com/my-orders', '_blank');
    };

    return (
        <button
            onClick={handleManage}
            className={`
        flex items-center justify-center gap-2 px-4 py-2
        rounded-lg text-sm font-medium transition-all
        ${isDark
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                }
        ${className}
      `}
        >
            <CreditCard size={16} />
            구독 관리
        </button>
    );
};

export default LemonSqueezyCheckout;
