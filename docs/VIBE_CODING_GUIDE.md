# 바이브코딩 가이드

## 목적

이 문서는 프로젝트 내 폴더 구조와 파일 배치 기준을 일관되게 유지하기 위한 가이드이다.

목표는 다음과 같다.

- 파일 책임을 명확하게 분리한다.
- 공통 자산과 feature 전용 자산이 섞이지 않도록 한다.
- 리팩토링 시 파일 이동 기준을 명확하게 한다.
- 신규 기능 추가 시 팀원마다 다른 기준으로 폴더를 생성하지 않도록 한다.
- AI를 활용한 코드 생성 및 리팩토링 작업 시에도 동일한 구조 원칙을 유지한다.

---

## 기본 원칙

### 1. 공통과 전용을 명확히 구분한다

- 하나의 feature 안에서만 사용하는 파일은 해당 feature 내부에 둔다.
- 두 개 이상의 feature에서 재사용되고, 특정 도메인에 종속되지 않는 파일만 `commons`로 이동한다.
- 공통처럼 보이더라도 실제 사용처가 하나뿐이면 우선 feature 내부에 둔다.

### 2. 파일은 역할에 맞는 위치에 둔다

- UI 컴포넌트는 `components`
- 훅은 `hooks`
- 타입은 `types`
- 상수는 `constants`
- API 호출은 `api`
- query 관련 로직은 `queries`
- feature 내부에서만 쓰는 유틸은 해당 feature의 `utils`
- 전역 설정, 라이브러리 초기화, 인프라 성격 파일은 `lib` 또는 `services`

### 3. 폴더 구조보다 배치 기준이 더 중요하다

같은 이름의 폴더를 만든다고 해서 구조가 정리되는 것은 아니다.
각 파일이 **왜 그 위치에 있어야 하는지** 설명 가능해야 한다.

### 4. barrel export는 사용하지 않는다

- `index.ts`를 통해 export를 모아두지 않는다.
- import 경로가 길어지더라도 명시적인 경로 import를 사용한다.
- 파일 이동 시 참조 관계를 더 쉽게 추적하기 위함이다.

### 5. api 함수명은 HTTP 메서드 기준으로 작성한다

- `GET` 호출은 `get...`
- `POST` 호출은 `post...`
- `PUT` 호출은 `put...`
- `PATCH` 호출은 `patch...`
- `DELETE` 호출은 `delete...`

예시:

- `getDashboardOverview`
- `getNotifications`
- `postSalesQuery`
- `postProductionRegistration`

`fetch`, `create`, `save`, `load` 같은 혼합 규칙은 사용하지 않는다.

### 6. api / types 파일명도 도메인 기준으로 맞춘다

폴더만 `api`, `types`로 만들고 파일을 루트에 따로 두지 않는다.

예시:

```text
features
└── analytics
    ├── api
    │   └── analytics.ts
    └── types
        └── analytics.ts
```

다음 구조는 금지한다.

```text
features
└── analytics
    ├── api.ts
    ├── types.ts
    ├── api
    └── types
```

### 7. screen 파일은 화면 조합만 담당하고, 화면 구역은 components로 분리한다

하나의 `screen` 파일 안에 화면의 모든 UI 블록과 보조 컴포넌트를 몰아넣지 않는다.
프론트 화면은 퍼블리싱 단위로 구역이 나뉘므로, 코드도 같은 기준으로 나누어 관리한다.

원칙:

- `screens/*Screen.tsx` 는 페이지 진입점 역할만 담당한다.
- screen 파일에는 데이터 조회, 상태 조합, 섹션 배치 정도만 남긴다.
- 화면의 각 영역은 `components` 아래 별도 파일로 분리한다.
- 하나의 파일에서 hero, filter, table, summary card, modal, panel, empty state까지 전부 같이 선언하지 않는다.
- screen 내부에서만 잠깐 쓰는 작은 JSX 조각이라도 재사용 가능성이나 길이가 생기면 바로 분리한다.
- "이 화면에서만 쓰니까 screen 파일 안에 같이 둔다"가 기본값이 아니라, "이 화면에서만 쓰더라도 section 단위로 components에 둔다"가 기본값이다.

예시:

```text
features
└── production
    ├── screens
    │   └── ProductionScreen.tsx
    └── components
        ├── ProductionHero.tsx
        ├── ProductionAlertsSection.tsx
        ├── ProductionTableSection.tsx
        └── ProductionRegistrationPanel.tsx
```

잘못된 예시:

- `ProductionScreen.tsx` 안에 `Hero`, `AlertCard`, `TableSection`, `ModalPanel` 을 모두 내부 컴포넌트로 선언하는 구조
- `DashboardScreen.tsx` 안에 카드, 섹션, CTA 블록, 채팅 패널을 전부 한 파일에서 처리하는 구조

좋은 기준:

- 디자이너나 퍼블리셔가 화면을 구역으로 나눠 설명할 수 있다면, 코드도 그 구역 단위로 파일이 나뉘어야 한다.
- 파일을 열었을 때 screen은 "무엇을 배치했는지"가 보여야 하고, 각 component 파일에서는 "그 구역이 어떻게 그려지는지"가 보여야 한다.

### 8. UI 로직과 비즈니스 로직은 분리할 수 있으면 분리한다

기존 코드 전체를 한 번에 이 원칙으로 되돌리는 것은 비용이 크다.
따라서 이 규칙은 **앞으로 추가하거나 수정하는 작업부터 우선 적용**한다.

원칙:

- UI 컴포넌트는 가능한 한 렌더링과 사용자 인터랙션 표현에 집중한다.
- 데이터 가공, 분기 규칙, 폼 계산, 필터 조합, API 호출 조합 같은 비즈니스 로직은 screen이나 component 내부에 길게 남기지 않는다.
- 분리 가능한 로직은 `hooks`, `queries`, `utils` 등으로 이동한다.
- React를 사용하는 장점을 살려, 화면 상태와 도메인 규칙이 함께 움직이는 경우는 custom hook으로 분리하는 것을 우선 검토한다.
- 무조건 억지로 나누지는 않지만, screen/component 가 길어지거나 조건 분기가 많아지면 분리를 기본 선택으로 본다.

권장 예시:

- 조회와 캐싱은 `queries`
- 화면 전용 상태 조합과 액션 핸들링은 `hooks`
- 순수 계산과 변환은 `utils`
- UI 출력은 `components`

예시:

```text
features
└── sales
    ├── components
    │   ├── SalesChatPanel.tsx
    │   └── SalesInsightCards.tsx
    ├── hooks
    │   └── useSalesChat.ts
    ├── queries
    │   └── useSalesInsightsQuery.ts
    ├── utils
    │   └── sales-response.ts
    └── screens
        └── SalesScreen.tsx
```

잘못된 예시:

- `Screen.tsx` 하나에 API 호출, 응답 정규화, 권한 분기, 계산 로직, UI 섹션 선언이 전부 같이 들어있는 구조
- 재사용 가능한 상태 로직인데도 여러 screen/component 에 복사해서 붙여넣는 구조

좋은 기준:

- screen 을 읽을 때 "이 화면이 어떤 데이터와 컴포넌트로 구성되는지"가 먼저 보여야 한다.
- component 를 읽을 때는 "이 UI가 어떻게 보이는지"가 보여야 한다.
- 비즈니스 규칙을 설명해야 하는 코드가 많아지면 UI 파일 밖으로 빼는 쪽을 우선 검토한다.

---

## 권장 루트 구조

```text
src
├── assets
├── commons
│   ├── components
│   ├── hooks
│   ├── utils
│   ├── constants
│   ├── types
├── components
│   └── ui
├── features
│   ├── analytics
│   │   ├── api
│   │   │   └── analytics.ts
│   │   ├── screens
│   │   └── types
│   │       └── analytics.ts
│   ├── dashboard
│   │   ├── api
│   │   │   └── dashboard.ts
│   │   ├── components
│   │   ├── mockdata
│   │   ├── queries
│   │   ├── screens
│   │   └── types
│   │       └── dashboard.ts
│   ├── production
│   │   ├── api
│   │   │   └── production.ts
│   │   ├── queries
│   │   ├── components
│   │   ├── hooks
│   │   ├── constants
│   │   ├── types
│   │   │   └── production.ts
│   │   ├── utils
│   │   ├── screens
│   │   └── mockdata
│   └── ordering
│       ├── screens
│       ├── types
│       │   └── ordering.ts
│       └── components
├── lib
│   ├── queryClient.ts
│   ├── tokenManager.ts
│   └── utils.ts
├── services
│   ├── axiosInstance.ts
│   └── type.ts
├── pages
├── providers
├── router.tsx
└── styles
```

위 구조는 예시이며, 프로젝트 성격에 따라 일부 폴더는 생략 가능하다.
중요한 것은 **파일 책임에 맞는 위치를 유지하는 것**이다.

---

## components/ui 폴더 가이드

`components/ui` 폴더는 유지한다. 이 폴더는 일반 공통 컴포넌트 보관소가 아니라, **shadcn/ui 컴포넌트 전용 폴더**로 사용한다.
현재 shadcn 컴포넌트가 없다면 비어 있어도 된다.

### 원칙

- 해당 폴더에는 shadcn/ui 기반 컴포넌트 파일만 둔다.
- 프로젝트에서 직접 만든 공통 컴포넌트는 `commons/components`에 둔다.
- 특정 feature 전용 컴포넌트는 각 `features/{feature}/components`에 둔다.
- `components/ui`를 공통 컴포넌트 저장소처럼 사용하지 않는다.

### 넣어도 되는 것

- `button.tsx`
- `dialog.tsx`
- `input.tsx`
- `dropdown-menu.tsx`
- `sheet.tsx`

즉, shadcn CLI 또는 shadcn 규칙에 따라 관리되는 UI primitive 성격의 파일만 허용한다.

### 넣으면 안 되는 것

- 팀에서 직접 만든 비즈니스 공통 컴포넌트
- 페이지 전용 조합 컴포넌트
- feature 전용 컴포넌트
- 도메인 로직이 섞인 UI 컴포넌트

### 잘못된 예시

```text
components
└── ui
    ├── button.tsx
    ├── CommonHeader.tsx
    └── ProductionFilterBar.tsx
```

위 예시는 잘못된 구조이다.

- `button.tsx`는 shadcn 컴포넌트이므로 유지 가능
- `CommonHeader.tsx`는 `commons/components`로 이동해야 함
- `ProductionFilterBar.tsx`는 `features/production/components`로 이동해야 함

### 올바른 예시

```text
components
└── ui
    ├── button.tsx
    ├── dialog.tsx
    └── input.tsx

commons
└── components
    └── CommonHeader.tsx

features
└── production
    └── components
        └── ProductionFilterBar.tsx
```

### 정리

- `components/ui`: shadcn 전용
- `commons/components`: 프로젝트 공통 컴포넌트
- `features/*/components`: feature 전용 컴포넌트

---

## commons 폴더 가이드

`commons`는 여러 feature에서 실제로 재사용되는 파일만 두는 공간이다.

### 넣어도 되는 것

#### `commons/components`

여러 feature에서 공통으로 사용하는 UI 컴포넌트

예시:

- `CommonModal.tsx`
- `Pagination.tsx`
- `EmptyState.tsx`
- `ConfirmDialog.tsx`

#### `commons/hooks`

도메인에 종속되지 않고 재사용 가능한 훅

예시:

- `useDebounce.ts`
- `useDisclosure.ts`
- `useIntersectionObserver.ts`

#### `commons/utils`

범용 포맷팅, 변환, 검사 함수

예시:

- `formatDate.ts`
- `formatNumber.ts`
- `truncateText.ts`
- `downloadFile.ts`

#### `commons/constants`

앱 전체에서 공통으로 쓰는 상수

예시:

- `pagination.ts`
- `routePaths.ts`
- `storageKeys.ts`

#### `commons/types`

도메인에 묶이지 않는 공통 타입

예시:

- `common.ts`
- `pagination.ts`
- `select-option.ts`

공통 타입을 루트 `src/type` 같은 별도 폴더에 두지 않는다.
공통 타입은 `src/commons/types` 아래에 둔다.

### 넣으면 안 되는 것

- 특정 feature에서만 사용하는 컴포넌트
- 특정 feature API 응답 타입
- 특정 feature 전용 비즈니스 유틸
- 임시로 여러 곳에서 복붙해서 쓰고 있는 코드

### 잘못된 예시

```text
commons
└── utils
    └── getOrderingStatusLabel.ts
```

위 함수가 ordering feature에서만 사용된다면 `commons`에 두면 안 된다.

### 올바른 예시

```text
features
└── ordering
    └── utils
        └── getOrderingStatusLabel.ts
```

---

## 루트에 utils, hooks를 둘지 commons에 둘지

이 프로젝트에서는 공용 자산을 루트에 흩어 놓지 않고 `commons` 하위에 모으는 방식을 권장한다.

### 권장

```text
src
└── commons
    ├── hooks
    └── utils
```

### 비권장

```text
src
├── hooks
├── utils
└── commons
```

### 이유

- 공용 자산의 위치가 명확해진다.
- feature 전용 파일과 공용 파일의 경계가 분명해진다.
- 신규 팀원이나 AI가 구조를 해석하기 쉬워진다.
- 공용 자산 탐색 경로가 일관된다.

따라서 `hooks`, `utils`, `constants`, `types` 등은 공용이라면 `commons` 아래에 둔다.

---

## lib 폴더 가이드

`lib`는 공용 유틸을 모아두는 폴더가 아니다.
이 폴더는 **앱 전역 설정**, **토큰/캐시 같은 인프라 보조 로직**, **전역 헬퍼**만 두는 공간으로 사용한다.
HTTP 클라이언트 설정처럼 서비스 계층 성격이 분명한 파일은 `services`로 분리할 수 있다.

### 넣어도 되는 것

- `axiosInstance.ts`
- `queryClient.ts`
- `storage.ts`
- `dayjs.ts`
- `i18n.ts`
- `tokenManager.ts`

### 설명

- `axiosInstance.ts`: 공통 axios 설정, interceptors, baseURL 관리
- `queryClient.ts`: React Query 전역 설정
- `storage.ts`: localStorage / sessionStorage 래퍼
- `dayjs.ts`: dayjs plugin 초기화
- `tokenManager.ts`: 인증 토큰 보관/조회/삭제

### 넣지 않는 것

- feature 전용 API 함수
- 공통 컴포넌트
- 공통 비즈니스 유틸
- feature 전용 상수나 타입

### 잘못된 예시

```text
lib
├── api.ts
├── useOrderingFilter.ts
└── formatOrderStatus.ts
```

### services 폴더

`services`는 네트워크/서비스 계층에 가까운 파일을 두는 공간이다.

예시:

- `axiosInstance.ts`
- `type.ts`

API endpoint별 함수는 `services`가 아니라 각 feature의 `api/{feature}.ts`로 둔다.

---

## 추가 규칙

### 공통 타입과 feature 타입을 섞지 않는다

- 여러 feature에서 공통으로 쓰는 타입만 `commons/types`
- 특정 도메인의 요청/응답 타입은 해당 feature의 `types/{feature}.ts`

예시:

- `NotificationCategory`가 알림 외에서도 공통 개념이면 `commons/types/common.ts`
- `HQInspectionResponse`는 `features/admin/hq-inspection/types/hq-inspection.ts`

### feature 루트에 우회용 re-export 파일을 두지 않는다

다음과 같은 파일은 만들지 않는다.

- `features/foo.ts`
- `features/foo/api.ts`
- `features/foo/types.ts`
- `src/data/session-user.ts` 같은 단순 re-export shim

항상 실제 파일 경로를 직접 import 한다.

위 파일들은 `lib`에 둘 성격이 아니다.

### 올바른 예시

```text
lib
├── axiosInstance.ts
└── queryClient.ts

features
└── ordering
    ├── api
    │   └── fetchOrderingList.ts
    ├── hooks
    │   └── useOrderingFilter.ts
    └── utils
        └── formatOrderStatus.ts
```

---

## feature 폴더 가이드

각 feature 폴더는 해당 도메인과 관련된 UI, API, 상태, 타입, 훅, 상수 등을 한 곳에 모은다.

예시:

```text
src/features/production
├── api
├── queries
├── constants
├── types
├── components
├── hooks
├── utils
└── data
```

### 각 폴더 역할

#### `api`

서버 통신 함수 파일을 관리한다.

이 프로젝트에서는 feature 내부 `api` 폴더 안에 요청 함수 파일을 여러 개 쪼개지 않고, **도메인 단위로 하나의 파일에 모으는 방식**을 권장한다.

예시:

- `production.ts`
- `ordering.ts`
- `dashboard.ts`

#### `queries`

React Query 관련 파일을 관리한다.

이 프로젝트에서는 query / mutation 훅 이름도 API 함수명 규칙과 같은 축으로 맞춘다.

예시:

- `useGetProductionListQuery.ts`
- `useGetProductionDetailQuery.ts`
- `usePatchProductionDetailMutation.ts`
- `useDeleteProductionMutation.ts`
- `productionQueryKeys.ts`

#### `constants`

feature 내부에서만 사용하는 상수

예시:

- `productionTab.ts`
- `productionStatus.ts`

#### `types`

feature 전용 타입

예시:

- `Production.ts`
- `ProductionFilter.ts`
- `ProductionRequest.ts`
- `ProductionResponse.ts`

#### `components`

feature 전용 UI 컴포넌트

예시:

- `ProductionTable.tsx`
- `ProductionFilterBar.tsx`
- `ProductionDetailHeader.tsx`

#### `hooks`

feature 전용 커스텀 훅

예시:

- `useProductionFilter.ts`
- `useProductionActions.ts`

#### `utils`

feature 내부에서만 쓰는 가공 함수

예시:

- `getProductionStatusLabel.ts`
- `mapProductionResponse.ts`

#### `data`

feature 전용 mock, fixture, 정적 데이터

예시:

- `mockProductionList.ts`
- `productionTableColumns.ts`

---

## 네이밍 규칙

### 1. `api` vs `apis`

`api`를 권장한다.

이유:

- 폴더가 API 관련 파일 집합이라는 의미로 충분하다.
- 일반적으로 더 많이 사용되는 네이밍이다.
- 다른 폴더명(`hooks`, `types`, `components`)과 함께 써도 어색하지 않다.

### 권장

```text
features/production/api
```

### 비권장

```text
features/production/apis
```

`apis`가 틀린 것은 아니지만, 프로젝트 전체 컨벤션으로는 `api`를 추천한다.

### API 파일 구성 원칙

`api` 폴더 안에는 요청 하나당 파일을 따로 만들지 않는다.
대신 **feature 또는 도메인 단위로 하나의 파일에 관련 API 함수를 모은다.**

### 권장

```text
features/production/api/production.ts
```

```ts
export const getProductionList = () => {};
export const getProductionDetail = () => {};
export const postProduction = () => {};
export const putProductionDetail = () => {};
export const patchProductionDetail = () => {};
export const deleteProduction = () => {};
```

### 비권장

```text
features/production/api/fetchProductionList.ts
features/production/api/fetchProductionDetail.ts
features/production/api/updateProduction.ts
```

이 구조는 파일 수가 과도하게 늘어나고, 같은 도메인의 API를 탐색할 때 맥락이 끊기기 쉽다.

### 함수명 규칙

이 프로젝트에서는 `fetch` 접두어를 사용하지 않는다.

대신 **HTTP method가 드러나는 명시적 함수명**을 사용한다.

예시:

- `getProductionList`
- `getProductionDetail`
- `postProduction`
- `putProductionDetail`
- `patchProductionDetail`
- `deleteProduction`

이 규칙을 사용하는 이유는 다음과 같다.

- axios를 사용하므로 `fetch`라는 표현이 구현 방식과 맞지 않는다.
- 함수 이름만 보고 요청 의도와 method를 바로 파악할 수 있다.
- query, mutation 훅과 연결할 때도 역할이 더 분명해진다.

### 예시

```ts
import { axiosInstance } from "@/lib/axiosInstance";

export const getProductionList = async () => {
  const response = await axiosInstance.get("/productions");
  return response.data;
};

export const getProductionDetail = async (productionId: string) => {
  const response = await axiosInstance.get(`/productions/${productionId}`);
  return response.data;
};

export const patchProductionDetail = async (
  productionId: string,
  payload: PatchProductionDetailRequest,
) => {
  const response = await axiosInstance.patch(`/productions/${productionId}`, payload);
  return response.data;
};

export const deleteProduction = async (productionId: string) => {
  const response = await axiosInstance.delete(`/productions/${productionId}`);
  return response.data;
};
```

### 정리

- `api` 폴더명 사용
- API 파일은 요청별 분리보다 도메인별 1파일 권장
- 함수명은 `fetchX`가 아니라 `get/post/put/patch/delete + 대상명` 형태 사용
- 모든 API 함수는 `axiosInstance` 기반으로 작성

---

### 2. `data` vs `datas`

`datas`는 사용하지 않는다. `data`를 사용한다.

### 권장

```text
features/production/data
```

### 비권장

```text
features/production/datas
```

또한 `data` 폴더 안에는 목적이 불분명한 파일을 넣지 않는다.
가능하다면 아래처럼 더 구체적으로 나누는 것도 좋다.

예시:

- `mock`
- `fixtures`
- `schema`
- `dummy`

---

### 3. `types`는 복수형 사용

타입 파일이 여러 개 존재할 수 있으므로 `types`를 사용한다.

### 권장

```text
features/ordering/types
commons/types
```

---

### 4. `queries`는 복수형 사용

query hook, query key, query option 등 관련 파일을 함께 묶기 좋기 때문에 `queries`를 사용한다.

### 권장

```text
features/production/queries
```

### Query / Mutation 네이밍 규칙

React Query 훅 이름은 API 함수명 규칙과 동일한 축으로 맞춘다.

- 조회 훅: `useGet...Query`
- 생성 훅: `usePost...Mutation`
- 수정 훅: `usePut...Mutation`, `usePatch...Mutation`
- 삭제 훅: `useDelete...Mutation`

### 예시

- `getProductionList` → `useGetProductionListQuery`
- `getProductionDetail` → `useGetProductionDetailQuery`
- `postProduction` → `usePostProductionMutation`
- `putProductionDetail` → `usePutProductionDetailMutation`
- `patchProductionDetail` → `usePatchProductionDetailMutation`
- `deleteProduction` → `useDeleteProductionMutation`

이 규칙을 사용하는 이유는 다음과 같다.

- API 함수와 React Query 훅의 관계를 이름만으로 바로 파악할 수 있다.
- axios 기반 API 함수명과 일관성을 유지할 수 있다.
- 조회와 변경 작업을 이름 차원에서 명확하게 구분할 수 있다.

### 예시 구조

```text
features/production
├── api
│   └── production.ts
└── queries
    ├── productionQueryKeys.ts
    ├── useGetProductionListQuery.ts
    ├── useGetProductionDetailQuery.ts
    ├── usePostProductionMutation.ts
    ├── usePutProductionDetailMutation.ts
    ├── usePatchProductionDetailMutation.ts
    └── useDeleteProductionMutation.ts
```

### 예시 코드

```ts
// features/production/queries/useGetProductionListQuery.ts
import { useQuery } from "@tanstack/react-query";
import { getProductionList } from "@/features/production/api/production";
import { productionQueryKeys } from "@/features/production/queries/productionQueryKeys";

export const useGetProductionListQuery = () => {
  return useQuery({
    queryKey: productionQueryKeys.list(),
    queryFn: getProductionList,
  });
};
```

```ts
// features/production/queries/usePatchProductionDetailMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchProductionDetail } from "@/features/production/api/production";
import { productionQueryKeys } from "@/features/production/queries/productionQueryKeys";

export const usePatchProductionDetailMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productionId,
      payload,
    }: {
      productionId: string;
      payload: PatchProductionDetailRequest;
    }) => patchProductionDetail(productionId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productionQueryKeys.detail(variables.productionId),
      });
    },
  });
};
```

### Query Key 규칙

query key는 feature별로 `xxxQueryKeys.ts` 파일에서 관리한다.

예시:

```ts
export const productionQueryKeys = {
  all: ["production"] as const,
  list: () => [...productionQueryKeys.all, "list"] as const,
  detail: (productionId: string) => [...productionQueryKeys.all, "detail", productionId] as const,
};
```

---

## 파일 배치 판단 기준

아래 질문 순서대로 판단한다.

### 1. 이 파일은 하나의 feature에서만 사용되는가?

- 예: 해당 feature 내부에 둔다.
- 아니오: 다음 질문으로 간다.

### 2. 두 개 이상의 feature에서 재사용되는가?

- 예: `commons` 이동 후보
- 아니오: 원래 feature 내부 유지

### 3. 특정 도메인 지식 없이도 쓸 수 있는가?

- 예: `commons`로 이동 가능
- 아니오: feature 내부 유지

### 4. 앱 전역 설정 또는 외부 라이브러리 초기화 파일인가?

- 예: `lib`
- 아니오: `commons` 또는 feature 내부

---

## 예시 1: 타입 파일 배치

### 잘못된 구조

```text
docs
├── interface_common.ts
├── interface_ordering.ts
└── interface_production.ts
```

문제점:

- 타입 파일이 도메인별로 분리되어 있지 않다.
- 실제 사용 위치와 파일 책임이 맞지 않는다.
- feature 구조와 연결되지 않는다.

### 개선 구조

```text
commons
└── types
    └── CommonTable.ts

features
├── ordering
│   └── types
│       └── Ordering.ts
└── production
    └── types
        └── Production.ts
```

### 기준

- `interface_common`처럼 전역 공통 타입은 `commons/types`
- `interface_ordering`처럼 ordering 도메인 타입은 `features/ordering/types`
- `interface_production`처럼 production 도메인 타입은 `features/production/types`

---

## 예시 2: 공통 훅과 feature 훅 구분

### 공통 훅

```text
commons/hooks/useDebounce.ts
```

이유:

- 검색, 입력 지연 처리 등 여러 feature에서 재사용 가능
- 도메인 지식이 없음

### feature 훅

```text
features/ordering/hooks/useOrderingFilter.ts
```

이유:

- ordering 필터 상태와 조건 로직을 포함
- ordering 도메인에 강하게 의존

---

## 예시 3: API 함수 위치

### 잘못된 예시

```text
lib/api.ts
```

문제점:

- 어떤 feature의 API인지 알 수 없음
- feature 책임이 흐려짐
- 유지보수 시 영향 범위를 파악하기 어려움

### 개선 예시

```text
lib/axiosInstance.ts

features/production/api/production.ts
features/ordering/api/ordering.ts
```

```ts
// features/production/api/production.ts
export const getProductionList = async () => {};
export const getProductionDetail = async () => {};
export const patchProductionDetail = async () => {};
export const deleteProduction = async () => {};
```

### 기준

- axios 설정 자체는 `lib`
- 실제 API 함수는 해당 feature의 `api`
- 같은 feature의 API 함수는 가능한 한 하나의 파일에 모은다

---

## 예시 4: 공통 유틸과 feature 유틸 구분

### 공통 유틸

```text
commons/utils/formatDate.ts
commons/utils/formatPrice.ts
```

### feature 유틸

```text
features/ordering/utils/getOrderingStatusColor.ts
features/production/utils/mapProductionStatus.ts
```

### 판단 기준

- 날짜 포맷, 숫자 포맷: 공통 유틸
- 주문 상태명 변환, 생산 상태 색상 매핑: feature 유틸

---

## import 규칙

### 원칙

- `index.ts`를 만들지 않는다.
- 실제 파일 경로를 직접 import 한다.

### 권장

```ts
import { useProductionListQuery } from "@/features/production/queries/useProductionListQuery";
import { formatDate } from "@/commons/utils/formatDate";
```

### 비권장

```ts
import { useProductionListQuery } from "@/features/production";
import { formatDate } from "@/commons";
```

### 이유

- 참조 위치가 더 명확하다.
- 검색과 추적이 쉽다.
- 파일 이동 시 영향 범위를 더 정확하게 확인할 수 있다.

---

## 폴더 생성 시 체크리스트

새 파일이나 폴더를 추가하기 전에 아래를 확인한다.

- 이 파일은 특정 feature 전용인가?
- 실제로 두 개 이상의 feature에서 사용되는가?
- 공통으로 올렸을 때 도메인 책임이 흐려지지 않는가?
- `lib`에 두려는 이유가 설정/인프라 성격 때문인가?
- 단순히 애매해서 `commons`나 `lib`에 넣으려는 것은 아닌가?
- 동일한 역할의 파일이 다른 feature에서는 어떤 구조를 따르고 있는가?

---

## Query / Mutation 작성 원칙

### 기본 원칙

- query 훅은 조회용으로만 사용한다.
- mutation 훅은 생성, 수정, 삭제 요청에 사용한다.
- query / mutation 훅 이름은 API 함수명 규칙과 동일한 축으로 맞춘다.
- query 훅 내부에서는 해당 feature의 `api` 폴더에 있는 함수를 직접 사용한다.
- query key는 feature별로 분리 관리한다.

### 권장 예시

```ts
getProductionList;
useGetProductionListQuery;
productionQueryKeys.list();
```

```ts
patchProductionDetail;
usePatchProductionDetailMutation;
productionQueryKeys.detail(productionId);
```

### 비권장 예시

```ts
fetchProductionList;
useProductionList;
useProductionMutation;
```

위와 같은 이름은 요청 method나 hook 역할이 이름에서 바로 드러나지 않으므로 사용하지 않는다.

---

## AI 리팩토링 작업 시 주의사항

AI에게 구조 변경 작업을 요청할 때는 다음 원칙을 반드시 포함한다.

### 원칙

- 파일을 무작정 이동하지 말고 실제 사용처를 먼저 분석할 것
- 공통 파일 여부는 사용처 개수와 도메인 의존성 기준으로 판단할 것
- `index.ts`는 생성하지 말 것
- import 문은 실제 파일 경로 기준으로 수정할 것
- 기능 동작을 깨지 않도록 영향 범위를 함께 점검할 것
- `lib`에는 전역 설정, 인프라 성격 파일만 남길 것

### 예시 요청 문구

```md
파일을 이동할 때는 추측으로 분류하지 말고, 실제 사용처와 파일 내용 기준으로 위치를 결정해.
공통인지 feature 전용인지 애매하면 먼저 근거를 설명한 뒤 이동해.
barrel export(index.ts)는 만들지 말고, 모든 import는 명시적 경로로 수정해.
lib 폴더에는 axiosInstance, queryClient 같은 설정성 파일만 남기고, feature 전용 API나 유틸은 적절한 feature 폴더로 이동해.
```

---

## 최종 정리

이 프로젝트의 구조 원칙은 다음 한 문장으로 요약할 수 있다.

> 공통 자산은 `commons`, feature 전용 자산은 각 `features`, 전역 설정과 인프라 파일은 `lib`에 둔다.

세부적으로는 아래 기준을 따른다.

- `components/ui`: shadcn/ui 전용 폴더로 유지하며, shadcn 컴포넌트 파일만 둔다
- `commons`: 여러 feature에서 재사용되는 공통 자산
- `features`: 특정 도메인에 속한 UI, API, 타입, 훅, 유틸
- `lib`: 전역 설정, 외부 라이브러리 초기화, 인프라 파일
- `index.ts`: 사용하지 않음
- `api`: 단수형 사용
- API 파일은 요청별 파일 분리보다 도메인별 1파일 구성을 우선한다
- API 함수명은 `fetch` 대신 `get/post/put/patch/delete + 대상명` 규칙을 사용한다
- query 훅은 `useGet...Query`, mutation 훅은 `usePost/Put/Patch/Delete...Mutation` 규칙을 사용한다
- query key는 feature별 `xxxQueryKeys.ts`에서 관리한다
- `data`: 단수형 사용, `datas` 사용 금지
- 파일 배치는 사용처와 도메인 책임 기준으로 판단

이 문서는 구조를 단순히 예쁘게 맞추기 위한 문서가 아니라,
코드 탐색 비용을 줄이고 유지보수 가능성을 높이기 위한 기준 문서이다.
