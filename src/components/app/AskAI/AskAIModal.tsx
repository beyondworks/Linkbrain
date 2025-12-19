import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Lightbulb, Send, Calendar, FileText, Zap, PenLine, MessageCircle } from 'lucide-react';

interface AskAIModalProps {
    isOpen: boolean;
    onClose: () => void;
    clip: {
        id: string;
        title: string;
        url: string;
        summary?: string;
        tags?: string[];
        notes?: string;
        categoryId?: string;
    };
    relatedClips?: Array<{
        id: string;
        title: string;
        summary?: string;
        tags?: string[];
        createdAt?: string;
    }>;
    theme: 'light' | 'dark';
    language: 'ko' | 'en';
    onSendMessage: (message: string, contextDays: number) => Promise<string>;
}

type IntentType = 'summary' | 'ideas' | 'draft' | 'custom';

interface ConversationMessage {
    role: 'ai' | 'user';
    content: string;
    timestamp: number;
}

export const AskAIModal: React.FC<AskAIModalProps> = ({
    isOpen,
    onClose,
    clip,
    relatedClips = [],
    theme,
    language,
    onSendMessage,
}) => {
    const [step, setStep] = useState<'intent' | 'conversation'>('intent');
    const [selectedIntent, setSelectedIntent] = useState<IntentType | null>(null);
    const [contextDays, setContextDays] = useState<7 | 14 | 30>(7);
    const [messages, setMessages] = useState<ConversationMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep('intent');
            setSelectedIntent(null);
            setMessages([]);
            setInputValue('');
        }
    }, [isOpen]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const intentOptions = [
        {
            id: 'summary' as IntentType,
            icon: <FileText size={20} />,
            label: language === 'ko' ? '핵심 요약' : 'Key Summary',
            description: language === 'ko' ? '이 콘텐츠의 핵심만 정리해줘' : 'Summarize the key points',
        },
        {
            id: 'ideas' as IntentType,
            icon: <Zap size={20} />,
            label: language === 'ko' ? '아이디어 제안' : 'Ideas & Suggestions',
            description: language === 'ko' ? '이걸로 뭘 할 수 있을지 알려줘' : 'What can I do with this?',
        },
        {
            id: 'draft' as IntentType,
            icon: <PenLine size={20} />,
            label: language === 'ko' ? '글 초안 작성' : 'Draft Writing',
            description: language === 'ko' ? '이 주제로 글을 써줘' : 'Write a draft on this topic',
        },
        {
            id: 'custom' as IntentType,
            icon: <MessageCircle size={20} />,
            label: language === 'ko' ? '직접 질문하기' : 'Ask Freely',
            description: language === 'ko' ? '원하는 걸 물어볼게' : 'I have my own question',
        },
    ];

    const handleIntentSelect = async (intent: IntentType) => {
        setSelectedIntent(intent);
        setStep('conversation');

        if (intent !== 'custom') {
            // AI responds with initial question based on intent
            const aiInitialMessage = getInitialAIMessage(intent);
            setMessages([{ role: 'ai', content: aiInitialMessage, timestamp: Date.now() }]);
        } else {
            // For custom, just show a prompt
            setMessages([{
                role: 'ai',
                content: language === 'ko'
                    ? '이 콘텐츠에 대해 무엇이든 물어보세요!'
                    : 'Ask me anything about this content!',
                timestamp: Date.now()
            }]);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const getInitialAIMessage = (intent: IntentType): string => {
        const clipTitle = clip.title.slice(0, 50) + (clip.title.length > 50 ? '...' : '');
        const relatedCount = relatedClips.length;

        if (language === 'ko') {
            switch (intent) {
                case 'summary':
                    return `"${clipTitle}" 콘텐츠를 분석 중입니다.\n\n${relatedCount > 0 ? `최근 ${contextDays}일간 ${relatedCount}개의 관련 클립도 함께 참고할게요.\n\n` : ''}어떤 관점에서 요약해드릴까요?\n- 업무/실무 적용 관점\n- 학습/연구 관점\n- 일반 이해 관점`;
                case 'ideas':
                    return `"${clipTitle}" 콘텐츠를 바탕으로 아이디어를 제안해드릴게요.\n\n${relatedCount > 0 ? `관련 클립 ${relatedCount}개도 함께 분석했어요.\n\n` : ''}어떤 목적의 아이디어가 필요하세요?\n- 콘텐츠 제작\n- 프로젝트/업무 적용\n- 개인 학습/기록`;
                case 'draft':
                    return `"${clipTitle}" 주제로 글을 작성해드릴게요.\n\n어떤 형식의 글이 필요하세요?\n- 블로그 포스트\n- 뉴스레터\n- SNS 포스트\n- 리포트/문서`;
                default:
                    return '무엇을 도와드릴까요?';
            }
        } else {
            switch (intent) {
                case 'summary':
                    return `Analyzing "${clipTitle}"...\n\n${relatedCount > 0 ? `I'll also reference ${relatedCount} related clips from the past ${contextDays} days.\n\n` : ''}What perspective would you like for the summary?\n- Work/practical application\n- Learning/research\n- General understanding`;
                case 'ideas':
                    return `I'll suggest ideas based on "${clipTitle}".\n\n${relatedCount > 0 ? `I've also analyzed ${relatedCount} related clips.\n\n` : ''}What kind of ideas do you need?\n- Content creation\n- Project/work application\n- Personal learning/notes`;
                case 'draft':
                    return `I'll draft content on "${clipTitle}".\n\nWhat format do you need?\n- Blog post\n- Newsletter\n- Social media post\n- Report/document`;
                default:
                    return 'How can I help you?';
            }
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = inputValue.trim();
        setInputValue('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: Date.now() }]);
        setIsLoading(true);

        try {
            const response = await onSendMessage(userMessage, contextDays);
            setMessages(prev => [...prev, { role: 'ai', content: response, timestamp: Date.now() }]);
        } catch {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: language === 'ko' ? '응답을 생성할 수 없습니다. 다시 시도해주세요.' : 'Unable to generate response. Please try again.',
                timestamp: Date.now()
            }]);
        } finally {
            setIsLoading(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal - larger on desktop */}
            <div className={`relative w-full max-w-lg md:max-w-xl max-h-[80vh] rounded-xl overflow-hidden flex flex-col shadow-2xl ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
                {/* Header */}
                <div className={`shrink-0 flex items-center justify-between px-4 py-3 md:px-5 md:py-4 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-2">
                        {/* Back button - show in conversation step */}
                        {step === 'conversation' && (
                            <button
                                onClick={() => { setStep('intent'); setMessages([]); }}
                                className={`p-1.5 rounded-md transition-colors mr-1 ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            </button>
                        )}
                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#21DBA4] flex items-center justify-center">
                            <Sparkles size={14} className="text-white md:hidden" />
                            <Sparkles size={16} className="text-white hidden md:block" />
                        </div>
                        <div>
                            <h2 className={`font-bold text-sm md:text-base ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                                AskAI
                            </h2>
                            <p className={`text-[10px] md:text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                                {clip.title.slice(0, 35)}{clip.title.length > 35 ? '...' : ''}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-1.5 rounded-md transition-colors ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Context Bar */}
                <div className={`shrink-0 px-4 py-2 md:px-5 md:py-2.5 border-b flex items-center gap-3 ${theme === 'dark' ? 'border-slate-800 bg-slate-800/50' : 'border-slate-100 bg-slate-50'}`}>
                    <div className="flex items-center gap-1.5">
                        <Calendar size={12} className={theme === 'dark' ? 'text-slate-500' : 'text-slate-400'} />
                        <span className={`text-[10px] md:text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            {language === 'ko' ? '기간' : 'Period'}:
                        </span>
                        <div className="flex gap-1">
                            {([7, 14, 30] as const).map(days => (
                                <button
                                    key={days}
                                    onClick={() => setContextDays(days)}
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${contextDays === days
                                        ? 'bg-[#21DBA4] text-white'
                                        : theme === 'dark' ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                        }`}
                                >
                                    {days}{language === 'ko' ? '일' : 'd'}
                                </button>
                            ))}
                        </div>
                    </div>
                    {relatedClips.length > 0 && (
                        <span className={`text-[10px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                            {language === 'ko' ? `관련 ${relatedClips.length}개` : `${relatedClips.length} related`}
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {step === 'intent' ? (
                        <div className="p-4">
                            <p className={`text-xs mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                                {language === 'ko'
                                    ? '이 콘텐츠로 무엇을 하고 싶으세요?'
                                    : 'What would you like to do with this content?'}
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {intentOptions.map(option => (
                                    <button
                                        key={option.id}
                                        onClick={() => handleIntentSelect(option.id)}
                                        className={`p-3 rounded-lg border text-left transition-all hover:scale-[1.01] ${theme === 'dark'
                                            ? 'bg-slate-800 border-slate-700 hover:border-[#21DBA4]/50'
                                            : 'bg-white border-slate-200 hover:border-[#21DBA4]/50 hover:shadow-sm'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className={`w-7 h-7 rounded-md flex items-center justify-center ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
                                                <span className="text-[#21DBA4] [&>svg]:w-3.5 [&>svg]:h-3.5">{option.icon}</span>
                                            </div>
                                            <span className={`font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                                                {option.label}
                                            </span>
                                        </div>
                                        <p className={`text-[10px] ml-9 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                                            {option.description}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 space-y-4">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.role === 'ai' && (
                                        <div className="w-8 h-8 rounded-full bg-[#21DBA4] flex items-center justify-center shrink-0">
                                            <Lightbulb size={16} className="text-white" />
                                        </div>
                                    )}
                                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${msg.role === 'user'
                                        ? 'bg-[#21DBA4] text-white'
                                        : theme === 'dark' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'
                                        }`}>
                                        <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#21DBA4] flex items-center justify-center shrink-0 animate-pulse">
                                        <Lightbulb size={16} className="text-white" />
                                    </div>
                                    <div className={`px-4 py-3 rounded-2xl ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                        <span className="text-sm">{language === 'ko' ? '생각 중...' : 'Thinking...'}</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input (only in conversation step) */}
                {step === 'conversation' && (
                    <div className={`shrink-0 p-4 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                        <div className="flex items-center gap-3">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder={language === 'ko' ? '메시지를 입력하세요...' : 'Type your message...'}
                                disabled={isLoading}
                                className={`flex-1 h-12 px-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#21DBA4]/20 transition-all ${theme === 'dark'
                                    ? 'bg-slate-800 text-white placeholder:text-slate-500'
                                    : 'bg-slate-100 text-slate-800 placeholder:text-slate-400'
                                    }`}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isLoading}
                                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${inputValue.trim() && !isLoading
                                    ? 'bg-[#21DBA4] text-white hover:bg-[#1bc290]'
                                    : theme === 'dark' ? 'bg-slate-800 text-slate-600' : 'bg-slate-200 text-slate-400'
                                    }`}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};
