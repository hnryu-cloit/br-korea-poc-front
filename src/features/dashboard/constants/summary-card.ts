import orderIcon from "@/assets/order.svg";
import productionIcon from "@/assets/production.svg";
import saleIcon from "@/assets/sale.svg";
import type { DashboardDomain } from "@/features/dashboard/types/dashboard";
import type {
  OrderingSummaryDeadlineItem,
  ProductionSummaryItem,
  SalesSummaryItem,
} from "@/features/dashboard/types/summary-card";

export const SUMMARY_CARD_ICON_MAP: Record<DashboardDomain, string> = {
  production: productionIcon,
  ordering: orderIcon,
  sales: saleIcon,
};

export const PRODUCTION_SUMMARY_ITEMS: ProductionSummaryItem[] = [
  { name: "바닐라 글레이즈드 도넛", count: 5, forecast: 40 },
  { name: "페잉머스 글레이즈드 도넛", count: 12, forecast: 40 },
  { name: "메이플 베이컨 도넛", count: 33, forecast: 40 },
  { name: "선수 우유 크림 도넛", count: 2, forecast: 40 },
  { name: "초코파우더(길라델리)", count: 32, forecast: 40 },
];

export const ORDERING_SUMMARY_DEADLINE_ITEMS: OrderingSummaryDeadlineItem[] = [
  { name: "도넛용 나무 포크", deadline: "23:10", remainingText: "주문 마감 27분 전" },
  {
    name: "6개입 도넛 종이 박스 (하프더즌)",
    deadline: "23:00",
    remainingText: "주문 마감 17분 전",
  },
  {
    name: "아이스 음료용 친환경 빨대",
    deadline: "23:50",
    remainingText: "주문 마감 1시간 7분 전",
  },
];

export const SALES_SUMMARY_ITEMS: SalesSummaryItem[] = [
  { name: "이번달 매출", sales: 1000000, previousSales: 600000, comparisonLabel: "지난달" },
  { name: "오늘 매출", sales: 1000000, previousSales: 500000, comparisonLabel: "지난달 요일" },
  {
    name: "현재 시간대 매출",
    sales: 1000000,
    previousSales: 300000,
    comparisonLabel: "지난달 이 시간대",
  },
];
