import React from 'react';

/**
 * LinkRow 스토리
 *
 * 리스트 뷰에서 링크를 표시하는 행 컴포넌트입니다.
 */

export default {
    title: 'Custom Component/LinkRow',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
## LinkRow

리스트 뷰에서 링크를 표시하는 행형 컴포넌트입니다.

### 구성 요소
- 썸네일 (선택적)
- 제목 & 요약
- 소스 배지 & 카테고리
- 날짜
- 즐겨찾기 버튼
        `,
            },
        },
    },
};

// 실제 이미지 URL (Unsplash - 64x64 썸네일)
const sampleItems = [
    {
        title: '정지된 이미지를 3D 공간으로 변환하는 웹 앱',
        summary: '애플의 "SHARP" 모델을 활용해 정지된 이미지를 인터랙티브한 3D 장면으로 바꿔주는 오픈소스 웹 앱이 공개되었으며, 다양한 분야에서 활용 가능성이 있습니다.',
        source: { name: 'Threads', color: 'bg-black' },
        category: 'Other',
        date: '2025.12.27',
        isFavorite: true,
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=64&h=64&fit=crop',
    },
    {
        title: '코덱스가 클로드 스킬을 흡수했습니다! (보너스: 나노바나나 프로 & GPT 이미지 생성 스킬)',
        summary: '이 비디오에서는 클로드 코드의 핵심 기능인 스킬을 코덱스로 완벽하게 포팅하는 혁신적인 방법을 소개하며, 이를 통해 전문적인 웹사이트를 무료로 구축하는 방법을 배울 수 있습니다.',
        source: { name: 'YouTube', color: 'bg-red-500' },
        category: 'Dev',
        date: '2025.12.27',
        isFavorite: false,
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=64&h=64&fit=crop',
    },
    {
        title: "99%가 그냥 지나치는 '숨겨진 무료도구' 4가지",
        summary: '강사와 직장인을 위한 4가지 유용한 무료 도구를 소개하며, 이 도구들을 통해 업무 효율성을 높일 수 있다고 강조한다.',
        source: { name: 'Threads', color: 'bg-black' },
        category: 'Productivity',
        date: '2025.12.27',
        isFavorite: false,
        image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=64&h=64&fit=crop',
    },
];

export const Default = {
    render: () => (
        <div className="space-y-2 max-w-3xl">
            {sampleItems.map((item, index) => (
                <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 bg-white hover:shadow-md transition-all cursor-pointer group"
                >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                        <img src={item.image} className="w-full h-full object-cover" alt="" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm truncate text-slate-800 group-hover:text-[#21DBA4] transition-colors">
                            {item.title}
                        </h3>
                        <p className="text-xs text-slate-400 truncate mt-1">{item.summary}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white ${item.source.color}`}>
                                {item.source.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded text-slate-500 bg-slate-100">
                                {item.category}
                            </span>
                            <span className="text-[10px] text-slate-300">{item.date}</span>
                        </div>
                    </div>

                    {/* Favorite */}
                    <button className={`p-2 ${item.isFavorite ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-400'}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill={item.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    ),
};

export const WithoutThumbnails = {
    render: () => (
        <div className="space-y-2 max-w-3xl">
            {sampleItems.map((item, index) => (
                <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 bg-white hover:shadow-md transition-all cursor-pointer group"
                >
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm truncate text-slate-800 group-hover:text-[#21DBA4] transition-colors">
                            {item.title}
                        </h3>
                        <p className="text-xs text-slate-400 truncate mt-1">{item.summary}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white ${item.source.color}`}>
                                {item.source.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded text-slate-500 bg-slate-100">
                                {item.category}
                            </span>
                            <span className="text-[10px] text-slate-300">{item.date}</span>
                        </div>
                    </div>
                    <button className={`p-2 ${item.isFavorite ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-400'}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill={item.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '썸네일 없이 표시하는 리스트 뷰입니다.',
            },
        },
    },
};

export const Selected = {
    render: () => (
        <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-4 p-3 rounded-xl border-[#21DBA4] border-2 ring-2 ring-[#21DBA4]/20 bg-white cursor-pointer group">
                <div className="shrink-0">
                    <div className="w-5 h-5 rounded-md flex items-center justify-center bg-[#21DBA4] text-white">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 11 12 14 22 4" />
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                    </div>
                </div>
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                    <img src={sampleItems[0].image} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate text-[#21DBA4]">{sampleItems[0].title}</h3>
                    <p className="text-xs text-slate-400 truncate mt-1">{sampleItems[0].summary}</p>
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '선택 모드에서 선택된 상태의 행입니다.',
            },
        },
    },
};
