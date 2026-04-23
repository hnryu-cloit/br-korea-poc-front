export type DashboardDomain = "production" | "ordering" | "sales";

/** Dashboard 홈 API 공통 요청값입니다. */
export interface DashboardHomeRequest {
  /** 조회할 매장 ID */
  store_id: string;
  /** 기준 영업일자. YYYY-MM-DD 형식 */
  business_date?: string;
}

/** 할 일 UI에서 완료 상태까지 포함해 프론트에서 사용하는 Todo 모델입니다. */
export interface DashboardTodoItem {
  id: string;
  label: string;
  recurring: boolean; // 반복
  done: boolean; // 완료 여부
}

/** 캘린더와 주요 일정 탭에서 공통으로 사용하는 일정 데이터입니다. */
export interface ScheduleEvent {
  /** 캘린더 기준 대표 날짜. YYYYMMDD 형식 */
  date: string;
  /** 일정명 */
  title: string;
  /** 화면 뱃지 스타일에 사용하는 카테고리 */
  category: "campaign" | "telecom" | "notice";
  /** 백엔드 관리용 세부 타입 */
  type: string;
  /** 시작일. YYYYMMDD 형식 */
  startDate: string;
  /** 종료일. YYYYMMDD 형식 */
  endDate: string;
}

/** 공지사항 영역에서 노출할 최소 단위 데이터입니다. */
export interface ScheduleNotice {
  id: string;
  /** 공지 제목 */
  name: string;
  /** 공지 태그명. 예: 긴급, 안내 */
  tag: string;
  /** 전체보기 또는 상세 이동 경로 */
  path?: string;
}

/** 선택 날짜 기준 할 일 목록의 서버 응답 단위입니다. */
export interface ScheduleTodoItem {
  id: string;
  label: string;
  recurring: boolean;
}

/** 일정 패널 API 응답입니다. */
export interface ScheduleResponse {
  /** 현재 응답이 기준으로 삼은 선택 날짜 */
  selected_date?: string;
  /** 월간 캘린더 표시에 필요한 전체 일정 */
  calendar_events: ScheduleEvent[];
  /** 선택 날짜 상세 영역에 노출할 일정 */
  daily_events: ScheduleEvent[];
  /** 선택 날짜 할 일 목록 */
  todos: ScheduleTodoItem[];
}

/** 공지사항 전용 API 응답입니다. */
export interface DashboardNoticesResponse {
  items: ScheduleNotice[];
}

/** 품절 임박 상품 카드에서 사용하는 상품 단위 데이터입니다. */
export interface DashboardLowStockProduct {
  id: string;
  name: string;
  /** 현재 남은 재고 수량 */
  remaining_stock: number;
  /** 상품 상세 또는 관련 화면 이동 경로 */
  cta_path: string;
}

/** 발주 마감 카드에서 사용하는 기준 시각 데이터입니다. */
export interface DashboardOrderDeadline {
  /** 발주 마감 시각. ISO 문자열 */
  deadline_at: string;
  /** 발주 화면 이동 경로 */
  cta_path: string;
}

/** 경고 요약 영역 전용 API 응답입니다. */
export interface DashboardAlertsResponse {
  low_stock_products: DashboardLowStockProduct[];
  order_deadline: DashboardOrderDeadline | null;
}

/** 생산 현황 카드의 대표 메뉴 행 데이터입니다. */
export interface DashboardProductionSummaryItem {
  name: string;
  /** 현재 재고 수량 */
  current_stock: number;
  /** 다음 1시간 예상 소진 수량 */
  predicted_consumption_1h: number;
}

/** 주문 관리 카드의 발주 마감 임박 상품 행 데이터입니다. */
export interface DashboardOrderingDeadlineItem {
  name: string;
  /** 발주 마감 시각. HH:mm 형식 */
  deadline_time: string;
}

/** 손익분석 카드에서 사용하는 매출 비교 데이터 묶음입니다. */
export interface DashboardSalesOverview {
  monthly_sales: number;
  today_sales: number;
  current_hour_sales: number;
  last_month_sales: number;
  last_month_same_weekday_avg_sales: number;
  last_month_same_hour_avg_sales: number;
}

/** Summary 카드 공통 베이스 필드입니다. */
interface DashboardSummaryCardBase {
  domain: DashboardDomain;
  title: string;
  /** 질문 더보기 이동 경로 */
  cta_path: string;
  /** AI 추천 질문 목록 */
  recommended_questions: string[];
}

/** 생산 현황 카드 응답입니다. */
export interface DashboardProductionSummaryCard extends DashboardSummaryCardBase {
  domain: "production";
  top_products: DashboardProductionSummaryItem[];
}

/** 주문 관리 카드 응답입니다. */
export interface DashboardOrderingSummaryCard extends DashboardSummaryCardBase {
  domain: "ordering";
  /** AI 발주 제안 근거. 예: 지난주 같은 요일 */
  ai_order_basis: string;
  /** AI 발주 제안 자세히 보기 이동 경로 */
  ai_order_cta_path: string;
  /** 마감 임박 상품 목록 */
  deadline_products: DashboardOrderingDeadlineItem[];
}

/** 손익분석 카드 응답입니다. */
export interface DashboardSalesSummaryCard extends DashboardSummaryCardBase {
  domain: "sales";
  sales_overview: DashboardSalesOverview;
}

export type DashboardSummaryCard =
  | DashboardProductionSummaryCard
  | DashboardOrderingSummaryCard
  | DashboardSalesSummaryCard;

/** SummaryCardsSection 전용 API 응답입니다. */
export interface DashboardSummaryCardsResponse {
  updated_at: string;
  cards: DashboardSummaryCard[];
}
