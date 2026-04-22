# Frontend Setup Guide

이 프로젝트는 Node.js 환경에서 실행됩니다.

## Prerequisites

- Node.js 20.x 이상
- npm 10.x 이상

## Installation

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 실행 메모

- 기본 개발 서버 포트는 `5173`입니다.
- 다른 포트로 실행하려면 예를 들어 아래처럼 실행할 수 있습니다.

```bash
npm run dev -- --host 0.0.0.0 --port 6003
```

- 백엔드 base URL은 `VITE_API_BASE_URL` 환경변수로 지정할 수 있습니다.
- 기본 환경값은 `VITE_DEFAULT_STORE_ID=POC_010`으로 설정되어 초기 점포가 `POC 010`으로 고정됩니다.
- 기준 일시 기본값은 `VITE_DEFAULT_REFERENCE_DATETIME=2026-03-05T00:00`입니다. (UI에서 변경 가능)
- 매출 질의는 1차 응답 이후 `GET /api/explainability/{trace_id}` 폴링으로 액션/근거가 후속 갱신됩니다.
- 소진공 빅데이터 OpenAPI 인증키는 프론트에서 직접 사용하지 않습니다. `br-korea-poc-backend/.env`에만 설정합니다.

## 백엔드 API 키 연동 메모

프론트는 `VITE_API_BASE_URL`로 백엔드 API만 호출합니다. 따라서 아래 외부 API 인증키는 백엔드 `.env`에 설정되어야 합니다.

- `SBIZ_API_SNS_ANALYSIS_KEY`
- `SBIZ_API_STARTUP_WEATHER_KEY`
- `SBIZ_API_HOTPLACE_KEY`
- `SBIZ_API_SALES_INDEX_KEY`
- `SBIZ_API_BUSINESS_DURATION_KEY`
- `SBIZ_API_STORE_STATUS_KEY`
- `SBIZ_API_COMMERCIAL_MAP_KEY`
- `SBIZ_API_DETAIL_ANALYSIS_KEY`
- `SBIZ_API_DELIVERY_ANALYSIS_KEY`
- `SBIZ_API_TOUR_FESTIVAL_KEY`
- `SBIZ_API_SIMPLE_ANALYSIS_KEY`

상권 인텔리전스 경쟁사 조회 기준:

- 1순위: `EXTERNAL_API_KEY`
- 2순위 대체: `SBIZ_API_COMMERCIAL_MAP_KEY`
- 3순위 대체: `SBIZ_API_STORE_STATUS_KEY`

`GET /api/analytics/market-intelligence`의 `store_reports`는 위 11개 키 설정 상태를 `실호출 미확인/키 미설정`으로 표시하며, 실제 경쟁사 조회에 사용된 소스(`EXTERNAL_API_KEY` 또는 `SBIZ_API_COMMERCIAL_MAP_KEY`/`SBIZ_API_STORE_STATUS_KEY`)는 `연동중` 상태로 표시됩니다.

## 핵심 패키지

- React 18
- TypeScript
- React Router DOM
- TanStack Query
- Vite
- Tailwind CSS 4
- Lucide React

- 실호출 상태 점검 대상: `snsAnaly`, `hpReport`, `delivery`, `tour`, `storSttus`, `slsIdex`

- 주간 분석 리포트 다운로드는 `GET /api/analytics/market-intelligence/weekly-report` 엔드포인트를 사용하며, 현재 필터 스코프(구/동/업종/연도/분기/반경) 기준으로 기본 PDF 파일(옵션: markdown)을 생성합니다.
- 상권/고객 분석 데이터는 백엔드에서 합성값 없이 실데이터만 반환합니다. 요청 연도/분기 데이터가 없으면 동일 스코프의 가용 실데이터(연도/분기 조건 제외)로 자동 폴백됩니다.
- 상권/고객 분석 화면은 `업종 분석`, `매출 분석`, `인구 분석`, `지역현황`, `고객특성` 5개 블록으로 구성되며, 원천 데이터 미제공 항목은 `미제공`으로 표시됩니다.
- 고객 식별 컬럼이 백엔드 원천 테이블에 추가되면 신규/단골 비율은 백엔드 자동탐지 템플릿으로 계산되어 프론트에 자동 반영됩니다.
- `ordering/history`는 `store_id`를 필수로 전달하며, 누락/오입력은 백엔드에서 4xx로 반환됩니다. QA 검증 시 `VITE_DEFAULT_STORE_ID`를 실제 `masked_stor_cd` 값으로 설정해 사용하세요.
- 기본값은 `VITE_DEFAULT_STORE_ID=POC_010`, `VITE_DEFAULT_REFERENCE_DATETIME=2026-03-05T00:00`를 사용합니다.

- 상권/고객 분석 화면의 글로벌 실패 메시지는 `market-intelligence` 메인 API 실패 기준으로만 표시됩니다. `store-profile`/`customer-profile`/`sales-trend` 일부 실패는 보조 데이터 결손으로 처리됩니다.

- 상권/고객 분석(`/analytics/market`)의 글로벌 실패 문구는 메인 `market-intelligence` 쿼리 실패 기준으로만 노출됩니다.

## Session Note (2026-04-21)

- 매출 질의 API(`POST /api/sales/query`)는 `store_id`를 필수로 전달해야 합니다.
- 상권 화면 인사이트는 backend API(`/api/analytics/market-intelligence/insights`, `/api/analytics/market-intelligence/insights/hq`)를 사용합니다.
- 재고 진단 화면(`/production/inventory-diagnosis`)은 백엔드 `GET /api/production/inventory-status` 응답을 사용하며, 서버 패치 이후 언패킹 오류(`expected 3, got 2`)가 발생하지 않아야 합니다.

## Session Note (2026-04-22)

- `/production/waste-loss`, `/production/inventory-diagnosis` 응답 지연 완화를 위해 프론트 쿼리 캐시 정책을 조정했습니다.
  - `staleTime: 60초`, `gcTime: 5분`, `refetchOnWindowFocus: false`
  - 재고 진단 쿼리는 페이지 상태(`page`)를 실제 API 호출에 연결해 페이지네이션 동작을 정합화했습니다.
- 로컬 확인 기준 URL
  - `http://localhost:6003/production/waste-loss`
  - `http://localhost:6003/production/inventory-diagnosis`

## Session Note (2026-04-22, analytics no-fallback)

- `/analytics` 화면에서 사용하는 `GET /api/analytics/metrics`, `GET /api/analytics/sales-trend`는 fallback 데이터 대신 오류를 반환하도록 backend 정책이 변경되었습니다.
- `store_id`가 유효하지 않으면 metrics API는 422를 반환합니다.

## Session Note (2026-04-22, sales metrics no-fallback)

- `/sales/metrics`는 fallback 수치 조합을 사용하지 않습니다.
- `GET /api/sales/summary`, `GET /api/sales/insights`, `GET /api/sales/campaign-effect` 실데이터가 없거나 오류이면 화면 상단에 오류 배너가 표시되고 기회영역 카드는 렌더링하지 않습니다.

## Session Note (2026-04-22, ordering history insights RAG)

- `/ordering/history` 이상징후 섹션은 `GET /api/ordering/history/insights` 결과를 사용합니다.
- 해당 API는 backend(6002)와 ai service가 함께 실행되어야 하며, AI 미기동 시 502가 반환됩니다.

## Session Note (2026-04-22, production status deadline display)

- `/production/status`의 `주문 마감 시간`은 고정값이 아니라 `GET /api/ordering/deadline` 응답값으로 렌더링됩니다.
- backend(6002)가 미기동이면 해당 컬럼은 `-`로 표시되고 다른 조회도 실패할 수 있습니다.

## Session Note (2026-04-22, analytics/sales RAG+Gemini no-fallback)

- `/analytics/market` 인사이트 응답은 `source="ai"`만 허용하며 fallback 응답을 사용하지 않습니다.
- `/sales/metrics`의 추천 질문/인사이트/캠페인 서술형은 backend+ai service 연동이 필요하며, AI 실패 시 오류로 반환됩니다.
- 프론트 쿼리 정책은 UI 변경 없이 `45초` 폴링(`market insights`, `sales summary/insights/campaign/prompts`)으로 백그라운드 갱신을 반영합니다.

## Session Note (2026-04-22, QA 병렬 회차)

- QA 기준 자동 점검은 아래 명령으로 실행했습니다.
  - `br-korea-poc-front`: `npm test`
  - `br-korea-poc-backend`: `PYTHONPATH=. pytest -q tests/test_system_integration.py tests/test_health.py::test_sales_prompts tests/test_health.py::test_ordering_selection_save`
  - `br-korea-poc-ai`: `pytest -q tests/test_quality_scenarios.py::test_data_extraction_total_sales_intent tests/test_quality_scenarios.py::test_data_extraction_peak_hours_intent tests/test_quality_scenarios.py::test_data_extraction_top_items_intent tests/test_quality_scenarios.py::test_data_extraction_profitability_standard_margin`

## Session Note (2026-04-22, Settings Page v3)

- 본사 역할(`hq_admin`) 선택 후 진입하는 `/settings` 메인 화면이 `Settings Page v3` 구조로 개편되었습니다.
- 로컬 확인 경로
  - `http://localhost:5173/` → `본사` 선택 → `/settings`
  - 직접 진입: `http://localhost:5173/settings`

## Session Note (2026-04-23, sidebar logo navigation)

- 사이드바 상단 `AgentGo Biz` 로고 클릭 시 현재 역할 홈이 아니라 역할 선택 대문(`/`)으로 이동합니다.
- 로컬 확인 경로
  - `http://localhost:5173/dashboard` 또는 `http://localhost:5173/settings` 진입
  - 사이드바 로고 클릭
  - `http://localhost:5173/`에서 점주/본사 선택 카드 노출 확인

## Session Note (2026-04-23, settings v3 shell alignment)

- `/settings` 화면의 셸(UI 프레임)을 제공 기준 HTML(`설정 v3 – Biz Dunkin' 관리자`) 구조에 맞춰 정렬했습니다.
  - 상단 `Biz DUNKIN' / 시스템 설정` 헤더 바
  - 좌측 216px 설정 내비(그룹 라벨/active/hover/pill 톤)
  - 메인 배경/보더/간격 토큰 정합
- 로컬 확인 경로
  - `http://localhost:5173/settings`
  - `http://localhost:5173/settings/orchestration`
  - `http://localhost:5173/settings/prompts`

## Session Note (2026-04-23, settings v3 full panel refactor)

- `/settings`의 내부 패널과 모달을 제공 원본 HTML(`설정 v3 – Biz Dunkin' 관리자`) 기준으로 재작성했습니다.
  - 패널: Agent 레지스트리, 오케스트레이션, 데이터 커넥터, RBAC, AI 프롬프트, 골든 쿼리, 감사 로그, 품질, 공지사항
  - 모달: 신규 Agent, Agent 설정, 라우팅 규칙, 권한 매트릭스, 멤버 초대, 테스트 콘솔, 임베딩 스케줄/즉시 실행, 공지 상세
- 로컬 확인 경로
  - `http://localhost:5173/settings`
  - 좌측 메뉴 전환으로 각 패널 UI 확인
  - 프롬프트/골든쿼리/감사로그에서 입력·필터 인터랙션 확인

## Session Note (2026-04-23, vibe coding guide alignment)

- settings 패널 컴포넌트에서 상태/필터/목업 데이터 로직을 분리해 `VIBE_CODING_GUIDE`의 역할 분리 원칙을 보강했습니다.
  - 상태/필터 훅: `useAuditPanel`, `useRbacPanel`, `useGoldenQueriesPanel`, `usePromptTestConsole`
  - 목업 데이터 통합: `src/features/admin/orchestration/mockdata/mock-orchestration.ts`
- 확인 명령
  - `cd br-korea-poc-front && npm run build`

## Session Note (2026-04-23, sales metrics partial-data recovery)

- `/sales/metrics`에서 `GET /api/sales/insights`가 일부 섹션 데이터 부족이어도 백엔드는 404 대신 부분 응답(점검 섹션 포함)을 반환합니다.
- 벤치마킹(`useGetSalesBenchmarkQuery`)은 비교군 부재 또는 일부 비교 매장 요약 조회 실패 시 에러를 던지지 않고 `null`로 처리합니다.
- 기본 점포 `POC_010`에서도 요약 차트/인사이트 카드가 함께 표시되는지 확인하세요.

## Session Note (2026-04-23, signals route removed)

- `/signals` 라우트는 제거되었습니다.
- 사이드바에서는 `본사` 섹션의 `매출 시그널`, `시스템 설정` 메뉴를 표시하지 않습니다.
- 확인 경로
  - `http://localhost:6003/dashboard` 진입 후 사이드바 확인
  - 직접 진입 `http://localhost:6003/signals` 시 라우트 미정의 상태 확인
