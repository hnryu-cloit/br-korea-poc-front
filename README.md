# br-korea-poc-front

BR Korea 매장 운영 지원 POC의 프론트엔드 앱입니다. 현재 코드는 점주용 화면뿐 아니라 본사용 운영 화면까지 포함한 React 기반 운영 대시보드로 구성되어 있습니다.

## 현재 구현 범위

- 공통 앱 셸, 역할별 메뉴 제어, 알림 인박스
- 홈 대시보드
- 생산 현황
- 주문 관리
- 매출 현황
- 매출 조회
- 본사 주문 코칭
- 본사 생산 점검
- 시스템 현황
- 매출 시그널

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router DOM
- TanStack Query
- Tailwind CSS 4 기반 유틸리티 스타일 + 커스텀 CSS
- Lucide React

## Directory Structure

```text
src/                         # 프론트엔드 소스 루트
├── app/                     # 앱 라우터와 전역 프로바이더
│   ├── providers/           # React Query 등 공통 프로바이더
│   └── router.tsx           # 전체 페이지 라우팅 정의
├── assets/                  # 정적 에셋
├── components/              # 재사용 UI와 레이아웃 컴포넌트
│   ├── commons/             # 헤더, 사이드바, 플로팅 AI 패널
│   ├── layout/              # 앱 셸과 공통 레이아웃
│   └── ui/                  # 카드, 힌트, 인사이트 응답 UI
├── contexts/                # 데모 세션/역할 컨텍스트
├── data/                    # 내비게이션, 알림, 기본 콘텐츠 데이터
├── features/                # 기능 단위 보조 데이터
├── hooks/                   # bootstrap 등 공통 훅
├── lib/                     # API 클라이언트와 유틸리티
│   └── api.ts               # 백엔드 연동용 타입/요청 함수
├── pages/                   # 화면 단위 페이지
│   ├── DashboardPage.tsx    # 홈 대시보드
│   ├── ProductionPage.tsx   # 생산 현황
│   ├── OrderingPage.tsx     # 주문 관리
│   ├── SalesPage.tsx        # 매출 현황
│   ├── AnalyticsPage.tsx    # 매출 조회
│   ├── HQCoachingPage.tsx   # 본사 주문 코칭
│   ├── HQInspectionPage.tsx # 본사 생산 점검
│   ├── OrchestrationPage.tsx# 시스템 현황
│   └── SignalsPage.tsx      # 매출 시그널
├── App.tsx                  # 앱 진입 컴포넌트
├── main.tsx                 # React 마운트 엔트리
├── index.css                # 전역 스타일
└── styles.css               # 추가 공통 스타일
```

## 주요 라우트

- `/`: 홈
- `/production`: 생산 현황
- `/ordering`: 주문 관리
- `/sales`: 매출 현황
- `/analytics`: 매출 조회
- `/hq/coaching`: 본사 주문 코칭
- `/hq/inspection`: 본사 생산 점검
- `/orchestration`: 시스템 현황
- `/signals`: 매출 시그널

## 실행

```bash
npm install
npm run dev
```

- 기본 개발 서버 포트는 `5173`입니다.
- 백엔드 base URL은 `VITE_API_BASE_URL`로 지정할 수 있으며, 미지정 시 `http://localhost:8000`을 사용합니다.
