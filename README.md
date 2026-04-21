# br-korea-poc-front

BR Korea 매장 운영 지원 AI 에이전트의 점주/본사 웹 대시보드입니다.

## 개요

- 역할 기반 메뉴 제어 (`store_owner` / `hq_admin`)
- 백엔드 REST API와 TanStack Query로 데이터 연동
- 우측 하단 플로팅 AI 도우미 패널 (화면별 퀵 액션)
- 헤더 알림 인박스 (백엔드 `/api/notifications` 30초 폴링)
- 시작 페이지(`/`)에서 점주/본사 역할 카드를 선택해 역할별 기본 화면으로 진입
- 홈 대시보드 (`/dashboard`)는 `GET /api/home/overview`를 조회해 상단 액션 카드, KPI, 요약 카드를 렌더링
- 이 레포의 API 타입/호출 코드가 현재 시스템 인터페이스의 기준입니다.

## 기술 스택

| 패키지           | 버전     |
| ---------------- | -------- |
| React            | ^18.3.1  |
| TypeScript       | ^5.6.2   |
| Vite             | ^5.4.8   |
| React Router DOM | ^6.27.0  |
| TanStack Query   | ^5.59.0  |
| Tailwind CSS     | ^4.1.18  |
| Lucide React     | ^0.468.0 |
| clsx             | ^2.1.1   |
| tailwind-merge   | ^3.4.0   |

## 아키텍처 원칙

- `pages`는 라우트 엔트리만 담당합니다.
- 실제 화면 구성과 비즈니스 로직은 각 `feature` 내부에 둡니다.
- 여러 페이지에서 재사용되는 UI만 `components/common`에 둡니다.
- `components/ui`는 shadcn/ui 전용 자리로 비워 두었습니다.
- HTTP 클라이언트는 feature 내부에 두지 않고 [src/services/axiosInstance.ts](/home/hyeonjeong/projects/br-korea-poc-front/src/services/axiosInstance.ts)로 분리했습니다.
- 전역 상태성 기능 중 화면 도메인과 직접 연결되는 것은 해당 feature에 둡니다.

## Directory Structure

```text
br-korea-poc-front/
├── index.html
├── package.json
├── vite.config.ts
├── postcss.config.js
├── tsconfig.json
├── setup-env.md                        # 환경 설정 가이드
└── src/
    ├── main.tsx                        # React 마운트 엔트리
    ├── App.tsx                         # 앱 진입 컴포넌트
    ├── router.tsx                      # 전체 페이지 라우팅 정의
    ├── index.css / styles.css          # 전역 스타일
    ├── vite-env.d.ts
    ├── assets/
    │   └── logo.svg
    ├── commons/
    │   ├── components/
    │   │   ├── chat/
    │   │   │   └── FloatingAiChat.tsx  # 플로팅 AI 도우미 패널 (화면별 퀵 액션)
    │   │   ├── layout/
    │   │   │   ├── AppHeader.tsx       # 헤더 (알림 인박스, 유저 칩)
    │   │   │   ├── AppLayout.tsx       # 사이드바 + 헤더 조합 레이아웃
    │   │   │   ├── AppShell.tsx        # 앱 셸 래퍼
    │   │   │   ├── AppSidebar.tsx      # 사이드바 (역할별 메뉴 필터링)
    │   │   │   └── menu.ts             # 메뉴 구조 및 역할 정의
    │   │   ├── modal/
    │   │   │   └── AppModal.tsx        # 공통 모달
    │   │   └── page/
    │   │       ├── page-layout.tsx     # 페이지 공통 레이아웃
    │   │       └── StatCard.tsx        # 지표 카드
    │   ├── constants/
    │   │   └── page-content.ts         # 페이지별 정적 콘텐츠
    │   └── types/
    │       └── common.ts               # 공통 타입
    ├── features/
    │   ├── admin/
    │   │   ├── hq-coaching/            # 본사 주문 코칭 (api, screens, types)
    │   │   ├── hq-inspection/          # 본사 생산 점검 (api, screens, types)
    │   │   ├── orchestration/screens/  # 시스템 현황
    │   │   └── signals/                # 매출 시그널 (api, screens, types)
    │   ├── analytics/                  # 매출 조회 (api, screens, types)
    │   ├── dashboard/                  # 홈 대시보드 (api, components, mockdata, queries, screens, types)
    │   ├── notifications/              # 알림 (api, types)
    │   ├── ordering/                   # 주문 관리 (screens, types)
    │   ├── production/                 # 생산 현황 (api, components, mockdata, queries, screens, types)
    │   ├── sales/                      # 매출 현황 (api, components, screens, types)
    │   └── session/                    # 역할 전환 세션 (constants, context, hooks)
    ├── lib/
    │   ├── queryClient.ts              # TanStack Query 클라이언트 설정
    │   ├── tokenManager.ts             # 토큰 관리
    │   └── utils.ts                    # 유틸리티 함수
    ├── pages/                          # 라우트 엔트리 (feature screen 래퍼)
    │   ├── DashboardPage.tsx
    │   ├── ProductionPage.tsx
    │   ├── OrderingPage.tsx
    │   ├── SalesPage.tsx
    │   ├── AnalyticsPage.tsx
    │   ├── HQCoachingPage.tsx
    │   ├── HQInspectionPage.tsx
    │   ├── OrchestrationPage.tsx
    │   └── SignalsPage.tsx
    ├── providers/
    │   └── QueryProvider.tsx           # TanStack Query 프로바이더
    └── services/
        ├── axiosInstance.ts            # axios 공통 인스턴스
        └── type.ts                     # 서비스 공통 타입
```

## 레이어 설명

### `src/pages`

- 라우트 단위 엔트리입니다.
- 각 파일은 feature screen을 import해서 그대로 반환하는 얇은 래퍼만 둡니다.
- 예: `src/pages/DashboardPage.tsx`

### `src/features`

- 페이지/도메인 중심 구현 레이어입니다.
- 해당 페이지 전용 API, 타입, 화면 구현을 한 곳에 모읍니다. 도메인별로 `api/`, `screens/`, `types/`, `queries/`, `components/`, `mockdata/` 디렉터리를 구성합니다.
- 예:
  - `src/features/dashboard/screens/DashboardScreen.tsx`
  - `src/features/production/queries/useGetProductionSkuListQuery.ts`
  - `src/features/session/hooks/useDemoSession.ts`

### `src/commons`

- 여러 feature에서 재사용되는 공통 UI와 상수를 둡니다.
- `components/layout/`: 앱 레이아웃, 헤더, 사이드바
- `components/page/`: 페이지 공통 레이아웃, 지표 카드
- `constants/`: 페이지별 정적 콘텐츠, 공통 상수
- `types/`: 공통 타입 정의

### `src/services`

- feature에 종속되지 않는 공용 서비스 레이어입니다.
- `axiosInstance.ts`: axios 공통 인스턴스 (base URL, 인터셉터)
- `type.ts`: 서비스 공통 타입

### `src/providers`

- 앱 루트 프로바이더를 둡니다.
- `QueryProvider.tsx`: TanStack Query 클라이언트 프로바이더

### `src/router.tsx`

- React Router 정의를 둡니다.
- `AppLayout + children routes` 구조로 모든 페이지를 등록합니다.

## 의존 방향 규칙

- `pages` → `features`
- `features` → 자기 내부 / `components/common` / `commons` / `services` / `lib`
- `components/common` → `commons` / `lib`
- `services` → 최하위 공용 레이어
- `components/ui`는 shadcn 전용이므로 feature 코드와 섞지 않습니다.

## 실행 방법

### 사전 조건

- Node.js 20.x 이상
- npm 10.x 이상

### 설치 및 개발 서버 실행

```bash
npm install
npm run dev
```

기본 개발 서버 포트는 `5173`입니다.

### 환경변수

별도 `.env` 파일 없이 실행 가능합니다. 백엔드 URL을 변경해야 할 경우 아래 변수를 지정합니다.

| 변수 | 기본값 | 설명 |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:6002` | 백엔드 API base URL |

- 소진공 빅데이터 OpenAPI 인증키는 프론트가 직접 보관하지 않고 백엔드 `.env`(`br-korea-poc-backend/.env`)에서만 관리합니다.
- 상권 인텔리전스 실시간 경쟁사 데이터는 백엔드가 `EXTERNAL_API_KEY` 우선, `SBIZ_API_COMMERCIAL_MAP_KEY` 2순위, `SBIZ_API_STORE_STATUS_KEY` 3순위 대체 경로로 조회합니다.
- `/analytics/market`의 `매장 보고서 조회` 블록은 백엔드가 반환하는 `store_reports`(소진공 11개 API 키 상태 + 현재 연동중 키)를 그대로 표시합니다.
- `store_reports` 상태값은 `실호출 미확인/키 미설정/연동중/점검 필요`를 사용할 수 있으며, `점검 필요`는 백엔드 외부 API 실호출 실패 시 표시됩니다.
- 실호출 상태 판정 대상 API는 백엔드 기준으로 `SNS/핫플레이스/배달분석/관광 축제/업소현황/점포당 매출액 추이`입니다.

### 빌드

```bash
npm run build
```

## 주요 화면

### 공통

- **앱 셸**: 역할(`store_owner` / `hq_admin`)에 따라 사이드바 메뉴 항목이 필터링됩니다. 역할은 `localStorage`의 `bypassUserRole` 키로 런타임에 전환 가능합니다.
- **알림 인박스**: 헤더 벨 아이콘. 백엔드 `/api/notifications`를 30초마다 폴링합니다.
- **플로팅 AI 도우미**: 화면별 퀵 액션 버튼과 정적 응답 패널. 현재 백엔드 AI 호출 없이 화면 문맥 기반 하드코딩 응답입니다.

### 점주 화면 (`store_owner` + `hq_admin`)

| 경로 | 화면 | 연동 API |
|---|---|---|
| `/` | 시작 페이지 (역할 선택) | 세션 역할 선택 |
| `/dashboard` | 홈 대시보드 | `/api/home/overview` |
| `/production` | 생산 현황 | `/api/production/overview`, `/api/production/items`, `/api/production/items/{sku_id}`, `/api/production/registrations` |
| `/ordering` | 주문 관리 | `/api/ordering/options`, `/api/ordering/selections` |
| `/sales` | 매출 현황 | `/api/sales/insights`, `/api/sales/query`, `/api/sales/prompts` |
| `/analytics` | 매출 조회 | `/api/analytics/metrics`, `/api/audit/logs` |
| `/analytics/market` | 상권·고객 분석 | `/api/analytics/store-profile`, `/api/analytics/customer-profile`, `/api/analytics/sales-trend`, `/api/analytics/market-intelligence`, `/api/analytics/market-intelligence/weekly-report` |

### 홈 대시보드 표시 규칙

- 상단 `'지금 해야 할 일'` 카드에서 `ai_reasoning`은 설명 하단 보조 문구로 표시합니다.
- `confidence_score`는 `AI 신뢰도 n%` 배지로 표시합니다.
- `is_finished_good=true`인 생산 액션은 생산 CTA를 disabled 처리합니다.
- 주문 관리 카드의 배송 예정 아이콘/문구는 `delivery_scheduled` 값으로 제어합니다.

### 생산 화면 표시 규칙

- `GET /api/production/overview`는 `updated_at`, `refresh_interval_minutes`, `summary_stats`, `alerts`를 기준으로 사용합니다.
- `GET /api/production/items`는 `page`, `page_size`, `store_id`를 query로 전달합니다.
- `GET /api/production/items/{sku_id}`는 생산 등록 패널의 상세 표시값을 채웁니다.
- `POST /api/production/registrations`는 등록 결과를 저장하고 목록/상세 캐시를 갱신합니다.

### 본사 화면 (`hq_admin` 전용)

| 경로             | 화면        | 연동 API             |
| ---------------- | ----------- | -------------------- |
| `/hq/coaching`   | 주문 코칭   | `/api/hq/coaching`   |
| `/hq/inspection` | 생산 점검   | `/api/hq/inspection` |
| `/orchestration` | 시스템 현황 | `/api/audit/logs`    |
| `/signals`       | 매출 시그널 | `/api/signals`       |

### 상권·본사 공통 필터 규칙

- `AnalysisScopeFilterBar`를 `상권·고객 분석`, `HQ 주문 코칭`, `HQ 생산 점검` 화면 상단에 공통 적용합니다.
- 필터 항목은 구/동/업종/연도/분기/반경(퀵 버튼 + 슬라이더)입니다.
- `상권·고객 분석` 화면은 필터 값을 `GET /api/analytics/market-intelligence` 쿼리 파라미터(`gu`,`dong`,`industry`,`year`,`quarter`,`radius_m`)로 전달합니다.
- 레거시 레퍼런스(구→동→업종→연도→분기 체인) 아이디어를 React+TypeScript 컴포넌트로 이식했습니다.

### 상권·고객 분석 화면 표시 규칙

- `MarketScreen`은 현재 필터 스코프 기준으로 `주간 분석 리포트 PDF 다운로드` 버튼을 제공하며, `GET /api/analytics/market-intelligence/weekly-report?format=pdf`를 호출해 PDF 파일을 다운로드합니다.
- `MarketIntelligenceSection`은 3km 상권 인텔리전스 기준으로 아래 블록을 노출합니다.
- 외식업 매출 파이(제과·커피), 경쟁사 10곳 매출 트렌드 + 결제건 연령/성별
- 서울시 공공데이터 유동인구 추세, 주거인구(19세 이하/20대/30대/40대/50대/60대 이상) 남녀 레이더
- 1인가구/3인가족 비중 파이, 소비자 추정 거주 지역, 매출 히트맵, 매장 보고서 조회, 추정 매출 데이터

## Session Update (2026-04-20)

- 상권 화면의 주간 리포트 다운로드는 backend `weekly-report` 안정화 패치와 연계되어 `gu/dong` 미지정 상황에서도 실패 없이 동작합니다.
- 생산 화면(`SKU별 생산 현황`, `생산 등록`)은 backend `image_url`을 사용해 메뉴 썸네일을 노출합니다.
- `image_url`이 없거나 이미지 로딩이 실패하면 `상품이미지 준비중입니다.` 문구를 표시합니다.
- 프론트 정적 에셋 `public/images/menu-placeholder.svg`를 추가해 이미지 미존재/실패 시 기본 썸네일을 항상 렌더링합니다.
- `index.html`에 `/favicon.svg`를 연결해 브라우저 `favicon.ico 404` 콘솔 노이즈를 제거했습니다.
- `발주 이력` 화면을 필터(기간/품목/자동·수동) + 이상징후 인사이트 + 변동품목 + 이력 상세(행 클릭) 구조로 고도화했습니다.
- 주문 확정 후 화면은 상세 이력 나열 대신 `발주 이력 분석 보기` 링크를 제공해 주문실행과 이력분석 경계를 분리했습니다.
- 상권/고객 분석(`MarketIntelligenceSection`)은 백엔드 실데이터 전용 응답으로 동작하며, 연도/분기 미존재 시에도 백엔드 가용 실데이터 폴백 결과를 그대로 표시합니다.
- 상권/고객 분석 화면은 레퍼런스 구조에 맞춰 `업종 분석`, `매출 분석`, `인구 분석`, `지역현황`, `고객특성` 5개 블록으로 재구성했습니다.
- `신규/단골 비율`처럼 원천 데이터 미제공 항목은 프론트에서 `미제공`으로 표시해 합성값 노출을 방지합니다.
- 백엔드에 고객 식별 컬럼 자동탐지 템플릿이 추가되어, 원천 컬럼이 적재되면 프론트 수정 없이 신규/단골 비율이 자동 반영됩니다.
- `미제공` 항목에는 툴팁(title)과 보조 문구를 추가해 미제공 사유(원천 컬럼 미식별/집계 미존재)를 화면에서 즉시 확인할 수 있도록 정리했습니다.
- `ordering/history`의 API 호출 시그니처를 정합화해 잘못된 `store_id` 전달(`"[object Object]"`) 문제를 제거했습니다.
- `ordering/history`는 `store_id`를 항상 전달하도록 정합화했으며, 누락/오입력은 백엔드 4xx 에러로 명시적으로 노출됩니다(QA 검증 우선).

## API 계약 메모

- 프론트 코드는 화면에서 직접 쓰는 필드를 기준으로 API를 호출합니다.
- 백엔드 어댑터 매핑을 최소화하는 방향이라, 타입 파일에 정의된 응답 필드명을 그대로 내려주는 것이 기준입니다.
- 특히 아래 도메인은 계약 고정 대상으로 봅니다.
  - `src/features/dashboard/types/dashboard.ts`
  - `src/features/production/types/production.ts`
  - `src/features/sales/types/sales.ts`
  - `src/features/analytics/types/analytics.ts`
  - `src/features/notifications/types/notifications.ts`

- 상권/고객 분석 화면의 글로벌 에러 배너는 `market-intelligence` 메인 쿼리 실패일 때만 표시하도록 조정했습니다. 보조 쿼리(`store-profile`, `customer-profile`, `sales-trend`) 실패만으로 전체 분석 실패 문구를 띄우지 않습니다.

- `/analytics/market` 글로벌 에러 배너는 `market-intelligence` 실패 시에만 표시하도록 조정했고, 보조 API 실패와 분리했습니다.
- 백엔드 `market-intelligence` 예외 시에도 기본 구조(200 응답)를 반환하도록 안전 처리되어 화면이 즉시 실패 배너로 전환되지 않도록 보강했습니다.
- 헤더 점포 전환 메뉴 로드 후 현재 세션 `storeId`가 목록에 없으면 첫 점포로 자동 보정하도록 변경해, 초기 `STORE_DEMO` 상태에서 분석 KPI가 0으로 고정되는 문제를 완화했습니다.
- `.env.example` 기본값을 `VITE_DEFAULT_STORE_ID=POC_012`로 정리해, 기본 진입 시 온라인/할인 KPI가 0으로만 보이는 케이스를 줄였습니다.
- 백엔드 할인 KPI 포맷 보정으로 `0.1%` 미만 할인 비중도 `0.03%`처럼 소수 둘째 자리까지 확인할 수 있습니다.

## Session Update (2026-04-21)

- 이번 세션의 핵심 수정은 AI 서비스(`br-korea-poc-ai`) 내부 안정화(생산 에이전트 구현/오케스트레이터 라우팅 정리)이며, 프론트 코드 변경은 없습니다.

## Session Update (2026-04-21, Round 2)

- 이번 라운드의 변경은 AI 서비스(`br-korea-poc-ai`)의 오케스트레이션/예외처리/컨텍스트 전달 정비이며, 프론트 코드 변경은 없습니다.

## Session Update (2026-04-21, Round 3)

- 주문 추천 화면에서 `USE_ORDERING_DEADLINE_MOCK` 및 `mock-ordering-deadline-items` 의존을 제거했습니다.
- 주문 마감 알림 테이블은 주문 옵션 API(`GET /api/ordering/options`)의 실제 `items` + `deadline_at` 데이터를 기반으로 렌더링합니다.
- 데이터가 없을 때 `품목 정보 없음` fallback 행을 강제로 생성하지 않고, 빈 상태 메시지를 표시하도록 정리했습니다.
- 매출 질의 처리 경로 라벨을 `stub_repository`에서 `repository`로 변경해 실데이터 경로명을 일관화했습니다.

## Session Update (2026-04-21, Round 3)

- 이번 라운드는 AI/Backend의 analytics·ordering fallback 정리 작업이며, 프론트 코드 변경은 없습니다.
