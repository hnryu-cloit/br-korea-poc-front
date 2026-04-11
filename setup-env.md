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

## 핵심 패키지

- React 18
- TypeScript
- React Router DOM
- TanStack Query
- Vite
- Tailwind CSS 4
- Lucide React
