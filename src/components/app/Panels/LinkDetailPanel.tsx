import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
    X,
    Clock,
    Star,
    Trash2,
    MoreHorizontal,
    Copy,
    Share2,
    Youtube,
    Instagram,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    Globe,
    ChevronDown,
    Brain,
    Sparkles,
    BookOpen,
    AtSign,
    FileText,
    Plus,
    Lightbulb
} from 'lucide-react';
import { LinkBrainLogo } from '../LinkBrainLogo';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem
} from '../../ui/dropdown-menu';
import { toast } from 'sonner';
import { getSourceInfo, GlobeIcon } from '../Cards';
import { Category, Collection } from '../types';

// Custom ArrowUpCircle Icon
const ArrowUpCircle = ({ size, className }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <path d="M16 12l-4-4-4 4" />
        <path d="M12 8v8" />
    </svg>
);

interface LinkDetailPanelProps {
    link: any;
    categories: Category[];
    collections: Collection[];
    onClose: () => void;
    onToggleFavorite: () => void;
    onToggleReadLater: () => void;
    onArchive: () => void;
    onDelete: () => void;
    onUpdateCategory: (linkId: string, catId: string) => void;
    onToggleCollection: (linkId: string, colId: string) => void;
    onClearCollections: (linkId: string) => void;
    theme: 'light' | 'dark';
    onUpdateClip?: (id: string, updates: any) => Promise<any>;
    t: (key: string) => string;
}

export const LinkDetailPanel = ({ link, categories, collections, onClose, onToggleFavorite, onToggleReadLater, onArchive, onDelete, onUpdateCategory, onUpdateClip, onToggleCollection, onClearCollections, theme, t }: LinkDetailPanelProps) => {
    const source = getSourceInfo(link.url);
    const [currentIdx, setCurrentIdx] = useState(0);

    // Chat state - persisted per clip
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; content: string; timestamp?: number }>>([]);
    const [chatExpanded, setChatExpanded] = useState(false);
    const chatMessagesRef = useRef<HTMLDivElement>(null);
    const chatInputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom when messages change or chat expands
    useEffect(() => {
        if (chatMessagesRef.current && chatExpanded) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [chatMessages, chatExpanded]);

    // Sync chat with Firestore/Props
    useEffect(() => {
        if (link.chatHistory) {
            setChatMessages(link.chatHistory);
            if (link.chatHistory.length > 0) setChatExpanded(true);
        }
    }, [link.chatHistory]);

    // Clear chat history for this clip
    const clearChatHistory = () => {
        setChatMessages([]);
        if (onUpdateClip) {
            onUpdateClip(link.id, { chatHistory: [] });
        }
    };

    // Send chat message to AI with clip context
    const sendChatMessage = async () => {
        if (!chatInput.trim() || chatLoading) return;

        const userMessage = chatInput.trim();
        const timestamp = Date.now();
        setChatInput('');
        setChatMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp }]);
        setChatLoading(true);
        setChatExpanded(true); // Auto-expand when sending message

        try {
            // Build context from clip data
            const clipContext = [
                `Title: ${link.title || 'Untitled'}`,
                `URL: ${link.url}`,
                link.summary ? `Summary: ${link.summary}` : '',
                link.description ? `Description: ${link.description}` : '',
                link.tags?.length ? `Tags: ${link.tags.join(', ')}` : '',
                link.notes ? `Notes: ${link.notes}` : '',
            ].filter(Boolean).join('\n');

            const { sendAIChat } = await import('../../../lib/aiService');
            const language = localStorage.getItem('language') === 'en' ? 'en' : 'ko';
            const result = await sendAIChat(userMessage, clipContext, language);

            if (result.success && result.content) {
                const aiMsg = { role: 'ai' as const, content: result.content!, timestamp: Date.now() };
                const newHistory = [...chatMessages, { role: 'user' as const, content: userMessage, timestamp }, aiMsg];
                setChatMessages(newHistory);

                // Persist to Firestore
                if (onUpdateClip) {
                    onUpdateClip(link.id, { chatHistory: newHistory });
                }
            } else {
                const errorMsg = { role: 'ai' as const, content: language === 'ko' ? '답변을 생성할 수 없습니다. 다시 시도해주세요.' : 'Unable to generate response. Please try again.', timestamp: Date.now() };
                setChatMessages(prev => [...prev, errorMsg]);
            }
        } catch (error) {
            console.error('[Chat] Error:', error);
            setChatMessages(prev => [...prev, { role: 'ai', content: 'Error occurred. Please check your API settings.', timestamp: Date.now() }]);
        } finally {
            setChatLoading(false);
            // Re-focus input after sending
            setTimeout(() => chatInputRef.current?.focus(), 100);
        }
    };

    const getYoutubeId = (url: string) => {
        const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([^#\&\?]*)/);
        return match && match[1].length === 11 ? match[1] : null;
    };

    const renderMediaSection = () => {
        const platform = source.name.toLowerCase();

        // YouTube: Embed player
        if (platform === 'youtube') {
            const videoId = getYoutubeId(link.url);
            return (
                <div className="aspect-video bg-black relative">
                    {videoId ? (
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={link.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Youtube size={48} className="text-white opacity-50" />
                        </div>
                    )}
                </div>
            );
        }

        // Threads/Instagram: Image Carousel
        if (platform === 'threads' || platform === 'instagram') {
            const images = link.images && link.images.length > 0 ? link.images : (link.image ? [link.image] : []);

            if (images.length === 0) {
                return (
                    <div className={`h-32 flex items-center justify-center ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        <Instagram size={48} className="text-slate-400" />
                    </div>
                );
            }

            return (
                <div className="relative">
                    <div
                        className="h-80 relative overflow-hidden touch-pan-y"
                        onTouchStart={(e) => {
                            const touch = e.touches[0];
                            (e.currentTarget as any)._touchStartX = touch.clientX;
                        }}
                        onTouchEnd={(e) => {
                            const touch = e.changedTouches[0];
                            const startX = (e.currentTarget as any)._touchStartX;
                            if (startX === undefined) return;
                            const diffX = touch.clientX - startX;
                            // Swipe left = next image
                            if (diffX < -50) {
                                setCurrentIdx(prev => prev === images.length - 1 ? 0 : prev + 1);
                            }
                            // Swipe right = prev image
                            if (diffX > 50) {
                                setCurrentIdx(prev => prev === 0 ? images.length - 1 : prev - 1);
                            }
                        }}
                    >
                        <img
                            src={images[currentIdx]}
                            alt={`${link.title} - Image ${currentIdx + 1}`}
                            className="w-full h-full object-cover select-none pointer-events-none"
                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                e.currentTarget.src = '/placeholder.png';
                            }}
                        />
                        {/* Visit Original Button */}
                        <a
                            href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-slate-700 px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 hover:bg-white hover:scale-105 transition-all"
                        >
                            <ExternalLink size={14} /> {t('visitOriginal')}
                        </a>
                    </div>
                    {/* Carousel Controls */}
                    {images.length > 1 && (
                        <div className={`flex items-center justify-between px-4 py-3 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-100'}`}>
                            <button
                                onClick={() => setCurrentIdx(prev => prev === 0 ? images.length - 1 : prev - 1)}
                                className={`p-2 rounded-full ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-white hover:bg-slate-200 text-slate-700'}`}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <div className="flex gap-1.5">
                                {images.map((_: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIdx(idx)}
                                        className={`h-1.5 rounded-full transition-all ${idx === currentIdx
                                            ? 'w-6 bg-[#21DBA4]'
                                            : `w-1.5 ${theme === 'dark' ? 'bg-slate-500' : 'bg-slate-300'}`
                                            }`}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentIdx(prev => prev === images.length - 1 ? 0 : prev + 1)}
                                className={`p-2 rounded-full ${theme === 'dark' ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-white hover:bg-slate-200 text-slate-700'}`}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        // Default: Single image
        return (
            <div className="h-64 relative group">
                <img src={link.image} alt={link.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                <a
                    href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-slate-700 px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 hover:bg-white hover:scale-105 transition-all"
                >
                    <ExternalLink size={14} /> {t('visitOriginal')}
                </a>
            </div>
        );
    };

    const renderContentSection = () => {
        const platform = source.name.toLowerCase();

        // YouTube: No content section
        if (platform === 'youtube') return null;

        // Threads: Split content into body and comments
        if (platform === 'threads' && link.content) {
            const COMMENTS_MARKER = '[[[COMMENTS_SECTION]]]';
            const COMMENT_SEPARATOR = '[[[COMMENT_SPLIT]]]';

            let mainText = link.content;
            let comments: string[] = [];

            if (link.content.includes(COMMENTS_MARKER)) {
                const [main, commentsPart] = link.content.split(COMMENTS_MARKER);
                mainText = main?.trim() || '';
                comments = commentsPart
                    ? commentsPart.split(COMMENT_SEPARATOR).map((c: string) => c.trim()).filter((c: string) => c.length > 0)
                    : [];
            } else {
                const legacyMatch = link.content.match(/Comments?\s*\(\d+\)/i);
                if (legacyMatch) {
                    const splitIndex = link.content.indexOf(legacyMatch[0]);
                    mainText = link.content.slice(0, splitIndex).trim();
                    const commentsRaw = link.content.slice(splitIndex + legacyMatch[0].length).trim();
                    comments = commentsRaw.split(/\n\n+/).map((c: string) => c.trim()).filter((c: string) => c.length > 3);
                }
            }

            return (
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <BookOpen size={18} className="text-slate-500" />
                        </div>
                        <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Content</h3>
                    </div>
                    <div className={`h-px mb-4 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />
                    <div className={`p-6 rounded-2xl border shadow-sm ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`} style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{mainText}</p>
                    </div>

                    {comments.length > 0 && (
                        <div className="mt-8">
                            <div className="flex items-center gap-2 mb-4">
                                <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <AtSign size={18} className="text-slate-500" />
                                </div>
                                <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Comments ({comments.length})</h3>
                            </div>
                            <div className={`h-px mb-4 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />
                            <div className={`rounded-2xl border divide-y ${theme === 'dark' ? 'bg-slate-900 border-slate-800 divide-slate-800' : 'bg-white border-slate-100 divide-slate-100'}`}>
                                {comments.map((comment: string, idx: number) => (
                                    <div key={idx} className="p-4">
                                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // Default: Show content as-is
        if (link.content) {
            return (
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <BookOpen size={18} className="text-slate-500" />
                        </div>
                        <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>본문 내용</h3>
                    </div>
                    <div className={`p-6 rounded-2xl border shadow-sm prose prose-sm max-w-none ${theme === 'dark' ? 'bg-slate-900 border-slate-800 prose-invert' : 'bg-white border-slate-100'}`} style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                        {link.content.split('\n').map((line: string, idx: number) => (
                            <p key={idx} className={`mb-3 text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                                {line || <br />}
                            </p>
                        ))}
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="fixed inset-0 z-[60] flex justify-end">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                onClick={onClose}
            />
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={`w-full max-w-2xl h-full shadow-2xl relative flex flex-col overflow-hidden ${theme === 'dark' ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-900'}`}
            >
                {/* Header Toolbar */}
                <div className={`h-16 border-b flex items-center justify-between px-6 shrink-0 ${theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className={`p-2 -ml-2 rounded-full ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                            <X size={20} />
                        </button>
                        <div className={`h-4 w-px ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                        <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-white text-xs font-bold ${source.color}`}>
                            {source.icon} {source.name}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={onToggleReadLater} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} ${link.isReadLater ? 'text-[#21DBA4]' : 'text-slate-400'}`} title="Read Later">
                            <Clock size={18} fill={link.isReadLater ? "currentColor" : "none"} />
                        </button>
                        <button onClick={onToggleFavorite} className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} ${link.isFavorite ? 'text-yellow-400' : 'text-slate-400'}`} title="Favorite">
                            <Star size={18} fill={link.isFavorite ? "currentColor" : "none"} />
                        </button>
                        <button onClick={onDelete} className={`p-2 rounded-full hover:text-red-500 transition-colors ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-red-50 text-slate-400'}`} title="Delete">
                            <Trash2 size={18} />
                        </button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className={`p-2 rounded-full text-slate-400 ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}>
                                    <MoreHorizontal size={18} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(link.url); toast.success("Link copied to clipboard"); }}>
                                    <Copy className="mr-2 h-4 w-4" /> Copy Link
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { toast.success("Shared successfully"); }}>
                                    <Share2 className="mr-2 h-4 w-4" /> Share
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={onDelete} className="text-red-600 focus:text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className={`flex-1 overflow-y-auto ${theme === 'dark' ? 'bg-slate-950' : 'bg-[#F8FAFC]'}`}>
                    {renderMediaSection()}

                    <div className="p-8 max-w-xl mx-auto">
                        <div className="mb-6 overflow-hidden">
                            <h1 className={`text-2xl md:text-3xl font-black leading-tight mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{link.title}</h1>
                            <a
                                href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-start gap-2 text-sm hover:underline overflow-hidden ${theme === 'dark' ? 'text-slate-400 hover:text-[#21DBA4]' : 'text-slate-500 hover:text-[#21DBA4]'}`}
                            >
                                <Globe size={14} className="shrink-0 mt-0.5" />
                                <span className="min-w-0" style={{ wordBreak: 'break-all' }}>{link.url}</span>
                            </a>
                        </div>

                        {/* Category & Collection Editor */}
                        <div className={`mb-8 p-6 rounded-2xl border shadow-sm ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                            <div className="grid grid-cols-[100px_1fr] gap-y-6 items-center">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t('category')}</label>
                                <div>
                                    <div className="relative inline-block w-full max-w-[200px]">
                                        <select
                                            value={link.categoryId}
                                            onChange={(e) => onUpdateCategory(link.id, e.target.value)}
                                            className={`appearance-none w-full text-sm font-bold px-4 py-2.5 rounded-xl border outline-none focus:border-[#21DBA4] focus:ring-2 focus:ring-[#21DBA4]/20 transition-all cursor-pointer ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                                        >
                                            {categories.map((c: Category) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                                    </div>
                                </div>

                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t('collections')}</label>
                                <div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className={`w-full max-w-[200px] text-left text-sm font-bold px-4 py-2.5 rounded-xl border outline-none focus:border-[#21DBA4] focus:ring-2 focus:ring-[#21DBA4]/20 transition-all cursor-pointer flex items-center justify-between ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                                                <span className="truncate block">
                                                    {(link.collectionIds || []).length > 0
                                                        ? collections.filter((c: Collection) => (link.collectionIds || []).includes(c.id)).map((c: Collection) => c.name).join(', ')
                                                        : <span className="text-slate-400 font-normal">{t('noCollections')}</span>}
                                                </span>
                                                <ChevronDown className="text-slate-400 ml-2 shrink-0" size={14} />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-[200px] z-[100]" align="start">
                                            {collections.map((col: Collection) => (
                                                <DropdownMenuCheckboxItem
                                                    key={col.id}
                                                    checked={(link.collectionIds || []).includes(col.id)}
                                                    onCheckedChange={() => onToggleCollection(link.id, col.id)}
                                                    onSelect={(e: Event) => e.preventDefault()}
                                                >
                                                    {col.name}
                                                </DropdownMenuCheckboxItem>
                                            ))}
                                            {(link.collectionIds || []).length > 0 && (
                                                <>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => onClearCollections(link.id)}
                                                        className="text-slate-500 text-xs"
                                                    >
                                                        {t('deselectAll')}
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                            {collections.length === 0 && <div className="p-2 text-xs text-slate-500 italic text-center">No collections</div>}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>

                        {/* AI Takeaways */}
                        <div className={`rounded-2xl p-6 border shadow-sm mb-8 relative overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <LinkBrainLogo size={100} variant="green" />
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-[#E0FBF4] rounded-lg text-[#21DBA4]">
                                    <Sparkles size={18} />
                                </div>
                                <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t('aiTakeaways')}</h3>
                            </div>
                            <div className="space-y-3 relative z-10">
                                {link.keyTakeaways ? (
                                    <ul className="space-y-2">
                                        {link.keyTakeaways.map((point: string, idx: number) => (
                                            <li key={idx} className={`flex gap-3 text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                                <span className="text-[#21DBA4] font-bold text-lg leading-none">•</span>
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-slate-600 text-sm leading-relaxed">{link.summary}</p>
                                )}
                            </div>
                        </div>

                        {renderContentSection()}

                        {/* My Notes */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={`font-bold text-lg flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                                    <FileText size={18} className="text-slate-400" /> {t('myNotes')}
                                </h3>
                                <span className="text-xs text-slate-400">{t('autoSaved')}</span>
                            </div>
                            <textarea
                                className={`w-full min-h-[150px] p-4 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#21DBA4]/20 focus:border-[#21DBA4] transition-all resize-y placeholder:text-slate-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'}`}
                                placeholder="Add your thoughts, ideas, or connect this with other concepts..."
                                defaultValue={link.notes}
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-3">{t('tags')}</h3>
                            <div className="flex flex-wrap gap-2">
                                {link.tags.map((tag: string) => (
                                    <span key={tag} className={`px-3 py-1.5 border rounded-lg text-xs font-bold transition-colors cursor-pointer ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400 hover:border-[#21DBA4]' : 'bg-white border-slate-200 text-slate-600 hover:border-[#21DBA4] hover:text-[#21DBA4]'}`}>
                                        #{tag}
                                    </span>
                                ))}
                                <button className={`px-3 py-1.5 border border-dashed rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${theme === 'dark' ? 'border-slate-700 text-slate-500 hover:text-slate-300' : 'border-slate-300 text-slate-400 hover:text-slate-600 hover:border-slate-400'}`}>
                                    <Plus size={12} /> {t('addLink')}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="h-32 md:h-20"></div>
                </div>

                {/* AI Chat Section */}
                {(() => {
                    const isAIConfigured = (localStorage.getItem('ai_api_key') || '').length > 10;
                    return (
                        <div className={`absolute bottom-0 left-0 right-0 z-20 shadow-xl max-h-[40vh] overflow-hidden flex flex-col ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
                            {/* Toggle Header - show when messages exist */}
                            {chatMessages.length > 0 && (
                                <div className={`shrink-0 flex items-center justify-between px-4 py-2 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                                    <button
                                        onClick={() => setChatExpanded(!chatExpanded)}
                                        className={`flex-1 flex items-center gap-2 text-xs font-medium transition-colors ${theme === 'dark' ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <Lightbulb size={12} className="text-[#21DBA4]" />
                                        {localStorage.getItem('language') === 'en' ? `${chatMessages.length} messages` : `대화 ${chatMessages.length}개`}
                                        <ChevronDown size={14} className={`transition-transform ${chatExpanded ? 'rotate-180' : ''}`} />
                                    </button>
                                    <button
                                        onClick={clearChatHistory}
                                        className={`p-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-slate-700 text-slate-500 hover:text-red-400' : 'hover:bg-slate-100 text-slate-400 hover:text-red-500'}`}
                                        title={localStorage.getItem('language') === 'en' ? 'Clear chat' : '대화 삭제'}
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            )}
                            {/* Chat Messages - collapsible with fixed max height */}
                            {chatMessages.length > 0 && chatExpanded && (
                                <div
                                    ref={chatMessagesRef}
                                    className={`overflow-y-auto p-4 border-t space-y-3 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}
                                    style={{ maxHeight: 'calc(40vh - 120px)' }}
                                >
                                    {chatMessages.map((msg, idx) => (
                                        <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            {msg.role === 'ai' && (
                                                <div className="w-6 h-6 rounded-full bg-[#21DBA4] flex items-center justify-center shrink-0">
                                                    <Lightbulb size={12} className="text-white" />
                                                </div>
                                            )}
                                            <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${msg.role === 'user'
                                                ? 'bg-[#21DBA4] text-white'
                                                : theme === 'dark' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))}
                                    {chatLoading && (
                                        <div className="flex gap-2">
                                            <div className="w-6 h-6 rounded-full bg-[#21DBA4] flex items-center justify-center shrink-0 animate-pulse">
                                                <Lightbulb size={12} className="text-white" />
                                            </div>
                                            <div className={`px-3 py-2 rounded-xl text-sm ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                                {localStorage.getItem('language') === 'en' ? 'Thinking...' : '생각 중...'}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            {/* Input Area */}
                            <div className={`shrink-0 p-4 border-t flex items-center gap-2 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 ${isAIConfigured ? 'bg-[#21DBA4]' : 'bg-slate-400'}`}>
                                    <Lightbulb size={16} />
                                </div>
                                <input
                                    type="text"
                                    ref={chatInputRef}
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                                    disabled={!isAIConfigured || chatLoading}
                                    placeholder={isAIConfigured ? (t('askAI') || 'Ask AI about this content...') : (t('aiSetupRequired') || 'Set up your API key in Settings')}
                                    className={`flex-1 rounded-full h-10 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#21DBA4]/20 transition-all ${!isAIConfigured ? 'cursor-not-allowed opacity-60' : ''} ${theme === 'dark' ? 'bg-slate-800 text-white focus:bg-slate-700 placeholder:text-slate-500' : 'bg-slate-100 focus:bg-white placeholder:text-slate-400'}`}
                                />
                                <button
                                    onClick={sendChatMessage}
                                    disabled={!isAIConfigured || chatLoading || !chatInput.trim()}
                                    className={`p-2 transition-colors ${isAIConfigured && chatInput.trim() ? 'text-[#21DBA4] hover:text-[#1bc290]' : 'text-slate-300 cursor-not-allowed'}`}
                                >
                                    <ArrowUpCircle size={24} />
                                </button>
                            </div>
                        </div>
                    );
                })()}
            </motion.div>
        </div>
    );
};
