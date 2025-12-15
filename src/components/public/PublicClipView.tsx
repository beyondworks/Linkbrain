import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { usePublicClip } from '../../hooks/usePublicClip';
import { Logo } from '../Logo';
import { Loader2, Calendar, Clock, ArrowLeft, ExternalLink, Share2, Quote, ChevronRight } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, where, limit, getDocs, orderBy } from 'firebase/firestore';
import { ClipData } from '../../hooks/useClips';

// Helper component for related link card
const RelatedLinkCard = ({ clip }: { clip: ClipData }) => (
    <Link to={`/clip/${clip.id}`} className="group block bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-md transition-all hover:border-[#21DBA4]/50">
        <div className="aspect-video bg-slate-100 relative overflow-hidden">
            {clip.image ? (
                <img
                    src={clip.image}
                    alt={clip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    width="400"
                    height="225"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Logo className="w-8 h-8 opacity-20" />
                </div>
            )}
        </div>
        <div className="p-4">
            <span className="text-[10px] font-bold text-[#21DBA4] uppercase tracking-wider mb-2 block">
                {clip.category || 'Insight'}
            </span>
            <h4 className="font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-[#21DBA4] transition-colors">
                {clip.title}
            </h4>
        </div>
    </Link>
);

export const PublicClipView = () => {
    const { clipId } = useParams<{ clipId: string }>();
    const { clip, loading, error } = usePublicClip(clipId);
    const [relatedClips, setRelatedClips] = useState<ClipData[]>([]);

    // Fetch related clips based on category
    useEffect(() => {
        const fetchRelated = async () => {
            if (!clip || !clip.category) return;

            try {
                // Determine category to fetch
                const categoryToFetch = clip.category || 'general';

                const q = query(
                    collection(db, 'clips'),
                    where('category', '==', categoryToFetch),
                    orderBy('createdAt', 'desc'), // Assuming composite index exists or simple enough
                    limit(4)
                );

                const snapshot = await getDocs(q);
                // Filter out current clip
                const related = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() } as ClipData))
                    .filter(c => c.id !== clip.id)
                    .slice(0, 3); // Take top 3

                setRelatedClips(related);
            } catch (err) {
                console.error("Failed to fetch related clips", err);
            }
        };

        fetchRelated();
    }, [clip]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 text-[#21DBA4] animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading clip...</p>
            </div>
        );
    }

    if (error || !clip) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <ExternalLink size={32} />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Clip Not Found</h1>
                <p className="text-slate-500 mb-8 max-w-md">
                    The content you are looking for might have been removed or is not available.
                </p>
                <Link to="/" className="px-6 py-3 bg-[#21DBA4] text-white rounded-lg font-bold hover:bg-[#1BC290] transition-colors">
                    Go Home
                </Link>
            </div>
        );
    }

    // SEO Metadata Construction
    const pageTitle = `${clip.title} | LinkBrain - AI 링크저장 & 스레드 저장`;
    const description = clip.summary || "LinkBrain(링크브레인)으로 저장된 콘텐츠입니다. AI가 분석한 인사이트를 확인하세요.";
    const imageUrl = clip.image || "https://linkbrain.ai/og-image.png";
    const appUrl = `https://linkbrain.ai/clip/${clip.id}`;
    const categoryName = clip.category || "Uncategorized";

    // Breadcrumb Schema
    const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://linkbrain.ai"
        }, {
            "@type": "ListItem",
            "position": 2,
            "name": categoryName,
            "item": `https://linkbrain.ai/category/${categoryName.toLowerCase()}` // Hypothetical URL for structure
        }, {
            "@type": "ListItem",
            "position": 3,
            "name": clip.title
        }]
    };

    // Article Schema with Keywords & Mentions
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": clip.title,
        "image": [imageUrl],
        "datePublished": clip.createdAt,
        "dateModified": clip.updatedAt || clip.createdAt,
        "author": [{
            "@type": "Person",
            "name": clip.author || "Unknown"
        }],
        "publisher": {
            "@type": "Organization",
            "name": "LinkBrain",
            "logo": {
                "@type": "ImageObject",
                "url": "https://linkbrain.ai/logo.png"
            },
            "sameAs": [
                "https://linkbrain.ai",
                "https://twitter.com/linkbrain"
            ]
        },
        "description": description,
        "url": appUrl,
        "keywords": ["LinkBrain", "링크브레인", "링크저장", "스레드 저장", ...(clip.keywords || [])].join(", "),
        "about": clip.keywords?.map(k => ({
            "@type": "Thing",
            "name": k
        }))
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#21DBA4] selection:text-white pb-20">
            <Helmet>
                {/* Standard Metadata */}
                <title>{pageTitle}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={appUrl} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="article" />
                <meta property="og:url" content={appUrl} />
                <meta property="og:title" content={clip.title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={imageUrl} />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={appUrl} />
                <meta name="twitter:title" content={clip.title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={imageUrl} />

                {/* Structured Data Scripts */}
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbData)}
                </script>
            </Helmet>

            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Logo className="w-8 h-8 rounded-lg" />
                        <span className="font-bold text-xl tracking-tight text-[#21DBA4]">Linkbrain</span>
                    </Link>
                    <Link
                        to="/"
                        className="text-sm font-bold text-slate-500 hover:text-[#21DBA4] transition-colors"
                    >
                        앱 열기
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-3xl mx-auto px-4 pt-8 md:pt-12">

                {/* Visual Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-6 uppercase tracking-wider">
                    <Link to="/" className="hover:text-slate-600">Home</Link>
                    <ChevronRight size={12} />
                    <span className="text-slate-600">{categoryName}</span>
                </nav>

                <article className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-16">
                    {/* Hero Image - CLS Optimized with aspect ratio container */}
                    {clip.image && (
                        <div className="w-full aspect-video md:aspect-[2/1] relative overflow-hidden bg-slate-100">
                            <img
                                src={clip.image}
                                alt={clip.title}
                                className="w-full h-full object-cover"
                                loading="eager" // Hero image should be eager
                                fetchPriority="high"
                            />
                        </div>
                    )}

                    <div className="p-6 md:p-10">
                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 mb-6 uppercase tracking-wider">
                            <div className="flex items-center gap-1">
                                <Calendar size={12} />
                                <span>{new Date(clip.createdAt || Date.now()).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock size={12} />
                                <span>{clip.contentMarkdown ? Math.ceil(clip.contentMarkdown.length / 1000) : 3} min read</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-6 leading-tight break-keep">
                            {clip.title}
                        </h1>

                        {/* Summary Box */}
                        {(clip.summary) && (
                            <div className="bg-[#F0FDFA] border border-[#CCFBF1] rounded-xl p-6 mb-10 relative">
                                <Quote className="absolute top-6 left-6 text-[#21DBA4]/20 w-10 h-10" />
                                <div className="relative z-10">
                                    <h3 className="text-[#0F766E] font-bold text-sm uppercase tracking-wide mb-2">AI Summary</h3>
                                    <p className="text-[#134E4A] text-lg leading-relaxed font-medium">
                                        {clip.summary}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Usage of Concepts (Entity Linking for SEO) */}
                        {clip.keywords && clip.keywords.length > 0 && (
                            <div className="mb-10">
                                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#21DBA4]"></span>
                                    Concepts
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {clip.keywords.map((keyword, idx) => (
                                        <span key={idx} className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
                                            #{keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Content Body */}
                        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-a:text-[#21DBA4] prose-a:no-underline hover:prose-a:underline">
                            {clip.contentMarkdown ? (
                                <div className="whitespace-pre-wrap">{clip.contentMarkdown}</div>
                            ) : (
                                <p className="text-slate-400 italic">No detailed content available for this clip.</p>
                            )}
                        </div>

                        {/* External Link */}
                        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-center">
                            <a
                                href={clip.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-transform active:scale-95 shadow-lg shadow-slate-900/20"
                            >
                                <ExternalLink size={18} />
                                Visit Original Source
                            </a>
                        </div>
                    </div>
                </article>

                {/* Related Clips Mesh (Internal Linking) */}
                {relatedClips.length > 0 && (
                    <section className="mb-20">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-black text-slate-900">
                                Related Insights
                            </h3>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                More from {categoryName}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {relatedClips.map(related => (
                                <RelatedLinkCard key={related.id} clip={related} />
                            ))}
                        </div>
                    </section>
                )}

            </main>

            {/* Sticky Footer CTA */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-sm">
                <div className="bg-slate-900/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-white/10">
                    <div className="flex-1">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Powered by LinkBrain</p>
                        <p className="font-bold text-sm">Save your own links with AI</p>
                    </div>
                    <Link to="/" className="px-4 py-2 bg-[#21DBA4] text-white rounded-lg font-bold text-sm hover:bg-[#1BC290] transition-colors">
                        Try Free
                    </Link>
                </div>
            </div>
        </div>
    );
};
