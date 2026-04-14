export interface ProductionOverviewItem {
  sku_id: string;
  name: string;
  current: number;
  forecast: number;
  status: string;
  depletion_time: string;
  recommended: number;
  prod1: string;
  prod2: string;
}

export interface ProductionOverviewResponse {
  updated_at: string; 
  production_lead_time_minutes: number; 
  danger_count: number;
  items: ProductionOverviewItem[];
}

export interface ProductionAlert {
  sku_id: string;
  name: string;
  current: number; 
  forecast: number;
  depletion_time: string; 
  recommended: number; 
  prod1: string;
  prod2: string;
  severity: string;
  push_title: string; 
  push_message: string; 
  target_roles: string[];
}

export interface ProductionAlertsResponse {
  generated_at: string;
  lead_time_minutes: number;
  alerts: ProductionAlert[];
}

export interface ProductionRegistrationPayload {
  sku_id: string;
  qty: number;
  registered_by?: string;
  store_id?: string;
}

export interface ProductionRegistrationResponse {
  sku_id: string;
  qty: number;
  registered_by: string;
  feedback_type: string;
  feedback_message: string;
  store_id?: string;
}

export interface ProductionRegistrationHistoryParams {
  limit?: number;
  store_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface ProductionRegistrationHistoryItem {
  sku_id: string;
  qty: number;
  registered_by: string;
  feedback_type: string;
  feedback_message: string;
  registered_at: string;
  store_id?: string;
}

export interface ProductionRegistrationHistoryResponse {
  items: ProductionRegistrationHistoryItem[];
  total: number;
  filtered_store_id?: string;
  filtered_date_from?: string;
  filtered_date_to?: string;
}

export interface ProductionRegistrationSummaryParams {
  store_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface ProductionRegistrationSummaryResponse {
  total: number;
  latest?: ProductionRegistrationHistoryItem | null;
  total_registered_qty: number;
  recent_registered_by: string[];
  recent_registration_count_7d: number;
  recent_registered_qty_7d: number;
  affected_sku_count: number;
  summary_status: string;
  filtered_store_id?: string;
  filtered_date_from?: string;
  filtered_date_to?: string;
}

export interface ProductionSimulationPayload {
  store_id: string;
  item_id: string;
  simulation_date: string;
  lead_time_hour?: number;
  margin_rate?: number;
}

export interface ProductionSimulationMetrics {
  additional_sales_qty: number;
  additional_profit_amt: number;
  additional_waste_qty: number;
  additional_waste_cost: number;
  net_profit_change: number;
  performance_status: string;
  chance_loss_reduction?: number | null;
}

export interface ProductionSimulationPoint {
  time: string;
  actual_stock: number;
  ai_guided_stock: number;
}

export interface ProductionSimulationResponse {
  metadata: Record<string, string | number | boolean | null>;
  summary_metrics: ProductionSimulationMetrics;
  time_series_data: ProductionSimulationPoint[];
  actions_timeline: string[];
}

// UI view models used by production screen/components.
export type ProductionStatus = "danger" | "warning" | "safe";
export type ProductionRiskLevel = "정상" | "주의" | "경고" | "위험" | "즉시생산";

export interface ProductionDecision {
  risk_level_label?: ProductionRiskLevel;
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
  decision: ProductionDecision;
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

export interface ProductionRegistrationForm {
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
