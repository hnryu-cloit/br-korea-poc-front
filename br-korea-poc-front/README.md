# br-korea-poc-front

> **전역 시스템 제약조건 및 코드 컨벤션**
> 본 프로젝트는 엔터프라이즈 B2B SaaS 아키텍처를 지향하며, 공통 코드 컨벤션을 따릅니다.
> 상세 기준은 상위 디자인 시스템 및 저장소 전역 컨벤션 문서를 우선 확인하세요.
> 주요 프론트엔드 제약: **Feature-Sliced Design, Strict TypeScript, Server State 표준화**

br-korea-poc 운영 화면의 MVP 초안입니다. 기획문서 기반 feature seed를 검토하고 우선순위를 빠르게 확인하는 데 목적이 있습니다.

## Summary

- 대상 사용자: 매장 점주: 생산, 주문, 매출 판단을 수행하는 최종 의사결정자, 매장 운영 담당자: 생산 등록과 재고 상황을 확인하는 실무 사용자, 본사 운영/기획 담당자: 모델 정확도, 운영 효율, 보안 정책 준수 여부를 검토하는 검증 사용자
- 핵심 가치: 점주가 감에 의존하던 생산과 주문 판단을 근거 기반 추천으로 전환한다. / 알림과 분석 결과를 실행 가능한 형태로 제공해 요약형…
- 주요 화면: 5분 단위로 생산 대상 품목 재고를 조회하고 현재 재고량을 화면과 AP…, 최근 판매 추세와 4주 평균 생산 패턴을 결합해 1시간 후 예상 재고량…, 재고 소진 1시간 전에 생산 필요 시점을 자동 감지하고 PUSH 알림을…

## Tech Stack

- React 18
- TypeScript
- Vite
- Routing: `react-router-dom`
- Data Fetching: `@tanstack/react-query`
- Styling: CSS 기반 MVP 스타일
- UI: `AppShell`, `FeatureCard`

## Project Structure

- `src/app/router.tsx`: 라우팅 진입점
- `src/app/providers/query-client.ts`: 서버 상태 기본 설정
- `src/pages/DashboardPage.tsx`: MVP 메인 화면
- `src/features/feature-data.ts`: 기획문서 기반 feature seed
- `src/hooks/use-bootstrap.ts`: bootstrap 조회 훅
- `src/lib/api.ts`: 백엔드 bootstrap API 연동
- `src/components/layout/AppShell.tsx`: 앱 셸
- `src/components/ui/FeatureCard.tsx`: 범용 카드 UI
- `src/styles.css`: MVP 스타일

## Conventions

- 페이지와 기능의 책임을 분리합니다.
- API 연동은 `lib`와 `hooks` 계층을 통해 호출합니다.
- AI UI는 결과, 상태, 검토 액션이 함께 보이도록 유지합니다.
- 스타일 토큰과 화면 컴포넌트 책임을 섞지 않습니다.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Lint And Test

```bash
npm run lint  # 선택
npm run test  # 선택
npm run test:e2e  # 선택
```

## Environment

- `.env.example` 제공
- `VITE_API_BASE_URL`로 API base URL 분리

## Review Points

- 주요 사용자 흐름이 README와 화면 구조에 연결되는가
- 라우팅, 데이터 조회, 표시 컴포넌트 책임이 분리되는가
- 실행과 빌드 방법이 누락되지 않았는가
