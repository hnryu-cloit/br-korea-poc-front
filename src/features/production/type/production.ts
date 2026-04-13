export type ProductionStatus = "danger" | "warning" | "safe";
export type ProductionAiRiskLevel = "정상" | "주의" | "경고" | "위험" | "즉시생산";

export interface ProductionAiPattern {
  time: string;
  qty: number;
}

export interface ProductionAiSkuStatus {
  item_cd: string;
  item_nm: string;
  status: string;
  current_qty: number;
  predict_1h_qty: number;
  avg_4w_prod_1st?: ProductionAiPattern | null;
  avg_4w_prod_2nd?: ProductionAiPattern | null;
  chance_loss_reduction_pct: number;
  sales_velocity: number;
  tags: string[];
  alert_message: string;
  can_produce: boolean;
}

export interface ProductionAiDashboardSummary {
  critical_count: number;
  warning_count: number;
  safe_count: number;
  avg_chance_loss_reduction: number;
}

export interface ProductionAiDashboardResponse {
  store_id: string;
  summary: ProductionAiDashboardSummary;
  sku_list: ProductionAiSkuStatus[];
  chart_data?: Array<{
    time: string;
    actual_stock: number;
    ai_guided_stock: number;
  }>;
  action_timeline?: string[];
}

export interface ProductionAiDecision {
  risk_level_label?: ProductionAiRiskLevel;
  sales_velocity: number;
  tags: string[];
  alert_message: string;
  can_produce: boolean;
  predicted_stockout_time?: string | null;
  suggested_production_qty?: number;
  chance_loss_prevented_amount?: number | null;
}

export interface ProductionSkuItem {
  sku_id: string;
  sku_name: string;
  current_stock: number;
  forecast_stock_1h: number;
  avg_first_production_qty_4w: number;
  avg_first_production_time_4w: string;
  avg_second_production_qty_4w: number;
  avg_second_production_time_4w: string;
  status: ProductionStatus;
  chance_loss_saving_pct: number;
  chance_loss_basis_text?: string;
  speed_alert?: boolean;
  speed_alert_message?: string;
  material_alert?: boolean;
  material_alert_message?: string;
  depletion_eta_minutes?: number | null;
  recommended_production_qty?: number;
  decision: ProductionAiDecision;
}

export interface ProductionAlertItem {
  id: string;
  type: "inventory_risk" | "speed_risk" | "material_risk";
  severity: "high" | "medium";
  title: string;
  description: string;
  sku_id?: string;
  ingredient_id?: string;
  expected_at?: string;
}

export interface ProductionSummaryStat {
  key: "danger_count" | "warning_count" | "safe_count" | "chance_loss_saving_total";
  label: string;
  value: string;
  tone: "danger" | "primary" | "success" | "default";
}

export interface GetProductionOverviewRequest {
  store_id: string;
}

export interface GetProductionOverviewResponse {
  updated_at: string;
  refresh_interval_minutes: number;
  summary_stats: ProductionSummaryStat[];
  alerts: ProductionAlertItem[];
}

export interface GetProductionSkuListRequest {
  store_id: string;
  page?: number;
  page_size?: number;
}

export interface ProductionSkuListPagination {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

export interface GetProductionSkuListResponse {
  items: ProductionSkuItem[];
  pagination: ProductionSkuListPagination;
}

export interface GetProductionRegistrationFormRequest {
  store_id: string;
  sku_id: string;
}

export interface GetProductionRegistrationFormResponse {
  sku_id: string;
  sku_name: string;
  current_stock: number;
  forecast_stock_1h: number;
  recommended_qty: number;
  chance_loss_saving_pct: number;
  chance_loss_basis_text: string;
  predicted_stockout_time?: string | null;
  can_produce?: boolean;
  sales_velocity?: number;
  tags?: string[];
  alert_message?: string;
  material_alert?: boolean;
  material_alert_message?: string;
}

export interface CreateProductionRegistrationRequest {
  actor_role: "store_owner" | "store_staff" | "hq_admin" | "hq_operator";
  store_id: string;
  sku_id: string;
  qty: number;
  registered_at?: string;
}

export interface CreateProductionRegistrationResponse {
  registration_id: string;
  sku_id: string;
  qty: number;
  feedback_type: "chance_loss_reduced" | "late_registration" | "neutral";
  feedback_message: string;
  chance_loss_saving_pct?: number;
}
