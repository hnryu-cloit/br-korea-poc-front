import type { ReactNode } from "react";
import type {
  DashboardDomain,
  DashboardOrderDeadline,
  DashboardOrderingDeadlineItem,
  DashboardProductionSummaryItem,
  DashboardSalesOverview,
  DashboardSalesTrendPoint,
} from "@/features/dashboard/types/dashboard";

export interface SummaryCardSectionProps {
  title: string;
  captionKey?: string;
  action?: ReactNode;
  children: ReactNode;
}

export interface SummaryCardProps {
  icon: ReactNode;
  title: string;
  captionKey?: string;
  pathname: string;
  domain: DashboardDomain;
  recommendedQuestions: string[];
  children: ReactNode;
}

export interface SummaryCardListItemProps {
  title: string;
  value: string;
  description: string;
}

export interface DashboardAlertCardProps {
  children: ReactNode;
  actionLabel: string;
  actionPath: string;
}

export interface OrderDeadlineDisplay extends DashboardOrderDeadline {
  currentTimeLabel: string;
  deadlineTimeLabel: string;
  remainingTimeLabel: string;
}

export interface OrderingSummarySuggestionDisplay {
  title: string;
  detailPrefix: string;
  detailSuffix: string;
  ctaPath: string;
}

export type SalesSummaryTrendKey = "currentHour" | "today" | "monthly";

export interface SalesSummaryTrendPanel {
  key: SalesSummaryTrendKey;
  name: string;
  sales: number;
  previousSales: number;
  comparisonLabel: string;
  chartLabel: string;
  chartData: DashboardSalesTrendPoint[];
}

export type SummaryCardProductionItem = DashboardProductionSummaryItem;
export type SummaryCardOrderingDeadlineItem = DashboardOrderingDeadlineItem;
export type SummaryCardSalesOverview = DashboardSalesOverview;
