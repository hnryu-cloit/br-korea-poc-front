# Frontend Setup Guide

이 프로젝트는 Node.js 환경에서 실행됩니다.

## Prerequisites
- Node.js 20.x 이상
- npm 10.x 이상

## Installation
```bash
# 의존성 설치
npm install

# 개발 서버 실행 (포트 6003 설정 포함)
npm run dev -- --host 0.0.0.0 --port 6003
```

## 핵심 패키지
- **React 18**: UI 라이브러리
- **TypeScript**: 타입 시스템
- **React Query**: 서버 상태 관리 및 API 캐싱
- **Vite**: 고성능 빌드 도구
- **TailwindCSS**: 스타일링 (일부 커스텀 CSS 사용)
