import React from 'react';

/**
 * CategoryChip 스토리
 *
 * 사이드바에서 사용하는 카테고리 칩 컴포넌트입니다.
 */

export default {
    title: 'Custom Component/CategoryChip',
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
## CategoryChip

사이드바에서 카테고리를 표시하는 칩 컴포넌트입니다.

### 특징
- 12가지 색상 팔레트
- 카운트 배지 표시
- 활성/비활성 상태
        `,
            },
        },
    },
};

// 카테고리 색상 팔레트 (from Linkbrain UI)
const categoryColors = [
    { id: 'red', bg: 'bg-red-100', text: 'text-red-600', label: 'Red' },
    { id: 'orange', bg: 'bg-orange-100', text: 'text-orange-600', label: 'Orange' },
    { id: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-600', label: 'Yellow' },
    { id: 'green', bg: 'bg-green-100', text: 'text-green-600', label: 'Green' },
    { id: 'teal', bg: 'bg-teal-100', text: 'text-teal-600', label: 'Teal' },
    { id: 'blue', bg: 'bg-blue-100', text: 'text-blue-600', label: 'Blue' },
    { id: 'indigo', bg: 'bg-indigo-100', text: 'text-indigo-600', label: 'Indigo' },
    { id: 'purple', bg: 'bg-purple-100', text: 'text-purple-600', label: 'Purple' },
    { id: 'pink', bg: 'bg-pink-100', text: 'text-pink-600', label: 'Pink' },
    { id: 'gray', bg: 'bg-gray-100', text: 'text-gray-600', label: 'Gray' },
    { id: 'rose', bg: 'bg-rose-100', text: 'text-rose-600', label: 'Rose' },
    { id: 'slate', bg: 'bg-slate-100', text: 'text-slate-600', label: 'Slate' },
];

const CategoryChip = ({ name, count, colorId, active = false }: {
    name: string;
    count?: number;
    colorId?: string;
    active?: boolean;
}) => {
    const color = categoryColors.find(c => c.id === colorId) || categoryColors[9]; // default gray

    return (
        <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all
        ${active
                    ? 'ring-2 ring-[#21DBA4] ring-offset-1'
                    : 'hover:shadow-sm'
                } ${color.bg} ${color.text}`}
        >
            <span>{name}</span>
            {count !== undefined && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${color.bg} opacity-70`}>
                    {count}
                </span>
            )}
        </div>
    );
};

export const Default = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            <CategoryChip name="Productivity" count={2} colorId="gray" />
            <CategoryChip name="Education" count={1} colorId="blue" />
            <CategoryChip name="Design" count={18} colorId="purple" />
            <CategoryChip name="Marketing" count={6} colorId="yellow" active />
            <CategoryChip name="Dev" count={29} colorId="green" />
        </div>
    ),
};

export const AllColors = {
    render: () => (
        <div className="flex flex-wrap gap-2 max-w-md">
            {categoryColors.map((color) => (
                <CategoryChip key={color.id} name={color.label} count={Math.floor(Math.random() * 20)} colorId={color.id} />
            ))}
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '12가지 카테고리 컬러 팔레트입니다.',
            },
        },
    },
};

export const SidebarLayout = {
    render: () => (
        <div className="w-[280px] p-4 bg-white rounded-xl border border-slate-100">
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">카테고리</span>
                <div className="flex gap-1">
                    <button className="p-1 text-slate-400 hover:text-slate-600">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                    </button>
                    <button className="p-1 text-slate-400 hover:text-slate-600">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
                <CategoryChip name="Productivity" count={2} colorId="gray" />
                <CategoryChip name="Education" count={1} colorId="blue" />
                <CategoryChip name="Entertainment" count={1} colorId="pink" />
                <CategoryChip name="Career" count={1} colorId="indigo" />
                <CategoryChip name="Design" count={18} colorId="purple" />
                <CategoryChip name="Business" count={5} colorId="teal" />
                <CategoryChip name="Marketing" count={6} colorId="yellow" active />
                <CategoryChip name="Lifestyle" count={3} colorId="rose" />
                <CategoryChip name="Other" count={16} colorId="slate" />
                <CategoryChip name="Shorts" count={3} colorId="red" />
                <CategoryChip name="AI" count={34} colorId="green" />
                <CategoryChip name="Dev" count={29} colorId="green" />
                <CategoryChip name="Health" count={5} colorId="teal" />
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '사이드바에서 카테고리 칩들이 배치되는 형태입니다.',
            },
        },
    },
};
