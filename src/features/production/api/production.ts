import axiosInstance from "@/services/axiosInstance";

import type {
  ProductionAlertsResponse,
  ProductionOverviewResponse,
  ProductionRegistrationHistoryParams,
  ProductionRegistrationHistoryResponse,
  ProductionRegistrationPayload,
  ProductionRegistrationResponse,
  ProductionRegistrationSummaryParams,
  ProductionRegistrationSummaryResponse,
  ProductionSimulationPayload,
  ProductionSimulationResponse,
} from "@/features/production/types/production";

/**
 * API: GET /api/production/overview
 * Sample Req:
 *  - query/body 없음
 * Sample Res:
 * {
 *   "updated_at": "14:03",
 *   "production_lead_time_minutes": 60,
 *   "danger_count": 1,
 *   "items": [
 *     {
 *       "sku_id": "DK_CHOCO",
 *       "name": "초코 도넛",
 *       "current": 12,
 *       "forecast": 4,
 *       "status": "danger",
 *       "depletion_time": "15:17",
 *       "recommended": 18,
 *       "prod1": "08:00 / 20개",
 *       "prod2": "14:00 / 18개"
 *     }
 *   ]
 * }
 */
export const getProductionOverview = async (
) => {
  const response = await axiosInstance.get<ProductionOverviewResponse>(
    "/api/production/overview",
  );
  return response.data;
};

/**
 * API: GET /api/production/alerts
 * Sample Req:
 *  - query/body 없음
 * Sample Res:
 * {
 *   "generated_at": "2026-04-14 13:40:21",
 *   "lead_time_minutes": 60,
 *   "alerts": [
 *     {
 *       "sku_id": "DK_CHOCO",
 *       "name": "초코 도넛",
 *       "current": 12,
 *       "forecast": 4,
 *       "depletion_time": "15:17",
 *       "recommended": 18,
 *       "prod1": "08:00 / 20개",
 *       "prod2": "14:00 / 18개",
 *       "severity": "danger",
 *       "push_title": "초코 도넛 생산이 필요합니다",
 *       "push_message": "현재고 12개, 1시간 후 예상 4개입니다. 15:17 전 소진 가능성이 있어 18개 생산을 권장합니다.",
 *       "target_roles": ["store_owner", "store_operator"]
 *     }
 *   ]
 * }
 */
export const getProductionAlerts = async () => {
  const response = await axiosInstance.get<ProductionAlertsResponse>(
    "/api/production/alerts",
  );
  return response.data;
};

/**
 * API: POST /api/production/registrations
 * Sample Req:
 * {
 *   "sku_id": "DK_CHOCO",
 *   "qty": 18,
 *   "registered_by": "store_owner",
 *   "store_id": "STORE001"
 * }
 * Sample Res:
 * {
 *   "sku_id": "DK_CHOCO",
 *   "qty": 18,
 *   "registered_by": "store_owner",
 *   "feedback_type": "chance_loss_reduced",
 *   "feedback_message": "재고 소진 전에 등록되어 찬스 로스 감소 효과를 기록했습니다.",
 *   "store_id": "STORE001"
 * }
 */
export const postProductionRegistration = async (
  payload: ProductionRegistrationPayload,
) => {
  const response = await axiosInstance.post<ProductionRegistrationResponse>(
    "/api/production/registrations",
    payload,
  );
  return response.data;
};

/**
 * API: GET /api/production/registrations/history
 * Sample Req (query):
 * {
 *   "limit": 20,
 *   "store_id": "STORE001",
 *   "date_from": "2026-04-01",
 *   "date_to": "2026-04-14"
 * }
 * Sample Res:
 * {
 *   "items": [
 *     {
 *       "sku_id": "DK_CHOCO",
 *       "qty": 18,
 *       "registered_by": "store_owner",
 *       "feedback_type": "chance_loss_reduced",
 *       "feedback_message": "재고 소진 전에 등록되어 찬스 로스 감소 효과를 기록했습니다.",
 *       "registered_at": "2026-04-14 13:21:09",
 *       "store_id": "STORE001"
 *     }
 *   ],
 *   "total": 1,
 *   "filtered_store_id": "STORE001",
 *   "filtered_date_from": "2026-04-01",
 *   "filtered_date_to": "2026-04-14"
 * }
 */
export const getProductionRegistrationHistory = async (
  params: ProductionRegistrationHistoryParams
) => {
  const response = await axiosInstance.get<ProductionRegistrationHistoryResponse>(
    "/api/production/registrations/history",
    { params },
  );
  return response.data;
};

/**
 * API: GET /api/production/registrations/summary
 * Sample Req (query):
 * {
 *   "store_id": "STORE001",
 *   "date_from": "2026-04-01",
 *   "date_to": "2026-04-14"
 * }
 * Sample Res:
 * {
 *   "total": 12,
 *   "latest": {
 *     "sku_id": "DK_CHOCO",
 *     "qty": 18,
 *     "registered_by": "store_owner",
 *     "feedback_type": "chance_loss_reduced",
 *     "feedback_message": "재고 소진 전에 등록되어 찬스 로스 감소 효과를 기록했습니다.",
 *     "registered_at": "2026-04-14 13:21:09",
 *     "store_id": "STORE001"
 *   },
 *   "total_registered_qty": 196,
 *   "recent_registered_by": ["store_owner", "store_operator"],
 *   "recent_registration_count_7d": 5,
 *   "recent_registered_qty_7d": 84,
 *   "affected_sku_count": 3,
 *   "summary_status": "active",
 *   "filtered_store_id": "STORE001",
 *   "filtered_date_from": "2026-04-01",
 *   "filtered_date_to": "2026-04-14"
 * }
 */
export const getProductionRegistrationSummary = async (
  params: ProductionRegistrationSummaryParams
) => {
  const response = await axiosInstance.get<ProductionRegistrationSummaryResponse>(
    "/api/production/registrations/summary",
    { params },
  );
  return response.data;
};

/**
 * API: POST /api/production/simulation
 * Sample Req:
 * {
 *   "store_id": "STORE001",
 *   "item_id": "DK_CHOCO",
 *   "simulation_date": "2026-04-14",
 *   "lead_time_hour": 1,
 *   "margin_rate": 0.3
 * }
 * Sample Res:
 * {
 *   "metadata": {
 *     "store_id": "STORE001",
 *     "item_id": "DK_CHOCO",
 *     "date": "2026-04-14",
 *     "source": "repository",
 *     "inventory_rows": 24,
 *     "production_rows": 12,
 *     "sales_rows": 24
 *   },
 *   "summary_metrics": {
 *     "additional_sales_qty": 8,
 *     "additional_profit_amt": 3600,
 *     "additional_waste_qty": 2,
 *     "additional_waste_cost": 1400,
 *     "net_profit_change": 2200,
 *     "performance_status": "POSITIVE",
 *     "chance_loss_reduction": 3600
 *   },
 *   "time_series_data": [
 *     { "time": "08:00", "actual_stock": 10, "ai_guided_stock": 18 },
 *     { "time": "12:00", "actual_stock": 10, "ai_guided_stock": 18 }
 *   ],
 *   "actions_timeline": [
 *     "[생산 데이터] 누적 생산 20개 반영",
 *     "[판매 데이터] 누적 판매 12개 반영"
 *   ]
 * }
 */
export const postProductionSimulation = async (
  payload: ProductionSimulationPayload,
) => {
  const response = await axiosInstance.post<ProductionSimulationResponse>(
    "/api/production/simulation",
    payload,
  );
  return response.data;
};
