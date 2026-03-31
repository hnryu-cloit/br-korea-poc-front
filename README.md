# br-korea-poc-front

br-korea-poc 운영 화면의 MVP 프런트엔드입니다. 생산 관리, 주문 관리, 매출 분석, 오케스트레이션/보안 검증 화면을 하나의 데모 경험으로 제공합니다.

## Tech Stack

- React 18
- TypeScript
- Vite
- `react-router-dom`
- `@tanstack/react-query`
- Tailwind CSS

## Project Structure

- `src/app`: 앱 엔트리, 라우터, provider
- `src/components`: layout, commons, ui 컴포넌트
- `src/pages`: 화면 단위 페이지
- `src/data`: 데모 데이터와 네비게이션 정의
- `src/lib`: 공용 유틸과 API helper
- `src/contexts`: 세션/역할 컨텍스트

## Front Conventions

이 프로젝트는 `/Users/hanna/Documents/agentgo-creative/agentgo-creative-front`의 코드 컨벤션을 기준으로 맞춥니다.

### Tooling

- `lint`는 `tsc --noEmit`가 아니라 `eslint .`를 사용합니다.
- ESLint는 flat config(`eslint.config.js`)를 사용합니다.
- TypeScript는 `tsconfig.json`에서 `tsconfig.app.json`, `tsconfig.node.json`을 참조하는 구조를 사용합니다.
- 경로 alias는 `@/* -> src/*`를 사용합니다.

### Code Style

- import는 `double quote`와 `semicolon`을 사용합니다.
- 앱 엔트리에서는 `StrictMode`, `createRoot` 패턴을 사용합니다.
- 컴포넌트는 가능하면 named export를 우선하고, 앱 엔트리는 `export const App` 형태를 사용합니다.
- 신규 import는 상대경로보다 `@/` alias를 우선합니다.
- 페이지는 화면 조합 책임을 가지며, 공용 상태/도메인 로직은 `lib`, `contexts`, `data` 또는 별도 계층으로 분리합니다.

### Examples

- `import { router } from "@/app/router";`
- `import { AppLayout } from "@/components/layout/AppLayout";`
- `export const App: React.FC = () => { ... }`

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Notes

- 기존 파일 중 일부는 아직 상대경로 import를 사용하고 있을 수 있습니다.
- 신규 코드와 수정 코드부터는 위 컨벤션을 우선 적용합니다.
