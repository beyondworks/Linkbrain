import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
import { useSubscription } from '../../../hooks/useSubscription';
import { usePublicClips } from '../../../hooks/usePublicClips';
import { AskAIModal } from '../AskAI';

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
    allClips?: any[]; // 관련 클립 수집용
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
    language?: 'en' | 'ko';
}

export const LinkDetailPanel = ({ link, categories, collections, allClips = [], onClose, onToggleFavorite, onToggleReadLater, onArchive, onDelete, onUpdateCategory, onUpdateClip, onToggleCollection, onClearCollections, theme, t, language = 'ko' }: LinkDetailPanelProps) => {
    const source = getSourceInfo(link.url);
    const [currentIdx, setCurrentIdx] = useState(0);
    const { publishClip, removeFromPublic } = usePublicClips();

    // Mobile detection for responsive positioning
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Match category by ID or name (for backward compatibility with legacy data)
    const matchedCategory = categories.find((c: Category) =>
        c.id === link.categoryId || c.name?.toLowerCase() === link.categoryId?.toLowerCase()
    );
    const matchedCategoryId = matchedCategory?.id || categories[0]?.id || '';

    // Debug: Log category matching
    console.log('[DetailPanel] Category matching:', {
        linkCategoryId: link.categoryId,
        availableCategories: categories.map(c => ({ id: c.id, name: c.name })),
        matchedCategory: matchedCategory?.name || 'NONE',
        matchedCategoryId
    });

    // Memo Auto-Save Logic
    const [myNotes, setMyNotes] = useState(link.notes || '');
    const [isPrivate, setIsPrivate] = useState(link.isPrivate || false);

    // Update local state when link changes
    useEffect(() => {
        setMyNotes(link.notes || '');
        setIsPrivate(link.isPrivate || false);
    }, [link.id, link.notes, link.isPrivate]);

    // Debounced auto-save
    useEffect(() => {
        const timer = setTimeout(() => {
            if (myNotes !== (link.notes || '') && onUpdateClip) {
                console.log('Auto-saving note...');
                onUpdateClip(link.id, { notes: myNotes });
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [myNotes, link.id, link.notes, onUpdateClip]);

    const handleClose = () => {
        // Save immediately on close if dirty
        if (myNotes !== (link.notes || '') && onUpdateClip) {
            onUpdateClip(link.id, { notes: myNotes });
        }
        onClose();
    };

    // ESC key to close on desktop
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [myNotes, link.notes, onUpdateClip, link.id]);

    // Mobile swipe right to close + browser back button
    const touchStartX = useRef(0);
    const touchCurrentX = useRef(0);

    useEffect(() => {
        // Handle browser back button (popstate) on mobile
        const handlePopState = () => {
            handleClose();
        };

        // Push a state so back button can be caught
        if (isMobile) {
            window.history.pushState({ detailPanel: true }, '');
            window.addEventListener('popstate', handlePopState);
        }

        return () => {
            if (isMobile) {
                window.removeEventListener('popstate', handlePopState);
            }
        };
    }, [isMobile]);

    // Chat state - persisted per clip
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; content: string; timestamp?: number }>>([]);
    const [chatExpanded, setChatExpanded] = useState(false);
    const [chatMaximized, setChatMaximized] = useState(false); // 채팅창 크기 조절
    const [isAskAIHidden, setIsAskAIHidden] = useState(true); // AskAI 패널 숨김 상태 (기본값 숨김)
    const [isAddingTag, setIsAddingTag] = useState(false); // 태그 추가 모드
    const [newTagInput, setNewTagInput] = useState(''); // 새 태그 입력
    const chatMessagesRef = useRef<HTMLDivElement>(null);
    const chatInputRef = useRef<HTMLInputElement>(null);

    // AskAI Modal state
    const [isAskAIModalOpen, setIsAskAIModalOpen] = useState(false);

    // Auto-scroll to bottom when messages change or chat expands
    useEffect(() => {
        if (chatMessagesRef.current && chatExpanded) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [chatMessages, chatExpanded]);

    // Sync chat with Firestore/Props - runs when link data changes
    useEffect(() => {
        console.log('[LinkDetailPanel] link changed, id:', link.id, 'chatHistory:', link.chatHistory?.length || 0, 'messages');
        if (link.chatHistory && link.chatHistory.length > 0) {
            setChatMessages(link.chatHistory);
            // Keep chat collapsed by default - user can expand if needed
        } else {
            // Reset if no chat history (new clip or cleared)
            setChatMessages([]);
        }
    }, [link.id, link.chatHistory?.length, JSON.stringify(link.chatHistory)]);

    // Clear chat history for this clip
    const clearChatHistory = () => {
        setChatMessages([]);
        if (onUpdateClip) {
            onUpdateClip(link.id, { chatHistory: [] });
        }
    };

    // Send chat message to AI with clip context
    const { canUseAI } = useSubscription();

    // Find related clips based on tags and category
    const getRelatedClips = () => {
        if (!allClips || allClips.length === 0) return [];

        const currentTags = link.tags || [];
        const currentCategoryId = link.categoryId;

        // Score clips by relevance
        const scoredClips = allClips
            .filter(clip => clip.id !== link.id) // Exclude current clip
            .map(clip => {
                let score = 0;
                const clipTags = clip.tags || [];

                // Tag overlap scoring
                const tagOverlap = currentTags.filter((tag: string) => clipTags.includes(tag)).length;
                score += tagOverlap * 3;

                // Same category scoring
                if (clip.categoryId === currentCategoryId) {
                    score += 2;
                }

                // Same collection scoring
                const currentCollections = link.collectionIds || [];
                const clipCollections = clip.collectionIds || [];
                const collectionOverlap = currentCollections.filter((id: string) => clipCollections.includes(id)).length;
                score += collectionOverlap * 2;

                return { ...clip, relevanceScore: score };
            })
            .filter(clip => clip.relevanceScore > 0)
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, 5); // Top 5 related clips

        return scoredClips;
    };

    const sendChatMessage = async () => {
        if (!canUseAI) {
            toast.error(localStorage.getItem('language') === 'en'
                ? 'AI Chat is available in Free Trial or Pro Plan.'
                : 'AI 채팅은 무료 체험 또는 프로 플랜에서만 가능합니다.');
            return;
        }

        if (!chatInput.trim() || chatLoading) return;

        const userMessage = chatInput.trim();
        const userTimestamp = Date.now();
        const userMsg = { role: 'user' as const, content: userMessage, timestamp: userTimestamp };

        // Build full history including new user message
        const historyWithUser = [...chatMessages, userMsg];

        setChatInput('');
        setChatMessages(historyWithUser);
        setChatLoading(true);
        setChatExpanded(true);

        try {
            // Get related clips for enhanced context
            const relatedClips = getRelatedClips();

            // Build context for sendAskAI
            const contextData = {
                currentClip: {
                    title: link.title || 'Untitled',
                    url: link.url,
                    summary: link.summary,
                    tags: link.tags,
                    notes: link.notes
                },
                relatedClips: relatedClips.map(clip => ({
                    title: clip.title,
                    summary: clip.summary,
                    tags: clip.tags
                })),
                userInterests: [...new Set([
                    ...(link.tags || []),
                    matchedCategory?.name
                ].filter(Boolean))] as string[]
            };

            const { sendAskAI } = await import('../../../lib/aiService');
            const result = await sendAskAI(userMessage, contextData, language);

            if (result.success && result.content) {
                const aiMsg = { role: 'ai' as const, content: result.content!, timestamp: Date.now() };

                // Build complete history with AI response
                const fullHistory = [...historyWithUser, aiMsg];
                setChatMessages(fullHistory);

                // Save to Firestore
                if (onUpdateClip && link.id) {
                    console.log('[Chat] Saving to Firestore:', fullHistory.length, 'messages');
                    await onUpdateClip(link.id, { chatHistory: fullHistory });
                    console.log('[Chat] Saved successfully');
                } else {
                    console.warn('[Chat] Cannot save - onUpdateClip:', !!onUpdateClip, 'link.id:', link.id);
                }
            } else {
                console.error('[Chat] AI failed:', result.error);
                const errorMsg = { role: 'ai' as const, content: language === 'ko' ? '답변을 생성할 수 없습니다.' : 'Unable to generate response.', timestamp: Date.now() };
                setChatMessages([...historyWithUser, errorMsg]);
            }
        } catch (error) {
            console.error('[Chat] Error:', error);
            setChatMessages([...historyWithUser, { role: 'ai', content: 'Error occurred.', timestamp: Date.now() }]);
        } finally {
            setChatLoading(false);
            setTimeout(() => chatInputRef.current?.focus(), 100);
        }
    };

    // AskAI Modal handler
    const handleAskAISendMessage = async (message: string, contextDays: number): Promise<string> => {
        const { sendAskAI } = await import('../../../lib/aiService');

        // Get related clips within the specified days
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - contextDays);

        const relatedClipsFiltered = allClips
            .filter(clip => clip.id !== link.id)
            .filter(clip => {
                const clipDate = clip.createdAt ? new Date(clip.createdAt) : new Date(0);
                return clipDate >= cutoffDate;
            })
            .filter(clip => {
                const clipTags = clip.tags || [];
                const currentTags = link.tags || [];
                return currentTags.some((tag: string) => clipTags.includes(tag)) || clip.categoryId === link.categoryId;
            })
            .slice(0, 10);

        const contextData = {
            currentClip: {
                title: link.title || 'Untitled',
                url: link.url,
                summary: link.summary,
                tags: link.tags,
                notes: link.notes
            },
            relatedClips: relatedClipsFiltered.map(clip => ({
                title: clip.title,
                summary: clip.summary,
                tags: clip.tags
            })),
            userInterests: [...new Set([...(link.tags || []), matchedCategory?.name].filter(Boolean))] as string[]
        };

        const result = await sendAskAI(message, contextData, language);

        if (result.success && result.content) {
            return result.content;
        } else {
            throw new Error(result.error || 'Failed to get response');
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
                        <Instagram size={48} className="text-slate-400 dark:text-neutral-400" />
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
                        <div className={`rounded-lg ${theme === 'dark' ? 'bg-transparent p-0' : 'bg-slate-100 p-2'}`}>
                            <BookOpen size={18} className="text-slate-500 dark:text-neutral-400" />
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
                                <div className={`rounded-lg ${theme === 'dark' ? 'bg-transparent p-0' : 'bg-slate-100 p-2'}`}>
                                    <AtSign size={18} className="text-slate-500 dark:text-neutral-400" />
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
                        <div className={`rounded-lg ${theme === 'dark' ? 'bg-transparent p-0' : 'bg-slate-100 p-2'}`}>
                            <BookOpen size={18} className="text-slate-500 dark:text-neutral-400" />
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

    return createPortal(
        <div
            className="fixed bottom-0 left-0 right-0 z-[9999] flex justify-end"
            style={{ top: isMobile ? 0 : 'calc(72px + env(safe-area-inset-top, 0px))' }}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                onClick={handleClose}
            />
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={`w-full max-w-2xl h-full shadow-2xl relative flex flex-col overflow-hidden ${theme === 'dark' ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-900'}`}
            >
                {/* Header Toolbar */}
                <div
                    className={`border-b flex items-center justify-between px-6 shrink-0 transition-all ${theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'} md:h-16 md:pt-0`}
                    style={{
                        height: isMobile ? 'calc(4rem + env(safe-area-inset-top))' : undefined,
                        paddingTop: isMobile ? 'env(safe-area-inset-top)' : undefined
                    }}
                >
                    <div className="flex items-center gap-3">
                        <button onClick={handleClose} className={`p-2 -ml-2 rounded-full ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                            <X size={20} />
                        </button>
                        <div className={`h-4 w-px ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                        <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-white text-xs font-bold ${source.color}`}>
                            {source.icon} {source.name}
                        </div>
                        {/* Privacy Toggle */}
                        <button
                            onClick={async () => {
                                const newPrivacyState = !isPrivate;
                                setIsPrivate(newPrivacyState); // Update UI immediately
                                const isKorean = language === 'ko';
                                if (onUpdateClip) {
                                    await onUpdateClip(link.id, { isPrivate: newPrivacyState });
                                    if (newPrivacyState) {
                                        // Remove from public using hook
                                        removeFromPublic(link.url).catch(err => console.error('Failed to remove from public:', err));
                                        toast.success(isKorean ? '이 게시물은 커뮤니티에 공유되지 않습니다' : 'This clip is now hidden from the community');
                                    } else {
                                        // Show toast immediately
                                        toast.success(isKorean ? '이 게시물이 커뮤니티에 공유됩니다' : 'This clip is now shared with the community');
                                        // Publish to public using hook
                                        publishClip({
                                            url: link.url,
                                            title: link.title,
                                            summary: link.summary,
                                            image: link.image,
                                            platform: link.platform,
                                            category: link.category || matchedCategory?.name || 'Uncategorized',
                                            keywords: link.keywords || []
                                        }).then(result => {
                                            if (!result.success) {
                                                setIsPrivate(true); // Revert on failure
                                                toast.error(isKorean ? '커뮤니티 공유가 불가능합니다' : 'Cannot share with community');
                                            }
                                        }).catch(err => {
                                            console.error('Failed to publish:', err);
                                        });
                                    }
                                }
                            }}
                            className={`flex items-center gap-1.5 rounded-full text-xs font-bold transition-all border ${isMobile ? 'p-2' : 'px-3 py-1.5'} ${isPrivate
                                ? theme === 'dark'
                                    ? 'bg-slate-800 border-slate-700 text-slate-300'
                                    : 'bg-slate-100 border-slate-200 text-slate-600'
                                : 'bg-[#21DBA4]/10 border-[#21DBA4]/30 text-[#21DBA4]'
                                }`}
                            title={isPrivate ? 'Hidden from community' : 'Shared with community'}
                        >
                            {isPrivate ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0110 0v4" />
                                </svg>
                            ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 019.9-1" />
                                </svg>
                            )}
                            {!isMobile && (isPrivate ? 'Hidden' : 'Shared')}
                        </button>
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
                <div className={`flex-1 overflow-y-auto no-scrollbar ${theme === 'dark' ? 'bg-slate-950' : 'bg-[#F8FAFC]'}`}>
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
                                            value={matchedCategoryId}
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
                            <div className={`absolute top-0 right-0 p-4 ${theme === 'dark' ? 'opacity-0' : 'opacity-10'}`}>
                                <LinkBrainLogo size={100} variant="green" />
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className={`rounded-lg text-[#21DBA4] ${theme === 'dark' ? 'bg-transparent p-0' : 'bg-[#E0FBF4] p-2'}`}>
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
                                value={myNotes}
                                onChange={(e) => setMyNotes(e.target.value)}
                            />
                        </div>

                        {/* Tags */}
                        <div className="mb-4">
                            <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-3">{t('tags')}</h3>
                            <div className="flex flex-wrap gap-2">
                                {link.tags.map((tag: string) => (
                                    <div key={tag} className="group relative">
                                        <span className={`px-3 py-1.5 border rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400 hover:border-[#21DBA4]' : 'bg-white border-slate-200 text-slate-600 hover:border-[#21DBA4] hover:text-[#21DBA4]'}`}>
                                            #{tag}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const newTags = link.tags.filter((t: string) => t !== tag);
                                                    if (onUpdateClip) onUpdateClip(link.id, { tags: newTags });
                                                }}
                                                className="ml-1 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                                            >
                                                <X size={10} />
                                            </button>
                                        </span>
                                    </div>
                                ))}

                                {isAddingTag ? (
                                    <input
                                        type="text"
                                        autoFocus
                                        value={newTagInput}
                                        onChange={(e) => setNewTagInput(e.target.value)}
                                        onBlur={() => {
                                            if (newTagInput.trim()) {
                                                const newTags = [...(link.tags || []), newTagInput.trim()];
                                                if (onUpdateClip) onUpdateClip(link.id, { tags: newTags });
                                            }
                                            setNewTagInput('');
                                            setIsAddingTag(false);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                if (newTagInput.trim()) {
                                                    const newTags = [...(link.tags || []), newTagInput.trim()];
                                                    if (onUpdateClip) onUpdateClip(link.id, { tags: newTags });
                                                }
                                                setNewTagInput('');
                                                setIsAddingTag(false);
                                            } else if (e.key === 'Escape') {
                                                setNewTagInput('');
                                                setIsAddingTag(false);
                                            }
                                        }}
                                        className={`px-3 py-1.5 border rounded-lg text-xs font-bold outline-none min-w-[80px] ${theme === 'dark' ? 'bg-slate-900 border-[#21DBA4] text-white' : 'bg-white border-[#21DBA4] text-slate-900'}`}
                                        placeholder="Tag..."
                                    />
                                ) : (
                                    <button
                                        onClick={() => setIsAddingTag(true)}
                                        className={`px-3 py-1.5 border border-dashed rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${theme === 'dark' ? 'border-slate-700 text-slate-500 hover:text-slate-300' : 'border-slate-300 text-slate-400 hover:text-slate-600 hover:border-slate-400'}`}
                                    >
                                        <Plus size={12} /> {language === 'ko' ? '태그 추가' : 'Add Tag'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="transition-all duration-300" style={{ height: isAskAIHidden ? '6rem' : (chatMessages.length > 0 ? '55vh' : '18rem') }}></div>
                </div>

                {/* AI Chat Section - Context-aware */}
                {(() => {
                    const isAIConfigured = (localStorage.getItem('ai_api_key') || '').length > 10;
                    const relatedClipsForDisplay = allClips
                        .filter(clip => clip.id !== link.id)
                        .filter(clip => {
                            const clipTags = clip.tags || [];
                            const currentTags = link.tags || [];
                            return currentTags.some((tag: string) => clipTags.includes(tag)) ||
                                clip.categoryId === link.categoryId;
                        })
                        .slice(0, 5);
                    const clipContext = {
                        currentClip: link.title || 'Untitled',
                        tags: (link.tags || []).slice(0, 3),
                        category: matchedCategory?.name || 'General',
                        hasNotes: !!link.notes,
                        hasSummary: !!link.summary,
                        relatedCount: relatedClipsForDisplay.length
                    };
                    if (isAskAIHidden) {
                        return (
                            <div className="absolute bottom-6 right-6 z-30">
                                <button
                                    onClick={() => setIsAskAIHidden(false)}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 ${theme === 'dark' ? 'bg-slate-800 text-white border border-slate-700' : 'bg-white text-slate-800 border border-slate-100'}`}
                                >
                                    <Sparkles size={16} className="text-[#21DBA4]" />
                                    <span className="text-sm font-bold">{language === 'ko' ? 'AskAI 열기' : 'Open AskAI'}</span>
                                </button>
                            </div>
                        );
                    }
                    return (
                        <div className={`absolute bottom-0 left-0 right-0 z-20 shadow-xl overflow-hidden flex flex-col transition-all duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`} style={{ maxHeight: chatMaximized ? 'calc(100% - 64px)' : '50vh' }}>
                            {/* Context Display - Always visible */}
                            <div className={`shrink-0 px-5 py-3 border-t flex items-start justify-between ${theme === 'dark' ? 'border-slate-800 bg-slate-900/95' : 'border-slate-100 bg-white/95'}`}>
                                <div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Sparkles size={14} className="text-[#21DBA4]" />
                                        <span className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {language === 'ko' ? '이 질문은 아래 콘텐츠를 기반으로 답변돼요' : 'AI will answer based on:'}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                            {clipContext.currentClip.slice(0, 25)}{clipContext.currentClip.length > 25 ? '...' : ''}
                                        </span>
                                        {clipContext.hasSummary && (
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-[#21DBA4]/20 text-[#21DBA4]' : 'bg-[#E0FBF4] text-[#21DBA4]'}`}>
                                                AI 요약
                                            </span>
                                        )}
                                        {clipContext.tags.length > 0 && (
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                                {clipContext.tags.join(', ')}
                                            </span>
                                        )}
                                        {clipContext.hasNotes && (
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
                                                {language === 'ko' ? '내 메모' : 'My Notes'}
                                            </span>
                                        )}
                                        {clipContext.relatedCount > 0 && (
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                                                {language === 'ko' ? `관련 클립 ${clipContext.relatedCount}개` : `${clipContext.relatedCount} related`}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsAskAIHidden(true)}
                                    className={`p-1.5 rounded-lg -mr-2 transition-colors ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}
                                    title={language === 'ko' ? 'AskAI 숨기기' : 'Hide AskAI'}
                                >
                                    <ChevronDown size={18} />
                                </button>
                            </div>

                            {/* Toggle Header - show when messages exist */}
                            {chatMessages.length > 0 && (
                                <div className={`shrink-0 flex items-center justify-between px-4 py-2 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                                    <button
                                        onClick={() => setChatExpanded(!chatExpanded)}
                                        className={`flex-1 flex items-center gap-2 text-xs font-medium transition-colors ${theme === 'dark' ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        <Lightbulb size={12} className="text-[#21DBA4]" />
                                        {language === 'en' ? `${chatMessages.length} messages` : `대화 ${chatMessages.length}개`}
                                        <ChevronDown size={14} className={`transition-transform ${chatExpanded ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div className="flex items-center gap-1">
                                        {/* Maximize/Minimize button */}
                                        <button
                                            onClick={() => { setChatMaximized(!chatMaximized); setChatExpanded(true); }}
                                            className={`p-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-slate-700 text-slate-500 hover:text-slate-300' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                                            title={chatMaximized ? (language === 'ko' ? '축소' : 'Minimize') : (language === 'ko' ? '확대' : 'Maximize')}
                                        >
                                            {chatMaximized ? (
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" /><line x1="14" y1="10" x2="21" y2="3" /><line x1="3" y1="21" x2="10" y2="14" />
                                                </svg>
                                            ) : (
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
                                                </svg>
                                            )}
                                        </button>
                                        <button
                                            onClick={clearChatHistory}
                                            className={`p-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-slate-700 text-slate-500 hover:text-red-400' : 'hover:bg-slate-100 text-slate-400 hover:text-red-500'}`}
                                            title={language === 'en' ? 'Clear chat' : '대화 삭제'}
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Chat Messages - collapsible with dynamic max height */}
                            {chatMessages.length > 0 && chatExpanded && (
                                <div
                                    ref={chatMessagesRef}
                                    className={`flex-1 overflow-y-auto no-scrollbar p-4 border-t space-y-4 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}
                                    style={{ maxHeight: chatMaximized ? 'calc(100vh - 250px)' : 'calc(50vh - 180px)' }}
                                >
                                    {chatMessages.map((msg, idx) => (
                                        <div key={idx}>
                                            <div className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                {msg.role === 'ai' && (
                                                    <div className="w-6 h-6 rounded-full bg-[#21DBA4] flex items-center justify-center shrink-0 mt-1">
                                                        <Lightbulb size={12} className="text-white" />
                                                    </div>
                                                )}
                                                <div className={`max-w-[85%] px-4 py-3 rounded-xl text-sm ${msg.role === 'user'
                                                    ? 'bg-[#21DBA4] text-white'
                                                    : theme === 'dark' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'
                                                    }`}>
                                                    {msg.role === 'ai' ? (
                                                        <div className="prose prose-sm max-w-none dark:prose-invert">
                                                            {msg.content.split('\n').map((line: string, lineIdx: number) => {
                                                                // Handle headers (##, ###)
                                                                if (line.startsWith('### ')) {
                                                                    return <h4 key={lineIdx} className={`font-bold text-sm mt-3 mb-1 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>{line.replace('### ', '')}</h4>;
                                                                }
                                                                if (line.startsWith('## ')) {
                                                                    return <h3 key={lineIdx} className={`font-bold text-base mt-3 mb-1 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>{line.replace('## ', '')}</h3>;
                                                                }
                                                                // Handle bullet points
                                                                if (line.startsWith('- ') || line.startsWith('* ')) {
                                                                    return <div key={lineIdx} className="flex gap-2 ml-2 my-0.5"><span className="text-[#21DBA4]">•</span><span>{line.slice(2)}</span></div>;
                                                                }
                                                                // Handle numbered lists
                                                                if (/^\d+\.\s/.test(line)) {
                                                                    const num = line.match(/^(\d+)\./)?.[1];
                                                                    return <div key={lineIdx} className="flex gap-2 ml-2 my-0.5"><span className="text-[#21DBA4] font-bold">{num}.</span><span>{line.replace(/^\d+\.\s/, '')}</span></div>;
                                                                }
                                                                // Handle bold text (**text**)
                                                                if (line.includes('**')) {
                                                                    const parts = line.split(/\*\*(.*?)\*\*/g);
                                                                    return (
                                                                        <p key={lineIdx} className="my-1">
                                                                            {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-bold">{part}</strong> : part)}
                                                                        </p>
                                                                    );
                                                                }
                                                                // Empty line = paragraph break
                                                                if (!line.trim()) return <div key={lineIdx} className="h-2" />;
                                                                // Regular text
                                                                return <p key={lineIdx} className="my-1">{line}</p>;
                                                            })}
                                                        </div>
                                                    ) : msg.content}
                                                </div>
                                            </div>
                                            {/* Action Buttons after AI response */}
                                            {msg.role === 'ai' && idx === chatMessages.length - 1 && !chatLoading && (
                                                <div className={`mt-4 mb-4 ml-8 flex flex-wrap items-center gap-3`}>
                                                    <span className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                                                        {language === 'ko' ? '이걸로 뭘 더 해볼까요?' : 'What would you like to do?'}
                                                    </span>
                                                    <button
                                                        onClick={() => { navigator.clipboard.writeText(msg.content); toast.success(language === 'ko' ? '복사됨' : 'Copied'); }}
                                                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${theme === 'dark' ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                                                    >
                                                        {language === 'ko' ? '복사' : 'Copy'}
                                                    </button>
                                                    <button
                                                        onClick={() => { setMyNotes((prev: string) => prev ? `${prev}\n\n---\n${msg.content}` : msg.content); toast.success(language === 'ko' ? '메모에 추가됨' : 'Added to notes'); }}
                                                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${theme === 'dark' ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                                                    >
                                                        {language === 'ko' ? '메모에 추가' : 'Add to Notes'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {chatLoading && (
                                        <div className="flex gap-2">
                                            <div className="w-6 h-6 rounded-full bg-[#21DBA4] flex items-center justify-center shrink-0 animate-pulse">
                                                <Lightbulb size={12} className="text-white" />
                                            </div>
                                            <div className={`px-3 py-2 rounded-xl text-sm ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                                {language === 'en' ? 'Thinking...' : '생각 중...'}
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
                                    placeholder={isAIConfigured ? (language === 'ko' ? '이 콘텐츠에 대해 질문하세요...' : 'Ask about this content...') : (t('aiSetupRequired') || 'Set up your API key in Settings')}
                                    autoComplete="off"
                                    inputMode="text"
                                    enterKeyHint="send"
                                    style={{ touchAction: 'manipulation' }}
                                    className={`flex-1 rounded-full h-10 px-4 text-base focus:outline-none focus:ring-2 focus:ring-[#21DBA4]/20 transition-all ${!isAIConfigured ? 'cursor-not-allowed opacity-60' : ''} ${theme === 'dark' ? 'bg-slate-800 text-white focus:bg-slate-700 placeholder:text-slate-500' : 'bg-slate-100 focus:bg-white placeholder:text-slate-400'}`}
                                />
                                <button
                                    onClick={sendChatMessage}
                                    disabled={!isAIConfigured || chatLoading || !chatInput.trim()}
                                    className={`p-2 transition-colors ${isAIConfigured && chatInput.trim() ? 'text-[#21DBA4] hover:text-[#1bc290]' : 'text-slate-300 cursor-not-allowed'}`}
                                >
                                    <ArrowUpCircle size={24} />
                                </button>
                                {/* Open AskAI Modal button */}
                                <button
                                    onClick={() => setIsAskAIModalOpen(true)}
                                    className={`w-10 h-10 rounded-lg hidden md:flex items-center justify-center transition-colors ${theme === 'dark' ? 'bg-slate-800 text-[#21DBA4] hover:bg-slate-700' : 'bg-slate-100 text-[#21DBA4] hover:bg-slate-200'}`}
                                    title={language === 'ko' ? 'AskAI 확장' : 'Expand AskAI'}
                                >
                                    <Sparkles size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })()}

                {/* AskAI Modal */}
                <AskAIModal
                    isOpen={isAskAIModalOpen}
                    onClose={() => setIsAskAIModalOpen(false)}
                    clip={{
                        id: link.id,
                        title: link.title || 'Untitled',
                        url: link.url,
                        summary: link.summary,
                        tags: link.tags,
                        notes: link.notes,
                        categoryId: link.categoryId
                    }}
                    relatedClips={allClips.filter(c => c.id !== link.id).slice(0, 10)}
                    theme={theme}
                    language={language}
                    onSendMessage={handleAskAISendMessage}
                />
            </motion.div>
        </div>,
        document.body
    );
};
