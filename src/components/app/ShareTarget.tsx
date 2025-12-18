import React, { useEffect, useState } from 'react';
import { useClips } from '../../hooks/useClips';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export function ShareTarget() {
    const { createClip, analyzeUrl } = useClips();
    const [status, setStatus] = useState<'initializing' | 'analyzing' | 'saving' | 'success' | 'error'>('initializing');
    const [statusMessage, setStatusMessage] = useState('Checking authentication...');

    useEffect(() => {
        const processShare = async () => {
            console.log('[ShareTarget] Processing share request...');

            // 1. Wait for Auth Initialization
            await new Promise<void>((resolve) => {
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    resolve();
                    unsubscribe();
                });
            });

            const user = auth.currentUser;
            if (!user) {
                setStatus('error');
                setStatusMessage('Please log in to save links.');
                toast.error('You need to be logged in to save links');
                // Redirect to landing page to login
                setTimeout(() => window.location.href = '/#landing', 2000);
                return;
            }

            // 2. Parse Query Params
            const params = new URLSearchParams(window.location.search);
            const title = params.get('title') || '';
            const text = params.get('text') || '';
            const url = params.get('url') || '';

            console.log('[ShareTarget] Received Params:', { title, text, url });

            // Extract URL from text if 'url' param is missing (common in Android shares)
            let targetUrl = url;
            if (!targetUrl && text) {
                const urlMatch = text.match(/(https?:\/\/[^\s]+)/g);
                if (urlMatch && urlMatch.length > 0) {
                    targetUrl = urlMatch[0];
                }
            }

            if (!targetUrl) {
                setStatus('error');
                setStatusMessage('No URL found to share.');
                toast.error('Could not find a valid URL to save');
                setTimeout(() => window.location.href = '/#app', 2000);
                return;
            }

            try {
                // 3. Analyze URL
                setStatus('analyzing');
                setStatusMessage('Analyzing link metadata...');

                // Note: analyzeUrl itself might fail or be mocked in dev
                // We'll try to use it, but fallback to basic info if it fails
                let analyzedData: any = {};
                try {
                    analyzedData = await analyzeUrl(targetUrl);
                } catch (err) {
                    console.warn('[ShareTarget] Analysis failed, using raw data:', err);
                    analyzedData = {
                        title: title || 'Shared Link',
                        summary: text || '',
                        platform: 'web',
                        type: 'website'
                    };
                }

                // 4. Save Clip
                setStatus('saving');
                setStatusMessage('Saving to Linkbrain...');

                await createClip({
                    url: targetUrl,
                    title: analyzedData.title || title || 'Shared Link',
                    summary: analyzedData.summary || text || '',
                    platform: analyzedData.platform || 'web',
                    category: 'Uncategorized',
                    type: analyzedData.type || 'website',
                    keywords: analyzedData.keywords || [],
                    sentiment: analyzedData.sentiment || 'neutral',
                    image: analyzedData.image || null,
                    author: analyzedData.author || '',
                    authorProfile: analyzedData.authorProfile || {},
                    mediaItems: analyzedData.mediaItems || [],
                    engagement: analyzedData.engagement || {},
                    mentions: analyzedData.mentions || [],
                    comments: analyzedData.comments || [],
                    publishDate: analyzedData.publishDate || null,
                    htmlContent: analyzedData.htmlContent || '',
                    // The following will be overwritten by createClip but adding for TS compatibility
                    userId: user.uid,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    isFavorite: false,
                    isArchived: false,
                    isPrivate: false
                } as any);

                setStatus('success');
                setStatusMessage('Saved successfully!');
                toast.success('Link saved to Linkbrain!');

                // 5. Redirect to App
                setTimeout(() => {
                    window.location.href = '/#app';
                }, 1500);

            } catch (error) {
                console.error('[ShareTarget] Critical Error:', error);
                setStatus('error');
                setStatusMessage('Failed to save link.');
                toast.error('Failed to save shared link');
                setTimeout(() => {
                    window.location.href = '/#app', 2000;
                });
            }
        };

        processShare();
    }, [createClip, analyzeUrl]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 font-sans">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-sm w-full text-center transition-all duration-300">

                {status === 'success' ? (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-[#21DBA4] mb-4">
                            <CheckCircle2 size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Saved!</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Redirecting to your brain...</p>
                    </div>
                ) : status === 'error' ? (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 mb-4">
                            <XCircle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Error</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">{statusMessage}</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#21DBA4]/10 flex items-center justify-center text-[#21DBA4] mb-6 relative">
                            <Loader2 size={32} className="animate-spin" />
                            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-[#21DBA4]/20"></div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Saving Link...</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium animate-pulse">
                            {statusMessage}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
