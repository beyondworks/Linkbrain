import * as React from 'react';
import { useState } from 'react';
import { useAdmin, Inquiry } from '../../hooks/useAdmin';
import {
    MessageSquare,
    Send,
    CheckCircle,
    Clock,
    XCircle,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';

interface InquiriesPanelProps {
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    admin: ReturnType<typeof useAdmin>;
}

export function InquiriesPanel({ theme, language, admin }: InquiriesPanelProps) {
    const { inquiries, replyToInquiry, closeInquiry } = admin;
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const t = {
        title: language === 'ko' ? '고객문의 관리' : 'Customer Inquiries',
        pending: language === 'ko' ? '대기중' : 'Pending',
        replied: language === 'ko' ? '답변완료' : 'Replied',
        closed: language === 'ko' ? '종료' : 'Closed',
        reply: language === 'ko' ? '답변하기' : 'Reply',
        sendReply: language === 'ko' ? '답변 전송' : 'Send Reply',
        close: language === 'ko' ? '종료' : 'Close',
        replyPlaceholder: language === 'ko' ? '답변 내용을 입력하세요...' : 'Type your reply...',
        empty: language === 'ko' ? '접수된 문의가 없습니다' : 'No inquiries yet',
        success: language === 'ko' ? '답변이 전송되었습니다' : 'Reply sent successfully',
        closedSuccess: language === 'ko' ? '문의가 종료되었습니다' : 'Inquiry closed'
    };

    const cardBg = theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
    const inputBg = theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900';
    const textPrimary = theme === 'dark' ? 'text-white' : 'text-slate-900';
    const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

    const statusConfig = {
        pending: { icon: <Clock size={14} />, color: 'text-yellow-500', bg: 'bg-yellow-500/10', label: t.pending },
        replied: { icon: <CheckCircle size={14} />, color: 'text-[#21DBA4]', bg: 'bg-[#21DBA4]/10', label: t.replied },
        closed: { icon: <XCircle size={14} />, color: 'text-slate-400', bg: 'bg-slate-500/10', label: t.closed }
    };

    const handleReply = async (id: string) => {
        if (!replyText.trim()) return;

        setIsSubmitting(true);
        try {
            await replyToInquiry(id, replyText);
            setReplyText('');
            setExpandedId(null);
            toast.success(t.success);
        } catch (error) {
            console.error('Failed to send reply:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = async (id: string) => {
        try {
            await closeInquiry(id);
            toast.success(t.closedSuccess);
        } catch (error) {
            console.error('Failed to close inquiry:', error);
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
        setReplyText('');
    };

    // Group by status
    const pendingCount = inquiries.filter(i => i.status === 'pending').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className={`text-xl font-bold ${textPrimary}`}>{t.title}</h2>
                    {pendingCount > 0 && (
                        <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 text-xs font-bold rounded-full">
                            {pendingCount} {t.pending}
                        </span>
                    )}
                </div>
            </div>

            {/* List */}
            {inquiries.length === 0 ? (
                <div className={`rounded-xl border p-8 text-center ${cardBg}`}>
                    <MessageSquare className={`w-10 h-10 mx-auto mb-3 ${textSecondary}`} />
                    <p className={textSecondary}>{t.empty}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {inquiries.map(item => {
                        const status = statusConfig[item.status];
                        const isExpanded = expandedId === item.id;

                        return (
                            <div key={item.id} className={`rounded-xl border overflow-hidden ${cardBg}`}>
                                {/* Header */}
                                <div
                                    className={`flex items-center justify-between p-4 cursor-pointer ${theme === 'dark' ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}`}
                                    onClick={() => toggleExpand(item.id || '')}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${status.color} ${status.bg}`}>
                                            {status.icon}
                                            {status.label}
                                        </span>
                                        <div className="min-w-0">
                                            <h3 className={`font-medium truncate ${textPrimary}`}>{item.subject}</h3>
                                            <p className={`text-xs ${textSecondary}`}>{item.userEmail}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className={`text-xs ${textSecondary}`}>
                                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                                        </span>
                                        {isExpanded ? <ChevronUp size={16} className={textSecondary} /> : <ChevronDown size={16} className={textSecondary} />}
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className={`px-4 pb-4 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
                                        {/* Original Message */}
                                        <div className={`mt-4 p-3 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                            <p className={`text-sm whitespace-pre-wrap ${textPrimary}`}>{item.message}</p>
                                        </div>

                                        {/* Reply (if exists) */}
                                        {item.reply && (
                                            <div className="mt-3 p-3 rounded-lg bg-[#21DBA4]/10 border border-[#21DBA4]/20">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <CheckCircle size={14} className="text-[#21DBA4]" />
                                                    <span className="text-xs font-medium text-[#21DBA4]">
                                                        {language === 'ko' ? '관리자 답변' : 'Admin Reply'}
                                                    </span>
                                                </div>
                                                <p className={`text-sm whitespace-pre-wrap ${textPrimary}`}>{item.reply}</p>
                                            </div>
                                        )}

                                        {/* Reply Form */}
                                        {item.status === 'pending' && (
                                            <div className="mt-4 space-y-3">
                                                <textarea
                                                    value={replyText}
                                                    onChange={e => setReplyText(e.target.value)}
                                                    placeholder={t.replyPlaceholder}
                                                    rows={3}
                                                    className={`w-full px-3 py-2 rounded-lg border text-sm resize-none ${inputBg}`}
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleReply(item.id || '')}
                                                        disabled={isSubmitting || !replyText.trim()}
                                                        className="flex items-center gap-2 px-4 py-2 bg-[#21DBA4] text-white rounded-lg text-sm font-medium hover:bg-[#1bc290] disabled:opacity-50"
                                                    >
                                                        <Send size={14} />
                                                        {t.sendReply}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Close Button */}
                                        {item.status === 'replied' && (
                                            <div className="mt-4 flex justify-end">
                                                <button
                                                    onClick={() => handleClose(item.id || '')}
                                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
                                                >
                                                    {t.close}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
