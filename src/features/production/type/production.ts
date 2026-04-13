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
  items: ProductionSkuItem[];
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
