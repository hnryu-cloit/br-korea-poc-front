import type { ReactNode } from "react";

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

export interface ProductionSummaryItem {
  name: string;
  count: number;
  forecast: number;
}

export interface OrderingSummaryDeadlineItem {
  name: string;
  deadline: string;
  remainingText: string;
}

export interface SalesSummaryItem {
  name: string;
  sales: number;
  previousSales: number;
  comparisonLabel: string;
}
