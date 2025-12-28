import React from 'react';

// SVG Icons
const SparklesIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#21DBA4" strokeWidth="2">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
);

/**
 * LinkCard 스토리
 *
 * Linkbrain의 핵심 컴포넌트인 링크 카드입니다.
 * 그리드 뷰에서 링크를 표시합니다.
 */

export default {
    title: 'Custom Component/LinkCard',
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
## LinkCard

Linkbrain의 핵심 컴포넌트 - 저장된 링크를 그리드 형태로 표시합니다.

### 구성 요소
- 썸네일 이미지
- 소스 배지 (YouTube, Threads 등)
- 카테고리 태그
- AI Summary
- 해시 태그
- 즐겨찾기 버튼
        `,
            },
        },
    },
};

// 실제 이미지 URL (Unsplash)
const REAL_IMAGES = {
    threads3D: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop',  // 3D/Tech
    youtubeCode: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop', // Code
    productivity: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=200&fit=crop', // Productivity
    aiTech: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop', // AI
    design: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=200&fit=crop', // Design
    business: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop', // Business
};

// 샘플 데이터
const sampleData = {
    title: '정지된 이미지를 3D 공간으로 변환하는 웹 앱',
    summary: '애플의 "SHARP" 모델을 활용해 정지된 이미지를 인터랙티브한 3D 장면으로 바꿔주는 오픈소스 웹 앱이 공개되었으며, 다양한 분야에서 활용 가능성이 있습니다.',
    url: 'https://www.threads.net',
    image: REAL_IMAGES.threads3D,
    date: '2025.12.27',
    tags: ['3D 공간', '웹 앱', 'SHARP 모델'],
    categoryId: 'Other',
    isFavorite: false,
    chatHistory: [],
};

const SourceBadge = ({ name, color }: { name: string; color: string }) => (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-white text-[10px] font-bold ${color}`}>
        {name}
    </div>
);

const CategoryBadge = ({ name }: { name: string }) => (
    <div className="flex items-center gap-1 px-2 py-1 rounded-full text-white text-[10px] font-bold bg-black/40 backdrop-blur-md border border-white/10">
        # {name}
    </div>
);

export const Default = {
    render: () => (
        <div className="w-[320px]">
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-xl transition-all cursor-pointer group overflow-hidden">
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                        src={sampleData.image}
                        alt={sampleData.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Source & Category Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <SourceBadge name="Threads" color="bg-black" />
                        <CategoryBadge name={sampleData.categoryId} />
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* URL & Date */}
                    <div className="flex items-center gap-2 mb-3">
                        <div className="bg-slate-100 p-1 rounded-md">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                                <path d="M2 12h20" />
                            </svg>
                        </div>
                        <span className="text-[10px] font-medium text-slate-400 truncate max-w-[100px]">
                            {sampleData.url}
                        </span>
                        <span className="text-[10px] text-slate-300 ml-auto">{sampleData.date}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-[15px] leading-snug mb-3 text-slate-800 group-hover:text-[#21DBA4] transition-colors line-clamp-2">
                        {sampleData.title}
                    </h3>

                    {/* AI Summary */}
                    <div className="rounded-xl p-3 mb-4 border bg-[#F8FAFC] border-slate-100 group-hover:border-[#21DBA4]/20">
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#21DBA4" strokeWidth="2">
                                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                            </svg>
                            <span className="text-[10px] font-bold text-slate-600">AI Summary</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-500 line-clamp-3">
                            {sampleData.summary}
                        </p>
                    </div>

                    {/* Tags & Favorite */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                        <div className="flex gap-1.5 items-center overflow-hidden">
                            {sampleData.tags.map((tag) => (
                                <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded text-slate-400 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        <button className="text-slate-300 hover:text-yellow-400 transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ),
};

export const WithFavorite = {
    render: () => (
        <div className="w-[320px]">
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm group overflow-hidden">
                <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                        src={REAL_IMAGES.youtubeCode}
                        alt="YouTube Video"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <SourceBadge name="YouTube" color="bg-red-500" />
                        <CategoryBadge name="Dev" />
                    </div>
                    {/* Favorite Badge */}
                    <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center shadow-sm">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2">
                                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="p-5">
                    <h3 className="font-bold text-[15px] leading-snug mb-3 text-slate-800">
                        코덱스가 클로드 스킬을 흡수했습니다!
                    </h3>
                    <div className="rounded-xl p-3 bg-[#F8FAFC] border border-slate-100">
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="text-[10px] font-bold text-[#21DBA4] flex items-center gap-1"><SparklesIcon /> AI Summary</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                            이 비디오에서는 클로드 코드의 핵심 기능인 '스킬'을 코덱스로 완벽하게 포팅하는 혁신적인 방법을 소개합니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '즐겨찾기가 표시된 카드입니다. 우측 상단에 별 아이콘이 표시됩니다.',
            },
        },
    },
};

export const SourceBadges = {
    render: () => (
        <div className="flex flex-wrap gap-4">
            <SourceBadge name="YouTube" color="bg-red-500" />
            <SourceBadge name="Threads" color="bg-black" />
            <SourceBadge name="X" color="bg-black" />
            <SourceBadge name="GitHub" color="bg-gray-800" />
            <SourceBadge name="Medium" color="bg-green-600" />
            <SourceBadge name="Notion" color="bg-black" />
            <SourceBadge name="Other" color="bg-slate-500" />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '다양한 소스 플랫폼 배지입니다.',
            },
        },
    },
};
