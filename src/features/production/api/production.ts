import axiosInstance from "@/services/axiosInstance";
import { productionOverviewMock } from "@/features/production/mockdata/overview";
import { productionRegistrationFormMock } from "@/features/production/mockdata/registrationForm";
import { productionSkuListMock } from "@/features/production/mockdata/skuList";

import type {
  ProductionOverviewResponse,
  ProductionSkuDetailResponse,
  ProductionSkuListParams,
  ProductionSkuListResponse,
  ProductionRegistrationPayload,
  ProductionRegistrationResponse,
} from "@/features/production/types/production";

const USE_PRODUCTION_MOCK = false;

/**
 * API: GET /api/production/overview
 * Sample Req:
 *  - query/body 없음
 * Sample Res:
 * {
 *   "updated_at": "2026-04-06 14:23",
 *   "refresh_interval_minutes": 5,
 *   "summary_stats": [
 *     { "key": "danger_count", "label": "품절 위험", "value": "1개", "tone": "danger" },
 *     { "key": "warning_count", "label": "주의 필요", "value": "2개", "tone": "primary" },
 *     { "key": "safe_count", "label": "안전 재고", "value": "2개", "tone": "success" },
 *     { "key": "chance_loss_saving_total", "label": "찬스 로스 절감", "value": "23%", "tone": "default" }
 *   ],
 *   "alerts": [
 *     {
 *       "id": "alert-choco-risk",
 *       "type": "inventory_risk",
 *       "severity": "high",
 *       "title": "긴급: 초코 도넛 재고 소진 1시간 전",
 *       "description": "현재 12개, 1시간 후 2개 예상. 지금 생산하면 찬스 로스 18% 감소 가능",
 *       "sku_id": "choco"
 *     }
 *   ]
 * }
 */
export const getProductionOverview = async (
) => {
  if (USE_PRODUCTION_MOCK) {
    return productionOverviewMock as ProductionOverviewResponse;
  }
  const response = await axiosInstance.get<ProductionOverviewResponse>(
    "/api/production/overview",
  );
  return response.data;
};

/**
 * API: GET /api/production/items
 * Sample Req:
 *  - query: ?page=1&page_size=20&store_id=gangnam
 * Sample Res:
 * {
 *   "items": [
 *     {
 *       "sku_id": "choco",
 *       "sku_name": "초코 도넛",
 *       "current_stock": 12,
 *       "forecast_stock_1h": 2,
 *       "avg_first_production_qty_4w": 48,
 *       "avg_first_production_time_4w": "08:30",
 *       "avg_second_production_qty_4w": 24,
 *       "avg_second_production_time_4w": "13:00",
 *       "status": "danger",
 *       "chance_loss_saving_pct": 18,
 *       "chance_loss_basis_text": "1시간 후 재고 예측 및 4주 평균 손실률 기준",
 *       "tags": ["속도↑", "재료"],
 *       "alert_message": "1시간 내 품절 가능성이 높아 즉시 생산이 필요합니다.",
 *       "can_produce": true,
 *       "recommended_production_qty": 48
 *     }
 *   ],
 *   "pagination": {
 *     "page": 1,
 *     "page_size": 20,
 *     "total_items": 5,
 *     "total_pages": 1
 *   }
 * }
 */
export const getProductionSkuList = async (params: ProductionSkuListParams) => {
  if (USE_PRODUCTION_MOCK) {
    const page = params.page ?? 1;
    const pageSize = params.page_size ?? productionSkuListMock.pagination.page_size;
    const allItems = productionSkuListMock.items;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pagedItems = allItems.slice(start, end);
    const totalItems = allItems.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    return {
      items: pagedItems,
      pagination: {
        page,
        page_size: pageSize,
        total_items: totalItems,
        total_pages: totalPages,
      },
    } as ProductionSkuListResponse;
  }
  const response = await axiosInstance.get<ProductionSkuListResponse>(
    "/api/production/items",
    { params },
  );
  return response.data;
};

/**
 * API: GET /api/production/items/{skuId}?store_id={storeId}
 * Sample Req:
 *  - path: skuId=choco
 *  - query: store_id=gangnam
 * Sample Res:
 * {
 *   "sku_id": "choco",
 *   "sku_name": "초코 도넛",
 *   "current_stock": 12,
 *   "forecast_stock_1h": 2,
 *   "recommended_qty": 48,
 *   "chance_loss_saving_pct": 18,
 *   "chance_loss_basis_text": "산출 기준: 1시간 후 재고 소진 예측률 및 4주 평균 판매 기회 손실률 비교",
 *   "predicted_stockout_time": "15:20",
 *   "can_produce": true,
 *   "sales_velocity": 1.3,
 *   "tags": ["속도↑", "재료"],
 *   "alert_message": "1시간 내 품절 가능성이 높아 즉시 생산이 필요합니다.",
 *   "material_alert": true,
 *   "material_alert_message": "재료 부족 경고가 있습니다. 생산 등록 전에 재료 주문 상태를 함께 확인하세요."
 * }
 */
export const getProductionSkuDetail = async (skuId: string, storeId: string) => {
  if (USE_PRODUCTION_MOCK) {
    const found = productionRegistrationFormMock.find((item) => item.sku_id === skuId);
    if (found) {
      return found as ProductionSkuDetailResponse;
    }
    void storeId;
    return productionRegistrationFormMock[0] as ProductionSkuDetailResponse;
  }
  const response = await axiosInstance.get<ProductionSkuDetailResponse>(
    `/api/production/items/${skuId}`,
    { params: { store_id: storeId } },
  );
  return response.data;
};

/**
 * API: POST /api/production/registrations
 * Sample Req:
 * {
 *   "sku_id": "choco",
 *   "qty": 48,
 *   "store_id": "gangnam"
 * }
 * Sample Res:
 * {
 *   "sku_id": "choco",
 *   "qty": 48,
 *   "registered_by": "store_owner",
 *   "feedback_type": "chance_loss_reduced",
 *   "feedback_message": "재고 소진 전에 등록되어 찬스 로스 감소 효과를 기록했습니다.",
 *   "store_id": "gangnam"
 * }
 */
export const postProductionRegistration = async (
  payload: ProductionRegistrationPayload,
) => {
  if (USE_PRODUCTION_MOCK) {
    return {
      sku_id: payload.sku_id,
      qty: payload.qty,
      registered_by: payload.registered_by ?? "store_owner",
      feedback_type: "chance_loss_reduced",
      feedback_message: "재고 소진 전에 등록되어 찬스 로스 감소 효과를 기록했습니다.",
      store_id: payload.store_id,
    };
  }
  const response = await axiosInstance.post<ProductionRegistrationResponse>(
    "/api/production/registrations",
    payload,
  );
  return response.data;
};
