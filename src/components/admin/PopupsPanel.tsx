import * as React from 'react';
import { useState } from 'react';
import { useAdmin, Popup } from '../../hooks/useAdmin';
import {
    Plus,
    Edit2,
    Trash2,
    Megaphone,
    ToggleLeft,
    ToggleRight,
    Calendar
} from 'lucide-react';
import { toast } from 'sonner';

interface PopupsPanelProps {
    theme: 'light' | 'dark';
    language: 'en' | 'ko';
    admin: ReturnType<typeof useAdmin>;
}

interface FormState {
    isOpen: boolean;
    editingId: string | null;
    title: string;
    content: string;
    imageUrl: string;
    linkUrl: string;
    isActive: boolean;
    startDate: string;
    endDate: string;
}

export function PopupsPanel({ theme, language, admin }: PopupsPanelProps) {
    const { popups, createPopup, updatePopup, deletePopup } = admin;

    const [form, setForm] = useState<FormState>({
        isOpen: false,
        editingId: null,
        title: '',
        content: '',
        imageUrl: '',
        linkUrl: '',
        isActive: true,
        startDate: '',
        endDate: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const t = {
        title: language === 'ko' ? '팝업 관리' : 'Popup Management',
        add: language === 'ko' ? '새 팝업 추가' : 'Add Popup',
        edit: language === 'ko' ? '수정' : 'Edit',
        delete: language === 'ko' ? '삭제' : 'Delete',
        save: language === 'ko' ? '저장' : 'Save',
        cancel: language === 'ko' ? '취소' : 'Cancel',
        titleLabel: language === 'ko' ? '제목' : 'Title',
        contentLabel: language === 'ko' ? '내용' : 'Content',
        imageUrlLabel: language === 'ko' ? '이미지 URL' : 'Image URL',
        linkUrlLabel: language === 'ko' ? '링크 URL' : 'Link URL',
        activeLabel: language === 'ko' ? '활성화' : 'Active',
        startDateLabel: language === 'ko' ? '시작일' : 'Start Date',
        endDateLabel: language === 'ko' ? '종료일' : 'End Date',
        empty: language === 'ko' ? '등록된 팝업이 없습니다' : 'No popups yet',
        confirmDelete: language === 'ko' ? '정말 삭제하시겠습니까?' : 'Are you sure you want to delete?',
        success: language === 'ko' ? '저장되었습니다' : 'Saved successfully',
        deleted: language === 'ko' ? '삭제되었습니다' : 'Deleted successfully'
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
            content: '',
            imageUrl: '',
            linkUrl: '',
            isActive: true,
            startDate: '',
            endDate: ''
        });
    };

    const openEdit = (item: Popup) => {
        setForm({
            isOpen: true,
            editingId: item.id || null,
            title: item.title,
            content: item.content,
            imageUrl: item.imageUrl || '',
            linkUrl: item.linkUrl || '',
            isActive: item.isActive,
            startDate: item.startDate || '',
            endDate: item.endDate || ''
        });
    };

    const closeForm = () => {
        setForm(prev => ({ ...prev, isOpen: false }));
    };

    const handleSubmit = async () => {
        if (!form.title.trim() || !form.content.trim()) return;

        setIsSubmitting(true);
        try {
            const data: Omit<Popup, 'id' | 'createdAt'> = {
                title: form.title,
                content: form.content,
                imageUrl: form.imageUrl || undefined,
                linkUrl: form.linkUrl || undefined,
                isActive: form.isActive,
                startDate: form.startDate || undefined,
                endDate: form.endDate || undefined
            };

            if (form.editingId) {
                await updatePopup(form.editingId, data);
            } else {
                await createPopup(data);
            }
            toast.success(t.success);
            closeForm();
        } catch (error) {
            console.error('Failed to save popup:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t.confirmDelete)) return;

        try {
            await deletePopup(id);
            toast.success(t.deleted);
        } catch (error) {
            console.error('Failed to delete popup:', error);
        }
    };

    const handleToggleActive = async (item: Popup) => {
        if (!item.id) return;
        try {
            await updatePopup(item.id, { isActive: !item.isActive });
        } catch (error) {
            console.error('Failed to toggle popup:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className={`text-xl font-bold ${textPrimary}`}>{t.title}</h2>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-[#21DBA4] text-white rounded-lg text-sm font-medium hover:bg-[#1bc290] transition-colors"
                >
                    <Plus size={16} />
                    {t.add}
                </button>
            </div>

            {/* Form Modal */}
            {form.isOpen && (
                <div className={`rounded-xl border p-5 ${cardBg}`}>
                    <div className="space-y-4">
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${textSecondary}`}>{t.titleLabel}</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                                className={`w-full px-3 py-2 rounded-lg border text-sm ${inputBg}`}
                                placeholder={language === 'ko' ? '팝업 제목' : 'Popup title'}
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1.5 ${textSecondary}`}>{t.contentLabel}</label>
                            <textarea
                                value={form.content}
                                onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
                                rows={3}
                                className={`w-full px-3 py-2 rounded-lg border text-sm resize-none ${inputBg}`}
                                placeholder={language === 'ko' ? '팝업 내용' : 'Popup content'}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${textSecondary}`}>{t.imageUrlLabel}</label>
                                <input
                                    type="url"
                                    value={form.imageUrl}
                                    onChange={e => setForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                                    className={`w-full px-3 py-2 rounded-lg border text-sm ${inputBg}`}
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${textSecondary}`}>{t.linkUrlLabel}</label>
                                <input
                                    type="url"
                                    value={form.linkUrl}
                                    onChange={e => setForm(prev => ({ ...prev, linkUrl: e.target.value }))}
                                    className={`w-full px-3 py-2 rounded-lg border text-sm ${inputBg}`}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${textSecondary}`}>{t.startDateLabel}</label>
                                <input
                                    type="date"
                                    value={form.startDate}
                                    onChange={e => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                                    className={`w-full px-3 py-2 rounded-lg border text-sm ${inputBg}`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${textSecondary}`}>{t.endDateLabel}</label>
                                <input
                                    type="date"
                                    value={form.endDate}
                                    onChange={e => setForm(prev => ({ ...prev, endDate: e.target.value }))}
                                    className={`w-full px-3 py-2 rounded-lg border text-sm ${inputBg}`}
                                />
                            </div>
                        </div>
                        <div className="flex items-center">
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
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={closeForm}
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
                            >
                                {t.cancel}
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !form.title.trim() || !form.content.trim()}
                                className="px-4 py-2 bg-[#21DBA4] text-white rounded-lg text-sm font-medium hover:bg-[#1bc290] disabled:opacity-50"
                            >
                                {t.save}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* List */}
            {popups.length === 0 ? (
                <div className={`rounded-xl border p-8 text-center ${cardBg}`}>
                    <Megaphone className={`w-10 h-10 mx-auto mb-3 ${textSecondary}`} />
                    <p className={textSecondary}>{t.empty}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {popups.map(item => (
                        <div key={item.id} className={`rounded-xl border p-4 ${cardBg} ${!item.isActive ? 'opacity-60' : ''}`}>
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 min-w-0">
                                    {item.imageUrl && (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            className="w-16 h-16 rounded-lg object-cover shrink-0"
                                            onError={e => (e.currentTarget.style.display = 'none')}
                                        />
                                    )}
                                    <div className="min-w-0">
                                        <h3 className={`font-medium ${textPrimary}`}>{item.title}</h3>
                                        <p className={`text-sm mt-1 line-clamp-2 ${textSecondary}`}>{item.content}</p>
                                        {(item.startDate || item.endDate) && (
                                            <div className={`flex items-center gap-1.5 mt-2 text-xs ${textSecondary}`}>
                                                <Calendar size={12} />
                                                <span>
                                                    {item.startDate || '...'} ~ {item.endDate || '...'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        onClick={() => handleToggleActive(item)}
                                        className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`}
                                        title={item.isActive ? 'Deactivate' : 'Activate'}
                                    >
                                        {item.isActive
                                            ? <ToggleRight size={20} className="text-[#21DBA4]" />
                                            : <ToggleLeft size={20} className={textSecondary} />
                                        }
                                    </button>
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
