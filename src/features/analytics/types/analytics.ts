/**
 * AnalyticsPage
 * - 기존 analytics 페이지 유지용 API 스펙
 * - 지표 카드
 * - 질의 처리 로그
 */

/**
 * Analytics 지표 조회 요청
 */
export interface GetAnalyticsMetricsRequest {
  store_id?: string; // 필터링할 매장 ID
  date_from?: string; // 조회 시작일
  date_to?: string; // 조회 종료일
}

export interface GetMarketIntelligenceRequest {
  store_id?: string;
  gu?: string;
  dong?: string;
  industry?: string;
  year?: number;
  quarter?: string;
  radius_m?: number;
}

/**
 * Analytics 상단 지표 카드
 */
export interface AnalyticsMetricItem {
  label: string; // 지표명
  value: string; // 현재 지표 값
  change: string; // 이전 기준 대비 변화량 또는 변화율
  trend: "up" | "down" | "flat"; // 변화 방향
  detail: string; // 지표 보조 설명
}

export interface GetAnalyticsMetricsResponse {
  items: AnalyticsMetricItem[]; // 지표 카드 목록
}

/**
 * 감사 로그 조회 요청
 */
export interface GetAuditLogsRequest {
  domain?: string; // 필터링할 도메인명
  limit?: number; // 최대 조회 건수
}

/**
 * 질의 처리 감사 로그 항목
 */
export interface AuditLogItem {
  id: number; // 감사 로그 ID
  timestamp: string; // 로그 생성 시각
  domain: string; // 질의가 속한 도메인
  route: string; // 처리 경로 (예: SQL/API, AI, 차단)
  outcome: string; // 처리 결과
  message: string; // 로그 메시지
  metadata: Record<string, unknown>; // 질의 유형, 원문 등 추가 메타데이터
}

export interface GetAuditLogsResponse {
  items: AuditLogItem[]; // 감사 로그 목록
  total: number; // 전체 로그 건수
}

export type AnalyticsMetric = AnalyticsMetricItem;

export type AnalyticsMetricsResponse = GetAnalyticsMetricsResponse;

export interface AuditLogEntry extends AuditLogItem {
  event_type: string;
  actor_role: string;
}

export interface AuditLogListResponse extends GetAuditLogsResponse {
  items: AuditLogEntry[];
  filtered_domain?: string | null;
}

export interface StoreProfileResponse {
  store_cd: string;
  store_nm: string;
  sido: string;
  region: string;
  store_type: string;
  area_pyeong: number;
  business_type: string;
  peer_count: number;
  actual_sales_amt: number;
}

export interface CustomerSegmentItem {
  segment_nm: string;
  count: number;
}

export interface TelecomDiscountItem {
  name: string;
  type_nm: string;
  value: string;
  method_nm: string;
}

export interface CustomerProfileResponse {
  customer_segments: CustomerSegmentItem[];
  telecom_discounts: TelecomDiscountItem[];
}

export interface SalesTrendPoint {
  day: number;
  this_month: number | null;
  last_month: number | null;
  projection: number | null;
}

export interface SalesTrendInsightChip {
  label: string;
  value: string;
  trend: string;
}

export interface DowPoint {
  dow: number;
  label: string;
  this_month_avg: number;
  last_month_avg: number;
}

export interface HourPoint {
  hour: number;
  this_month_avg: number;
  last_month_avg: number;
}

export interface SalesTrendResponse {
  headline: string;
  headline_trend: "up" | "down" | "flat";
  points: SalesTrendPoint[];
  insight_chips: SalesTrendInsightChip[];
  dow_points: DowPoint[];
  hour_points: HourPoint[];
}

export interface TradeAreaSalesSlice {
  category: string;
  sales_amount: number;
  share_ratio: number;
}

export interface CompetitorTrendPoint {
  month: string;
  sales_amount: number;
}

export interface CompetitorPaymentDemographic {
  age_group: string;
  male_payment_count: number;
  female_payment_count: number;
}

export interface CompetitorInsightItem {
  rank: number;
  brand_name: string;
  store_name: string;
  distance_km: number;
  trend_direction: "up" | "down" | "flat" | string;
  sales_trend: CompetitorTrendPoint[];
  payment_demographics: CompetitorPaymentDemographic[];
}

export interface FloatingPopulationTrendPoint {
  month: string;
  floating_population: number;
  estimated_sales_amount: number;
}

export interface ResidentialPopulationRadarItem {
  age_group: string;
  male_population: number;
  female_population: number;
}

export interface HouseholdCompositionSlice {
  household_type: string;
  household_count: number;
  share_ratio: number;
}

export interface ResidenceRegionItem {
  region_name: string;
  share_ratio: number;
  estimated_customers: number;
}

export interface EstimatedSalesSummary {
  monthly_estimated_sales: number;
  weekly_estimated_sales: number;
  weekend_ratio: number;
}

export interface SalesHeatmapCell {
  dow_label: string;
  hour_band: string;
  sales_index: number;
}

export interface StoreReportItem {
  report_id: string;
  title: string;
  period: string;
  generated_at: string;
  status: string;
}

export interface MarketIntelligenceResponse {
  radius_km: number;
  category_sales_pie: TradeAreaSalesSlice[];
  competitors: CompetitorInsightItem[];
  residential_population_radar: ResidentialPopulationRadarItem[];
  household_composition_pie: HouseholdCompositionSlice[];
  estimated_residence_regions: ResidenceRegionItem[];
  estimated_sales_summary: EstimatedSalesSummary;
  sales_heatmap: SalesHeatmapCell[];
  store_reports: StoreReportItem[];
  floating_population_trend: FloatingPopulationTrendPoint[];
  floating_population_analysis: string;
  data_sources: string[];
}

export interface WeatherImpactCorrelation {
  metric: string;
  temperature_corr: number;
  precipitation_corr: number;
}

export interface WeatherImpactBySido {
  sido: string;
  samples: number;
  avg_temperature: number;
  avg_precipitation: number;
  correlations: WeatherImpactCorrelation[];
}

export interface WeatherImpactResponse {
  date_from: string;
  date_to: string;
  items: WeatherImpactBySido[];
}
