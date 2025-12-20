/**
 * Lemon Squeezy Integration
 * 
 * Checkout URL 생성 및 구독 관리 유틸리티
 */

// Types
export interface LemonSqueezyCheckoutParams {
    userId: string;
    userEmail: string;
    variantId?: string;
    customData?: Record<string, string>;
}

export interface LemonSqueezySubscription {
    id: string;
    status: 'active' | 'cancelled' | 'expired' | 'on_trial' | 'paused' | 'past_due' | 'unpaid';
    customerId: string;
    productId: string;
    variantId: string;
    currentPeriodEnd: string;
    cancelledAt: string | null;
}

// Config from environment - using explicit type assertion for Vite
const STORE_SLUG = (import.meta as any).env?.VITE_LEMONSQUEEZY_STORE_SLUG || 'linkbrain';
const VARIANT_ID = (import.meta as any).env?.VITE_LEMONSQUEEZY_VARIANT_ID || 'd7c88378-7cda-49f6-95b2-e63d01b01312';

/**
 * Generate Lemon Squeezy Checkout URL
 * 
 * @param params - Checkout parameters
 * @returns Checkout URL string
 */
export const createCheckoutUrl = (params: LemonSqueezyCheckoutParams): string => {
    const { userId, userEmail, variantId = VARIANT_ID, customData = {} } = params;

    // Use Lemon Squeezy's checkout URL format with UUID
    // Format: https://{store_slug}.lemonsqueezy.com/checkout/buy/{uuid}
    const baseUrl = `https://${STORE_SLUG}.lemonsqueezy.com/checkout/buy/${variantId}`;

    const queryParams = new URLSearchParams();

    // Add email if provided
    if (userEmail) {
        queryParams.set('checkout[email]', userEmail);
    }

    // Add user_id for webhook identification
    if (userId) {
        queryParams.set('checkout[custom][user_id]', userId);
    }

    // Add any additional custom data
    Object.entries(customData).forEach(([key, value]) => {
        queryParams.set(`checkout[custom][${key}]`, value);
    });

    const queryString = queryParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

/**
 * Open Lemon Squeezy Checkout in a popup or redirect
 * 
 * @param params - Checkout parameters
 * @param mode - 'popup' or 'redirect'
 */
export const openCheckout = (
    params: LemonSqueezyCheckoutParams,
    mode: 'popup' | 'redirect' = 'redirect'
): void => {
    const checkoutUrl = createCheckoutUrl(params);

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
    } else {
        // Redirect to checkout
        window.location.href = checkoutUrl;
    }
};

/**
 * Get Customer Portal URL (for managing subscription)
 * 
 * Note: This requires server-side API call with customer ID
 * For now, redirect to general Lemon Squeezy account page
 */
export const getCustomerPortalUrl = (): string => {
    return 'https://app.lemonsqueezy.com/my-orders';
};

/**
 * Map Lemon Squeezy subscription status to app status
 */
export const mapSubscriptionStatus = (lsStatus: LemonSqueezySubscription['status']): 'trial' | 'active' | 'expired' => {
    switch (lsStatus) {
        case 'active':
        case 'on_trial':
            return 'active';
        case 'cancelled':
        case 'past_due':
        case 'paused':
            return 'active'; // Still active until period ends
        case 'expired':
        case 'unpaid':
            return 'expired';
        default:
            return 'trial';
    }
};

/**
 * Check if Lemon.js script is loaded
 */
export const isLemonScriptLoaded = (): boolean => {
    return typeof window !== 'undefined' && 'createLemonSqueezy' in window;
};

/**
 * Initialize Lemon Squeezy overlay (call after component mounts)
 */
export const initLemonSqueezy = (): void => {
    if (typeof window !== 'undefined' && 'createLemonSqueezy' in window) {
        (window as any).createLemonSqueezy();
    }
};
