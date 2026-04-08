# br-korea-poc-front

BR Korea 매장 운영 지원 AI 에이전트의 점주용 웹 대시보드입니다.

## 개요
- React + TypeScript + Vite 기반 SPA입니다.
- 점주용 핵심 업무를 `홈 / 생산관리 / 주문관리 / 손익분석` 흐름으로 다룹니다.
- 라우트 엔트리는 `pages`, 실제 화면 구현은 `features`, 공통 UI는 `components/common`, 공용 인프라는 `services / providers / router / lib`로 분리했습니다.

## 기술 스택
- React 18
- TypeScript
- React Router
- TanStack Query
- Vite

## 아키텍처 원칙
- `pages`는 라우트 엔트리만 담당합니다.
- 실제 화면 구성과 비즈니스 로직은 각 `feature` 내부에 둡니다.
- 여러 페이지에서 재사용되는 UI만 `components/common`에 둡니다.
- `components/ui`는 shadcn/ui 전용 자리로 비워 두었습니다.
- HTTP 클라이언트는 feature 내부에 두지 않고 [src/services/axiosInstance.ts](/home/hyeonjeong/projects/br-korea-poc-front/src/services/axiosInstance.ts)로 분리했습니다.
- 전역 상태성 기능 중 화면 도메인과 직접 연결되는 것은 해당 feature에 둡니다.

## 현재 디렉토리 구조
```text
src/
├── assets/
├── commons/
│   └── constants/
├── components/
│   ├── common/
│   │   ├── chat/
│   │   ├── layout/
│   │   └── page/
│   └── ui/
├── features/
│   ├── analytics/
│   │   ├── api/
│   │   ├── screens/
│   │   └── types/
│   ├── dashboard/
│   │   └── screens/
│   ├── notifications/
│   │   ├── api/
│   │   └── types/
│   ├── ordering/
│   │   └── screens/
│   ├── production/
│   │   └── screens/
│   ├── sales/
│   │   └── screens/
│   ├── session/
│   │   ├── constants/
│   │   ├── context/
│   │   └── hooks/
│   └── admin/
│       ├── hq-coaching/
│       │   ├── api/
│       │   ├── screens/
│       │   └── types.ts
│       ├── hq-inspection/
│       │   ├── api/
│       │   ├── screens/
│       │   └── types.ts
│       ├── orchestration/
│       │   └── screens/
│       └── signals/
│           ├── api/
│           ├── screens/
│           └── types.ts
├── lib/
│   ├── queryClient.ts
│   └── utils.ts
├── pages/
├── providers/
│   └── QueryProvider.tsx
├── router/
│   └── index.tsx
├── services/
│   └── axiosInstance.ts
├── App.tsx
├── main.tsx
└── index.css
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

## 실행
```bash
npm install
npm run dev
```

## 검증
```bash
npm run build
```
