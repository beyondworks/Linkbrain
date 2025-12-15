import React from 'react';
import { LinkBrainPricing } from '../app/LinkBrainPricing';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BillingPage = () => {
    // Default to dark theme if system preference, but hardcoding 'light' or 'dark' based on parent is better.
    // Ideally we subscribe to a theme context. For now, we assume light or dark based on system/prop.
    // Let's use a simple wrapper that allows going back.

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 overflow-y-auto">
            <div className="fixed top-4 left-4 z-50">
                <Link
                    to="/"
                    className="p-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur shadow-sm hover:shadow-md transition-all flex items-center gap-2 pr-4 text-sm font-bold text-slate-600 dark:text-slate-300"
                >
                    <ChevronLeft size={20} />
                    Back to App
                </Link>
            </div>

            {/* Reuse the Pricing Component */}
            {/* We default to 'light' theme for now unless we pull from context, 
                but let's try to match the app style or pass a prop if we had a global theme context.
                Since we don't have easy access to the global theme state here (it's in App.tsx), 
                we might default to light or make it responsive if LinkBrainPricing handles it. 
                LinkBrainPricing takes a 'theme' prop. */}
            <LinkBrainPricing theme="light" language="ko" />
        </div>
    );
};
