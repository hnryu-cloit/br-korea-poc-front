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
- 기본 `.env.example`에는 `VITE_DEFAULT_STORE_ID=POC_012`이 포함되어 있어, 초기 접속 시 온라인/할인 KPI 검증이 가능한 점포 기준으로 조회합니다.
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
- 기본 `.env.example`은 `VITE_DEFAULT_STORE_ID=POC_012`를 사용합니다. 해당 점포는 최근 온라인 주문/할인결제 데이터가 있어 KPI 재현 확인에 유리합니다.

- 상권/고객 분석 화면의 글로벌 실패 메시지는 `market-intelligence` 메인 API 실패 기준으로만 표시됩니다. `store-profile`/`customer-profile`/`sales-trend` 일부 실패는 보조 데이터 결손으로 처리됩니다.

- 상권/고객 분석(`/analytics/market`)의 글로벌 실패 문구는 메인 `market-intelligence` 쿼리 실패 기준으로만 노출됩니다.

## Session Note (2026-04-21)

- 매출 질의 API(`POST /api/sales/query`)는 `store_id`를 필수로 전달해야 합니다.
- 상권 화면 인사이트는 backend API(`/api/analytics/market-intelligence/insights`, `/api/analytics/market-intelligence/insights/hq`)를 사용합니다.
