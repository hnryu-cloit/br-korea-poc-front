/**
 * DashboardPage
 * - 오늘의 운영 현황
 * - 지금 해야 할 일 3개
 * - 생산/주문/손익 요약 카드
 * - 핵심 KPI
 */

/**
 * 대시보드 요약 조회 요청
 */
export interface GetDashboardSummaryRequest {
  store_id?: string; // 조회 대상 매장 ID
  business_date?: string; // 기준 영업일
}

export type DashboardUrgency = "urgent" | "important" | "recommended";
export type DashboardActionType = "production" | "ordering" | "sales";

/**
 * 지금 해야 할 일 우선순위 액션 카드
 */
export interface DashboardPriorityAction {
  id: string; // 액션 카드 고유 ID
  type: DashboardActionType; // 연결 도메인 (생산, 주문, 손익)
  urgency: DashboardUrgency; // 우선순위 단계
  badge_label: string; // 카드 상단 배지 문구
  title: string; // 액션 제목
  description: string; // 액션 상세 설명
  cta_label: string; // 행동 유도 버튼 라벨
  cta_path: string; // 행동 유도 버튼 이동 경로
  focus_section?: string; // 이동 후 강조할 섹션 키
  related_sku_id?: string; // 관련 SKU ID
  ai_reasoning?: string; // AI 추천 상세 근거
  confidence_score?: number; // AI 신뢰도 (0.0 ~ 1.0)
  is_finished_good: boolean; // 본사 납품 완제품 여부
}

/**
 * 대시보드 상단 핵심 KPI 카드
 */
export interface DashboardStatItem {
  key: "production_risk_count" | "ordering_deadline_minutes" | "today_profit_estimate" | "alert_count"; // KPI 식별 키
  label: string; // 카드 라벨
  value: string; // 화면에 표시할 값
  tone: "danger" | "primary" | "success" | "default"; // 카드 강조 톤
}

/**
 * 대시보드 도메인별 요약 카드
 */
export interface DashboardSummaryCard {
  domain: "production" | "ordering" | "sales"; // 카드가 설명하는 운영 도메인
  title: string; // 카드 제목
  description: string; // 카드 설명
  highlights: string[]; // 카드 안에서 강조할 핵심 정보 목록
  metrics: Array<{
    label: string;
    value: string;
    tone: "danger" | "primary" | "success" | "default";
  }>; // 카드 내부 보조 지표
  cta_label: string; // 행동 유도 버튼 라벨
  cta_path: string; // 행동 유도 버튼 이동 경로
  prompts: string[]; // 카드별 AI 질문 프롬프트 목록
  status_label?: string; // 카드 상태 라벨
  deadline_minutes?: number; // 주문 마감까지 남은 시간
  delivery_scheduled?: boolean; // 배송 예정 여부
}

/**
 * 대시보드 요약 응답
 */
export interface GetDashboardSummaryResponse {
  updated_at: string; // 마지막 데이터 갱신 시각
  priority_actions: DashboardPriorityAction[]; // 우선순위 액션 카드 목록
  stats: DashboardStatItem[]; // 상단 KPI 카드 목록
  cards: DashboardSummaryCard[]; // 생산/주문/손익 요약 카드 목록
}
