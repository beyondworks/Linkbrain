import React from 'react';

/**
 * SettingsModal 스토리
 *
 * 설정 모달 컴포넌트입니다.
 */

export default {
    title: 'Custom Component/SettingsModal',
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
## SettingsModal

앱 설정을 관리하는 모달입니다.

### 섹션
- 테마 (라이트/다크)
- 언어 (한국어/English)
- 알림 설정
- 계정 관리
        `,
            },
        },
    },
};

export const Default = {
    render: () => (
        <div className="w-[480px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">설정</h2>
                <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-6">
                {/* Theme Section */}
                <div>
                    <h3 className="text-sm font-bold text-slate-700 mb-3">테마</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="p-4 border-2 border-[#21DBA4] rounded-xl bg-[#21DBA4]/5">
                            <div className="w-12 h-8 bg-white border border-slate-200 rounded-lg mb-2 mx-auto" />
                            <span className="text-sm font-medium text-[#21DBA4]">라이트</span>
                        </button>
                        <button className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                            <div className="w-12 h-8 bg-slate-900 rounded-lg mb-2 mx-auto" />
                            <span className="text-sm font-medium text-slate-600">다크</span>
                        </button>
                    </div>
                </div>

                {/* Language Section */}
                <div>
                    <h3 className="text-sm font-bold text-slate-700 mb-3">언어</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="p-3 border-2 border-[#21DBA4] rounded-xl bg-[#21DBA4]/5 flex items-center gap-2 justify-center">
                            <span className="text-lg">🇰🇷</span>
                            <span className="text-sm font-medium text-[#21DBA4]">한국어</span>
                        </button>
                        <button className="p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 justify-center">
                            <span className="text-lg">🇺🇸</span>
                            <span className="text-sm font-medium text-slate-600">English</span>
                        </button>
                    </div>
                </div>

                {/* Notifications Section */}
                <div>
                    <h3 className="text-sm font-bold text-slate-700 mb-3">알림</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div>
                                <p className="text-sm font-medium text-slate-700">AI 분석 완료 알림</p>
                                <p className="text-xs text-slate-400">분석이 완료되면 알림을 받습니다</p>
                            </div>
                            <div className="w-10 h-6 bg-[#21DBA4] rounded-full p-0.5 cursor-pointer">
                                <div className="w-5 h-5 bg-white rounded-full translate-x-4 shadow-sm" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div>
                                <p className="text-sm font-medium text-slate-700">주간 인사이트 리포트</p>
                                <p className="text-xs text-slate-400">매주 저장 패턴 분석을 받습니다</p>
                            </div>
                            <div className="w-10 h-6 bg-slate-300 rounded-full p-0.5 cursor-pointer">
                                <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Section */}
                <div>
                    <h3 className="text-sm font-bold text-slate-700 mb-3">계정</h3>
                    <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#21DBA4] rounded-full flex items-center justify-center text-white font-bold">
                            K
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-700">kim@example.com</p>
                            <p className="text-xs text-[#21DBA4]">Pro 플랜</p>
                        </div>
                        <button className="text-xs text-slate-400 hover:text-slate-600">변경</button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 flex justify-between">
                <button className="text-sm text-red-500 hover:text-red-600 font-medium">로그아웃</button>
                <button className="px-4 py-2 bg-[#21DBA4] text-white font-medium rounded-lg hover:bg-[#1BC290] transition-colors text-sm">
                    저장
                </button>
            </div>
        </div>
    ),
};

export const DarkModeSelected = {
    render: () => (
        <div className="w-[480px] bg-[#121214] rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <h2 className="text-lg font-bold text-slate-100">설정</h2>
                <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>

            <div className="p-4 space-y-6">
                <div>
                    <h3 className="text-sm font-bold text-slate-300 mb-3">테마</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="p-4 border border-slate-700 rounded-xl hover:bg-slate-800 transition-colors">
                            <div className="w-12 h-8 bg-white border border-slate-600 rounded-lg mb-2 mx-auto" />
                            <span className="text-sm font-medium text-slate-400">라이트</span>
                        </button>
                        <button className="p-4 border-2 border-[#21DBA4] rounded-xl bg-[#21DBA4]/10">
                            <div className="w-12 h-8 bg-slate-900 border border-slate-700 rounded-lg mb-2 mx-auto" />
                            <span className="text-sm font-medium text-[#21DBA4]">다크</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ),
    parameters: {
        backgrounds: { default: 'dark' },
        docs: {
            description: {
                story: '다크모드가 선택된 설정 화면입니다.',
            },
        },
    },
};
