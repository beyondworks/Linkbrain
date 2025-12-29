import * as React from 'react';
import { useState } from 'react';
import { useAdmin, Announcement } from '../../hooks/useAdmin';
import {
    Plus,
    Edit2,
    Trash2,
    Check,
    X,
    Bell,
    Megaphone,
    Lightbulb
} from 'lucide-react';
import { cn } from '../ui/utils';
import { SectionHeader } from '../shared/SectionHeader';
import { toast } from 'sonner';

interface AnnouncementsPanelProps {
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    admin: ReturnType<typeof useAdmin>;
}

interface FormState {
    isOpen: boolean;
    editingId: string | null;
    title: string;
    message: string;
    type: 'update' | 'notice' | 'tip';
    isActive: boolean;
}

export function AnnouncementsPanel({ theme, language, admin }: AnnouncementsPanelProps) {
    const { announcements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = admin;

    const [form, setForm] = useState<FormState>({
        isOpen: false,
        editingId: null,
        title: '',
        message: '',
        type: 'notice',
        isActive: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const t = {
        title: language === 'ko' ? '공지사항 관리' : 'Announcements',
        add: language === 'ko' ? '새 공지 추가' : 'Add Announcement',
        edit: language === 'ko' ? '수정' : 'Edit',
        delete: language === 'ko' ? '삭제' : 'Delete',
        save: language === 'ko' ? '저장' : 'Save',
        cancel: language === 'ko' ? '취소' : 'Cancel',
        titleLabel: language === 'ko' ? '제목' : 'Title',
        messageLabel: language === 'ko' ? '내용' : 'Message',
        typeLabel: language === 'ko' ? '유형' : 'Type',
        activeLabel: language === 'ko' ? '활성화' : 'Active',
        update: language === 'ko' ? '업데이트' : 'Update',
        notice: language === 'ko' ? '공지' : 'Notice',
        tip: language === 'ko' ? '팁' : 'Tip',
        empty: language === 'ko' ? '등록된 공지사항이 없습니다' : 'No announcements yet',
        confirmDelete: language === 'ko' ? '정말 삭제하시겠습니까?' : 'Are you sure you want to delete?',
        success: language === 'ko' ? '저장되었습니다' : 'Saved successfully',
        deleted: language === 'ko' ? '삭제되었습니다' : 'Deleted successfully'
    };

    const typeIcons = {
        update: <Bell size={16} className="text-blue-500" />,
        notice: <Megaphone size={16} className="text-yellow-500" />,
        tip: <Lightbulb size={16} className="text-green-500" />
    };

    const cardBg = theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
    const inputBg = theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900';
    const textPrimary = theme === 'dark' ? 'text-white' : 'text-slate-900';
    const textSecondary = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

    const openCreate = () => {
        setForm({
            isOpen: true,
            editingId: null,
            title: '',
            message: '',
            type: 'notice',
            isActive: true
        });
    };

    const openEdit = (item: Announcement) => {
        setForm({
            isOpen: true,
            editingId: item.id || null,
            title: item.title,
            message: item.message,
            type: item.type,
            isActive: item.isActive
        });
    };

    const closeForm = () => {
        setForm(prev => ({ ...prev, isOpen: false }));
    };

    const handleSubmit = async () => {
        if (!form.title.trim() || !form.message.trim()) return;

        setIsSubmitting(true);
        try {
            if (form.editingId) {
                await updateAnnouncement(form.editingId, {
                    title: form.title,
                    message: form.message,
                    type: form.type,
                    isActive: form.isActive
                });
            } else {
                await createAnnouncement({
                    title: form.title,
                    message: form.message,
                    type: form.type,
                    isActive: form.isActive
                });
            }
            toast.success(t.success);
            closeForm();
        } catch (error) {
            console.error('Failed to save announcement:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t.confirmDelete)) return;

        try {
            await deleteAnnouncement(id);
            toast.success(t.deleted);
        } catch (error) {
            console.error('Failed to delete announcement:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header - Using SectionHeader Component */}
            <SectionHeader
                title={t.title}
                isDark={theme === 'dark'}
                action={
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 px-4 py-2 bg-[#21DBA4] text-white rounded-xl text-sm font-medium hover:bg-[#1bc290] transition-colors"
                    >
                        <Plus size={16} />
                        {t.add}
                    </button>
                }
            />

            {/* Form Modal */}
            {form.isOpen && (
                <div className={cn("rounded-3xl border p-5", cardBg)}>
                    <div className="space-y-4">
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${textSecondary}`}>{t.titleLabel}</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                                className={`w-full px-3 py-2 rounded-lg border text-sm ${inputBg}`}
                                placeholder={language === 'ko' ? '공지 제목을 입력하세요' : 'Enter title'}
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${textSecondary}`}>{t.messageLabel}</label>
                            <textarea
                                value={form.message}
                                onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                                rows={3}
                                className={`w-full px-3 py-2 rounded-lg border text-sm resize-none ${inputBg}`}
                                placeholder={language === 'ko' ? '내용을 입력하세요' : 'Enter message'}
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className={`block text-sm font-medium mb-1.5 ${textSecondary}`}>{t.typeLabel}</label>
                                <select
                                    value={form.type}
                                    onChange={e => setForm(prev => ({ ...prev, type: e.target.value as any }))}
                                    className={`w-full px-3 py-2 rounded-lg border text-sm ${inputBg}`}
                                >
                                    <option value="update">{t.update}</option>
                                    <option value="notice">{t.notice}</option>
                                    <option value="tip">{t.tip}</option>
                                </select>
                            </div>
                            <div className="flex items-end pb-0.5">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.isActive}
                                        onChange={e => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
                                        className="w-4 h-4 rounded border-slate-300 text-[#21DBA4] focus:ring-[#21DBA4]"
                                    />
                                    <span className={`text-sm ${textSecondary}`}>{t.activeLabel}</span>
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={closeForm}
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
                            >
                                {t.cancel}
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !form.title.trim() || !form.message.trim()}
                                className="px-4 py-2 bg-[#21DBA4] text-white rounded-lg text-sm font-medium hover:bg-[#1bc290] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {t.save}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* List */}
            {announcements.length === 0 ? (
                <div className={cn("rounded-3xl border p-8 text-center", cardBg)}>
                    <p className={textSecondary}>{t.empty}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {announcements.map(item => (
                        <div key={item.id} className={`rounded-xl border p-4 ${cardBg} ${!item.isActive ? 'opacity-50' : ''}`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 min-w-0">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'
                                        }`}>
                                        {typeIcons[item.type]}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className={`font-medium ${textPrimary}`}>{item.title}</h3>
                                        <p className={`text-sm mt-1 line-clamp-2 ${textSecondary}`}>{item.message}</p>
                                        <p className={`text-xs mt-2 ${textSecondary}`}>
                                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        onClick={() => openEdit(item)}
                                        className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                                    >
                                        <Edit2 size={16} className={textSecondary} />
                                    </button>
                                    <button
                                        onClick={() => item.id && handleDelete(item.id)}
                                        className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                                    >
                                        <Trash2 size={16} className="text-red-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
