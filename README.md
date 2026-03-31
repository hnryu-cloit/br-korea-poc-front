# br-korea-poc-front

BR Korea 매장 운영 지원 AI 에이전트의 **점주용 웹 대시보드**입니다.

## ✨ Highlights
-   **AI Integration**: 매출 분석 챗봇, 지능형 재고 알림, 스마트 주문 추천 화면 구현.
-   **Dashboard**: 매장 현황, 생산 예측, 판매 추이 가시화.
-   **Performance**: Vite + React(TypeScript) 기반의 고성능 SPA.

## 🛠️ Tech Stack
-   **Frontend**: React 18, TypeScript
-   **State Management**: React Query (TanStack Query)
-   **Styling**: Vanilla CSS (TailwindCSS 사용 지양)
-   **UI Components**: 대시보드 및 채팅 인터페이스 커스텀 구현

## 🏗️ Structure
-   `src/app/`: 라우터 및 글로벌 프로바이더.
-   `src/components/`: 재사용 가능한 UI 컴포넌트 및 에이전트 위젯.
-   `src/features/`: 도메인별 데이터 로직.
-   `src/pages/`: 대시보드, 주문관리, 매출분석 등 전체 페이지.

## 🏁 Run
```bash
npm install
npm run dev
```
