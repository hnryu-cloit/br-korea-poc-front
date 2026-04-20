# br-korea-poc-front

BR Korea 매장 운영 지원 AI 에이전트의 점주용 웹 대시보드입니다.

## 개요

- 역할 기반 메뉴 제어 (`store_owner` / `hq_admin`)
- 백엔드 REST API와 TanStack Query로 데이터 연동
- 우측 하단 플로팅 AI 도우미 패널 (화면별 퀵 액션)
- 헤더 알림 인박스 (백엔드 `/api/notifications` 30초 폴링)
- 홈 대시보드 (`/`)는 `GET /api/home/overview`를 조회해 상단 액션 카드, KPI, 요약 카드를 렌더링
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

| 변수                | 기본값                  | 설명                |
| ------------------- | ----------------------- | ------------------- |
| `VITE_API_BASE_URL` | `http://localhost:6002` | 백엔드 API base URL |

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

| 경로          | 화면        | 연동 API                                                                                                               |
| ------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| `/`           | 홈 대시보드 | `/api/home/overview`                                                                                                   |
| `/production` | 생산 현황   | `/api/production/overview`, `/api/production/items`, `/api/production/items/{sku_id}`, `/api/production/registrations` |
| `/ordering`   | 주문 관리   | `/api/ordering/options`, `/api/ordering/selections`                                                                    |
| `/sales`      | 매출 현황   | `/api/sales/insights`, `/api/sales/query`, `/api/sales/prompts`                                                        |
| `/analytics`  | 매출 조회   | `/api/analytics/metrics`, `/api/audit/logs`                                                                            |

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

## API 계약 메모

- 프론트 코드는 화면에서 직접 쓰는 필드를 기준으로 API를 호출합니다.
- 백엔드 어댑터 매핑을 최소화하는 방향이라, 타입 파일에 정의된 응답 필드명을 그대로 내려주는 것이 기준입니다.
- 특히 아래 도메인은 계약 고정 대상으로 봅니다.
  - `src/features/dashboard/types/dashboard.ts`
  - `src/features/production/types/production.ts`
  - `src/features/sales/types/sales.ts`
  - `src/features/analytics/types/analytics.ts`
  - `src/features/notifications/types/notifications.ts`
