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

export interface ProductionOverviewResponse {
  updated_at: string;
  refresh_interval_minutes: number;
  summary_stats: ProductionSummaryStat[];
  alerts: ProductionAlertItem[];
}

export type ProductionStatus = "danger" | "warning" | "safe";

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
  tags?: string[];
  alert_message?: string;
  can_produce?: boolean;
  predicted_stockout_time?: string | null;
  sales_velocity?: number;
}

export interface ProductionSkuListResponse {
  items: ProductionSkuItem[];
  pagination?: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
  };
}

export interface ProductionSkuListParams {
  page?: number;
  page_size?: number;
  store_id?: string;
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

export type ProductionSkuDetailResponse = ProductionRegistrationForm;

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
