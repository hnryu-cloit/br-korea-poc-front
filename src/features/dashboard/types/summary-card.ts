import type { ReactNode } from "react";
import type {
  DashboardOrderDeadline,
  DashboardOrderingDeadlineItem,
  DashboardProductionSummaryItem,
  DashboardSalesOverview,
} from "@/features/dashboard/types/dashboard";

export interface SummaryCardProps {
  icon: ReactNode;
  title: string;
  pathname: string;
  recommendedQuestions: string[];
  children: ReactNode;
}

export interface SummaryCardSectionProps {
  title: string;
  action?: ReactNode;
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

export interface SalesSummaryDisplayItem {
  name: string;
  sales: number;
  previousSales: number;
  comparisonLabel: string;
}

export type SummaryCardProductionItem = DashboardProductionSummaryItem;
export type SummaryCardOrderingDeadlineItem = DashboardOrderingDeadlineItem;
export type SummaryCardSalesOverview = DashboardSalesOverview;
