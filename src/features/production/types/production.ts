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
