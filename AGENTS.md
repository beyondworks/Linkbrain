# Linkbrain UI — Agent Rules (UI/UX + 확장성 우선)

목표: "정식 론칭/지속 업데이트" 기준의 **프로덕션 품질**, 그리고 **디자인 시스템/UX 일관성**을 최우선으로 한다.

---

## 프로젝트 메타

| 항목 | 값 |
|------|-----|
| Tech Stack | React 18 + TypeScript + Vite + Tailwind CSS v4 + Radix UI |
| Backend | Firebase (Auth, Firestore, Storage) + Vercel Serverless |
| Brand Primary | `#21DBA4` (hover: `#1BC290`) |
| Font | Pretendard Variable |
| Root Font Size | 16px |

---

## 0) 작업 방식 (에이전트 공통)

### 0.1 기본 원칙
- 요구사항이 모호하면: **가정/범위/비범위**를 먼저 명시하고, 선택지가 있으면 2–3개 옵션으로 제안한다.
- 변경은 **작게, 기능 단위로** 쪼개고, 리팩터링은 "이번 변경과 직접 관련된 부분"만 한다.
- 파일이 커지면(대략 250–400줄 이상) **즉시 분리**한다. 특히 `src/App.tsx` / 대형 패널 컴포넌트에 신규 기능을 계속 누적하지 않는다.
- 새 컴포넌트 생성 전 기존 `src/components/ui/*` 에서 재사용 가능 여부를 먼저 확인한다.

### 0.2 🔴 사용자 의도 완전 수행 (Scope Expansion Check)
**"요청된 부분만 수정하고 끝내지 말 것"** — 사용자의 진짜 의도를 파악하고 연관된 모든 곳을 처리한다.

**예시 상황:**
| 사용자 요청 | ❌ 불완전 수행 | ✅ 완전 수행 |
|-------------|---------------|-------------|
| "언어 모드에 따라 번역되게 해줘" | 요청한 한 컴포넌트만 번역 | 해당 기능과 관련된 모든 텍스트 검토 후 번역 누락 없이 처리 |
| "이 버튼 스타일 바꿔줘" | 한 버튼만 수정 | 동일 역할의 버튼들이 있는지 확인, 일관성 유지 |
| "다크모드 지원해줘" | 현재 파일만 수정 | 관련 컴포넌트 전체 다크모드 호환 검토 |

**수행 절차:**
1. 요청 수신 → "이 요청의 진짜 의도가 뭔가?" 자문
2. 직접 수정 대상 외에 **연관된 파일/컴포넌트** 검색
3. 누락 가능성 있는 부분 목록화 → 사용자에게 보고 또는 함께 처리
4. 완료 후 "다른 곳에 동일 패턴이 남아있지 않은지" 최종 확인

### 0.3 🔴 UI 버그 디버깅 프로토콜 (스크린샷 기반)
**사용자가 스크린샷을 첨부하며 "UI가 이상해요"라고 할 때:**

0. **재현 정보 먼저 확보(가능하면)**: 화면 경로(URL/라우트), 디바이스/브라우저, 뷰포트 폭(또는 기기), 다크/라이트, 언어 모드, 확대(zoom) 여부.
1. **스크린샷 면밀히 분석** — 코드만 보지 말고 실제 렌더링 결과 확인
2. **증상 분류:**
   - 레이아웃 깨짐 (요소 겹침, 정렬 틀어짐)
   - z-index 문제 (모달이 뒤에 묻힘, 드롭다운 가려짐)
   - 오버플로우 (스크롤 이상, 잘림)
   - 스타일 미적용 (클래스 충돌, CSS 우선순위)
3. **포괄적 코드 검토** — 문제 컴포넌트뿐 아니라:
   - 부모/조상 컴포넌트의 position, z-index, overflow 확인
   - 형제 요소와의 stacking context 충돌 확인
   - Tailwind 클래스 충돌/덮어쓰기 확인
   - `overflow: hidden/auto`로 오버레이가 잘리거나, `transform` 때문에 `position: fixed`가 "뷰포트"가 아닌 "부모"에 종속되는 케이스를 우선 의심
4. **근본 원인 식별 후 수정** — 증상만 고치지 말고 구조적 문제 해결

### 0.4 🔴 "코드는 맞는데 UI 반영이 안 됨" 방지/대응
에이전트가 코드를 수정했는데 UI가 안 바뀌는 경우, 아래를 "먼저" 확인하고 작업한다.

- **실제로 렌더되는 경로인가?**
  - 수정한 컴포넌트가 라우트/조건 분기에서 실제로 사용되는지 확인(동일 이름의 다른 컴포넌트/파일이 존재하는지 포함).
  - 변경한 CSS/컴포넌트가 import 되어 번들에 포함되는지 확인.
- **스타일이 존재/적용 가능한가?**
  - 이 프로젝트는 Tailwind 유틸을 사용하지만, 새로 추가한 `[...]` arbitrary 유틸(`z-[9999]`, `w-[372px]`, `grid-cols-[...]`)은 "CSS에 실제로 존재하지 않으면" 아무 영향이 없을 수 있다.
  - 새 유틸/클래스를 추가하기 전, `src/index.css`에 해당 셀렉터가 있는지 검색해서 확인한다.
  - 존재하지 않는 유틸이 필요하면: (1) 기존 유틸로 재구성, (2) inline style로 제한적으로 적용, (3) 작은 커스텀 클래스 추가(의도/범위 명확히) 중 하나를 선택한다.
- **HMR/캐시 의심 시 최소 재현 절차**
  - 새로고침/하드리로드로 해결되는지 확인(사용자에게 안내).
  - "dev 서버가 다른 폴더/다른 브랜치"를 보고 있지 않은지 확인하도록 요청.
  - 변경이 반영 안 되는 원인을 "추측"으로 덮지 말고, 렌더 경로/스타일 적용 여부를 근거로 확정한다.

---

## 1) 디자인 시스템 (비주얼 일관성은 절대 규칙)

### 1.1 색상 시스템
- **CSS 변수 사용 필수** - 토큰은 `src/index.css`(및 소스 템플릿 `src/styles/globals.css`)에 정의되어 있다.
  ```
  배경: bg-background, bg-card, bg-muted
  텍스트: text-foreground, text-muted-foreground
  테두리: border-border
  강조: bg-primary, text-primary
  ```
- 브랜드 핵심 색상 `#21DBA4`은 **로고/특수 강조**에만 직접 사용, 일반 UI는 변수 사용.
- 하드코딩 색상(`#ffffff`, `rgb(...)`) 사용 최소화.

### 1.2 타이포그래피 스케일
| 클래스 | 크기 | 용도 |
|--------|------|------|
| `text-xs` | 12px | 캡션, 타임스탬프, 배지 |
| `text-sm` | 14px | 보조 본문, 설명 |
| `text-base` | 16px | 기본 본문 (root) |
| `text-lg` | 18px | 카드 제목, 강조 |
| `text-xl` | 20px | 섹션 제목 |
| `text-2xl+` | 24px+ | 페이지 제목, 히어로 |

**폰트 웨이트:**
- `font-normal`(400): 본문
- `font-medium`(500): 라벨, 버튼
- `font-bold`(700): 제목
- `font-black`(900): 히어로 전용

### 1.3 스페이싱 시스템 (4px 기반)
| 값 | 용도 |
|-----|------|
| `gap-1` (4px) | 아이콘-텍스트 |
| `gap-2` (8px) | 요소 내부 |
| `gap-3` (12px) | 컴포넌트 내부 |
| `gap-4` (16px) | 카드 패딩 |
| `gap-6` (24px) | 섹션 내부 |
| `gap-8+` (32px+) | 섹션 간 |

### 1.4 그리드/레이아웃 기본
- **모바일 퍼스트**: 기본값 → `sm:` → `md:` → `lg:` → `xl:` 순으로 확장.
- `flex/grid` 우선, `absolute/fixed`는 오버레이/플로팅 요소에만.
- 모달/패널: **포커스 트랩**, **ESC 닫기**, **배경 스크롤 잠금** 필수 (Radix 사용 시 자동 지원).
- 최대 너비: `max-w-5xl` (콘텐츠), `max-w-7xl` (전체 레이아웃)

### 1.5 🔴 Z-index / Stacking Context 규칙 (모달/드롭다운 보호)
목표: "z-index 전쟁"이 아니라 **일관된 레이어링 규칙 + Portal**로 문제를 원천 차단한다.

**기본 원칙:**
- 모달/드롭다운/팝오버는 원칙적으로 `src/components/ui/dialog.tsx`, `src/components/ui/popover.tsx`, `src/components/ui/dropdown-menu.tsx` 같은 Radix 기반 컴포넌트를 사용한다(Portal 포함).
- 커스텀 모달을 만들 경우 필수 요건:
  - 오버레이와 콘텐츠는 `position: fixed; inset: 0` 기반으로 "뷰포트 기준"으로 렌더한다.
  - 가능하면 `createPortal(..., document.body)`로 body 하위에 렌더해 stacking context 영향을 받지 않게 한다.
  - 오버레이는 click-to-close(필요 시) + ESC close + focus 관리 포함.

**Stacking Context를 만드는 CSS 속성 (주의!):**
다음 속성은 새로운 stacking context를 만들어 z-index 이슈를 자주 만든다. 이런 속성이 모달의 조상 요소에 있으면 **우선적으로 의심**하고 구조를 바꾼다:
- `transform`, `filter`, `perspective`, `opacity < 1`, `mix-blend-mode`, `isolation: isolate`, `will-change`, `position` + `z-index` 조합

**Z-Index 계층 시스템 (필수 준수):**
| 계층 | z-index | 용도 | Tailwind 클래스 |
|------|---------|------|-----------------|
| Base | 0 | 일반 콘텐츠 | `z-0` |
| Raised | 10 | 호버 카드, 툴팁 트리거 | `z-10` |
| Dropdown | 20 | 드롭다운 메뉴, 셀렉트 | `z-20` |
| Sticky | 30~40 | 스티키 헤더, 사이드바 | `z-30`, `z-40` |
| Overlay | 40~50 | 모달 백드롭, 딤 레이어 | `z-40`, `z-50` |
| Modal | 50 | 모달 콘텐츠, 다이얼로그 | `z-50` |
| Popover | 60 | 모달 위 팝오버, 토스트 | `z-[60]` |
| Max | 9999 | 긴급 알림, 시스템 오버레이 | `z-[9999]` (최후 수단) |

**주의사항:**
- `position: relative/absolute/fixed` 없이 z-index는 작동 안 함
- 부모에 `z-index`가 있으면 **새로운 stacking context** 생성 → 자식의 z-index는 부모 범위 내에서만 유효
- Radix UI 컴포넌트(Dialog, Popover, DropdownMenu)는 **Portal로 렌더링**되어 body 직속 → z-index 충돌 방지됨
- **커스텀 모달 작성 시**: 반드시 `fixed inset-0 z-50` + 백드롭 `z-40` 패턴 사용
- 임의의 큰 값(`z-[9999]`)은 "마지막 수단"이며, 사용 전 stacking context/Portal 여부를 먼저 해결한다.

**디버깅 체크리스트 (모달이 뒤에 묻힐 때):**
1. 모달에 `position: fixed` + `z-50` 있는지 확인
2. 부모 컴포넌트 중 `z-index`가 설정된 게 있는지 확인 (stacking context 문제)
3. `overflow: hidden`이 모달을 자르고 있는지 확인
4. `transform`, `filter` 등이 조상에 있는지 확인
5. Radix Portal 사용 여부 확인 → 사용 권장

### 1.6 Position 사용 가이드
```
static (기본): 일반 문서 흐름
relative: 자식 absolute의 기준점, 또는 미세 위치 조정
absolute: 부모(relative/absolute/fixed) 기준 배치 — 플로팅 배지, 아이콘 오버레이
fixed: 뷰포트 기준 — 모달, 토스트, 플로팅 버튼
sticky: 스크롤 시 고정 — 헤더, 사이드바
```

**흔한 실수:**
- ❌ `absolute`를 레이아웃 구성에 남용 → 반응형 깨짐
- ❌ 부모에 `position` 없이 자식에 `absolute` → 예상치 못한 위치
- ❌ `fixed` 요소에 width 미지정 → 가로 100% 안 됨
- ❌ 조상에 `transform`이 있으면 `fixed`가 뷰포트 기준이 아닌 해당 조상 기준이 됨
- ✅ `fixed inset-0` = 전체 뷰포트 커버 (모달 백드롭용)
- ✅ `absolute inset-0` = 부모 전체 커버

### 1.7 🔴 그리드 px 값 / 고정 크기 사용 규칙 (레이아웃 꼬임 방지)
- 고정 폭/높이(`w-[372px]`, `h-[680px]`)는 "정말 필요한 곳"에만 쓰고, 기본은 `max-w-*`, `min-w-0`, `flex-*`, `grid-*`로 반응형을 만든다.
- `grid-cols-[...]`, `left-[...]` 같은 arbitrary 값은 남발 금지(특히 모달/패널). 사용 전:
  1) 기존 유틸로 해결 가능한지 시도
  2) 필요하면 breakpoints 별로 안전장치(`max-w`, `overflow`, `min-w-0`)를 같이 넣기
  3) 최종적으로만 arbitrary/inline style을 사용
- flex/grid에서 텍스트가 밀려 레이아웃이 깨지면 `min-w-0` 누락을 먼저 의심한다.

### 1.8 라운드/쉐도우
- 라운드: `rounded-md`(일반), `rounded-lg`(카드), `rounded-xl`(대형 카드), `rounded-full`(버튼/배지)
- 쉐도우: `shadow-sm`(기본), `shadow-md`(호버), `shadow-lg`(모달/드롭다운)

### 1.9 컴포넌트 사용 규칙
- UI 프리미티브: `src/components/ui/*` (shadcn/Radix) **최우선 사용**
- 공통 UI: `src/components/shared/*`로 추출하여 중복 제거
- 앱 전용: `src/components/app/*` (Cards, Modals, Panels 하위 구조 유지)
- CVA(class-variance-authority) 패턴으로 variant 관리

### 1.10 애니메이션
- 기본 전환: `transition-all duration-300`
- 빠른 피드백: `duration-150` (hover, focus)
- Motion 라이브러리: `motion/react` 사용 (framer-motion 패턴)
- 과도한 애니메이션 자제 - 의미 있는 피드백에만 사용

---

## 2) UX 기본값 (상태/피드백/가드레일)
- 모든 비동기 UX는 최소 4상태를 갖는다: `loading` / `success` / `empty` / `error`.
  - 로딩은 "멈춘 느낌"이 아닌 스켈레톤/프로그레스/스피너로 피드백.
  - 에러는 사용자 액션 가능한 메시지(재시도/문의/뒤로) 포함.
- 폼/저장/삭제:
  - 파괴적 액션은 확인(Confirm)과 되돌리기(가능하면 Undo) 고려.
  - 저장 버튼은 `disabled` + 명확한 사유(검증 실패/로딩) 제공.
- 내비게이션:
  - 현재 위치/뒤로가기/탈출(escape) 경로가 항상 명확해야 한다.

---

## 3) 접근성 (A11y) — 출시 품질 요건
- `button`/`a`/`input`/`label` 등 **시맨틱 요소**를 사용하고 클릭 가능한 `div` 남용 금지.
- 키보드:
  - 모든 핵심 플로우는 Tab/Shift+Tab/Enter/Escape로 가능해야 한다.
  - 포커스 링을 제거하지 않는다(대신 디자인에 맞게 조정).
- 이미지/아이콘:
  - 의미 있는 이미지는 `alt` 제공, 장식 아이콘은 `aria-hidden` 또는 레이블 분리.
- 색 대비:
  - 텍스트/아이콘 대비가 낮아지는 조합(특히 회색 계열) 피한다.

---

## 4) i18n / 카피 규칙

### 4.1 기본 원칙
- 사용자 노출 문자열은 **하드코딩을 최소화**한다.
  - 기존 패턴(`language === 'ko' ? ... : ...`)을 따르거나, 반복되는 문구는 `src/constants/*Translations.ts`로 승격한다.
- 카피는 짧고 행동 유도형으로. 에러 메시지는 "원인 + 해결책" 순서.

### 4.2 🔴 번역 작업 시 완전성 체크
**"번역 추가해줘" 요청 시 해당 컴포넌트만 하고 끝내지 말 것!**

**필수 검토 범위:**
1. **직접 요청된 컴포넌트** — 모든 사용자 노출 텍스트
2. **하위 컴포넌트** — import된 자식 컴포넌트들의 텍스트
3. **연관 모달/다이얼로그** — 해당 기능에서 열리는 모달들
4. **에러/성공 메시지** — toast, alert 등 피드백 텍스트
5. **placeholder, aria-label** — 입력 필드 힌트, 접근성 라벨
6. **버튼 텍스트** — 확인/취소/저장/삭제 등 액션 텍스트

**번역 패턴:**
```tsx
// 인라인 (짧은 텍스트)
{language === 'ko' ? '저장' : 'Save'}

// 객체 패턴 (여러 텍스트)
const t = {
  title: language === 'ko' ? '설정' : 'Settings',
  save: language === 'ko' ? '저장' : 'Save',
  cancel: language === 'ko' ? '취소' : 'Cancel',
};

// 번역 파일 사용 (재사용 텍스트)
import { translations } from '@/constants/translations';
const t = translations[language];
```

**완료 체크리스트:**
- [ ] 모든 버튼 텍스트 번역됨
- [ ] 모든 라벨/제목 번역됨
- [ ] placeholder 번역됨
- [ ] 에러/성공 메시지 번역됨
- [ ] 툴팁/힌트 텍스트 번역됨
- [ ] 빈 상태 메시지 번역됨

---

## 5) 아키텍처 / 폴더 규칙 (확장성)
- 신규 큰 기능(게시판/공지/어드민/인사이트)은 "기능 단위"로 묶는다.
  - 권장: `src/features/<feature>/{components,hooks,services,types,routes}` (기존 구조를 크게 깨지 않는 선에서 점진 도입)
- 데이터/도메인 타입은 한 곳에 두고 재사용한다(예: `src/components/app/types`를 확장하거나 `src/features/*/types`).
- 컴포넌트는 "UI(표현) ↔ 서비스(데이터/IO)"를 분리한다. UI 컴포넌트 안에서 Firestore 쿼리를 마구 섞지 않는다(가능하면 훅/서비스로 분리).

---

## 6) Firebase/서버 API/보안
- **클라이언트에 비밀키/서버 권한(firebase-admin, Stripe secret 등) 절대 금지**.
  - 민감 로직은 `api/*`(Vercel functions)로 이동한다.
- Firestore:
  - 쿼리는 인덱스/정렬을 고려해 설계하고, 필요 시 데이터는 적절히 비정규화한다.
  - 역할 기반 접근(어드민)은 Firestore rules + 서버 검증(가능하면) + UI 가드(보조)로 3중 방어.
- 게시판/공지:
  - HTML/Markdown 렌더링 시 XSS 방어(화이트리스트/정규화/escape) 필수.

---

## 7) 성능
- 긴 리스트/피드는 가상화(virtualization) 또는 페이지네이션/무한스크롤을 고려한다.
- 무거운 대시보드/차트는 라우트 단위 lazy-load를 고려한다.
- re-render를 유발하는 거대한 state는 쪼개고, 계산은 `useMemo`로 안정화한다(과도한 최적화는 금지).

---

## 8) 코드 품질 규칙 (TS/React)
- `any`/`as unknown as` 남발 금지. 타입은 "작게, 명확하게".
- 훅 규칙 준수(조건부 훅 호출 금지). 부수효과는 `useEffect`에 격리.
- `className` 결합은 `cn()` 사용(`src/components/ui/utils.ts`).
- 디버그 `console.log`는 PR에 남기지 않는다(필요 시 최소한으로, 병합 전 제거).

### 8.1 🔴 레이아웃/스타일 수정 시 검증 절차
**"코드는 맞는데 UI가 이상해요" 문제 예방**

**수정 전 확인:**
1. 부모 컴포넌트의 `position`, `z-index`, `overflow`, `transform` 속성 파악
2. 수정 대상이 flex/grid 자식인지, 어떤 컨테이너 안에 있는지 확인
3. 다른 컴포넌트와 클래스명 충돌 가능성 검토

**수정 후 자가 검증:**
```
✓ z-index 계층 시스템 준수했는가?
✓ position 속성이 의도대로 작동하는가?
✓ 모바일/데스크톱 양쪽에서 레이아웃 정상인가?
✓ 다크모드에서 색상/배경 정상인가?
✓ 스크롤 시 sticky/fixed 요소 정상인가?
```

### 8.2 흔한 CSS/레이아웃 버그 패턴

| 증상 | 원인 | 해결 |
|------|------|------|
| 모달이 컴포넌트 뒤에 묻힘 | 부모의 stacking context (transform, z-index 등) | Portal 사용 또는 조상의 stacking context 제거 |
| 드롭다운이 잘림 | 부모의 `overflow: hidden` | 드롭다운을 Portal로 이동 |
| `fixed`가 뷰포트 기준 아님 | 조상에 `transform`/`filter` 있음 | 해당 조상 속성 제거 또는 Portal 사용 |
| 요소가 예상 위치에 없음 | `absolute` 기준점 미설정 | 부모에 `relative` 추가 |
| 가로 스크롤 발생 | `w-full` + padding/margin | `max-w-full`, `overflow-x-hidden` 검토 |
| flex 자식 비율 틀어짐 | `flex-shrink` 미고려 | `shrink-0` 또는 `min-w-0` 추가 |
| grid 아이템 넘침 | 내용물이 셀보다 큼 | `min-w-0`, `overflow-hidden`, `truncate` |
| arbitrary 유틸 미적용 | CSS에 해당 셀렉터 없음 | 기존 유틸 사용 또는 inline style |

### 8.3 Tailwind 클래스 충돌 방지
- 같은 속성에 여러 클래스 적용 시 **마지막 클래스가 우선** (예: `p-4 p-6` → `p-6` 적용)
- `cn()` 함수가 충돌을 자동 병합하므로 반드시 사용
- 조건부 클래스는 `cn(base, condition && 'conditional-class')` 패턴

---

## 9) 완료 기준 (Definition of Done)
- 다크/라이트(또는 현재 테마 정책)에서 깨짐 없음.
- 모바일(최소 360px)에서 레이아웃/터치 타겟 문제 없음.
- 로딩/빈 상태/에러 상태 UX 포함.
- 접근성 기본(키보드/포커스/레이블) 충족.
- 모달/드롭다운/툴팁이 헤더/패널 뒤로 숨지 않음(z-index/Portal 확인).
- 새 기능은 "추가/수정된 화면의 수동 테스트 체크리스트"를 PR 설명에 포함.

---

## 10) 컴포넌트 템플릿

### 기본 컴포넌트

```tsx
import * as React from "react";
import { cn } from "@/components/ui/utils";

interface ComponentNameProps extends React.ComponentProps<"div"> {
  variant?: 'default' | 'secondary';
}

function ComponentName({
  className,
  variant = 'default',
  children,
  ...props
}: ComponentNameProps) {
  return (
    <div
      data-slot="component-name"
      className={cn(
        "base-classes",
        variant === 'secondary' && "secondary-classes",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { ComponentName };
```

### CVA 기반 컴포넌트

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/components/ui/utils";

const componentVariants = cva("base-classes transition-all", {
  variants: {
    variant: {
      default: "default-classes",
      secondary: "secondary-classes",
    },
    size: {
      sm: "h-8 px-3 text-sm",
      default: "h-10 px-4",
      lg: "h-12 px-6",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface ComponentProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof componentVariants> {}

function Component({ className, variant, size, ...props }: ComponentProps) {
  return (
    <div
      className={cn(componentVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

### Custom Hook 패턴

```tsx
import { useState, useCallback, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';

interface UseFeatureReturn {
  data: DataType[];
  loading: boolean;
  error: string | null;
  create: (item: DataType) => Promise<DataType>;
  update: (id: string, updates: Partial<DataType>) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

export function useFeature(): UseFeatureReturn {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ... implementation

  return { data, loading, error, create, update, delete };
}
```

---

## 11) 폴더 구조 참조

```
src/
├── components/
│   ├── ui/              # shadcn/Radix 프리미티브 (수정 최소화)
│   ├── app/             # 앱 전용 컴포넌트
│   │   ├── Cards/       # LinkCard, LinkRow, NavItem
│   │   ├── Modals/      # AddLinkModal, DeleteConfirmation...
│   │   ├── Panels/      # LinkDetailPanel, SettingsModal
│   │   ├── types/       # 앱 전용 타입
│   │   └── constants/   # 앱 전용 상수
│   ├── landing/         # 랜딩 페이지 전용
│   ├── payment/         # 결제 관련
│   ├── public/          # 공개 페이지 (PublicClipView)
│   └── shared/          # 공유 유틸리티 컴포넌트
├── hooks/               # Custom Hooks (useClips, useSubscription...)
├── context/             # React Context (SubscriptionContext, CreditContext)
├── lib/                 # 유틸리티 (firebase.ts, aiService.ts)
├── constants/           # 글로벌 상수, 번역
├── config/              # 설정 파일
├── styles/              # globals.css
└── api/                 # Vercel serverless functions
```

---

## 12) Git 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
style: 스타일/UI 변경 (기능 변화 없음)
refactor: 코드 리팩토링
docs: 문서 변경
chore: 빌드/설정 변경
perf: 성능 개선
```

---

## 참조 파일

| 파일 | 용도 |
|------|------|
| `src/index.css` | Tailwind 유틸, CSS 변수 (실제 적용) |
| `src/styles/globals.css` | CSS 변수 소스 템플릿 |
| `src/hooks/useClips.ts` | 데이터 타입 정의 (`ClipData`, `CollectionData`) |
| `src/components/ui/button.tsx` | CVA 컴포넌트 패턴 예시 |
| `src/components/ui/card.tsx` | 기본 컴포넌트 패턴 예시 |
| `src/components/ui/dialog.tsx` | Portal 기반 모달 패턴 예시 |
| `src/constants/landingTranslations.ts` | 다국어 패턴 |
