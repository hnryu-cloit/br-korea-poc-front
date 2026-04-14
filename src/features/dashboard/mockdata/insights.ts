import type { DashboardInsightsResponse } from "@/features/dashboard/types/dashboard";

export const dashboardInsightsMock: DashboardInsightsResponse = {
  insights: [
    {
      id: "weekend-demand",
      description: "주말 매출이 평일 대비 40% 높습니다. 주말 생산량 선반영이 필요합니다.",
    },
    {
      id: "top-margin-item",
      description: "초코 도넛 순이익률 18.9%로 최고 수익 품목입니다.",
    },
    {
      id: "matcha-margin",
      description: "말차 도넛 원가율 개선 필요. 현재 순이익률 17.9%입니다.",
    },
  ],
};
