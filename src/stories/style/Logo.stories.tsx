import React from 'react';

/**
 * Logo 스토리
 *
 * Linkbrain 로고 및 심볼 사용 가이드라인입니다.
 */

// Check Icon
const CheckIcon = ({ color = '#21DBA4' }: { color?: string }) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export default {
    title: 'Style/Logo',
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: `
## Linkbrain Logo

Linkbrain의 공식 로고 및 심볼입니다.

### 브랜드 컬러
- **Primary**: \`#21DBA4\`
- **Symbol**: White on brand background
        `,
            },
        },
    },
};

// Full Logo SVG
const FullLogo = ({ size = 128 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="512" height="512" rx="100" fill="url(#paint0_linear_full)" />
        <path d="M225.292 272C239.03 272 250.834 281.887 256 294.516C261.166 281.887 272.97 272 286.708 272H312.507C330.716 272 348.531 289.462 348.989 307.474C348.997 307.759 349 308.047 349 308.334V343.576C349 361.985 331.004 379.909 312.507 379.909H286.708C272.97 379.909 261.166 370.022 256 357.393C250.834 370.022 239.03 379.909 225.292 379.909H199.493C180.996 379.909 163 361.985 163 343.576V308.334C163 308.047 163.003 307.759 163.011 307.474C163.469 289.462 181.284 272 199.493 272H225.292ZM199.493 308.334V343.576H312.507V308.334H199.493ZM271.355 133C272.46 133 273.355 133.896 273.355 135V191.971L315.817 149.509C316.598 148.728 317.865 148.728 318.646 149.509L341.53 172.394C342.311 173.175 342.311 174.441 341.53 175.222L301.108 215.645H354C355.104 215.645 356 216.54 356 217.645V250.009C356 251.113 355.104 252.009 354 252.009H158C156.896 252.009 156 251.113 156 250.009V217.645C156 216.54 156.896 215.645 158 215.645H208.399L167.95 175.195C167.169 174.414 167.169 173.148 167.95 172.367L190.796 149.521C191.577 148.74 192.843 148.74 193.624 149.521L236.991 192.889V135C236.991 133.896 237.887 133 238.991 133H271.355Z" fill="white" />
        <defs>
            <linearGradient id="paint0_linear_full" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
                <stop stopColor="#21DBA4" />
                <stop offset="1" stopColor="#21DBA4" />
            </linearGradient>
        </defs>
    </svg>
);

// Symbol Only (white, for use on colored backgrounds)
const SymbolWhite = ({ size = 64 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="156 133 200 247" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M225.292 272C239.03 272 250.834 281.887 256 294.516C261.166 281.887 272.97 272 286.708 272H312.507C330.716 272 348.531 289.462 348.989 307.474C348.997 307.759 349 308.047 349 308.334V343.576C349 361.985 331.004 379.909 312.507 379.909H286.708C272.97 379.909 261.166 370.022 256 357.393C250.834 370.022 239.03 379.909 225.292 379.909H199.493C180.996 379.909 163 361.985 163 343.576V308.334C163 308.047 163.003 307.759 163.011 307.474C163.469 289.462 181.284 272 199.493 272H225.292ZM199.493 308.334V343.576H312.507V308.334H199.493ZM271.355 133C272.46 133 273.355 133.896 273.355 135V191.971L315.817 149.509C316.598 148.728 317.865 148.728 318.646 149.509L341.53 172.394C342.311 173.175 342.311 174.441 341.53 175.222L301.108 215.645H354C355.104 215.645 356 216.54 356 217.645V250.009C356 251.113 355.104 252.009 354 252.009H158C156.896 252.009 156 251.113 156 250.009V217.645C156 216.54 156.896 215.645 158 215.645H208.399L167.95 175.195C167.169 174.414 167.169 173.148 167.95 172.367L190.796 149.521C191.577 148.74 192.843 148.74 193.624 149.521L236.991 192.889V135C236.991 133.896 237.887 133 238.991 133H271.355Z" fill="white" />
    </svg>
);

// Symbol Only (brand color, for use on light backgrounds)
const SymbolBrand = ({ size = 64 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="156 133 200 247" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M225.292 272C239.03 272 250.834 281.887 256 294.516C261.166 281.887 272.97 272 286.708 272H312.507C330.716 272 348.531 289.462 348.989 307.474C348.997 307.759 349 308.047 349 308.334V343.576C349 361.985 331.004 379.909 312.507 379.909H286.708C272.97 379.909 261.166 370.022 256 357.393C250.834 370.022 239.03 379.909 225.292 379.909H199.493C180.996 379.909 163 361.985 163 343.576V308.334C163 308.047 163.003 307.759 163.011 307.474C163.469 289.462 181.284 272 199.493 272H225.292ZM199.493 308.334V343.576H312.507V308.334H199.493ZM271.355 133C272.46 133 273.355 133.896 273.355 135V191.971L315.817 149.509C316.598 148.728 317.865 148.728 318.646 149.509L341.53 172.394C342.311 173.175 342.311 174.441 341.53 175.222L301.108 215.645H354C355.104 215.645 356 216.54 356 217.645V250.009C356 251.113 355.104 252.009 354 252.009H158C156.896 252.009 156 251.113 156 250.009V217.645C156 216.54 156.896 215.645 158 215.645H208.399L167.95 175.195C167.169 174.414 167.169 173.148 167.95 172.367L190.796 149.521C191.577 148.74 192.843 148.74 193.624 149.521L236.991 192.889V135C236.991 133.896 237.887 133 238.991 133H271.355Z" fill="#21DBA4" />
    </svg>
);

export const PrimaryLogo = {
    render: () => (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Primary Logo</h3>
                <p className="text-sm text-slate-500 mb-6">기본 로고입니다. 대부분의 상황에서 이 버전을 사용하세요.</p>
                <div className="flex items-center gap-8">
                    <FullLogo size={128} />
                    <FullLogo size={64} />
                    <FullLogo size={32} />
                </div>
            </div>
        </div>
    ),
};

export const SymbolOnly = {
    render: () => (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Symbol (아이콘 전용)</h3>
                <p className="text-sm text-slate-500 mb-6">공간이 제한된 곳에서 심볼만 사용할 수 있습니다.</p>

                <div className="grid grid-cols-2 gap-6">
                    {/* On Brand Background */}
                    <div className="p-6 rounded-xl bg-[#21DBA4]">
                        <p className="text-xs text-white/80 mb-3">브랜드 배경 위</p>
                        <div className="flex items-center gap-4">
                            <SymbolWhite size={48} />
                            <SymbolWhite size={32} />
                            <SymbolWhite size={24} />
                        </div>
                    </div>

                    {/* On Light Background */}
                    <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                        <p className="text-xs text-slate-500 mb-3">밝은 배경 위</p>
                        <div className="flex items-center gap-4">
                            <SymbolBrand size={48} />
                            <SymbolBrand size={32} />
                            <SymbolBrand size={24} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '심볼은 favicon, 앱 아이콘, 작은 공간에서 사용합니다.',
            },
        },
    },
};

export const SizeGuidelines = {
    render: () => (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Size Guidelines</h3>
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-slate-50">
                        <th className="py-2 px-4 text-xs font-bold text-slate-500">용도</th>
                        <th className="py-2 px-4 text-xs font-bold text-slate-500">크기</th>
                        <th className="py-2 px-4 text-xs font-bold text-slate-500">미리보기</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b border-slate-100">
                        <td className="py-3 px-4 text-sm">Favicon</td>
                        <td className="py-3 px-4 text-sm text-slate-500">16x16, 32x32</td>
                        <td className="py-3 px-4"><FullLogo size={16} /></td>
                    </tr>
                    <tr className="border-b border-slate-100">
                        <td className="py-3 px-4 text-sm">앱 아이콘</td>
                        <td className="py-3 px-4 text-sm text-slate-500">48x48, 64x64</td>
                        <td className="py-3 px-4"><FullLogo size={48} /></td>
                    </tr>
                    <tr className="border-b border-slate-100">
                        <td className="py-3 px-4 text-sm">네비게이션 바</td>
                        <td className="py-3 px-4 text-sm text-slate-500">32x32</td>
                        <td className="py-3 px-4"><FullLogo size={32} /></td>
                    </tr>
                    <tr className="border-b border-slate-100">
                        <td className="py-3 px-4 text-sm">마케팅 자료</td>
                        <td className="py-3 px-4 text-sm text-slate-500">128x128+</td>
                        <td className="py-3 px-4"><FullLogo size={64} /></td>
                    </tr>
                </tbody>
            </table>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '용도별 권장 로고 크기입니다.',
            },
        },
    },
};

export const ClearSpace = {
    render: () => (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Clear Space (여백 규칙)</h3>
            <p className="text-sm text-slate-500 mb-6">로고 주변에는 최소 로고 높이의 25% 만큼 여백을 확보해야 합니다.</p>

            <div className="inline-block p-8 bg-slate-100 rounded-xl relative">
                <div className="border-2 border-dashed border-[#21DBA4]/50 p-6">
                    <FullLogo size={96} />
                </div>
                <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-[#21DBA4] font-bold">24px min</span>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-[#21DBA4] font-bold">24px min</span>
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-[#21DBA4] font-bold rotate-90">24px</span>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[#21DBA4] font-bold -rotate-90">24px</span>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '로고 주변 최소 여백 규칙입니다.',
            },
        },
    },
};

export const DoAndDont = {
    render: () => (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">사용 규칙</h3>

            <div className="grid grid-cols-2 gap-6">
                {/* Do */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#21DBA4] font-bold text-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        DO
                    </div>
                    <div className="p-4 bg-white border border-green-200 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <FullLogo size={32} />
                            <span className="font-bold text-slate-800">Linkbrain</span>
                        </div>
                        <p className="text-xs text-slate-400">브랜드 배경에 흰색 심볼 사용</p>
                    </div>
                    <div className="p-4 bg-[#21DBA4] rounded-xl">
                        <div className="flex items-center gap-3">
                            <SymbolWhite size={32} />
                            <span className="font-bold text-white">일관된 비율 유지</span>
                        </div>
                    </div>
                </div>

                {/* Don't */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        DON'T
                    </div>
                    <div className="p-4 bg-white border border-red-200 rounded-xl">
                        <div className="flex items-center gap-3 mb-4" style={{ filter: 'grayscale(100%)' }}>
                            <FullLogo size={32} />
                            <span className="font-bold text-slate-800">색상 변형 금지</span>
                        </div>
                        <p className="text-xs text-slate-400">그레이스케일/임의 색상 변경 금지</p>
                    </div>
                    <div className="p-4 bg-white border border-red-200 rounded-xl">
                        <div className="flex items-center gap-3" style={{ transform: 'scaleX(1.5)' }}>
                            <FullLogo size={24} />
                            <span className="font-bold text-slate-800 text-xs">왜곡</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">비율 왜곡 금지</p>
                    </div>
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '로고 사용 시 올바른 방법과 피해야 할 방법입니다.',
            },
        },
    },
};

export const BackgroundUsage = {
    render: () => (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">배경별 사용법</h3>

            <div className="grid grid-cols-3 gap-4">
                <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                    <p className="text-[10px] text-slate-400 mb-3">밝은 배경</p>
                    <FullLogo size={48} />
                    <p className="text-xs text-[#21DBA4] mt-2 font-medium flex items-center justify-center"><CheckIcon /> Primary</p>
                </div>
                <div className="p-6 bg-[#21DBA4] rounded-xl text-center">
                    <p className="text-[10px] text-white/70 mb-3">브랜드 배경</p>
                    <SymbolWhite size={48} />
                    <p className="text-xs text-white mt-2 font-medium flex items-center justify-center"><CheckIcon color="white" /> White Symbol</p>
                </div>
                <div className="p-6 bg-slate-900 rounded-xl text-center">
                    <p className="text-[10px] text-slate-400 mb-3">어두운 배경</p>
                    <FullLogo size={48} />
                    <p className="text-xs text-[#21DBA4] mt-2 font-medium flex items-center justify-center"><CheckIcon /> Primary</p>
                </div>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: '배경색에 따른 로고 버전 선택입니다.',
            },
        },
    },
};
