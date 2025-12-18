# Linkbrain UI — AI Guidelines (요약본)

> Source of truth: `Linkbrain UI/AGENTS.md`

## Must
- 디자인 시스템 일관성(그리드/타이포/색/여백)을 깨지 않는다.
- 비동기 UX는 `loading / empty / error / success` 상태를 반드시 제공한다.
- 접근성 기본(시맨틱/키보드/포커스/레이블/alt)을 충족한다.
- 기존 UI는 `src/components/ui/*`(shadcn/Radix) 우선 재사용한다.
- 대형 파일에 신규 기능을 누적하지 않고 빠르게 분리한다.
- `.env*`의 비밀정보를 노출/로그하지 않으며, 비밀키가 필요한 로직은 `api/*`로 보낸다.
- 모달/오버레이는 Portal(Radix/shadcn) 우선, z-index는 stacking context/overflow 원인부터 해결한다.
- 스크린샷이 제공되면 실제 렌더링 결과를 기준으로 부모/조상까지 포함해 원인을 추적한다.
- 요청 수행 후 관련 영역을 한 번 더 스캔해(i18n/스타일/다크모드 등) 의도 누락을 막는다.

## Prefer
- 클래스 머지는 `cn()` 사용.
- 사용자 문자열은 `language === 'ko' ? ... : ...` 패턴 또는 `src/constants/*Translations.ts`로 관리.
