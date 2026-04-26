/**
 * SalesPage
 * - 순이익 기본 요약
 * - 손익분기점 분석
 * - 비용 구성
 * - 상품별 분석
 * - 추천 질문
 * - 자연어 질의 응답
 * - 매장 맞춤형 비교 / 근거 표기
 */

/**
 * 손익 요약 조회 요청
 */
export interface GetSalesSummaryRequest {
  store_id: string; // 조회 대상 매장 ID
  business_date?: string; // 기준 영업일
}

/**
 * 손익 상단 KPI 카드
 */
export interface SalesSummaryStat {
  key: "today_revenue" | "today_profit" | "today_cost" | "break_even_status"; // KPI 식별 키
  label: string; // 카드 라벨
  value: string; // 표시 값
  tone: "default" | "success" | "danger" | "primary"; // 카드 강조 톤
}

/**
 * 손익분기점 분석 요약
 */
export interface SalesBreakEvenSummary {
  break_even_point: number; // 손익분기점 매출 금액
  today_profit: number; // 오늘 순이익 금액
  today_revenue: number; // 오늘 매출 금액
  target_profit: number; // 목표 순이익 금액
  items_needed_to_target: number; // 목표 순이익 달성을 위해 추가로 판매해야 할 예상 수량
  guidance_text: string; // 손익분기점 관련 안내 문구
  calculation_basis_text: string; // 계산 기준 설명
}

/**
 * 매장 맞춤형 분석 문맥 요약
 */
export interface StoreContextSummary {
  store_id: string; // 매장 ID
  store_name: string; // 매장명
  context_title: string; // 매장 맞춤 문맥 제목
  context_description: string; // 매장 특성 설명
}

export interface GetSalesSummaryResponse {
  stats: SalesSummaryStat[]; // 상단 손익 KPI 목록
  break_even: SalesBreakEvenSummary; // 손익분기점 분석 요약
  store_context: StoreContextSummary; // 매장 맞춤형 분석 문맥
}

/**
 * 순이익/주간 추이
 * GET /api/sales/profit-trend
 */
export interface GetSalesProfitTrendRequest {
  store_id: string; // 조회 대상 매장 ID
  date_from?: string; // 조회 시작일
  date_to?: string; // 조회 종료일
}

/**
 * 일자별 손익 추이 항목
 */
export interface SalesProfitTrendItem {
  date: string; // 영업일
  revenue: number; // 매출 금액
  profit: number; // 순이익 금액
  cost: number; // 총비용 금액
}

export interface GetSalesProfitTrendResponse {
  items: SalesProfitTrendItem[]; // 기간별 손익 추이 목록
  weekly_profit_total: number; // 주간 누적 순이익
  weekly_profit_average: number; // 주간 평균 일 순이익
  break_even_achieved_days: number; // 손익분기점 달성 일수
}

/**
 * 비용 구성
 * GET /api/sales/cost-breakdown
 */
export interface GetSalesCostBreakdownRequest {
  store_id: string; // 조회 대상 매장 ID
  business_date?: string; // 기준 영업일
}

/**
 * 비용 구성 항목
 */
export interface SalesCostBreakdownItem {
  key: "cogs" | "labor" | "card_fee" | "fixed_cost" | "other_cost"; // 비용 항목 식별 키
  label: string; // 비용 항목명
  amount: number; // 비용 금액
  ratio_pct: number; // 매출 대비 비용 비율
}

export interface GetSalesCostBreakdownResponse {
  revenue: number; // 기준일 매출 금액
  total_cost: number; // 총비용 금액
  profit: number; // 순이익 금액
  profit_rate_pct: number; // 순이익률
  items: SalesCostBreakdownItem[]; // 비용 세부 항목 목록
}

/**
 * 상품별 손익 분석
 * GET /api/sales/product-profitability
 */
export interface GetSalesProductProfitabilityRequest {
  store_id: string; // 조회 대상 매장 ID
  business_date?: string; // 기준 영업일
}

/**
 * 상품별 손익 분석 항목
 */
export interface SalesProductProfitabilityItem {
  sku_id?: string; // SKU 고유 ID
  product_name: string; // 상품명
  sales_amount: number; // 상품 매출 금액
  profit_amount: number; // 상품 순이익 금액
  profit_rate_pct: number; // 상품 순이익률
}

export interface GetSalesProductProfitabilityResponse {
  items: SalesProductProfitabilityItem[]; // 상품별 손익 분석 목록
}

/**
 * 추천 질문
 * GET /api/sales/prompts
 */
export interface SalesPromptItem {
  id?: string; // 추천 질문 고유 ID
  label: string; // 화면에 노출할 질문 라벨
  category: string; // 질문 분류
  prompt: string; // 실제 AI 질의 문장
}

export interface GetSalesPromptsResponse {
  items: SalesPromptItem[]; // 추천 질문 목록
}

/**
 * 인사이트 섹션
 * GET /api/sales/insights
 */
export interface SalesInsightMetricItem {
  label: string; // 인사이트 지표명
  value: string; // 인사이트 지표 값
  detail?: string | null; // 지표 보조 설명
}

/**
 * 손익 인사이트 섹션
 */
export interface SalesInsightSectionItem {
  key: "peak_hours" | "channel_mix" | "payment_mix" | "menu_mix"; // 인사이트 섹션 식별 키
  title: string; // 섹션 제목
  summary: string; // 섹션 요약 설명
  metrics: SalesInsightMetricItem[]; // 섹션 핵심 지표 목록
  actions: string[]; // 실행 권장 액션 목록
  status: "active" | "review" | "normal"; // 현재 모니터링 상태
}

export interface GetSalesInsightsRequest {
  store_id?: string; // 조회 대상 매장 ID
  date_from?: string; // 조회 시작일
  date_to?: string; // 조회 종료일
}

export interface GetSalesPromptsRequest extends GetSalesInsightsRequest {
  domain?: "production" | "ordering" | "sales";
}

export interface GetSalesInsightsResponse {
  sections: SalesInsightSectionItem[]; // 인사이트 섹션 목록
}

/**
 * 자연어 손익 질의
 * POST /api/sales/query
 */
export type { ChatHistoryEntry } from "@/commons/types/floating-ai-chat";

export interface CreateSalesQueryRequest {
  store_id: string;
  prompt: string;
  domain?: "production" | "ordering" | "sales";
  business_date?: string;
  business_time?: string;
  page_context?: string;
  card_context_key?: string;
  store_name?: string;
  user_role?: string;
  conversation_history?: ChatHistoryEntry[];
}

/**
 * 비교 분석 지표 항목
 */
export interface SalesComparisonMetric {
  label: string; // 비교 지표명
  store_value: string; // 현재 매장 값
  peer_value: string; // 비교군 값
}

/**
 * 매장 대 비교군 비교 분석 결과
 *
 * 현재 UI는 매장명을 직접 노출하고 있어 `store` 필드를 추가로 유지한다.
 */
export interface SalesQueryComparison {
  store: string;
  peer_group: string; // 비교군 설명
  summary: string; // 비교 결과 요약
  metrics: SalesComparisonMetric[]; // 비교 지표 목록
}

export interface ExplainabilityPayload {
  status: "pending" | "ready" | "failed";
  trace_id: string;
  actions: string[];
  evidence: string[];
  updated_at: string;
  error_reason?: string | null;
}

export interface CreateSalesQueryResponse {
  text: string; // 사용자에게 보여줄 자연어 답변 본문
  actions: string[]; // 실행 가능한 권장 액션 목록
  follow_up_questions?: string[]; // 후속 추천 질문 목록
  store_context: string; // 답변에 반영된 매장 문맥 요약
  data_source: string; // 답변 산출에 사용한 데이터 출처
  comparison_basis: string; // 비교 기준 설명
  calculation_date: string; // 계산 기준 시점
  comparison?: SalesQueryComparison | null; // 매장 대 비교군 비교 결과
  query_type?: string | null; // 질의 분류 결과
  processing_route?: string | null; // 응답 생성 처리 경로
  blocked: boolean; // 정책상 차단된 질의 여부
  masked_fields?: string[]; // 마스킹 처리된 필드 목록
}

export interface SalesQueryAgentTrace {
  keywords?: string[];
  intent?: string | null;
  relevant_tables?: string[];
  sql?: string | null;
  queried_period?: Record<string, unknown> | null;
  row_count?: number;
  matched_query_id?: string | null;
  match_score?: number | null;
  overlap_candidates?: Array<Record<string, unknown>>;
}

export interface SalesVisualDataset {
  label: string;
  data: number[];
}

export interface SalesVisualChartData {
  type?: "line" | "bar" | "pie" | string;
  labels?: string[];
  datasets?: SalesVisualDataset[];
}

export interface SalesVisualData {
  type?: "line" | "bar" | "pie" | string;
  labels?: string[];
  datasets?: SalesVisualDataset[];
  channel_analysis?: {
    online_amt?: number;
    offline_amt?: number;
    online_rate?: number;
    offline_rate?: number;
  };
  profit_simulation?: {
    estimated_margin_rate?: number;
    estimated_profit?: number;
  };
}

export interface SalesSummaryWeeklyItem {
  day: string;
  revenue: number;
  net_revenue: number;
}

export interface SalesSummaryProductItem {
  name: string;
  sales: number;
  qty: number;
}

export interface SalesSummaryResponse {
  data_date: string | null;
  today_revenue: number;
  today_net_revenue: number;
  weekly_data: SalesSummaryWeeklyItem[];
  top_products: SalesSummaryProductItem[];
  avg_margin_rate: number;
  avg_net_profit_per_item: number;
  avg_ticket_size: number;
  avg_ticket_index: number;
  estimated_today_profit: number;
}

export type SalesPrompt = SalesPromptItem;

export type SalesInsightMetric = SalesInsightMetricItem;

export type SalesInsightSection = Omit<SalesInsightSectionItem, "key">;

export interface SalesInsightsResponse {
  peak_hours: SalesInsightSection;
  channel_mix: SalesInsightSection;
  payment_mix: SalesInsightSection;
  menu_mix: SalesInsightSection;
  campaign_seasonality?: SalesInsightSection | null;
  filtered_store_id?: string | null;
  filtered_date_from?: string | null;
  filtered_date_to?: string | null;
}

export interface MenuInsightsResponse {
  cards: SalesInsightSection[];
  filtered_store_id?: string | null;
  filtered_date_from?: string | null;
  filtered_date_to?: string | null;
}

export interface SalesCampaignEffectPeriod {
  label: string;
  start_date?: string | null;
  end_date?: string | null;
  revenue: number;
}

export interface SalesCampaignEffectMetric {
  label: string;
  value: string;
  detail?: string | null;
}

export interface SalesCampaignEffectResponse {
  // 백엔드 SalesCampaignEffectResponse 정합 필드
  title?: string;
  summary?: string;
  metrics?: SalesCampaignEffectMetric[];
  actions?: string[];
  // 레거시(opportunity 계산용) 옵셔널 필드 — 백엔드 미반환 가능
  campaign_code?: string;
  campaign_name?: string;
  benefit_type?: string;
  item_group_count?: number;
  item_count?: number;
  discount_cost?: number;
  uplift_revenue?: number;
  roi_pct?: number;
  payback_days?: number | null;
  periods?: SalesCampaignEffectPeriod[];
}

export type SalesComparison = SalesQueryComparison;

export interface SalesQueryResponse extends CreateSalesQueryResponse {
  evidence?: string[];
  confidence_score?: number;
  semantic_logic?: string;
  sources?: string[];
  data_lineage?: Array<Record<string, unknown>>;
  visual_data?: SalesVisualData | null;
  explainability?: ExplainabilityPayload | null;
  agent_trace?: SalesQueryAgentTrace | null;
}
