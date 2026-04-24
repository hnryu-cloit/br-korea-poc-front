# br-korea-poc-front

BR Korea 매장 운영 지원 AI 에이전트의 점주/본사 웹 대시보드입니다.

## 개요

- 역할 기반 메뉴 제어 (`store_owner` / `hq_admin`)
- 백엔드 REST API와 TanStack Query로 데이터 연동
- 우측 하단 플로팅 AI 도우미 패널 (화면별 퀵 액션)
- 헤더 알림 인박스 (백엔드 `/api/notifications` 30초 폴링)
- 시작 페이지(`/`)에서 점주/본사 역할 카드를 선택해 역할별 기본 화면으로 진입
- 홈 대시보드 (`/dashboard`)는 `GET /api/dashboard/notices`, `GET /api/home/schedule`, `GET /api/dashboard/alerts`, `GET /api/dashboard/summary-cards`를 조합해 렌더링
- 이 레포의 API 타입/호출 코드가 현재 시스템 인터페이스의 기준입니다.

## 최근 업데이트 (2026-04-24)

- AI grounded 입력 안정화(행 상한 + 프롬프트 예산) 반영 사항을 동기화했습니다.
  - AI grounded 경로에서 SQL 실행 결과는 `fetchmany(300)` 상한으로 조회됩니다.
  - Gemini 입력의 `reference_data.rows`는 기본 60행 + JSON 길이 예산(18,000자) 기준으로 제한됩니다.
  - `included_row_count`, `truncated`, `omitted_row_count` 메타정보가 추가되어 절단 여부를 확인할 수 있습니다.
  - 이번 세션의 프론트 코드/실행 방식 변경은 없습니다.

- AI 전체 스크립트 경로 점검 확장 결과를 반영했습니다.
  - AI 레포 추가 보강 대상(`pipeline/run.py`, `tests/grounded_consistency_utils.py`, `tests/test_golden_query_resolver.py`, `tests/test_grounded_workflow.py`)이 모노레포 루트 실행 기준으로 정비되었습니다.
  - 이번 세션의 프론트 코드/실행 방식 변경은 없습니다.

- 생산 진단 화면의 이월재고 섹션 기준을 동기화했습니다.
  - `/production/inventory-diagnosis`는 `useGetFifoLotSummaryQuery`로 `GET /api/production/fifo-lots`를 호출합니다.
  - 탭(`전체/완제품/납품`)과 페이지네이션은 API 파라미터(`lot_type`, `page`)에 직접 매핑됩니다.
- 실행 의존성 주의사항을 반영했습니다.
  - Docker Compose에서 `load`가 완료되기 전에는 backend(`6002`)가 뜨지 않아 프론트 API 호출이 `ERR_CONNECTION_REFUSED`일 수 있습니다.

- AI 레포 골든쿼리 테스트 자산 Git 추적 제외 정책이 반영되었습니다.
  - `br-korea-poc-ai/.gitignore`에 `tests/*golden_query*` 패턴이 추가되었고 기존 추적 파일은 인덱스에서 제거되었습니다.
  - 이번 세션의 프론트 코드/실행 방식 변경은 없습니다.

- AI 스크립트 실행 경로 안정화 패치가 반영되었습니다.
  - 이번 세션의 프론트 코드/실행 방식 변경은 없습니다.

- AI 레포에서 골든쿼리 홀드아웃 100건 재검증이 수행되었습니다.
  - 이번 세션의 프론트 코드/실행 방식 변경은 없습니다.

- 골든쿼리 매칭 벤치마크 세션을 반영했습니다.
  - 이번 세션의 코드 변경은 AI 레포 중심이며, 프론트 코드/실행 방식 변경은 없습니다.

- backend 데이터 적재 안정화 패치(`store_clusters` 컬럼 보강 마이그레이션)가 반영되었습니다.
  - 프론트 코드/실행 방식 변경은 없습니다.

- 주문관리 화면의 마감 임박/리마인더 mock 고정을 제거하고 실데이터 기반으로 전환했습니다.
  - `OrderingRecommendationsScreen`: 마감 임박 테이블을 옵션 item note(마감시각) 기준으로 구성
  - `router/AppLayout`: `OrderingDeadlineReminder`를 API 기반 마감시각(`GET /api/ordering/deadline`)으로 동작
  - `OrderingOptionCard`/`OrderingConfirmedSummary`: item `note`(마감/도착/유통기한) 표시
- 주문 추천 화면 마감 임박 테이블 fallback을 보강했습니다.
  - `/api/ordering/options`의 `deadline_items`를 우선 사용하고, 비어있을 때만 `item.note`에서 `마감 HH:mm`를 파싱해 표시

- 백엔드 `resource/06. 유통기한 및 납품일/*.xlsx` 적재 확장(납품 스케줄/유통기한 raw 테이블)이 반영되었습니다.
  - 프론트 API 계약 변경은 없고, 기존 주문/생산 화면에서 동일 응답 필드의 데이터 근거만 강화됩니다.
- 주문관리/발주이력 응답 근거가 강화되었습니다.
  - `/api/ordering/options` 아이템 `note`에 마감/도착/유통기한 정보가 포함될 수 있습니다.
  - `/api/ordering/history` explainability 근거에 납품/유통기한 데이터 소스가 추가됩니다.

## 최근 업데이트 (2026-04-23)

- 백엔드 골든쿼리 자산(`../br-korea-poc-backend/docs/golden-queries-new.csv`)이 `일반화 쿼리`/`예시 쿼리` 분리 컬럼으로 정비되었습니다.
  - 프론트 코드 변경은 없고, 설정/시연 시 참조하는 질의 자산 구조만 동기화했습니다.

- `docs/design-docs.md`에 본사 시연자(`hq_admin`)와 점주 실사용자(`store_owner`) 이중 타깃 관점을 명시했습니다.
  - 페이지별로 본사 시연 포인트와 점주 실행 포인트를 함께 설명하도록 정리했습니다.

- `docs/design-docs.md` 페이지 전략 문서를 실제 라우터 기준으로 정비했습니다.
  - 각 페이지별로 \"왜 필요한지/무엇을 말하고 싶은지/사용자 기대 행동\"을 명시해 콘텐츠 설계 기준을 문서화했습니다.

- 점주 골든쿼리 데이터셋(`docs/golden-queries-store-owner.csv`) 200건이 추가되었습니다.
  - 에이전트 분포: 생산관리 67 / 주문관리 67 / 매출관리 66
  - 본사 `/settings/golden-queries` 운영 검토 시 기준 데이터셋으로 활용 가능합니다.
- 점주 골든쿼리 데이터셋을 200건 추가 확장해 총 400건으로 반영했습니다.
  - 추가분은 쉬운 점주 문장 중심으로 작성했고, 기존 질문에 이어지는 연결형 추천질문을 다수 포함합니다.
- 골든쿼리 CSV는 `질문번호` 단일 컬럼에서 `그룹번호-순번-` 형식(예: `067-003-`)으로 연계 질문을 추적하도록 정리했습니다.
- 골든쿼리 CSV에 기준일시 `2026-03-05 09:00 (KST)`를 고정 반영하고, 쿼리/예상답변에도 같은 기준 문구가 포함되도록 정리했습니다.

- 사이드바 상단 `AgentGo Biz` 로고 클릭 동선을 역할별 홈에서 대문(`/`)으로 변경했습니다.
  - 점주/본사 화면 어디에서든 로고 클릭 시 역할 선택 카드 화면으로 이동합니다.
- `/settings` 화면의 상단 헤더/좌측 설정 내비/메인 캔버스 셸을 `Settings v3` 원본 HTML 토큰 기준으로 재정렬했습니다.
  - 색상 토큰(`--orange`, `--bg`, `--border` 등)과 내비 인터랙션(active/hover/pill)을 원본 스타일과 동일한 기준으로 적용했습니다.
- `/settings` 내부 패널(Agent/오케스트레이션/커넥터/RBAC/프롬프트/골든쿼리/감사로그/품질/공지)과 설정 모달을 `Settings v3` 마크업 기준으로 재작성했습니다.
  - `screen`은 배치 조합만 담당하고, 패널별 section은 `components`로 분리해 `VIBE_CODING_GUIDE` 구조를 유지했습니다.
- `VIBE_CODING_GUIDE` 준수를 위해 settings 패널 상태/필터/목업 로직을 `hooks`와 `mockdata`로 분리했습니다.
  - `components`는 렌더링 중심으로 정리하고, 패널별 상태 조합은 `useAuditPanel`, `useRbacPanel`, `useGoldenQueriesPanel`, `usePromptTestConsole`로 이동했습니다.
- `/settings` 스타일 로딩 방식을 정리했습니다.
  - feature 전용 `settings-v3.css` 파일을 제거하고 기존 전역 스타일 엔트리(`src/index.css`)로 통합해 스타일 소스 위치를 단일화했습니다.
- `/settings` 일부 패널(`SettingsModal`, `GoldenQueriesPanel`) 인라인 스타일을 Tailwind 클래스 기반으로 리팩토링했습니다.
  - 모달 오버레이/컨테이너/폼/리스트 아이템의 style 객체를 className으로 전환해 코드 컨벤션 정합성을 높였습니다.
- `/settings` 추가 패널(`AgentsPanel`, `ConnectorsPanelV3`, `RbacPanel`)도 인라인 스타일을 Tailwind 클래스 중심으로 2차 정리했습니다.
  - 카드 헤더/메트릭/배지/그리드/폼 행의 style 객체를 className으로 전환하고 동적 스타일은 최소(width 등)만 유지했습니다.
- `/settings` 전체 화면 비율을 원본에 맞추기 위해 앱 공통 레이아웃 패딩/컨테이너 제한을 해제하고, settings 셸 높이/프레임을 full-viewport 기준으로 보정했습니다.
  - `AppLayout`의 settings route는 `p-0` + full-width Outlet로 렌더링하고, `settings-v3-shell/layout`은 `100vh`/`calc(100vh - 48px)` 기준으로 동작합니다.

## 최근 업데이트 (2026-04-22)

- 매출 질의 응답의 explainability 병렬 보강을 반영했습니다.
  - `POST /api/sales/query` 응답의 `explainability.trace_id`가 `pending`이면 프론트가 `GET /api/explainability/{trace_id}`를 폴링합니다.
  - 보강 완료(`ready/failed`) 시 액션/근거를 대화 카드에 갱신해 1차 렌더 지연을 줄였습니다.

- 공통 헤더에 `데이터 검증 기준 일자/시간` UI를 추가했습니다.
  - 기본값은 `2026-03-05 00:00`이며 사용자가 `datetime-local` 입력으로 직접 변경할 수 있습니다.
  - 기준 일시는 세션(localStorage)에 저장되어 페이지 이동 후에도 유지됩니다.
- 기본 점포를 `POC 010`(`POC_010`)으로 조정했습니다.
- 프론트 API 요청 헤더에 `X-Store-Id`, `X-Reference-Datetime`를 포함하도록 확장했습니다.

- 본사 `/settings` 화면을 `Settings Page v3` 기준으로 전면 개편했습니다.
  - 좌측 섹션 네비 + 우측 패널 전환 구조를 적용했습니다.
  - 패널: Agent 레지스트리, 오케스트레이션, 데이터 커넥터, RBAC, AI 프롬프트, 골든 쿼리, 감사 로그, 품질, 공지사항
  - AI 프롬프트 패널은 기존 API(`GET/PUT /api/settings/prompt`) 연동을 유지하면서 `저장/되돌리기/미저장 변경사항` 상태를 반영합니다.
  - 감사 로그 패널은 기존 감사 로그 데이터 기반 검색/결과 필터/경로 필터를 제공합니다.

- QA 운영 자산 동기화
  - 기준 QA 마스터 참조 파일을 `../docs/reference/qa-master.csv`로 추가했습니다.
  - QA 실행 이력 기록 도구 `../docs/qa/qa-run-log.py`를 기준 경로로 문서화했습니다.

- QA 회차 메모
  - 이번 세션의 병렬 QA 및 이슈 수정은 backend/ai 레이어 중심으로 진행되어 프론트 소스 변경은 없습니다.

- `/analytics/market` no-fallback 정책 반영
  - `source` 타입을 `"ai"` 단일 값으로 정리하고 fallback 라벨 분기를 제거했습니다.
  - 상권 인사이트 쿼리(`store/hq`)는 `45초` 폴링 + 짧은 재시도로 백그라운드 갱신을 반영합니다.

- `/sales/metrics` no-fallback + 백그라운드 갱신 정책 반영
  - `summary/insights/campaign-effect/prompts` 쿼리에 `45초` 폴링, 짧은 retry 정책을 적용했습니다.
  - UI 레이아웃 변경 없이 실데이터 갱신 주기만 조정했습니다.

- 이번 세션의 생산 예측 모델 우선 적용은 AI 서비스(`/predict`) 변경이며 프론트 코드 변경은 없습니다.

- `/production/status`의 `주문 마감 시간` 컬럼 하드코딩(`00:00`)을 제거하고 `GET /api/ordering/deadline` 실데이터로 연동했습니다.
- 생산 현황 테이블은 더 이상 고정 마감 시각 fallback을 표시하지 않습니다.

- 주문 이력 인사이트 타입 계약을 확장했습니다.
  - `OrderingHistoryInsightsResponse`에 `sources`, `retrieved_contexts`, `confidence`를 추가해 RAG 근거 메타를 수용합니다.
  - 기존 화면 렌더링 계약(`kpis`, `anomalies`, `top_changed_items`)은 유지됩니다.

- `/sales/metrics` fallback 제거
  - 실데이터 미충족 시 `SalesV2OpportunitySection`의 fallback 수치 조합을 중단했습니다.
  - `summary/insights/campaign-effect/benchmark` 조회 오류를 상단 배너로 노출하고, 실데이터가 없으면 기회영역 카드를 렌더링하지 않습니다.

- 프론트 빌드 오류를 정리했습니다.
  - 누락된 HQ 타입 파일(`hq-coaching`, `hq-inspection`)을 추가했습니다.
  - Recharts `Tooltip.formatter` 타입 불일치 구간(주문 이력/매출 차트)을 수정했습니다.
  - 주문 추천 화면의 `OrderingDeadlineAlert` prop 타입 불일치를 정리했습니다.
  - 생산 등록 타입(`ProductionRegistrationForm.image_url`)과 미사용 import를 정리해 `npm run build`가 통과하도록 복구했습니다.

- `/analytics` 화면은 기존과 동일하게 API 응답만 렌더링하며, 이번 세션에서 프론트 fallback 추가/변경은 없습니다.
- `/analytics`에서 사용하는 backend API(`metrics`, `sales-trend`)가 fallback 없이 오류를 반환하도록 정비되어, 프론트는 빈 fallback 데이터 대신 에러 상태를 받습니다.
- `/analytics` 화면 상단에 API 오류 배너를 추가해 422/500 detail 메시지를 사용자에게 직접 표시하도록 개선했습니다.

- `/production/waste-loss`, `/production/inventory-diagnosis` 체감 지연 완화를 위해 React Query 캐시 정책을 보완했습니다.
  - `useGetProductionWasteQuery`, `useGetProductionInventoryStatusQuery`에 `staleTime(60s)`, `gcTime(5m)`, `refetchOnWindowFocus: false`를 적용했습니다.
- `/production/inventory-diagnosis` 페이지네이션 상태(`page`)를 실제 조회 쿼리에 연결해 페이지 이동 시 올바른 API 요청이 발생하도록 수정했습니다.

- `/ordering/history` 기본 기간을 현재 기준 최근 90일로 변경해 고정 날짜로 인한 빈 조회를 줄였습니다.
- 발주 이력/인사이트 API 오류 시 화면 상단에 원인 메시지를 표시하도록 개선했습니다.
- `/production/inventory-diagnosis` 화면을 재고율 기반 진단 화면으로 개편했습니다.
  - `summary/highlights/actions/evidence`를 렌더링하고, 품목별 `stock_rate`, `assumed_shelf_life_days`, `expiry_risk_level`을 함께 표시합니다.
- `/production/waste-loss` 화면을 D+1 보정 로스 기반으로 개편했습니다.
  - 보정 로스 금액, 실폐기 금액, 가설 유통기한 손실 수량을 분리 표시합니다.
- 생산 2개 화면에 API 에러(422/404) 원인 문구를 표시하도록 변경했습니다.
- `/production/inventory-diagnosis` API 오류(`not enough values to unpack`) 재발 방지를 위해 백엔드 응답 정규화 대응을 반영했습니다.
- 생산 화면 이미지 URL 정규화 로직을 보완했습니다.
  - `image_url`이 `images/...`, `/images/...`, 상대경로, 절대경로 형태로 내려와도 일관되게 렌더링하도록 수정했습니다.
- 재고 진단 API 호출에 `page`, `page_size`를 함께 전달하도록 수정해 백엔드 페이지네이션 계약과 정합화했습니다.

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

| 경로                | 화면                    | 연동 API                                                                                                                                                                                  |
| ------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                 | 시작 페이지 (역할 선택) | 세션 역할 선택                                                                                                                                                                            |
| `/dashboard`        | 홈 대시보드             | `/api/dashboard/notices`, `/api/home/schedule`, `/api/dashboard/alerts`, `/api/dashboard/summary-cards`                                                                                   |
| `/production`       | 생산 현황               | `/api/production/overview`, `/api/production/items`, `/api/production/items/{sku_id}`, `/api/production/registrations`                                                                    |
| `/ordering`         | 주문 관리               | `/api/ordering/options`, `/api/ordering/selections`                                                                                                                                       |
| `/sales`            | 매출 현황               | `/api/sales/insights`, `/api/sales/query`, `/api/sales/prompts`                                                                                                                           |
| `/analytics`        | 매출 조회               | `/api/analytics/metrics`, `/api/audit/logs`                                                                                                                                               |
| `/analytics/market` | 상권·고객 분석          | `/api/analytics/store-profile`, `/api/analytics/customer-profile`, `/api/analytics/sales-trend`, `/api/analytics/market-intelligence`, `/api/analytics/market-intelligence/weekly-report` |

## Session Update (2026-04-21, Backend-AI Interface)

- 프론트 코드 변경은 없습니다.
- backend↔ai 계약 보강으로 `sales/query`는 `store_id` 필수 계약이 강화되었습니다.
- AI 측에 `X-Request-Id` 추적 및 공통 에러 계약이 추가되어 장애 추적성이 개선되었습니다.

## Session Update (2026-04-21, Role-Based Market Insights)

- `/analytics/market` 화면에 역할별 상권 인사이트를 반영했습니다.
- 점주(`store_owner`)는 지점 중심 실행 인사이트(`key_insights`, `action_plan`)를 확인합니다.
- 본사(`hq_admin`)는 전체 지점 스코어보드(`risk_level`, `growth_rate`)를 한눈에 확인할 수 있습니다.

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
- 기본 환경값은 `VITE_DEFAULT_STORE_ID=POC_010`, `VITE_DEFAULT_REFERENCE_DATETIME=2026-03-05T00:00`입니다.
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

## Session Update (2026-04-22)

- Docker 환경에서 생산 화면 이미지 미노출 이슈는 backend의 `image_url` 공급 경로 문제였고, 프론트는 기존 `/images/...` 정적 경로를 그대로 사용합니다.

## Session Update (2026-04-23, sales metrics partial-data handling)

- `/sales/metrics`의 벤치마킹 쿼리는 유사 비교군이 없거나 일부 비교 매장 요약 조회가 실패해도 화면 전체 에러를 발생시키지 않고 `null`로 처리합니다.
- `/sales/metrics` 오류 배너에서 `유사 비교 매장을 찾을 수 없습니다.` 문구가 치명 오류로 누적되지 않도록 정비했습니다.
- 백엔드 `sales/insights`가 부분 데이터(예: 채널 데이터 부족)를 반환하면, 프론트 인사이트 카드는 `점검` 상태 섹션을 렌더링합니다.

## Session Update (2026-04-23, signals page/sidebar removal)

- `/signals` 라우트와 `SignalsPage` 엔트리를 제거했습니다.
- 사이드바 `본사` 섹션에서 `매출 시그널(monitoring)`, `시스템 설정(shield_lock)` 항목을 제거했습니다.
- `signals` 전용 프론트 모듈(`src/features/admin/signals/*`)과 `/signals` 전용 플로팅챗/breadcrumb 설정을 정리했습니다.

## Session Update (2026-04-23, HQ-as-owner golden queries)

- 본사 담당자가 점주 관점으로 시연/질의할 수 있도록 backend 문서 자산 `br-korea-poc-backend/docs/golden-queries-hq-as-owner.csv`가 추가되었습니다.
- 프론트 코드는 변경하지 않았으며, 설정/시연 시나리오에서 활용할 데이터 자산 연계 사실만 반영합니다.

## Session Update (2026-04-23, HQ queries dedup refresh)

- 본사 관점 질의셋(`golden-queries-hq-as-owner.csv`)이 기존 점주 질의셋과 의미 중복 0건 기준으로 전면 재작성되었습니다.
- 프론트 코드 변경은 없으며, 시연용 질의 자산의 품질 조건(무중복) 반영 사실만 기록합니다.
## Session Update (2026-04-23, HQ query simplification)

- 본사 관점 질문셋이 초기 시연용으로 짧고 쉬운 문장으로 단순화되었습니다.
- 프론트 코드 변경은 없으며 시연 질의 자산 문구 품질 개선 사항만 반영합니다.
## Session Update (2026-04-23, HQ query tone simplification)

- 본사 시연용 질문셋이 더 짧은 현장 말투로 개편되었습니다.
- 프론트 코드 변경 없이 데이터셋 문구 개선 사항만 반영합니다.
## Session Update (2026-04-23, HQ query concrete values)

- 시연용 HQ 골든쿼리의 SQL이 바인딩 변수 대신 실값 예시로 교체되었습니다.
- 프론트 코드 변경은 없고 데이터셋 사용성 개선 사항만 반영합니다.
## Session Update (2026-04-23, HQ query columns split)

- HQ 골든쿼리 CSV가 일반화/예시 SQL 2열 구조로 개편되었습니다.
- 프론트 코드는 변경하지 않았고 시연 데이터셋 가독성 개선만 반영합니다.

- 백엔드 문서 자산 `../br-korea-poc-backend/docs/golden-queries-new-02.csv`가 추가되었습니다.
  - 기준일시 UI/Action+Evidence 요구를 포함한 시연용 질문셋이며, 프론트 코드 변경 없이 설정/검증 참조 자산으로 연동합니다.
- `golden-queries-new-02.csv`는 파생 질문 포함 총 112건으로 확장되었습니다.
