import type { DashboardOverviewResponse } from "@/features/dashboard/type/dashboard";

export const dashboardOverviewMock: DashboardOverviewResponse = {
  updated_at: "2026-04-06 14:23",
  priority_actions: [
    {
      id: "production-choco-urgent",
      type: "production",
      urgency: "urgent",
      badge_label: "긴급 · 재고 소진 1시간 전",
      title: "초코 도넛 생산 필요",
      description: "현재 12개 → 1시간 후 2개 예상 · 지금 생산 시 찬스 로스 18% 감소",
      cta_label: "생산관리 상세보기",
      cta_path: "/production",
      focus_section: "risk-skus",
      related_sku_id: "choco-donut",
    },
    {
      id: "ordering-deadline-important",
      type: "ordering",
      urgency: "important",
      badge_label: "중요 · 주문 마감 임박",
      title: "주문 마감 17분 남음",
      description: "오늘 주문 미완료 · AI 추천 3안 검토 후 점주가 직접 확정",
      cta_label: "주문 검토하기",
      cta_path: "/ordering",
      focus_section: "deadline",
    },
    {
      id: "sales-profit-recommended",
      type: "sales",
      urgency: "recommended",
      badge_label: "권장 · 손익 확인",
      title: "오늘 손익 확인 권장",
      description: "어제 대비 매출 15% 증가 · 손익분기점 초과 달성",
      cta_label: "손익분석 상세보기",
      cta_path: "/sales",
      focus_section: "profit-summary",
    },
  ],
  stats: [
    { key: "production_risk_count", label: "품절 위험 SKU", value: "3개", tone: "danger" },
    { key: "ordering_deadline_minutes", label: "주문 마감까지", value: "17분", tone: "primary" },
    { key: "today_profit_estimate", label: "오늘 순이익 추정", value: "+342,000원", tone: "success" },
    { key: "alert_count", label: "알림 상태", value: "긴급 2건", tone: "default" },
  ],
};
