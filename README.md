# br-korea-poc-front

BR Korea 매장 운영 지원 POC의 프론트엔드 앱입니다. 점주와 본사 관리자가 각각 역할에 맞는 화면을 통해 생산·주문·매출·보안 현황을 확인하고 의사결정을 지원받는 React 기반 운영 대시보드입니다.

## 개요

- 역할 기반 메뉴 제어 (`store_owner` / `hq_admin`)
- 백엔드 REST API와 TanStack Query로 데이터 연동
- 우측 하단 플로팅 AI 도우미 패널 (화면별 퀵 액션)
- 헤더 알림 인박스 (백엔드 `/api/notifications` 30초 폴링)

## Tech Stack

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