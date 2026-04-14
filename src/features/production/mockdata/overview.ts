import type { GetProductionOverviewResponse } from "@/features/production/types/production";

export const productionOverviewMock: GetProductionOverviewResponse = {
  updated_at: "2026-04-06 14:23",
  refresh_interval_minutes: 5,
  summary_stats: [
    { key: "danger_count", label: "품절 위험", value: "1개", tone: "danger" },
    { key: "warning_count", label: "주의 필요", value: "2개", tone: "primary" },
    { key: "safe_count", label: "안전 재고", value: "2개", tone: "success" },
    { key: "chance_loss_saving_total", label: "찬스 로스 절감", value: "23%", tone: "default" },
  ],
  alerts: [
    {
      id: "alert-choco-risk",
      type: "inventory_risk",
      severity: "high",
      title: "긴급: 초코 도넛 재고 소진 1시간 전",
      description: "현재 12개, 1시간 후 2개 예상. 지금 생산하면 찬스 로스 18% 감소 가능",
      sku_id: "choco",
    },
    {
      id: "alert-matcha-speed",
      type: "speed_risk",
      severity: "medium",
      title: "오늘 말차 도넛 소진 속도가 평소보다 빠릅니다",
      description: "평소 대비 30% 빠른 판매 속도 감지. 추가 생산 검토를 권장합니다.",
      sku_id: "matcha",
    },
    {
      id: "alert-material",
      type: "material_risk",
      severity: "medium",
      title: "초콜릿 재료 소진 1시간 전",
      description: "초코 도넛 생산 제한이 예상됩니다. 재료 주문 상태를 함께 확인하세요.",
      ingredient_id: "chocolate",
    },
  ],
};
