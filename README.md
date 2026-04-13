# br-korea-poc-front

BR Korea 매장 운영 지원 AI 에이전트의 점주용 웹 대시보드입니다.

## 개요

- 역할 기반 메뉴 제어 (`store_owner` / `hq_admin`)
- 백엔드 REST API와 TanStack Query로 데이터 연동
- 우측 하단 플로팅 AI 도우미 패널 (화면별 퀵 액션)
- 헤더 알림 인박스 (백엔드 `/api/notifications` 30초 폴링)

## 기술 스택

| 패키지 | 버전 |
|---|---|
| React | ^18.3.1 |
| TypeScript | ^5.6.2 |
| Vite | ^5.4.8 |
| React Router DOM | ^6.27.0 |
| TanStack Query | ^5.59.0 |
| Tailwind CSS | ^4.1.18 |
| Lucide React | ^0.468.0 |
| clsx | ^2.1.1 |
| tailwind-merge | ^3.4.0 |

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
    ├── index.css                       # 전역 스타일
    ├── styles.css                      # 추가 공통 스타일
    ├── app/
    │   ├── providers/
    │   │   └── query-client.ts         # TanStack Query 클라이언트 설정
    │   └── router.tsx                  # 전체 페이지 라우팅 정의
    ├── assets/
    │   └── logo.svg
    ├── components/
    │   ├── commons/
    │   │   ├── AppHeader.tsx           # 헤더 (브레드크럼, 알림 인박스, 유저 칩)
    │   │   ├── AppSidebar.tsx          # 사이드바 (역할별 메뉴 필터링)
    │   │   └── FloatingAiChat.tsx      # 플로팅 AI 도우미 패널
    │   ├── layout/
    │   │   ├── AppLayout.tsx           # 사이드바 + 헤더 조합 레이아웃
    │   │   └── AppShell.tsx            # 앱 셸 래퍼
    │   └── ui/
    │       ├── AiInsightResponse.tsx   # AI 인사이트 응답 카드
    │       ├── FeatureCard.tsx         # 기능 카드
    │       ├── InsightPanel.tsx        # 인사이트 패널
    │       ├── PromptList.tsx          # 퀵 프롬프트 목록
    │       ├── SectionHint.tsx         # 섹션 힌트 UI
    │       └── StatCard.tsx            # 지표 카드
    ├── contexts/
    │   ├── DemoSessionContext.tsx      # 역할 전환 프로바이더
    │   ├── demo-session-context.ts     # 컨텍스트 정의
    │   └── useDemoSession.ts           # 세션 훅
    ├── data/
    │   ├── navigation.ts               # 메뉴 구조 및 역할 정의
    │   ├── notifications.ts            # 알림 기본 데이터
    │   ├── page-content.ts             # 페이지별 정적 콘텐츠
    │   └── session-user.ts             # 기본 세션 유저 데이터
    ├── features/
    │   └── feature-data.ts             # 기능 단위 보조 데이터
    ├── hooks/
    │   └── use-bootstrap.ts            # 부트스트랩 훅
    ├── lib/
    │   ├── api.ts                      # 백엔드 연동 타입 및 요청 함수
    │   └── utils.ts                    # 유틸리티 함수
    └── pages/
        ├── shared.tsx                  # PageHero, StatsGrid 등 공용 컴포넌트
        ├── DashboardPage.tsx           # 홈 대시보드
        ├── ProductionPage.tsx          # 생산 현황
        ├── OrderingPage.tsx            # 주문 관리
        ├── SalesPage.tsx               # 매출 현황
        ├── AnalyticsPage.tsx           # 매출 조회
        ├── HQCoachingPage.tsx          # 본사 주문 코칭
        ├── HQInspectionPage.tsx        # 본사 생산 점검
        ├── OrchestrationPage.tsx       # 시스템 현황
        └── SignalsPage.tsx             # 매출 시그널
```

## 레이어 설명

### `src/pages`
- 라우트 단위 엔트리입니다.
- 각 파일은 feature screen을 import해서 그대로 반환하는 얇은 래퍼만 둡니다.
- 예: [src/pages/DashboardPage.tsx](/home/hyeonjeong/projects/br-korea-poc-front/src/pages/DashboardPage.tsx)

### `src/features`
- 페이지/도메인 중심 구현 레이어입니다.
- 해당 페이지 전용 API, 타입, 화면 구현을 한 곳에 모읍니다.
- 예:
  - [src/features/dashboard/screens/DashboardScreen.tsx](/home/hyeonjeong/projects/br-korea-poc-front/src/features/dashboard/screens/DashboardScreen.tsx)
  - [src/features/analytics/api/index.ts](/home/hyeonjeong/projects/br-korea-poc-front/src/features/analytics/api/index.ts)
  - [src/features/session/hooks/useDemoSession.ts](/home/hyeonjeong/projects/br-korea-poc-front/src/features/session/hooks/useDemoSession.ts)

### `src/components/common`
- 여러 feature에서 재사용되는 공통 UI입니다.
- 앱 레이아웃, 헤더, 사이드바, 페이지 공통 섹션 같은 것만 둡니다.
- 예:
  - [src/components/common/layout/AppLayout.tsx](/home/hyeonjeong/projects/br-korea-poc-front/src/components/common/layout/AppLayout.tsx)
  - [src/components/common/page/page-layout.tsx](/home/hyeonjeong/projects/br-korea-poc-front/src/components/common/page/page-layout.tsx)

### `src/components/ui`
- shadcn/ui 전용 위치입니다.
- 현재 프로젝트에서는 사용 중인 shadcn 컴포넌트가 없어 비워 둔 상태입니다.

### `src/commons/constants`
- 여러 레이어에서 공유하는 상수/표시용 타입을 둡니다.
- 현재는 페이지 공통 표시용 타입과 정적 데이터가 있습니다.

### `src/services`
- feature에 종속되지 않는 공용 서비스 레이어입니다.
- 현재는 HTTP 클라이언트를 [src/services/axiosInstance.ts](/home/hyeonjeong/projects/br-korea-poc-front/src/services/axiosInstance.ts)에 둡니다.

### `src/providers`
- 앱 루트 프로바이더를 둡니다.
- 현재는 [src/providers/QueryProvider.tsx](/home/hyeonjeong/projects/br-korea-poc-front/src/providers/QueryProvider.tsx)만 사용합니다.

### `src/router`
- React Router 정의를 둡니다.
- [src/router/index.tsx](/home/hyeonjeong/projects/br-korea-poc-front/src/router/index.tsx)에서 `AppLayout + children routes` 구조를 사용합니다.

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
| `VITE_API_BASE_URL` | `http://localhost:8000` | 백엔드 API base URL |

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
| `/` | 홈 대시보드 | `/api/production/overview`, `/api/ordering/selections/summary`, `/api/production/registrations/summary`, `/api/analytics/metrics`, `/api/audit/logs` |
| `/production` | 생산 현황 | `/api/production/overview`, `/api/production/registrations` |
| `/ordering` | 주문 관리 | `/api/ordering/options`, `/api/ordering/selections` |
| `/sales` | 매출 현황 | `/api/sales/insights`, `/api/sales/query`, `/api/sales/prompts` |
| `/analytics` | 매출 조회 | `/api/analytics/metrics` |

### 본사 화면 (`hq_admin` 전용)

| 경로 | 화면 | 연동 API |
|---|---|---|
| `/hq/coaching` | 주문 코칭 | `/api/hq/coaching` |
| `/hq/inspection` | 생산 점검 | `/api/hq/inspection` |
| `/orchestration` | 시스템 현황 | `/api/audit/logs` |
| `/signals` | 매출 시그널 | `/api/signals` |