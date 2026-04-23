import type {
  DashboardOrderingDeadlineItem,
  DashboardOrderingSummaryCard,
  DashboardSalesOverview,
} from "@/features/dashboard/types/dashboard";
import type {
  OrderingSummarySuggestionDisplay,
  SalesSummaryDisplayItem,
} from "@/features/dashboard/types/summary-card";

export function buildOrderingSummarySuggestion(
  card: DashboardOrderingSummaryCard,
): OrderingSummarySuggestionDisplay {
  return {
    title: "AI 발주 제안",
    detailPrefix: card.ai_order_basis,
    detailSuffix: "에 주문했던대로 추천해요.",
    ctaPath: card.ai_order_cta_path,
  };
}

export function buildOrderingDeadlineDescription(
  item: DashboardOrderingDeadlineItem,
  now = new Date(),
): string {
  const [hourText, minuteText] = item.deadline_time.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return "";
  }

  const deadline = new Date(now);
  deadline.setHours(hour, minute, 0, 0);

  const diffMinutes = Math.max(Math.ceil((deadline.getTime() - now.getTime()) / 60_000), 0);
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  if (diffMinutes === 0) return "주문 마감 시간이 지났습니다.";
  if (hours === 0) return `주문 마감 ${minutes}분 전`;
  if (minutes === 0) return `주문 마감 ${hours}시간 전`;
  return `주문 마감 ${hours}시간 ${minutes}분 전`;
}

export function buildSalesSummaryItems(
  salesOverview: DashboardSalesOverview,
): SalesSummaryDisplayItem[] {
  return [
    {
      name: "이번달 매출",
      sales: salesOverview.monthly_sales,
      previousSales: salesOverview.last_month_sales,
      comparisonLabel: "지난달",
    },
    {
      name: "오늘 매출",
      sales: salesOverview.today_sales,
      previousSales: salesOverview.last_month_same_weekday_avg_sales,
      comparisonLabel: "지난달 같은 요일 평균",
    },
    {
      name: "현재 시간대 매출",
      sales: salesOverview.current_hour_sales,
      previousSales: salesOverview.last_month_same_hour_avg_sales,
      comparisonLabel: "지난달 같은 시간 평균",
    },
  ];
}
